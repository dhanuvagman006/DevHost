"use client";
import React from "react"; // Removed useState
import { IoLanguage } from "react-icons/io5";
import Flag from "react-world-flags";
// --- 1. Import router hooks ---
import { useRouter, usePathname, useParams } from "next/navigation";

// --- 2. Updated languages array to include 'locale' for the path ---
const languages = [
  { name: "English", isoCode: "gb", locale: "en" }, // 'gb' flag, 'en' path
  { name: "Svenska", isoCode: "se", locale: "se" },
  { name: "Suomi", isoCode: "fi", locale: "fi" },
  { name: "Norsk", isoCode: "no", locale: "no" },
  { name: "Dansk", isoCode: "dk", locale: "dk" },
  { name: "Íslenska", isoCode: "is", locale: "is" },
];

// --- 3. Updated Language type ---
type Language = {
  name: string;
  isoCode: string;
  locale: string; // Added locale for the path
};

interface LanguageSwitcherProps {
  isOpen: boolean;
  onToggle: () => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  isOpen,
  onToggle,
}) => {
  // --- 4. Get router, pathname, and params ---
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  // --- 5. Determine current language from URL params ---
  // params.locale will be 'en', 'se', etc., from your [locale] folder
  const currentLocale = params.locale as string;
  const currentLanguage = languages.find(
    (lang) => lang.locale === currentLocale
  );

  // --- 6. Handle navigation ---
  const handleLanguageChange = (newLocale: string) => {
    // Replace the current locale in the path with the new one
    // e.g., '/en/dashboard' -> '/se/dashboard'
    const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    
    // Use router.push to navigate to the new path
    router.push(newPath);
    onToggle(); // Close the dropdown
  };

  return (
    <div className="relative">
      {/* Visible Button */}
      <div
        className="hidden md:flex items-center justify-center w-11 h-11
        bg-white text-gray-900 rounded-full cursor-pointer shadow-md
        transition-all duration-300 ease-in-out
        hover:bg-gray-100 hover:scale-110"
        onClick={onToggle}
      >
        {/* --- 7. Render flag based on URL, not React state --- */}
        {currentLanguage ? (
          <Flag
            code={currentLanguage.isoCode}
            width="22"
            className="rounded-full object-cover h-[22px]"
          />
        ) : (
          <IoLanguage size={22} />
        )}
      </div>

      {/* Language Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 min-w-max
          bg-white rounded-lg shadow-lg overflow-hidden z-10"
        >
          {languages.map((lang) => (
            <div
              key={lang.name}
              className="flex items-center gap-3 px-4 py-2 cursor-pointer
              hover:bg-gray-100 whitespace-nowrap text-black"
              // --- 8. Update onClick handler to navigate ---
              onClick={() => handleLanguageChange(lang.locale)}
            >
              <Flag code={lang.isoCode} width="20" className="rounded-sm" />
              <span className="text-base font-medium">{lang.name}</span>
            </div>
          ))}
          {/* --- 9. Removed 'Reset' button ---
               It's no longer needed as the URL is the single source of truth.
               The selected language is always the one in the URL.
           */}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;