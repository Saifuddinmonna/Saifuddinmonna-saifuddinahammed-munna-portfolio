import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { FaGoogle } from "react-icons/fa";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters long!");
    }

    setLoading(true);
    try {
      await signUp(email, password);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast.success("Signed in with Google successfully!");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background-default)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-[var(--background-paper)] p-8 rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[var(--text-primary)]">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-[var(--text-secondary)]">
            Or{" "}
            <Link
              to="/signin"
              className="font-medium text-[var(--primary-main)] hover:text-[var(--primary-dark)]"
            >
              sign in to your account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[var(--border-color)] placeholder-[var(--text-secondary)] text-[var(--text-primary)] rounded-t-md focus:outline-none focus:ring-[var(--primary-main)] focus:border-[var(--primary-main)] focus:z-10 sm:text-sm bg-[var(--background-default)]"
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
                autoComplete="new-password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[var(--border-color)] placeholder-[var(--text-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-[var(--primary-main)] focus:border-[var(--primary-main)] focus:z-10 sm:text-sm bg-[var(--background-default)]"
                placeholder="Password"
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[var(--border-color)] placeholder-[var(--text-secondary)] text-[var(--text-primary)] rounded-b-md focus:outline-none focus:ring-[var(--primary-main)] focus:border-[var(--primary-main)] focus:z-10 sm:text-sm bg-[var(--background-default)]"
                placeholder="Confirm Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[var(--primary-main)] hover:bg-[var(--primary-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-main)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border-color)]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[var(--background-paper)] text-[var(--text-secondary)]">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-2 border border-[var(--border-color)] rounded-md shadow-sm text-sm font-medium text-[var(--text-primary)] bg-[var(--background-default)] hover:bg-[var(--background-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-main)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
            >
              <FaGoogle className="w-5 h-5 mr-2 text-[#DB4437]" />
              Sign up with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
