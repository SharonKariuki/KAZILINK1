'use client';

import { useRouter } from 'next/navigation';

export default function RoleCard({ role, description, icon: Icon, redirectTo }) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(redirectTo)}
      className="cursor-pointer p-6 border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center bg-white"
    >
      <Icon className="w-12 h-12 text-blue-600 mb-4" />
      <h3 className="text-xl font-semibold text-black mb-2">{role}</h3>
      <p className="text-center text-black">{description}</p>
    </div>
  );
}
