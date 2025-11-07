// app/dashboard/page.tsx

'use client';
import { useState, useEffect } from 'react';
import { getUserId, getUserInfo } from '@/lib/api';

// --- REMOVED MagicBento imports ---
// import MagicBento, { MagicBentoCard } from '@/components/MagicBento';

//import { Navbar } from '@/components/layout/Navbar';
import { ChartCard } from '@/components/ui/ChartCard';
import WeatherWidget from '@/components/widgets/WeatherWidget';
import { InventoryAlerts } from '@/components/widgets/InventoryAlerts';
import CardNav from '@/components/CardNav';

// --- NEWLY IMPORTED COMPONENTS ---
import { AddItemForm } from '@/components/dashboard/AddItemForm';
import { InventoryTable } from '@/components/dashboard/InventoryTable';
import { AddAgentForm } from '@/components/dashboard/AddAgentForm';
import { AgentsList } from '@/components/dashboard/AgentsList';
import { BillingForm } from '@/components/dashboard/BillingForm';
import { DynamicPricingForm } from '@/components/dashboard/DynamicPricingForm';
import { ForecastForm } from '@/components/dashboard/ForecastForm';
import { AnalyticsTable } from '@/components/dashboard/AnalyticsTable';
import { TopSoldLastYear } from '@/components/dashboard/TopSoldLastYear';
import { RegionalTopTable } from '@/components/dashboard/RegionalTopTable';
import { ReplenishmentChecker } from '@/components/dashboard/ReplenishmentChecker';
// --- END NEW IMPORTS ---

// --- Mock Data ---
const salesForecastData = [
  { name: 'Mon', total: 4000 },
  { name: 'Tue', total: 3000 },
  { name: 'Wed', total: 2000 },
  { name: 'Thu', total: 2780 },
  { name: 'Fri', total: 1890 },
  { name: 'Sat', total: 2390 },
  { name: 'Sun', total: 3490 },
];

const pricingSuggestionData = [
  { name: 'Apples', total: 2.99 },
  { name: 'Oranges', total: 3.49 },
  { name: 'Bananas', total: 0.79 },
  { name: 'Grapes', total: 5.99 },
  { name: 'Milk', total: 4.29 },
];
// --- End Mock Data ---

// --- FIXED: Updated CardNav items to use new color palette ---
const items = [
  {
    label: 'About',
    bgColor: 'var(--color-bg-surface)',
    textColor: 'var(--color-text-primary)',
    links: [
      { label: 'Company', ariaLabel: 'About Company', href: '/about/company' },
      { label: 'Careers', ariaLabel: 'About Careers', href: '/about/careers' },
    ],
  },
  {
    label: 'Projects',
    bgColor: 'var(--color-bg-surface)',
    textColor: 'var(--color-text-primary)',
    links: [
      {
        label: 'Featured',
        ariaLabel: 'Featured Projects',
        href: '/landing',
      },
      {
        label: 'Case Studies',
        ariaLabel: 'Project Case Studies',
        href: '/projects/case-studies',
      },
    ],
  },
  {
    label: 'Contact',
    bgColor: 'var(--color-bg-surface)',
    textColor: 'var(--color-text-primary)',
    links: [
      { label: 'Email', ariaLabel: 'Email us', href: '/contact/email' },
      { label: 'Twitter', ariaLabel: 'Twitter', href: '/contact/twitter' },
      {
        label: 'LinkedIn',
        ariaLabel: 'LinkedIn',
        href: '/contact/linkedin',
      },
    ],
  },
];

export default function DashboardPage() {
  // --- Get user data from localStorage ---
  const [userId, setUserId] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [userCountry, setUserCountry] = useState<string>('Norway');

  useEffect(() => {
    // Get user data on component mount
    const id = getUserId();
    const info = getUserInfo();
    
    setUserId(id);
    setUserInfo(info);
    
    // Set user country from user info or default to Norway
    if (info?.region) {
      setUserCountry(info.region);
    }
    
    console.log('📊 Dashboard loaded for user:', id, info);
  }, []);

  type SelectedLocation = { name: string; flag: string } | null;
  const [selectedLocation, setSelectedLocation] =
    useState<SelectedLocation>(null);
  const [isLocationSwitcherOpen, setIsLocationSwitcherOpen] = useState(false);

  // --- Component refresh trigger ---
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const handleItemAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // --- REFACTORED: Combined styles into a single Tailwind class string ---
  // This replaces bentoCardStyle, bentoCardClassName, and bentoCardProps
  const bentoCardClasses =
    'flex flex-col justify-between relative w-full max-w-full rounded-[20px] font-light overflow-hidden transition-all duration-300 ease-in-out hover:-translate-y-0.5 bg-[var(--color-bg-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)]';

  return (
    <div className="flex flex-col h-screen">
      {/* --- FIXED: Updated CardNav props to use new palette --- */}
      <CardNav
        logo="/logo.svg"
        logoAlt="Company Logo"
        items={items}
        baseColor="#fff"
        menuColor="var(--color-text-primary)"
        buttonBgColor="var(--color-bg-surface)"
        buttonTextColor="var(--color-text-primary)"
        ease="power3.out"
        isLocationSwitcherOpen={isLocationSwitcherOpen}
        onToggleLocationSwitcher={() => setIsLocationSwitcherOpen(!isLocationSwitcherOpen)}
        selectedLocation={selectedLocation}
        onLocationChange={setSelectedLocation}
      />
      {/* <Navbar /> */}

      {/* --- FIXED: Updated main background and default text color --- */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-[var(--color-bg-night)] text-[var(--color-text-secondary)]">
        {/* <h1 className="text-3xl font-bold text-gray-100 mb-6  mt-18">Dashboard</h1> */}
        <div className="mt-22">
          {/* --- REMOVED: <MagicBento> wrapper --- */}

          {/* Main responsive grid for the dashboard. */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Main content area (charts) */}
            <div className="xl:col-span-2 flex flex-col gap-6">
              {/* Grid for the top two charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* MODIFIED: Replaced MagicBentoCard with <div> */}
                <div className={bentoCardClasses}>
                  <ChartCard
                    title="Weekly Sales Forecast"
                    data={salesForecastData}
                  />
                </div>

                {/* MODIFIED: Replaced MagicBentoCard with <div> */}
                <div className={bentoCardClasses}>
                  <ChartCard
                    title="AI Price Suggestions"
                    data={pricingSuggestionData}
                    dataKey="total"
                  />
                </div>

                {/* --- NEW MAIN CONTENT COMPONENTS START HERE --- */}

                {/* Analytics Table (Spans full width of this column) */}
                <div className={`${bentoCardClasses} md:col-span-2`}>
                  {userId ? <AnalyticsTable userId={userId} /> : <div className="p-6 text-center text-gray-500">Loading user data...</div>}
                </div>

                {/* Inventory Table (Spans full width of this column) */}
                <div className={`${bentoCardClasses} md:col-span-2`}>
                  <InventoryTable userId={userId || undefined} key={refreshTrigger} />
                </div>

                {/* Top Sold Last Year */}
                <div className={bentoCardClasses}>
                  <TopSoldLastYear userId={userId || undefined} />
                </div>

                {/* Regional Top Sellers */}
                <div className={bentoCardClasses}>
                  <RegionalTopTable country={userCountry} />
                </div>

                {/* --- NEW MAIN CONTENT COMPONENTS END HERE --- */}
              </div>
            </div>

            {/* Right sidebar area (weather & alerts) */}
            <div className="flex flex-col gap-6">
              {/* MODIFIED: Replaced MagicBentoCard with <div> */}
              <div className={bentoCardClasses}>
                <WeatherWidget
                  locationName={selectedLocation ? selectedLocation.name : null}
                />
              </div>

              {/* MODIFIED: Replaced MagicBentoCard with <div> */}
              <div className={bentoCardClasses}>
                <InventoryAlerts />
              </div>

              {/* --- NEW SIDEBAR COMPONENTS START HERE --- */}

              <div className={bentoCardClasses}>
                <AddItemForm userId={userId || undefined} onItemAdded={handleItemAdded} />
              </div>

              {/* <div className={bentoCardClasses}>
                   {/* //<BillingForm userId={userId} /> 
                 </div> */}

              {/* <div className={bentoCardClasses}>
                   <AgentsList userId={userId} />
                 </div> */}

              <div className={bentoCardClasses}>
                {userId ? <AddAgentForm userId={userId} /> : <div className="p-6 text-center text-gray-500">Loading user data...</div>}
              </div>

              <div className={bentoCardClasses}>
                {userId ? <ReplenishmentChecker userId={userId} /> : <div className="p-6 text-center text-gray-500">Loading user data...</div>}
              </div>

              <div className={bentoCardClasses}>
                {userId ? <DynamicPricingForm userId={userId} /> : <div className="p-6 text-center text-gray-500">Loading user data...</div>}
              </div>              <div className={bentoCardClasses}>
                <ForecastForm />
              </div>

              {/* --- NEW SIDEBAR COMPONENTS END HERE --- */}
            </div>
          </div>
          {/* --- REMOVED: </MagicBento> wrapper --- */}
        </div>
      </main>
    </div>
  );
}