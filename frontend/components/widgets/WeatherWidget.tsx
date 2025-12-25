"use client";
import React, { useEffect, useState } from "react";
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
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
          <p className="text-sm">No data available</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-between h-full text-center space-y-4">
        {/* Icon */}
        <div className="text-[#00C7BE] pt-2 transform scale-110 drop-shadow-sm">{data.icon}</div>

        {/* Main Info */}
        <div className="text-center">
          <p className="text-6xl font-light text-[#1D1D1F] tracking-tighter">{data.temperature}°</p>
          <p className="text-base font-medium text-gray-500 capitalize">{data.description}</p>
        </div>

        {/* Extra Info */}
        <div className="pb-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full">
            <Wind size={14} className="text-gray-400" />
            <p className="text-xs font-medium text-gray-500">
              {data.windspeed} km/h
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
        {overrideWeather ? "Demo Mode" : locationName || "Nordic Weather"}
      </h3>

      <div className="flex-grow flex items-center justify-center w-full">
        {overrideWeather ? (
          renderWeatherContent(overrideWeather)
        ) : loading ? (
          <div className="flex flex-col items-center justify-center text-center space-y-2 text-gray-400">
            <Loader2 className="animate-spin" size={32} />
            <p className="text-xs">Loading...</p>
          </div>
        ) : (
          renderWeatherContent(weather)
        )}
      </div>
    </div>
  );
};

// Override renderContent helper style as well (since it had text-white)
// We need to inject the style changes inside the helper or just assume the parent handles it? 
// The helper was inside the component scope, so I can update it here.
// But wait, the previous tool call covered the *return statement*, did it cover the helper function definition?
// I should update the *entire component body* or at least the helper function + return.
// Let's verify if I can update the helper function in this block. Yes, the logical place is the `renderWeatherContent` function.


export default WeatherWidget;