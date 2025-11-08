// components/LanguageSwitcher.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import ReactCountryFlag from "react-country-flag";
import { ChevronDown, MapPin } from "lucide-react";

// Supported locales + their default locations
const localeConfig = {
  da: { code: "DK", name: "Dansk", location: "Copenhagen, Denmark" },
  en: { code: "US", name: "English", location: "Copenhagen, Denmark" }, // fallback still Denmark
  sv: { code: "SE", name: "Svenska", location: "Copenhagen, Denmark" },
  no: { code: "NO", name: "Norsk", location: "Copenhagen, Denmark" },
  fi: { code: "FI", name: "Suomi", location: "Copenhagen, Denmark" },
};

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();

  // ✅ Default fallback: Denmark
  const currentLocaleData =
    localeConfig[locale as keyof typeof localeConfig] || localeConfig["da"];

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = (newLocale: string) => {
    console.log("Change language to:", newLocale);
    setIsOpen(false);
  };

  return (
    <div className="relative flex items-center space-x-3" ref={dropdownRef}>
      {/* Location with Icon */}
      <div className="flex items-center text-gray-300">
        <MapPin className="h-4 w-4 mr-1 text-blue-400" />
        <span className="text-sm">{currentLocaleData.location}</span>
      </div>

      {/* Language Selector */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center p-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          aria-label="Select language"
        >
          <ReactCountryFlag
            countryCode="DK"
            svg
            style={{ width: "1.5em", height: "1.5em" }}
            title={locale.toUpperCase()}
          />
          <ChevronDown
            className={`h-4 w-4 ml-1 transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}
          />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50">
            {Object.keys(localeConfig)
              .filter((key) => key !== locale)
              .map((key) => {
                const { code, name } = localeConfig[key as keyof typeof localeConfig];
                return (
                  <button
                    key={key}
                    onClick={() => handleLanguageChange(key)}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-700"
                  >
                    <ReactCountryFlag
                      countryCode={code}
                      svg
                      style={{ width: "1.25em", height: "1.25em" }}
                      className="mr-3"
                    />
                    {name}
                  </button>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
