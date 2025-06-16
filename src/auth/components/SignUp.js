import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { FaGoogle } from "react-icons/fa";
import { apiRequest } from "../utils/api";
import { getCurrentUserProfile } from "../utils/api";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    bio: "",
    photoURL: "",
  });
  const [loading, setLoading] = useState(false);
  const { signUp, signInWithGoogle, setDbUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    if (formData.password.length < 6) {
      return toast.error("Password must be at least 6 characters long!");
    }

    setLoading(true);
    try {
      // First create Firebase auth user
      const userCredential = await signUp(formData.email, formData.password);
      // Ensure user exists before proceeding
      if (!userCredential || !userCredential.user) {
        // Error was already handled by toast in AuthContext.js
        return;
      }
      const { user } = userCredential;

      // Wait for token to be available
      const token = await user.getIdToken();
      if (!token) {
        throw new Error("Failed to get authentication token");
      }

      // Then create user in your database
      const userData = {
        firebaseUid: user.uid,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        phone: formData.phone || undefined,
        photoURL: formData.photoURL || undefined,
        bio: formData.bio || undefined,
        role: "user",
      };

      console.log("Sending registration data to server:", userData);

      await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      });

      // Fetch and set dbUser after successful registration
      const profile = await getCurrentUserProfile();
      setDbUser(profile);

      toast.success("Account created successfully!");

      // Reset form fields after successful registration
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        bio: "",
        photoURL: "",
      });

      // Navigate to home page after successful registration
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      // Ensure user exists before proceeding
      if (!result || !result.user) {
        // Error was already handled by toast in AuthContext.js
        return;
      }
      const { user } = result;

      // Create user in your database after Google sign in
      const userData = {
        firebaseUid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        role: "user",
      };

      await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      });

      // Fetch and set dbUser after successful Google registration
      const profile = await getCurrentUserProfile();
      setDbUser(profile);

      console.log("Sending registration data to server:", userData);
      toast.success("Signed in with Google successfully!");

      // Reset form fields after successful Google sign-in
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        bio: "",
        photoURL: "",
      });

      // Navigate to home page after successful Google sign-in
      setTimeout(() => {
        navigate("/");
      }, 1000);
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
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-[var(--border-color)] placeholder-[var(--text-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-[var(--primary-main)] focus:border-[var(--primary-main)] focus:z-10 sm:text-sm bg-[var(--background-default)]"
                placeholder="Full Name"
              />
            </div>
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
                value={formData.email}
                onChange={handleChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-[var(--border-color)] placeholder-[var(--text-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-[var(--primary-main)] focus:border-[var(--primary-main)] focus:z-10 sm:text-sm bg-[var(--background-default)]"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="phone" className="sr-only">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-[var(--border-color)] placeholder-[var(--text-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-[var(--primary-main)] focus:border-[var(--primary-main)] focus:z-10 sm:text-sm bg-[var(--background-default)]"
                placeholder="Phone Number (optional)"
              />
            </div>
            <div>
              <label htmlFor="bio" className="sr-only">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-[var(--border-color)] placeholder-[var(--text-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-[var(--primary-main)] focus:border-[var(--primary-main)] focus:z-10 sm:text-sm bg-[var(--background-default)]"
                placeholder="Bio (optional)"
                rows="3"
              />
            </div>
            <div>
              <label htmlFor="photoURL" className="sr-only">
                Photo URL
              </label>
              <input
                id="photoURL"
                name="photoURL"
                type="url"
                value={formData.photoURL}
                onChange={handleChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-[var(--border-color)] placeholder-[var(--text-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-[var(--primary-main)] focus:border-[var(--primary-main)] focus:z-10 sm:text-sm bg-[var(--background-default)]"
                placeholder="Photo URL (optional)"
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
                value={formData.password}
                onChange={handleChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-[var(--border-color)] placeholder-[var(--text-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-[var(--primary-main)] focus:border-[var(--primary-main)] focus:z-10 sm:text-sm bg-[var(--background-default)]"
                placeholder="Password"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-[var(--border-color)] placeholder-[var(--text-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-[var(--primary-main)] focus:border-[var(--primary-main)] focus:z-10 sm:text-sm bg-[var(--background-default)]"
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
