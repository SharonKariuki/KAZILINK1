"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  FiBriefcase,
  FiMapPin,
  FiDollarSign,
  FiFileText,
  FiCheckCircle,
  FiArrowLeft,
  FiPlus,
  FiX,
} from "react-icons/fi";

export default function JobPostForm() {
  const [formData, setFormData] = useState({
    jobTitle: "",
    location: "",
    latitude: "",
    longitude: "",
    jobType: "",
    yearsOfExperience: "",
    minSalary: "",
    maxSalary: "",
    remoteWork: "",
    jobDescription: "",
    qualifications: "",
  });

  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("You must be logged in to post a job.");

      // Prepare numeric values for lat/lng
      const latitude = formData.latitude ? parseFloat(formData.latitude) : null;
      const longitude = formData.longitude ? parseFloat(formData.longitude) : null;

      const payload = {
        jobTitle: formData.jobTitle,
        location: formData.location,
        jobType: formData.jobType,
        yearsOfExperience: parseInt(formData.yearsOfExperience, 10),
        minSalary: formData.minSalary ? parseFloat(formData.minSalary) : null,
        maxSalary: formData.maxSalary ? parseFloat(formData.maxSalary) : null,
        remoteWork: formData.remoteWork,
        jobDescription: formData.jobDescription,
        qualifications: formData.qualifications,
        skills,
        geoLocation: {
          type: "Point",
          coordinates: longitude != null && latitude != null
            ? [longitude, latitude]
            : undefined,
          city: formData.location,
        },
      };

      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to post job");
      }

      setSuccess(true);
      setFormData({
        jobTitle: "",
        location: "",
        latitude: "",
        longitude: "",
        jobType: "",
        yearsOfExperience: "",
        minSalary: "",
        maxSalary: "",
        remoteWork: "",
        jobDescription: "",
        qualifications: "",
      });
      setSkills([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-5">
      <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center gap-2 text-blue-100 hover:underline mb-2"
      >
        <FiArrowLeft className="w-4 h-4" />
        Back
      </button>
            <h2 className="text-2xl font-bold text-white">Post a New Job Opportunity</h2>
            <p className="mt-1 text-indigo-100">
              Fill out the form below to list your job opening
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-8 space-y-8">
            {/* Job Details */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-indigo-800 border-b border-indigo-100 pb-2">
                <FiBriefcase className="inline mr-2" />
                Job Details
              </h3>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    id="jobTitle"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full py-3 text-black px-3 border border-gray-300 rounded-md"
                    placeholder="e.g. Electrician"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Location (City) *
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full py-3 px-3 border text-black border-gray-300 rounded-md"
                    placeholder="e.g. Nairobi"
                  />
                </div>

                {/* NEW Latitude
                <div>
                  <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
                    Latitude *
                  </label>
                  <input
                    type="number"
                    id="latitude"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    required
                    step="any"
                    className="mt-1 block w-full py-3 px-3 border border-gray-300 rounded-md"
                    placeholder="e.g. -1.2921"
                  />
                </div> */}

                {/* NEW Longitude */}
                {/* <div>
                  <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
                    Longitude *
                  </label>
                  <input
                    type="number"
                    id="longitude"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    required
                    step="any"
                    className="mt-1 block w-full py-3 px-3 border border-gray-300 rounded-md"
                    placeholder="e.g. 36.8219"
                  />
                </div> */}

                <div>
                  <label htmlFor="jobType" className="block text-sm font-medium text-gray-700">
                    Job Type *
                  </label>
                  <select
                    id="jobType"
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full text-black py-3 px-3 border border-gray-300 rounded-md"
                  >
                    <option value="">Select job type</option>
                    <option>Full-Time</option>
                    <option>Part-Time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                    <option>Temporary</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700">
                    Years of Experience Required *
                  </label>
                  <input
                    type="number"
                    id="yearsOfExperience"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleChange}
                    required
                    min="0"
                    className="mt-1 block w-full py-3 text-black px-3 border border-gray-300 rounded-md"
                    placeholder="e.g. 3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Salary Range (optional)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      name="minSalary"
                      value={formData.minSalary}
                      onChange={handleChange}
                      className="w-1/2 py-3 px-3 border  text-black border-gray-300 rounded-md"
                      placeholder="Minimum"
                    />
                    <input
                      type="number"
                      name="maxSalary"
                      value={formData.maxSalary}
                      onChange={handleChange}
                      className="w-1/2 py-3 px-3 border text-black border-gray-300 rounded-md"
                      placeholder="Maximum"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="remoteWork" className="block text-sm font-medium text-gray-700">
                    Remote Work Option *
                  </label>
                  <select
                    id="remoteWork"
                    name="remoteWork"
                    value={formData.remoteWork}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full py-3 px-3 text-black border border-gray-300 rounded-md"
                  >
                    <option value="">Select option</option>
                    <option>On-site only</option>
                    <option>Hybrid</option>
                    <option>Remote only</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700">
                    Job Description *
                  </label>
                  <textarea
                    id="jobDescription"
                    name="jobDescription"
                    rows={4}
                    value={formData.jobDescription}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 text-black rounded-md shadow-sm"
                    placeholder="Describe responsibilities and expectations..."
                  />
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-indigo-800 border-b border-indigo-100 pb-2">
                <FiFileText className="inline mr-2" />
                Requirements
              </h3>

              <div className="grid grid-cols-1 gap-6">
                {/* Skills */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 ">Required Skills *</label>
                  <div className="flex gap-4 mb-3">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      placeholder="Enter a skill"
                      className="flex-1 px-4 py-2.5 rounded-lg border text-black border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm flex items-center"
                      >
                        {skill}
                        <button
                          type="button"
                          className="ml-2 text-red-500 hover:text-red-700"
                          onClick={() => removeSkill(skill)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Submit */}
            <div className="pt-6 border-t border-gray-200">
              {error && (
                <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">{error}</div>
              )}
              {success && (
                <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
                  Job posted successfully!
                </div>
              )}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading ? "Posting..." : "Post Job"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
