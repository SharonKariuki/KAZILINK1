// components/sections/Analytics.js
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Analytics({ stats, loading }) {
  const barData = {
    labels: ['Users', 'Workers', 'Employers', 'Verified', 'Jobs'],
    datasets: [
      {
        label: 'Platform Statistics',
        data: [
          stats.totalUsers || 0,
          stats.workers || 0,
          stats.employers || 0,
          stats.verifiedWorkers || 0,
          stats.jobs || 0
        ],
        backgroundColor: [
          'rgba(99, 102, 241, 0.7)',
          'rgba(79, 70, 229, 0.7)',
          'rgba(67, 56, 202, 0.7)',
          'rgba(55, 48, 163, 0.7)',
          'rgba(49, 46, 129, 0.7)'
        ],
        borderColor: [
          'rgba(99, 102, 241, 1)',
          'rgba(79, 70, 229, 1)',
          'rgba(67, 56, 202, 1)',
          'rgba(55, 48, 163, 1)',
          'rgba(49, 46, 129, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels: ['Active Users', 'Inactive Users', 'Pending Verification'],
    datasets: [
      {
        data: [
          stats.activeUsers || 0,
          stats.inactiveUsers || 0,
          stats.pendingVerification || 0
        ],
        backgroundColor: [
          'rgba(99, 102, 241, 0.7)',
          'rgba(220, 38, 38, 0.7)',
          'rgba(234, 179, 8, 0.7)'
        ],
        borderColor: [
          'rgba(99, 102, 241, 1)',
          'rgba(220, 38, 38, 1)',
          'rgba(234, 179, 8, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <section className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100">
          <h3 className="text-lg font-semibold text-indigo-900 mb-4">User Distribution</h3>
          <div className="h-64">
            <Bar 
              data={barData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                },
              }}
            />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100">
          <h3 className="text-lg font-semibold text-indigo-900 mb-4">User Status</h3>
          <div className="h-64">
            <Pie 
              data={pieData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          label="Total Users" 
          value={stats.totalUsers} 
          icon="👥"
          trend="up"
          change="12%"
          color="indigo"
        />
        <StatCard 
          label="Active Jobs" 
          value={stats.activeJobs} 
          icon="💼"
          trend="up"
          change="5%"
          color="purple"
        />
        <StatCard 
          label="Pending KYC" 
          value={stats.pendingKYC} 
          icon="🆔"
          trend="down"
          change="8%"
          color="amber"
        />
      </div>
    </section>
  );
}

function StatCard({ label, value, icon, trend, change, color }) {
  const colorClasses = {
    indigo: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      icon: 'bg-indigo-100 text-indigo-600'
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      icon: 'bg-purple-100 text-purple-600'
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      icon: 'bg-amber-100 text-amber-600'
    }
  };

  return (
    <div className={`${colorClasses[color].bg} p-6 rounded-xl shadow-sm border border-transparent hover:border-${color}-200 transition-all`}>
      <div className="flex justify-between items-start">
        <div>
          <p className={`text-sm font-medium ${colorClasses[color].text}`}>{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value || 0}</p>
        </div>
        <div className={`${colorClasses[color].icon} p-3 rounded-lg`}>
          <span className="text-xl">{icon}</span>
        </div>
      </div>
      <div className="mt-4 flex items-center">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {trend === 'up' ? (
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
          {change}
        </span>
        <span className="text-gray-500 text-xs ml-2">vs last week</span>
      </div>
    </div>
  );
}