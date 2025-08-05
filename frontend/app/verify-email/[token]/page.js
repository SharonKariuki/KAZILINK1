'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function VerifyEmailPage({ params }) {
  const router = useRouter();
  const { token } = use(params); // ✅ unwrap the params promise

  const [status, setStatus] = useState({
    loading: true,
    success: false,
    message: 'Verifying your email...',
  });

  useEffect(() => {
    if (!token || typeof token !== 'string' || token.length < 10) {
      setStatus({
        loading: false,
        success: false,
        message: 'Invalid or missing verification token.',
      });
      setTimeout(() => router.replace('/404'), 1000);
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/verify-email/${token}`);
        const data = await res.json();

        if (res.ok) {
          localStorage.setItem('emailVerified', 'true');
          setStatus({
            loading: false,
            success: true,
            message: 'Your email has been successfully verified!',
          });
          setTimeout(() => router.push('/role-selection?token=' + data.token), 2500);
        } else {
          setStatus({
            loading: false,
            success: false,
            message: data.message || 'Verification failed. Please try again.',
          });
        }
      } catch (err) {
        console.error('Verification error:', err);
        setStatus({
          loading: false,
          success: false,
          message: 'Unexpected error. Please try again later.',
        });
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-10 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-blue-700 mb-6">Email Verification</h1>

        {status.loading ? (
          <div className="flex flex-col items-center space-y-3">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
            <p className="text-blue-600 text-sm">{status.message}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            {status.success ? (
              <CheckCircle className="h-16 w-16 text-green-500" />
            ) : (
              <XCircle className="h-16 w-16 text-red-500" />
            )}
            <p className="text-gray-700 font-medium">{status.message}</p>
            <p className="text-gray-500 text-sm">You will be redirected shortly...</p>
          </div>
        )}
      </div>
    </div>
  );
}
