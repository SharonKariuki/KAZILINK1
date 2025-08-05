// components/sections/Sidebar.js
import Link from "next/link";

export default function Sidebar({ sections, active, onSelect }) {
  return (
    <aside className="w-64 bg-indigo-900 text-white shadow-xl">
      <div className="p-6">
        <h2 className="text-2xl font-bold flex items-center">
          <span className="bg-indigo-600 p-2 rounded-lg mr-3">⚡</span>
          Admin Panel
        </h2>
      </div>
      <nav className="flex flex-col p-4 space-y-2">
        {sections.map((sec) => (
          <button
            key={sec.name}
            onClick={() => onSelect(sec.name)}
            className={`flex items-center px-4 py-3 rounded-lg transition-all ${
              active === sec.name
                ? 'bg-indigo-700 text-white font-semibold shadow-md'
                : 'hover:bg-indigo-800 hover:text-white'
            }`}
          >
            <span className="text-lg mr-3">{sec.icon}</span>
            <span>{sec.name}</span>
            {active === sec.name && (
              <span className="ml-auto h-2 w-2 bg-white rounded-full"></span>
            )}
          </button>
        ))}
      </nav>
      <div className="p-4 mt-auto border-t border-indigo-800">
        <div className="flex items-center justify-between text-indigo-300">
          <span>Admin User</span>
          <button className="p-2 rounded-full hover:bg-indigo-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}