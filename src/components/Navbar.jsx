import React, { useEffect, useState, useRef, useCallback } from "react";
import { LiquiGlass } from "@liqui-design/glass";
import "@liqui-design/glass/tokens.css";
import { Home, User, Briefcase, Layers, Activity, Cpu, BookOpen } from "lucide-react";
import "./Navbar.css";
import { getAboutScrollTop } from '../utils/aboutScroll';

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: Home },
  { id: "about", label: "About", icon: User },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "work", label: "Work", icon: Layers },
  { id: "blog", label: "Blog", icon: BookOpen },
  { id: "activity", label: "Activity", icon: Activity },
  { id: "skills", label: "Skills", icon: Cpu },
];

const SCROLL_LOCK_MS = 850;

export default function Navbar() {
  const [active, setActive] = useState("home");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const isClickScrolling = useRef(false);
  const lockTimer = useRef(null);

  // Detect which section is active + determine whether navbar should collapse into compact dock
  const detectActiveSection = useCallback(() => {
    const scrollY = window.scrollY;

    // Determine collapse state based on Hero viewport threshold
    const heroEl = document.getElementById("home");
    const heroHeight = heroEl ? heroEl.offsetHeight : 640;
    // Collapse once user scrolls 40% past hero into content sections
    const collapseThreshold = Math.min(heroHeight * 0.42, 380);

    if (scrollY > collapseThreshold) {
      setIsCollapsed(true);
    } else {
      setIsCollapsed(false);
    }

    if (isClickScrolling.current) return;

    // At bottom of page: highlight last section ("skills")
    const isAtBottom =
      window.innerHeight + scrollY >=
      document.documentElement.scrollHeight - 60;

    if (isAtBottom) {
      setActive(NAV_ITEMS[NAV_ITEMS.length - 1].id);
      return;
    }

    // Near top of page: highlight first section ("home")
    if (scrollY < 80) {
      setActive("home");
      return;
    }

    const focalLine = window.innerHeight * 0.35;

    // Walk sections top-to-bottom, pick the LAST one whose top is above the focal line.
    let matched = null;
    for (const item of NAV_ITEMS) {
      const el = document.getElementById(item.id);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (rect.top <= focalLine) {
        matched = item.id;
      }
    }
    if (matched) {
      setActive(matched);
    }
  }, []);

  // Click handler: lock scrollspy, set active immediately, smooth-scroll with dynamic offset
  const handleNavClick = useCallback(
    (event, sectionId) => {
      event.preventDefault();

      // Immediately set active to prevent flicker
      setActive(sectionId);
      isClickScrolling.current = true;

      // Clear any existing lock timer
      if (lockTimer.current) clearTimeout(lockTimer.current);

      const targetEl = document.getElementById(sectionId);
      if (targetEl) {
        const elementTop = targetEl.getBoundingClientRect().top + window.scrollY;
        // Dynamically account for collapsed vs expanded navbar height
        const targetNavHeight = sectionId === "about" || sectionId === "experience" || sectionId === "work" || sectionId === "blog"
          ? parseFloat(window.getComputedStyle(targetEl).scrollMarginTop) || 96
          : isCollapsed || sectionId !== "home" ? 64 : 80;
        // Center the complete content block for viewport-framed sections.
        const centeredContent = ["experience", "blog"].includes(sectionId)
          ? targetEl.firstElementChild
          : null;
        const contentRect = centeredContent?.getBoundingClientRect();
        const offsetPosition = contentRect && contentRect.height <= window.innerHeight - targetNavHeight
          ? Math.max(0, window.scrollY + contentRect.top + contentRect.height / 2 - window.innerHeight / 2)
          : sectionId === "about"
          ? getAboutScrollTop(targetEl)
          : Math.max(0, elementTop - targetNavHeight);

        window.scrollTo({
          top: offsetPosition,
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? "instant" : "smooth",
        });
      }

      // Unlock scrollspy after animation settles
      lockTimer.current = setTimeout(() => {
        isClickScrolling.current = false;
        detectActiveSection();
      }, SCROLL_LOCK_MS);
    },
    [detectActiveSection, isCollapsed]
  );

  useEffect(() => {
    window.addEventListener("scroll", detectActiveSection, { passive: true });
    window.addEventListener("resize", detectActiveSection);
    detectActiveSection();

    return () => {
      window.removeEventListener("scroll", detectActiveSection);
      window.removeEventListener("resize", detectActiveSection);
      if (lockTimer.current) clearTimeout(lockTimer.current);
    };
  }, [detectActiveSection]);

  return (
    <header className={`nb-wrap hidden md:block ${isCollapsed ? "is-collapsed" : "is-expanded"}`}>
      <nav
        className="nb-nav"
        aria-label="Main navigation"
        onMouseLeave={() => setHoveredItem(null)}
      >
        {/* Floating Apple Liquid Glass dock */}
        <LiquiGlass
          radius={9999}
          frost={0.03}
          refraction={60}
          bezel={10}
          blur={1.2}
          specular={0.7}
          elevated={false}
          className={`nb-pill ${isCollapsed ? "is-collapsed" : "is-expanded"}`}
          contentClassName={`nb-pill-inner ${isCollapsed ? "is-collapsed" : "is-expanded"}`}
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            const isHovered = hoveredItem === item.id;
            // In collapsed dock mode, show label if item is active or hovered
            const showLabel = !isCollapsed || isActive || isHovered;

            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`nb-link ${isActive ? "active" : ""} ${isCollapsed ? "dock-mode" : ""}`}
                aria-current={isActive ? "page" : undefined}
                onClick={(e) => handleNavClick(e, item.id)}
                onMouseEnter={() => setHoveredItem(item.id)}
                title={item.label}
              >
                <span className="nb-icon-wrap" aria-hidden="true">
                  <Icon size={isCollapsed ? 15 : 14} className="nb-icon" />
                </span>
                <span
                  className={`nb-label ${showLabel ? "is-visible" : "is-hidden"}`}
                >
                  {item.label}
                </span>
              </a>
            );
          })}
        </LiquiGlass>
      </nav>
    </header>
  );
}
