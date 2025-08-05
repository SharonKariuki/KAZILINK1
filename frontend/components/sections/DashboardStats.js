// components/sections/DashboardStats.js
import { FaUsers, FaIdCard, FaBriefcase, FaBook } from "react-icons/fa";

export default function DashboardStats({ stats }) {
  const statCards = [
    {
      label: "Total Users",
      value: stats.users,
      icon: <FaUsers className="text-2xl" />,
      color: "indigo",
      trend: "up",
      change: "12%"
    },
    {
      label: "KYC Applications",
      value: stats.kyc,
      icon: <FaIdCard className="text-2xl" />,
      color: "purple",
      trend: "down",
      change: "5%"
    },
    {
      label: "Active Jobs",
      value: stats.jobs,
      icon: <FaBriefcase className="text-2xl" />,
      color: "amber",
      trend: "up",
      change: "8%"
    },
    {
      label: "Courses",
      value: stats.courses,
      icon: <FaBook className="text-2xl" />,
      color: "green",
      trend: "up",
      change: "15%"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <div 
          key={index} 
          className={`bg-white p-6 rounded-xl shadow-sm border-l-4 ${
            stat.color === 'indigo' ? 'border-l-indigo-500' :
            stat.color === 'purple' ? 'border-l-purple-500' :
            stat.color === 'amber' ? 'border-l-amber-500' : 'border-l-green-500'
          } hover:shadow-md transition-shadow`}
        >
          <div className="flex justify-between">
            <div>
              <p className={`text-sm font-medium ${
                stat.color === 'indigo' ? 'text-indigo-600' :
                stat.color === 'purple' ? 'text-purple-600' :
                stat.color === 'amber' ? 'text-amber-600' : 'text-green-600'
              }`}>
                {stat.label}
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stat.value || 0}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${
              stat.color === 'indigo' ? 'bg-indigo-100 text-indigo-600' :
              stat.color === 'purple' ? 'bg-purple-100 text-purple-600' :
              stat.color === 'amber' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'
            }`}>
              {stat.icon}
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              stat.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {stat.trend === 'up' ? (
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              ) : (
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
              {stat.change}
            </span>
            <span className="text-gray-500 text-xs ml-2">vs last month</span>
          </div>
        </div>
      ))}
    </div>
  );
}