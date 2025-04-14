// components/dashboard/Dashboard.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from './../DashboardHeader';
import StatCard from './../StatCard';
import CoursesOverview from './../CoursesOverview';
import TrainingOverview from './../TrainingOverview';
import SuccessionPlanning from './../SuccessionPlanning';
import CompletionChart from './../CompletionChart';
import AssignmentStatusChart from './../AssignmentStatusChart';
import UpcomingAssignments from './../UpcomingAssignment';
import LoadingSpinner from '../Loading';
import ErrorAlert from './../ErrorAlert';
import useAdminDashbaoardStore from '../../stores/AdminStores/useAdminDashboardStore';

const Dashboard = () => {
  const navigate = useNavigate();
  const { 
    dashboardStats, 
    isLoadingStats, 
    statsError, 
    fetchDashboardStats,
    fetchCourseAnalytics,
    fetchSuccessionAnalytics
  } = useAdminDashbaoardStore();

  useEffect(() => {
    fetchDashboardStats();
    fetchCourseAnalytics();
    fetchSuccessionAnalytics();
  }, []);

  if (isLoadingStats) {
    return (
      <div className="flex h-full items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (statsError) {
    return <ErrorAlert message={statsError} />;
  }

  if (!dashboardStats) {
    return null;
  }

  const { 
    courseStats, 
    trainingStats, 
    successionStats, 
    chartData 
  } = dashboardStats;

  return (
    <div className="px-6 py-8 border rounded-lg bg-gray-50">
      <DashboardHeader />
      
      {/* Stats Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Total Courses" 
          value={courseStats.totalCourses} 
          icon="book" 
          trend="up"
          color="blue"
          onClick={() => navigate('/all-courses')}
        />
        <StatCard 
          title="Training Assignments" 
          value={trainingStats.totalAssignments} 
          icon="clipboard-list" 
          trend="up"
          color="green"
          onClick={() => navigate('/trainingCourse-list')}
        />
        <StatCard 
          title="Succession Plans" 
          value={successionStats.totalSuccessionPlans} 
          icon="users" 
          trend="neutral"
          color="purple"
          onClick={() => navigate('/succession-plans')}
        />
      </div>
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Completions</h3>
          <CompletionChart data={chartData.monthlyCompletions} />
        </div>
        <div className="bg-white rounded-lg shadow p-6 border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Assignment Status</h3>
          <AssignmentStatusChart data={trainingStats.assignmentStatus} />
        </div>
      </div>
      
      {/* Additional Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CoursesOverview 
          totalCourses={courseStats.totalCourses}
          totalLessons={courseStats.totalLessons}
          totalQuizzes={courseStats.totalQuizzes}
          recentCourses={dashboardStats.recentCourses}
        />
        
        <TrainingOverview 
          totalTrainingCourses={trainingStats.totalTrainingCourses}
          assignmentStatus={trainingStats.assignmentStatus}
        />
        
        <SuccessionPlanning 
          totalPlans={successionStats.totalSuccessionPlans}
          criticalRiskPositions={successionStats.criticalRiskPositions}
          highRiskPositions={successionStats.highRiskPositions}
        />
      </div>
      
      {/* Upcoming Due Assignments */}
      <div className="mt-8 bg-white rounded-lg shadow border">
        <UpcomingAssignments assignments={dashboardStats.upcomingDueAssignments} />
      </div>
    </div>
  );
};

export default Dashboard;