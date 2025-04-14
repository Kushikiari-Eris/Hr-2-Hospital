import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useSuccessionStore from '../../stores/AdminStores/useSuccessionStore';
import useAuthStore from '../../stores/useAuthStore';

const EmployeeSuccession = () => {
  const { successionPlans, fetchMySuccessionPlans } = useSuccessionStore();
  const { user } = useAuthStore();
  
  useEffect(() => {
    if (user) {
      fetchMySuccessionPlans();
    }
  }, [user, fetchMySuccessionPlans]);
  
  if (!user) return null;
  
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Career Development</h1>
      
      {successionPlans.length > 0 ? (
        <div className="bg-white shadow rounded-lg overflow-hidden border">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">Succession Opportunities</h2>
            <p className="text-gray-500">Positions for which you've been identified as a potential successor</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-6">
              {successionPlans.map(plan => {
                // Find this user's successor record in the plan
                const successorRecord = plan.successors.find(
                  s => s.userId._id === user._id || s.userId === user._id
                );
                
                return (
                  <div key={plan._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-medium text-lg">{plan.positionTitle}</h3>
                        <p className="text-gray-500">{plan.department}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full ${
                        successorRecord.readiness === 'Ready Now' ? 'bg-green-100 text-green-800' :
                        successorRecord.readiness === 'Ready in 1-2 Years' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {successorRecord.readiness}
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-medium text-sm text-gray-700 mb-1">Current Position Holder:</h4>
                      <p>
                        {plan.currentHolder ? plan.currentHolder.name : 'Position Vacant'}
                        {plan.currentHolder && plan.currentHolder.position && (
                          <span className="text-gray-500 ml-1">({plan.currentHolder.position})</span>
                        )}
                      </p>
                    </div>
                    
                    {successorRecord.developmentNeeds?.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium text-sm text-gray-700 mb-1">Your Development Needs:</h4>
                        <ul className="list-disc list-inside pl-2">
                          {successorRecord.developmentNeeds.map((need, i) => (
                            <li key={i} className="text-gray-600">{need}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="mb-4">
                      <h4 className="font-medium text-sm text-gray-700 mb-1">Key Competencies Required:</h4>
                      {plan.keyCompetencies?.length > 0 ? (
                        <div className="flex flex-wrap gap-2 mt-1">
                          {plan.keyCompetencies.map((competency, index) => (
                            <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                              {competency}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">No key competencies specified</p>
                      )}
                    </div>
                    
                    {successorRecord.notes && (
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-1">Notes:</h4>
                        <p className="text-gray-600">{successorRecord.notes}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <h2 className="text-xl font-medium mb-2">No Succession Plans Found</h2>
          <p className="text-gray-500">
            You haven't been identified as a potential successor for any positions yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default EmployeeSuccession