import React, { useState } from "react";
import { auth } from "./lib/firebase";
import { AppProvider, useApp } from "./context/AppContext";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "./components/Navbar";
import HomeView from "./components/HomeView";

// Dynamically split routes into individual lazy-loaded chunks
const WorkoutLibrary = React.lazy(() => import("./components/WorkoutLibrary"));
const WorkoutGeneratorView = React.lazy(() => import("./components/WorkoutGeneratorView"));
const CoachView = React.lazy(() => import("./components/CoachView"));
const AdminDashboard = React.lazy(() => import("./components/AdminDashboard"));
const OnboardingWizard = React.lazy(() => import("./components/OnboardingWizard"));
const AuthModal = React.lazy(() => import("./components/AuthModal"));
const NutritionView = React.lazy(() => import("./components/NutritionView"));
const CommunityView = React.lazy(() => import("./components/CommunityView"));
const SuccessView = React.lazy(() => import("./components/SuccessView"));
const SavedExercisesView = React.lazy(() => import("./components/SavedExercisesView"));
const WorkoutVideos = React.lazy(() => import("./components/WorkoutVideos"));
const DailyPlanView = React.lazy(() => import("./components/DailyPlanView"));
const DashboardView = React.lazy(() => import("./components/DashboardView"));
import { TestimonialPopup } from "./components/TestimonialPopup";
import DailyNotificationController from "./components/DailyNotificationController";
const PaymentSuccessView = React.lazy(() => import("./components/PaymentSuccessView"));
const FitnessChallenges = React.lazy(() => import("./components/FitnessChallenges"));
const BellyFatShredView = React.lazy(() => import("./components/BellyFatShredView"));
const LifestyleFitnessAcademy = React.lazy(() => import("./components/LifestyleFitnessAcademy"));
import GlobalSkeletonLoader, { DashboardSkeleton, CardGridSkeleton, ListSkeleton } from "./components/SkeletonLoader";



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
  "/lifestyle-academy": "lifestyle-academy",
};

const VIEW_TO_PATH_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(PATH_TO_VIEW_MAP).map(([path, view]) => [view, path])
);


function FitnessAppContent() {
  const { user, loading, isBlockedUser, authDatabaseError, setAuthDatabaseError } = useApp();

  const renderSkeletonForView = (view: string) => {
    if (["dashboard", "weekly-reports", "daily-habit-tracker", "daily-calibration-desk", "handbook", "weight-trajectory"].includes(view)) {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-4">
          <DashboardSkeleton />
        </div>
      );
    }
    if (["library", "saved-exercises", "workout-videos"].includes(view)) {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-6 mt-4">
          <div className="space-y-2 pb-4">
            <div className="h-6 w-48 rounded bg-slate-200 dark:bg-slate-800/65 animate-pulse" />
            <div className="h-4 w-96 rounded bg-slate-200 dark:bg-slate-800/65 animate-pulse" />
          </div>
          <CardGridSkeleton count={3} />
        </div>
      );
    }
    if (["community", "challenges"].includes(view)) {
      return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-6 mt-4">
          <div className="space-y-2 pb-4">
            <div className="h-6 w-48 rounded bg-slate-200 dark:bg-slate-800/65 animate-pulse" />
            <div className="h-4 w-96 rounded bg-slate-200 dark:bg-slate-800/65 animate-pulse" />
          </div>
          <ListSkeleton count={4} />
        </div>
      );
    }
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-4">
        <DashboardSkeleton />
      </div>
    );
  };

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

  // Intercept and prevent Tawk.to third-party script errors from crashing/triggering overlays
  React.useEffect(() => {
    const handleWindowError = (event: ErrorEvent) => {
      const msg = event.message || "";
      const url = event.filename || "";
      if (
        url.includes("tawk.to") ||
        msg.includes("Tawk") ||
        msg.includes("tawk") ||
        msg.includes("$_Tawk")
      ) {
        event.preventDefault();
        event.stopPropagation();
        return true;
      }
    };

    window.addEventListener("error", handleWindowError, true);
    return () => {
      window.removeEventListener("error", handleWindowError, true);
    };
  }, []);

  // Activate Tawk.to Live Chat dynamically on load
  React.useEffect(() => {
    if (document.getElementById("tawkto-script")) return;

    // Check if we are running inside an iframe (like the AI Studio development preview)
    const isInIframe = (() => {
      try {
        return window.self !== window.top;
      } catch (e) {
        return true;
      }
    })();

    if (isInIframe) {
      return;
    }

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

  // Scroll Restoration & Position Preservation for every view/route
  const scrollPositions = React.useRef<Record<string, number>>({});
  const prevViewRef = React.useRef<string>(currentView);

  React.useLayoutEffect(() => {
    // 1. Save scroll position of the previous view before it gets replaced
    const prevView = prevViewRef.current;
    if (prevView && prevView !== currentView) {
      scrollPositions.current[prevView] = window.scrollY || document.documentElement.scrollTop;
    }
    prevViewRef.current = currentView;

    // 2. Restore scroll position of the new view
    const savedPos = scrollPositions.current[currentView] || 0;
    
    // Smooth/instant scroll restoration with a micro-timeout to allow layout stability
    const timer = setTimeout(() => {
      window.scrollTo({ top: savedPos, behavior: "instant" as ScrollBehavior });
    }, 30);

    return () => clearTimeout(timer);
  }, [currentView]);

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

    const premiumViews = ["coach", "nutrition", "community", "challenges", "success-stories", "workout-generator", "daily-plan", "dashboard", "weekly-reports", "daily-habit-tracker", "daily-calibration-desk", "handbook", "weight-trajectory", "library", "workout-videos", "saved-exercises", "belly-fat-shred"];

    // Whenever any Free user (logged in or guest) attempts to access any premium feature:
    if (premiumViews.includes(targetView)) {
      const isPremium = user && (user.subscriptionStatus === "premium" || user.role === "admin");
      if (!isPremium) {
        // Save the attempted view so we can restore it after Paystack payment succeeds
        localStorage.setItem("fit_attempted_view", targetView);
        
        // Redirect to pricing page immediately
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
    return <GlobalSkeletonLoader />;
  }

  if (isBlockedUser) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#090d16] text-white p-6 font-sans select-none">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center space-y-6"
        >
          <div className="mx-auto w-16 h-16 rounded-full bg-red-950/50 border border-red-500/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold font-display tracking-tight text-red-500 uppercase">Account Suspended</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your AlexFitnessHub Athlete profile has been suspended by an administrator. Access to workouts, AI calibration, and community channels is currently restricted.
            </p>
          </div>

          <div className="h-[1px] bg-slate-800 w-full" />

          <div className="space-y-4 text-left">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Coach Alex Support Desk</h3>
            
            <div className="space-y-3">
              <a 
                href="mailto:alexfitnesshub@gmail.com" 
                className="flex items-center gap-3 p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-red-500/30 hover:bg-slate-900 transition-all duration-200"
              >
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Email Address</div>
                  <div className="text-xs font-mono text-slate-200">alexfitnesshub@gmail.com</div>
                </div>
              </a>

              <a 
                href="https://wa.me/2347073307875" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-red-500/30 hover:bg-slate-900 transition-all duration-200"
              >
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.705 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500">WhatsApp Desktop / Mobile</div>
                  <div className="text-xs font-mono text-slate-200">+2347073307875</div>
                </div>
              </a>

              <div 
                className="flex items-center gap-3 p-3 rounded-lg bg-slate-950 border border-slate-800"
              >
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Phone Hotline</div>
                  <div className="text-xs font-mono text-slate-200">+2347073307875</div>
                </div>
              </div>

            </div>
          </div>

          <div className="pt-2">
            <button 
              onClick={() => {
                try {
                  localStorage.removeItem("fit_saved_email");
                  localStorage.removeItem("fit_saved_password");
                  localStorage.removeItem("fit_active_uid");
                } catch(e){}
                window.location.reload();
              }}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all duration-200"
            >
              Sign Out & Reload
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (authDatabaseError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#090d16] text-[#F8FAFC] p-6 font-sans">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center space-y-6"
        >
          <div className="mx-auto w-16 h-16 rounded-full bg-amber-950/50 border border-amber-500/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold font-display tracking-tight text-amber-500 uppercase">Database Error</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              {authDatabaseError}
            </p>
          </div>

          <div className="pt-2 flex gap-4">
            <button 
              onClick={() => {
                setAuthDatabaseError(null);
              }}
              className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all duration-200"
            >
              Continue Offline
            </button>
            <button 
              onClick={() => {
                window.location.reload();
              }}
              className="flex-1 py-3 bg-[#D32F2F] hover:bg-[#B71C1C] text-white rounded-xl font-bold transition-all duration-200"
            >
              Retry Connection
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Force onboarding configuration on first sign up
  if (user && user.onboarded === false) {
    return (
      <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
        <Navbar 
          currentView={currentView} 
          setView={handleSetView} 
          onOpenAuth={() => setIsAuthOpen(true)} 
        />
        <React.Suspense fallback={
          <div className="max-w-4xl mx-auto p-8 w-full">
            <DashboardSkeleton />
          </div>
        }>
          <OnboardingWizard />
        </React.Suspense>
        <React.Suspense fallback={null}>
          <AuthModal 
            isOpen={isAuthOpen} 
            onClose={() => setIsAuthOpen(false)} 
          />
        </React.Suspense>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      
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
            <React.Suspense fallback={renderSkeletonForView(currentView)}>
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
              {currentView === "lifestyle-academy" && (
                <LifestyleFitnessAcademy />
              )}

              {currentView === "admin" && user && user.role === "admin" && (
                <AdminDashboard />
              )}
            </React.Suspense>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Auth State Modal */}
      <React.Suspense fallback={null}>
        <AuthModal 
          isOpen={isAuthOpen} 
          onClose={() => setIsAuthOpen(false)} 
        />
      </React.Suspense>

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
