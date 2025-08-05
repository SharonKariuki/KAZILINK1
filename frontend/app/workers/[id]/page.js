'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../../../components/Layouts/Layout';

export default function WorkerProfile({ params }) {
  const router = useRouter();
  const { id } = params;

  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!id) return;

    const fetchWorker = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/workers/${id}`);
        if (!res.ok) {
          setWorker(null);
        } else {
          const data = await res.json();
          setWorker(data);
        }
      } catch (err) {
        console.error('Failed to fetch worker:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorker();
  }, [id]);

  if (loading) {
    return (
      <Layout title="Worker Profile">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  if (!worker) {
    return (
      <Layout title="Worker Profile">
        <div className="text-center py-20">
          <div className="mx-auto w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-indigo-900 mb-2">Worker Not Found</h3>
          <p className="text-indigo-600 max-w-md mx-auto">
            We couldn't find the worker profile you're looking for.
          </p>
          <button
            onClick={() => router.back()}
            className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
          >
            Go Back
          </button>
        </div>
      </Layout>
    );
  }

  const sidebarLinks = [
    { key: 'overview', label: 'Overview' },
    { key: 'skills', label: 'Skills & Certifications' },
    { key: 'experience', label: 'Experience' },
  ];

  return (
    <Layout title={`${worker.name} | Professional Profile`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Sidebar */}
        <aside className="md:col-span-1 bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-bold text-indigo-700 mb-4">Sections</h2>
          <ul className="space-y-2">
            {sidebarLinks.map((link) => (
              <li key={link.key}>
                <button
                  onClick={() => setActiveTab(link.key)}
                  className={`block w-full text-left px-3 py-2 rounded hover:bg-indigo-50 ${
                    activeTab === link.key
                      ? 'bg-indigo-100 text-indigo-700 font-semibold'
                      : 'text-gray-700'
                  }`}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">

            {/* Profile Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 md:p-8 text-white">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="bg-white/20 backdrop-blur-sm h-24 w-24 rounded-full flex items-center justify-center text-4xl font-bold shrink-0">
                  {worker.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold">{worker.name}</h1>
                  <p className="text-white/90 text-lg mt-1">
                    {worker.title || 'Skilled Professional'}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 mt-3">
                    <div className="flex items-center text-white/80">
                      📍 {worker.location || 'Location not specified'}
                    </div>
                    {worker.experience && (
                      <div className="flex items-center text-white/80">
                        🛠 {worker.experience} years experience
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs (still shown for visual clarity) */}
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                {sidebarLinks.map((link) => (
                  <button
                    key={link.key}
                    onClick={() => setActiveTab(link.key)}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                      activeTab === link.key
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6 md:p-8">
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-indigo-700 mb-4">About {worker.name}</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {worker.bio || (
                      <span className="text-gray-400 italic">No bio provided.</span>
                    )}
                  </p>

                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <h4 className="text-sm font-semibold text-indigo-500 uppercase tracking-wider mb-2">
                        Contact Information
                      </h4>
                      <div className="space-y-2 text-gray-700">
                        <p>
                          <span className="font-medium">Email:</span>{' '}
                          {worker.email || 'Not provided'}
                        </p>
                        <p>
                          <span className="font-medium">Phone:</span>{' '}
                          {worker.phone || 'Not provided'}
                        </p>
                      </div>
                    </div>

                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <h4 className="text-sm font-semibold text-indigo-500 uppercase tracking-wider mb-2">
                        Professional Details
                      </h4>
                      <div className="space-y-2 text-gray-700">
                        <p>
                          <span className="font-medium">Category:</span>{' '}
                          {worker.category || 'Not specified'}
                        </p>
                        <p>
                          <span className="font-medium">Availability:</span>{' '}
                          {worker.availability || 'Not specified'}
                        </p>
                        <p>
                          <span className="font-medium">Rate:</span>{' '}
                          {worker.rate
                            ? `KES ${worker.rate}/hr`
                            : 'Not specified'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'skills' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-indigo-700 mb-4">
                    Skills & Certifications
                  </h3>
                  {worker.skills?.length ? (
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                      {worker.skills.map((skill, i) => (
                        <li key={i}>{skill}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400 italic">
                      No skills or certifications provided.
                    </p>
                  )}
                </div>
              )}

              {activeTab === 'experience' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-indigo-700 mb-4">
                    Work Experience
                  </h3>
                  {worker.experiences?.length ? (
                    <div className="space-y-4">
                      {worker.experiences.map((exp, i) => (
                        <div
                          key={i}
                          className="border border-gray-200 rounded-lg p-5 hover:border-indigo-200 hover:shadow-md transition-all duration-300"
                        >
                          <h4 className="text-lg font-semibold text-indigo-700">
                            {exp.title}
                          </h4>
                          <p className="text-gray-600 text-sm mt-1">
                            {exp.company} • {exp.location} • {exp.duration}
                          </p>
                          <p className="mt-2 text-gray-700">
                            {exp.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 italic">
                      No work experience listed.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}


