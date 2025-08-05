// components/AuthLayout.js
'use client';

export default function AuthLayout({ title, form, aside }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gradient-to-br from-blue-50 to-blue-100">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 sm:px-20 text-center">
        <div className="bg-white rounded-xl shadow-2xl flex flex-col md:flex-row w-full max-w-5xl overflow-hidden border border-blue-100 transform transition-all duration-300 hover:shadow-3xl hover:-translate-y-1">
          
          {/* Left: Form */}
          <div className="w-full md:w-3/5 p-8 md:p-12">
            <div className="text-left mb-8">
              <span className="text-3xl font-bold text-blue-900 tracking-tight">KaziLink</span>
            </div>
            <div className="max-w-md mx-auto">
              <h2 className="text-3xl font-semibold text-blue-900 mb-4">{title}</h2>
              <div className="w-16 h-1.5 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto mb-8 rounded-full"></div>
              {form}
            </div>
          </div>

          {/* Right: Aside */}
          <div className="w-full md:w-2/5 bg-gradient-to-br from-blue-800 to-blue-900 p-10 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-5 pattern-dots pattern-blue-400 pattern-size-4"></div>
            <div className="relative text-center text-white">
              {aside}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
