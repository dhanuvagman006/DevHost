"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase"; // Use your alias or relative path

// Define the type for the context value
interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the props for the provider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged is the Firebase listener for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    loading,
  };

  // Show nothing or a loader while loading
  if (loading) {
    return <div>Loading...</div>; // Or a full-page spinner
  }

  // Once loading is false, render the app with the auth context
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};