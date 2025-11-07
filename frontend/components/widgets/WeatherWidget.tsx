"use client";

import { useState, useEffect } from "react";
import {
  Sun,
  Cloud,
  Thermometer,
  CloudSnow,
  Wind,
  CloudRain,
  Snowflake,
  MapPin, // Icon for loading/error state
} from "lucide-react";
import { ReactNode } from "react";

// --- Weather Visuals (Unchanged) ---
interface WeatherVisuals {
  icon: ReactNode;
  gradient: string;
  textColor: string;
  impactColor: string;
}
type WeatherCondition =
  | "Snowy"
  | "Snowstorm"
  | "Sunny"
  | "Windy"
  | "Rainy"
  | "Cloudy"
  | "Foggy"
  | string;

const getWeatherVisuals = (condition: WeatherCondition): WeatherVisuals => {
  const iconSize = "w-12 h-12";
  switch (condition) {
    case "Snowy":
      return {
        icon: <CloudSnow className={`${iconSize} text-white`} />,
        gradient: "from-blue-300 to-cyan-200",
        textColor: "text-blue-900",
        impactColor: "text-blue-700",
      };
    case "Snowstorm":
      return {
        icon: <Snowflake className={`${iconSize} text-white animate-spin-slow`} />,
        gradient: "from-gray-400 to-blue-500",
        textColor: "text-gray-900",
        impactColor: "text-red-700 font-semibold",
      };
    case "Sunny":
      return {
        icon: <Sun className={`${iconSize} text-yellow-500`} />,
        gradient: "from-yellow-200 to-orange-200",
        textColor: "text-orange-900",
        impactColor: "text-orange-700",
      };
    case "Windy":
      return {
        icon: <Wind className={`${iconSize} text-teal-500`} />,
        gradient: "from-teal-100 to-green-100",
        textColor: "text-teal-900",
        impactColor: "text-teal-700",
      };
    case "Rainy":
      return {
        icon: <CloudRain className={`${iconSize} text-blue-500`} />,
        gradient: "from-gray-300 to-blue-300",
        textColor: "text-gray-900",
        impactColor: "text-blue-700",
      };
    case "Foggy":
    case "Cloudy":
    default:
      return {
        icon: <Cloud className={`${iconSize} text-gray-500`} />,
        gradient: "from-gray-100 to-gray-200",
        textColor: "text-gray-800",
        impactColor: "text-gray-600",
      };
  }
};

// --- Weather Code Converter (Unchanged) ---
// This is no longer used by the mock fetch, but kept for reference
const getWeatherCondition = (code: number): WeatherCondition => {
  if ([0].includes(code)) return "Sunny";
  if ([1, 2, 3].includes(code)) return "Cloudy";
  if ([45, 48].includes(code)) return "Foggy";
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return "Rainy";
  if ([71, 73, 75, 85, 86].includes(code)) return "Snowy";
  if ([95, 96, 99].includes(code)) return "Snowstorm";
  return "Cloudy";
};

// --- Impact Map (Unchanged) ---
const impactMap: Record<string, string> = {
  Sunny: "Low impact. Boost in outdoor activity sales.",
  Cloudy: "Low impact. Steady retail behavior.",
  Rainy: "Moderate impact. Demand for umbrellas and jackets.",
  Snowy: "High impact. Increased demand for winter wear.",
  Snowstorm: "Severe impact. Likely delays, emergency gear sales.",
  Windy: "Moderate impact. Increased demand for windbreakers.",
  Foggy: "Low visibility, possible travel delays.",
};

// --- Main Weather Widget ---
export default function WeatherWidget() {
  const [weather, setWeather] = useState<any>(null);
  // The 'location' state for lat/lon is no longer needed
  // const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // **MODIFIED:** Replaced geolocation and fetching with a single
  // mock data loader effect.
  useEffect(() => {
    // --- MOCK DATA CONFIGURATION ---
    // Change this to 'false' to test the error state
    const MOCK_SUCCESS = true;
    const SIMULATED_DELAY = 1500; // 1.5 seconds

    setLoading(true);

    const timer = setTimeout(() => {
      if (MOCK_SUCCESS) {
        // --- YOUR MOCK DATA ---
        setWeather({
          location: "Mock City",
          temperature: 25,
          condition: "Sunny",
        });
        // ------------------------
        setError(null);
      } else {
        // Simulate an error
        setError("Failed to fetch mock data. This is a test error.");
        setWeather(null);
      }
      setLoading(false);
    }, SIMULATED_DELAY);

    // Cleanup function to clear the timer if the component unmounts
    return () => clearTimeout(timer);
  }, []); // Empty dependency array ensures this runs once on mount

  // --- Render Logic (Unchanged) ---

  // Loading state
  if (loading) {
    return (
      <div className="p-5 rounded-lg shadow-md bg-gray-100 text-gray-500 italic flex items-center gap-2">
        <MapPin className="w-5 h-5 animate-pulse" />
        Fetching weather data...
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-5 rounded-lg shadow-md bg-red-100 text-red-700 italic flex items-center gap-2">
        <MapPin className="w-5 h-5" />
        {error}
      </div>
    );
  }

  // Success state (weather data is loaded)
  if (!weather) {
    // Fallback, should be covered by loading/error
    return null;
  }

  const visuals = getWeatherVisuals(weather.condition);
  const tempColor = weather.temperature <= 0 ? "text-blue-500" : "text-red-500";
  const impact = impactMap[weather.condition] || "Normal conditions.";

  return (
    <div
      className={`p-5 rounded-lg shadow-md bg-gradient-to-br ${visuals.gradient} transition-all duration-1000 ease-in-out`}
    >
      <h3 className={`text-lg font-semibold ${visuals.textColor} mb-4`}>
        Weather for {weather.location}
      </h3>

      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">{visuals.icon}</div>
        <div className="flex-1">
          <p className={`text-xl font-bold ${visuals.textColor}`}>
            {weather.location}
          </p>
          <p className={`${visuals.textColor} opacity-90`}>
            {weather.condition}
          </p>
        </div>
        <div
          className={`flex items-center gap-1 text-3xl font-bold ${visuals.textColor}`}
        >
          <Thermometer
            className={`w-7 h-7 ${tempColor} transition-colors duration-1000`}
          />
          {weather.temperature}°C
        </div>
      </div>

      <p className={`mt-4 text-sm ${visuals.impactColor} italic`}>{impact}</p>
    </div>
  );
}