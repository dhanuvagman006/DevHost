"use client";
import React, { useState } from "react";
import { IoLanguage } from "react-icons/io5";
import Flag from "react-world-flags"; // <-- 1. Imported Flag component

// --- 2. Updated languages array to use isoCode ---
const languages = [
  { name: "English", isoCode: "gb" }, // 'gb' for UK
  { name: "Svenska", isoCode: "se" },
  { name: "Suomi", isoCode: "fi" },
  { name: "Norsk", isoCode: "no" },
  { name: "Dansk", isoCode: "dk" },
  { name: "Íslenska", isoCode: "is" },
];

// --- 3. Updated state type ---
type Language = {
  name: string;
  isoCode: string;
} | null;

interface LanguageSwitcherProps {
  isOpen: boolean;
  onToggle: () => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  isOpen,
  onToggle,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(null);

  return (
    <div className="relative">
      {/* Visible Button */}
      <div
        className="hidden md:flex items-center justify-center w-11 h-11 
        bg-white text-gray-900 rounded-full cursor-pointer shadow-md 
        transition-all duration-300 ease-in-out 
        hover:bg-gray-100 hover:scale-110" // <-- 4. Light theme classes
        onClick={onToggle}
      >
        {selectedLanguage ? (
          // --- 5. Use Flag component for selected ---
          <Flag
            code={selectedLanguage.isoCode}
            width="22"
            className="rounded-full object-cover h-[22px]" // Added styling to fit circle
          />
        ) : (
          <IoLanguage size={22} />
        )}
      </div>

      {/* Language Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 min-w-max 
          bg-white rounded-lg shadow-lg overflow-hidden z-10" // <-- 4. Light theme classes
        >
          {languages.map((lang) => (
            <div
              key={lang.name}
              className="flex items-center gap-3 px-4 py-2 cursor-pointer 
              hover:bg-gray-100 whitespace-nowrap text-black" // <-- 4. Light theme classes
              onClick={() => {
                setSelectedLanguage(lang);
                onToggle();
              }}
            >
              {/* --- 6. Use Flag component in list --- */}
              <Flag code={lang.isoCode} width="20" className="rounded-sm" />
              <span className="text-base font-medium">{lang.name}</span>
            </div>
          ))}
          {/* Reset button */}
          {selectedLanguage && (
            <div
              className="flex items-center justify-center gap-2 px-4 py-2 
              cursor-pointer hover:bg-gray-100 
              border-t border-gray-100 text-black" // <-- 4. Light theme classes
              onClick={() => {
                setSelectedLanguage(null);
                onToggle();
              }}
            >
              <IoLanguage size={22} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;