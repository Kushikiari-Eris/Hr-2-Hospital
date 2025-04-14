import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useSuccessionStore from '../../stores/AdminStores/useSuccessionStore';
import useAuthStore from '../../stores/useAuthStore';

const SuccessionPlansTable = ({ department }) => {
  const { successionPlans, loading, fetchSuccessionPlans, fetchPlansByDepartment, deleteSuccessionPlan } = useSuccessionStore();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false); 
  const [courseToDelete, setCourseToDelete] = useState(null);
  
  useEffect(() => {
    if (department) {
      fetchPlansByDepartment(department);
    } else {
      fetchSuccessionPlans();
    }
  }, [department, fetchPlansByDepartment, fetchSuccessionPlans]);

  const handleDelete = async () => {
    if (courseToDelete) {
      await deleteSuccessionPlan(courseToDelete);
      document.getElementById('my_modal_2').close();
    }
  };

  const openDeleteModal = (planId) => {
    setCourseToDelete(planId);
    document.getElementById('my_modal_2').showModal();
  };

  
  const isAdmin = user && (user.role === 'staff' || user.role === 'superAdmin');
  
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
        </ol>
    </nav>

    <div className="border mt-5 rounded-lg py-7 px-7 bg-gray-50 shadow-sm">
    <div className="overflow-x-auto mt-4 border shadow-sm rounded">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Holder</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Factor</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"># of Successors</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Review</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {successionPlans.length > 0 ? (
            successionPlans.map((plan) => (
              <tr key={plan._id} className="bg-white divide-y divide-gray-200">
                <td className="py-3 px-4">{plan.positionTitle}</td>
                <td className="py-3 px-4">{plan.department}</td>
                <td className="py-3 px-4">
                  {plan.currentHolder ? plan.currentHolder.name : 'N/A'}
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    plan.riskFactor === 'Low' ? 'bg-green-100 text-green-800' :
                    plan.riskFactor === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    plan.riskFactor === 'High' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {plan.riskFactor}
                  </span>
                </td>
                <td className="py-3 px-4">{plan.successors.length}</td>
                <td className="py-3 px-4">
                  {new Date(plan.lastReviewDate).toLocaleDateString()}
                </td>
                <td className="py-3 px-4  whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Link 
                        to={`/succession-plans/${plan._id}`}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        View
                    </Link>
                    {isAdmin && (
                        <>
                        <Link 
                            to={`/succession-plans/${plan._id}/edit`}
                            className="text-green-600 hover:text-green-800"
                        >
                            Edit
                        </Link>
                        <button
                            onClick={() => openDeleteModal(plan._id)}
                            className="text-red-600 hover:text-red-800"
                        >
                            Delete
                        </button>
                        </>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="py-4 px-4 text-center">
                No succession plans found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </div>

    <dialog id="my_modal_2" className="modal">
          <div className="modal-box">
            {isLoading ? (
              <ButtonLoading/>
            ) : (
              <>
                <h3 className="font-bold text-lg">Are you sure you want to delete this Succession Plan?</h3>
                <p className="py-4 text-red-600">This action cannot be undone.</p>
                <div className="modal-action">
                  <button className="btn text-gray-600" onClick={() => document.getElementById('my_modal_2').close()}>Cancel</button>
                  <button onClick={handleDelete} className="btn bg-red-600 text-white hover:bg-red-700">Confirm Delete</button>
                </div>
              </>
            )}
          </div>
        </dialog>
    </>
  );
};

export default SuccessionPlansTable