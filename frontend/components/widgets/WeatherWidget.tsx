import { Sun, Cloud, Thermometer } from 'lucide-react';

// This is a Server Component. 
// In a real app, you could make this component `async` and fetch
// real data from your '/api/weather' route here.

export function WeatherWidget() {
  // Mock data
  const weather = {
    location: 'London, UK',
    temperature: 15,
    condition: 'Cloudy',
    icon: <Cloud className="w-12 h-12 text-gray-500" />,
    impact: 'Low impact on sales expected.'
  };

  // You could add logic here to change the icon based on condition
  // if (weather.condition === 'Sunny') {
  //   weather.icon = <Sun className="w-12 h-12 text-yellow-500" />;
  // }

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Live Weather</h3>
      <div className="flex items-center gap-4">
        <div>{weather.icon}</div>
        <div className="flex-1">
          <p className="text-xl font-bold text-gray-900">{weather.location}</p>
          <p className="text-gray-600">{weather.condition}</p>
        </div>
        <div className="flex items-center gap-1 text-2xl font-bold text-gray-900">
          <Thermometer className="w-6 h-6 text-red-500" />
          {weather.temperature}°C
        </div>
      </div>
      <p className="mt-4 text-sm text-gray-500 italic">
        {weather.impact}
      </p>
    </div>
  );
}