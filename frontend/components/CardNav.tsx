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

// --- IMPORT CHILD COMPONENTS ---
import LanguageSwitcher from "./LanguageSwitcher"; // Adjust path if needed
import LocationSwitcher from "./LocationSwitcher"; // Adjust path if needed

// --- TYPE DEFINITIONS ---
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

export interface CardNavProps {
  logo: string;
  logoAlt?: string;
  items: CardNavItem[];
  className?: string;
  ease?: string;
  baseColor?: string;
  menuColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
}

// --- COMPONENT START ---
const CardNav: React.FC<CardNavProps> = ({
  logo,
  logoAlt = "Logo",
  items,
  className = "",
  ease = "power3.out",
  baseColor = "#fff",
  menuColor,
  buttonBgColor,
  buttonTextColor,
}) => {
  // --- HAMBURGER STATE ---
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // --- DROPDOWN STATE ---
  const [activeDropdown, setActiveDropdown] = useState<
    "location" | "language" | null
  >(null);

  // --- REFS ---
  const navRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const router = useRouter();
  const locationRef = useRef<HTMLDivElement | null>(null);
  const languageRef = useRef<HTMLDivElement | null>(null);

  // --- DROPDOWN HANDLERS ---
  const toggleLocation = () => {
    setActiveDropdown(activeDropdown === "location" ? null : "location");
  };

  const toggleLanguage = () => {
    setActiveDropdown(activeDropdown === "language" ? null : "language");
  };

  // Click-outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        activeDropdown &&
        locationRef.current &&
        !locationRef.current.contains(event.target as Node) &&
        languageRef.current &&
        !languageRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeDropdown]);

  // --- HAMBURGER ANIMATION LOGIC ---
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
  }, [ease, items]);

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

  // --- HAMBURGER TOGGLE FUNCTION ---
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
      {/* --- Location Component --- */}
      <div
        className="absolute right-full top-1/2 -translate-y-1/2 mr-8"
        ref={locationRef}
      >
        <LocationSwitcher
          isOpen={activeDropdown === "location"}
          onToggle={toggleLocation}
        />
      </div>

      <nav
        ref={navRef}
        className={`card-nav ${
          isExpanded ? "open" : ""
        } block h-[64px] p-0 rounded-xl shadow-md relative overflow-hidden will-change-[height]`}
        style={{ backgroundColor: baseColor }}
      >
        <div className="card-nav-top absolute inset-x-0 top-0 h-[64px] flex items-center justify-between p-2 pl-[1.1rem] z-[2]">
          
          {/* --- HAMBURGER JSX --- */}
          <div
            className={`hamburger-menu ${
              isHamburgerOpen ? "open" : ""
            } group h-full flex flex-col items-center justify-center cursor-pointer gap-[6px] order-2 md:order-none`}
            onClick={toggleMenu}
            role="button"
            aria-label={isExpanded ? "Close menu" : "Open menu"}
            tabIndex={0}
            style={{
              color: menuColor || (baseColor === "#fff" ? "#000" : "#fff"),
            }}
          >
            <div
              className={`hamburger-line w-[30px] h-[2px] bg-current transition-[transform,opacity,margin] duration-300 ease-linear [transform-origin:50%_50%] ${
                isHamburgerOpen ? "translate-y-[4px] rotate-45" : ""
              }`}
            />
            <div
              className={`hamburger-line w-[30px] h-[2px] bg-current transition-[transform,opacity,margin] duration-300 ease-linear [transform-origin:50%_50%] ${
                isHamburgerOpen ? "-translate-y-[4px] -rotate-45" : ""
              }`}
            />
          </div>

          {/* --- LOGO --- */}
          <div className="logo-container flex items-center md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 order-1 md:order-none">
            <img src={logo} alt={logoAlt} className="logo h-[32px]" />
          </div>

          {/* --- CTA BUTTON --- */}
          <button
            type="button"
            className="card-nav-cta-button hidden md:inline-flex border-0 rounded-[calc(0.75rem-0.2rem)] px-4 items-center h-full font-medium cursor-pointer transition-colors duration-300"
            style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
            onClick={() => router.push("/billing")}
          >
            Go to Billing
          </button>
        </div>

        {/* --- EXPANDABLE CONTENT (CARDS) --- */}
        <div
          className={`card-nav-content absolute left-0 right-0 top-[64px] bottom-0 p-2 flex flex-col items-stretch gap-2 justify-start z-[1] ${
            isExpanded
              ? "visible pointer-events-auto"
              : "invisible pointer-events-none"
          } md:flex-row md:items-stretch md:gap-[12px]`}
          aria-hidden={!isExpanded}
        >
          {/* This maps the 'items' prop to create the cards */}
          {(items || []).slice(0, 3).map((item, idx) => (
            <div
              key={`${item.label}-${idx}`}
              className="nav-card select-none relative flex flex-col justify-between p-[12px_16px] rounded-[calc(0.75rem-0.2rem)] min-w-0 flex-[1_1_auto] h-auto min-h-[60px] md:min-h-0 md:flex-[1_1_0%] cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
              ref={setCardRef(idx)}
              style={{ backgroundColor: item.bgColor, color: item.textColor }}
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
              <div className="nav-card-label font-normal tracking-[-0.5px] text-[18px] md:text-[22px]">
                {item.label}
              </div>

              <div className="flex items-center justify-end mt-2">
                <GoArrowUpRight className="text-[20px]" />
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
          // --- MODIFICATION HERE ---
          onClick={() => router.push("/profile")}
          role="button"
          tabIndex={0}
          // --- END MODIFICATION ---
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