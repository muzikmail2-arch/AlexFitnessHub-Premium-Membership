import React, { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Star, X, Check } from "lucide-react";
import { useApp } from "../context/AppContext";
import { PopupTestimonial } from "../types";
import { samplePopupTestimonials } from "../data/sampleTestimonials";

const getInitials = (name: string) => {
  return name.trim().substring(0, 2).toUpperCase();
};

const getRandomBgColor = (name: string) => {
  const colors = [
    "bg-emerald-600 text-white",
    "bg-sky-600 text-white",
    "bg-indigo-600 text-white",
    "bg-purple-600 text-white",
    "bg-amber-600 text-white",
    "bg-rose-600 text-white",
    "bg-teal-600 text-white",
  ];
  let sum = 0;
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i);
  }
  return colors[sum % colors.length];
};

const getGenderForName = (name: string, content?: string): "female" | "male" | "neutral" => {
  const norm = name.trim().toLowerCase();
  
  const femaleNames = ["amara", "chioma", "fatima", "yetunde", "amina", "funmi", "blessing", "ngozi", "aisha", "sarah", "emma", "olivia", "sophia", "mia", "grace", "lily", "chloe", "ava", "isabella", "amelia", "charlotte", "ella", "harper", "evelyn", "clara"];
  const maleNames = ["tobi", "david", "babajide", "emeka", "chinedu", "osas", "kelechi", "tari", "ibrahim", "yusuf", "victor", "john", "michael", "james", "daniel", "noah", "ethan", "ryan", "lucas", "benjamin", "henry", "jack", "william", "mason", "sam", "samuel", "alex"];

  for (const fn of femaleNames) {
    if (norm.startsWith(fn)) return "female";
  }
  for (const mn of maleNames) {
    if (norm.startsWith(mn)) return "male";
  }

  const text = (content || "").toLowerCase();
  if (/\b(she|her|hers)\b/.test(text)) return "female";
  if (/\b(he|his|him)\b/.test(text)) return "male";

  return "neutral";
};

export const TestimonialPopup: React.FC = () => {
  const { popupTestimonials } = useApp();
  const [currentReview, setCurrentReview] = useState<PopupTestimonial | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [status, setStatus] = useState<"idle" | "showing" | "waiting">("idle");
  
  const queueRef = useRef<PopupTestimonial[]>([]);
  const indexRef = useRef<number>(0);
  const lastShownIdRef = useRef<string | null>(null);

  // Filter to active reviews, fall back to sample dataset if database state is still fetching
  const activeReviews = popupTestimonials && popupTestimonials.length > 0
    ? popupTestimonials.filter(r => r.status === "enabled")
    : samplePopupTestimonials.filter(r => r.status === "enabled");

  const showNextPopup = () => {
    if (activeReviews.length === 0) return;

    // Rebuild and sort queue by gender (female, then male, then neutral)
    if (queueRef.current.length === 0 || indexRef.current >= queueRef.current.length) {
      const sorted = [...activeReviews].sort((a, b) => {
        const genA = getGenderForName(a.name, a.review || a.action);
        const genB = getGenderForName(b.name, b.review || b.action);
        if (genA !== genB) {
          return genA.localeCompare(genB);
        }
        return a.name.localeCompare(b.name);
      });
      
      queueRef.current = sorted;
      indexRef.current = 0;
    }

    const nextReview = queueRef.current[indexRef.current];
    indexRef.current += 1;
    lastShownIdRef.current = nextReview.id;

    setCurrentReview(nextReview);
    setIsVisible(true);
  };

  // State-Machine Timing Controller
  useEffect(() => {
    if (activeReviews.length === 0) return;

    let timer: NodeJS.Timeout | null = null;

    if (status === "idle") {
      // First popup delay: 3 seconds after mounting
      timer = setTimeout(() => {
        showNextPopup();
        setStatus("showing");
      }, 3000);
    } else if (status === "showing") {
      // Remain visible for exactly 8 seconds, then hide and transition to waiting
      timer = setTimeout(() => {
        setIsVisible(false);
        setStatus("waiting");
      }, 8000);
    } else if (status === "waiting") {
      // Wait exactly 60 seconds (60000 ms) before the next popup as strictly required
      const delayMs = 60000;
      console.log(`[Social Proof] Scheduled next popup in exactly 60 seconds`);
      timer = setTimeout(() => {
        showNextPopup();
        setStatus("showing");
      }, delayMs);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [status, activeReviews.length]);

  const handleClose = () => {
    setIsVisible(false);
    setStatus("waiting");
  };

  if (activeReviews.length === 0 || !currentReview) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          id="social-proof-toast"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          // high z-index fixed to bottom-right corner for maximum consistency and responsiveness across desktop & mobile
          className="fixed bottom-6 right-6 z-[9999] max-w-[340px] w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-slate-200 p-4 select-none pointer-events-auto overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
            id="close-social-proof"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-3.5 pb-2">
            {/* Avatar image or initials */}
            {currentReview.avatar ? (
              <div className="relative shrink-0">
                <img
                  src={currentReview.avatar}
                  alt={currentReview.name}
                  className="w-11 h-11 rounded-full object-cover border border-slate-200 shadow-sm"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
              </div>
            ) : (
              <div className="relative shrink-0">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center font-black text-xs shadow-sm uppercase ${getRandomBgColor(currentReview.name)}`}>
                  {getInitials(currentReview.name)}
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
              </div>
            )}

            <div className="flex-1 min-w-0 pr-5">
              {/* Star Rating & Verified Badge */}
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-0.5 text-amber-500">
                  {[...Array(currentReview.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current text-amber-500" />
                  ))}
                </div>
                <span className="inline-flex items-center gap-1 text-[9px] font-black font-mono tracking-wider text-emerald-700 uppercase bg-emerald-50 px-1.5 py-0.5 rounded">
                  <Check className="w-2.5 h-2.5 stroke-[3]" /> Verified
                </span>
              </div>

              {/* Action content & time */}
              <p className="text-xs text-slate-900 leading-snug">
                <span className="font-extrabold text-slate-950 mr-1">
                  {currentReview.name}
                </span>
                {currentReview.action || "signed up"}
              </p>
              
              <span className="text-slate-500 text-[10px] font-bold font-mono block mt-0.5">
                {currentReview.timeText || "today"}
              </span>

              {/* Optional Trust message */}
              {currentReview.review && (
                <p className="text-[11px] text-slate-800 font-medium italic mt-2 border-l-2 border-slate-200 pl-2 leading-relaxed">
                  “{currentReview.review}”
                </p>
              )}
            </div>
          </div>

          {/* Progress bar timeline loader - matches 8s visibility period */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100 rounded-b-2xl overflow-hidden">
            <motion.div 
              key={currentReview.id}
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 8, ease: "linear" }}
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
