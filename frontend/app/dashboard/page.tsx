//import { Navbar } from '@/components/layout/Navbar';
import { ChartCard } from '@/components/ui/ChartCard';
import { WeatherWidget } from '@/components/widgets/WeatherWidget';
import { InventoryAlerts } from '@/components/widgets/InventoryAlerts';

// --- Mock Data ---
// In a real app, you'd fetch this data from your API
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
  return (
    // The RootLayout already provides the Sidebar, so we just build the main content area
    <div className="flex flex-col h-screen">
      

      <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

        {/* Main responsive grid for the dashboard.
          - 1 column on mobile
          - 3 columns on large screens (xl)
        */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Main content area (charts) */}
          <div className="xl:col-span-2 flex flex-col gap-6">
            {/* Grid for the two charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ChartCard 
                title="Weekly Sales Forecast" 
                data={salesForecastData} 
              />
              <ChartCard 
                title="AI Price Suggestions" 
                data={pricingSuggestionData}
                dataKey="total" 
              />
            </div>
            {/* You could add more charts or tables here */}
          </div>

          {/* Right sidebar area (weather & alerts) */}
          <div className="flex flex-col gap-6">
            <WeatherWidget />
            <InventoryAlerts />
          </div>

        </div>
      </main>
    </div>
  );
}