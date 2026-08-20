"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiMail, FiLock, FiUser, FiArrowRight, FiEye, FiEyeOff } from "react-icons/fi";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else if (data.session) {
      router.push("/");
      router.refresh();
    } else {
      setMessage("Registration successful! Please check your email to confirm your account.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full glass-panel rounded-3xl p-8 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Logo / Header */}
        <div className="text-center space-y-2 mb-8 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-yellow-400 text-black flex items-center justify-center font-black text-xl mx-auto shadow-lg shadow-yellow-500/20">
            CP
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Create Account
          </h1>
          <p className="text-xs text-zinc-400">
            Join CinePulse to discover, rate, and track entertainment
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/30 text-red-300 text-xs rounded-xl">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-5 p-3.5 bg-green-500/10 border border-green-500/30 text-green-300 text-xs rounded-xl">
            {message}
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-4 relative z-10">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                First Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-900/90 border border-white/10 text-white text-xs placeholder:text-zinc-500 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none transition"
                  placeholder="John"
                />
                <FiUser className="absolute left-3 top-3 text-zinc-500 text-xs" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Last Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-900/90 border border-white/10 text-white text-xs placeholder:text-zinc-500 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none transition"
                  placeholder="Doe"
                />
                <FiUser className="absolute left-3 top-3 text-zinc-500 text-xs" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-900/90 border border-white/10 text-white text-xs placeholder:text-zinc-500 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none transition"
                placeholder="you@example.com"
              />
              <FiMail className="absolute left-3 top-3 text-zinc-500 text-xs" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-zinc-900/90 border border-white/10 text-white text-xs placeholder:text-zinc-500 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none transition"
                placeholder="Min 6 characters"
              />
              <FiLock className="absolute left-3 top-3 text-zinc-500 text-xs" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-zinc-400 hover:text-white transition"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff className="text-xs" /> : <FiEye className="text-xs" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs rounded-xl shadow-lg shadow-yellow-500/20 transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            <span>{loading ? "Creating Account..." : "Create Account"}</span>
            <FiArrowRight />
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-zinc-400 relative z-10">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="text-yellow-400 font-bold hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
