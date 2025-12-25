"use client";
import React, {
  useLayoutEffect,
  useRef,
  useState,
  useEffect,
} from "react";
import { gsap } from "gsap";
import { GoArrowUpRight } from "react-icons/go";
import { useRouter } from "next/navigation";
import { FaUser } from "react-icons/fa";

import LanguageSwitcher from "./LanguageSwitcher";
import LocationSwitcher, { Location } from "./LocationSwitcher";



type CardNavLink = {
  label: string;
  href: string;
  ariaLabel: string;
};

export type CardNavItem = {
  label: string;
  bgColor: string;
  textColor: string;
  links: CardNavLink[];
};

// --- 1. SIMPLIFY PROPS ---
// Most props are removed, as they will be defined inside
export interface CardNavProps {
  className?: string;
  ease?: string;
  baseColor?: string;
  menuColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
}

// --- 2. UPDATE COMPONENT SIGNATURE & PROVIDE DEFAULTS ---
const CardNav: React.FC<CardNavProps> = ({
  className = "",
  ease = "power3.out",
  baseColor = "#fff",
  menuColor,
  buttonBgColor = "#f0f0f0", // Added default
  buttonTextColor = "#000", // Added default
}) => {
  // --- 3. DEFINE DATA/CONTENT INTERNALLY ---
  const logo = "/logo.svg"; // Example path, replace with your actual logo path
  const logoAlt = "Company Logo";
  const items: CardNavItem[] = [
    {
      label: "Dashboard",
      bgColor: "#f4f4f5", // zinc-100
      textColor: "#18181b", // zinc-900
      links: [{ label: "Go to Dashboard", href: "/dashboard", ariaLabel: "Go to Dashboard" }],
    },
    {
      label: "Billing",
      bgColor: "#dcfce7", // green-100
      textColor: "#166534", // green-800
      links: [{ label: "Manage Billing", href: "/billing", ariaLabel: "Manage Billing" }],
    },
    {
      label: "Supply Chain",
      bgColor: "#dbeafe", // blue-100
      textColor: "#1e40af", // blue-800
      links: [{ label: "Contact Support", href: "/support", ariaLabel: "Contact Support" }],
    },
  ];

  // --- 4. DEFINE STATE INTERNALLY ---

  const [selectedLocation, setSelectedLocation] = useState<Location>({
    name: "Global",
    flag: "🌍",
  });

  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // This state is now only for the language switcher
  const [activeDropdown, setActiveDropdown] = useState<"language" | "location" | null>(null);
  // The selectedLocation state above is now used for LocationSwitcher
  // const [selectedLocation, setSelectedLocation] = useState<Location>({
  //   name: "Global",
  //   flag: "🌍",
  // });

  const navRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const router = useRouter();

  const locationRef = useRef<HTMLDivElement | null>(null);
  const languageRef = useRef<HTMLDivElement | null>(null);

  // --- 5. DEFINE STATE HANDLERS INTERNALLY ---

  const toggleLocation = () => {
    setActiveDropdown(activeDropdown === "location" ? null : "location");
  };

  const onLocationChange = (location: Location) => {
    setSelectedLocation(location);
    setActiveDropdown(null);
  };

  const toggleLanguage = () => {
    setActiveDropdown(activeDropdown === "language" ? null : "language");
  };

  const handleNavigate = () => {
    router.push("/profile");
  };

  // Click-outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check for clicks outside the language switcher
      const isOutsideLanguage =
        activeDropdown === "language" &&
        languageRef.current &&
        !languageRef.current.contains(event.target as Node);

      const isOutsideLocation =
        activeDropdown === "location" &&
        locationRef.current &&
        !locationRef.current.contains(event.target as Node);

      if (isOutsideLanguage || isOutsideLocation) {
        setActiveDropdown(null);
      }

      // Ideally we would check location too, but let's stick to language for now as it was causing issues.
      // Or better, logic:
      if (activeDropdown !== null) {
        // Logic to close if click is outside both?
        // Simply:
        if (
          activeDropdown === 'language' && isOutsideLanguage
        ) {
          setActiveDropdown(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // Dependencies are now internal state/handlers
  }, [activeDropdown]);

  // ... (calculateHeight, createTimeline, etc. remain unchanged) ...
  const calculateHeight = () => {
    const navEl = navRef.current;
    if (!navEl) return 64;

    const contentEl = navEl.querySelector(".card-nav-content") as HTMLElement;
    if (contentEl) {
      const wasVisible = contentEl.style.visibility;
      const wasPointerEvents = contentEl.style.pointerEvents;
      const wasPosition = contentEl.style.position;
      const wasHeight = contentEl.style.height;

      contentEl.style.visibility = "visible";
      contentEl.style.pointerEvents = "auto";
      contentEl.style.position = "static";
      contentEl.style.height = "auto";

      contentEl.offsetHeight;

      const topBar = 64;
      const padding = 16;
      const contentHeight = contentEl.scrollHeight;

      contentEl.style.visibility = wasVisible;
      contentEl.style.pointerEvents = wasPointerEvents;
      contentEl.style.position = wasPosition;
      contentEl.style.height = wasHeight;

      return topBar + contentHeight + padding;
    }

    return 260;
  };

  const createTimeline = () => {
    const navEl = navRef.current;
    if (!navEl) return null;

    gsap.set(navEl, { height: 64, overflow: "hidden" });
    gsap.set(cardsRef.current, { y: 50, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    tl.to(navEl, {
      height: calculateHeight,
      duration: 0.4,
      ease,
    });

    tl.to(
      cardsRef.current,
      { y: 0, opacity: 1, duration: 0.4, ease, stagger: 0.08 },
      "-=0.1"
    );

    return tl;
  };

  useLayoutEffect(() => {
    const tl = createTimeline();
    tlRef.current = tl;

    return () => {
      tl?.kill();
      tlRef.current = null;
    };
  }, [ease]); // Removed 'items' as it's a stable internal constant

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!tlRef.current) return;

      if (isExpanded) {
        const newHeight = calculateHeight();
        gsap.set(navRef.current, { height: newHeight });

        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          newTl.progress(1);
          tlRef.current = newTl;
        }
      } else {
        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          tlRef.current = newTl;
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isExpanded]);

  const toggleMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;
    if (!isExpanded) {
      setIsHamburgerOpen(true);
      setIsExpanded(true);
      tl.play(0);
    } else {
      setIsHamburgerOpen(false);
      tl.eventCallback("onReverseComplete", () => setIsExpanded(false));
      tl.reverse();
    }
  };


  const setCardRef = (i: number) => (el: HTMLDivElement | null) => {
    if (el) cardsRef.current[i] = el;
  };

  return (
    <div
      className={`card-nav-container relative left-1/2 -translate-x-1/2 w-[90%] max-w-[850px] z-[99] top-[1.2em] md:top-[2em] ${className}`}
    >
      {/* --- LocationSwitcher now uses internal state --- */}
      <div
        className="absolute right-full top-1/2 -translate-x-4 -translate-y-1/2 mr-8 hidden md:block"
        ref={locationRef}
      >
        <LocationSwitcher
          isOpen={activeDropdown === 'location'}
          onToggle={toggleLocation}
          selectedLocation={selectedLocation}
          onLocationChange={onLocationChange}
        />
      </div>

      <nav
        ref={navRef}
        className={`card-nav ${isExpanded ? "open" : ""
          } block h-[64px] p-0 bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.04)] ring-1 ring-white/60 relative overflow-hidden will-change-[height]`}
        style={{ backgroundColor: isExpanded ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.8)' }}
      >
        <div className="card-nav-top absolute inset-x-0 top-0 h-[64px] flex items-center justify-between p-2 pl-[1.1rem] z-[2]">
          <div
            className={`hamburger-menu ${isHamburgerOpen ? "open" : ""
              } group h-full flex flex-col items-center justify-center cursor-pointer gap-[5px] order-2 md:order-none opacity-80 hover:opacity-100 transition-opacity`}
            onClick={toggleMenu}
            role="button"
            aria-label={isExpanded ? "Close menu" : "Open menu"}
            tabIndex={0}
            style={{
              color: "#1D1D1F",
            }}
          >
            <div
              className={`hamburger-line w-[24px] h-[2px] bg-current transition-[transform,opacity,margin] duration-300 ease-spring [transform-origin:50%_50%] ${isHamburgerOpen ? "translate-y-[3.5px] rotate-45" : ""
                }`}
            />
            <div
              className={`hamburger-line w-[24px] h-[2px] bg-current transition-[transform,opacity,margin] duration-300 ease-spring [transform-origin:50%_50%] ${isHamburgerOpen ? "-translate-y-[3.5px] -rotate-45" : ""
                }`}
            />
          </div>

          {/* --- Logo now uses internal data --- */}
          <div className="logo-container flex items-center md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 order-1 md:order-none">
            <a href="/dashboard" aria-label="Go to Dashboard" className="font-semibold text-lg text-[#1D1D1F] tracking-tight">
              Folkspace
              {/* <img src={logo} alt={logoAlt} className="logo h-[32px]" /> */}
            </a>
          </div>
        </div>

        <div
          className={`card-nav-content absolute left-0 right-0 top-[64px] bottom-0 p-2 flex flex-col items-stretch gap-2 justify-start z-[1] ${isExpanded
            ? "visible pointer-events-auto"
            : "invisible pointer-events-none"
            } md:flex-row md:items-stretch md:gap-[12px]`}
          aria-hidden={!isExpanded}
        >
          {/* --- Items now uses internal data --- */}
          {(items || []).slice(0, 3).map((item, idx) => (
            <div
              key={`${item.label}-${idx}`}
              className="nav-card select-none relative flex flex-col justify-between p-[16px_20px] rounded-xl min-w-0 flex-[1_1_auto] h-auto min-h-[80px] md:min-h-0 md:flex-[1_1_0%] cursor-pointer transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
              ref={setCardRef(idx)}
              style={{ backgroundColor: "#F5F5F7", color: "#1D1D1F" }}
              onClick={() => {
                const link = item.links?.[0]?.href;
                if (link) {
                  if (link.startsWith("http") || link.startsWith("//")) {
                    window.location.href = link;
                  } else {
                    router.push(link);
                  }
                }
              }}
            >
              <div className="nav-card-label font-medium tracking-tight text-[16px] md:text-[18px]">
                {item.label}
              </div>

              <div className="flex items-center justify-end mt-2 opacity-50">
                <GoArrowUpRight className="text-[18px]" />
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* --- Floating Profile & Language Buttons --- */}
      <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 flex items-center gap-4">
        {/* Profile Button */}
        <div
          className="hidden md:flex items-center justify-center w-11 h-11 bg-white text-gray-900 rounded-full cursor-pointer shadow-md transition-all duration-300 ease-in-out hover:bg-gray-100 hover:scale-110"
          onClick={handleNavigate}
        >
          <FaUser size={20} />
        </div>

        {/* Language Switcher */}
        <div ref={languageRef}>
          <LanguageSwitcher
            isOpen={activeDropdown === "language"}
            onToggle={toggleLanguage}
          />
        </div>
      </div>
    </div>
  );
};

export default CardNav;