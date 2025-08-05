"use client";

import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { FaStar, FaShieldAlt, FaFileDownload } from "react-icons/fa";
import { useRouter } from 'next/navigation';


export default function WorkerDashboardPage() {
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [matchedJobs, setMatchedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setErrorMsg('');

      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found. Please log in.');

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;

        // Fetch worker profile
        const profileResponse = await fetch(`http://localhost:5000/api/workers/user/${userId}`, {
          headers: { 'Content-Type': 'application/json' },
        });

        if (!profileResponse.ok) {
          const errorText = await profileResponse.text();
          throw new Error(`Profile fetch failed: ${errorText}`);
        }

        const profileData = await profileResponse.json();
        setProfile(profileData);

        if (profileData.profilePhoto) {
          setProfilePhotoPreview(`http://localhost:5000/uploads/${profileData.profilePhoto}`);
        }

        // Fetch matched jobs if profile is complete and approved
        if (profileData._id && profileData.isVerified && profileData.isProfileComplete && profileData.profileApproved) {
         const jobResponse = await fetch(`http://localhost:5000/api/match/${profileData._id}`, {

            headers: { 'Content-Type': 'application/json' },
          });

          if (!jobResponse.ok) {
            const errorText = await jobResponse.text();
            throw new Error(`Job match fetch failed: ${errorText}`);
          }
const matchedJobsData = await jobResponse.json();
setMatchedJobs(matchedJobsData.jobs || []);

          
        }
      } catch (error) {
        console.error('Dashboard fetch error:', error.message);
        setErrorMsg(error.message || 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoSubmit = async () => {
    if (!profilePhotoFile) return;
    
    try {
      const formData = new FormData();
      formData.append('profilePhoto', profilePhotoFile);

      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
      const userId = decoded.id;

      const response = await fetch(`http://localhost:5000/api/workers/upload/${userId}`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Photo upload failed');
      }

      const data = await response.json();
      setProfilePhotoPreview(`http://localhost:5000/uploads/${data.profilePhoto}`);
      setProfile(prev => ({ ...prev, profilePhoto: data.profilePhoto }));
      setProfilePhotoFile(null);
    } catch (error) {
      console.error('Error uploading photo:', error);
      setErrorMsg('Failed to upload photo. Please try again.');
    }
  };

  const renderProfileModal = () => {
    if (!profile) return null;

    return (
      <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex justify-center items-center p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <div className="flex flex-col items-center md:items-start">
              <div className="relative group mb-4">
                {profilePhotoPreview ? (
                  <div className="relative overflow-hidden rounded-full border-4 border-blue-200 shadow-lg w-32 h-32">
                    <img
                      src={profilePhotoPreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 flex items-center justify-center bg-blue-100 rounded-full border-4 border-blue-200 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
                <label className="absolute -bottom-2 right-2 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-all shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <input type="file" onChange={handlePhotoUpload} className="hidden" accept="image/*" />
                </label>
              </div>

              {profilePhotoFile && (
                <button 
                  onClick={handlePhotoSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mb-4 text-sm"
                >
                  Save Photo
                </button>
              )}

              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-900">
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className="text-blue-600">{profile.email}</p>
                <p className="text-sm text-blue-500 mt-1">
                  Member since {new Date(profile.createdAt).toLocaleDateString()}
                </p>
                {profile.isApprovedByAdmin && (
                  <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Verified Professional
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Contact
                  </h3>
                  <p className="text-gray-700">{profile.phone || 'Not provided'}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Address
                  </h3>
                  <p className="text-gray-700">
                    {profile.address?.street ? 
                      `${profile.address.street}, ${profile.address.city}, ${profile.address.state} ${profile.address.zip}` : 
                      'Not provided'}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Occupation
                  </h3>
                  <p className="text-gray-700">
                    {profile.occupation || 'Not specified'} 
                    {profile.experience ? ` (${profile.experience} years experience)` : ''}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Skills
                  </h3>
                  {profile.skills?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill, i) => (
                        <span key={i} className="bg-white px-3 py-1 rounded-full text-sm text-blue-700 border border-blue-200">
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No skills listed</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-700 mb-4 flex items-center text-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
                Education
              </h3>
              {profile.education?.degree ? (
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <span className="font-medium">{profile.education.degree}</span> in {profile.education.field}
                  </p>
                  <p className="text-blue-600 text-sm">
                    {profile.education.institution}, graduated {profile.education.completionYear}
                  </p>
                </div>
              ) : (
                <p className="text-blue-500">No education information provided</p>
              )}
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-700 mb-4 flex items-center text-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Certification
              </h3>
              {profile.certification?.certificationName ? (
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <span className="font-medium">{profile.certification.certificationName}</span> - {profile.certification.issuingOrg}
                  </p>
                  <p className="text-blue-600 text-sm">
                    Issued: {new Date(profile.certification.certificationDate).toLocaleDateString()}
                  </p>
                  {profile.certification.certificate && (
                    <a
                      href={`http://localhost:5000/uploads/${profile.certification.certificate}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm mt-2"
                    >
                      <FaFileDownload className="mr-1" />
                      Download Certificate
                    </a>
                  )}
                </div>
              ) : (
                <p className="text-blue-500">No certifications provided</p>
              )}
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-red-600 mb-4 flex items-center text-lg">
              <FaShieldAlt className="mr-2" />
              Background Check
            </h3>
            <p className="text-gray-700">
              {profile.criminalRecord && profile.criminalRecord.hasRecord ? (
                profile.criminalRecord.explanation
              ) : (
                <span className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  No criminal record
                </span>
              )}
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <FaStar className="mr-2 text-yellow-500" />
              Reviews & Ratings
            </h3>
            <div className="text-center py-8 bg-white rounded-lg shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-blue-600 font-medium">Coming soon</p>
              <p className="text-blue-500 text-sm mt-1">Your reviews and ratings will appear here once clients provide feedback.</p>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
          <h3 className="font-bold mb-2">Error</h3>
          <p>{errorMsg}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded max-w-md">
          <h3 className="font-bold mb-2">No Profile Found</h3>
          <p>Please complete your profile setup.</p>
        </div>
      </div>
    );
  }

  const isTrusted = profile.isVerified && profile.isProfileComplete && profile.profileApproved;

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3">
            Professional Dashboard
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage your profile and discover job opportunities
          </p>
        </div>

        {/* Profile Summary Card */}
        <div
          onClick={() => setShowModal(true)}
          className="cursor-pointer bg-white p-6 rounded-2xl shadow-lg mb-10 hover:shadow-xl transition-shadow border border-gray-200"
        >
          <div className="flex items-center space-x-6">
            {profilePhotoPreview ? (
              <div className="relative">
                <div className="relative overflow-hidden rounded-full border-4 border-blue-200 shadow-lg w-20 h-20">
                  <img
                    src={profilePhotoPreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ) : (
              <div className="w-20 h-20 flex items-center justify-center bg-blue-100 rounded-full border-4 border-blue-200 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {profile.firstName} {profile.lastName}
                  </h2>
                  <p className="text-blue-600">{profile.email}</p>
                </div>
                {profile.isApprovedByAdmin && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Verified Professional
                  </span>
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {profile.occupation || 'Professional'}
                </span>
                {profile.experience && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {profile.experience} years experience
                  </span>
                )}
                {profile.skills?.slice(0, 2).map((skill, i) => (
                  <span key={i} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-blue-800 border border-blue-200">
                    {skill}
                  </span>
                ))}
                {profile.skills?.length > 2 && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-blue-800 border border-blue-200">
                    +{profile.skills.length - 2} more
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Job Matches Section */}
        <section className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Your Job Matches</h2>
              <p className="text-gray-600 mt-1">Opportunities tailored to your skills</p>
            </div>
            <span className="mt-3 md:mt-0 inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {matchedJobs.length} matches found
            </span>
          </div>

          {matchedJobs.length === 0 ? (
            <div className="text-center py-16 bg-blue-50 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-blue-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No matched jobs yet</h3>
              <p className="text-blue-600 max-w-md mx-auto">
                We're searching for opportunities that match your profile. Check back soon.
              </p>
              <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow">
                Update Skills
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {matchedJobs.map((job) => (
                
                <div 
                  key={job._id} 
                  className="relative p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow bg-white"
                >
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      New Match
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {job.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{job.description}</p>
                  <div className="flex items-center text-sm text-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {job.location || 'Remote'}
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-sm text-gray-500">Posted recently</span>
                  <button
  onClick={() => router.push(`/jobs/${job._id}`)}
  className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
>
  View Details
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
</button>


                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {showModal && renderProfileModal()}
      </div>
    </main>
  );
}