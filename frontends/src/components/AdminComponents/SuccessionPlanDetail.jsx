import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useSuccessionStore from '../../stores/AdminStores/useSuccessionStore';
import useAuthStore from '../../stores/useAuthStore';

const SuccessionPlanDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentPlan, fetchSuccessionPlanById, deleteSuccessionPlan } = useSuccessionStore();
  const { user } = useAuthStore();
  
  useEffect(() => {
    fetchSuccessionPlanById(id);
  }, [id, fetchSuccessionPlanById]);
  
  if (!currentPlan) return <div className="flex justify-center p-5">Loading plan details...</div>;
  
  const isAdmin = user && (user.role === 'staff' || user.role === 'superAdmin');
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this succession plan?')) {
      const success = await deleteSuccessionPlan(id);
      if (success) navigate('/succession-plans');
    }
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{currentPlan.positionTitle}</h1>
        
        {isAdmin && (
          <div className="flex space-x-2">
            <Link
              to={`/succession-plans/${id}/edit`}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Edit Plan
            </Link>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        )}
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="border-b px-6 py-4">
          <h2 className="text-xl font-semibold">Position Details</h2>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-gray-500 text-sm">Department</h3>
              <p className="font-medium">{currentPlan.department}</p>
            </div>
            
            <div>
              <h3 className="text-gray-500 text-sm">Current Position Holder</h3>
              <p className="font-medium">
                {currentPlan.currentHolder ? (
                  <>
                    {currentPlan.currentHolder.name}
                    <span className="text-gray-500 text-sm ml-2">
                      ({currentPlan.currentHolder.position})
                    </span>
                  </>
                ) : (
                  'Position Vacant'
                )}
              </p>
            </div>
            
            <div>
              <h3 className="text-gray-500 text-sm">Risk Factor</h3>
              <span className={`px-2 py-1 rounded-full text-xs ${
                currentPlan.riskFactor === 'Low' ? 'bg-green-100 text-green-800' :
                currentPlan.riskFactor === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                currentPlan.riskFactor === 'High' ? 'bg-orange-100 text-orange-800' :
                'bg-red-100 text-red-800'
              }`}>
                {currentPlan.riskFactor}
              </span>
            </div>
            
            <div>
              <h3 className="text-gray-500 text-sm">Status</h3>
              <span className={`px-2 py-1 rounded-full text-xs ${
                currentPlan.status === 'Active' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {currentPlan.status}
              </span>
            </div>
            
            <div>
              <h3 className="text-gray-500 text-sm">Last Review</h3>
              <p>{formatDate(currentPlan.lastReviewDate)}</p>
            </div>
            
            <div>
              <h3 className="text-gray-500 text-sm">Next Review</h3>
              <p>{formatDate(currentPlan.nextReviewDate)}</p>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-gray-500 text-sm mb-2">Position Description</h3>
            <p className="text-gray-700">{currentPlan.positionDescription}</p>
          </div>
          
          <div className="mt-6">
            <h3 className="text-gray-500 text-sm mb-2">Key Competencies</h3>
            {currentPlan.keyCompetencies?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {currentPlan.keyCompetencies.map((competency, index) => (
                  <span key={index} className="bg-gray-100 px-3 py-1 rounded-full">
                    {competency}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No key competencies specified</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="border-b px-6 py-4">
          <h2 className="text-xl font-semibold">Successors</h2>
        </div>
        
        <div className="p-6">
          {currentPlan.successors?.length > 0 ? (
            <div className="space-y-6">
              {currentPlan.successors.map((successor, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                    <div>
                      <h3 className="font-medium text-lg">
                        {successor.userId?.name || 'Unknown Employee'}
                      </h3>
                      <p className="text-gray-500">
                        {successor.userId?.position}, {successor.userId?.department}
                      </p>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <span className={`px-3 py-1 rounded-full ${
                        successor.readiness === 'Ready Now' ? 'bg-green-100 text-green-800' :
                        successor.readiness === 'Ready in 1-2 Years' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {successor.readiness}
                      </span>
                    </div>
                  </div>
                  
                  {successor.developmentNeeds?.length > 0 && (
                    <div className="mb-3">
                      <h4 className="font-medium text-sm text-gray-700 mb-1">Development Needs:</h4>
                      <ul className="list-disc list-inside pl-2">
                        {successor.developmentNeeds.map((need, i) => (
                          <li key={i} className="text-gray-600">{need}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {successor.notes && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-1">Notes:</h4>
                      <p className="text-gray-600">{successor.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No successors have been identified for this position.</p>
          )}
        </div>
      </div>
      
      <div className="flex justify-between mt-6">
        <Link
          to="/succession"
          className="text-blue-600 hover:text-blue-800"
        >
          Back to All Plans
        </Link>
      </div>
    </div>
    </div>
    </>
  );
};

export default SuccessionPlanDetail