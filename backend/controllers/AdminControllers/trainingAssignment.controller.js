import TrainingAssignment from '../../models/AdminModels/trainingAssignment.model.js';
import TrainingCourse from '../../models/AdminModels/trainingCourse.model.js';

export const getAllAssignments = async (req, res) => {
  try {
    const assignments = await TrainingAssignment.find()
      .populate('user', 'name email department')
      .populate('course', 'title type');
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAssignmentById = async (req, res) => {
  try {
    const assignment = await TrainingAssignment.findById(req.params.id)
      .populate('user', 'name email department')
      .populate('course', 'title type content duration');
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    res.json(assignment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createAssignment = async (req, res) => {
  try {
    const course = await TrainingCourse.findById(req.body.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    
    // Calculate certification expiry if course is completed
    let certificationExpiry = null;
    if (req.body.status === 'completed' && req.body.completionDate && course.expiryPeriod) {
      const completionDate = new Date(req.body.completionDate);
      certificationExpiry = new Date(completionDate);
      certificationExpiry.setMonth(certificationExpiry.getMonth() + course.expiryPeriod);
    }
    
    const assignment = new TrainingAssignment({
      user: req.body.userId,
      course: req.body.courseId,
      dueDate: req.body.dueDate,
      completionDate: req.body.completionDate || null,
      status: req.body.status || 'pending',
      certificationExpiry: certificationExpiry
    });

    const newAssignment = await assignment.save();
    
    const populatedAssignment = await TrainingAssignment.findById(newAssignment._id)
      .populate('user', 'name email department')
      .populate('course', 'title type');
      
    res.status(201).json(populatedAssignment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateAssignment = async (req, res) => {
  try {
    const assignment = await TrainingAssignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    
    // Update certification expiry if status is changing to completed
    if (req.body.status === 'completed' && assignment.status !== 'completed') {
      const course = await TrainingCourse.findById(assignment.course);
      const completionDate = req.body.completionDate ? new Date(req.body.completionDate) : new Date();
      
      if (course && course.expiryPeriod) {
        const certificationExpiry = new Date(completionDate);
        certificationExpiry.setMonth(certificationExpiry.getMonth() + course.expiryPeriod);
        assignment.certificationExpiry = certificationExpiry;
      }
      
      assignment.completionDate = completionDate;
    }
    
    if (req.body.dueDate) assignment.dueDate = req.body.dueDate;
    if (req.body.status) assignment.status = req.body.status;
    
    const updatedAssignment = await assignment.save();
    
    const populatedAssignment = await TrainingAssignment.findById(updatedAssignment._id)
      .populate('user', 'name email department')
      .populate('course', 'title type');
      
    res.json(populatedAssignment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteAssignment = async (req, res) => {
  try {
    const assignment = await TrainingAssignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    
    await assignment.remove();
    res.json({ message: 'Assignment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all assignments for a specific user
export const getUserAssignments = async (req, res) => {
  try {
    const assignments = await TrainingAssignment.find({ user: req.params.userId })
      .populate('course', 'title type duration');
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get compliance report (who's on track, who's behind)
export const getComplianceReport = async (req, res) => {
  try {
    const today = new Date();
    
    // Find all assignments
    const assignments = await TrainingAssignment.find()
      .populate('user', 'name email department')
      .populate('course', 'title');
      
    // Group by user and calculate compliance
    const userMap = {};
    
    assignments.forEach(assignment => {
      const userId = assignment.user._id.toString();
      
      if (!userMap[userId]) {
        userMap[userId] = {
          user: assignment.user,
          totalAssignments: 0,
          completed: 0,
          pending: 0,
          overdue: 0,
          expiringCertifications: []
        };
      }
      
      userMap[userId].totalAssignments++;
      
      if (assignment.status === 'completed') {
        userMap[userId].completed++;
        
        // Check if certification is expiring soon (within 30 days)
        if (assignment.certificationExpiry) {
          const daysUntilExpiry = Math.ceil((assignment.certificationExpiry - today) / (1000 * 60 * 60 * 24));
          
          if (daysUntilExpiry > 0 && daysUntilExpiry <= 30) {
            userMap[userId].expiringCertifications.push({
              course: assignment.course.title,
              expiryDate: assignment.certificationExpiry,
              daysRemaining: daysUntilExpiry
            });
          }
        }
      } else {
        if (new Date(assignment.dueDate) < today) {
          userMap[userId].overdue++;
        } else {
          userMap[userId].pending++;
        }
      }
    });
    
    // Convert to array and calculate compliance percentage
    const report = Object.values(userMap).map(userData => {
      return {
        ...userData,
        compliancePercentage: userData.totalAssignments > 0 
          ? Math.round((userData.completed / userData.totalAssignments) * 100) 
          : 100
      };
    });
    
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get training gaps report by department
export const getTrainingGapsReport = async (req, res) => {
  try {
    const assignments = await TrainingAssignment.find()
      .populate('user', 'name email department')
      .populate('course', 'title');
      
    // Group by department and course
    const departmentCourseMap = {};
    
    assignments.forEach(assignment => {
      const department = assignment.user.department;
      const courseId = assignment.course._id.toString();
      const courseTitle = assignment.course.title;
      
      if (!departmentCourseMap[department]) {
        departmentCourseMap[department] = {};
      }
      
      if (!departmentCourseMap[department][courseId]) {
        departmentCourseMap[department][courseId] = {
          courseTitle,
          totalAssigned: 0,
          completed: 0
        };
      }
      
      departmentCourseMap[department][courseId].totalAssigned++;
      
      if (assignment.status === 'completed') {
        departmentCourseMap[department][courseId].completed++;
      }
    });
    
    // Convert to structured report
    const report = Object.entries(departmentCourseMap).map(([department, courses]) => {
      return {
        department,
        courses: Object.values(courses).map(course => {
          return {
            ...course,
            completionPercentage: course.totalAssigned > 0 
              ? Math.round((course.completed / course.totalAssigned) * 100) 
              : 0,
            gap: course.totalAssigned - course.completed
          };
        })
      };
    });
    
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCertificationExpiryReport = async (req, res) => {
    try {
      const today = new Date();
      
      // Find all assignments with completed status and certification expiry date
      const assignments = await TrainingAssignment.find({
        status: 'completed',
        certificationExpiry: { $ne: null }
      })
      .populate('user', 'name email department')
      .populate('course', 'title type');
      
      // Group by course
      const courseMap = {};
      
      assignments.forEach(assignment => {
        const courseId = assignment.course._id.toString();
        
        if (!courseMap[courseId]) {
          courseMap[courseId] = {
            courseId,
            courseTitle: assignment.course.title,
            courseType: assignment.course.type,
            users: []
          };
        }
        
        // Calculate days remaining until expiry
        const daysRemaining = Math.ceil(
          (assignment.certificationExpiry - today) / (1000 * 60 * 60 * 24)
        );
        
        courseMap[courseId].users.push({
          id: assignment.user._id,
          name: assignment.user.name,
          email: assignment.user.email,
          department: assignment.user.department,
          expiryDate: assignment.certificationExpiry,
          daysRemaining
        });
      });
      
      // Convert to array and sort
      const report = Object.values(courseMap);
      
      res.json(report);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };