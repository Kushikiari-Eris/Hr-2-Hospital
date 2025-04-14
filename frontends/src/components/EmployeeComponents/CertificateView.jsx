// src/pages/employee/CertificateView.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useTrainingAssignmentStore from '../../stores/AdminStores/useTrainingAssignmentStore';
import useAuthStore from '../../stores/useAuthStore';
import Loading from '../Loading';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const CertificateView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { fetchUserAssignments, userAssignments, loading } = useTrainingAssignmentStore();
  const [assignment, setAssignment] = useState(null);
  const certificateRef = useRef(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserAssignments(user._id);
    }
  }, [user, fetchUserAssignments]);

  useEffect(() => {
    if (user && userAssignments[user._id]) {
      const foundAssignment = userAssignments[user._id].find(a => a._id === id);
      
      // Only allow completed assignments to view certificate
      if (foundAssignment && foundAssignment.status === 'completed') {
        setAssignment(foundAssignment);
      } else {
        // Redirect if assignment not completed
        navigate(`/employee/training/${id}`);
      }
    }
  }, [id, user, userAssignments, navigate]);

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const downloadAsPDF = async () => {
    if (!certificateRef.current) {
      console.error("Certificate reference is null");
      return;
    }
    
    setGeneratingPDF(true);
    
    try {
      // Make sure DOM is fully rendered
      setTimeout(async () => {
        try {
          const element = certificateRef.current;
          
          const canvas = await html2canvas(element, {
            scale: 2, // Higher resolution
            useCORS: true,
            logging: false,
            allowTaint: true,
            backgroundColor: "#ffffff"
          });
          
          const imgData = canvas.toDataURL('image/jpeg', 1.0);
          const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4',
          });
          
          const imgWidth = 297; // A4 width in mm (landscape)
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          
          pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
          pdf.save(`Certificate-${assignment.course?.title?.replace(/\s+/g, '_') || 'Training'}.pdf`);
          setGeneratingPDF(false);
        } catch (err) {
          console.error("Error in setTimeout:", err);
          alert("There was an error generating your certificate. Please try again.");
          setGeneratingPDF(false);
        }
      }, 500);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("There was an error generating your certificate. Please try again.");
      setGeneratingPDF(false);
    }
  };

  const printCertificate = () => {
    window.print();
  };

  if (loading) {
    return <Loading />;
  }

  if (!assignment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Certificate Not Available</h2>
          <p className="mb-6 text-gray-600">This certificate is only available for completed training assignments.</p>
          <button 
            onClick={() => navigate('/user-dashboard')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
    <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0 ">
    <button
        onClick={() => navigate(`/employee/training/${id}`)}
        className="flex items-center text-indigo-600 hover:text-indigo-800"
    >
        <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Training Details
    </button>

    <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0 ">
        <button
        onClick={downloadAsPDF}
        disabled={generatingPDF}
        className={`px-4 py-2 ${
            generatingPDF ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
        } text-white rounded-md flex items-center justify-center`}
        >
        {generatingPDF ? (
            <>
            <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
            </svg>
            Generating...
            </>
        ) : (
            <>
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download PDF
            </>
        )}
        </button>

        <button
        onClick={printCertificate}
        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center justify-center"
        >
        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
        </svg>
        Print Certificate
        </button>
    </div>
    </div>


      {/* Certificate Preview */}
      <div className="bg-white rounded-lg shadow overflow-hidden p-4 border">
        <div className="mb-4 text-center">
          <h2 className="text-xl font-semibold">Certificate Preview</h2>
          <p className="text-gray-600">This is how your certificate will appear when downloaded or printed.</p>
        </div>
        
        {/* Certificate Design */}
        <div className="p-4 flex justify-center ">
          <div 
            id="certificate" 
            ref={certificateRef} 
            className="w-full max-w-4xl border-8 border-double border-blue-200 p-8 bg-white print:w-full print:max-w-none print:border-8 print:p-12"
            style={{ borderColor: "#c7d2fe" }}
          >
            <div className="text-center">
              <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2" style={{ color: "#4338ca" }}>CERTIFICATE OF COMPLETION</h1>
                <div className="w-48 h-1 mx-auto" style={{ backgroundColor: "#4338ca" }}></div>
              </div>
              
              <div className="mb-8">
                <p className="text-xl">This certifies that</p>
                <h2 className="text-3xl font-bold italic text-gray-800 my-2">{user?.firstName || 'User'} {user?.lastName || ''}</h2>
                <p className="text-xl">has successfully completed</p>
                <h3 className="text-2xl font-bold my-2" style={{ color: "#4338ca" }}>{assignment.course?.title || 'Training Course'}</h3>
                <p className="text-lg mt-4">with a duration of {assignment.course?.duration || 'N/A'} minutes</p>
              </div>
              
              <div className="grid grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="border-t border-gray-400 w-48 mx-auto mb-2"></div>
                  <p className="font-medium">Date Completed</p>
                  <p>{formatDate(assignment.completionDate)}</p>
                </div>
                
                <div className="text-center">
                  <div className="h-20 flex items-end justify-center">
                    {/* Simplified SVG seal that's compatible with html2canvas */}
                    <div className="h-16 w-16 rounded-full border-2 border-blue-800 relative flex items-center justify-center" style={{ backgroundColor: "#eff6ff" }}>
                      <div className="absolute">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 6L9 17L4 12" stroke="#3730a3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <p className="font-bold text-lg mt-2">Company Seal</p>
                </div>
                
                <div className="text-center">
                  <div className="border-t border-gray-400 w-48 mx-auto mb-2"></div>
                  <p className="font-medium">Certificate Expires</p>
                  <p>{formatDate(assignment.certificationExpiry) || 'No Expiration'}</p>
                </div>
              </div>
              
              <div className="mt-10 text-gray-600">
                <p>Certificate ID: {assignment._id}</p>
                <p className="text-sm mt-1">Verify this certificate at yourcompany.com/verify</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Certificate Information */}
      <div className="mt-8 bg-white rounded-lg shadow p-6 border">
        <h3 className="text-lg font-medium mb-4">Certificate Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Course Title</h4>
            <p>{assignment.course?.title || 'N/A'}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Course Duration</h4>
            <p>{assignment.course?.duration || 'N/A'} minutes</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Completion Date</h4>
            <p>{formatDate(assignment.completionDate)}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Certificate Expires</h4>
            <p>{formatDate(assignment.certificationExpiry) || 'No Expiration'}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Certificate ID</h4>
            <p>{assignment._id}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Course Type</h4>
            <p className="capitalize">{assignment.course?.type || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Print-only styles */}
      <style type="text/css" media="print">{`
        @page {
          size: landscape;
          margin: 0;
        }
        body * {
          visibility: hidden;
        }
        #certificate, #certificate * {
          visibility: visible;
        }
        #certificate {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          padding: 40px;
          box-sizing: border-box;
          border: none !important;
        }
      `}</style>
    </div>
  );
};

export default CertificateView;