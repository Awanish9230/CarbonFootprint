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
          state: form.state, // important
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
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4">
      <div className="w-full max-w-md bg-[#111111] rounded-2xl shadow-lg p-6 space-y-5">
        <h2 className="text-2xl font-bold text-white text-center">
          {mode === "login" ? "Login to Your Account" : "Create a New Account"}
        </h2>

        <div className="flex justify-center gap-2 mb-4">
          <button
            className={`px-4 py-2 rounded-lg font-medium transition ${mode === "login"
                ? "bg-emerald-600 text-white shadow"
                : "bg-[#1a1a1a] text-white hover:bg-gray-800"
              }`}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium transition ${mode === "signup"
                ? "bg-emerald-600 text-white shadow"
                : "bg-[#1a1a1a] text-white hover:bg-gray-800"
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
                className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Name"
                name="name"
                value={form.name}
                onChange={onChange}
                required
              />
              <input
                className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="State (e.g., Karnataka)"
                name="state"
                value={form.state}
                onChange={onChange}
                required
              />
            </>
          )}

          <input
            className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email"
            name="email"
            value={form.email}
            onChange={onChange}
            type="email"
            required
          />
          <input
            className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Password"
            name="password"
            value={form.password}
            onChange={onChange}
            type="password"
            required
          />

          {error && <div className="text-red-500 text-sm text-center">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 rounded-lg transition shadow disabled:opacity-50"
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

        <p className="text-center text-gray-400 text-sm mt-2">
          {mode === "login"
            ? "Don't have an account? Sign up above"
            : "Already have an account? Login above"}
        </p>
      </div>
    </div>
  );
}
