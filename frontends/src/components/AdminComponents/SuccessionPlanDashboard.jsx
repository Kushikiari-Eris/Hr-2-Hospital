import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useSuccessionStore from '../../stores/AdminStores/useSuccessionStore';
import useAuthStore from '../../stores/useAuthStore';

const SuccessionPlanDashboard = () => {
  const { successionPlans, fetchSuccessionPlans } = useSuccessionStore();
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    totalPlans: 0,
    criticalRisk: 0,
    readyNowSuccessors: 0,
    plansRequiringReview: 0
  });
  
  useEffect(() => {
    fetchSuccessionPlans();
  }, [fetchSuccessionPlans]);
  
  useEffect(() => {
    if (successionPlans.length) {
      const today = new Date();
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      
      // Calculate statistics
      const criticalRisk = successionPlans.filter(plan => plan.riskFactor === 'Critical').length;
      
      let readyNowSuccessors = 0;
      successionPlans.forEach(plan => {
        plan.successors.forEach(successor => {
          if (successor.readiness === 'Ready Now') readyNowSuccessors++;
        });
      });
      
      const plansRequiringReview = successionPlans.filter(plan => {
        const reviewDate = new Date(plan.nextReviewDate);
        return reviewDate <= nextMonth;
      }).length;
      
      setStats({
        totalPlans: successionPlans.length,
        criticalRisk,
        readyNowSuccessors,
        plansRequiringReview
      });
    }
  }, [successionPlans]);
  
  const isAdmin = user && (user.role === 'staff' || user.role === 'superAdmin');
  const departments = [...new Set(successionPlans.map(plan => plan.department))];
  
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
                <span class="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">Succesion Planning</span>
            </div>
            </li>
            <li aria-current="page">
            <div class="flex items-center">
                <svg class="rtl:rotate-180  w-3 h-3 mx-1 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                </svg>
                <span class="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400"></span>
            </div>
            </li>
        </ol>
    </nav>

    <div className="border mt-5 rounded-lg py-7 bg-gray-50 shadow-sm">
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Succession Planning</h1>
        
        {isAdmin && (
          <Link
            to="/succession-plans/new"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            New Succession Plan
          </Link>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <h2 className="text-gray-500 text-sm">Total Succession Plans</h2>
          <p className="text-2xl font-bold">{stats.totalPlans}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
          <h2 className="text-gray-500 text-sm">Critical Risk Positions</h2>
          <p className="text-2xl font-bold">{stats.criticalRisk}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <h2 className="text-gray-500 text-sm">Ready Now Successors</h2>
          <p className="text-2xl font-bold">{stats.readyNowSuccessors}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
          <h2 className="text-gray-500 text-sm">Plans Requiring Review</h2>
          <p className="text-2xl font-bold">{stats.plansRequiringReview}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow col-span-2">
          <div className="border-b px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Critical Positions</h2>
            <Link to="/succession-plans" className="text-blue-600 text-sm">View All</Link>
          </div>
          
          <div className="p-6">
            {successionPlans.filter(plan => plan.riskFactor === 'Critical' || plan.riskFactor === 'High').length > 0 ? (
              <div className="divide-y">
                {successionPlans
                  .filter(plan => plan.riskFactor === 'Critical' || plan.riskFactor === 'High')
                  .slice(0, 5)
                  .map(plan => (
                    <div key={plan._id} className="py-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <Link 
                            to={`/succession-plans/${plan._id}`}
                            className="font-medium hover:text-blue-600"
                          >
                            {plan.positionTitle}
                          </Link>
                          <p className="text-gray-500 text-sm">{plan.department}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          plan.riskFactor === 'Critical' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                        }`}>
                          {plan.riskFactor}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No critical or high risk positions found.</p>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <div className="border-b px-6 py-4">
            <h2 className="text-xl font-semibold">Departments</h2>
          </div>
          
          <div className="p-6">
            {departments.length > 0 ? (
              <div className="space-y-3">
                {departments.map((department, index) => {
                  const count = successionPlans.filter(plan => plan.department === department).length;
                  return (
                    <div key={index} className="flex justify-between items-center">
                      <span className="font-medium">{department}</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        {count} plan{count !== 1 ? 's' : ''}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 italic">No departments found.</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow mt-6">
        <div className="border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Upcoming Reviews</h2>
        </div>
        
        <div className="p-6">
          {successionPlans.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Position</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Department</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Current Holder</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Next Review</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {successionPlans
                    .sort((a, b) => new Date(a.nextReviewDate) - new Date(b.nextReviewDate))
                    .slice(0, 5)
                    .map(plan => (
                      <tr key={plan._id}>
                        <td className="py-3 px-4">
                          <Link 
                            to={`/succession-plans/${plan._id}`}
                            className="font-medium hover:text-blue-600"
                          >
                            {plan.positionTitle}
                          </Link>
                        </td>
                        <td className="py-3 px-4">{plan.department}</td>
                        <td className="py-3 px-4">
                          {plan.currentHolder ? plan.currentHolder.name : 'Position Vacant'}
                        </td>
                        <td className="py-3 px-4">
                          {new Date(plan.nextReviewDate).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            plan.status === 'Active' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {plan.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 italic">No succession plans found.</p>
          )}
        </div>
      </div>
    </div>
    </div>
    </>
  );
};

export default SuccessionPlanDashboard