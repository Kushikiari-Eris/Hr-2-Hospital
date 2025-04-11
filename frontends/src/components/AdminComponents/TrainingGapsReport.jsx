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
  
  if (loading) return <div className="text-center py-10">Loading training gaps report...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  
  return (
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
              
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-3 px-4 text-left">Course</th>
                      <th className="py-3 px-4 text-left">Completion</th>
                      <th className="py-3 px-4 text-left">Gap</th>
                      <th className="py-3 px-4 text-left">Staff Need Training</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {department.courses.map((course, index) => {
                      const gapPercentage = 100 - course.completionPercentage;
                      return (
                        <tr key={index}>
                          <td className="py-3 px-4">{course.title}</td>
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
                            {course.needTraining} / {course.totalStaff}
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
  );
};

export default TrainingGapsReport;