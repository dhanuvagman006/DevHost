"use client";
import React from "react";
import { IoLocationOutline } from "react-icons/io5";
import Flag from "react-world-flags"; // --- 1. Import the Flag component ---

// --- LOCATION DATA (isoCode is used by react-world-flags) ---
const nordicLocations = [
  { name: "Sweden", isoCode: "se" },
  { name: "Finland", isoCode: "fi" },
  { name: "Norway", isoCode: "no" },
  { name: "Denmark", isoCode: "dk" },
  { name: "Iceland", isoCode: "is" },
];

// --- TYPE FOR LOCATION (unchanged) ---
type Location = {
  name: string;
  isoCode: string;
} | null;

// --- PROPS (unchanged) ---
interface LocationSwitcherProps {
  isOpen: boolean;
  onToggle: () => void;
  selectedLocation: Location;
  onLocationChange: (location: Location) => void;
}

const LocationSwitcher: React.FC<LocationSwitcherProps> = ({
  isOpen,
  onToggle,
  selectedLocation,
  onLocationChange,
}) => {
  return (
    <div className="relative">
      {/* Visible Button */}
      <div
        className="hidden md:flex items-center gap-2 cursor-pointer bg-white text-gray-900 px-4 py-2 rounded-lg shadow-md transition-all duration-300 ease-in-out hover:bg-gray-100 hover:scale-110"
        onClick={onToggle}
      >
        {selectedLocation ? (
          // --- 2. Use the Flag component ---
          <Flag
            code={selectedLocation.isoCode}
            width="20" // Set width
            className="rounded-sm"
          />
        ) : (
          <IoLocationOutline size={20} />
        )}
        <span className="text-base font-medium">
          {selectedLocation ? selectedLocation.name : "Location"}
        </span>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 min-w-full bg-white rounded-lg shadow-lg overflow-hidden z-10">
          {nordicLocations.map((loc) => (
            <div
              key={loc.name}
              className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-100 whitespace-nowrap text-black"
              onClick={() => {
                onLocationChange(loc);
                // onToggle(); // Parent controls closing
              }}
            >
              {/* --- 3. Use the Flag component in the loop --- */}
              <Flag
                code={loc.isoCode}
                width="20" // Set width
                className="rounded-sm"
              />
              <span className="text-base font-medium p-2">{loc.name}</span>
            </div>
          ))}
          {/* Reset button */}
          {selectedLocation && (
            <div
              className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-100 border-t text-black"
              onClick={() => {
                onLocationChange(null);
                // onToggle(); // Parent controls closing
              }}
            >
              <IoLocationOutline size={20} />
              <span className="text-base font-medium">Location</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationSwitcher;