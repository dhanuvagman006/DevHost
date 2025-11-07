"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase"; // Adjust path

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic password validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // On success, redirect to the profile page
      router.push("/profile");
    } catch (err: any) {
      // Provide user-friendly error messages
      if (err.code === "auth/email-already-in-use") {
        setError("This email address is already in use.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      console.error("Error signing up:", err);
    }
  };

  return (
    // Main container: centers the form vertically and horizontally
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4 dark:bg-gray-900">
      
      {/* Form Card */}
      <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
          Create Account
        </h1>

        <form onSubmit={handleSignup} className="space-y-6">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              // Add pattern for accessibility/guidance, though Firebase handles the 6-char rule
              minLength={6}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-4 py-2 font-semibold text-white shadow-sm transition duration-200 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            Sign Up
          </button>
        </form>

        {/* Error Message Display */}
        {error && (
          <p className="mt-4 text-center text-sm font-medium text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    </main>
  );
}