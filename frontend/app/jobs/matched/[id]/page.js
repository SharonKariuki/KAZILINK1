"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function MatchedJobsPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchMatchedJobs = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/jobs/match/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch matched jobs");
        }

        setJobs(data.data || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchedJobs();
  }, [id]);

  if (loading) {
    return (
      <div className="p-8 text-center text-lg text-gray-600">
        Loading matched jobs...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        Error: {error}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="p-8 text-center text-gray-600">
        No matched jobs found for this worker.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">
        Matched Jobs
      </h1>

      <div className="grid gap-6 md:grid-cols-2">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {job.jobTitle}
            </h2>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Location:</span>{" "}
              {job.location || "N/A"}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Type:</span> {job.jobType}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Experience:</span>{" "}
              {job.yearsOfExperience} years
            </p>
            <p className="text-gray-600 mb-4 line-clamp-3">
              {job.jobDescription}
            </p>
            <Link
              href={`/jobs/${job.id}`}
              className="inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
