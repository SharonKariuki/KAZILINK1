'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {jwtDecode} from 'jwt-decode'; // Install this: npm install jwt-decode
import RoleCard from '../../components/RoleCard';

function generateOrbs(count) {
  return Array.from({ length: count }, () => ({
    width: Math.random() * 300 + 100,
    height: Math.random() * 300 + 100,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    x: Math.random() * 100 - 50,
    y: Math.random() * 100 - 50,
    duration: Math.random() * 20 + 20,
  }));
}

export default function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [orbs, setOrbs] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [token, setToken] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setIsClient(true);
    setOrbs(generateOrbs(8));
    const t = searchParams.get('token');
    if (t) setToken(t);
  }, [searchParams]);

  const roles = [
    {
      title: "Employer",
      description: "I'm looking to hire or manage talent.",
      image: "/images/recruiter.png"
    },
    {
      title: "Job Seeker",
      description: "I'm looking for job opportunities.",
      image: "/images/jobseeker.png"
    }
  ];

  const handleContinue = async () => {
    if (!selectedRole || !token) {
      alert('Missing role or token. Please try again.');
      return;
    }

    try {
      const decoded = jwtDecode(token); // Safely decode JWT
      const userId = decoded.id;
      const roleValue = selectedRole === 'Employer' ? 'employer' : 'worker';

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/set-role`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: roleValue })
      });

      const data = await res.json();

      if (res.ok) {
       router.push(`/${selectedRole === 'Employer' ? 'EmployerRegistration' : 'WorkerRegistration'}?token=${token}`);
      } else {
        alert(data.message || 'Failed to set role.');
        console.error('Set role error:', data);
      }

    } catch (err) {
      console.error('Role selection error:', err);
      alert('Unexpected error, please try again later.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-100 p-6 overflow-hidden relative">
      {isClient && (
        <div className="absolute inset-0 overflow-hidden opacity-30 z-0">
          {orbs.map((orb, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-blue-700 shadow-lg"
              style={{
                width: orb.width,
                height: orb.height,
                left: orb.left,
                top: orb.top,
              }}
              animate={{
                x: [0, orb.x],
                y: [0, orb.y],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: orb.duration,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            />
          ))}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 bg-white/80 backdrop-blur-md border border-indigo-200 rounded-2xl p-8 max-w-3xl w-full shadow-xl"
      >
        <div className="text-center mb-10">
          <motion.h1
            className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-blue-700"
            initial={{ y: -10 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Welcome to KaziLink
          </motion.h1>
          <motion.p
            className="text-indigo-900 text-lg mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Select your role to get started
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map((role) => (
            <RoleCard
              key={role.title}
              title={role.title}
              description={role.description}
              image={role.image}
              isSelected={selectedRole === role.title}
              onSelect={() => setSelectedRole(role.title)}
            />
          ))}
        </div>

        <AnimatePresence>
          {selectedRole && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mt-10 text-center"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleContinue}
                className="px-8 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-indigo-700 to-blue-700 shadow-md hover:shadow-lg transition-all"
              >
                Continue as {selectedRole}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
