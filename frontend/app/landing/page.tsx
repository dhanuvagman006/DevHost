import React from 'react';
import Aurora from "@/components/Aurora";
// import CardNav from "@/components/CardNav"; 

const LandingPage: React.FC = () => {
  return (
    <>
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#0D1117] p-8 overflow-hidden">
        
        <div className="absolute inset-0 z-0">
          <Aurora
            colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
            blend={0.5}
            amplitude={1.0}
            speed={0.5}
          />
        </div>

        <div className="relative z-10 w-full max-w-4xl space-y-8 rounded-xl bg-transperent p-8 shadow-2xl backdrop-blur-lg md:p-12 text-center">
          
          <div className="flex justify-center">
            {/* You can place your logo SVG or <img> tag here */}
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-[#F0F4F8] tracking-wide">
            Welcome to FolkSpace
          </h1>
          <p className="text-lg md:text-xl text-[#A2B4C6] max-w-2xl mx-auto leading-relaxed">
            Your all-in-one platform for deploying, managing, and scaling your
            applications seamlessly. Get started in seconds.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6 pt-6">
            
            <a
              href="/login"
              className="flex items-center justify-center gap-2 rounded-lg    shadow-lg transition-all duration-300 ease-in-out hover:shadow-[0_0_20px_0px_rgba(0,242,169,0.7)] hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[#00F2A9] focus:ring-offset-2 focus:ring-offset-[#0D1117] border-[#00F2A9]  px-8 py-4 font-semibold text-black bg-[#00F2A9]"
            >
              <span>Login</span>
            </a>

            <a
              href="/signup"
              className="flex items-center justify-center gap-2 rounded-lg border border-[#00F2A9] bg-transparent px-8 py-4 font-semibold text-[#00F2A9] shadow-lg transition-all duration-300 ease-in-out hover:bg-[#00F2A9] hover:text-[#0D1117] focus:outline-none focus:ring-2 focus:ring-[#00F2A9] focus:ring-offset-2 focus:ring-offset-[#0D1117]"
            >
              <span>Sign Up</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;