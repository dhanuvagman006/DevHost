"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase"; // Assuming db is exported from firebase config
import { doc, setDoc } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";

type UserRole = "retailer" | "distributor" | null;

export default function OnboardingPage() {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Listen for auth state changes to get the current user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/");
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Handles saving the user's choices to Firestore
  const handleSave = async () => {
    if (!user) {
      setError("You must be logged in to complete onboarding.");
      return;
    }
    if (!userRole) {
      setError("Please select a role (Retailer or Distributor).");
      return;
    }
    if (!location.trim()) {
      setError("Please specify your location.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userDocRef = doc(db, "users", user.uid);
      
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role: userRole,
        location: location,
        onboardingCompleted: true
      }, { merge: true });

      router.push("/dashboard");

    } catch (err: any) {
      setError("Failed to save preferences. Please try again.");
      console.error("Error saving onboarding data:", err);
      setLoading(false);
    }
  };

  // Base animated background style for both loading and main page
  const mainBgStyle = "min-h-screen p-4 flex items-center justify-center bg-[#0D1117]";

  // Show a loading state while Firebase auth is initializing
  if (!user) {
    return (
      <main className={mainBgStyle}>
        <p className="text-xl font-medium text-[#F0F4F8]">Loading user...</p>
      </main>
    );
  }

  return (
    <main className={mainBgStyle}>
      
      {/* Glassmorphism Card */}
      <div className="w-full max-w-lg rounded-xl border border-[#30363D] bg-[rgba(22,27,34,0.7)] p-8 shadow-2xl backdrop-blur-lg mt-16">
        <h1 className="mb-4 text-center text-3xl font-bold text-[#F0F4F8] tracking-wide">
          Welcome!
        </h1>
        <p className="mb-8 text-center text-lg text-[#A2B4C6] leading-relaxed">
          Let's get your account set up.
        </p>

        <div className="space-y-6">
          {/* Role Selection */}
          <div>
            <label className="mb-3 block text-sm font-medium text-[#A2B4C6]">
              Are you a Retailer or a Distributor?
            </label>
            <div className="flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                onClick={() => setUserRole("retailer")}
                className={`w-full rounded-md px-4 py-3 font-medium transition-all ${
                  userRole === "retailer"
                    ? "scale-105 bg-[#00F2A9] text-[#0D1117] shadow-[0_0_15px_3px_rgba(0,242,169,0.3)]"
                    : "border border-[#30363D] text-[#A2B4C6] hover:border-[#00F2A9] hover:text-[#00F2A9]"
                }`}
              >
                Retailer
              </button>
              <button
                type="button"
                onClick={() => setUserRole("distributor")}
                className={`w-full rounded-md px-4 py-3 font-medium transition-all ${
                  userRole === "distributor"
                    ? "scale-105 bg-[#00F2A9] text-[#0D1117] shadow-[0_0_15px_3px_rgba(0,242,169,0.3)]"
                    : "border border-[#30363D] text-[#A2B4C6] hover:border-[#00F2A9] hover:text-[#00F2A9]"
                }`}
              >
                Distributor
              </button>
            </div>
          </div>

          {/* Location Input */}
          <div>
            <label htmlFor="location" className="mb-2 block text-sm font-medium text-[#A2B4C6]">
              {userRole === "retailer" ? "Your Shop Location" : userRole === "distributor" ? "Your Warehouse Location" : "Your Location"}
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., '123 Main St, Anytown, USA'"
              className="w-full rounded-md border border-[#30363D] bg-[#0D1117] p-3 text-[#F0F4F8] placeholder:text-[#A2B4C6] shadow-sm focus:border-[#00F2A9] focus:ring-[#00F2A9]"
            />
            {/* Ghost Button */}
            <button
              type="button"
              className="mt-3 w-full rounded-md border border-[#30363D] px-4 py-2 text-sm font-medium text-[#A2B4C6] shadow-sm transition-colors hover:border-[#00F2A9] hover:text-[#00F2A9] focus:outline-none focus:ring-2 focus:ring-[#00F2A9] focus:ring-offset-2 focus:ring-offset-[#0D1117]"
            >
              Find on Map (Placeholder)
            </button>
            <p className="mt-2 text-xs text-[#A2B4C6] opacity-75">
              Map functionality would be added here. For now, please type your address.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-center text-sm font-medium text-[#E040FB]">
              {error}
            </p>
          )}

          {/* Save Button (Primary CTA) */}
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="w-full rounded-md bg-gradient-to-r from-[#8A2387] via-[#E94057] to-[#F27121] px-4 py-3 text-lg font-semibold text-[#F0F4F8] shadow-lg transition-all hover:brightness-110 hover:shadow-[0_0_20px_5px_rgba(233,64,87,0.4)] focus:outline-none focus:ring-2 focus:ring-[#E94057] focus:ring-offset-2 focus:ring-offset-[#0D1117] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:brightness-100"
          >
            {loading ? "Saving..." : "Save & Continue"}
          </button>
        </div>
      </div>
    </main>
  );
}