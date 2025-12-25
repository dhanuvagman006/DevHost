import React from 'react';
import Aurora from "@/components/Aurora";

// If you don't have lucide-react, you can remove these and use the emojis as before,
// but these icons add to the premium feel.
import { BarChart3, Tag, Recycle, LineChart, ArrowRight, Layers } from "lucide-react";

const App: React.FC = () => {
  return (
    <>
      {/* Background: Apple-style off-white (#F5F5F7).
        Font: Sans-serif with antialiasing for crisp text.
      */}
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#F5F5F7] p-6 lg:p-24 overflow-hidden font-sans antialiased text-[#1D1D1F]">

        {/* Ambient Background - Colors adjusted for Light Mode */}
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none mix-blend-multiply">
          <Aurora
            colorStops={["#E0F2FE", "#F3E8FF", "#FCE7F3"]}
            blend={0.8}
            amplitude={0.6}
            speed={0.2}
          />
        </div>

        {/* Global Nav Placeholder (CardNav is in Layout) */}

        {/* Main Container */}
        <div className="relative z-10 w-full max-w-7xl space-y-20 md:mt-16">

          {/* Header Section */}
          <div className="flex flex-col items-center text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/50 backdrop-blur-md border border-white/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00C7BE] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00C7BE]"></span>
              </span>
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Live Demo</span>
            </div>

            {/* Title */}
            <div className="space-y-4 max-w-4xl">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tighter text-[#1D1D1F] leading-[0.95]">
                Folkspace
              </h1>
              <p className="text-2xl md:text-4xl font-normal text-gray-500 tracking-tight leading-snug">
                Retail intelligence, <span className="text-[#1D1D1F] font-medium">reimagined</span>.
              </p>
            </div>

            <p className="text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
              An intelligent dashboard built to help Nordic retailers forecast demand,
              optimize inventory, and reduce waste using climate-responsive AI.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <a
                href="/dashboard"
                className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-[#1D1D1F] px-8 py-4 text-white font-medium text-lg shadow-lg hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                <span>Launch Dashboard</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white/80 px-8 py-4 text-[#1D1D1F] font-medium text-lg shadow-sm border border-white/60 backdrop-blur-md hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                View Case Study
              </a>
            </div>
          </div>

          {/* Bento Grid Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Card 1 */}
            <div className="group bg-white/60 backdrop-blur-2xl border border-white/50 p-8 rounded-[2rem] shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:bg-white/80 transition-all duration-500">
              <div className="h-12 w-12 rounded-2xl bg-blue-50/80 flex items-center justify-center mb-6 text-[#007AFF] group-hover:scale-110 transition-transform duration-300">
                <BarChart3 size={24} strokeWidth={2} />
              </div>
              <h3 className="text-lg font-semibold text-[#1D1D1F] mb-2 tracking-tight">Climate Aware</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Predicts demand using historical sales and live weather patterns.</p>
            </div>

            {/* Card 2 */}
            <div className="group bg-white/60 backdrop-blur-2xl border border-white/50 p-8 rounded-[2rem] shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:bg-white/80 transition-all duration-500">
              <div className="h-12 w-12 rounded-2xl bg-rose-50/80 flex items-center justify-center mb-6 text-[#FF2D55] group-hover:scale-110 transition-transform duration-300">
                <Tag size={24} strokeWidth={2} />
              </div>
              <h3 className="text-lg font-semibold text-[#1D1D1F] mb-2 tracking-tight">Dynamic Pricing</h3>
              <p className="text-gray-500 text-sm leading-relaxed">AI price suggestions based on shelf-life and real-time demand.</p>
            </div>

            {/* Card 3 */}
            <div className="group bg-white/60 backdrop-blur-2xl border border-white/50 p-8 rounded-[2rem] shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:bg-white/80 transition-all duration-500">
              <div className="h-12 w-12 rounded-2xl bg-emerald-50/80 flex items-center justify-center mb-6 text-[#34C759] group-hover:scale-110 transition-transform duration-300">
                <Recycle size={24} strokeWidth={2} />
              </div>
              <h3 className="text-lg font-semibold text-[#1D1D1F] mb-2 tracking-tight">Waste Reduction</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Smart alerts for items nearing expiry to automate markdowns.</p>
            </div>

            {/* Card 4 */}
            <div className="group bg-white/60 backdrop-blur-2xl border border-white/50 p-8 rounded-[2rem] shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:bg-white/80 transition-all duration-500">
              <div className="h-12 w-12 rounded-2xl bg-indigo-50/80 flex items-center justify-center mb-6 text-[#5856D6] group-hover:scale-110 transition-transform duration-300">
                <LineChart size={24} strokeWidth={2} />
              </div>
              <h3 className="text-lg font-semibold text-[#1D1D1F] mb-2 tracking-tight">Real Analytics</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Comprehensive inventory tracking and regional sales insights.</p>
            </div>
          </div>

          {/* Footer / Tech Stack */}
          <div className="border-t border-gray-200/50 pt-16 flex flex-col items-center space-y-8">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-[0.2em] opacity-70">Powered By</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {/* Minimalist Pills */}
              {['Next.js', 'React', 'TypeScript', 'Firebase', 'Vertex AI'].map((tech) => (
                <span key={tech} className="px-4 py-2 bg-white/40 border border-white/60 rounded-full text-gray-500 text-xs font-medium backdrop-blur-sm cursor-default hover:bg-white hover:text-[#1D1D1F] transition-colors duration-300">
                  {tech}
                </span>
              ))}
            </div>
            <p className="text-[10px] text-gray-400 opacity-60">
              Built in 28 hours for the Nordic Sustainability Hackathon.
            </p>
          </div>

        </div>
      </div>
    </>
  );
};

export default App;