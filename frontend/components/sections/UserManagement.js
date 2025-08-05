"use client";

import { useState, useMemo } from "react";
import {
  FaStar,
  FaShieldAlt,
  FaSearch,
  FaFilter,
  FaSort,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";

export default function UserManagement({ users, refresh, loading }) {
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortDir, setSortDir] = useState("asc");

  const safeUsers = Array.isArray(users) ? users : [];

  const filtered = useMemo(() => {
    const s = search.toLowerCase();

    let arr = safeUsers.filter(
      (u) =>
        `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase().includes(s) ||
        (u.email || "").toLowerCase().includes(s)
    );

    if (filterRole) {
      arr = arr.filter((u) => u.role === filterRole);
    }

    arr.sort((a, b) => {
      if (sortBy === "rating") {
        return sortDir === "asc"
          ? (a.rating || 0) - (b.rating || 0)
          : (b.rating || 0) - (a.rating || 0);
      }
      if (sortBy === "date") {
        return sortDir === "asc"
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : new Date(b.createdAt) - new Date(a.createdAt);
      }

      const na = `${a.firstName || ""} ${a.lastName || ""}`.toLowerCase();
      const nb = `${b.firstName || ""} ${b.lastName || ""}`.toLowerCase();
      return sortDir === "asc"
        ? na.localeCompare(nb)
        : nb.localeCompare(na);
    });

    return arr;
  }, [safeUsers, search, filterRole, sortBy, sortDir]);

  const updateStatus = async (id, action) => {
    const profileApproved = action === "approve";

    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileApproved }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          alert(errorData.message || "Failed to update user status");
        } catch {
          alert(errorText || "Failed to update user status");
        }
        return;
      }

      refresh();
    } catch (error) {
      alert(error.message || "Failed to update user status");
    }
  };

  const getUserStatusBadge = (status) => {
  switch (status) {
    case "approved":
      return (
        <FaShieldAlt className="text-indigo-600 text-xl" title="Trusted User" />
      );
    case "rejected":
      return (
        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
          Rejected
        </span>
      );
    default:
      return (
        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
          Pending
        </span>
      );
  }
};


  return (
    <section className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-indigo-900">User Management</h2>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 min-w-[200px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {/* <FaSearch className="text-black pl-6" /> */}
              </div>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users..."
                className="pl-10 pr-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full"
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="pl-3 pr-8 text-black py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
            >
              <option value="">All Roles</option>
              <option value="worker">Worker</option>
              <option value="employer">Employer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-indigo-50">
                <tr>
                  <th
                    onClick={() => {
                      setSortBy("name");
                      setSortDir(sortDir === "asc" ? "desc" : "asc");
                    }}
                    className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider cursor-pointer"
                  >
                    <div className="flex items-center">
                      Name
                      {sortBy === "name" ? (
                        sortDir === "asc" ? (
                          <FaSortUp className="ml-1" />
                        ) : (
                          <FaSortDown className="ml-1" />
                        )
                      ) : (
                        <FaSort className="ml-1 text-gray-400" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">Role</th>
                  <th
                    onClick={() => {
                      setSortBy("rating");
                      setSortDir(sortDir === "asc" ? "desc" : "asc");
                    }}
                    className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider cursor-pointer"
                  >
                    <div className="flex items-center">
                      Rating
                      {sortBy === "rating" ? (
                        sortDir === "asc" ? (
                          <FaSortUp className="ml-1" />
                        ) : (
                          <FaSortDown className="ml-1" />
                        )
                      ) : (
                        <FaSort className="ml-1 text-gray-400" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.length > 0 ? (
                  filtered.map((u) => (
                    <tr key={u._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                        <a
  href={`/dashboard/${u.role}/${u._id}`}
  className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium hover:underline"
  title="Go to dashboard"
>
  {u.firstName?.charAt(0)}
  {u.lastName?.charAt(0)}
</a>

                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {u.firstName} {u.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{u.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {u.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            u.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : u.role === "employer"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900 mr-1">
                            {(u.rating || 5).toFixed(1)}
                          </span>
                          <FaStar className="text-yellow-400" />
                        </div>
                      </td>
                    <td className="px-6 py-4 whitespace-nowrap">
  {u.profileApproved ? (
    <FaShieldAlt className="text-indigo-600 text-xl" title="Trusted User" />
  ) : (
    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
      Pending
    </span>
  )}
</td>


                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
  <div className="flex space-x-2">
    {u.profileApproved ? (
      <button
        onClick={() => updateStatus(u._id, "reject")}
        className="text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg text-sm font-medium transition-colors"
      >
        Remove Approval
      </button>
    ) : (
      <>
        <button
          onClick={() => updateStatus(u._id, "approve")}
          className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-lg text-sm font-medium transition-colors"
        >
          Approve
        </button>
        <button
          onClick={() => updateStatus(u._id, "reject")}
          className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg text-sm font-medium transition-colors"
        >
          Reject
        </button>
      </>
    )}
  </div>
</td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                      No users found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Inline Review Section Below Table */}
            {filtered.map(
              (u) =>
                u.role === "worker" &&
                u.worker?.reviews?.length > 0 && (
                  <div key={u._id} className="bg-gray-50 p-4 mt-2 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2 text-gray-800">
                      Reviews for {u.firstName} {u.lastName}
                    </h4>
                    <ul className="space-y-2">
                      {u.worker.reviews.map((r, i) => (
                        <li key={i} className="border p-3 rounded-md bg-white shadow-sm">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium text-gray-900">{r.reviewer}</span>
                            <span className="flex items-center text-yellow-500 text-sm">
                              {[...Array(r.rating)].map((_, i) => (
                                <FaStar key={i} />
                              ))}
                              <span className="ml-2 text-gray-600">{r.rating}</span>
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{r.comment}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
            )}
          </div>
        )}
      </div>
    </section>
  );
}
