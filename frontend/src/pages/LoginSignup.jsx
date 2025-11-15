import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginSignup() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", state: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, register, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user) navigate("/dashboard");
  }, [authLoading, user, navigate]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        await register({
          name: form.name,
          email: form.email,
          password: form.password,
          state: form.state,
        });
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading)
    return <div className="text-center mt-10 text-white">Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center  bg-gray-100 dark:bg-gradient-to-b dark:from-[#0a0a0a] dark:to-[#111111] p-4">
      <div className="w-full max-w-md  bg-white dark:bg-[#1a1a1a] rounded-3xl shadow-2xl p-8 space-y-6 border border-gray-300 dark:border-gray-800">
        <h2 className="text-3xl font-bold  text-gray-900 dark:text-white  text-center tracking-wide">
          {mode === "login" ? "Login to Your Account" : "Create a New Account"}
        </h2>

        {/* Mode Toggle Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            className={`px-5 py-2 rounded-xl font-medium transition ${
              mode === "login"
                ? "bg-emerald-600 text-white shadow-lg"
                : "bg-gray-200 dark:bg-[#2a2a2a] text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-[#333333]"
            }`}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            className={`px-5 py-2 rounded-xl font-medium transition ${
              mode === "signup"
                ? "bg-emerald-600 text-white shadow-lg"
                : "bg-gray-200 dark:bg-[#2a2a2a] text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-[#333333]"
            }`}
            onClick={() => setMode("signup")}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {mode === "signup" && (
            <>
              <input
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#111111] border border-gray-400 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                placeholder="Name"
                name="name"
                value={form.name}
                onChange={onChange}
                required
              />
              <input
                className="w-full px-4 py-3 rounded-xl  bg-white dark:bg-[#111111]  border border-gray-400 dark:border-gray-700  text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400  focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                placeholder="State (e.g., Karnataka)"
                name="state"
                value={form.state}
                onChange={onChange}
                required
              />
            </>
          )}

          <input
            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#111111] border border-gray-400 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            placeholder="Email"
            name="email"
            value={form.email}
            onChange={onChange}
            type="email"
            required
          />
          <input
            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#111111] border border-gray-400 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            placeholder="Password"
            name="password"
            value={form.password}
            onChange={onChange}
            type="password"
            required
          />

          {error && <div className="text-red-600 dark:text-red-400 text-sm text-center">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl transition shadow-lg disabled:opacity-50"
          >
            {loading
              ? mode === "login"
                ? "Logging in..."
                : "Creating account..."
              : mode === "login"
              ? "Login"
              : "Create Account"}
          </button>
        </form>

        <p className="text-center text-gray-600 dark:text-gray-400 text-sm mt-2">
          {mode === "login"
            ? "Don't have an account? Sign up above"
            : "Already have an account? Login above"}
        </p>
      </div>
    </div>
  );
}
