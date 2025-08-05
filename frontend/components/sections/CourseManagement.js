"use client";

import { useState, useEffect } from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

export default function CourseManagement({ initialCourses }) {
  const [courses, setCourses] = useState(initialCourses || []);

  const [editingId, setEditingId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    published: false,
    externalUrl: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    try {
      const res = await fetch("/api/courses", { cache: "no-store" });
      if (!res.ok) {
        console.error("Failed to fetch courses:", res.statusText);
        return;
      }
      const data = await res.json();
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  }

  const handleAddSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("title", newCourse.title);
      formData.append("description", newCourse.description);
      formData.append("published", newCourse.published.toString()); // ✅ fix here!
      if (newCourse.externalUrl) {
        formData.append("externalUrl", newCourse.externalUrl);
      }
      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      const res = await fetch("http://localhost:5000/api/courses", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        console.error("Error adding course:", res.statusText);
      } else {
        console.log("Course added successfully");
      }
    } catch (err) {
      console.error("Error adding course:", err);
    }

    setIsAdding(false);
    setNewCourse({
      title: "",
      description: "",
      published: false,
      externalUrl: "",
    });
    setSelectedFile(null);

    fetchCourses();
  };

  const handleEditSubmit = async (courseId) => {
    try {
      const res = await fetch(`/api/courses/${courseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update",
          title: editedTitle,
          description: editedDescription,
        }),
      });

      if (!res.ok) {
        console.error("Error updating course:", res.statusText);
      } else {
        console.log("Course updated successfully");
      }
    } catch (err) {
      console.error("Error updating course:", err);
    }

    setEditingId(null);
    fetchCourses();
  };

  const handleStatusChange = async (courseId, action) => {
    try {
      const res = await fetch(`/api/courses/${courseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
        }),
      });

      if (!res.ok) {
        console.error("Error changing status:", res.statusText);
      } else {
        console.log("Status changed successfully");
      }
    } catch (err) {
      console.error("Error changing course status:", err);
    }

    fetchCourses();
  };

  const confirmDelete = (courseId) => {
    confirmAlert({
      title: "Confirm Delete",
      message: "Are you sure you want to delete this course?",
      buttons: [
        {
          label: "Delete",
          onClick: () => handleDelete(courseId),
        },
        {
          label: "Cancel",
        },
      ],
    });
  };

  const handleDelete = async (courseId) => {
    console.log("Deleting course ID:", courseId);

    try {
      const res = await fetch(`/api/courses/${courseId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        console.error("Error deleting course:", res.statusText);
      } else {
        console.log("Course deleted successfully");
      }
    } catch (err) {
      console.error("Error deleting course:", err);
    }

    fetchCourses();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Course Management</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium"
        >
          Add New Course
        </button>
      </div>

      {isAdding && (
        <div className="border border-indigo-100 rounded-lg p-6 bg-white shadow-sm">
          <h3 className="font-semibold mb-4 text-lg text-gray-900">
            Add New Course
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={newCourse.title}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, title: e.target.value })
                }
                className="w-full p-2 border border-indigo-200 rounded text-gray-900"
                placeholder="Course title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={newCourse.description}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, description: e.target.value })
                }
                className="w-full p-2 border border-indigo-200 rounded text-gray-900"
                placeholder="Course description"
                rows="3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                External URL
              </label>
              <input
                type="url"
                value={newCourse.externalUrl}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, externalUrl: e.target.value })
                }
                className="w-full p-2 border border-indigo-200 rounded text-gray-900"
                placeholder="https://example.com/course"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload PDF
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="w-full text-gray-700"
              />
              {selectedFile && (
                <p className="text-sm text-gray-600 mt-1">
                  Selected file: {selectedFile.name}
                </p>
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="published"
                checked={newCourse.published}
                onChange={(e) =>
                  setNewCourse({
                    ...newCourse,
                    published: e.target.checked,
                  })
                }
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="published"
                className="ml-2 block text-sm text-gray-700"
              >
                Publish immediately
              </label>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
              >
                Add Course
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.length === 0 && (
          <p className="text-gray-600">No courses found.</p>
        )}
        {courses.map((course) => (
          <div
            key={course._id}
            className="border border-indigo-100 rounded-lg p-4 hover:shadow-md transition-shadow flex flex-col bg-white"
          >
            {editingId === course._id ? (
              <div className="flex-grow">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="w-full p-2 mb-2 border border-indigo-200 rounded text-gray-900"
                  placeholder="Course title"
                />
                <textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="w-full p-2 mb-2 border border-indigo-200 rounded text-gray-900"
                  placeholder="Course description"
                  rows="3"
                />
              </div>
            ) : (
              <div className="flex-grow">
                <h3 className="font-semibold mb-2 text-gray-900">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-800 mb-3 line-clamp-3">
                  {course.description}
                </p>
                {course.externalUrl && (
                  <a
                    href={course.externalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-700 text-sm hover:underline block mb-2"
                  >
                    View External Resource
                  </a>
                )}
                {course.fileUrl && (
                  <a
                    href={course.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-green-700 text-sm hover:underline block mb-2"
                  >
                    View PDF
                  </a>
                )}
              </div>
            )}

            <div className="flex justify-between items-center mt-auto">
              <span
                className={`text-sm font-medium ${
                  course.published ? "text-green-600" : "text-gray-600"
                }`}
              >
                {course.published ? "Published" : "Draft"}
              </span>

              <div className="flex gap-2">
                {editingId === course._id ? (
                  <>
                    <button
                      onClick={() => handleEditSubmit(course._id)}
                      className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 font-medium"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md text-sm hover:bg-gray-300 font-medium"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() =>
                        handleStatusChange(
                          course._id,
                          course.published ? "unpublish" : "publish"
                        )
                      }
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        course.published
                          ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                          : "bg-green-100 text-green-800 hover:bg-green-200"
                      }`}
                    >
                      {course.published ? "Unpublish" : "Publish"}
                    </button>
                    <button
                      onClick={() => {
                        setEditedTitle(course.title);
                        setEditedDescription(course.description);
                        setEditingId(course._id);
                      }}
                      className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-md text-sm hover:bg-indigo-200 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(course._id)}
                      className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm hover:bg-red-200 font-medium"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

