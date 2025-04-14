// controllers/dashboardController.js
import AllCourses from "../../models/AdminModels/allCourses.model.js";
import Lesson from "../../models/AdminModels/lesson.model.js";
import Quiz from "../../models/AdminModels/quiz.model.js";
import SuccessionPlan from "../../models/AdminModels/successionPlan.model.js";
import TrainingAssignment from "../../models/AdminModels/trainingAssignment.model.js";
import TrainingCourse from "../../models/AdminModels/trainingCourse.model.js";

export const getDashboardStats = async (req, res) => {
  try {
    // Get course statistics
    const totalCourses = await AllCourses.countDocuments();
    const totalLessons = await Lesson.countDocuments();
    const totalQuizzes = await Quiz.countDocuments();
    
    // Get training statistics
    const totalTrainingCourses = await TrainingCourse.countDocuments();
    const totalAssignments = await TrainingAssignment.countDocuments();
    
    // Get assignment status counts
    const pendingAssignments = await TrainingAssignment.countDocuments({ status: 'pending' });
    const inProgressAssignments = await TrainingAssignment.countDocuments({ status: 'in-progress' });
    const completedAssignments = await TrainingAssignment.countDocuments({ status: 'completed' });
    const expiredAssignments = await TrainingAssignment.countDocuments({ status: 'expired' });
    
    // Get succession planning stats
    const totalSuccessionPlans = await SuccessionPlan.countDocuments();
    const criticalRiskPositions = await SuccessionPlan.countDocuments({ riskFactor: 'Critical' });
    const highRiskPositions = await SuccessionPlan.countDocuments({ riskFactor: 'High' });
    
    // Get recent courses
    const recentCourses = await AllCourses.find()
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Get upcoming due assignments
    const upcomingDueAssignments = await TrainingAssignment.find({
      status: { $in: ['pending', 'in-progress'] },
      dueDate: { $gte: new Date(), $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
    })
    .populate('user', 'name email')
    .populate('course', 'title')
    .limit(10);
    
    // Get monthly training completion data (for charts)
    const currentDate = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(currentDate.getMonth() - 6);
    
    const monthlyCompletions = await TrainingAssignment.aggregate([
      {
        $match: {
          completionDate: { $gte: sixMonthsAgo, $lte: currentDate },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: { 
            year: { $year: "$completionDate" }, 
            month: { $month: "$completionDate" } 
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);
    
    // Format monthly data for charts
    const formattedMonthlyData = monthlyCompletions.map(item => {
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return {
        month: monthNames[item._id.month - 1],
        year: item._id.year,
        count: item.count
      };
    });
    
    // Prepare and send response
    res.status(200).json({
      success: true,
      data: {
        courseStats: {
          totalCourses,
          totalLessons,
          totalQuizzes
        },
        trainingStats: {
          totalTrainingCourses,
          totalAssignments,
          assignmentStatus: {
            pending: pendingAssignments,
            inProgress: inProgressAssignments,
            completed: completedAssignments,
            expired: expiredAssignments
          }
        },
        successionStats: {
          totalSuccessionPlans,
          criticalRiskPositions,
          highRiskPositions
        },
        recentCourses,
        upcomingDueAssignments,
        chartData: {
          monthlyCompletions: formattedMonthlyData
        }
      }
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
      error: error.message
    });
  }
};

export const getCourseAnalytics = async (req, res) => {
  try {
    // Get course completion rates
    const allTrainingCourses = await TrainingCourse.find();
    
    const courseAnalytics = await Promise.all(
      allTrainingCourses.map(async (course) => {
        const totalAssignments = await TrainingAssignment.countDocuments({ course: course._id });
        const completedAssignments = await TrainingAssignment.countDocuments({ 
          course: course._id,
          status: 'completed'
        });
        
        return {
          courseId: course._id,
          title: course.title,
          totalAssignments,
          completedAssignments,
          completionRate: totalAssignments > 0 ? (completedAssignments / totalAssignments) * 100 : 0
        };
      })
    );
    
    res.status(200).json({
      success: true,
      data: courseAnalytics
    });
  } catch (error) {
    console.error("Course analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch course analytics",
      error: error.message
    });
  }
};

export const getSuccessionPlanningAnalytics = async (req, res) => {
  try {
    // Get departments with succession plans
    const departmentStats = await SuccessionPlan.aggregate([
      {
        $group: {
          _id: "$department",
          count: { $sum: 1 },
          highRiskCount: { 
            $sum: { 
              $cond: [{ $in: ["$riskFactor", ["High", "Critical"]] }, 1, 0] 
            }
          }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    // Get readiness distribution
    const readinessDistribution = await SuccessionPlan.aggregate([
      { $unwind: "$successors" },
      {
        $group: {
          _id: "$successors.readiness",
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        departmentStats,
        readinessDistribution
      }
    });
  } catch (error) {
    console.error("Succession planning analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch succession planning analytics",
      error: error.message
    });
  }
};