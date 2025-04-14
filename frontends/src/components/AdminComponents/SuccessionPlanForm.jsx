import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useSuccessionStore from '../../stores/AdminStores/useSuccessionStore';
import useAuthStore from '../../stores/useAuthStore';

const SuccessionPlanForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    currentPlan, 
    fetchSuccessionPlanById, 
    createSuccessionPlan, 
    updateSuccessionPlan,
    fetchPotentialSuccessors,
    potentialSuccessors,
    clearCurrentPlan
  } = useSuccessionStore();
  const { users, fetchUsers } = useAuthStore();
  
  const [formData, setFormData] = useState({
    positionTitle: '',
    positionDescription: '',
    department: '',
    currentHolder: '',
    riskFactor: 'Low',
    keyCompetencies: [],
    successors: [],
    nextReviewDate: '',
    status: 'Active'
  });
  
  const [newCompetency, setNewCompetency] = useState('');
  const [successorForm, setSuccessorForm] = useState({
    userId: '',
    readiness: 'Ready in 1-2 Years',
    developmentNeeds: [],
    notes: ''
  });
  const [newDevelopmentNeed, setNewDevelopmentNeed] = useState('');
  
  useEffect(() => {
    fetchUsers();
    fetchPotentialSuccessors();
    
    if (id) {
      fetchSuccessionPlanById(id);
    }
    
    return () => clearCurrentPlan();
  }, [id, fetchSuccessionPlanById, fetchUsers, fetchPotentialSuccessors, clearCurrentPlan]);
  
  useEffect(() => {
    if (currentPlan && id) {
      const nextReviewDate = new Date(currentPlan.nextReviewDate)
        .toISOString()
        .split('T')[0];
      
      setFormData({
        positionTitle: currentPlan.positionTitle,
        positionDescription: currentPlan.positionDescription,
        department: currentPlan.department,
        currentHolder: currentPlan.currentHolder?._id || '',
        riskFactor: currentPlan.riskFactor,
        keyCompetencies: currentPlan.keyCompetencies || [],
        successors: currentPlan.successors || [],
        nextReviewDate,
        status: currentPlan.status
      });
    }
  }, [currentPlan, id]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSuccessorChange = (e) => {
    const { name, value } = e.target;
    setSuccessorForm({
      ...successorForm,
      [name]: value
    });
  };
  
  const addKeyCompetency = () => {
    if (newCompetency.trim()) {
      setFormData({
        ...formData,
        keyCompetencies: [...formData.keyCompetencies, newCompetency.trim()]
      });
      setNewCompetency('');
    }
  };
  
  const removeKeyCompetency = (index) => {
    setFormData({
      ...formData,
      keyCompetencies: formData.keyCompetencies.filter((_, i) => i !== index)
    });
  };
  
  const addDevelopmentNeed = () => {
    if (newDevelopmentNeed.trim()) {
      setSuccessorForm({
        ...successorForm,
        developmentNeeds: [...successorForm.developmentNeeds, newDevelopmentNeed.trim()]
      });
      setNewDevelopmentNeed('');
    }
  };
  
  const removeDevelopmentNeed = (index) => {
    setSuccessorForm({
      ...successorForm,
      developmentNeeds: successorForm.developmentNeeds.filter((_, i) => i !== index)
    });
  };
  
  const addSuccessor = () => {
    if (successorForm.userId) {
      const successor = { ...successorForm };
      setFormData({
        ...formData,
        successors: [...formData.successors, successor]
      });
      setSuccessorForm({
        userId: '',
        readiness: 'Ready in 1-2 Years',
        developmentNeeds: [],
        notes: ''
      });
    }
  };
  
  const removeSuccessor = (index) => {
    setFormData({
      ...formData,
      successors: formData.successors.filter((_, i) => i !== index)
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Format for backend
    const submissionData = {
      ...formData,
      nextReviewDate: new Date(formData.nextReviewDate)
    };
    
    try {
      if (id) {
        await updateSuccessionPlan(id, submissionData);
      } else {
        await createSuccessionPlan(submissionData);
      }
      navigate('/succession-plans');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  
  const getEmployeeName = (id) => {
    const employee = users?.find(user => user._id === id);
    return employee ? employee.name : 'Unknown Employee';
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
                <span class="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">{id ? 'Edit Succession Plan' : 'Create Succession Plan'}</span>
            </div>
            </li>
        </ol>
    </nav>

    <div className="border mt-5 rounded-lg py-7 bg-gray-50 shadow-sm">
    <div className="max-w-4xl mx-auto p-4 border bg-white rounded-lg">
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-medium">Position Title</label>
            <input
              type="text"
              name="positionTitle"
              value={formData.positionTitle}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block mb-2 font-medium">Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block mb-2 font-medium">Position Description</label>
          <textarea
            name="positionDescription"
            value={formData.positionDescription}
            onChange={handleChange}
            className="w-full p-2 border rounded h-24"
            required
          ></textarea>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-medium">Current Holder</label>
            <select
              name="currentHolder"
              value={formData.currentHolder}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Current Holder</option>
              {users?.map(user => (
                <option key={user._id} value={user._id}>
                  {user.name} - {user.position}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block mb-2 font-medium">Risk Factor</label>
            <select
              name="riskFactor"
              value={formData.riskFactor}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block mb-2 font-medium">Next Review Date</label>
          <input
            type="date"
            name="nextReviewDate"
            value={formData.nextReviewDate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        {id && (
          <div>
            <label className="block mb-2 font-medium">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="Active">Active</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
        )}
        
        <div>
          <label className="block mb-2 font-medium">Key Competencies</label>
          <div className="flex">
            <input
              type="text"
              value={newCompetency}
              onChange={(e) => setNewCompetency(e.target.value)}
              className="flex-1 p-2 border rounded-l"
              placeholder="Add a key competency"
            />
            <button
              type="button"
              onClick={addKeyCompetency}
              className="bg-blue-500 text-white px-4 py-2 rounded-r"
            >
              Add
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.keyCompetencies.map((competency, index) => (
              <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
              <span>{competency}</span>
              <button
                type="button"
                onClick={() => removeKeyCompetency(index)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="border-t pt-6">
        <h2 className="text-xl font-bold mb-4">Successors</h2>
        
        <div className="bg-gray-50 p-4 rounded mb-4">
          <h3 className="font-medium mb-3">Add New Successor</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-1">Employee</label>
              <select
                name="userId"
                value={successorForm.userId}
                onChange={handleSuccessorChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Employee</option>
                {potentialSuccessors?.map(employee => (
                  <option key={employee._id} value={employee._id}>
                    {employee.name} - {employee.position}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block mb-1">Readiness</label>
              <select
                name="readiness"
                value={successorForm.readiness}
                onChange={handleSuccessorChange}
                className="w-full p-2 border rounded"
              >
                <option value="Ready Now">Ready Now</option>
                <option value="Ready in 1-2 Years">Ready in 1-2 Years</option>
                <option value="Ready in 3+ Years">Ready in 3+ Years</option>
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block mb-1">Development Needs</label>
            <div className="flex">
              <input
                type="text"
                value={newDevelopmentNeed}
                onChange={(e) => setNewDevelopmentNeed(e.target.value)}
                className="flex-1 p-2 border rounded-l"
                placeholder="Add a development need"
              />
              <button
                type="button"
                onClick={addDevelopmentNeed}
                className="bg-blue-500 text-white px-4 py-2 rounded-r"
              >
                Add
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {successorForm.developmentNeeds.map((need, index) => (
                <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
                  <span>{need}</span>
                  <button
                    type="button"
                    onClick={() => removeDevelopmentNeed(index)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block mb-1">Notes</label>
            <textarea
              name="notes"
              value={successorForm.notes}
              onChange={handleSuccessorChange}
              className="w-full p-2 border rounded h-16"
            ></textarea>
          </div>
          
          <div className="text-right">
            <button
              type="button"
              onClick={addSuccessor}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Add Successor
            </button>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-3">Current Successors</h3>
          {formData.successors.length > 0 ? (
            <div className="space-y-4">
              {formData.successors.map((successor, index) => (
                <div key={index} className="border p-4 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">{getEmployeeName(successor.userId)}</h4>
                    <button
                      type="button"
                      onClick={() => removeSuccessor(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <span className="font-medium">Readiness:</span> {successor.readiness}
                    </div>
                    <div>
                      <span className="font-medium">Development Needs:</span>{" "}
                      {successor.developmentNeeds.join(", ") || "None specified"}
                    </div>
                  </div>
                  {successor.notes && (
                    <div className="mt-2">
                      <span className="font-medium">Notes:</span> {successor.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No successors added yet.</p>
          )}
        </div>
      </div>
      
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => navigate('/succession')}
          className="bg-gray-300 px-6 py-2 rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          {id ? 'Update' : 'Create'} Succession Plan
        </button>
      </div>
    </form>
  </div>
  </div>
  </>
);
};

export default SuccessionPlanForm