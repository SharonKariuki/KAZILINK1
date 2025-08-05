'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaRegEnvelope } from 'react-icons/fa';
import { MdLockOutline } from 'react-icons/md';
import AuthLayout from '@/components/AuthLayout';

export default function SignInPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        alert('Login successful!');

        if (data.user.role === 'employer') {
          router.push('/employers/dashboard');
        } else if (data.user.role === 'worker') {
          router.push('/workers/dashboard');
        } else {
          router.push('/dashboard');
        }
      } else {
        alert(data.msg || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Something went wrong. Please try again later.');
    }
  };

  const form = (
    <form onSubmit={handleSubmit}>
      <div className="space-y-5">
        {/* Email Input */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-95 flex items-center pointer-events-none">
            <FaRegEnvelope className="h-5 w-5 text-blue-400" />
          </div>
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            required
            className="block w-full pl-10 pr-4 py-3.5 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-300 bg-blue-50 text-blue-900 placeholder-blue-400 shadow-sm hover:shadow-md transition-all duration-300"
          />
        </div>

        {/* Password Input */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-95 flex items-center pointer-events-none">
            <MdLockOutline className="h-5 w-5 text-blue-400" />
          </div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="block w-full pl-10 pr-4 py-3.5 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-300 bg-blue-50 text-blue-900 placeholder-blue-400 shadow-sm hover:shadow-md transition-all duration-300"
          />
        </div>

        {/* Remember Me + Forgot */}
        <div className="flex items-center justify-between text-sm text-blue-700">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              name="remember"
              className="h-4 w-4 text-blue-600 focus:ring-blue-400 border-blue-300 rounded"
            />
            <span>Remember me</span>
          </label>
          <a href="#" className="text-blue-600 hover:text-blue-800 hover:underline">
            Forgot password?
          </a>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
        >
          Sign In
        </button>
      </div>
    </form>
  );

  const aside = (
    <>
      <h2 className="text-3xl font-semibold mb-4">New to KaziLink?</h2>
      <div className="w-16 h-1.5 bg-blue-400 bg-opacity-50 mx-auto mb-8 rounded-full"></div>
      <p className="mb-10 text-blue-100 leading-relaxed text-opacity-90">
        Join our professional community today and unlock new opportunities.
      </p>
      <a href="/signup">
        <button className="inline-block px-8 py-3 border-2 border-blue-300 text-white font-medium rounded-xl shadow-lg hover:bg-white hover:bg-opacity-10 hover:shadow-xl hover:border-white transition-all duration-300 transform hover:-translate-y-0.5 hover:text-blue-300">
          Create Account
        </button>
      </a>
    </>
  );

  return <AuthLayout title="Welcome Back" form={form} aside={aside} />;
}

