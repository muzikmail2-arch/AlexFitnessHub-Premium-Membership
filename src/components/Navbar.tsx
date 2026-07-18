import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { Menu, X, Shield, Lock, Award, Sun, Moon } from "lucide-react";
import { motion } from "motion/react";
import Logo from "./Logo";

interface NavbarProps {
  currentView: string;
  setView: (view: string) => void;
  onOpenAuth: () => void;
}

export default function Navbar({ currentView, setView, onOpenAuth }: NavbarProps) {
  const { user, logout, theme, setTheme } = useApp();
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Dynamic scroll listener for past-hero shadow
  useEffect(() => {
    const handleScroll = () => {
      // Past hero section (typically around 500-600px of scroll)
      if (window.scrollY > 350) {
        setIsScrolledPastHero(true);
      } else {
        setIsScrolledPastHero(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNav = (targetView: string, sectionId?: string) => {
    setIsMenuOpen(false);
    if (sectionId) {
      if (currentView !== "home") {
        setView("home");
        setTimeout(() => {
          const el = document.getElementById(sectionId);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 150);
      } else {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    } else {
      setView(targetView);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Centralized Navigation Menu definitions
  const menuItems = user ? (
    user.subscriptionStatus === "premium" ? [
      { id: "home", label: "Home", action: () => handleNav("home") },
      { id: "daily-plan", label: "My Plan", action: () => handleNav("daily-plan") },
      { id: "lifestyle-academy", label: "Academy", action: () => handleNav("lifestyle-academy") },
      { id: "library", label: "Workouts", action: () => handleNav("library") },
      { id: "nutrition", label: "Nutrition", action: () => handleNav("nutrition") },
      { id: "community", label: "Community", action: () => handleNav("community") },
    ] : [
      { id: "home", label: "Home", action: () => handleNav("home") },
      { id: "lifestyle-academy", label: "Academy", action: () => handleNav("lifestyle-academy") },
      { id: "pricing", label: "Pricing", action: () => handleNav("home", "pricing") },
      { id: "testimonials-segment", label: "Reviews", action: () => handleNav("home", "testimonials-segment") },
      { id: "contact", label: "Contact", action: () => handleNav("home", "contact") },
    ]
  ) : [
    { id: "home", label: "Home", action: () => handleNav("home") },
    { id: "lifestyle-academy", label: "Academy", action: () => handleNav("lifestyle-academy") },
    { id: "pricing", label: "Pricing", action: () => handleNav("home", "pricing") },
    { id: "testimonials-segment", label: "Reviews", action: () => handleNav("home", "testimonials-segment") },
    { id: "contact", label: "Contact", action: () => handleNav("home", "contact") },
  ];

  if (user && user.role === "admin") {
    menuItems.push({
      id: "admin",
      label: "Admin CPU",
      action: () => handleNav("admin")
    });
  }

  // 13 Detailed options for the hamburger slide-out menu
  const handleCustomNav = (targetView: string, subview?: string, elementId?: string) => {
    setIsMenuOpen(false);
    
    // Check if view is restricted (requires login)
    const loginRequiredViews = ["daily-plan", "nutrition", "coach", "workout-generator", "library", "community", "dashboard", "weekly-reports", "daily-habit-tracker", "daily-calibration-desk", "handbook", "weight-trajectory", "workout-videos", "saved-exercises", "challenges", "belly-fat-shred"];
    if (loginRequiredViews.includes(targetView) && !user) {
      onOpenAuth();
      return;
    }
    
    // If the user is on the free plan, block premium workouts and redirect to pricing section on Home
    if (user && user.subscriptionStatus !== "premium" && user.role !== "admin") {
      const standalonePremiumViews = ["library", "workout-generator", "workout-videos", "saved-exercises", "coach", "nutrition", "daily-plan", "challenges", "community", "weekly-reports", "daily-habit-tracker", "daily-calibration-desk", "handbook", "weight-trajectory", "dashboard", "belly-fat-shred"];
      if (standalonePremiumViews.includes(targetView)) {
        setView("home");
        setTimeout(() => {
          const el = document.getElementById("pricing");
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 150);
        return;
      }
    }

    setView(targetView);

    if (elementId) {
      setTimeout(() => {
        const el = document.getElementById(elementId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 250);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const isPremium = user && (user.subscriptionStatus === "premium" || user.role === "admin");

  const hamburgerMenuItems = isPremium ? [
    { id: "home", label: "Homepage", sublabel: "Public Hub", action: () => handleCustomNav("home") },
    { id: "lifestyle-academy", label: "Lifestyle Academy", sublabel: "Lifestyle Core Courses", action: () => handleCustomNav("lifestyle-academy") },
    { id: "library", label: "Workouts", sublabel: "Routines & Sets", action: () => handleCustomNav("library") },
    { id: "workout-videos", label: "Videos", sublabel: "Workout Videos", action: () => handleCustomNav("workout-videos") },
    { id: "saved-exercises", label: "Saved", sublabel: "Saved Exercises", action: () => handleCustomNav("saved-exercises") },
    { id: "nutrition", label: "Nutrition", sublabel: "Meal Config", action: () => handleCustomNav("nutrition") },
    { id: "daily-plan", label: "My Plan", sublabel: "Daily Schedules", action: () => handleCustomNav("daily-plan") },
    { id: "coach", label: "AI Coach", sublabel: "AI Optimization", action: () => handleCustomNav("coach") },
    { id: "challenges", label: "Challenges", sublabel: "Monthly Competitions", action: () => handleCustomNav("challenges") },
    { id: "community", label: "Community", sublabel: "Discuss & Post", action: () => handleCustomNav("community") },
    { id: "weekly-reports", label: "Weekly Reports", sublabel: "Premium Audits", action: () => handleCustomNav("weekly-reports") },
    { id: "belly-fat-shred", label: "Belly Fat Shred Program", sublabel: "5-Month Transformation", action: () => handleCustomNav("belly-fat-shred") },
    { id: "daily-habit-tracker", label: "Daily Habit Tracker", sublabel: "Routine Consistency", action: () => handleCustomNav("daily-habit-tracker") },
    { id: "daily-calibration-desk", label: "Daily Calibration Desk", sublabel: "Live Desk", action: () => handleCustomNav("daily-calibration-desk") },
    { id: "handbook", label: "Alex Fitness Hub Handbook", sublabel: "Handbook & Guide", action: () => handleCustomNav("handbook") },
    { id: "weight-trajectory", label: "Weight Trajectory Index", sublabel: "Trajectory Tracking", action: () => handleCustomNav("weight-trajectory") },
    { id: "pricing", label: "Pricing Plans", sublabel: "Upgrade Status", action: () => handleCustomNav("pricing") },
  ] : [
    { id: "home", label: "Homepage", sublabel: "Public Hub", action: () => handleCustomNav("home") },
    { id: "lifestyle-academy", label: "Lifestyle Academy", sublabel: "Free & Premium Courses", action: () => handleCustomNav("lifestyle-academy") },
    { id: "pricing", label: "Pricing Plans", sublabel: "Upgrade Status", action: () => handleCustomNav("pricing") },
  ];

  // Logo elements for header and mobile drawer respectively
  const HeaderLogoElement = () => (
    <a
      href="#home"
      onClick={(e) => {
        e.preventDefault();
        handleNav("home");
      }}
      className="flex items-center select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500 rounded-lg"
      aria-label="AlexFitnessHub Home View"
    >
      <Logo size="sm" showText={true} showSubtext={false} hideTextOnMobile={true} />
    </a>
  );

  const DrawerLogoElement = () => (
    <a
      href="#home"
      onClick={(e) => {
        e.preventDefault();
        handleNav("home");
      }}
      className="flex items-center select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500 rounded-lg"
      aria-label="AlexFitnessHub Home View"
    >
      <Logo size="sm" showText={true} showSubtext={false} hideTextOnMobile={false} />
    </a>
  );

  return (
    <>
      {/* Sticky Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 h-[76px] flex items-center transition-all duration-300 border-b bg-background border-border shadow-sm`}
      >
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          
          {/* DESKTOP HEADER (Screens lg and above) */}
          <div className="hidden lg:flex h-16 items-center justify-between gap-4 w-full">
            {/* Left Column: Logo */}
            <div className="flex items-center flex-shrink-0">
              <HeaderLogoElement />
            </div>

            {/* Center Column: Navigation links */}
            <nav className="flex items-center justify-center flex-1 gap-1.5 xl:gap-3 overflow-x-auto py-1 scrollbar-none">
              {menuItems.map((item) => {
                const isActive = currentView === item.id;
                return (
                  <motion.button
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    key={item.id}
                    onClick={item.action}
                    className={`text-[10px] xl:text-[11px] font-sans font-black uppercase tracking-wider px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap ${
                      isActive
                        ? "bg-primary text-white shadow-sm font-black"
                        : theme === "dark"
                          ? "text-slate-300 hover:bg-white/10"
                          : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {item.label}
                  </motion.button>
                );
              })}
            </nav>

            {/* Right Column: Premium button, Sign In / Sign Out, Profile Avatar & Theme Toggle */}
            <div className="flex items-center gap-3 flex-shrink-0">
              
              {/* Access Premium Button (if user is not premium) */}
              {(!user || user.subscriptionStatus !== "premium") && (
                <motion.button
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setView("pricing")}
                  className="inline-flex items-center gap-1.5 text-[11px] font-sans font-black uppercase tracking-wider h-9 px-5 rounded-full bg-primary text-white hover:opacity-90 transition-all duration-200 cursor-pointer shadow-md"
                >
                  <Award className="w-4 h-4" />
                  <span>Access Premium</span>
                </motion.button>
              )}

              {/* Login/Logout Button */}
              {!user ? (
                <motion.button
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onOpenAuth}
                  className={`inline-flex text-[11px] font-sans font-bold uppercase tracking-wider h-9 px-5 rounded-full border transition-all duration-200 cursor-pointer ${
                    theme === "dark"
                      ? "border-slate-700 text-white hover:bg-white/10"
                      : "border-slate-300 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Sign In
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={logout}
                  className={`inline-flex text-[11px] font-sans font-bold uppercase tracking-wider h-9 px-5 rounded-full border transition-all duration-200 cursor-pointer ${
                    theme === "dark"
                      ? "border-slate-800 text-slate-300 hover:bg-white/10"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Sign Out
                </motion.button>
              )}

              {/* Profile Avatar (if logged in) */}
              {user && (
                <div 
                  onClick={() => setView("dashboard")} 
                  className="w-8 h-8 rounded-full overflow-hidden border border-border cursor-pointer select-none flex items-center justify-center shrink-0"
                  title="View Dashboard / Profile"
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || "User"} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full bg-primary flex items-center justify-center text-white font-black text-xs uppercase">
                      {user.displayName ? user.displayName[0] : (user.email ? user.email[0] : "A")}
                    </div>
                  )}
                </div>
              )}

              {/* Theme Toggle Switch with Website Name */}
              <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-3 ml-1 shrink-0">
                <span className="font-sans font-black text-[11px] uppercase tracking-tight text-slate-900 dark:text-white">
                  ALEXFITNESS<span className="text-[#0EA5E9] font-black">HUB</span>
                </span>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  whileTap={{ scale: 0.9, rotate: -15 }}
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className={`p-2 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center border ${
                    theme === "dark"
                      ? "text-white hover:bg-white/10 border-slate-800"
                      : "text-slate-700 hover:bg-slate-100 border-slate-200"
                  }`}
                  aria-label="Toggle Theme"
                  id="navbar-theme-toggle"
                >
                  {theme === "dark" ? (
                    <Sun className="w-4 h-4 text-amber-300 fill-amber-300" />
                  ) : (
                    <Moon className="w-4 h-4 text-slate-700 fill-slate-700" />
                  )}
                </motion.button>
              </div>

            </div>
          </div>

          {/* MOBILE HEADER (Screens below lg) */}
          <div className="flex lg:hidden h-16 items-center justify-between w-full relative">
            {/* Left Column: Logo & Theme switch side-by-side */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 min-w-0 z-10">
              <HeaderLogoElement />
              
              {/* Mobile Header Theme Toggle beside logo */}
              <div className="flex items-center gap-1.5 shrink-0">
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  whileTap={{ scale: 0.9, rotate: -15 }}
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className={`p-2 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center border shrink-0 ${
                    theme === "dark"
                      ? "text-white hover:bg-white/10 border-slate-800"
                      : "text-slate-700 hover:bg-slate-100 border-slate-200"
                  }`}
                  aria-label="Toggle Theme"
                  id="navbar-mobile-theme-toggle"
                >
                  {theme === "dark" ? (
                    <Sun className="w-4 h-4 text-amber-300 fill-amber-300" />
                  ) : (
                    <Moon className="w-4 h-4 text-slate-700 fill-slate-700" />
                  )}
                </motion.button>
              </div>
            </div>

            {/* Center Column: Prominent Centered Title ALEXFITNESSHUB in the red-marked area */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="font-sans font-black text-xs min-[360px]:text-[13px] uppercase tracking-wider text-slate-900 dark:text-white pointer-events-auto select-none">
                ALEXFITNESS<span className="text-[#0EA5E9] font-black">HUB</span>
              </span>
            </div>

            {/* Right Column: Hamburger Menu only */}
            <div className="flex items-center flex-shrink-0 z-10">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMenuOpen(true)}
                className={`p-2 rounded-xl transition focus:outline-none cursor-pointer border ${
                  theme === "dark"
                    ? "border-slate-800 text-white hover:bg-white/5"
                    : "border-slate-200 text-slate-800 hover:bg-slate-50"
                }`}
                aria-label="Open Navigation Menu"
              >
                <div className="space-y-1.5 w-6">
                  <span className={`block h-0.5 w-6 rounded transition ${theme === "dark" ? "bg-white" : "bg-slate-800"}`}></span>
                  <span className={`block h-0.5 w-6 rounded transition ${theme === "dark" ? "bg-white" : "bg-slate-800"}`}></span>
                  <span className={`block h-0.5 w-6 rounded transition ${theme === "dark" ? "bg-white" : "bg-slate-800"}`}></span>
                </div>
              </motion.button>
            </div>
          </div>

        </div>
      </header>

      {/* Slide-In Left Side Panel */}
      <div 
        className={`fixed inset-0 z-50 transition-all duration-300 ${
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation Menu"
        aria-hidden={!isMenuOpen}
      >
        {/* Dimmed backdrop overlay that handles clicks to close */}
        <div 
          className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />

        {/* Snappy Left Slide-in Panel */}
        <div
          className={`absolute top-0 bottom-0 left-0 w-[65%] sm:w-[50%] md:w-[40%] shadow-[8px_0_32px_rgba(0,0,0,0.15)] p-6 flex flex-col justify-between pointer-events-auto transition-transform duration-[280ms] ease-out ${
            theme === "dark"
              ? "bg-[#0A0E17] border-r border-slate-900"
              : "bg-white border-r border-slate-200"
          } ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Top Panel Brand Logo */}
          <div className="space-y-4 flex flex-col h-full overflow-hidden">
            <div className={`flex justify-between items-center pb-3 border-b shrink-0 ${
              theme === "dark" ? "border-slate-900" : "border-slate-100"
            }`}>
              <DrawerLogoElement />
              {/* Sidebar Theme toggle */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.9, rotate: -15 }}
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={`p-1.5 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center border ${
                  theme === "dark"
                    ? "hover:bg-slate-800 border-slate-800 text-white"
                    : "hover:bg-slate-100 border-slate-200 text-slate-700"
                }`}
                aria-label="Toggle Theme"
                id="sidebar-theme-toggle"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4 text-amber-500 fill-amber-500" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-700 fill-slate-700" />
                )}
              </motion.button>
            </div>

            {/* User Profile Card with Premium Badge */}
            {user && (
              <div className={`flex items-center gap-3 p-3 rounded-2xl border shrink-0 ${
                theme === "dark"
                  ? "bg-slate-950/80 border-slate-900"
                  : "bg-slate-50 border-slate-150"
              }`}>
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName} className="w-10 h-10 rounded-full object-cover shadow-inner shrink-0" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[var(--accent-gold)] flex items-center justify-center text-[var(--gold-btn-text)] font-black text-sm uppercase shadow-inner shrink-0">
                    {user.displayName ? user.displayName[0] : (user.email ? user.email[0] : "A")}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className={`text-xs font-black truncate leading-tight uppercase font-sans ${
                    theme === "dark" ? "text-white" : "text-slate-900"
                  }`}>
                    {user.displayName || "Athlete"}
                  </h4>
                  <p className={`text-[9px] truncate leading-none mt-0.5 font-sans ${
                    theme === "dark" ? "text-slate-400" : "text-slate-500"
                  }`}>
                    {user.email}
                  </p>
                  
                  {user.subscriptionStatus === "premium" ? (
                    <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full mt-1.5 animate-pulse">
                      👑 Premium Athlete
                    </span>
                  ) : (
                    <span className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase px-2 py-0.5 rounded-full mt-1.5 border ${
                      theme === "dark"
                        ? "text-slate-400 bg-slate-900 border-slate-800"
                        : "text-slate-600 bg-slate-100 border-slate-200"
                    }`}>
                      ⭐ Standard Athlete
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Vertical list of nav links with dividers */}
            <nav className="flex flex-col space-y-1 overflow-y-auto pr-1 flex-grow" aria-label="Mobile Drawer Navigation Menu">
              {hamburgerMenuItems.map((item) => {
                const isActive = currentView === item.id;
                return (
                  <div key={item.id} className="w-full">
                    <button
                      onClick={item.action}
                      className={`w-full text-left py-2 px-3.5 rounded-xl transition-all duration-200 flex flex-col justify-center cursor-pointer ${
                        isActive
                          ? "bg-[var(--accent-gold)] text-[var(--gold-btn-text)]"
                          : theme === "dark"
                            ? "text-slate-300 hover:bg-slate-900"
                            : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span className="text-xs font-sans font-black uppercase tracking-wider leading-none">
                        {item.label}
                      </span>
                      <span className={`text-[9px] font-sans font-semibold mt-0.5 leading-none ${
                        isActive 
                          ? theme === "dark" ? "text-slate-950/80" : "text-white/85" 
                          : "text-slate-400"
                      }`}>
                        {item.sublabel}
                      </span>
                    </button>
                    {/* Theme-aware divider */}
                    <div className={`h-px my-1 last:hidden ${
                      theme === "dark" ? "bg-slate-900" : "bg-slate-100"
                    }`} />
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Bottom Panel CTA: login options */}
          <div className={`pt-5 border-t space-y-2 ${
            theme === "dark" ? "border-slate-900" : "border-slate-100"
          }`}>
            {!user ? (
              <>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenAuth();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[var(--accent-gold)] text-[var(--gold-btn-text)] hover:bg-[var(--accent-gold-hover)] active:scale-95 transition-all duration-200 font-sans font-bold text-xs uppercase tracking-wider shadow-sm cursor-pointer border-0"
                >
                  <Lock className="w-4 h-4" />
                  <span>Login / Sign In</span>
                </button>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenAuth();
                  }}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border active:scale-95 transition-all duration-200 font-sans font-bold text-xs tracking-wide shadow-xs cursor-pointer ${
                    theme === "dark"
                      ? "border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-900"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 w-full">
                {user.subscriptionStatus === "premium" ? (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setView("daily-plan");
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-[var(--accent-gold)] text-[var(--gold-btn-text)] hover:bg-[var(--accent-gold-hover)] active:scale-95 transition-all duration-250 font-sans font-bold text-xs uppercase tracking-wider shadow-md cursor-pointer border-0"
                  >
                    <Lock className="w-4 h-4" />
                    <span>My Plan</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setView("pricing");
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-gradient-to-r from-amber-500 to-[var(--accent-gold)] text-[var(--gold-btn-text)] hover:opacity-95 active:scale-95 transition-all duration-250 font-sans font-black text-xs uppercase tracking-wider shadow-md cursor-pointer border-0"
                  >
                    <Award className="w-4 h-4 animate-pulse" />
                    <span>👑 Upgrade to Premium</span>
                  </button>
                )}
                
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    logout();
                    setView("home");
                  }}
                  className={`w-full flex items-center justify-center gap-2 py-2 px-5 rounded-full border transition-all duration-200 font-sans font-bold text-xs uppercase tracking-wider cursor-pointer mt-2 ${
                    theme === "dark"
                      ? "border-slate-800 text-slate-400 hover:bg-slate-900"
                      : "border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Premium Theme-Aware Close Button */}
        {isMenuOpen && (
          <button
            onClick={() => setIsMenuOpen(false)}
            className="fixed top-6 right-6 z-50 p-2.5 bg-[var(--accent-gold)] text-[var(--gold-btn-text)] rounded-full hover:bg-[var(--accent-gold-hover)] transition-all duration-200 shadow-lg pointer-events-auto cursor-pointer border-0"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

    </>
  );
}
