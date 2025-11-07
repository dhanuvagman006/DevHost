"use client";
import React, { useTransition } from "react";
import { IoLanguage } from "react-icons/io5";
import Flag from "react-world-flags";
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/navigation';

// 1. Updated languages array with 'locale' codes
const languages = [
  { name: "English", isoCode: "gb", locale: "en" },
  { name: "Svenska", isoCode: "se", locale: "sv" },
  { name: "Norsk", isoCode: "no", locale: "no" },
  { name: "Dansk", isoCode: "dk", locale: "da" },
  // ---
  // You also added these. Make sure to add 'fi' and 'is'
  // to your i18n.ts and middleware.ts files!
  { name: "Suomi", isoCode: "fi", locale: "fi" },
  { name: "Íslenska", isoCode: "is", locale: "is" },
];

interface LanguageSwitcherProps {
  isOpen: boolean;
  onToggle: () => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  isOpen,
  onToggle,
}) => {
  // 2. Get hooks from next-intl
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  // 3. Find the selected language from the *actual* current locale
  const selectedLanguage = languages.find(
    (lang) => lang.locale === currentLocale
  );

  // 4. Create the function to change the language
  const onSelectLanguage = (newLocale: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
    onToggle(); // Close the dropdown
  };

  return (
    <div className="relative hidden md:block">
      {/* Visible Button */}
      <div
        className="flex items-center justify-center w-11 h-11 
          bg-white text-gray-900 rounded-full cursor-pointer shadow-md 
          transition-all duration-300 ease-in-out 
          hover:bg-gray-100 hover:scale-110"
        onClick={onToggle}
        role="button"
        aria-label="Toggle language menu"
        aria-expanded={isOpen}
      >
        {selectedLanguage ? (
          <Flag
            code={selectedLanguage.isoCode}
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
          className="absolute top-full right-0 mt-2 w-48 
            bg-white rounded-lg shadow-xl overflow-hidden z-10"
        >
          {languages.map((lang) => (
            <div
              key={lang.name}
              className={`flex items-center gap-3 px-4 py-2 cursor-pointer 
                hover:bg-gray-100 whitespace-nowrap text-black
                ${lang.locale === currentLocale ? 'font-bold bg-gray-100' : ''}
                ${isPending ? 'cursor-not-allowed opacity-60' : ''}
              `}
              onClick={() => {
                if (isPending || lang.locale === currentLocale) return;
                onSelectLanguage(lang.locale);
              }}
              aria-disabled={isPending || lang.locale === currentLocale}
            >
              <Flag code={lang.isoCode} width="20" className="rounded-sm" />
              <span className="text-base font-medium">{lang.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;