"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useEffect } from "react";
import GradientText from "@/components/GradientText";
import CardNav from "@/components/CardNav";
export default function ProfilePage() {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return null;
  }

  if (!currentUser) {
    useEffect(() => {
      router.push("/login");
    }, [router]);
    return null;
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/landing");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  // Get the first letter of the email for the avatar placeholder
  const emailInitial = currentUser.email ? currentUser.email[0].toUpperCase() : "?";

  return (
    // 1. Page Container
    <div className="flex min-h-screen items-center justify-center bg-bg-night p-4">
      {/* <CardNav /> */}
      {/* 2. Improved Profile Card */}
      <div 
        className="w-full max-w-md rounded-xl border border-border 
                   bg-white/70 p-8 backdrop-blur-lg shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
      >
        
        {/* 3. Card Header */}
        <h1 className="text-2xl font-bold text-text-primary mb-6">
          <GradientText>
            My Profile
            </GradientText>
        </h1>

        {/* 4. User Info Section (Avatar + Email) */}
        <div className="flex items-center space-x-4 mb-6">
          {/* Avatar Placeholder */}
          <div className="flex h-16 w-16 flex-shrink-0 items-center 
                          justify-center rounded-full bg-primary-purple">
            <span className="text-3xl font-medium text-white">
              {emailInitial}
            </span>
          </div>
          {/* Email Info */}
          <div className="min-w-0">
            <p className="text-sm font-medium text-text-secondary">Email Address</p>
            <p className="truncate text-lg font-semibold text-text-primary">
              {currentUser.email}
            </p>
          </div>
        </div>

        {/* 5. Secondary Info (User ID) */}
        <div className="mb-6">
           <p className="text-sm font-medium text-text-secondary mb-1">User ID</p>
           <code 
            className="block w-full truncate rounded border border-border 
                       bg-bg-surface px-3 py-2 text-sm text-text-primary"
           >
            {currentUser.uid}
          </code>
        </div>
        
        {/* 6. Divider */}
        <hr className="my-6 border-border" />

        {/* 7. Logout Action Button */}
        <button 
          onClick={handleLogout} 
          className="w-full rounded-lg bg-gradient-to-r from-[#6BECD9] via-[#0C55B1] to-[#8F55B5] from-primary-purple to-primary-pink 
                     py-3 px-6 text-base font-semibold text-white shadow-lg
                     transition-opacity hover:opacity-90 
                     hover:shadow-[0_4px_15px_rgba(147,88,247,0.3)]"
        >
          Logout
        </button>
      </div>
    </div>
  );
}