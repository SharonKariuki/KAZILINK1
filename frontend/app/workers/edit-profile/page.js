"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditWorkerProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    skills: "",
    experience: "",
    hourlyRate: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:5000/api/workers/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setForm({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          skills: data.skills?.join(", ") || "",
          experience: data.experience || "",
          hourlyRate: data.hourlyRate || "",
        });
      });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // Convert skills string to array
    const workerData = {
      ...form,
      skills: form.skills.split(",").map(skill => skill.trim()),
      hourlyRate: Number(form.hourlyRate),
    };

    await fetch(`http://localhost:5000/api/workers/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(workerData),
    });

    router.push("/worker/dashboard");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-blue-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow w-full max-w-lg space-y-4"
      >
        <h1 className="text-2xl font-bold text-blue-700">Edit Profile</h1>
        <input
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          placeholder="First Name"
          className="w-full border border-gray-300 p-2 rounded"
          required
        />
        <input
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          className="w-full border border-gray-300 p-2 rounded"
          required
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          type="email"
          placeholder="Email"
          className="w-full border border-gray-300 p-2 rounded"
          required
        />
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="w-full border border-gray-300 p-2 rounded"
        />
        <input
          name="skills"
          value={form.skills}
          onChange={handleChange}
          placeholder="Skills (comma separated)"
          className="w-full border border-gray-300 p-2 rounded"
        />
        <input
          name="experience"
          value={form.experience}
          onChange={handleChange}
          placeholder="Experience (years)"
          type="number"
          className="w-full border border-gray-300 p-2 rounded"
        />
        <input
          name="hourlyRate"
          value={form.hourlyRate}
          onChange={handleChange}
          placeholder="Hourly Rate ($)"
          type="number"
          step="0.01"
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