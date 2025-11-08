"use client";
import { useEffect, useState } from "react";
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  Wind,
  Thermometer,
  Loader2, // For a better loading icon
} from "lucide-react";

// --- Exported types and data for external control ---

export interface WeatherData {
  temperature: number;
  windspeed: number;
  description: string;
  icon: JSX.Element;
}

// Mock data for different locations
export const mockDataStore: Record<string, WeatherData> = {
  Default: {
    temperature: 12,
    windspeed: 15,
    description: "Cloudy",
    icon: <Cloud size={80} />,
  },
  Sweden: {
    temperature: 5,
    windspeed: 20,
    description: "Snowy",
    icon: <CloudSnow size={80} />,
  },
  Finland: {
    temperature: 2,
    windspeed: 18,
    description: "Very Cold",
    icon: <CloudSnow size={80} />,
  },
  Norway: {
    temperature: 8,
    windspeed: 25,
    description: "Windy",
    icon: <Wind size={80} />,
  },
  Denmark: {
    temperature: 10,
    windspeed: 12,
    description: "Rainy",
    icon: <CloudRain size={80} />,
  },
  Iceland: {
    temperature: 1,
    windspeed: 30,
    description: "Icy",
    icon: <Thermometer size={80} />,
  },
  Sunny: {
    temperature: 24,
    windspeed: 5,
    description: "Sunny",
    icon: <Sun size={80} />,
  },
};

// Export the keys for easy use in dropdowns/buttons
export type MockLocationKey = keyof typeof mockDataStore;

// --- Component Props ---

interface WeatherWidgetProps {
  // Use locationName to fetch data (real or mock)
  locationName: string | null;

  // Use overrideWeather to manually set the state for demonstration
  // This will bypass the internal loading and fetching state
  overrideWeather?: WeatherData | null;
}

// --- The Widget Component ---

const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  locationName,
  overrideWeather,
}) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If overrideWeather is provided, this internal logic is less important
    // but we still run it in case overrideWeather is removed
    // to show the "fetched" state.

    // --- MOCK LOGIC FOR PRESENTATION ---
    setLoading(true);
    const timer = setTimeout(() => {
      if (locationName && mockDataStore[locationName]) {
        setWeather(mockDataStore[locationName]);
      } else {
        setWeather(mockDataStore["Default"]); // Fallback to default mock
      }
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
    // --- END OF MOCK LOGIC ---

    // --- REAL FETCH LOGIC (Commented out) ---
    /*
      Your real fetch logic would go here.
      It would be skipped if overrideWeather is set, 
      or you could disable this useEffect entirely when overrideWeather is active.
    */
    // --- END OF REAL FETCH LOGIC ---
  }, [locationName]);

  // --- Render Logic ---

  // Helper function to render the weather content
  // This is used for both overrideWeather and the internal state
  const renderWeatherContent = (data: WeatherData | null) => {
    if (!data) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <p className="text-lg opacity-80">No weather data.</p>
          <p className="text-sm opacity-60">Select a location.</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-between h-full text-center space-y-4">
        {/* Icon */}
        <div className="text-white opacity-90 pt-4">{data.icon}</div>

        {/* Main Info */}
        <div className="text-center">
          <p className="text-6xl font-extrabold">{data.temperature}°C</p>
          <p className="text-xl capitalize opacity-80">{data.description}</p>
        </div>

        {/* Extra Info */}
        <div className="pb-4">
          <p className="text-sm opacity-70">
            Wind: {data.windspeed} km/h
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 text-white bg-gradient-to-br from-blue-500 to-indigo-700 rounded-2xl shadow-lg w-full max-w-xs mx-auto min-h-[360px] flex flex-col">
      <h3 className="text-2xl font-bold mb-4 text-center text-white/90 flex-shrink-0">
        {overrideWeather ? "Demo Mode" : locationName || "Nordic Weather"}
      </h3>

      <div className="flex-grow flex items-center justify-center">
        {overrideWeather ? (
          // If overrideWeather is provided, render it directly
          renderWeatherContent(overrideWeather)
        ) : loading ? (
          // Otherwise, show loading state
          <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
            <Loader2 className="animate-spin" size={48} />
            <p className="text-lg opacity-80">Loading...</p>
          </div>
        ) : (
          // Or render the fetched weather
          renderWeatherContent(weather)
        )}
      </div>
    </div>
  );
};

export default WeatherWidget;