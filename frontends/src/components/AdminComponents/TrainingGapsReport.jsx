import React, { useEffect, useState } from 'react';
import useTrainingAssignmentStore from '../../stores/AdminStores/useTrainingAssignmentStore';

const TrainingGapsReport = () => {
  const { trainingGaps, loading, error, fetchTrainingGaps } = useTrainingAssignmentStore();
  const [filterDepartment, setFilterDepartment] = useState('');
  const [minGapPercentage, setMinGapPercentage] = useState(0);
  
  useEffect(() => {
    fetchTrainingGaps();
  }, [fetchTrainingGaps]);
  
  // Extract unique departments for filter
  const departments = trainingGaps.map(report => report.department);
  
  // Filter departments
  const filteredReport = trainingGaps
    .filter(report => filterDepartment === '' || report.department === filterDepartment)
    .map(department => ({
      ...department,
      courses: department.courses.filter(course => 
        (100 - course.completionPercentage) >= minGapPercentage
      )
    }))
    .filter(department => department.courses.length > 0);
  
  const getGapColor = (percentage) => {
    if (percentage <= 25) return 'text-green-600';
    if (percentage <= 50) return 'text-yellow-600';
    return 'text-red-600';
  };
  
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
                <span class="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">Training Gap Reports</span>
            </div>
            </li>
        </ol>
    </nav>

    <div className="border mt-5 rounded-lg bg-gray-50 shadow-sm">
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Training Gaps Report</h1>
      
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
        
        <div className="mb-4 md:mb-0 md:w-64">
          <label className="block text-gray-700 mb-2">
            Minimum Gap Percentage: {minGapPercentage}%
          </label>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={minGapPercentage} 
            onChange={(e) => setMinGapPercentage(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
      
      {filteredReport.length > 0 ? (
        <div>
          {filteredReport.map(department => (
            <div key={department.department} className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                {department.department} Department
              </h2>
              
              <div className="overflow-x-auto mt-4 border shadow-sm rounded">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gap</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Need Training</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {department.courses.map((course, index) => {
                      const gapPercentage = 100 - course.completionPercentage;
                      return (
                        <tr key={index}>
                          <td className="py-3 px-4">{course.courseTitle}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <div className="w-24 bg-gray-200 rounded-full h-2.5 mr-2">
                                <div 
                                  className="h-2.5 rounded-full bg-blue-600"
                                  style={{ width: `${course.completionPercentage}%` }}
                                ></div>
                              </div>
                              <span>{course.completionPercentage}%</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={getGapColor(gapPercentage)}>
                              {gapPercentage}%
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {course.totalAssigned} / {course.completed}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded">
          No training gaps found matching your criteria.
        </div>
      )}
    </div>
    </div>
    </>
  );
};

export default TrainingGapsReport;