/**
 * Landing page component for DevHost.
 * This is a Server Component.
 *
 * Note: This version uses standard <a> tags instead of Next.js <Link>
 * and removes icons to ensure compatibility in environments
 * where Next.js modules or external icon libraries may not be resolved.
 */

import Aurora from "@/components/Aurora";
import CardNav from "@/components/CardNav";


export default function LandingPage() {
  return (
    // 1. Added 'relative' to make this the positioning anchor
    //    and 'overflow-hidden' to contain the background
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white p-8 overflow-hidden">
      
      {/* 2. Added the Aurora component here */}
      {/* It's 'absolute' to float behind, 'inset-0' to fill the parent, */}
      {/* and 'z-0' to be at the bottom of the stack. */}
      <div className="absolute inset-0 z-0">
      <Aurora
  colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
  blend={0.5}
  amplitude={1.0}
  speed={0.5}
/>
</div>

      {/* 3. Added 'relative' and 'z-10' to this content block */}
      {/* This ensures all your content stacks *on top* of the z-0 background. */}
      <div className="relative z-10 text-center space-y-8">
        {/* Logo/Icon */}
        <div className="flex justify-center">
          <div className="p-4 bg-gray-800 rounded-full">
            {/* Using an emoji as a fallback for the icon */}
            <span role="img" aria-label="rocket" className="text-6xl">
              🚀
            </span>
          </div>
        </div>

        {/* Branding & Tagline */}
        <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          Welcome to FolkSpace
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-xl mx-auto">
          Your all-in-one platform for deploying, managing, and scaling your
          applications seamlessly. Get started in seconds.
        </p>

        {/* Call-to-Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-6 pt-6">
          {/* Login Button - Changed to <a> tag */}
          <a
            href="/login"
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white shadow-lg transition-transform duration-200 hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            {/* Removed LogIn icon */}
            <span>Login</span>
          </a>

          {/* Sign Up/Register Button - Changed to <a> tag */}
          <a
            href="/signup"
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-600 bg-gray-800 px-8 py-3 font-semibold text-white shadow-lg transition-transform duration-200 hover:scale-105 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            {/* Removed UserPlus icon */}
            <span>Sign Up</span>
          </a>
        </div>
      </div>
    </div>
  );
}