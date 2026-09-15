"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Camera,
  Users,
  Star,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { z } from "zod";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { successToastStyle } from "@/lib/toastStyles";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suspendReason, setSuspendReason] = useState<string | null>(null);

  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof LoginForm, string>>
  >({});

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = loginSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof LoginForm, string>> = {};
      for (const err of result.error.issues) {
        const field = err.path[0] as keyof LoginForm;
        if (!fieldErrors[field]) {
          fieldErrors[field] = err.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    try {
      setIsLoading(true);

      const response = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (response?.error) {
        if (response.error.startsWith("SUSPENDED:")) {
          setSuspendReason(response.error.replace("SUSPENDED:", "").trim());
        } else {
          toast.error("Invalid email or password", successToastStyle);
        }
        return;
      }

      const sessionResponse = await fetch("/api/auth/session");
      const sessionData = await sessionResponse.json();

      toast.success("Welcome back to ShareHub!", successToastStyle);

      setTimeout(() => {
        router.push(sessionData?.user?.role === "ADMIN" ? "/admin" : "/");
      }, 2000);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="h-screen bg-[#0F4C35] overflow-hidden relative flex-col flex">
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full border-[60px] border-[#5BB88A] opacity-10" />
      <div className="absolute -bottom-24 -left-20 w-96 h-96 rounded-full border-[70px] border-[#5BB88A] opacity-10" />

      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "radial-gradient(circle, #9FE1CB 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="flex-1 overflow-y-auto w-full flex items-center justify-center p-4 flex-col">
        {suspendReason && (
          <div className="relative z-10 w-full max-w-md bg-red-50 border border-red-200 rounded-xl p-4 mb-4 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-700">Account suspended</p>
              <p className="text-sm text-red-600 mt-0.5">{suspendReason}</p>
              <p className="text-xs text-red-400 mt-1">Contact support if you think this is a mistake.</p>
            </div>
          </div>
        )}

        <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="h-1 bg-[#F5A623]" />

          <div className="p-10">
            <div className="flex flex-col items-center mb-3">
              <Image
                src="/images/logo.png"
                alt="ShareHub logo"
                width={112}
                height={112}
                className="w-28 object-contain"
                priority
              />
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-1">
              Welcome back
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Don't have an account?{" "}
              <a
                href="/register"
                className="text-[#0F4C35] font-medium hover:underline cursor-pointer"
              >
                Create one
              </a>
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                  Email address
                </label>
                <div className="relative">
                  <Mail
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className={`w-full pl-9 pr-4 py-2.5 rounded-xl border bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F4C35]/20 focus:border-[#0F4C35] focus:bg-white transition-all ${
                      errors.email ? "border-red-400" : "border-gray-200"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className={`w-full pl-9 pr-10 py-2.5 rounded-xl border bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F4C35]/20 focus:border-[#0F4C35] focus:bg-white transition-all ${
                      errors.password ? "border-red-400" : "border-gray-200"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  >
                    {showPassword ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                )}
                <a
                  href="#"
                  className="text-xs text-[#0F4C35] hover:underline mt-1.5 inline-block cursor-pointer"
                >
                  Forgot password?
                </a>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 accent-[#0F4C35] rounded"
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-gray-500 cursor-pointer"
                >
                  Remember me
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#0F4C35] text-white text-sm font-medium rounded-xl flex items-center justify-center gap-2 cursor-pointer hover:bg-[#0a3526] active:scale-95 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      ></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="flex items-center gap-3 my-3">
              <div className="flex-1 h-px bg-gray-100" />
              <p className="text-xs text-gray-400">our community</p>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            <div className="flex justify-center gap-6">
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 bg-[#0F4C35]/5 rounded-xl flex items-center justify-center">
                  <Camera size={14} color="#0F4C35" />
                </div>
                <p className="text-xs text-gray-400">Borrow</p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 bg-[#0F4C35]/5 rounded-xl flex items-center justify-center">
                  <Users size={14} color="#0F4C35" />
                </div>
                <p className="text-xs text-gray-400">Connect</p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 bg-[#0F4C35]/5 rounded-xl flex items-center justify-center">
                  <Star size={14} color="#0F4C35" />
                </div>
                <p className="text-xs text-gray-400">Trust</p>
              </div>
            </div>

            <p className="text-center text-xs text-gray-300 mt-3">
              © 2026 ShareHub · Privacy · Terms
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
