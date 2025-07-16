import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../auth/context/AuthContext";
import { toast } from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();

  // Get the redirect path from location state or default to home
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      await signIn(email, password);
      toast.success("Login successful!");
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background-default)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[var(--text-primary)]">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-[var(--text-secondary)]">
            Or{" "}
            <Link
              to="/register"
              className="font-medium text-[var(--primary-main)] hover:text-[var(--primary-dark)]"
            >
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[var(--border-color)] placeholder-[var(--text-secondary)] text-[var(--text-primary)] rounded-t-md focus:outline-none focus:ring-[var(--primary-main)] focus:border-[var(--primary-main)] focus:z-10 sm:text-sm bg-[var(--background-paper)]"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[var(--border-color)] placeholder-[var(--text-secondary)] text-[var(--text-primary)] rounded-b-md focus:outline-none focus:ring-[var(--primary-main)] focus:border-[var(--primary-main)] focus:z-10 sm:text-sm bg-[var(--background-paper)]"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-[var(--primary-main)] focus:ring-[var(--primary-main)] border-[var(--border-color)] rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-[var(--text-secondary)]"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-[var(--primary-main)] hover:text-[var(--primary-dark)]"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[var(--primary-main)] hover:bg-[var(--primary-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-main)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
