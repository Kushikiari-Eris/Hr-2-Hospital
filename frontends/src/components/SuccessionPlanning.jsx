import React from 'react';
import { Link } from 'react-router-dom';
import { UsersIcon, ExclamationCircleIcon } from '@heroicons/react/outline';
import useAdminDashbaoardStore from '../stores/AdminStores/useAdminDashboardStore';

const SuccessionPlanning = ({ totalPlans, criticalRiskPositions, highRiskPositions }) => {
  const { successionAnalytics, isLoadingSuccessionAnalytics } = useAdminDashbaoardStore();
  
  const readinessData = successionAnalytics?.readinessDistribution || [];
  
  return (
    <div className="bg-white rounded-lg shadow p-6 border">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Succession Planning</h3>
      
      {/* Summary */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-purple-100">
            <UsersIcon className="h-6 w-6 text-purple-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-gray-600">Total Plans</p>
            <p className="text-xl font-semibold">{totalPlans}</p>
          </div>
        </div>
      </div>
      
      {/* Risk Positions */}
      <h4 className="font-medium text-gray-700 mb-3">Risk Positions</h4>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
          <div className="flex items-center">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
            <span className="ml-2 text-sm font-medium text-gray-700">Critical Risk</span>
          </div>
          <span className="text-sm font-semibold">{criticalRiskPositions}</span>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
          <div className="flex items-center">
            <ExclamationCircleIcon className="h-5 w-5 text-amber-500" />
            <span className="ml-2 text-sm font-medium text-gray-700">High Risk</span>
          </div>
          <span className="text-sm font-semibold">{highRiskPositions}</span>
        </div>
      </div>
      
      {/* Readiness Distribution */}
      {readinessData.length > 0 && (
        <>
          <h4 className="font-medium text-gray-700 mt-6 mb-3">Successor Readiness</h4>
          <div className="space-y-2">
            {readinessData.map((item, index) => {
              const colors = {
                "Ready Now": "bg-green-100 text-green-800",
                "Ready in 1-2 Years": "bg-yellow-100 text-yellow-800",
                "Ready in 3+ Years": "bg-red-100 text-red-800"
              };
              
              return (
                <div key={index} className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${colors[item._id] || "bg-gray-100 text-gray-800"}`}>
                    {item._id}
                  </span>
                  <span className="text-sm font-semibold">{item.count}</span>
                </div>
              );
            })}
          </div>
        </>
      )}
      
      <div className="mt-4 text-center">
        <Link 
          to="/succession-plans" 
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          View All Plans
        </Link>
      </div>
    </div>
  );
};

export default SuccessionPlanning;