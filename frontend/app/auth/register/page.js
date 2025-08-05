'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaGoogle } from 'react-icons/fa';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import AuthLayout from '@/components/AuthLayout';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { firstName, lastName, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Verification email sent! Please check your inbox.');
        router.push('/signin');
      } else {
        toast.error(data.message || 'Signup failed');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again later.');
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const form = (
    <form onSubmit={handleSubmit} autoComplete="off">
      {/* Google Signup Button */}
      <div id="googleSignUp" className="mb-8">
        <button
          type="button"
          className="w-full flex items-center justify-center space-x-3 py-3.5 px-6 border border-blue-200 rounded-xl hover:border-blue-300 bg-white shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
        >
          <FaGoogle className="text-[#EA4335] text-xl" />
          <span className="text-sm font-medium text-gray-700">Sign up with Google</span>
        </button>
      </div>

      <div className="relative mb-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-blue-100"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="px-3 bg-white text-sm text-blue-500 font-medium">
            or sign up with email
          </span>
        </div>
      </div>

      <div className="space-y-5">
        {/* Text Inputs */}
        {[
          { name: 'firstName', placeholder: 'First Name', type: 'text' },
          { name: 'lastName', placeholder: 'Last Name', type: 'text' },
          { name: 'email', placeholder: 'Email Address', type: 'email', autoComplete: 'off' },
        ].map(({ name, placeholder, type, autoComplete = 'off' }) => (
          <input
            key={name}
            type={type}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            placeholder={placeholder}
            autoComplete={autoComplete}
            required
            className="block w-full px-4 py-3.5 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-300 bg-blue-50 text-blue-900 placeholder-blue-400 shadow-sm hover:shadow-md transition-all duration-300"
          />
        ))}

        {/* Password Input */}
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            required
            className="block w-full px-4 py-3.5 pr-12 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-300 bg-blue-50 text-blue-900 placeholder-blue-400 shadow-sm hover:shadow-md transition-all duration-300"
          />
          <span
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-blue-400"
          >
            {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
          </span>
        </div>

        {/* Confirm Password Input */}
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
            required
            className="block w-full px-4 py-3.5 pr-12 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-300 bg-blue-50 text-blue-900 placeholder-blue-400 shadow-sm hover:shadow-md transition-all duration-300"
          />
          <span
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-blue-400"
          >
            {showConfirmPassword ? <MdVisibilityOff /> : <MdVisibility />}
          </span>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
        >
          {isLoading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </div>
    </form>
  );

  const aside = (
    <>
      <h2 className="text-3xl font-semibold mb-4">Already have an account?</h2>
      <div className="w-16 h-1.5 bg-blue-400 bg-opacity-50 mx-auto mb-8 rounded-full"></div>
      <p className="mb-10 text-blue-100 leading-relaxed text-opacity-90">
        Sign in and reconnect with opportunities around you.
      </p>
      <a href="/auth/login">
        <button className="inline-block px-8 py-3 border-2 border-blue-300 text-white font-medium rounded-xl shadow-lg hover:bg-white hover:bg-opacity-10 hover:shadow-xl hover:border-white transition-all duration-300 transform hover:-translate-y-0.5 hover:text-blue-300">
          Sign In
        </button>
      </a>
    </>
  );

  return <AuthLayout title="Create Your Account" form={form} aside={aside} />;
}