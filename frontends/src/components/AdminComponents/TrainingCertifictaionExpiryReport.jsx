import React, { useEffect, useState } from 'react';
import useTrainingAssignmentStore from '../../stores/AdminStores/useTrainingAssignmentStore';
import useAuthStore from '../../stores/useAuthStore';

const TrainingCertificationExpiryReport = () => {
    const { expiryReport = [], loading, error, fetchExpiryReport } = useTrainingAssignmentStore();
    const [timeframe, setTimeframe] = useState('30'); // Default 30 days
    const [filterDepartment, setFilterDepartment] = useState('');
    const { users, fetchUsers } = useAuthStore();
    
    useEffect(() => {
      fetchExpiryReport();
      // Fetch users if not already loaded
      if (!users || users.length === 0) {
        fetchUsers();
      }
    }, [fetchExpiryReport, fetchUsers, users]);
    
    // Extract unique departments from the users store instead of the report
    const departments = users && users.length > 0 
      ? Array.from(new Set(users.map(user => user.department).filter(Boolean)))
      : [];
    
    // Filter report based on timeframe and department - safely handle empty data
    const filteredReport = expiryReport && expiryReport.length > 0
      ? expiryReport
          .map(cert => ({
            ...cert,
            users: cert.users ? cert.users.filter(user => {
              const matchesDepartment = filterDepartment === '' || user.department === filterDepartment;
              const matchesTimeframe = user.daysRemaining <= Number(timeframe);
              return matchesDepartment && matchesTimeframe;
            }) : []
          }))
          .filter(cert => cert.users && cert.users.length > 0)
      : [];
  
  const getExpiryClass = (days) => {
    if (days <= 7) return 'text-red-600 font-semibold';
    if (days <= 30) return 'text-yellow-600';
    return 'text-gray-600';
  };
  
  
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  
  // Safely calculate expiry counts
  const calculateExpiryCount = (maxDays, minDays = -Infinity) => {
    if (!expiryReport || !expiryReport.length) return 0;
    
    return expiryReport.reduce((count, cert) => {
      if (!cert.users) return count;
      
      return count + cert.users.filter(user => 
        user.daysRemaining <= maxDays && 
        user.daysRemaining > minDays &&
        (filterDepartment === '' || user.department === filterDepartment)
      ).length;
    }, 0);
  };
  
  return (
    <>
      <nav class="flex px-5 py-3 text-gray-700 border border-gray-200 rounded-lg bg-gray-50 " aria-label="Breadcrumb">
        <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
            <li class="inline-flex items-center">
            <a href="/admin-dashboard" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 ">
                <svg class="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                </svg>
                Home
            </a>
            </li>
            <li aria-current="page">
            <div class="flex items-center">
                <svg class="rtl:rotate-180  w-3 h-3 mx-1 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                </svg>
                <span class="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">Certification Expiry Reports</span>
            </div>
            </li>
        </ol>
    </nav>

    <div className="border mt-5 rounded-lg bg-gray-50 shadow-sm">
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Certification Expiry Report</h1>
      
       {/* Filters */}
       <div className="mb-6 flex flex-col md:flex-row md:items-center md:space-x-4">
        <div className="mb-4 md:mb-0 md:w-64">
          <select
            className="w-full p-2 border rounded"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option value="7">Next 7 Days</option>
            <option value="30">Next 30 Days</option>
            <option value="90">Next 90 Days</option>
            <option value="365">Next Year</option>
          </select>
        </div>
        
        <div className="md:w-64">
          <select
            className="w-full p-2 border rounded"
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.sort().map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-red-100 p-6 rounded-lg shadow">
          <h3 className="font-semibold text-red-800 mb-2">Expiring in 7 Days</h3>
          <p className="text-3xl font-bold">
            {calculateExpiryCount(7)}
          </p>
        </div>
        
        <div className="bg-yellow-100 p-6 rounded-lg shadow">
          <h3 className="font-semibold text-yellow-800 mb-2">Expiring in 30 Days</h3>
          <p className="text-3xl font-bold">
            {calculateExpiryCount(30, 7)}
          </p>
        </div>
        
        <div className="bg-blue-100 p-6 rounded-lg shadow">
          <h3 className="font-semibold text-blue-800 mb-2">Already Expired</h3>
          <p className="text-3xl font-bold">
            {calculateExpiryCount(0)}
          </p>
        </div>
      </div>
      
      {/* Certification Expiry Table */}
      {filteredReport.length > 0 ? (
        <div>
          {filteredReport.map(cert => (
            <div key={cert.courseId} className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                {cert.courseTitle} <span className="text-sm text-gray-500">({cert.courseType})</span>
              </h2>
              
              <div className="overflow-x-auto mt-4 border shadow-sm rounded">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Remaining</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {cert.users.sort((a, b) => a.daysRemaining - b.daysRemaining).map((user, index) => (
                      <tr key={index}>
                        <td className="py-3 px-4">{user.name}</td>
                        <td className="py-3 px-4">{user.department}</td>
                        <td className="py-3 px-4">
                          {new Date(user.expiryDate).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className={getExpiryClass(user.daysRemaining)}>
                            {user.daysRemaining <= 0 ? 
                              'Expired' : 
                              `${user.daysRemaining} days`}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded">
          No certifications expiring in the selected timeframe.
        </div>
      )}
    </div>
    </div>
    </>
  );
};

export default TrainingCertificationExpiryReport;