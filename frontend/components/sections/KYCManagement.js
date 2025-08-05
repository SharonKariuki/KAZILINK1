"use client";

import { useState } from "react";
import { FaIdCard, FaUserCircle } from "react-icons/fa";
import { toast } from "react-toastify";

const BACKEND_URL = "http://localhost:5000"; // 🔁 Can be replaced with env var

export default function KYCManagement({ kycData, refresh, loading }) {
  const handleKYCAction = async (workerId, action) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/kyc/${workerId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ action }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Something went wrong");

      toast.success(`KYC ${action === "approve" ? "approved" : "rejected"} successfully.`);
      refresh();
    } catch (err) {
      toast.error(err.message || "Failed to update KYC status");
    }
  };

  return (
    <section className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-indigo-900">KYC Submissions</h2>
          <div className="text-sm text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            {kycData.length} Pending
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : kycData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg font-medium text-gray-700">No pending KYC submissions.</p>
            <p className="text-sm text-gray-500">New user documents will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {kycData.map((worker) => (
              <div
                key={worker._id}
                className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
              >
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium text-gray-900">
                      {worker.firstName} {worker.lastName}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-900">{worker.email}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Submitted</p>
                    <p className="text-gray-900">
                      {worker.submittedAt
                        ? new Date(worker.submittedAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Documents</p>
                    <div className="flex flex-col space-y-1 text-sm">
                      {worker.idFront && (
                        <a
                          href={`${BACKEND_URL}/uploads/${worker.idFront}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:underline flex items-center"
                        >
                          <FaIdCard className="mr-1" /> ID Front
                        </a>
                      )}
                      {worker.idBack && (
                        <a
      href={`http://localhost:5000/uploads/${worker.idBack}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-indigo-600 hover:underline flex items-center"
    >
      <FaIdCard className="mr-1" /> ID Back
    </a>

                      )}
                      {worker.selfie && (
                      <a
      href={`http://localhost:5000/uploads/${worker.selfie}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-indigo-600 hover:underline flex items-center"
    >
      <FaUserCircle className="mr-1" /> Selfie
    </a>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => handleKYCAction(worker._id, "approve")}
                      className="bg-green-500 text-white text-sm px-3 py-1 rounded hover:bg-green-600"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleKYCAction(worker._id, "reject")}
                      className="bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
