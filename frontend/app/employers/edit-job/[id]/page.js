"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    salaryMin: "",
    salaryMax: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:5000/api/jobs/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setForm({
          title: data.title,
          description: data.description,
          location: data.location,
          salaryMin: data.salaryMin,
          salaryMax: data.salaryMax,
        });
      });
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    await fetch(`http://localhost:5000/api/jobs/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    router.push("/employers/dashboard");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-blue-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow w-full max-w-lg space-y-4"
      >
        <h1 className="text-2xl font-bold text-blue-700">Edit Job</h1>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full border border-gray-300 p-2 rounded"
          required
        />
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
          className="w-full border border-gray-300 p-2 rounded"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border border-gray-300 p-2 rounded"
          required
        ></textarea>
        <input
          name="salaryMin"
          value={form.salaryMin}
          onChange={handleChange}
          placeholder="Min Salary"
          type="number"
          className="w-full border border-gray-300 p-2 rounded"
        />
        <input
          name="salaryMax"
          value={form.salaryMax}
          onChange={handleChange}
          placeholder="Max Salary"
          type="number"
          className="w-full border border-gray-300 p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
        >
          Save Changes
        </button>
      </form>
    </main>
  );
}
