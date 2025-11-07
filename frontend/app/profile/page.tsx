"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useEffect } from "react";

export default function ProfilePage() {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  // If loading, show nothing. The AuthProvider already shows a loader.
  if (loading) {
    return null; 
  }

  // If no user is logged in, redirect to the login page
  if (!currentUser) {
    // We use useEffect to prevent a "server-side render mismatch" error.
    // The server initially renders this component, but the client-side
    // check will trigger the redirect.
    useEffect(() => {
      router.push("/login");
    }, [router]);
    
    // Return null while the redirect is in progress
    return null;
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Redirect to landing page after logout
      router.push("/landing");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  // If we are here, the user is logged in
  return (
    <div>
      <h1>Profile</h1>
      <p>Welcome, {currentUser.email}!</p>
      <p>User ID: {currentUser.uid}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}