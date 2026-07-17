import React, { useState } from "react";
import { auth } from "./lib/firebase";
import { AppProvider, useApp } from "./context/AppContext";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "./components/Navbar";
import HomeView from "./components/HomeView";
import WorkoutLibrary from "./components/WorkoutLibrary";
import WorkoutGeneratorView from "./components/WorkoutGeneratorView";
import CoachView from "./components/CoachView";
import AdminDashboard from "./components/AdminDashboard";
import OnboardingWizard from "./components/OnboardingWizard";
import AuthModal from "./components/AuthModal";
import NutritionView from "./components/NutritionView";
import CommunityView from "./components/CommunityView";
import SuccessView from "./components/SuccessView";
import SavedExercisesView from "./components/SavedExercisesView";
import WorkoutVideos from "./components/WorkoutVideos";
import DailyPlanView from "./components/DailyPlanView";
import DashboardView from "./components/DashboardView";
import { TestimonialPopup } from "./components/TestimonialPopup";
import DailyNotificationController from "./components/DailyNotificationController";
import PaymentSuccessView from "./components/PaymentSuccessView";
import FitnessChallenges from "./components/FitnessChallenges";
import BellyFatShredView from "./components/BellyFatShredView";



const PATH_TO_VIEW_MAP: Record<string, string> = {
  "/": "home",
  "/payment/success": "payment-success",
  "/premium/library": "library",
  "/premium/workout-generator": "workout-generator",
  "/premium/workout-videos": "workout-videos",
  "/premium/saved-exercises": "saved-exercises",
  "/premium/coach": "coach",
  "/premium/nutrition": "nutrition",
  "/premium/daily-plan": "daily-plan",
  "/premium/challenges": "challenges",
  "/premium/community": "community",
  "/premium/weekly-reports": "weekly-reports",
  "/premium/daily-habit-tracker": "daily-habit-tracker",
  "/premium/daily-calibration-desk": "daily-calibration-desk",
  "/premium/handbook": "handbook",
  "/premium/weight-trajectory": "weight-trajectory",
  "/premium/dashboard": "dashboard",
  "/premium/belly-fat-shred": "belly-fat-shred",
};

const VIEW_TO_PATH_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(PATH_TO_VIEW_MAP).map(([path, view]) => [view, path])
);


function FitnessAppContent() {
  const { user, loading } = useApp();

  // Instantly apply theme from localStorage on initial render of App to guarantee no flashes
  React.useLayoutEffect(() => {
    try {
      const savedTheme = localStorage.getItem("fit_theme");
      const root = window.document.documentElement;
      if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    } catch (e) {}
  }, []);

  const [currentView, setView] = useState(() => {
    const pathname = window.location.pathname;
    if (PATH_TO_VIEW_MAP[pathname]) {
      return PATH_TO_VIEW_MAP[pathname];
    }
    try {
      const activeUid = localStorage.getItem("fit_active_uid");
      if (activeUid) {
        const cachedUser = localStorage.getItem(`fit_user_${activeUid}`);
        if (cachedUser) {
          const parsed = JSON.parse(cachedUser);
          if (parsed && parsed.onboarded !== false) {
            return "daily-plan";
          }
        }
      }
    } catch (e) {}
    return "home";
  });
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Refactored Auth Sync: Track previous uid to only trigger redirect ONCE on login/logout
  const prevUserUid = React.useRef<string | undefined>(undefined);

  React.useEffect(() => {
    const currentUid = user?.uid;
    const previousUid = prevUserUid.current;
    prevUserUid.current = currentUid;

    // Transition: Logged out -> Logged in
    if (currentUid && !previousUid) {
      if (user && user.onboarded !== false) {
        if (user.subscriptionStatus === "premium" || user.role === "admin") {
          console.log("[DevOps Auth Sync] Successfully signed in premium. Redirecting to Dashboard view.");
          setView("dashboard");
        } else {
          console.log("[DevOps Auth Sync] Successfully signed in free user. Redirecting to Home view.");
          setView("home");
        }
      }
    } else if (!currentUid && previousUid) {
      // Transition: Logged in -> Logged out
      console.log("[DevOps Auth Sync] Signed out. Redirecting to Home view.");
      setView("home");
    }
  }, [user]);

  // General Guard to catch any unauthorized entries to completely off-limit standalone premium features
  React.useEffect(() => {
    if (!loading) {
      // Strict premium check for '/premium/belly-fat-shred' view
      if (currentView === "belly-fat-shred") {
        const isPremium = user && (user.subscriptionStatus === "premium" || user.role === "admin");
        if (!isPremium) {
          console.log("[DevOps Security] Unauthorized user attempted to access '/premium/belly-fat-shred'. Redirecting to pricing section.");
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

      const loginRequiredViews = ["coach", "nutrition", "community", "challenges", "success-stories", "workout-generator", "daily-plan", "dashboard", "weekly-reports", "daily-habit-tracker", "daily-calibration-desk", "handbook", "weight-trajectory", "library", "workout-videos", "saved-exercises", "belly-fat-shred"];
      const standalonePremiumViews = ["library", "workout-generator", "workout-videos", "saved-exercises", "coach", "nutrition", "daily-plan", "challenges", "community", "weekly-reports", "daily-habit-tracker", "daily-calibration-desk", "handbook", "weight-trajectory", "dashboard", "belly-fat-shred"];

      if (loginRequiredViews.includes(currentView) && !user) {
        console.log(`[DevOps Security] Unauthenticated user attempted to access protected view: ${currentView}. Redirecting to Home and opening auth.`);
        setView("home");
        setIsAuthOpen(true);
      } else if (user && user.subscriptionStatus !== "premium" && user.role !== "admin") {
        if (standalonePremiumViews.includes(currentView)) {
          console.log(`[DevOps Security] Free user attempted to access standalone premium view: ${currentView}. Redirecting to Home pricing.`);
          setView("home");
          setTimeout(() => {
            const el = document.getElementById("pricing");
            if (el) {
              el.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }, 150);
        }
      }
    }
  }, [user, currentView, loading]);

  // Keep window.location.pathname in sync with currentView
  React.useEffect(() => {
    const targetPath = VIEW_TO_PATH_MAP[currentView] || "/";
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, "", targetPath);
    }
  }, [currentView]);

  // Listen to popstate event for browser back/forward buttons
  React.useEffect(() => {
    const handlePopState = () => {
      const targetView = PATH_TO_VIEW_MAP[window.location.pathname] || "home";
      setView(targetView);
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Activate Tawk.to Live Chat dynamically on load
  React.useEffect(() => {
    if (document.getElementById("tawkto-script")) return;

    const tawkId = (import.meta as any).env?.VITE_TAWKTO_PROPERTY_ID || "6a48cf13539b7e1d4b7d3d34/1jsm6hqa8"; // Live Tawk.to Property

    const s1 = document.createElement("script");
    const s0 = document.getElementsByTagName("script")[0];
    s1.id = "tawkto-script";
    s1.async = true;
    s1.src = `https://embed.tawk.to/${tawkId}`;
    s1.charset = "UTF-8";
    s1.setAttribute("crossorigin", "*");
    
    if (s0 && s0.parentNode) {
      s0.parentNode.insertBefore(s1, s0);
    } else {
      document.head.appendChild(s1);
    }
  }, []);

  // Reset scroll to top smoothly on every view/route change
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentView]);

  // Global automatic scroll-to-top on clickable element interactions (buttons, links, tabs, menu items, cards, forms, modals)
  React.useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check if target is inside or is a button, anchor, input, custom button/tab/card/menu
      const clickable = target.closest(
        "button, a, [role='button'], input[type='submit'], [type='button'], .cursor-pointer, [data-scroll-to-top]"
      );
      
      if (clickable) {
        // Prevent interfering with specific non-scrolling widgets or components
        if (clickable.classList.contains("no-scroll-top") || clickable.id?.includes("tawk") || clickable.closest("#tawk")) {
          return;
        }
        
        // Scroll smoothly to top of viewport
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    document.addEventListener("click", handleGlobalClick, { capture: true, passive: true });
    return () => {
      document.removeEventListener("click", handleGlobalClick, { capture: true });
    };
  }, []);

  // Protected navigation handler
  const handleSetView = (targetView: string) => {
    if (targetView === "pricing") {
      setView("home");
      setTimeout(() => {
        const el = document.getElementById("pricing");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 150);
      return;
    }

    if ((["coach", "nutrition", "community", "challenges", "success-stories", "workout-generator", "daily-plan", "dashboard", "weekly-reports", "daily-habit-tracker", "daily-calibration-desk", "handbook", "weight-trajectory", "library", "workout-videos", "saved-exercises", "belly-fat-shred"].includes(targetView)) && !user) {
      setIsAuthOpen(true);
      return;
    }

    // If the user is on the free plan, block completely off-limits premium views
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
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-[#090d16] text-slate-900 dark:text-[#F8FAFC] font-sans">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#D32F2F] border-t-transparent" />
      </div>
    );
  }

  // Force onboarding configuration on first sign up
  if (user && user.onboarded === false) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#090d16] text-slate-900 dark:text-[#F8FAFC] transition-colors duration-200">
        <Navbar 
          currentView={currentView} 
          setView={handleSetView} 
          onOpenAuth={() => setIsAuthOpen(true)} 
        />
        <OnboardingWizard />
        <AuthModal 
          isOpen={isAuthOpen} 
          onClose={() => setIsAuthOpen(false)} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#090d16] text-slate-900 dark:text-[#F8FAFC] transition-colors duration-200">
      
      {/* Dynamic Header Navbar navigation */}
      <Navbar 
        currentView={currentView} 
        setView={handleSetView} 
        onOpenAuth={() => setIsAuthOpen(true)} 
      />

      {/* Main Switchboard Route Mounting */}
      <main className="pt-[76px] pb-16 min-h-screen flex flex-col justify-start">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex-grow flex flex-col"
          >
            {currentView === "home" && (
              <HomeView setView={handleSetView} onOpenAuth={() => setIsAuthOpen(true)} />
            )}
            {currentView === "payment-success" && (
              <PaymentSuccessView />
            )}
            {currentView === "library" && (
              <WorkoutLibrary setView={handleSetView} />
            )}
            {currentView === "workout-generator" && user && (
              <WorkoutGeneratorView />
            )}
            {currentView === "nutrition" && user && (
              <NutritionView />
            )}
            {currentView === "daily-plan" && user && (
              <DailyPlanView />
            )}
            {["dashboard", "weekly-reports", "daily-habit-tracker", "daily-calibration-desk", "handbook", "weight-trajectory"].includes(currentView) && user && (
              <DashboardView activeView={currentView} setView={handleSetView} />
            )}
            {currentView === "coach" && user && (
              <CoachView />
            )}
            {currentView === "community" && user && (
              <CommunityView />
            )}
            {currentView === "challenges" && user && (
              <FitnessChallenges />
            )}
            {currentView === "success-stories" && user && (
              <SuccessView />
            )}
            {currentView === "saved-exercises" && (
              <SavedExercisesView setView={handleSetView} />
            )}
            {currentView === "workout-videos" && (
              <WorkoutVideos />
            )}
            {currentView === "belly-fat-shred" && user && (
              <BellyFatShredView />
            )}

            {currentView === "admin" && user && user.role === "admin" && (
              <AdminDashboard />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Auth State Modal */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
      />

      {/* Customer Reviews & Testimonial Popup */}
      <TestimonialPopup />

      {/* Daily Reminders & System Compliance Alerts Desk */}
      <DailyNotificationController />

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <FitnessAppContent />
    </AppProvider>
  );
}
