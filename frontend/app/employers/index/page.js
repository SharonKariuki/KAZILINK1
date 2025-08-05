// pages/employers/index.js
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../../../components/layouts/Layout';


export default function EmployersList() {
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchEmployers = async () => {
      try {
        const res = await fetch('/api/employers');
        const data = await res.json();
        setEmployers(data);
      } catch (error) {
        console.error('Error fetching employers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployers();
  }, []);

  return (
    <Layout title="Find Employers">
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Find Employers</h1>
            <p className="mt-2 text-lg text-gray-600">
              Browse job creators and available opportunities
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : employers.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
              {employers.map((employer) => (
                <div 
                  key={employer.id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => router.push(`/employers/${employer.id}`)}
                >
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {employer.name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{employer.name}</h3>
                        <p className="text-sm text-gray-500">{employer.company}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-gray-600 text-sm">{employer.bio?.substring(0, 100)}...</p>
                      <div className="mt-3 text-sm text-blue-700">
                        Location: {employer.location || 'Not specified'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900">No employers found</h3>
              <p className="mt-2 text-gray-600">Try again later</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
