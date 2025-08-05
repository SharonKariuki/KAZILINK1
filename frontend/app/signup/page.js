'use client';

import { useState } from 'react';
import { FaGoogle } from 'react-icons/fa';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthLayout from '@/components/AuthLayout';

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');

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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ firstName, lastName, email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setUserEmail(email);
        setSuccessMessage('🎉 Account created successfully! Please check your email to verify your account.');
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

  const handleResendVerification = async () => {
    if (!userEmail) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/resend-verification`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ email: userEmail }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success('Verification email resent! Check your inbox.');
      } else {
        toast.error(data.message || 'Failed to resend verification email.');
      }
    } catch (err) {
      toast.error('An error occurred. Please try again.');
      console.error('Resend error:', err);
    }
  };

  const form = (
    <form onSubmit={handleSubmit} autoComplete="off">
     

      <div className="relative mb-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-blue-100"></div>
        </div>
        <div className="relative flex justify-center">
          
        </div>
      </div>

      <div className="space-y-5">
        {[{ name: 'firstName', placeholder: 'First Name' },
          { name: 'lastName', placeholder: 'Last Name' },
          { name: 'email', placeholder: 'Email Address', type: 'email' }]
          .map(({ name, placeholder, type = 'text' }) => (
            <input
              key={name}
              name={name}
              type={type}
              placeholder={placeholder}
              value={formData[name]}
              onChange={handleChange}
              required
              className="w-full px-4 py-3.5 border border-blue-200 rounded-xl bg-blue-50 text-blue-900 placeholder-blue-400 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 shadow-sm hover:shadow-md transition duration-300"
            />
          ))}

        <div className="relative">
          <input
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3.5 pr-12 border border-blue-200 rounded-xl bg-blue-50 text-blue-900 placeholder-blue-400 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 shadow-sm hover:shadow-md transition duration-300"
          />
          <span
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-blue-400"
          >
            {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
          </span>
        </div>

        <div className="relative">
          <input
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full px-4 py-3.5 pr-12 border border-blue-200 rounded-xl bg-blue-50 text-blue-900 placeholder-blue-400 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 shadow-sm hover:shadow-md transition duration-300"
          />
          <span
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-blue-400"
          >
            {showConfirmPassword ? <MdVisibilityOff /> : <MdVisibility />}
          </span>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-0.5"
        >
          {isLoading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </div>
    </form>
  );

 
const successUI = (
  <div className="text-center space-y-6 py-10 px-6">
    <div className="text-4xl text-green-600">🎉</div>
    <h3 className="text-2xl font-bold text-gray-800">
      Account created successfully!
    </h3>
    <p className="text-gray-600 max-w-md mx-auto">
      Please check your email to verify your account. Didn’t receive it? Check your spam folder or try resending the verification email.
    </p>
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-4">
      <a
        href="https://mail.google.com"
        target="_blank"
        rel="noopener noreferrer"
        className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition"
      >
        Open Gmail
      </a>
      <button
        onClick={handleResendVerification}
        className="px-6 py-3 border border-blue-300 text-blue-600 rounded-xl hover:bg-blue-50 transition"
      >
        Resend Verification Email
      </button>
    </div>
  </div>
);

  const aside = (
    <>
      <h2 className="text-3xl font-semibold mb-4">Already have an account?</h2>
      <div className="w-16 h-1.5 bg-blue-400 bg-opacity-50 mx-auto mb-8 rounded-full"></div>
      <p className="mb-10 text-blue-100 leading-relaxed text-opacity-90">
        Sign in and reconnect with opportunities around you.
      </p>
      <a href="/signin">
        <button className="px-8 py-3 border-2 border-blue-300 text-white font-medium rounded-xl shadow-lg hover:bg-white hover:bg-opacity-10 hover:shadow-xl hover:border-white transition duration-300 hover:-translate-y-0.5 hover:text-blue-300">
          Sign In
        </button>
      </a>
    </>
  );

  // 🔥 KEY PART: Swap layout when sign-up is complete
  return successMessage ? (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-xl max-w-xl w-full text-center">
        {successUI}
      </div>
    </div>
  ) : (
    <AuthLayout
      title="Create Your Account"
      form={form}
      aside={aside}
    />
  );
}
