import React, { useEffect } from 'react';
import './index.css';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import useAuthStore from './stores/useAuthStore';
import LoginPage from './pages/LoginPage';
import { Toaster } from 'react-hot-toast';
import SignUpPage from './pages/SignUpPage';
import AllCourses from './pages/AdminPage/AllCourses';
import Loading from './components/Loading';
import LessonPage from './pages/AdminPage/LessonPage';
import LessonDetailPage from './pages/AdminPage/LessonDetailPage';
import HomePage from './pages/EmployeePage/HomePage';
import CourseListPage from './pages/EmployeePage/CourseListPage';
import CourseDetailPage from './pages/EmployeePage/CourseDetailPage';
import LessonViewPage from './pages/EmployeePage/LessonViewPage';
import QuizViewPage from './pages/EmployeePage/QuizViewPage';
import Notifications from './components/Notifications';
import TrainingCourseListPage from './pages/AdminPage/TrainingCourseListPage';
import TrainingCourseFormPage from './pages/AdminPage/TrainingCourseFormPage';
import TrainingAssignmentListPage from './pages/AdminPage/TrainingAssignmentListPage';
import TrainingAssignmentFormPage from './pages/AdminPage/TrainingAssignmentFormPage';
import TrainingComplianceReportPage from './pages/AdminPage/TrainingComplianceReportPage';
import TrainingGapsReportPage from './pages/AdminPage/TrainingGapsReportPage';
import TrainingCertificationExpiryReportPage from './pages/AdminPage/TrainingCertificationExpiryReportPage';
import TrainingCourseViewPage from './pages/AdminPage/TrainingCourseViewPage';
import TrainingDetailsPage from './pages/EmployeePage/TrainingDetailsPage';
import CertificateViewPage from './pages/EmployeePage/CertificateViewPage';
import SuccessionPlanningPage from './pages/AdminPage/SuccesionPlanningPage';
import SuccessionPlanTablePage from './pages/AdminPage/SuccessionPlanTablePage';
import SuccessionPlanFormPage from './pages/AdminPage/SuccessionPlanFormPage';
import SuccessionPlanDetailPage from './pages/AdminPage/SuccessionPlanDetailPage';
import EmployeeSuccessionPage from './pages/EmployeePage/EmployeeSuccessionPage';
import StaffDashboard from './pages/StaffPage/StaffDashboard';
import EmployeeDetailPage from './pages/StaffPage/EmployeeDetailPage';
import AdminDashboardPage from './pages/AdminPage/AdminDashboardPage';

function App() {
  const { user, checkAuth, checkingAuth } = useAuthStore();
  const location = useLocation(); // Get current route

  useEffect(() => {
    checkAuth();
  }, []);

  const isSuperAdmin = user?.role === "superAdmin";
  const isStaff = user?.role === "staff";

  if (checkingAuth) return <Loading />;

  return (
     <div className="min-h-screen bg-white text-gray-900 relative overflow-hidden">
      <Notifications/>
      <Routes>
        {/* Redirect to login if user is not authenticated */}
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to={isSuperAdmin ? "/admin-dashboard" : isStaff ? "/staff-dashboard" : "/user-dashboard"} />} />
        <Route path="/signup" element={!user ? <SignUpPage /> : <Navigate to={isSuperAdmin ? "/admin-dashboard" : isStaff ? "/staff-dashboard" : "/user-dashboard"} />} />

        <Route path="/admin-dashboard" element={(user?.role === "superAdmin") ? <AdminDashboardPage /> : <Navigate to="/login" />} />


        <Route path="/all-courses" element={(user?.role === "superAdmin") ? <AllCourses /> : <Navigate to="/login" />} />
        <Route path="/admin/courses/:courseId/lessons" element={(user?.role === "superAdmin") ? <LessonPage /> : <Navigate to="/login" />} />
        <Route path="/admin/courses/:courseId/lessons/:lessonId" element={(user?.role === "superAdmin") ? <LessonDetailPage /> : <Navigate to="/login" />} />

        <Route path="/trainingCourse-list" element={(user?.role === "superAdmin") ? <TrainingCourseListPage /> : <Navigate to="/login" />} />
        <Route path="/trainingCourse-form" element={(user?.role === "superAdmin") ? <TrainingCourseFormPage /> : <Navigate to="/login" />} />
        <Route path="/trainingCourse-form/edit/:id" element={(user?.role === "superAdmin") ? <TrainingCourseFormPage /> : <Navigate to="/login" />} />
        <Route path="/trainingCourse-view/:id" element={(user?.role === "superAdmin") ? <TrainingCourseViewPage /> : <Navigate to="/login" />} />

        <Route path="/trainingAssignment-list" element={(user?.role === "superAdmin") ? <TrainingAssignmentListPage /> : <Navigate to="/login" />} />
        <Route path="/trainingAssignment-form" element={(user?.role === "superAdmin") ? <TrainingAssignmentFormPage /> : <Navigate to="/login" />} />
        <Route path="/trainingAssignment-form/edit/:id" element={(user?.role === "superAdmin") ? <TrainingAssignmentFormPage /> : <Navigate to="/login" />} />

        <Route path="/trainingComplianceReport" element={(user?.role === "superAdmin") ? <TrainingComplianceReportPage /> : <Navigate to="/login" />} />
        <Route path="/trainingGapsReport" element={(user?.role === "superAdmin") ? <TrainingGapsReportPage /> : <Navigate to="/login" />} />
        <Route path="/trainingCertificate" element={(user?.role === "superAdmin") ? <TrainingCertificationExpiryReportPage /> : <Navigate to="/login" />} />

        <Route path="/succession" element={(user?.role === "superAdmin") ? <SuccessionPlanningPage /> : <Navigate to="/login" />} />
        <Route path="/succession-plans" element={(user?.role === "superAdmin") ? <SuccessionPlanTablePage /> : <Navigate to="/login" />} />
        <Route path="/succession-plans/new" element={(user?.role === "superAdmin") ? <SuccessionPlanFormPage /> : <Navigate to="/login" />} />
        <Route path="/succession-plans/:id/edit" element={(user?.role === "superAdmin") ? <SuccessionPlanFormPage /> : <Navigate to="/login" />} />
        <Route path="/succession-plans/:id" element={(user?.role === "superAdmin") ? <SuccessionPlanDetailPage /> : <Navigate to="/login" />} />

        <Route path="/staff-dashboard" element={(user?.role === "staff") ? <StaffDashboard /> : <Navigate to="/login" />} />
        <Route path="/employee-detail" element={(user?.role === "staff") ? <EmployeeDetailPage /> : <Navigate to="/login" />} />
        


        <Route path="/user-dashboard" element={user ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/course-list" element={user ? <CourseListPage /> : <Navigate to="/login" />} />
        <Route path="/course/:courseId" element={user ? <CourseDetailPage /> : <Navigate to="/login" />} />
        <Route path="/lesson/:lessonId" element={user ? <LessonViewPage /> : <Navigate to="/login" />} />
        <Route path="/quiz/:lessonId" element={user ? <QuizViewPage /> : <Navigate to="/login" />} />

        <Route path="/employee/training/:id" element={user ? <TrainingDetailsPage /> : <Navigate to="/login" />} />
        <Route path="/employee/certificate/:id" element={user ? <CertificateViewPage /> : <Navigate to="/login" />} />

        <Route path="/my-succession" element={user ? <EmployeeSuccessionPage /> : <Navigate to="/login" />} />
        
      </Routes>

    </div>
  );
}

export default App;
