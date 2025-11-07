'use client'; 

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext'; // Adjust path

export const ProtectedRoute = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // --- THIS IS THE FIX ---
  // Change 'user' to 'currentUser' to match your AuthContext
  const { currentUser, loading } = useAuth(); 
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // If no user, redirect to landing page
      if (!currentUser) { // Change 'user' to 'currentUser'
        router.push('/');
      }
    }
  }, [currentUser, loading, router]); // Change 'user' to 'currentUser'

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  // If user is logged in, show the protected content
  if (currentUser) { // Change 'user' to 'currentUser'
    return <>{children}</>;
  }

  return <div>Loading...</div>;
};