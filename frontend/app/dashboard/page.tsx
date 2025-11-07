// Make sure to import the refactored components
// Adjust the path as needed
import MagicBento, { MagicBentoCard } from '@/components/MagicBento';

//import { Navbar } from '@/components/layout/Navbar';
import { ChartCard } from '@/components/ui/ChartCard';
import  WeatherWidget  from '@/components/widgets/WeatherWidget';
import { InventoryAlerts } from '@/components/widgets/InventoryAlerts';

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

export default function DashboardPage() {
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
      {/* <Navbar /> */}

      {/* MODIFIED: Added dark background for glow effects */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-gray-900 ">
        <h1 className="text-3xl font-bold text-gray-100 mb-6  mt-18">Dashboard</h1>

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
              {/* Grid for the two charts */}
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
              </div>
              {/* You could add more charts or tables here, wrapped in <MagicBentoCard> */}
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

            </div>
          </div>
        </MagicBento>
      </main>
    </div>
  );
}