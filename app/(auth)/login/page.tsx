"use client";

import { useState } from "react";
import { Camera, Users, Star, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[#0F4C35] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">

      {/* Background circles */}
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full border-[60px] border-[#5BB88A] opacity-10" />
      <div className="absolute -bottom-24 -left-20 w-96 h-96 rounded-full border-[70px] border-[#5BB88A] opacity-10" />

      {/* Dot pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "radial-gradient(circle, #9FE1CB 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md">

        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-xl mb-4 overflow-hidden">
            <img
              src="/images/logo.png"
              alt="ShareHub logo"
              className="w-20 object-contain"
            />
          </div>
          <p className="text-[#9FE1CB] text-xs tracking-[3px]">BORROW · SHARE · BELONG</p>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">

          {/* Top accent */}
          <div className="h-1 bg-[#F5A623]" />

          <div className="p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-1">Welcome back</h2>
            <p className="text-sm text-gray-500 mb-7">
              Don't have an account?{" "}
              <a href="/register" className="text-[#0F4C35] font-medium hover:underline">
                Create one
              </a>
            </p>

            <form className="flex flex-col gap-5">

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                  Email address
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F4C35]/20 focus:border-[#0F4C35] focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F4C35]/20 focus:border-[#0F4C35] focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                
                 <a href="#" className="text-xs text-[#0F4C35] hover:underline mt-1.5 inline-block">
  Forgot password?
</a>
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 accent-[#0F4C35] rounded"
                />
                <label htmlFor="remember" className="text-sm text-gray-500 cursor-pointer">
                  Remember me for 30 days
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3 bg-[#0F4C35] text-white text-sm font-medium rounded-xl hover:bg-[#0D3F2C] transition-colors flex items-center justify-center gap-2"
              >
                Sign in
                <ArrowRight size={16} />
              </button>

            </form>
          </div>
        </div>

        {/* Feature icons */}
        <div className="flex justify-center gap-10 mt-8">
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <Camera size={18} color="#9FE1CB" />
            </div>
            <p className="text-xs text-[#9FE1CB]">Borrow</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <Users size={18} color="#9FE1CB" />
            </div>
            <p className="text-xs text-[#9FE1CB]">Connect</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <Star size={18} color="#9FE1CB" />
            </div>
            <p className="text-xs text-[#9FE1CB]">Trust</p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-[#9FE1CB]/50 mt-6">
          © 2026 ShareHub · Privacy · Terms
        </p>

      </div>
    </div>
  );
}