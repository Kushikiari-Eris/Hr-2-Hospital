import React, { useEffect, useState } from 'react';
import useTrainingAssignmentStore from '../../stores/AdminStores/useTrainingAssignmentStore';

const TrainingComplianceReport = () => {
  const { complianceReport, loading, error, fetchComplianceReport } = useTrainingAssignmentStore();
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterCompliance, setFilterCompliance] = useState('');
  
  useEffect(() => {
    fetchComplianceReport();
  }, [fetchComplianceReport]);
  
  // Extract unique departments for filter
  const departments = Array.from(
    new Set(complianceReport.map(report => report.user.department))
  );
  
  // Filter compliance report
  const filteredReport = complianceReport.filter(report => {
    const matchesDepartment = filterDepartment === '' || report.user.department === filterDepartment;
    
    let matchesCompliance = true;
    if (filterCompliance === 'compliant') {
      matchesCompliance = report.compliancePercentage === 100;
    } else if (filterCompliance === 'non-compliant') {
      matchesCompliance = report.compliancePercentage < 100;
    }
    
    return matchesDepartment && matchesCompliance;
  });
  
  const getComplianceStatus = (percentage) => {
    if (percentage === 100) {
      return <span className="px-2 py-1 rounded bg-green-100 text-green-800 text-xs">Compliant</span>;
    } else if (percentage >= 75) {
      return <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-xs">Partially Compliant</span>;
    } else {
      return <span className="px-2 py-1 rounded bg-red-100 text-red-800 text-xs">Non-Compliant</span>;
    }
  };
  
  if (loading) return <div className="text-center py-10">Loading compliance report...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  
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
                <span class="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">Compliance Report</span>
            </div>
            </li>
        </ol>
    </nav>

    <div className="border mt-5 rounded-lg bg-gray-50 shadow-sm">
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Compliance Report</h1>
      
      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:space-x-4">
        <div className="mb-4 md:mb-0 md:w-64">
          <select
            className="w-full p-2 border rounded"
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
        
        <div className="md:w-64">
          <select
            className="w-full p-2 border rounded"
            value={filterCompliance}
            onChange={(e) => setFilterCompliance(e.target.value)}
          >
            <option value="">All Compliance Status</option>
            <option value="compliant">Compliant</option>
            <option value="non-compliant">Non-Compliant</option>
          </select>
        </div>
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-green-100 p-6 rounded-lg shadow">
          <h3 className="font-semibold text-green-800 mb-2">Compliant Users</h3>
          <p className="text-3xl font-bold">
            {complianceReport.filter(report => report.compliancePercentage === 100).length}
          </p>
        </div>
        
        <div className="bg-yellow-100 p-6 rounded-lg shadow">
          <h3 className="font-semibold text-yellow-800 mb-2">Partially Compliant</h3>
          <p className="text-3xl font-bold">
            {complianceReport.filter(report => report.compliancePercentage >= 75 && report.compliancePercentage < 100).length}
          </p>
        </div>
        
        <div className="bg-red-100 p-6 rounded-lg shadow">
          <h3 className="font-semibold text-red-800 mb-2">Non-Compliant Users</h3>
          <p className="text-3xl font-bold">
            {complianceReport.filter(report => report.compliancePercentage < 75).length}
          </p>
        </div>
      </div>
      
      {/* Compliance Table */}
      {filteredReport.length > 0 ? (
        <div className="overflow-x-auto mt-4 border shadow-sm rounded">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Compliance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignments</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiring Soon</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReport.map((report, index) => (
                <tr key={index}>
                  <td className="py-3 px-4">{report.user.name}</td>
                  <td className="py-3 px-4">{report.user.department}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2.5 mr-2">
                        <div 
                          className={`h-2.5 rounded-full ${report.compliancePercentage >= 75 ? 'bg-green-600' : 'bg-red-600'}`}
                          style={{ width: `${report.compliancePercentage}%` }}
                        ></div>
                      </div>
                      <span>{report.compliancePercentage}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {getComplianceStatus(report.compliancePercentage)}
                  </td>
                  <td className="py-3 px-4">
                    {report.completed}/{report.totalAssignments} completed
                    {report.overdue > 0 && (
                      <span className="text-red-600 block">
                        {report.overdue} overdue
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {report.expiringCertifications.length > 0 ? (
                      <div>
                        {report.expiringCertifications.map((cert, i) => (
                          <div key={i} className="text-sm">
                            <span className="font-semibold">{cert.course}</span>
                            <span className={`text-xs ml-2 ${cert.daysRemaining <= 7 ? 'text-red-600' : 'text-yellow-600'}`}>
                              ({cert.daysRemaining} days)
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-500">None</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded">
          No compliance data found matching your criteria.
        </div>
      )}
    </div>
    </div>
    </>
  );
};

export default TrainingComplianceReport;