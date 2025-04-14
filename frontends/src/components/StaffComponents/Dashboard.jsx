import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'react-apexcharts';
import useTrainingAssignmentStore from '../../stores/AdminStores/useTrainingAssignmentStore';
import useTrainingCourseStore from '../../stores/AdminStores/useTrainingCourseStore';
import useAuthStore from '../../stores/useAuthStore';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { 
    fetchComplianceReport, 
    fetchTrainingGaps, 
    fetchExpiryReport,
    complianceReport, 
    trainingGaps, 
    expiryReport,
    loading 
  } = useTrainingAssignmentStore();
  const { fetchCourses, courses } = useTrainingCourseStore();
  const [users, setUsers] = useState([]);
  const { fetchUsers } = useAuthStore();

  // Fetch data on component mount
  useEffect(() => {
    fetchComplianceReport();
    fetchTrainingGaps();
    fetchExpiryReport();
    fetchCourses();
    fetchUsers().then(users => {
      if (users) setUsers(users);
    });
  }, []);

  // Prepare chart data for compliance overview
  const complianceChartData = {
    options: {
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
        },
      },
      xaxis: {
        categories: complianceReport?.map(item => item.user?.name)?.slice(0, 10) || [], // Limit to 10 for visibility
      },
      yaxis: {
        title: {
          text: 'Number of Trainings'
        }
      },
      fill: {
        opacity: 1
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
      },
      colors: ['#10b981', '#f59e0b', '#ef4444'],
      title: {
        text: 'Training Compliance by Employee',
        align: 'center'
      }
    },
    series: [
      {
        name: 'Completed',
        data: complianceReport?.map(item => item.completed)?.slice(0, 10) || []
      },
      {
        name: 'Pending',
        data: complianceReport?.map(item => item.pending)?.slice(0, 10) || []
      },
      {
        name: 'Overdue',
        data: complianceReport?.map(item => item.overdue)?.slice(0, 10) || []
      }
    ]
  };

  // Prepare chart data for training gaps
  const gapChartData = {
    options: {
      chart: {
        type: 'heatmap',
        height: 350
      },
      dataLabels: {
        enabled: false
      },
      colors: ["#008FFB"],
      title: {
        text: 'Training Gap Analysis',
        align: 'center'
      },
      xaxis: {
        categories: trainingGaps?.map(item => item.department) || []
      }
    },
    series: courses?.map(course => ({
      name: course.title,
      data: trainingGaps?.map(dept => {
        // Fix: Add a check to ensure dept.gaps exists before using find()
        const gap = dept.gaps && dept.gaps.find(g => g.courseId === course._id);
        return {
          x: dept.department,
          y: gap ? gap.count : 0
        };
      }) || []
    })) || []
  };

  // Prepare chart data for expiring certifications
  const expiryChartData = {
    options: {
      chart: {
        type: 'line',
        height: 350
      },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      xaxis: {
        categories: ['1 week', '2 weeks', '1 month', '3 months', '6 months'],
      },
      title: {
        text: 'Upcoming Training Expirations',
        align: 'center'
      },
      markers: {
        size: 4
      }
    },
    series: [
      {
        name: 'Expiring Certifications',
        data: [
          expiryReport?.oneWeek || 0,
          expiryReport?.twoWeeks || 0,
          expiryReport?.oneMonth || 0,
          expiryReport?.threeMonths || 0,
          expiryReport?.sixMonths || 0,
        ]
      }
    ]
  };

  // Overall compliance calculation
  const calculateOverallCompliance = () => {
    if (!complianceReport || complianceReport.length === 0) return 0;
    
    let totalCompleted = 0;
    let totalAssigned = 0;
    
    complianceReport.forEach(item => {
      totalCompleted += item.completed;
      totalAssigned += (item.completed + item.pending + item.overdue);
    });
    
    return totalAssigned > 0 ? Math.round((totalCompleted / totalAssigned) * 100) : 0;
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      
      {/* Stats Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border">
          <h3 className="text-gray-500 text-sm font-medium">Overall Compliance</h3>
          <div className="flex items-end mt-2">
            <p className="text-3xl font-bold">{calculateOverallCompliance()}%</p>
            <span className="text-sm text-gray-500 ml-2 mb-1">of trainings complete</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border">
          <h3 className="text-gray-500 text-sm font-medium">Expiring Within 30 Days</h3>
          <div className="flex items-end mt-2">
            <p className="text-3xl font-bold">{expiryReport?.oneMonth || 0}</p>
            <span className="text-sm text-gray-500 ml-2 mb-1">certifications</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border">
          <h3 className="text-gray-500 text-sm font-medium">Overdue Trainings</h3>
          <div className="flex items-end mt-2">
            <p className="text-3xl font-bold">{complianceReport?.reduce((sum, item) => sum + item.overdue, 0) || 0}</p>
            <span className="text-sm text-gray-500 ml-2 mb-1">needs attention</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border">
          <h3 className="text-gray-500 text-sm font-medium">Active Courses</h3>
          <div className="flex items-end mt-2">
            <p className="text-3xl font-bold">{courses?.length || 0}</p>
            <span className="text-sm text-gray-500 ml-2 mb-1">training modules</span>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-8">
        <button 
          onClick={() => navigate('/staff/assignments/new')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Assign Training
        </button>
        <button 
          onClick={() => navigate('/staff/courses')}
          className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
        >
          Manage Courses
        </button>
        <button 
          onClick={() => navigate('/staff/reports')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          View Reports
        </button>
      </div>
      
      {/* Compliance Chart & Urgent Matters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Compliance Chart */}
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2 border">
          <h2 className="text-lg font-semibold mb-4">Employee Compliance Overview</h2>
          {complianceReport && complianceReport.length > 0 ? (
            <Chart 
              options={complianceChartData.options}
              series={complianceChartData.series}
              type="bar"
              height={350}
            />
          ) : (
            <div className="flex justify-center items-center h-64 text-gray-500">
              No compliance data available
            </div>
          )}
        </div>
        
        {/* Urgent Matters */}
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-1 border">
          <h2 className="text-lg font-semibold mb-4">Urgent Attention Required</h2>
          {complianceReport?.some(item => item.overdue > 0) ? (
            <div className="space-y-4">
              {complianceReport
                .filter(item => item.overdue > 0)
                .sort((a, b) => b.overdue - a.overdue)
                .slice(0, 5)
                .map((item, index) => (
                  <div key={index} className="border-l-4 border-red-500 pl-4 py-2">
                    <div className="font-medium">{item.user?.name}</div>
                    <div className="text-sm text-gray-500">
                      <span className="text-red-600 font-medium">{item.overdue}</span> overdue trainings
                    </div>
                    <button 
                      onClick={() => navigate(`/staff/employee/${item.user?._id}`)}
                      className="text-indigo-600 hover:text-indigo-800 text-sm mt-1"
                    >
                      View Details
                    </button>
                  </div>
                ))}
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center h-64 text-gray-500">
              <svg className="w-16 h-16 text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>No urgent issues!</p>
              <p className="text-sm mt-2">All employees are up to date with their training.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Training Gap & Expiry Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Training Gap Analysis */}
        <div className="bg-white rounded-lg shadow p-6 border">
          <h2 className="text-lg font-semibold mb-4">Training Gap Analysis</h2>
          {trainingGaps && trainingGaps.length > 0 ? (
            <Chart 
              options={gapChartData.options}
              series={gapChartData.series}
              type="heatmap"
              height={350}
            />
          ) : (
            <div className="flex justify-center items-center h-64 text-gray-500">
              No training gap data available
            </div>
          )}
        </div>
        
        {/* Expiring Certifications */}
        <div className="bg-white rounded-lg shadow p-6 border">
          <h2 className="text-lg font-semibold mb-4">Upcoming Certification Expirations</h2>
          {expiryReport ? (
            <Chart 
              options={expiryChartData.options}
              series={expiryChartData.series}
              type="line"
              height={350}
            />
          ) : (
            <div className="flex justify-center items-center h-64 text-gray-500">
              No expiration data available
            </div>
          )}
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6 border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Training Activity</h2>
          <button 
            onClick={() => navigate('/employee-detail')}
            className="text-indigo-600 hover:text-indigo-800 text-sm"
          >
            View All
          </button>
        </div>
        {/* Mock data for recent activity - would be replaced with real data */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Mock data rows - would be replaced with real data */}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">John Smith</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Cybersecurity Fundamentals</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    Completed
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  April 10, 2025
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button className="text-indigo-600 hover:text-indigo-900">View</button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Linda Johnson</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">GDPR Training</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    Started
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  April 9, 2025
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button className="text-indigo-600 hover:text-indigo-900">View</button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Michael Chen</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Workplace Safety</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                    Overdue
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  April 8, 2025
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button className="text-indigo-600 hover:text-indigo-900">View</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;