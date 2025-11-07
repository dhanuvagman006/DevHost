// app/dashboard/page.tsx

'use client';

// Make sure to import the refactored components
// Adjust the path as needed
import MagicBento, { MagicBentoCard } from '@/components/MagicBento';

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
const items = [
    {
      label: "About",
      bgColor: "#0D0716",
      textColor: "#fff",
      links: [
        { label: "Company", ariaLabel: "About Company", href: "/about/company" },
        { label: "Careers", ariaLabel: "About Careers", href: "/about/careers" }
      ]
    },
    {
      label: "Projects", 
      bgColor: "#170D27",
      textColor: "#fff",
      links: [
        { label: "Featured", ariaLabel: "Featured Projects" ,href: "/landing"},
        { label: "Case Studies", ariaLabel: "Project Case Studies", href: "/projects/case-studies" }
      ]
    },
    {
      label: "Contact",
      bgColor: "#271E37", 
      textColor: "#fff",
      links: [
        { label: "Email", ariaLabel: "Email us", href: "/contact/email" },
        { label: "Twitter", ariaLabel: "Twitter", href: "/contact/twitter" },
        { label: "LinkedIn", ariaLabel: "LinkedIn", href: "/contact/linkedin" }
      ]
    }
  ];


export default function DashboardPage() {
  // --- Mock User Data (for component props) ---
  // You would replace this with actual session data
  const userId = "user_abc_123";
  const userCountry = "Norway"; // Using this based on your hackathon project
  // --- End Mock User Data ---


  // Define the style for the bento cards
  // This is pulled from your original MagicBento.tsx
  const bentoCardStyle = {
    backgroundColor: 'var(--background-dark, #060010)',
    borderColor: 'var(--border-color, #392e4e)',
    color: 'var(--white, #fff)',
    '--glow-x': '50%',
    '--glow-y': '50%',
    '--glow-intensity': '0',
    '--glow-radius': '200px',
  } as React.CSSProperties;

  // Define the class name for the bento cards.
  // NOTE: We are intentionally REMOVING padding (p-5) and the border
  // to prevent a "card-within-a-card" look. The inner ChartCard/WeatherWidget
  // will control its own padding.
  const bentoCardClassName =
    'card flex flex-col justify-between relative w-full max-w-full rounded-[20px] font-light overflow-hidden transition-all duration-300 ease-in-out hover:-translate-y-0.5 card--border-glow';
  
  // Define props to pass to every MagicBentoCard
  const bentoCardProps = {
    className: bentoCardClassName,
    style: bentoCardStyle,
    enableStars: true,
    enableTilt: true,
    enableMagnetism: true,
    clickEffect: true,
    // Add other props from BentoProps if needed
  };

  return (
    // The RootLayout already provides the Sidebar, so we just build the main content area
    <div className="flex flex-col h-screen" >
      <CardNav
      logo="/logo.svg"
      logoAlt="Company Logo"
      items={items}
      baseColor="#fff"
      menuColor="#000"
      buttonBgColor="#111"
      buttonTextColor="#fff"
      ease="power3.out"
    />
      {/* <Navbar /> */}

      {/* MODIFIED: Added dark background for glow effects */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-gray-900">
        {/* <h1 className="text-3xl font-bold text-gray-100 mb-6  mt-18">Dashboard</h1> */}
      <div className="mt-22">
        {/* MODIFIED: Wrap the entire grid in MagicBento */}
        <MagicBento
          enableSpotlight={true}
          enableBorderGlow={true}
          glowColor="132, 0, 255"
        >
          {/* Main responsive grid for the dashboard.
           * This layout is preserved from your original page.
           */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Main content area (charts) */}
            <div className="xl:col-span-2 flex flex-col gap-6">
              
              {/* Grid for the top two charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* MODIFIED: Wrap ChartCard in MagicBentoCard */}
                <MagicBentoCard {...bentoCardProps}>
                  <ChartCard
                    title="Weekly Sales Forecast"
                    data={salesForecastData}
                  />
                </MagicBentoCard>

                {/* MODIFIED: Wrap ChartCard in MagicBentoCard */}
                <MagicBentoCard {...bentoCardProps}>
                  <ChartCard
                    title="AI Price Suggestions"
                    data={pricingSuggestionData}
                    dataKey="total"
                  />
                </MagicBentoCard>

                {/* --- NEW MAIN CONTENT COMPONENTS START HERE --- */}

                {/* Analytics Table (Spans full width of this column) */}
                <MagicBentoCard {...bentoCardProps} className={`${bentoCardClassName} md:col-span-2`}>
                  <AnalyticsTable userId={userId} />
                </MagicBentoCard>
                
                {/* Inventory Table (Spans full width of this column) */}
                <MagicBentoCard {...bentoCardProps} className={`${bentoCardClassName} md:col-span-2`}>
                  <InventoryTable userId={userId} />
                </MagicBentoCard>

                {/* Top Sold Last Year */}
                <MagicBentoCard {...bentoCardProps}>
                  <TopSoldLastYear userId={userId} />
                </MagicBentoCard>
                
                {/* Regional Top Sellers */}
                <MagicBentoCard {...bentoCardProps}>
                  <RegionalTopTable country={userCountry} />
                </MagicBentoCard>

                {/* --- NEW MAIN CONTENT COMPONENTS END HERE --- */}

              </div>
            </div>

            {/* Right sidebar area (weather & alerts) */}
            <div className="flex flex-col gap-6">
              
              {/* MODIFIED: Wrap WeatherWidget in MagicBentoCard */}
              <MagicBentoCard {...bentoCardProps}>
                <WeatherWidget />
              </MagicBentoCard>

              {/* MODIFIED: Wrap InventoryAlerts in MagicBentoCard */}
              <MagicBentoCard {...bentoCardProps}>
                <InventoryAlerts />
              </MagicBentoCard>

              {/* --- NEW SIDEBAR COMPONENTS START HERE --- */}
              
              <MagicBentoCard {...bentoCardProps}>
                <AddItemForm userId={userId} />
              </MagicBentoCard>
              
              {/* <MagicBentoCard {...bentoCardProps}>
                {/* //<BillingForm userId={userId} /> 
              </MagicBentoCard> */}
              
              {/* <MagicBentoCard {...bentoCardProps}>
                <AgentsList userId={userId} />
              </MagicBentoCard> */}

              <MagicBentoCard {...bentoCardProps}>
                <AddAgentForm userId={userId} />
              </MagicBentoCard>

              <MagicBentoCard {...bentoCardProps}>
                <ReplenishmentChecker userId={userId} />
              </MagicBentoCard>

              <MagicBentoCard {...bentoCardProps}>
                <DynamicPricingForm userId={userId} />
              </MagicBentoCard>

              <MagicBentoCard {...bentoCardProps}>
                <ForecastForm />
              </MagicBentoCard>

              {/* --- NEW SIDEBAR COMPONENTS END HERE --- */}

            </div>
          </div>
        </MagicBento>
        </div>
      </main>
    </div>
  );
}