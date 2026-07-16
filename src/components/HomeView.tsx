import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { 
  Shield, CheckCircle, ArrowRight, Zap, Flame, 
  Play, Users, X, HelpCircle, Clipboard, ChevronDown, Star, Lock, MessageCircle, ChevronLeft,
  Mail, Bell, Heart, Sparkles, Activity
} from "lucide-react";
import { motion } from "motion/react";

const workoutCategories = [
  {
    id: "chest",
    title: "Chest Isolation",
    desc: "Sculpt upper chest divisions using premium cable flyes & barbell press alignments.",
    exercises: "45 Drills",
    image: "https://workoutguru.fit/wp-content/uploads/2024/02/african-bodybuilder-posing-gym-1-edited.jpg",
    tag: "Upper Body",
  },
  {
    id: "back",
    title: "Lat & Back Columns",
    desc: "Build high flare lats and thick upper rhomboids with rows & pullup layouts.",
    exercises: "38 Drills",
    image: "https://generationiron.com/wp-content/uploads/2022/02/How-To-Do-Wide-grip-Lat-Pulldown-1200x675-1-1024x576.jpg",
    tag: "V-Taper",
  },
  {
    id: "biceps",
    title: "Bicep Peak Triggers",
    desc: "Engage peak brachialis fibers under supreme tension with seated dumbbell curls.",
    exercises: "24 Drills",
    image: "https://learn.athleanx.com/wp-content/uploads/2024/06/HOW-TO-BICEPS.jpg",
    tag: "Hypertrophy",
  },
  {
    id: "triceps",
    title: "Tricep Horseshoe",
    desc: "Isolate lateral push heads utilizing heavy overhead rope extensions.",
    exercises: "28 Drills",
    image: "https://learn.athleanx.com/wp-content/uploads/2021/09/MAIN-IMAGE.png",
    tag: "Push Power",
  },
  {
    id: "shoulders",
    title: "Deltoid Cap Boulder",
    desc: "Target anterior and posterior caps with scapular plane stability guides.",
    exercises: "35 Drills",
    image: "https://i.ytimg.com/vi/yS80o90nm_k/maxresdefault.jpg",
    tag: "Symmetry",
  },
  {
    id: "legs",
    title: "Quad & Leg Pillars",
    desc: "Stimulate depth hypertrophy using back squats and clean hamstring curls.",
    exercises: "50 Drills",
    image: "https://guycounseling.com/wp-content/uploads/2014/10/leg-workout.jpg",
    tag: "Lower Body",
  },
  {
    id: "abs",
    title: "Abdominal Shred",
    desc: "Slam abdominal walls utilizing leg raises and controlled core compression.",
    exercises: "22 Drills",
    image: "https://learn.athleanx.com/wp-content/uploads/2021/08/MAIN-MAGE.png",
    tag: "Core Core",
  }
];

const verifiedUserReviews = [
  {
    name: "Amara K.",
    location: "Lagos Resident",
    period: "12 Weeks",
    achievement: "Lost 18.6 KG • 34% to 21% Body Fat",
    content: "The 12-30-3 cardio walk saved my knees! Combined with the local diet calibrator to substitute yams for lean fish and egg whites, I lost substantial belly fat without going hungry. The AI coach guided my macros every single Sunday.",
    rating: 5,
    goal: "Weight Loss"
  },
  {
    name: "Tobi S.",
    location: "Abuja Athlete",
    period: "16 Weeks",
    achievement: "Lost 19.8 KG • 29% to 13% Body Fat",
    content: "My absolute objective was to expose my abdominal muscles and rebuild a deep chest alignment. Tracking slow eccentric sets and training compound lifts with the custom barbell routines helped me gain muscle while shredding 20 kg.",
    rating: 5,
    goal: "Muscle Building"
  },
  {
    name: "David O.",
    location: "Port Harcourt",
    period: "8 Weeks",
    achievement: "Lost 9.5 KG • 26% to 17% Body Fat",
    content: "Needed to drop weight rapidly to secure a military physical fitness score. The targeted ab isolation guides and zero-fluff nutrition matrix got me there in only two months. Absolute clinical standard programs.",
    rating: 5,
    goal: "Weight Loss"
  },
  {
    name: "Chioma A.",
    location: "Enugu Executive",
    period: "10 Weeks",
    achievement: "Lost 12.1 KG • 30% to 18% Body Fat",
    content: "Balancing long corporate hours meant I needed extreme efficiency. Executing the 12% treadmill incline walks while tracking my routines kept me disciplined daily. Unbeatable layout and superb mobile-friendly flow.",
    rating: 5,
    goal: "General Journey"
  },
  {
    name: "Babajide Y.",
    location: "Ibadan Trainee",
    period: "6 Weeks",
    achievement: "Gained 4 KG Muscle • Re-composed Frame",
    content: "The local meal plans are the best part. Substituting high-carb processed foods with localized portions of beans, chicken breast, and green vegetables gave me constant energy for my compound lifts.",
    rating: 5,
    goal: "Muscle Building"
  },
  {
    name: "Fatima B.",
    location: "Kano",
    period: "14 Weeks",
    achievement: "Lost 15.2 KG • Improved Cardio",
    content: "Highly safe and private home routines. I followed the bodyweight core plans in my living room. The step-by-step videos make correct forms incredibly easy to learn without standard gym stress.",
    rating: 5,
    goal: "Weight Loss"
  },
  {
    name: "Emeka N.",
    location: "Onitsha Strongman",
    period: "20 Weeks",
    achievement: "Bench Press +35 KG • Squat +50 KG",
    content: "Barbell coaching is pristine. Learning the correct biomechanics for progressive overload completely resolved my shoulder discomfort. The absolute gold standard of online strength tracking.",
    rating: 5,
    goal: "Muscle Building"
  },
  {
    name: "Yetunde O.",
    location: "Lekki Practitioner",
    period: "12 Weeks",
    achievement: "Lost 14.0 KG • Shredded Obliques",
    content: "The interface is exceptionally polished! Tracking my water intake and following the low-carb guidelines was seamless. Lowered my resting heart rate significantly.",
    rating: 5,
    goal: "General Journey"
  },
  {
    name: "Chinedu E.",
    location: "Asaba Elite",
    period: "8 Weeks",
    achievement: "Lost 8.2 KG • Enhanced Stamina",
    content: "No unnecessary features or annoying popups. The plan builder lets me log custom repetitions and weight curves. My strength endurance has quadrupled over the past two months.",
    rating: 5,
    goal: "General Journey"
  },
  {
    name: "Amina U.",
    location: "Kaduna Scholar",
    period: "10 Weeks",
    achievement: "Lost 11.0 KG • Postpartum Recovery",
    content: "Perfect low-impact routines that didn't stress my joints. The customized advice and simple steps tracker helped me get back to my active weight safely and consistently.",
    rating: 5,
    goal: "Weight Loss"
  },
  {
    name: "Osas I.",
    location: "Benin Builder",
    period: "12 Weeks",
    achievement: "Gained 5.5 KG Muscle • Reduced Fat",
    content: "Simple instructions and highly realistic local diet advice without any expensive imported supplements. I highly recommend the high tension bicep isolation splits.",
    rating: 5,
    goal: "Muscle Building"
  },
  {
    name: "Kelechi O.",
    location: "Owerri",
    period: "12 Weeks",
    achievement: "Lost 13.5 KG • Waist -5 Inches",
    content: "I love the clean, modern look of the app. Checking off daily water and step targets has become an automatic habit. Highly responsive UI and zero friction.",
    rating: 5,
    goal: "Weight Loss"
  },
  {
    name: "Funmi A.",
    location: "Akure Executive",
    period: "16 Weeks",
    achievement: "Blood Pressure Normalized • Lost 16 KG",
    content: "Helped me prioritize long term cardio health. The pacing guidelines for inclined walks and daily physical routine checks completely transformed my physical state.",
    rating: 5,
    goal: "General Journey"
  },
  {
    name: "Tari Q.",
    location: "Yenagoa Dancer",
    period: "6 Weeks",
    achievement: "Improved Mobility • Core Flex Strength",
    content: "The lateral delt and glute programs are extremely optimized. Every exercise has clear instruction targets that ensure absolute safety during eccentric movements.",
    rating: 5,
    goal: "General Journey"
  },
  {
    name: "Ibrahim M.",
    location: "Jos Runner",
    period: "12 Weeks",
    achievement: "5K Run time -6 Mins • Lost 10 KG",
    content: "Finally broke my fat loss plateau with progressive overload sets. The custom barbell routines are incredibly effective and perfectly timed for busy schedules.",
    rating: 5,
    goal: "Weight Loss"
  },
  {
    name: "Blessing E.",
    location: "Calabar Gymnast",
    period: "14 Weeks",
    achievement: "Gained Lean Definition • Flex Level Up",
    content: "The absolute focus on hamstring and knee health is amazing. My balance has improved, and I feel vastly stronger in daily functional movements.",
    rating: 5,
    goal: "Muscle Building"
  },
  {
    name: "Yusuf T.",
    location: "Ilorin Athlete",
    period: "10 Weeks",
    achievement: "Lost 12.5 KG • Sculpted Deltoids",
    content: "I save thousands of Naira using these home barbell splits instead of paying for expensive gym coaches. The app serves as a perfect pocket personal trainer.",
    rating: 5,
    goal: "General Journey"
  },
  {
    name: "Ngozi P.",
    location: "Aba Retailer",
    period: "8 Weeks",
    achievement: "Lost 7.8 KG • Cardio Restored",
    content: "Excellent mobile view. I can easily log my daily steps and calorie count while on the move. Super clean layout and very encouraging flow.",
    rating: 5,
    goal: "Weight Loss"
  },
  {
    name: "Victor C.",
    location: "Warri Engineer",
    period: "12 Weeks",
    achievement: "Squat Depth Peak • Gained 6 KG Muscle",
    content: "Zero fluff. The local dietary guidelines actually fit the local foods I eat every day. Bench, squat, and curl isolation guides are top tier.",
    rating: 5,
    goal: "Muscle Building"
  },
  {
    name: "Aisha K.",
    location: "Sokoto Teacher",
    period: "18 Weeks",
    achievement: "Lost 17.5 KG • Body Fat -12%",
    content: "Excellent high-contrast design that is easy on the eyes. Following the structured body weight cardiorespiratory program has made me incredibly consistent.",
    rating: 5,
    goal: "Weight Loss"
  }
];

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

interface HomeViewProps {
  setView: (view: string) => void;
  onOpenAuth: () => void;
}

export default function HomeView({ setView, onOpenAuth }: HomeViewProps) {
  const { user, upgradeWithPaystack } = useApp();
  const [submittingPlan, setSubmittingPlan] = useState<"monthly" | "yearly" | "multi" | null>(null);
  const [activePaymentModal, setActivePaymentModal] = useState<"monthly" | "yearly" | "multi" | null>(null);

  // Sort the verified user reviews according to their name gender
  const sortedVerifiedReviews = React.useMemo(() => {
    return [...verifiedUserReviews].sort((a, b) => {
      const genA = getGenderForName(a.name, a.content);
      const genB = getGenderForName(b.name, b.content);
      if (genA !== genB) {
        return genA.localeCompare(genB); // Grouping females first, then males, then neutrals
      }
      return a.name.localeCompare(b.name);
    });
  }, []);

  // Carousel slider state for Hero
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      eyebrow: "PHYSIQUE SPECIALIZATION",
      wordOne: "FORGE",
      wordTwo: "ATHLETICISM",
      desc: "Experience world-class body sculpting. Unified by certified clinical kinesiologists, interactive progress logs, and advanced multi-modal Gemini AI coaching. Track actual metric goals with absolute precision.",
      imageUrl: "https://github.com/muzikmail2-arch/bb/blob/main/ChatGPT%20Image%20Jul%2015,%202026,%2007_10_48%20PM.png?raw=true"
    },
    {
      eyebrow: "NUTRITIONAL METRICS",
      wordOne: "SHRED",
      wordTwo: "PLATEAUS",
      desc: "Calibrate localized macronutrient diet plans tailored precisely for high protein staples, tracking absolute body weight goals daily with the assistance of interactive progress reports.",
      imageUrl: "https://github.com/muzikmail2-arch/bb/blob/main/ChatGPT%20Image%20Jul%2015,%202026,%2006_45_05%20PM.png?raw=true"
    },
    {
      eyebrow: "AI POWERED SOLUTIONS",
      wordOne: "COMMAND",
      wordTwo: "INTELLIGENCE",
      desc: "Unlock server-side Gemini intelligence models to consult your lifting technique, optimize water ratios, and design recovery splits tailored for performance athletes.",
      imageUrl: "https://cdn2.futurepedia.io/2024-11-26T23-08-51.337Z-xlpV7DzdoDOU6dc1LhhW2u9C-qDBp0OSd.webp?w=1920"
    }
  ];

  // Auto-play interval for hero carousel (5 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  useEffect(() => {
    if (activePaymentModal) {
      const originalStyle = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [activePaymentModal]);

  const [payEmail, setPayEmail] = useState(user?.email || "");
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [selectedMonths, setSelectedMonths] = useState(3);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  // States for reviews/testimonials
  const [reviewFilter, setReviewFilter] = useState("All");
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Contact Form state engines
  const [contactName, setContactName] = useState(user?.displayName || "");
  const [contactEmail, setContactEmail] = useState(user?.email || "");
  const [contactGoal, setContactGoal] = useState("hypertrophy");
  const [contactMessage, setContactMessage] = useState("");
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);



  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactEmail || !contactName) {
      alert("Please provide valid name and email targets.");
      return;
    }
    setIsSubmittingContact(true);
    setTimeout(() => {
      setIsSubmittingContact(false);
      setContactSubmitted(true);
      setContactMessage("");
    }, 950);
  };

  useEffect(() => {
    if (user) {
      setPayEmail(user.email || "");
      setContactEmail(user.email || "");
      setContactName(user.displayName || user.email?.split("@")[0] || "");
    }
  }, [user]);

  const handleInitiatePayment = async (plan: "monthly" | "yearly" | "multi") => {
    if (!user) {
      onOpenAuth();
      return;
    }
    
    setCheckoutError(null);
    setPayEmail(user.email || "");
    setActivePaymentModal(plan);
    setSubmittingPlan(plan);

    try {
      // 1. Fetch active Paystack Public Key
      const configRes = await fetch("/api/payments/config");
      const configData = await configRes.json();
      const publicKey = configData.publicKey || import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "";
      
      if (!publicKey) {
        throw new Error("Paystack Public Key is not configured in backend or environment.");
      }

      // 2. Initialize checkout session on our server
      const res = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          email: user.email,
          userId: user.uid,
          months: plan === "multi" ? selectedMonths : undefined
        })
      });
      const data = await res.json();
      if (!data.success || !data.authorization_url) {
        throw new Error(data.error || "Unable to initialize secure transaction with Paystack.");
      }

      // 3. Directly redirect user to Paystack secure payment page
      console.log(`[Redirect Flow] Redirecting user ${user.uid} to secure Paystack payment URL: ${data.authorization_url}`);
      window.location.href = data.authorization_url;

    } catch (err: any) {
      console.error("Error initiating checkout:", err);
      setCheckoutError(err.message || "Failed to initialize secure checkout. Please contact admin.");
      setSubmittingPlan(null);
    }
  };

  const basePriceMonthly = 19999;
  const multiMonthTotal = basePriceMonthly * selectedMonths;
  const yearlyPriceAnnual = 215989;
  const yearlyNormalCost = basePriceMonthly * 12;
  const yearlySavingsAmt = yearlyNormalCost - yearlyPriceAnnual;

  const faqsList = [
    {
      q: "How does the Treadmill Walk 12-30-3 function?",
      a: "Treadmill Walk 12-30-3 is a globally verified protocol: 12% incline gradient, 3.0 mph speed pace, for 30 minutes continuous. This targets local fat oxidation directly, bypassing standard systemic glycogen burn while protecting knee joints from impact damage."
    },
    {
      q: "How secure is my subscription status and account data?",
      a: "All subscription and training history is securely saved within our cloud infrastructure using standard industrial AES-256 equivalent socket layers. We do not hold or process any billing credentials directly on our platforms. Your profile is kept entirely private and can be closed or cleared anytime."
    },
    {
      q: "What is the differences between Free and Premium memberships?",
      a: "Free members have standard access to base movements and basic progress logging. Premium members unlock our full 1,200+ scaled fitness database, complete HD anatomical movement loops with 0.5x Slow and 3s Eccentric coaching models, custom V-Taper curriculums, and unlimited AI coach calibrations."
    },
    {
      q: "Can I cancel or alter my multi-month selections?",
      a: "Absolutely. Standard multi-month selections are valid for the selected calendar span and are not bound by long-term legal liabilities. You can upgrade, downgrade, or return to the free athlete tier without any extra administrative penalties."
    },
    {
      q: "Are meal recommendation profiles customizable for local foods?",
      a: "Yes! Our intelligence systems understand regional food databases (including high-protein staples such as egg whites, plantains, lean beef, beans, local greens, and fish). The macros are calibrated dynamically onto your current biological weight targets."
    }
  ];

  return (
    <div id="home-view-root" className="bg-white text-black min-h-screen relative font-sans animate-fade-in">
      
      {/* 1. HERO SECTION - COMPELLING BRIGHT SOLO VISUAL BANNER */}
      <section id="hero-segment" className="relative h-[55vh] sm:h-[65vh] lg:h-[75vh] w-full overflow-hidden bg-white border-b border-slate-200">
        
        {/* Cinematic Background Image - Ultra-Bright, High-Exposure & Clear */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <img 
            src="https://github.com/muzikmail2-arch/bb/blob/main/ChatGPT%20Image%20Jul%2015,%202026,%2006_45_05%20PM.png?raw=true" 
            alt="Alex Fitness Hub Elite Training Facility"
            className="w-full h-full object-cover object-center scale-100 filter brightness-125 contrast-110 saturate-105"
            referrerPolicy="no-referrer"
          />
          {/* Subtle light vignettes just to frame the layout gently while keeping everything bright and white-based */}
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white/15 to-transparent" />
        </div>

        {/* Dynamic visual badge for the solo hero */}
        <div className="absolute bottom-6 right-6 z-10 bg-white/95 backdrop-blur-md border border-slate-200 rounded-full px-5 py-2 flex items-center gap-2 shadow-lg">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <p className="text-[10px] font-mono font-black text-slate-800 tracking-widest uppercase">
            ALEX FIT CENTER • LIVE SESSION READY
          </p>
        </div>
      </section>

      {/* 1.1 INTERACTIVE ENGINE & PREMIUM SLIDESHOW - PLACED DIRECTLY BELOW THE HERO */}
      <section id="hero-carousel-segment" className="py-12 sm:py-16 lg:py-20 bg-white border-b border-slate-200/80 relative overflow-hidden">
        {/* Decorative background visual accents */}
        <div className="absolute top-1/4 -left-32 w-80 h-80 bg-red-500/5 rounded-full filter blur-3xl pointer-events-none select-none" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-amber-500/5 rounded-full filter blur-3xl pointer-events-none select-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center">
            
            {/* Premium bright high-contrast card ensuring absolutely no word is hidden */}
            <div className="w-full max-w-4xl bg-slate-50 rounded-[2.5rem] border border-slate-200 p-6 sm:p-10 lg:p-12 shadow-xl flex flex-col justify-center items-center text-center text-slate-900 relative">
              <div className="relative min-h-[340px] sm:min-h-[260px] md:min-h-[220px] lg:min-h-[180px] w-full">
                {heroSlides.map((slide, idx) => {
                  const isActive = idx === currentSlide;
                  return (
                    <div 
                      key={idx}
                      className={`transition-all duration-[350ms] ease-out space-y-5 flex flex-col items-center ${
                        isActive 
                          ? "opacity-100 translate-y-0 scale-100" 
                          : "opacity-0 translate-y-4 scale-98 absolute inset-0 pointer-events-none"
                      }`}
                    >
                      <span className="text-[10px] font-mono font-black tracking-[0.25em] text-white uppercase bg-[#D32F2F] px-4 py-1.5 rounded-full inline-block shadow-md">
                        {slide.eyebrow}
                      </span>
                      
                      <h1 className="text-3xl sm:text-4xl md:text-5xl font-sans font-black tracking-tight leading-tight uppercase select-none">
                        <span className="bg-gradient-to-r from-red-600 to-amber-500 bg-clip-text text-transparent">
                          {slide.wordOne}
                        </span>{" "}
                        <span className="text-slate-950">
                          {slide.wordTwo}
                        </span>
                      </h1>

                      <p className="text-xs sm:text-sm text-slate-700 max-w-2xl leading-relaxed font-sans font-semibold">
                        {slide.desc}
                      </p>

                      <div className="flex flex-wrap justify-center gap-4 pt-1">
                        <motion.button
                          whileHover={{ scale: 1.05, y: -2, boxShadow: "0 10px 20px rgba(211,47,47,0.4)" }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setView("library")}
                          className="px-6 py-3 bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-sans font-extrabold text-xs uppercase rounded-full shadow-lg transition-all duration-200 cursor-pointer"
                        >
                          Start Training
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05, y: -2, boxShadow: "0 10px 20px rgba(0,0,0,0.05)" }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            const el = document.getElementById("pricing");
                            if (el) el.scrollIntoView({ behavior: "smooth" });
                          }}
                          className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-900 font-sans font-black text-xs uppercase rounded-full border border-slate-200 shadow-md transition-all duration-200 cursor-pointer"
                        >
                          View Pricing
                        </motion.button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Carousel Navigation Mechanics */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-slate-200 w-full">
                
                {/* Pagination dots: active = red dot, inactive = slate-200 */}
                <div className="flex items-center gap-3">
                  {heroSlides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`transition-all duration-300 cursor-pointer ${
                        idx === currentSlide 
                          ? "bg-[#D32F2F] w-8 h-2 rounded-full shadow-[0_0_10px_rgba(211,47,47,0.4)]" 
                          : "bg-slate-300 w-3 h-2 rounded-full hover:bg-slate-400"
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Round arrow nav buttons: light circle, dark chevron */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevSlide}
                    className="p-3 rounded-full bg-white text-slate-800 hover:bg-[#D32F2F] hover:text-white transition-colors duration-200 shadow-sm cursor-pointer border border-slate-200"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextSlide}
                    className="p-3 rounded-full bg-white text-slate-800 hover:bg-[#D32F2F] hover:text-white transition-colors duration-200 shadow-sm cursor-pointer border border-slate-200"
                    aria-label="Next slide"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 1.1 ELITE PERFORMANCE GALLERY & DEMONSTRATION */}
      <section id="elite-gallery-segment" className="py-16 bg-white border-b border-slate-200">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left side: Premium High-Definition Video Player Container (Moved from Hero) */}
            <div className="lg:col-span-6 relative w-full flex flex-col justify-center">
              <div className="mb-4 text-left">
                <span className="text-[9px] font-mono font-black tracking-widest text-[#D32F2F] uppercase bg-red-50 px-2.5 py-1 rounded-full">
                  Elite Live Demonstration
                </span>
                <h3 className="text-xl font-sans font-black text-slate-900 uppercase mt-2">
                  Alex Fitness Hub Live Session
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Witness real-time training biomechanics and dynamic feedback in action.
                </p>
              </div>
              <div className="relative w-full aspect-[16/10] rounded-3xl p-2 bg-gradient-to-tr from-[#D4AF37] to-amber-500 shadow-xl group overflow-hidden border border-slate-200">
                <div className="w-full h-full rounded-[1.4rem] overflow-hidden bg-black relative">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-100 scale-100 transition-transform duration-700 group-hover:scale-105"
                    poster="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRL8H7c4ADkyfqUDLGiRXOUzWfMzGs3ZY6SvmnppbzycUJoatp61JTWVgVX&s=10"
                  >
                    <source src="https://assets.mixkit.co/videos/44438/44438-720.mp4" />
                  </video>
                  
                  {/* Glowing Premium Highlight Badges */}
                  <div className="absolute top-4 left-4 bg-[#D32F2F] text-white text-[9px] font-sans font-black tracking-wider uppercase px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 z-10 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"></span>
                    LIVE SESSIONS
                  </div>

                  <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md text-white text-[9px] font-mono tracking-widest px-3 py-1.5 rounded-lg border border-white/10 z-10">
                    HD 1080P | ACTIVE FORM RECON
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Dynamic Slide Imagery Showcase (Moved from Hero) */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <div className="mb-4 text-left">
                <span className="text-[9px] font-mono font-black tracking-widest text-[#D4AF37] uppercase bg-amber-50 px-2.5 py-1 rounded-full">
                  Specialization Spotlights
                </span>
                <h3 className="text-xl font-sans font-black text-slate-900 uppercase mt-2">
                  Training & Nutrition Curriculums
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Explore our core visual pillars from the active training guide programs.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {heroSlides.map((slide, idx) => (
                  <motion.div 
                    whileHover={{ y: -4, scale: 1.03, boxShadow: "0 12px 24px -10px rgba(0,0,0,0.15)" }}
                    whileTap={{ scale: 0.98 }}
                    key={idx} 
                    className={`rounded-2xl overflow-hidden border transition-all duration-300 relative group bg-slate-100 h-40 cursor-pointer shadow-sm ${
                      idx === currentSlide 
                        ? "border-[#D4AF37] ring-2 ring-[#D4AF37]/50 shadow-md" 
                        : "border-slate-200 opacity-85"
                    }`}
                    onClick={() => setCurrentSlide(idx)}
                  >
                    <img 
                      src={slide.imageUrl} 
                      alt={slide.eyebrow}
                      className="w-full h-full object-cover transition-transform duration-[700ms]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-90" />
                    
                    <div className="absolute inset-x-0 bottom-0 p-3 text-left">
                      <p className="text-[8px] font-mono font-black tracking-widest text-amber-400 uppercase">
                        {slide.wordOne}
                      </p>
                      <h4 className="text-[11px] font-sans font-black text-white uppercase mt-0.5 leading-tight">
                        {slide.wordTwo} Suite
                      </h4>
                    </div>

                    {idx === currentSlide && (
                      <span className="absolute top-2 right-2 text-[8px] font-mono font-black tracking-wider text-white bg-[#D4AF37] px-2 py-0.5 rounded-full uppercase">
                        Active
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
              
              {/* Highlight card for currently active details */}
              <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-mono font-black text-[#D32F2F] bg-red-50 px-2 py-0.5 rounded uppercase">
                    {heroSlides[currentSlide].eyebrow}
                  </span>
                  <span className="text-[8px] font-mono font-black tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full uppercase">
                    PRO CLINICAL TRACKER
                  </span>
                </div>
                <h4 className="text-sm font-sans font-black text-slate-900 uppercase mt-2">
                  {heroSlides[currentSlide].wordOne} {heroSlides[currentSlide].wordTwo}
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {heroSlides[currentSlide].desc}
                </p>
              </div>

            </div>

          </div>
        </motion.div>
      </section>



      {/* 1.2 THE SPECTACULAR CORE HD WORKOUT COACHING STREAM */}
      <section id="hd-video-stream" className="py-20 bg-[#F7F7F7] border-b border-gray-150">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-[10px] font-sans font-black tracking-[0.25em] text-[#D32F2F] uppercase bg-red-50 px-3.5 py-1.5 rounded-full inline-block">
              BRIGHT LIVE WORKOUT DEMO
            </span>
            <h2 className="text-3xl sm:text-4xl font-sans font-black tracking-tight text-black uppercase">
              ALEXFITNESSHUB <span className="text-[#D32F2F]">HD TRAINING STREAM</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6B6B] max-w-lg mx-auto leading-relaxed font-sans">
              Examine real-time biomechanics under perfect studio lighting. Learn correct hip hinge depth, chest contraction lines, and eccentric deceleration ratios.
            </p>
            <div className="h-1 w-16 bg-[#D32F2F] mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* The Massive Bright HD Video View (7/12 cols) */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-4 border border-gray-200 shadow-lg flex flex-col justify-between">
              <div>
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-inner border border-slate-100">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-100"
                    poster="https://images.squarespace-cdn.com/content/v1/6148dc8019cff94afc664bf4/3336f9fb-0c36-4d1f-8ee6-14457d2c454c/GR8FLEX+2021-411.jpg"
                  >
                    <source src="https://assets.mixkit.co/videos/727/727-720.mp4" />
                  </video>

                  {/* Absolute Bright Overlays */}
                  <div className="absolute top-4 left-4 bg-red-600 text-white text-[9px] font-sans font-black tracking-widest px-3 py-1 rounded-full uppercase shadow flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-ping"></span>
                    ACTIVE INSTRUCTOR FEED
                  </div>

                  <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/10 text-white text-[10px] space-y-1 text-left">
                    <p className="font-black uppercase tracking-wider text-white">CURRENT FOCUS: SLOW LATERAL SHIFT</p>
                    <div className="flex gap-4 font-mono text-[9px] text-gray-300">
                      <span>TIME: 00:14 / 00:30</span>
                      <span>TEMPO: 3-0-1-1</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 text-left space-y-2">
                  <h3 className="text-lg font-sans font-black text-[#D32F2F] uppercase">
                    ECCENTRIC TENSION OVERVIEW: LATERAL CARDIO KETTLEBELL
                  </h3>
                  <p className="text-xs text-[#6B6B6B] leading-relaxed font-sans">
                    Watch the hips shift backward cleanly to maximize hamstring leverage and posterior chain load distribution. This specific form safely locks the lumbar spine to target core stabilization while accelerating local heart-rate fat oxidation.
                  </p>
                </div>
              </div>

              {/* Form Calibration Markers */}
              <div className="mt-6 pt-5 border-t border-gray-150 grid grid-cols-3 gap-4">
                <div className="p-3 bg-red-50/50 rounded-xl border border-red-100/50 text-left">
                  <span className="block text-[8px] font-sans font-black text-[#6B6B6B] uppercase tracking-wider">HEART RATE GOAL</span>
                  <p className="text-sm font-sans font-black text-[#D32F2F] uppercase">135 - 155 BPM</p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-left">
                  <span className="block text-[8px] font-sans font-black text-[#6B6B6B] uppercase tracking-wider">TARGET MUSCLE</span>
                  <p className="text-sm font-sans font-black text-[#2E7D32] uppercase">VISCERAL GLUTE / CORES</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-left">
                  <span className="block text-[8px] font-sans font-black text-[#6B6B6B] uppercase tracking-wider">EST. FAT SHRED RATIO</span>
                  <p className="text-sm font-sans font-black text-black uppercase">94% CAL / HR</p>
                </div>
              </div>

            </div>

            {/* Sidebar Lift Channel Guide (4/12 cols) */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <h4 className="text-xs font-sans font-black uppercase text-[#D32F2F] tracking-wider pb-3 border-b border-gray-150 text-left">
                  RECOMMENDED HD LIFT CHANNELS
                </h4>
                
                {/* Channel List */}
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl border border-[#C8E6C9] bg-[#E8F5E9] flex items-center gap-3 text-left">
                    <div className="w-8 h-8 rounded-full bg-[#2E7D32] flex items-center justify-center text-white shrink-0">
                      <Play className="w-3.5 h-3.5 text-white fill-current" />
                    </div>
                    <div>
                      <p className="text-xs font-sans font-black uppercase text-[#2E7D32]">12-30-3 LIPOLYSIS WALK</p>
                      <p className="text-[10px] text-emerald-800 leading-none mt-0.5">Cardio Zone 2 | Target Belly Adipose</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-gray-200 hover:border-red-200 bg-white flex items-center gap-3 text-left transition cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-slate-900 hover:bg-[#D32F2F] flex items-center justify-center text-white shrink-0">
                      <Play className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-sans font-black uppercase text-black">CHEST FLYES ISOLATION</p>
                      <p className="text-[10px] text-[#6B6B6B] leading-none mt-0.5">Continuous Cable Tension | 3s Hold</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-gray-200 hover:border-red-200 bg-white flex items-center gap-3 text-left transition cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-slate-900 hover:bg-[#D32F2F] flex items-center justify-center text-white shrink-0">
                      <Play className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-sans font-black uppercase text-black">LAT COLUMNS DEEP ROW</p>
                      <p className="text-[10px] text-[#6B6B6B] leading-none mt-0.5">Rhomboid Flexion | Strict Elbow Sweep</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-gray-200 hover:border-red-200 bg-white flex items-center gap-3 text-left transition cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-slate-900 hover:bg-[#D32F2F] flex items-center justify-center text-white shrink-0">
                      <Play className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-sans font-black uppercase text-black">DEPTH SQUATS ALIGNMENT</p>
                      <p className="text-[10px] text-[#6B6B6B] leading-none mt-0.5">Full Hip Crease Clearance | Safe Quadriceps</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-150">
                <button
                  onClick={() => setView("workout-videos")}
                  className="w-full py-3 bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-sans font-black text-xs uppercase rounded-xl transition duration-200"
                >
                  EXPLORE FULL VIDEO ARCHIVE
                </button>
              </div>

            </div>

          </div>
        </motion.div>
      </section>

      {/* 1.3 INTERACTIVE LIFESTYLE & EXERCISE DIRECTORY */}
      <section id="lifestyle-exercise-directory" className="py-24 bg-white border-b border-gray-150">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-[10px] font-sans font-black tracking-[0.2em] text-[#6B6B6B] uppercase block">
              NAVIGATIONAL HUB
            </span>
            <h2 className="text-3xl sm:text-4xl font-sans font-black tracking-tight text-black uppercase">
              CHOOSE YOUR <span className="text-[#D32F2F]">ATHLETIC PATHWAY</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6B6B] max-w-lg mx-auto leading-relaxed">
              Click on any directory target below to instantly redirect to targeted training libraries, nutrition macro profiles, or physical video walkthroughs.
            </p>
            <div className="h-1 w-16 bg-[#D32F2F] mx-auto mt-3" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* CARD 1: EXERCISE LIBRARY */}
            <div 
              onClick={() => setView("library")}
              className="group relative rounded-3xl overflow-hidden border border-gray-200 bg-white h-[340px] flex flex-col cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="h-44 w-full overflow-hidden relative bg-slate-100 border-b border-gray-100">
                <img 
                  src="https://theathletesphysique.com/wp-content/uploads/2020/07/Athletes-Physique-Exercise-Database.jpg" 
                  alt="Elite Exercise Library"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-5 flex-1 bg-white text-left flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-[8px] font-sans font-black tracking-widest text-[#D32F2F] bg-red-50 px-2 py-0.5 rounded uppercase">
                    1,200+ DRILLS
                  </span>
                  <h3 className="text-sm font-sans font-black text-slate-900 uppercase mt-1">
                    EXERCISE LIBRARY
                  </h3>
                  <p className="text-[10px] text-slate-600 leading-normal line-clamp-2">
                    Complete muscle contraction drills, equipment targets, and slow tempo setups.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] text-[#D32F2F] font-bold uppercase mt-2 group-hover:translate-x-1.5 transition-transform">
                  EXPLORE DRILLS <ArrowRight className="w-3 h-3 text-[#D32F2F]" />
                </span>
              </div>
            </div>

            {/* CARD 2: MEAL PLANS & LIFESTYLE */}
            <div 
              onClick={() => setView("nutrition")}
              className="group relative rounded-3xl overflow-hidden border border-gray-200 bg-white h-[340px] flex flex-col cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="h-44 w-full overflow-hidden relative bg-slate-100 border-b border-gray-100">
                <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRaMrGT8LyvfZbPnJafBlhFFt_2Uu7bSoic5qq0Mikg-SxnSqkOvlxAR_1&s=10" 
                  alt="Macro & Meal Planner"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-5 flex-1 bg-white text-left flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-[8px] font-sans font-black tracking-widest text-[#2E7D32] bg-emerald-50 px-2 py-0.5 rounded uppercase">
                    LOCAL INGREDIENTS
                  </span>
                  <h3 className="text-sm font-sans font-black text-slate-900 uppercase mt-1">
                    NUTRITION PORTAL
                  </h3>
                  <p className="text-[10px] text-slate-600 leading-normal line-clamp-2">
                    Calibrate plantains, beans, egg whites, and clean fish for macro targets.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] text-[#D32F2F] font-bold uppercase mt-2 group-hover:translate-x-1.5 transition-transform">
                  CALIBRATE DIET <ArrowRight className="w-3 h-3 text-[#D32F2F]" />
                </span>
              </div>
            </div>

            {/* CARD 3: BIOMECHANICAL VIDEOS */}
            <div 
              onClick={() => setView("workout-videos")}
              className="group relative rounded-3xl overflow-hidden border border-gray-200 bg-white h-[340px] flex flex-col cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="h-44 w-full overflow-hidden relative bg-slate-100 border-b border-gray-100">
                <img 
                  src="https://www.healthyads.com/wp-content/uploads/2025/10/Best-Gym-Advertisement-Examples-featured.webp" 
                  alt="Form Technique Videos"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-5 flex-1 bg-white text-left flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-[8px] font-sans font-black tracking-widest text-[#D32F2F] bg-red-50 px-2 py-0.5 rounded uppercase">
                    HD VISUALS
                  </span>
                  <h3 className="text-sm font-sans font-black text-slate-900 uppercase mt-1">
                    TECHNIQUE SHOWCASE
                  </h3>
                  <p className="text-[10px] text-slate-600 leading-normal line-clamp-2">
                    0.5x slow-motion loops demonstrating exact eccentric biomechanics.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] text-[#D32F2F] font-bold uppercase mt-2 group-hover:translate-x-1.5 transition-transform">
                  LAUNCH CHANNEL <ArrowRight className="w-3 h-3 text-[#D32F2F]" />
                </span>
              </div>
            </div>

            {/* CARD 4: GEMINI COACH CONSULT */}
            <div 
              onClick={() => setView("coach")}
              className="group relative rounded-3xl overflow-hidden border border-gray-200 bg-white h-[340px] flex flex-col cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="h-44 w-full overflow-hidden relative bg-slate-100 border-b border-gray-100">
                <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRL8H7c4ADkyfqUDLGiRXOUzWfMzGs3ZY6SvmnppbzycUJoatp61JTWVgVX&s=10" 
                  alt="AI Coach Consultation"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-5 flex-1 bg-white text-left flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-[8px] font-sans font-black tracking-widest text-[#2E7D32] bg-emerald-50 px-2 py-0.5 rounded uppercase">
                    GEMINI CALIBRATED
                  </span>
                  <h3 className="text-sm font-sans font-black text-slate-900 uppercase mt-1">
                    GEMINI AI CHAT
                  </h3>
                  <p className="text-[10px] text-slate-600 leading-normal line-clamp-2">
                    Acquire direct posture tuning, customized cardio plans, and meal corrections instantly.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] text-[#D32F2F] font-bold uppercase mt-2 group-hover:translate-x-1.5 transition-transform">
                  CHAT WITH COACH <ArrowRight className="w-3 h-3 text-[#D32F2F]" />
                </span>
              </div>
            </div>

          </div>

        </motion.div>
      </section>

      {/* 1.5 INTERACTIVE PLATFORM TECHNIQUE GUIDE */}
      <section id="technique-walkthrough" className="py-24 bg-slate-50 border-b border-gray-150">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-[#C0392B] uppercase bg-[#C0392B]/10 px-3.5 py-1 rounded-full inline-block">
              MASTER YOUR MECHANICS
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-[#1C1C1C] uppercase">
              How to Use <span className="text-[#C0392B]">AlexFitnessHub</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6B6B] max-w-lg mx-auto leading-relaxed font-sans">
              Unlock the secrets of perfect lifting technique and whole-body biomechanical accuracy in three simple steps.
            </p>
            <div className="h-1 w-16 bg-[#C0392B] mx-auto mt-4" />
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-200 relative shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
              <div className="absolute top-6 right-8 text-4xl font-black text-slate-100 font-mono group-hover:text-[#C0392B]/10 transition-colors font-sans">01</div>
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#C0392B]/5 text-[#C0392B] flex items-center justify-center">
                  <Flame className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black uppercase text-[#1C1C1C] tracking-tight font-display">Search for Exercises</h3>
                <p className="text-xs text-[#6B6B6B] leading-relaxed font-sans font-normal">
                  Head over to our <strong>Workout Library</strong> to search and filter over 1,200+ specific kinesis exercises and muscle group isolation drills curated by our clinical experts.
                </p>
              </div>
              <button 
                onClick={() => setView("library")}
                className="mt-6 w-full py-2.5 bg-slate-900 hover:bg-[#C0392B] text-white rounded-xl text-[10px] font-bold tracking-wider uppercase transition-colors font-mono cursor-pointer"
              >
                Go to Library
              </button>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-200 relative shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
              <div className="absolute top-6 right-8 text-4xl font-black text-slate-100 font-mono group-hover:text-[#C0392B]/10 transition-colors font-sans">02</div>
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <Play className="w-5 h-5" />
                </div>
                <h3 className="text-base font-black uppercase text-[#1C1C1C] tracking-tight font-display">Study the Video Technique</h3>
                <p className="text-xs text-[#6B6B6B] leading-relaxed font-sans font-normal">
                  Watch ultra-clear, high-definition motion loops demonstrating exact physical setup, muscle activation points, and tempo rules on our dedicated video page.
                </p>
              </div>
              <button 
                onClick={() => setView("workout-videos")}
                className="mt-6 w-full py-2.5 bg-slate-900 hover:bg-sky-600 text-white rounded-xl text-[10px] font-bold tracking-wider uppercase transition-colors font-mono cursor-pointer"
              >
                Watch Videos
              </button>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-200 relative shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
              <div className="absolute top-6 right-8 text-4xl font-black text-slate-100 font-mono group-hover:text-[#C0392B]/10 transition-colors font-sans">03</div>
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <h3 className="text-base font-black uppercase text-[#1C1C1C] tracking-tight font-display">Lock Form & Track Progress</h3>
                <p className="text-xs text-[#6B6B6B] leading-relaxed font-sans font-normal">
                  Apply advanced coaching tips during your lifting sessions. Save exercises, monitor slow eccentric phases, and track training targets in real-time.
                </p>
              </div>
              <button 
                onClick={() => setView("saved-exercises")}
                className="mt-6 w-full py-2.5 bg-slate-900 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-bold tracking-wider uppercase transition-colors font-mono cursor-pointer"
              >
                Saved Exercises
              </button>
            </div>

          </div>
        </motion.div>
      </section>

      {/* 2. ALTERNATING ROW SECTIONS: CLINICAL METHODOLOGY */}
      <section id="why-choose-us" className="py-24 bg-white border-b border-gray-100">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-2">
            <span className="text-[10px] font-sans font-black tracking-[0.2em] text-[#6B6B6B] uppercase block">
              CLINICAL STANDARDS
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-[#1C1C1C] uppercase">
              REVOLUTIONIZING <span className="text-[#C0392B]">PERFORMANCE</span>
            </h2>
            <div className="h-1 w-16 bg-[#C0392B] mx-auto mt-3" />
          </div>

          <div className="space-y-20">
            {/* Row 1: Red Icon, Right Text */}
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
              <div className="w-20 h-20 rounded-full bg-[#C0392B] text-white flex items-center justify-center shrink-0 shadow-lg shadow-[#C0392B]/10">
                <Flame className="w-10 h-10 text-white" />
              </div>
              <div className="space-y-3 text-center md:text-left">
                <h3 className="text-xl font-display font-black text-[#1C1C1C] uppercase tracking-tight">
                  1,200+ <span className="text-[#C0392B]">Kinesis Blueprints</span>
                </h3>
                <p className="text-sm text-[#6B6B6B] leading-relaxed font-sans">
                  Deploy targeted kinesis movements charted with high-resolution anatomical guides, custom equipment splits, and precise intensity thresholds. Perfect for breaking physical plateaus.
                </p>
              </div>
            </div>

            {/* Row 2: Dark Charcoal Icon, Left Text (Alternating) */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-16">
              <div className="w-20 h-20 rounded-full bg-[#1C1C1C] text-white flex items-center justify-center shrink-0 shadow-lg">
                <Zap className="w-10 h-10 text-[#C0392B]" />
              </div>
              <div className="space-y-3 text-center md:text-left">
                <h3 className="text-xl font-display font-black text-[#1C1C1C] uppercase tracking-tight">
                  Gemini <span className="text-[#C0392B]">Diet Calibration</span>
                </h3>
                <p className="text-sm text-[#6B6B6B] leading-relaxed font-sans">
                  Our secure server-side systems understand localized African staples (plantains, boiled yams, beans, fish indexes) and calibrate them perfectly matching your physical weight targets.
                </p>
              </div>
            </div>

            {/* Row 3: Red Icon, Right Text (Alternating) */}
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
              <div className="w-20 h-20 rounded-full bg-[#C0392B] text-white flex items-center justify-center shrink-0 shadow-lg shadow-[#C0392B]/10">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <div className="space-y-3 text-center md:text-left">
                <h3 className="text-xl font-display font-black text-[#1C1C1C] uppercase tracking-tight">
                  Industrial-Grade <span className="text-[#C0392B]">Account Security</span>
                </h3>
                <p className="text-sm text-[#6B6B6B] leading-relaxed font-sans">
                  Seamless premium subscription activations guarded by standard enterprise security. Cancel, extend, or alter settings instantly with total transparent local management.
                </p>
              </div>
            </div>
          </div>

        </motion.div>
      </section>

      {/* 3. SHOWCASE OF CATEGORIES SECTION */}
      <section id="categories-segment" className="py-24 bg-[#F7F7F7] border-b border-gray-200">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-[10px] font-sans font-black tracking-[0.2em] text-[#6B6B6B] uppercase block">
              PHYSIQUE INDEX
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-[#1C1C1C] uppercase">
              TRAINING <span className="text-[#C0392B]">SPECIALIZATION</span>
            </h2>
            <div className="h-1 w-16 bg-[#C0392B] mx-auto mt-3" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {workoutCategories.map((cat) => (
              <div 
                key={cat.id}
                className="group relative rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-[360px]"
              >
                <div className="h-44 w-full overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <img 
                    src={cat.image} 
                    alt={cat.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://i0.wp.com/www.muscleandfitness.com/wp-content/uploads/2020/07/Muscular-Fitness-Model-With-A-Six-Pack.jpg?w=1109&h=614&crop=1&quality=86&strip=all";
                    }}
                  />
                  <span className="absolute top-3 left-3 bg-[#1C1C1C]/90 text-[9px] font-sans font-black tracking-wider text-white px-2.5 py-1 rounded-md uppercase z-20">
                    {cat.tag}
                  </span>
                  <span className="absolute bottom-3 right-3 bg-[#C0392B] text-white text-[10px] font-sans font-black px-2.5 py-1 rounded-md z-20">
                    {cat.exercises}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-1 text-left">
                    <h4 className="font-display font-black text-sm text-[#1C1C1C] uppercase leading-snug">
                      {cat.title}
                    </h4>
                    <p className="text-xs text-[#6B6B6B] leading-normal line-clamp-2">
                      {cat.desc}
                    </p>
                  </div>

                  <button
                    onClick={() => setView("library")}
                    className="mt-4 w-full py-2.5 bg-[#1C1C1C] hover:bg-[#C0392B] text-white hover:text-white rounded-xl text-[10px] font-sans font-black uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1"
                  >
                    <span>Deploy Routine</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </motion.div>
      </section>

      {/* 4. PREMIUM INSTRUMENTS SECTION */}
      <section className="py-24 bg-white border-b border-gray-100">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-[10px] font-sans font-black tracking-[0.2em] text-[#6B6B6B] uppercase block">
              PREMIUM UTILITIES
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-[#1C1C1C] uppercase">
              HIGH PERFORMANCE <span className="text-[#C0392B]">FEATURES</span>
            </h2>
            <div className="h-1 w-16 bg-[#C0392B] mx-auto mt-3" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 bg-[#F7F7F7] rounded-2xl border border-gray-200 hover:border-[#C0392B] transition-all duration-250 text-left">
              <div className="w-10 h-10 rounded-full bg-[#C0392B] flex items-center justify-center text-white mb-5">
                <Play className="w-4 h-4 fill-current" />
              </div>
              <h4 className="font-display font-black text-sm uppercase text-[#1C1C1C] mb-2">0.5x Slow Biomechanics</h4>
              <p className="text-xs text-[#6B6B6B] leading-relaxed font-sans">
                Observe precision muscle insertions with ultra-slow performance playback. Lock perfect concentric angles easily.
              </p>
            </div>

            <div className="p-6 bg-[#F7F7F7] rounded-2xl border border-gray-200 hover:border-[#C0392B] transition-all duration-250 text-left">
              <div className="w-10 h-10 rounded-full bg-[#1C1C1C] flex items-center justify-center text-white mb-5">
                <Flame className="w-4 h-4 text-white" />
              </div>
              <h4 className="font-display font-black text-sm uppercase text-[#1C1C1C] mb-2">3s Eccentric Guidance</h4>
              <p className="text-xs text-[#6B6B6B] leading-relaxed font-sans">
                Focus on high-tension eccentric phases with dynamic countdown tools. Maximize motor unit recruitment safely.
              </p>
            </div>

            <div className="p-6 bg-[#F7F7F7] rounded-2xl border border-gray-200 hover:border-[#C0392B] transition-all duration-250 text-left">
              <div className="w-10 h-10 rounded-full bg-[#C0392B] flex items-center justify-center text-white mb-5">
                <Clipboard className="w-4 h-4 text-white" />
              </div>
              <h4 className="font-display font-black text-sm uppercase text-[#1C1C1C] mb-2">Anatomical Guides</h4>
              <p className="text-xs text-[#6B6B6B] leading-relaxed font-sans">
                Prevent joints from heavy strain. See crystal clear muscle activation layouts for back, legs, and shoulder splits.
              </p>
            </div>

            <div className="p-6 bg-[#F7F7F7] rounded-2xl border border-gray-200 hover:border-[#C0392B] transition-all duration-250 text-left">
              <div className="w-10 h-10 rounded-full bg-[#1C1C1C] flex items-center justify-center text-white mb-5">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <h4 className="font-display font-black text-sm uppercase text-[#1C1C1C] mb-2">Secured Access System</h4>
              <p className="text-xs text-[#6B6B6B] leading-relaxed font-sans">
                Direct clearances with completely transparent renewals management. Start or change subscription terms instantly.
              </p>
            </div>
          </div>

        </motion.div>
      </section>

      {/* 4.6 THE SCIENCE OF BELLY FAT OXIDATION & WEIGHT REDUCTION */}
      <section id="fat-loss-blueprint" className="py-24 bg-slate-50 border-b border-gray-150">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-[10px] font-sans font-black tracking-[0.25em] text-[#D32F2F] uppercase bg-red-50 px-3.5 py-1.5 rounded-full inline-block">
              SCIENTIFIC METABOLIC TRUTH
            </span>
            <h2 className="text-3xl sm:text-4xl font-sans font-black tracking-tight text-black uppercase">
              HOW TO BURN BELLY FAT <span className="text-[#D32F2F]">& LOSE WEIGHT</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6B6B] max-w-lg mx-auto leading-relaxed font-sans font-normal">
              Banish useless fitness myths. Explore the clinical biochemistry of lipid mobilization and learn exactly how to shred deep visceral belly fat safely.
            </p>
            <div className="h-1 w-16 bg-[#D32F2F] mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Column: The 4 Step Lipolysis Formula */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-gray-200 text-left space-y-8">
              <h3 className="text-xl font-sans font-black uppercase text-black pb-3 border-b border-gray-150">
                THE 4-PHASE LIPID MOBILIZATION PROTOCOL
              </h3>

              <div className="space-y-6">
                
                {/* Step 1 */}
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-[#D32F2F] text-white flex items-center justify-center shrink-0 text-xs font-sans font-black">
                    1
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-sans font-black text-black uppercase">
                      Establish a Caloric Deficit Defensible Line
                    </h4>
                    <p className="text-xs text-[#6B6B6B] leading-relaxed font-sans font-normal">
                      Fat loss is governed by thermodynamics. You must consume 15% to 20% fewer calories than your Total Daily Energy Expenditure (TDEE). The server-side Gemini calibrator helps you customize this margin seamlessly using regional whole food staples.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-[#D32F2F] text-white flex items-center justify-center shrink-0 text-xs font-sans font-black">
                    2
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-sans font-black text-black uppercase">
                      Trigger Lipolysis with 12-30-3 Incline Cardio
                    </h4>
                    <p className="text-xs text-[#6B6B6B] leading-relaxed font-sans font-normal">
                      Walking at a 12% incline gradient, at 3.0 mph speed pace, for 30 minutes continuous, pushes your cardiovascular system into **Heart Rate Zone 2** (approx. 65% of max HR). This maximizes fat oxidation rates while preserving knee and joint cartilage.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-[#D32F2F] text-white flex items-center justify-center shrink-0 text-xs font-sans font-black">
                    3
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-sans font-black text-black uppercase">
                      Prioritize High Eccentric-Tension Compound Lifts
                    </h4>
                    <p className="text-xs text-[#6B6B6B] leading-relaxed font-sans font-normal">
                      Isolating abs does not "spot-reduce" belly fat. Spot reduction is a biological impossibility. Instead, deploy heavy rows, depth squats, and chest presses. These activate major skeletal muscle groups, keeping insulin sensitivity high and resting metabolic rate elevated.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-[#D32F2F] text-white flex items-center justify-center shrink-0 text-xs font-sans font-black">
                    4
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-sans font-black text-black uppercase">
                      Manage Cortisol, Satiety & Sleep Cycles
                    </h4>
                    <p className="text-xs text-[#6B6B6B] leading-relaxed font-sans font-normal">
                      High cortisol stress levels force the endocrine system to store visceral fat in the lower stomach area. Protect your sleep schedule, focus on high-volume high-satiety foods (spinach, local beans, lean beef, boiled plantains), and hydrate with 3.5L of water daily.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Right Column: Visceral Fat Visual Guide Card */}
            <div className="lg:col-span-5 bg-white p-8 sm:p-10 rounded-3xl border border-gray-200 text-left flex flex-col justify-between relative overflow-hidden shadow-md">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D32F2F]/5 rounded-full blur-2xl" />
              
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Flame className="w-6 h-6 text-[#D32F2F]" />
                  <span className="font-sans font-black text-xs uppercase tracking-widest text-[#D32F2F]">FAT RECON PROFILE</span>
                </div>

                <div className="space-y-3">
                  <h4 className="text-lg font-sans font-black text-black uppercase leading-snug">
                    UNDERSTANDING VISCERAL ADIPOSE TISSUE
                  </h4>
                  <p className="text-xs text-[#6B6B6B] leading-relaxed font-sans font-normal">
                    Visceral belly fat wraps around your inner organs. It is highly active metabolically but can be systematically metabolized by following a sustained deficit coupled with incline compound cardio. 
                  </p>
                </div>

                {/* Bio indicators */}
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-150 space-y-3">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-gray-500 font-sans font-normal">Cardio Incline Target:</span>
                    <span className="font-mono text-[#D32F2F] font-black">12% Gradient</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] border-t border-gray-250 pt-2">
                    <span className="text-gray-500 font-sans font-normal">Protein Intake Minimum:</span>
                    <span className="font-mono text-[#2E7D32] font-bold">2.0g per kg BW</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] border-t border-gray-250 pt-2">
                    <span className="text-gray-500 font-sans font-normal">Lifting Session Goal:</span>
                    <span className="font-mono text-black font-bold">3s Eccentric Sets</span>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => {
                    const el = document.getElementById("notification-center");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full py-3.5 bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-sans font-black text-xs uppercase rounded-xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>ACTIVATE DAILY REMINDER ALERTS</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>

            </div>

          </div>
        </motion.div>
      </section>

      {/* 4.5 SOCIAL PROOF TESTIMONIALS */}
      <section id="social-proof" className="py-24 bg-white border-b border-gray-200">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-[10px] font-sans font-black tracking-[0.2em] text-[#6B6B6B] uppercase block">
              SOCIAL PROOF • ATHLETE VERIFICATION
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-black uppercase tracking-tight">
              Real Results From <span className="text-[#D32F2F]">Dedicated Athletes</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-sans max-w-lg mx-auto font-semibold">
              Join 3,400+ members who have successfully re-engineered their body weight, athletic stamina, and muscle definition.
            </p>
          </div>

          {/* Testimonial Filter Category Buttons */}
          <div className="flex flex-wrap justify-center items-center gap-2.5 mb-10">
            {["All", "Weight Loss", "Muscle Building", "General Journey"].map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setReviewFilter(filter);
                  setShowAllReviews(false);
                }}
                className={`px-4 py-2 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider transition cursor-pointer ${
                  reviewFilter === filter
                    ? "bg-[#D32F2F] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedVerifiedReviews
              .filter(r => reviewFilter === "All" || r.goal === reviewFilter)
              .slice(0, showAllReviews ? undefined : 6)
              .map((review, idx) => (
                <div
                  key={idx}
                  className="bg-[#F7F7F7] border border-gray-200 p-6 rounded-2xl flex flex-col justify-between space-y-6 hover:border-gray-300 transition duration-150"
                >
                  <div className="space-y-4">
                    {/* Stars & Location Banner */}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-0.5 text-amber-500">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <span className="text-[9px] font-mono font-bold text-[#2E7D32] bg-emerald-50 px-2 py-0.5 rounded-full uppercase">
                        {review.goal}
                      </span>
                    </div>

                    {/* Review text */}
                    <p className="text-xs text-gray-600 font-sans leading-relaxed italic font-semibold">
                      "{review.content}"
                    </p>
                  </div>

                  {/* Profile Details footer */}
                  <div className="pt-4 border-t border-gray-200/60 flex items-center justify-between">
                    <div>
                      <h4 className="font-sans font-bold text-xs text-black leading-tight">
                        {review.name}
                      </h4>
                      <p className="text-[9px] text-gray-400 font-mono">
                        {review.location} • {review.period}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono font-black text-[#D32F2F] uppercase block">
                        RESULT
                      </span>
                      <span className="text-[9px] font-sans font-bold text-gray-600 max-w-[150px] inline-block">
                        {review.achievement}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Load More Button */}
          {sortedVerifiedReviews.filter(r => reviewFilter === "All" || r.goal === reviewFilter).length > 6 && (
            <div className="text-center mt-12">
              <button
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="px-6 py-3 bg-black hover:bg-gray-900 text-white font-mono text-[10px] font-black uppercase tracking-widest rounded-xl transition cursor-pointer"
              >
                {showAllReviews ? "SHOW FEWER STORIES" : "EXPLORE ALL VERIFIED STORIES"}
              </button>
            </div>
          )}

        </motion.div>
      </section>

      {/* 5. PRICING PLANS */}
      <section id="pricing" className="py-24 bg-[#F7F7F7] border-b border-gray-200">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-[10px] font-sans font-black tracking-[0.2em] text-[#6B6B6B] uppercase block">
              MEMBERSHIP TIERS
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-[#1C1C1C] uppercase">
              CHOOSE YOUR <span className="text-[#C0392B]">TRAINING TIER</span>
            </h2>
            <div className="h-1 w-16 bg-[#C0392B] mx-auto mt-3" />
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
            
            {/* TIER 1: MONTHLY */}
            <motion.div 
              whileHover={{ y: -8, scale: 1.02, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)" }}
              className="p-8 rounded-2xl bg-white border border-gray-200 hover:border-[#C0392B] flex flex-col justify-between cursor-pointer"
            >
              <div className="text-left">
                <span className="text-[10px] font-sans font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-gray-100 text-[#1C1C1C]">
                  MONTHLY STARTER
                </span>
                <div className="mt-5">
                  <span className="text-4xl font-display font-black text-[#1C1C1C]">₦19,999</span>
                  <span className="text-[#6B6B6B] text-xs ml-1">/ 1 Month</span>
                </div>
                <p className="text-xs text-[#6B6B6B] mt-4 leading-relaxed font-sans">
                  Excellent entry-level tier to experience the core ecosystem, log active routines, and calibrate baseline nutritional plans.
                </p>
                <div className="mt-6 border-t border-gray-100 pt-5 space-y-2.5 text-xs text-[#2D3142]">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#C0392B] shrink-0" />
                    Complete Exercise Library
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#C0392B] shrink-0" />
                    Baseline Calorie Calibrator
                  </div>
                  <div className="flex items-center gap-2 opacity-50">
                    <Lock className="w-3.5 h-3.5 text-gray-450 shrink-0" />
                    HD slow-mo biomechanics guides
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-gray-100">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleInitiatePayment("monthly")}
                  className="w-full py-3 bg-[#1C1C1C] hover:bg-black text-white font-sans font-bold text-xs uppercase rounded-full transition-all duration-200 no-scroll-top cursor-pointer"
                >
                  Select Monthly
                </motion.button>
              </div>
            </motion.div>

            {/* TIER 2: FLEXIBLE MONTH SELECTOR */}
            <motion.div 
              whileHover={{ y: -8, scale: 1.02, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)" }}
              className="p-8 rounded-2xl bg-white border-2 border-[#C0392B] flex flex-col justify-between relative cursor-pointer"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C0392B] text-white text-[8px] font-sans font-black uppercase tracking-wider px-3.5 py-1 rounded-full z-10">
                FLEXIBLE SPAN
              </div>
              
              <div className="text-left mt-2">
                <span className="text-[10px] font-sans font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#C0392B]/10 text-[#C0392B]">
                  CUSTOM MONTHS
                </span>
                <div className="mt-5">
                  <span className="text-4xl font-display font-black text-[#1C1C1C]">
                    ₦{multiMonthTotal.toLocaleString()}
                  </span>
                  <span className="text-[#6B6B6B] text-xs ml-1">/ due today</span>
                </div>
                <p className="text-xs text-[#6B6B6B] mt-4 leading-relaxed font-sans">
                  Tailor customized months to align precisely with your physique recomposition timeline targets.
                </p>

                <div className="mt-5 p-4 rounded-xl bg-[#F7F7F7] border border-gray-200 space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-sans font-black uppercase">
                    <span className="text-[#6B6B6B]">CHOOSE DURATION:</span>
                    <span className="text-[#C0392B] bg-[#C0392B]/5 px-2 py-0.5 rounded border border-[#C0392B]/10">
                      {selectedMonths} Months
                    </span>
                  </div>
                  
                  <div className="flex justify-between gap-1">
                    {[2, 3, 4, 5, 6].map((m) => (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        key={m}
                        type="button"
                        onClick={() => setSelectedMonths(m)}
                        className={`flex-1 py-1.5 rounded text-xs font-sans font-black transition-all border no-scroll-top cursor-pointer ${
                          selectedMonths === m
                            ? "bg-[#C0392B] text-white border-transparent"
                            : "bg-white text-gray-700 border-gray-200 hover:border-[#C0392B]"
                        }`}
                      >
                        {m}M
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="mt-5 space-y-2.5 text-xs text-[#2D3142]">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#C0392B] shrink-0" />
                    Uncapped access over complete {selectedMonths} months
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#C0392B] shrink-0" />
                    Continuous AI Coach priority features
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-gray-100">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleInitiatePayment("multi")}
                  className="w-full py-3 bg-[#C0392B] hover:bg-[#A82E22] text-white font-sans font-bold text-xs uppercase rounded-full transition-all duration-200 no-scroll-top cursor-pointer"
                >
                  Select duration
                </motion.button>
              </div>
            </motion.div>

            {/* TIER 3: YEARLY (10% DISCOUNT) */}
            <motion.div 
              whileHover={{ y: -8, scale: 1.02, boxShadow: "0 20px 25px -5px rgba(192,57,43,0.3)" }}
              className="p-8 rounded-2xl bg-[#C0392B] text-white border-2 border-[#C0392B] flex flex-col justify-between cursor-pointer"
            >
              <div className="text-left">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-sans font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-white text-[#C0392B]">
                    YEARLY ANCHOR
                  </span>
                  <span className="bg-white/20 text-white text-[8px] font-sans font-black py-0.5 px-2 rounded-full">
                    10% OFF
                  </span>
                </div>
                
                <div className="mt-5">
                  <h3 className="font-display font-black text-xl text-white uppercase">VIP Elite Club</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-4xl font-display font-black text-white">₦215,989</span>
                    <span className="text-white/80 text-xs font-sans">/ ANNUALLY</span>
                  </div>
                </div>

                <p className="text-xs text-white/90 mt-4 leading-relaxed font-sans font-semibold">
                  Best for dedicated athletes tracking permanent body recomposition.
                </p>

                <div className="mt-6 border-t border-white/20 pt-5 space-y-2.5 text-xs text-white">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-white shrink-0" />
                    Workouts (Routines & Sets)
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-white shrink-0" />
                    Nutrition (Meal Config)
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-white shrink-0" />
                    My Plan (Daily Schedules)
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-white shrink-0" />
                    AI Coach (AI Optimization)
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-white shrink-0" />
                    Community (Discuss & Post)
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-white shrink-0" />
                    Pricing Plans (Upgrade Status)
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-white shrink-0" />
                    Weekly Reports (Premium)
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-white/20">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleInitiatePayment("yearly")}
                  className="w-full py-3 bg-white hover:bg-gray-100 text-[#C0392B] font-sans font-black text-xs uppercase rounded-full transition-all duration-200 cursor-pointer shadow-sm no-scroll-top"
                >
                  CHOOSE ANCHOR YEARLY
                </motion.button>
              </div>
            </motion.div>

          </div>

          {/* Secure Shield Protection Callout */}
          <div className="mt-12 max-w-md mx-auto p-6 rounded-2xl bg-white border border-gray-200 text-center flex flex-col items-center">
            <Shield className="w-8 h-8 text-[#C0392B] mb-3" />
            <h6 className="text-[10px] font-sans font-black uppercase tracking-wider text-[#1C1C1C]">100% Risk-Free 14-Day Refund Promise</h6>
            <p className="text-[10px] text-[#6B6B6B] mt-1.5 leading-relaxed font-sans">
              Try premium with complete confidence. If our workout tracking or AI coaching does not upgrade your daily routine, request reimbursement within 14 days for rapid secure processing.
            </p>
          </div>

        </motion.div>
      </section>

      {/* 6. DYNAMIC ACCORDION FAQS SYSTEM */}
      <section id="faqs-segment" className="py-24 bg-white border-b border-gray-100">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-[10px] font-sans font-black tracking-[0.2em] text-[#6B6B6B] uppercase block">
              GET RESPONSES
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-[#1C1C1C] uppercase">
              FREQUENTLY ASKED <span className="text-[#C0392B]">QUESTIONS</span>
            </h2>
            <div className="h-1 w-16 bg-[#C0392B] mx-auto mt-3" />
          </div>

          <div className="space-y-4">
            {faqsList.map((item, idx) => (
              <div 
                key={idx} 
                className="overflow-hidden rounded-xl border border-gray-200 bg-[#F7F7F7]"
              >
                <button
                  type="button"
                  onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-sans font-extrabold text-[#1C1C1C] text-xs uppercase cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4.5 h-4.5 text-[#C0392B] shrink-0" />
                    {item.q}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 shrink-0 transition-transform duration-300 ${openFAQ === idx ? "rotate-180" : ""}`} />
                </button>
                
                <div 
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    openFAQ === idx ? "max-h-[300px] border-t border-gray-200 p-5 bg-white" : "max-h-0"
                  }`}
                >
                  <p className="text-xs text-[#6B6B6B] leading-relaxed font-sans">
                    {item.a}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </motion.div>
      </section>

      {/* 7. CONTACT / PREMIUM CONSULTATION FORM */}
      <section id="contact" className="py-24 bg-[#F7F7F7] border-b border-gray-200">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-[10px] font-sans font-black tracking-[0.2em] text-[#6B6B6B] uppercase block">
              SUPPORT CHANNELS
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-[#1C1C1C] uppercase">
              CONNECT WITH <span className="text-[#C0392B]">COACHES</span>
            </h2>
            <div className="h-1 w-16 bg-[#C0392B] mx-auto mt-3" />
          </div>

          <div className="max-w-2xl mx-auto bg-white border border-gray-200 p-8 sm:p-10 rounded-2xl shadow-sm relative overflow-hidden">
            {contactSubmitted ? (
              <div className="text-center py-8 space-y-4 text-left">
                <div className="mx-auto w-12 h-12 bg-[#C0392B]/10 text-[#C0392B] rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h4 className="text-base font-display font-black text-[#1C1C1C] uppercase text-center">Inquiry Received</h4>
                <p className="text-xs text-[#6B6B6B] max-w-md mx-auto leading-relaxed text-center">
                  Thank you, <strong className="text-[#1C1C1C]">{contactName}</strong>! Your inquiry regarding <strong className="text-[#1C1C1C]">{contactGoal.toUpperCase()}</strong> has been captured. The coaching desk will evaluate your requirements and follow up via <span className="underline">{contactEmail}</span> within 24 working hours.
                </p>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setContactSubmitted(false)}
                    className="mt-4 px-5 py-2.5 bg-[#1C1C1C] hover:bg-black text-white rounded-full text-[10px] font-sans font-black uppercase tracking-wider transition inline-block mx-auto text-center"
                  >
                    Send another message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-6 text-left">
                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label className="block text-[9px] font-sans font-black text-[#6B6B6B] uppercase tracking-widest">YOUR FULL NAME</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#F7F7F7] text-[#1C1C1C] focus:ring-2 focus:ring-[#C0392B]/20 focus:outline-none transition text-xs font-sans"
                      placeholder="e.g. Alex Johnson"
                    />
                  </div>

                  {/* Email field */}
                  <div className="space-y-1.5">
                    <label className="block text-[9px] font-sans font-black text-[#6B6B6B] uppercase tracking-widest">EMAIL ADDRESS</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#F7F7F7] text-[#1C1C1C] focus:ring-2 focus:ring-[#C0392B]/20 focus:outline-none transition text-xs font-sans"
                      placeholder="e.g. alex@domain.com"
                    />
                  </div>
                </div>

                {/* Goal category field */}
                <div className="space-y-1.5">
                  <label className="block text-[9px] font-sans font-black text-[#6B6B6B] uppercase tracking-widest">PRIMARY PHYSICAL GOAL</label>
                  <select
                    value={contactGoal}
                    onChange={(e) => setContactGoal(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#F7F7F7] text-[#1C1C1C] focus:ring-2 focus:ring-[#C0392B]/20 focus:outline-none transition text-xs font-sans uppercase font-bold"
                  >
                    <option value="hypertrophy">Hypertrophy (Anabolic Muscle Gain)</option>
                    <option value="fat_loss">Fat Shred Cycles (Metabolic Burn)</option>
                    <option value="calisthenics">Bodyweight Leverage stability</option>
                    <option value="rehabilitation">Joint Posture Rehabilitation</option>
                    <option value="nutrition">Custom Macronutrient profiling</option>
                  </select>
                </div>

                {/* Message details field */}
                <div className="space-y-1.5">
                  <label className="block text-[9px] font-sans font-black text-[#6B6B6B] uppercase tracking-widest">SPECIFIC ATHLETIC ENQUIRY</label>
                  <textarea
                    required
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#F7F7F7] text-[#1C1C1C] focus:ring-2 focus:ring-[#C0392B]/20 focus:outline-none transition text-xs leading-relaxed"
                    placeholder="Describe your current lifting stats, weekly training splits, and any dietary requirements..."
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmittingContact}
                  className="w-full py-4 bg-[#C0392B] hover:bg-[#A82E22] text-white font-sans font-black text-xs uppercase cursor-pointer rounded-xl transition duration-200 flex items-center justify-center gap-2 tracking-widest shadow-md active:scale-98"
                >
                  {isSubmittingContact ? "TRANSMITTING INQUIRY..." : "SEND SIGNAL MESSAGE"}
                </button>
              </form>
            )}
          </div>

        </motion.div>
      </section>

      {/* 8. FLOATING ACTION BUTTON: Fixed circular red chat bubble bottom-right */}
      <button
        onClick={() => {
          if (user) {
            setView("coach");
          } else {
            onOpenAuth();
          }
        }}
        className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-[#C0392B] text-white shadow-xl hover:bg-[#A82E22] active:scale-95 transition-all duration-200"
        aria-label="Consult AI Coach Assistant"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </button>

      {/* 9. EMBEDDED PREMIUM ACTIVATION OVERLAY (PAYSTACK DISPLAY NAVIGATOR) */}
      {activePaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl bg-[#111111] border border-gray-800 overflow-hidden shadow-2xl relative text-white">
            
            {/* HUD portal header */}
            <div className="bg-[#1C1C1C] p-5 flex items-center justify-between border-b border-gray-800">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#C0392B] fill-[#C0392B]" />
                <span className="font-display font-black tracking-wider text-xs uppercase text-gray-100">
                  PAYSTACK TRANSACTION INITIATION NODE
                </span>
              </div>
              {checkoutError && (
                <button 
                  onClick={() => {
                    setActivePaymentModal(null);
                    setSubmittingPlan(null);
                    setCheckoutError(null);
                  }} 
                  className="p-1.5 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors no-scroll-top"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="p-6 space-y-6 text-xs font-sans">
              
              {checkoutError ? (
                <div className="space-y-4 py-4">
                  <div className="p-4 rounded-xl bg-red-950/50 border border-red-900 text-red-400 leading-relaxed font-sans text-left">
                    <strong className="text-sm font-bold block mb-1">Initialization Failed</strong>
                    {checkoutError}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActivePaymentModal(null);
                      setSubmittingPlan(null);
                      setCheckoutError(null);
                    }}
                    className="w-full py-3 bg-[#C0392B] hover:bg-[#A82E22] text-white font-sans font-bold text-xs uppercase rounded-xl transition duration-200 no-scroll-top cursor-pointer"
                  >
                    Return to pricing plans
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Beautiful Loading Core Indicator */}
                  <div className="flex flex-col items-center justify-center space-y-4 text-center py-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#C0392B] border-t-transparent" />
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-white tracking-tight">
                        ALEXFITNESSHUB SECURE CONSOLE
                      </h3>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-mono">
                        INITIALIZING PAYSTACK CHECKOUT GATEWAY
                      </p>
                    </div>
                  </div>

                  {/* Transaction Parameters */}
                  <div className="rounded-xl bg-[#1A1A1A] p-4 border border-gray-800 space-y-3 text-left">
                    <div className="flex justify-between items-center py-1.5 border-b border-gray-800/60 font-mono text-[10px] text-gray-400">
                      <span>SECURE CONNECTION</span>
                      <span className="text-emerald-500 font-bold uppercase">● ESTABLISHED</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400 font-mono text-[10px] uppercase">ATHLETE PROFILE:</span>
                      <span className="font-bold text-gray-100">{user?.email}</span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400 font-mono text-[10px] uppercase">MEMBERSHIP LEVEL:</span>
                      <span className="font-bold text-[#C0392B] uppercase">
                        {activePaymentModal === "yearly" 
                          ? "VIP Elite Club (12M)" 
                          : activePaymentModal === "multi" 
                          ? `Flexible Span (${selectedMonths}M)` 
                          : "Monthly Elite (1M)"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400 font-mono text-[10px] uppercase">DUE VALUE TODAY:</span>
                      <span className="font-black text-white text-sm">
                        ₦{(activePaymentModal === "yearly" 
                          ? yearlyPriceAnnual 
                          : activePaymentModal === "multi" 
                          ? multiMonthTotal 
                          : basePriceMonthly).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Connection log terminal simulation */}
                  <div className="rounded-lg bg-black p-3.5 border border-gray-900 font-mono text-[9px] text-gray-500 space-y-1.5 text-left leading-normal">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#C0392B]">&gt;</span>
                      <span>Enabling SSL/TLS 1.3 socket tunnel...</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#C0392B]">&gt;</span>
                      <span>Requesting checkout redirect from paystack.co...</span>
                    </div>
                    <div className="flex items-center gap-1.5 animate-pulse">
                      <span className="text-[#C0392B]">&gt;</span>
                      <span className="text-gray-300">Awaiting secure authorization handshakes...</span>
                    </div>
                  </div>

                  {/* Redirection Notice */}
                  <p className="text-[10px] text-gray-400 leading-normal text-center max-w-sm mx-auto">
                    Please do not close, refresh, or navigate away. Redirection takes place automatically. After successful payment, your Premium account access will unlock instantly.
                  </p>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* 10. SYSTEM FOOTER */}
      <footer className="bg-white text-black border-t border-slate-200 py-16 font-sans text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          
          <div className="space-y-4 col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 font-serif font-black text-lg text-[#C0392B]">
              <Shield className="h-5 w-5 text-[#C0392B] fill-[#C0392B]" />
              <span>Alex Fitness</span>
            </div>
            <p className="text-xs text-black leading-relaxed font-sans">
              Deploying elite exercise kinesis benchmarks, absolute macronutrient nutrition tracking, and unified AI-powered consultation.
            </p>
          </div>

          <div>
            <h4 className="text-[10px] font-sans font-black uppercase tracking-widest text-[#C0392B] mb-3">Training Solutions</h4>
            <ul className="space-y-1.5 text-xs text-black font-sans">
              <li><button onClick={() => setView("library")} className="hover:text-[#C0392B] transition-colors">Treadmill Walk 12-30-3</button></li>
              <li><button onClick={() => setView("library")} className="hover:text-[#C0392B] transition-colors">Chest Isolation Press</button></li>
              <li><button onClick={() => setView("library")} className="hover:text-[#C0392B] transition-colors">Home Shred Workouts</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-sans font-black uppercase tracking-widest text-[#C0392B] mb-3">Premium Features</h4>
            <ul className="space-y-1.5 text-xs text-black font-sans">
              <li><button onClick={() => setView("home")} className="hover:text-[#C0392B] transition-colors">Flexible Selectors</button></li>
              <li><button onClick={() => setView("daily-plan")} className="hover:text-[#C0392B] transition-colors">Daily Training Schedule</button></li>
              <li><button onClick={() => setView("coach")} className="hover:text-[#C0392B] transition-colors">Gemini AI Assistant</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-sans font-black uppercase tracking-widest text-[#C0392B] mb-3">Customer Support</h4>
            <p className="text-xs text-black leading-relaxed font-sans">
              Have questions or transaction inquiries? Contact support at:
              <br />
              <code className="text-[10px] text-white bg-[#C0392B] px-2.5 py-1 rounded inline-block mt-2 font-mono">support@alexfitness.com</code>
            </p>
          </div>

        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-slate-200 text-left text-xs text-black">
          <p>© 2026 Alex Fitness Inc. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
