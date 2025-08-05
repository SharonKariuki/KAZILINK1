"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Sidebar from "@/components/sections/Sidebar";
import DashboardStats from "@/components/sections/DashboardStats";
import CourseManagement from "@/components/sections/CourseManagement";
import UserManagement from "@/components/sections/UserManagement";
import KYCManagement from "@/components/sections/KYCManagement";
import JobPostManagement from "@/components/sections/JobPostManagement";
import ReviewManagement from "@/components/sections/ReviewManagement";
import ContentManagement from "@/components/sections/ContentManagement";
import Analytics from "@/components/sections/Analytics";

const BASE_URL = "http://localhost:5000/api/admin";

const SECTIONS = [
  { name: "Analytics", icon: "📊" },
  { name: "Users", icon: "👥" },
  { name: "KYC", icon: "🆔" },
  { name: "Jobs", icon: "💼" },
  { name: "Reviews", icon: "⭐" },
  { name: "Courses", icon: "📚" },
  { name: "Content", icon: "📝" },
];

export default function DashboardClient() {
  const router = useRouter();
  const [active, setActive] = useState("Analytics");
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");
  const [data, setData] = useState({
    stats: {},
    users: [],
    kycData: [],
    jobs: [],
    reviews: [],
    banners: [],
    courses: [],
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      toast.error("Access denied. Please sign in.");
      return router.push("/auth/signin");
    }

    try {
      const decoded = jwtDecode(storedToken);
      if (decoded.role !== "admin") {
        toast.error("Access denied. Admins only.");
        return router.push("/auth/signin");
      }

      setToken(storedToken);
      fetchData(storedToken);
    } catch (error) {
      console.error("Token decode error:", error);
      toast.error("Invalid token. Please log in again.");
      return router.push("/auth/signin");
    }
  }, []);

  const fetchData = async (authToken) => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${authToken}` };

      const [
        statsRes,
        usersRes,
        kycRes,
        jobsRes,
        reviewsRes,
        bannersRes,
      ] = await Promise.all([
        fetch(`${BASE_URL}/stats`, { headers }),
        fetch(`${BASE_URL}/users`, { headers }),
        fetch(`${BASE_URL}/kyc/pending`, { headers }),
        fetch(`${BASE_URL}/jobs`, { headers }),
        fetch(`${BASE_URL}/reviews`, { headers }),
        fetch(`${BASE_URL}/banners`, { headers }),
      ]);

      const [
        stats,
        users,
        kycData,
        jobs,
        reviews,
        banners,
      ] = await Promise.all([
        statsRes.json(),
        usersRes.json(),
        kycRes.json(),
        jobsRes.json(),
        reviewsRes.json(),
        bannersRes.json(),
      ]);

      setData({ stats, users, kycData, jobs, reviews, banners });
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      toast.error("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const renderSection = () => {
    switch (active) {
      case "Analytics":
        return <Analytics stats={data.stats} loading={loading} />;
      case "Users":
        return <UserManagement users={data.users} refresh={() => fetchData(token)} loading={loading} />;
      case "KYC":
        return <KYCManagement kycData={data.kycData} refresh={() => fetchData(token)} loading={loading} />;
      case "Jobs":
        return <JobPostManagement jobs={data.jobs} refresh={() => fetchData(token)} loading={loading} />;
      case "Reviews":
        return <ReviewManagement reviews={data.reviews} refresh={() => fetchData(token)} loading={loading} />;
      case "Courses":
        return <CourseManagement />;
      case "Content":
        return <ContentManagement banners={data.banners} refresh={() => fetchData(token)} loading={loading} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-indigo-50 pt-16">
      <ToastContainer />
      <Sidebar sections={SECTIONS} active={active} onSelect={setActive} />

      <main className="flex-1 p-6 overflow-x-hidden">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-indigo-900 mb-2">
            {active === "Analytics" ? "Dashboard Overview" : `${active} Management`}
          </h1>
          <p className="text-indigo-600">
            {active === "Analytics"
              ? "Key metrics and platform analytics"
              : `Manage all ${active.toLowerCase()} related activities`}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <>
            {active === "Analytics" && <DashboardStats stats={data.stats} />}
            {renderSection()}
          </>
        )}
      </main>
    </div>
  );
}
