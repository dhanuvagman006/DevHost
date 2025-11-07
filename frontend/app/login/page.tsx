"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase"; // Make sure googleProvider is exported from your firebase config

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Handles the Google Sign-In popup flow
  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      // On success, redirect
      router.push("/profile");
    } catch (err: any) {
      if (err.code === "auth/popup-closed-by-user") {
        setError("Sign-in cancelled.");
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
      console.error("Error with Google Sign-in:", err);
    }
  };

  return (
    // Main container: centers the form vertically and horizontally
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4 dark:bg-gray-900">
      
      {/* Login Card */}
      <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white">
          Sign In
        </h1>

        {/* Google Sign-In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-900"
        >
          {/* Simple Google SVG Icon */}
          <svg
            className="mr-2 h-5 w-5"
            aria-hidden="true"
            focusable="false"
            data-prefix="fab"
            data-icon="google"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 488 512"
          >
            <path
              fill="currentColor"
              d="M488 261.8C488 400.3 378.1 504 244 504 110.1 504 0 393.9 0 259.8S110.1 15.6 244 15.6c70.9 0 131.5 27.7 176.4 72.9l-63.1 61.9C333.5 124.3 290.1 101.9 244 101.9c-109.3 0-199.1 90.1-199.1 200.2S134.7 402.3 244 402.3c119.3 0 172.6-84.3 179-131.8H244v-80.9h244z"
            ></path>
          </svg>
          Sign in with Google
        </button>

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