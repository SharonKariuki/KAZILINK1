"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function JobDetailsPage() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/jobs/${id}`);

        if (!res.ok) {
          throw new Error("Failed to fetch job details");
        }

        const data = await res.json();
        setJob(data.data); // ✅ Use the actual job object
      } catch (err) {
        setError(err.message);
      }
    };

    if (id) {
      fetchJob();
    }
  }, [id]);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!job) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{job.jobTitle}</h1>
      <p className="text-gray-600 mb-4">{job.jobDescription}</p>
      <div className="text-sm text-gray-500">Location: {job.location || "Remote"}</div>
      <div className="text-sm text-gray-500 mt-2">Years of Experience: {job.yearsOfExperience || "Not specified"}</div>
      <div className="text-sm text-gray-500 mt-2">Type: {job.jobType}</div>
      <div className="text-sm text-gray-500 mt-2">Salary: KES {job.minSalary} - {job.maxSalary}</div>
      <div className="text-sm text-gray-500 mt-2">Remote: {job.remoteWork ? "Yes" : "No"}</div>

      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-1">Skills Required:</h2>
        <ul className="list-disc list-inside text-gray-700">
          {job.skills?.map((skill, index) => (
            <li key={index}>{skill}</li>
          )) || <li>No skills listed</li>}
        </ul>
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-1">Qualifications:</h2>
        <ul className="list-disc list-inside text-gray-700">
          {job.qualifications?.map((q, index) => (
            <li key={index}>{q}</li>
          )) || <li>No qualifications listed</li>}
        </ul>
      </div>
    </div>
  );
}
