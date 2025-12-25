// app/dashboard/page.tsx

'use client';
import { useState, useEffect } from 'react';
import { getUserId, getUserInfo } from '@/lib/api';
import { useTranslations } from 'next-intl';
import Aurora from "@/components/Aurora";

import WeatherWidget from '@/components/widgets/WeatherWidget';
import { InventoryAlerts } from '@/components/widgets/InventoryAlerts';
import CardNav from '@/components/CardNav';

import { AddItemForm } from '@/components/dashboard/AddItemForm';
import { InventoryTable } from '@/components/dashboard/InventoryTable';
import { AddAgentForm } from '@/components/dashboard/AddAgentForm';
import { DynamicPricingForm } from '@/components/dashboard/DynamicPricingForm';
import { ForecastForm } from '@/components/dashboard/ForecastForm';
import { AnalyticsTable } from '@/components/dashboard/AnalyticsTable';
import { TopSoldLastYear } from '@/components/dashboard/TopSoldLastYear';
import { RegionalTopTable } from '@/components/dashboard/RegionalTopTable';

// --- REUSABLE GLASS CARD COMPONENT ---
const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`relative w-full rounded-[2rem] overflow-hidden bg-white/80 backdrop-blur-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-white/50 hover:shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:bg-white/90 transition-all duration-500 ease-out ${className}`}>
    {children}
  </div>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 ml-2">
    {children}
  </h3>
);

export default function DashboardPage() {
  const t = useTranslations('Dashboard');

  // --- User Data ---
  const [userId, setUserId] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [userCountry, setUserCountry] = useState<string>('Norway');

  useEffect(() => {
    const id = getUserId();
    const info = getUserInfo();
    setUserId(id);
    setUserInfo(info);
    if (info?.region) setUserCountry(info.region);
  }, []);

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const handleItemAdded = () => setRefreshTrigger((prev) => prev + 1);

  return (
    <div className="relative min-h-screen bg-[#F5F5F7] font-sans antialiased text-[#1D1D1F] selection:bg-[#007AFF] selection:text-white">

      {/* --- Ambient Background --- */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none mix-blend-soft-light decoration-clone">
        <Aurora colorStops={["#E0F2FE", "#F3E8FF", "#FCE7F3"]} blend={0.8} amplitude={0.5} speed={0.2} />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <CardNav />

        <main className="flex-1 w-full max-w-[1600px] mx-auto p-6 lg:p-12">

          {/* --- Header Section --- */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 mt-4 px-2">
            <div className="space-y-1">
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-[#1D1D1F]">
                Dashboard
              </h1>
              <p className="text-lg text-gray-500 font-normal">
                {userInfo?.name ? `Good morning, ${userInfo.name}` : "Retail Intelligence Overview"}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 bg-white/60 px-4 py-2 rounded-full backdrop-blur-md shadow-sm border border-white/50">
              <span className="w-2 h-2 rounded-full bg-[#34C759] shadow-[0_0_8px_#34C759]" />
              Systems Operational
            </div>
          </div>

          {/* --- Main Grid Layout --- */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">

            {/* LEFT COLUMN (Main Content) */}
            <div className="xl:col-span-8 space-y-12">

              {/* Analytics Section */}
              <section>
                <SectionTitle>Performance Overview</SectionTitle>
                <GlassCard className="p-2 min-h-[400px]">
                  {userId ? (
                    <AnalyticsTable userId={userId} />
                  ) : (
                    <div className="flex items-center justify-center h-64 text-gray-400 font-light">{t('loadingUserData')}</div>
                  )}
                </GlassCard>
              </section>

              {/* Inventory Section */}
              <section>
                <div className="flex items-center justify-between mb-4 px-2">
                  <SectionTitle>Live Inventory</SectionTitle>
                  <button onClick={() => setRefreshTrigger(prev => prev + 1)} className="text-xs font-semibold text-[#0066CC] hover:text-[#004499] transition-colors">
                    Refresh
                  </button>
                </div>
                <GlassCard className="p-2">
                  <InventoryTable userId={userId || undefined} key={refreshTrigger} />
                </GlassCard>
              </section>

              {/* Insights Split Section */}
              <section>
                <SectionTitle>Market Insights</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <GlassCard className="p-2">
                    <TopSoldLastYear userId={userId || undefined} />
                  </GlassCard>
                  <GlassCard className="p-2">
                    <RegionalTopTable country={userCountry} />
                  </GlassCard>
                </div>
              </section>

            </div>

            {/* RIGHT COLUMN (Sidebar) */}
            <div className="xl:col-span-4 space-y-8 xl:sticky xl:top-8">

              {/* Context Widgets (Weather & Alerts) */}
              <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-6">
                <div className="space-y-4">
                  <SectionTitle>Status</SectionTitle>
                  <GlassCard className="p-6 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50/50 to-white/50">
                    <WeatherWidget locationName={userCountry} />
                  </GlassCard>
                </div>
                <div className="space-y-4 md:mt-10 xl:mt-0">
                  <div className="hidden xl:block h-6"></div>
                  <GlassCard className="p-6 bg-gradient-to-br from-purple-50/50 to-white/50">
                    <InventoryAlerts />
                  </GlassCard>
                </div>
              </section>

              {/* Action Center */}
              <section>
                <SectionTitle>Command Center</SectionTitle>
                <div className="space-y-5">

                  {/* Primary Action */}
                  <GlassCard className="p-8 border-l-0 relative group cursor-pointer active:scale-[0.98] transition-all">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00C7BE] to-[#32ADE6] opacity-80" />
                    <h4 className="text-xl font-semibold mb-6 text-[#1D1D1F]">Add Inventory</h4>
                    <AddItemForm userId={userId || undefined} onItemAdded={handleItemAdded} />
                  </GlassCard>

                  {/* Secondary Actions Grouped */}
                  <div className="grid gap-5">
                    <GlassCard className="p-6 hover:bg-white transition-colors">
                      <h4 className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-wider">AI Forecasting</h4>
                      <ForecastForm />
                    </GlassCard>

                    <GlassCard className="p-6 hover:bg-white transition-colors">
                      <h4 className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-wider">Dynamic Pricing</h4>
                      {userId ? <DynamicPricingForm userId={userId} /> : <div className="text-sm text-gray-400">Loading...</div>}
                    </GlassCard>

                    <GlassCard className="p-6 hover:bg-white transition-colors">
                      <h4 className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-wider">Agent Management</h4>
                      {userId ? <AddAgentForm userId={userId} /> : <div className="text-sm text-gray-400">Loading...</div>}
                    </GlassCard>
                  </div>

                </div>
              </section>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}