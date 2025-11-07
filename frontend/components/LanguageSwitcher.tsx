"use client";
import React, { useState } from "react";
import { IoLanguage } from "react-icons/io5";

const languages = [
  { name: "English", flag: "🇬🇧" },
  { name: "Svenska", flag: "🇸🇪" },
  { name: "Suomi", flag: "🇫🇮" },
  { name: "Norsk", flag: "🇳🇴" },
  { name: "Dansk", flag: "🇩🇰" },
  { name: "Íslenska", flag: "🇮🇸" },
];

interface LanguageSwitcherProps {
  isOpen: boolean;
  onToggle: () => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  isOpen,
  onToggle,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<{
    name: string;
    flag: string;
  } | null>(null);

  return (
    <div className="relative">
      {/* Visible Button */}
      <div
        className="hidden md:flex items-center justify-center w-11 h-11 bg-white text-gray-900 rounded-full cursor-pointer shadow-md transition-all duration-300 ease-in-out hover:bg-gray-100 hover:scale-110"
        onClick={onToggle}
      >
        {selectedLanguage ? (
          <span className="text-xl">{selectedLanguage.flag}</span>
        ) : (
          <IoLanguage size={22} />
        )}
      </div>

      {/* Language Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 min-w-max bg-white rounded-lg shadow-lg overflow-hidden z-10">
          {languages.map((lang) => (
            <div
              key={lang.name}
              className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100 whitespace-nowrap"
              onClick={() => {
                setSelectedLanguage(lang);
                onToggle();
              }}
            >
              <span className="text-xl">{lang.flag}</span>
              <span className="text-base font-medium">{lang.name}</span>
            </div>
          ))}
          {/* Reset button */}
          {selectedLanguage && (
            <div
              className="flex items-center justify-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100 border-t"
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