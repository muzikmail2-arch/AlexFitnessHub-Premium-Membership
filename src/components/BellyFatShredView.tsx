import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { 
  Flame, Droplets, Trophy, CheckSquare, LineChart, Shield, Calendar, Play, 
  ChevronRight, Dumbbell, Activity, Compass, Info, Check, Plus, AlertCircle, 
  Trash2, Upload, Sparkles, RefreshCw, ChevronLeft, ArrowRight, Heart, Zap, Clock, Footprints, Settings, Bell, Apple, Ban
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { LineChart as ReLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, handleFirestoreError, OperationType, isMockFirebase, auth } from "../lib/firebase";
import { queueBellyFatShredReminderEmail } from "../lib/mailTriggers";

// High-fidelity local types
interface WeightEntry {
  date: string;
  value: number;
}

interface WaistEntry {
  date: string;
  value: number;
}

interface PhotoEntry {
  date: string;
  url: string;
  note: string;
}

interface DailyHabits {
  workout: boolean;
  run: boolean;
  water: boolean;
  lemonCucumber: boolean;
  mealWalks: { breakfast: boolean; lunch: boolean; dinner: boolean };
  healthyMeals: boolean;
  sleep: boolean;
  stretch: boolean;
}

interface BellyFatShredProgress {
  userId: string;
  currentWeek: number;
  currentDay: number;
  completedWorkouts: string[]; // e.g. "week_1_day_1"
  completedRuns: string[]; // e.g. "week_1_run_1"
  waterIntake: number; // in Liters, resets daily
  lastHydrationReset: string; // ISO date string
  hydrationHistory: Record<string, number>; // dateStr -> liters
  walkingHistory: Record<string, { breakfast: boolean; lunch: boolean; dinner: boolean }>; // dateStr -> walkStates
  nutritionChecklist: Record<string, { eatenHealthy: boolean; limitedAvoidFoods: boolean }>; // dateStr -> mealState
  weightHistory: WeightEntry[];
  waistHistory: WaistEntry[];
  progressPhotos: PhotoEntry[];
  achievements: string[];
  streaks: {
    workoutStreak: number;
    hydrationStreak: number;
    runningStreak: number;
  };
  lemonCucumberCompleted: string[]; // array of "week_W_L_D" or "dateStr"
  dailyChecklistHistory: Record<string, DailyHabits>; // dateStr -> habits
  reminders: {
    workout: boolean;
    water: boolean;
    running: boolean;
    meal: boolean;
    walk: boolean;
    hydration: boolean;
    lemonCucumber: boolean;
  };
}

// Helper to calculate daily score from habits
const calculateHabitScore = (habits: DailyHabits, isRunScheduled: boolean, isLemonScheduled: boolean): number => {
  let score = 0;
  let totalTasks = 6; // Workout, Water, MealWalks, HealthyMeals, Sleep, Stretch
  
  if (habits.workout) score += 15;
  if (habits.water) score += 15;
  if (habits.healthyMeals) score += 15;
  if (habits.sleep) score += 15;
  if (habits.stretch) score += 10;
  
  // Meal walks (3 meals)
  let walkCount = 0;
  if (habits.mealWalks.breakfast) walkCount++;
  if (habits.mealWalks.lunch) walkCount++;
  if (habits.mealWalks.dinner) walkCount++;
  score += walkCount * 5; // 15 max
  
  if (isRunScheduled) {
    totalTasks++;
    if (habits.run) score += 10;
  }
  
  if (isLemonScheduled) {
    totalTasks++;
    if (habits.lemonCucumber) score += 5;
  }
  
  // Scale to 100 max
  const maxPossible = 70 + (isRunScheduled ? 10 : 0) + (isLemonScheduled ? 5 : 0) + 15;
  return Math.round((score / maxPossible) * 100);
};

// Generate high-fidelity workouts progression for weeks 1 to 20
const getWorkoutForWeekAndDay = (week: number, dayNum: number) => {
  // Muscle groups & themes progression
  const phase = week <= 4 ? "Phase 1: Foundational Core & Metabolic Prep" 
              : week <= 8 ? "Phase 2: HIIT Acceleration & Strength Base" 
              : week <= 12 ? "Phase 3: Progressive Resistance & Caloric Deficit Focus" 
              : week <= 16 ? "Phase 4: High-Velocity Metabolic Conditioning" 
              : "Phase 5: Peak Fat Shred & Sculpt Definition";

  const isBeginner = week <= 4;
  const isIntermediate = week > 4 && week <= 12;
  const difficulty = isBeginner ? "Beginner" : isIntermediate ? "Intermediate" : "Advanced";
  
  const durationMap = [45, 50, 60, 75, 90];
  const duration = durationMap[Math.min(4, Math.floor((week - 1) / 4))] + " mins";
  const calMap = [350, 480, 620, 750, 920];
  const calBurn = calMap[Math.min(4, Math.floor((week - 1) / 4))] + " kcal estimated";

  // Customize based on week phase & day
  let title = `Full-Body fat loss focus - Day ${dayNum}`;
  let exercises: string[] = [];
  let strengthReps = week <= 4 ? "3 sets x 12 reps (Bodyweight)" : (week <= 12 ? "4 sets x 10 reps (Moderate Weight)" : "4 sets x 8 reps (Progressive Overload)");
  
  if (dayNum === 1) {
    title = `HIIT Intervals & Midsection Stability`;
    exercises = ["High Knees", "Plank", "Russian Twist", "Mountain Climbers", "Bicycle Crunch"];
  } else if (dayNum === 2) {
    title = `Compound Calorie Crusher & Legs`;
    exercises = ["Squats", "Burpees", "Lunges", "12-3-30 Treadmill Walk", "Dead Bug"];
  } else if (dayNum === 3) {
    title = `Upper Body Sculpt & Metabolic Circuit`;
    exercises = ["Push-ups", "Jumping Jacks", "Side Plank", "Bear Crawl", "Reverse Crunch"];
  } else {
    title = `Elite Midsection Melt & Endurance`;
    exercises = ["Rope Jump", "Russian Twist", "Plank", "Mountain Climbers", "Squats"];
  }

  return {
    phase,
    difficulty,
    duration,
    calBurn,
    title,
    warmup: [
      "Arm circles & torso twists — 3 mins",
      "Dynamic hip openers — 2 mins",
      "Light jumping jacks or marching — 3 mins",
      week > 8 ? "Spidermans with chest rotations — 2 mins" : "Cat-Cow stretching — 1 min"
    ],
    core: [
      `Plank Hold: ${week <= 4 ? "3 sets x 30s" : week <= 12 ? "4 sets x 45s" : "4 sets x 60s (Weighted)"}`,
      `Dead Bug: 3 sets x ${week <= 4 ? "12 reps" : "16 reps with control"}`,
      `Side Plank Hold: 3 sets x ${week <= 4 ? "20s" : "45s per side"}`
    ],
    hiit: [
      `Mountain Climbers: 4 rounds x ${week <= 8 ? "30s work / 15s rest" : "45s work / 15s rest"}`,
      `Burpees: 3 rounds x ${week <= 4 ? "10 reps" : week <= 12 ? "15 reps" : "20 reps with push-up"}`,
      `Rope Jump intervals: ${week <= 8 ? "3 mins continuous" : "5 mins high intensity double-unders"}`
    ],
    strength: [
      `Squats: ${strengthReps}`,
      `Push-ups (Knee or Full): 3 sets x ${week <= 4 ? "8 reps" : "15 reps with slow negatives"}`,
      `Reverse Lunges: 3 sets x 12 reps per side ${week > 8 ? "(Hold dumbbells)" : ""}`
    ],
    fullBodyCircuit: [
      `Bear Crawl: 3 sets x 40 seconds`,
      `12-3-30 Treadmill Walk: ${week <= 4 ? "15 mins" : week <= 12 ? "30 mins" : "45 mins"} at 12% incline, 3.0 mph`
    ],
    cooldown: [
      "Cobra pose stretch — hold 30s x 2",
      "Kneeling hamstring stretch — 1 min per side",
      "Child's pose deep breathing — 2 mins"
    ],
    modifications: {
      beginner: "Scale cardio work-to-rest ratio (e.g. 20s work / 20s rest). Use elevated pushups. Do standard bodyweight air squats.",
      intermediate: "Add light dumbbells. Maintain 12-3-30 incline at full duration. Perform classic pushups.",
      advanced: "Increase dumbbell weights. Replace standard squats with jump squats. Perform 12-3-30 walk with a 5kg weighted vest."
    },
    exercisesList: exercises
  };
};

export default function BellyFatShredView() {
  const { user, setView, theme } = useApp();
  const [activeTab, setActiveTab] = useState<"dashboard" | "workouts" | "running" | "nutrition" | "analytics" | "coaching">("dashboard");
  const [progress, setProgress] = useState<BellyFatShredProgress | null>(null);
  const [loadingDb, setLoadingDb] = useState(true);
  const [savingDb, setSavingDb] = useState(false);
  const [logWeightVal, setLogWeightVal] = useState("");
  const [logWaistVal, setLogWaistVal] = useState("");
  const [logPhotoUrl, setLogPhotoUrl] = useState("");
  const [logPhotoNote, setLogPhotoNote] = useState("");
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [currentDayTimer, setCurrentDayTimer] = useState<number | null>(null);
  const [timerActive, setTimerActive] = useState(false);
  const [premiumProgramContent, setPremiumProgramContent] = useState<any>(null);
  const [fetchingPremiumContent, setFetchingPremiumContent] = useState(false);

  // Default weight / waist if history empty
  const defaultWeight = user?.weight || 80;
  const defaultWaist = 90;

  const [emailSending, setEmailSending] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleSendBellyFatShredReminder = async () => {
    if (!user) return;
    setEmailSending(true);
    setEmailSuccess(null);
    setEmailError(null);
    try {
      await queueBellyFatShredReminderEmail(
        user.email,
        user.displayName || "Athlete",
        progress?.currentWeek || 1,
        progress?.currentDay || 1
      );
      setEmailSuccess("Success! An automated Belly Fat Shred reminder email has been queued in Firestore. The Mail Extension will dispatch it shortly.");
    } catch (err: any) {
      console.error("Error sending belly fat shred reminder email:", err);
      setEmailError(err.message || "Could not queue reminder email. Please check internet connection.");
    } finally {
      setEmailSending(false);
    }
  };

  const fetchProgramContent = async () => {
    if (!user) return;
    setFetchingPremiumContent(true);
    try {
      const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
      if (!token) return;
      const res = await fetch("/api/premium/belly-fat-shred/content", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setPremiumProgramContent(data);
        }
      }
    } catch (e) {
      console.error("Error fetching premium program content:", e);
    } finally {
      setFetchingPremiumContent(false);
    }
  };

  useEffect(() => {
    if (user && (user.subscriptionStatus === "premium" || user.role === "admin")) {
      fetchProgramContent();
    }
  }, [user]);

  // Generate today date string key
  const todayStr = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!user) return;
    
    // Safety redirect: If standard user, block and scroll to pricing section
    if (user.subscriptionStatus !== "premium" && user.role !== "admin") {
      setView("home");
      setTimeout(() => {
        const el = document.getElementById("pricing");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 300);
      return;
    }

    loadUserData();
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    setLoadingDb(true);
    
    // 1. Local Fallback baseline
    const localKey = `belly_fat_shred_progress_${user.uid}`;
    const cached = localStorage.getItem(localKey);
    let initialProgress: BellyFatShredProgress = {
      userId: user.uid,
      currentWeek: 1,
      currentDay: 1,
      completedWorkouts: [],
      completedRuns: [],
      waterIntake: 0,
      lastHydrationReset: todayStr,
      hydrationHistory: {},
      walkingHistory: {},
      nutritionChecklist: {},
      weightHistory: [
        { date: "2026-07-01", value: defaultWeight },
        { date: "2026-07-08", value: defaultWeight - 0.8 }
      ],
      waistHistory: [
        { date: "2026-07-01", value: defaultWaist },
        { date: "2026-07-08", value: defaultWaist - 0.5 }
      ],
      progressPhotos: [
        { date: "2026-07-01", url: "https://github.com/muzikmail2-arch/bb/blob/main/ChatGPT%20Image%20Jul%2017,%202026,%2011_49_31%20AM.png?raw=true", note: "Initial transformation baseline" }
      ],
      achievements: ["welcomed_to_shred"],
      streaks: {
        workoutStreak: 0,
        hydrationStreak: 0,
        runningStreak: 0
      },
      lemonCucumberCompleted: [],
      dailyChecklistHistory: {},
      reminders: {
        workout: true,
        water: true,
        running: true,
        meal: true,
        walk: true,
        hydration: true,
        lemonCucumber: true
      }
    };

    if (cached) {
      try {
        initialProgress = JSON.parse(cached);
      } catch (e) {
        console.warn("Could not parse cached program progress", e);
      }
    }

    // 2. Firestore integration load
    if (!isMockFirebase) {
      try {
        const docRef = doc(db, "belly_fat_shred_progress", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const dbData = docSnap.data() as BellyFatShredProgress;
          initialProgress = { ...initialProgress, ...dbData };
        }
      } catch (err) {
        console.error("Firestore progress load error:", err);
      }
    }

    // Apply daily resets for hydration
    if (initialProgress.lastHydrationReset !== todayStr) {
      // Archive yesterday's water to history
      if (initialProgress.waterIntake > 0) {
        initialProgress.hydrationHistory[initialProgress.lastHydrationReset] = initialProgress.waterIntake;
      }
      initialProgress.waterIntake = 0;
      initialProgress.lastHydrationReset = todayStr;
      
      // Calculate hydration streak
      const targetWater = user.gender?.toLowerCase() === "male" ? 4 : 3;
      let perfectStreak = initialProgress.streaks.hydrationStreak;
      // If yesterday was met, streak increment, else reset
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];
      const yesterdayAmount = initialProgress.hydrationHistory[yesterdayStr] || 0;
      if (yesterdayAmount >= targetWater) {
        perfectStreak += 1;
      } else {
        // If yesterday was completely missed, don't break yet if today is still active, but otherwise check
      }
      initialProgress.streaks.hydrationStreak = perfectStreak;
    }

    setProgress(initialProgress);
    setLoadingDb(false);
  };

  const syncProgress = async (updated: BellyFatShredProgress) => {
    if (!user) return;
    setProgress(updated);
    localStorage.setItem(`belly_fat_shred_progress_${user.uid}`, JSON.stringify(updated));

    if (!isMockFirebase) {
      setSavingDb(true);
      try {
        const docRef = doc(db, "belly_fat_shred_progress", user.uid);
        await setDoc(docRef, updated);
      } catch (err) {
        console.error("Error syncing belly fat progress:", err);
        handleFirestoreError(err, OperationType.WRITE, `belly_fat_shred_progress/${user.uid}`);
      } finally {
        setSavingDb(false);
      }
    }
  };

  if (!user || user.subscriptionStatus !== "premium" && user.role !== "admin") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white text-center">
        <div className="space-y-4 max-w-md">
          <AlertCircle className="w-12 h-12 text-[#D32F2F] mx-auto animate-bounce" />
          <h2 className="text-xl font-bold font-sans uppercase">Premium Access Required</h2>
          <p className="text-xs text-slate-400">
            Redirecting to the AlexFitnessHub Pricing & Upgrade module...
          </p>
        </div>
      </div>
    );
  }

  if (loadingDb || !progress) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white gap-3">
        <RefreshCw className="w-8 h-8 text-[#D32F2F] animate-spin" />
        <p className="text-xs font-mono tracking-widest text-slate-400 uppercase">
          Synthesizing Transformational Matrix...
        </p>
      </div>
    );
  }

  // Active workout definition
  const workoutInfo = getWorkoutForWeekAndDay(progress.currentWeek, progress.currentDay);

  // Check if today is Run Day (typically 3 times/week e.g. Days 2, 4, 6)
  const isRunScheduled = progress.currentDay % 2 === 0;
  // Check if Lemon Water is scheduled (3 times/week e.g. Days 1, 3, 5)
  const isLemonScheduled = progress.currentDay % 2 !== 0 && progress.currentDay <= 5;

  // Get current day's checklist state
  const dailyHabitState = progress.dailyChecklistHistory[todayStr] || {
    workout: progress.completedWorkouts.includes(`week_${progress.currentWeek}_day_${progress.currentDay}`),
    run: progress.completedRuns.includes(`week_${progress.currentWeek}_run_${progress.currentDay}`),
    water: progress.waterIntake >= (user.gender?.toLowerCase() === "male" ? 4 : 3),
    lemonCucumber: progress.lemonCucumberCompleted.includes(`week_${progress.currentWeek}_day_${progress.currentDay}`),
    mealWalks: progress.walkingHistory[todayStr] || { breakfast: false, lunch: false, dinner: false },
    healthyMeals: progress.nutritionChecklist[todayStr]?.eatenHealthy || false,
    sleep: false,
    stretch: false
  };

  const dailyScore = calculateHabitScore(dailyHabitState, isRunScheduled, isLemonScheduled);

  // Overall calculations
  const totalWeeks = 20;
  const totalDays = 140; // 20 weeks * 7 days
  const elapsedDays = ((progress.currentWeek - 1) * 7) + progress.currentDay - 1;
  const daysRemaining = totalDays - elapsedDays;
  const totalCompletedWorkouts = progress.completedWorkouts.length;
  const totalCompletedRuns = progress.completedRuns.length;
  const completionPercentage = Math.min(100, Math.round((elapsedDays / totalDays) * 100));

  // Hydro limit
  const waterTarget = user.gender?.toLowerCase() === "male" ? 4 : 3;
  const hydrationPercentage = Math.min(100, Math.round((progress.waterIntake / waterTarget) * 100));

  // Run stats
  const totalKmCompleted = totalCompletedRuns * 5; // assumes 5km run average

  // Achievements evaluation
  const checkStreaksAndUnlock = (current: BellyFatShredProgress) => {
    const updatedAchievements = [...current.achievements];
    const totalDone = current.completedWorkouts.length;
    
    if (totalDone >= 7 && !updatedAchievements.includes("7_day_shredder")) {
      updatedAchievements.push("7_day_shredder");
    }
    if (totalDone >= 30 && !updatedAchievements.includes("30_day_shredder")) {
      updatedAchievements.push("30_day_shredder");
    }
    if (totalDone >= 60 && !updatedAchievements.includes("60_day_shredder")) {
      updatedAchievements.push("60_day_shredder");
    }
    if (totalDone >= 90 && !updatedAchievements.includes("90_day_shredder")) {
      updatedAchievements.push("90_day_shredder");
    }
    if (totalDone >= 120 && !updatedAchievements.includes("120_day_shredder")) {
      updatedAchievements.push("120_day_shredder");
    }
    if (totalDone >= 150 && !updatedAchievements.includes("150_day_veteran")) {
      updatedAchievements.push("150_day_veteran");
    }

    return updatedAchievements;
  };

  // Workout Completion
  const handleToggleWorkout = () => {
    const wKey = `week_${progress.currentWeek}_day_${progress.currentDay}`;
    let nextWorkouts = [...progress.completedWorkouts];
    let isCompleted = false;

    if (nextWorkouts.includes(wKey)) {
      nextWorkouts = nextWorkouts.filter(w => w !== wKey);
    } else {
      nextWorkouts.push(wKey);
      isCompleted = true;
    }

    // Update Daily habits
    const habitsHistory = { ...progress.dailyChecklistHistory };
    const todayHabits = habitsHistory[todayStr] || { ...dailyHabitState };
    todayHabits.workout = isCompleted;
    habitsHistory[todayStr] = todayHabits;

    // Workout Streaks Logic
    let nextWorkoutStreak = progress.streaks.workoutStreak;
    if (isCompleted) {
      nextWorkoutStreak += 1;
    } else if (nextWorkoutStreak > 0) {
      nextWorkoutStreak -= 1;
    }

    const updated = {
      ...progress,
      completedWorkouts: nextWorkouts,
      dailyChecklistHistory: habitsHistory,
      streaks: {
        ...progress.streaks,
        workoutStreak: nextWorkoutStreak
      }
    };
    updated.achievements = checkStreaksAndUnlock(updated);
    syncProgress(updated);
  };

  // Run Completion
  const handleToggleRun = () => {
    const rKey = `week_${progress.currentWeek}_run_${progress.currentDay}`;
    let nextRuns = [...progress.completedRuns];
    let isCompleted = false;

    if (nextRuns.includes(rKey)) {
      nextRuns = nextRuns.filter(r => r !== rKey);
    } else {
      nextRuns.push(rKey);
      isCompleted = true;
    }

    // Update Daily habits
    const habitsHistory = { ...progress.dailyChecklistHistory };
    const todayHabits = habitsHistory[todayStr] || { ...dailyHabitState };
    todayHabits.run = isCompleted;
    habitsHistory[todayStr] = todayHabits;

    // Running Streak
    let nextRunningStreak = progress.streaks.runningStreak;
    if (isCompleted) nextRunningStreak += 1;

    const updated = {
      ...progress,
      completedRuns: nextRuns,
      dailyChecklistHistory: habitsHistory,
      streaks: {
        ...progress.streaks,
        runningStreak: nextRunningStreak
      }
    };
    syncProgress(updated);
  };

  // Lemon Water toggling
  const handleToggleLemonWater = () => {
    const lKey = `week_${progress.currentWeek}_day_${progress.currentDay}`;
    let nextLemons = [...progress.lemonCucumberCompleted];
    let isCompleted = false;

    if (nextLemons.includes(lKey)) {
      nextLemons = nextLemons.filter(l => l !== lKey);
    } else {
      nextLemons.push(lKey);
      isCompleted = true;
    }

    const habitsHistory = { ...progress.dailyChecklistHistory };
    const todayHabits = habitsHistory[todayStr] || { ...dailyHabitState };
    todayHabits.lemonCucumber = isCompleted;
    habitsHistory[todayStr] = todayHabits;

    const updated = {
      ...progress,
      lemonCucumberCompleted: nextLemons,
      dailyChecklistHistory: habitsHistory
    };
    syncProgress(updated);
  };

  // Water Drink Action
  const logWater = (amount: number) => {
    const nextWater = Math.max(0, parseFloat((progress.waterIntake + amount).toFixed(1)));
    
    const habitsHistory = { ...progress.dailyChecklistHistory };
    const todayHabits = habitsHistory[todayStr] || { ...dailyHabitState };
    todayHabits.water = nextWater >= waterTarget;
    habitsHistory[todayStr] = todayHabits;

    const hydroHistory = { ...progress.hydrationHistory };
    hydroHistory[todayStr] = nextWater;

    const updated = {
      ...progress,
      waterIntake: nextWater,
      hydrationHistory: hydroHistory,
      dailyChecklistHistory: habitsHistory
    };
    syncProgress(updated);
  };

  // Reset progress entirely to baseline
  const handleRestartProgram = () => {
    if (window.confirm("WARNING: Are you absolutely certain you want to reset all your 5-Month Belly Fat Shred program logs, stats, and achievements? This cannot be undone.")) {
      const restarted: BellyFatShredProgress = {
        userId: user.uid,
        currentWeek: 1,
        currentDay: 1,
        completedWorkouts: [],
        completedRuns: [],
        waterIntake: 0,
        lastHydrationReset: todayStr,
        hydrationHistory: {},
        walkingHistory: {},
        nutritionChecklist: {},
        weightHistory: [{ date: todayStr, value: defaultWeight }],
        waistHistory: [{ date: todayStr, value: defaultWaist }],
        progressPhotos: [],
        achievements: ["welcomed_to_shred"],
        streaks: { workoutStreak: 0, hydrationStreak: 0, runningStreak: 0 },
        lemonCucumberCompleted: [],
        dailyChecklistHistory: {},
        reminders: {
          workout: true,
          water: true,
          running: true,
          meal: true,
          walk: true,
          hydration: true,
          lemonCucumber: true
        }
      };
      syncProgress(restarted);
    }
  };

  // Daily Habits toggle
  const toggleDailyHabit = (key: keyof Omit<DailyHabits, "mealWalks">) => {
    const habitsHistory = { ...progress.dailyChecklistHistory };
    const todayHabits = habitsHistory[todayStr] || { ...dailyHabitState };
    
    // Toggle
    (todayHabits as any)[key] = !(todayHabits as any)[key];
    
    // Handle specific dual states
    if (key === "healthyMeals") {
      const nutritionMap = { ...progress.nutritionChecklist };
      nutritionMap[todayStr] = {
        eatenHealthy: todayHabits.healthyMeals,
        limitedAvoidFoods: nutritionMap[todayStr]?.limitedAvoidFoods || false
      };
      progress.nutritionChecklist = nutritionMap;
    }

    habitsHistory[todayStr] = todayHabits;
    const updated = {
      ...progress,
      dailyChecklistHistory: habitsHistory
    };
    syncProgress(updated);
  };

  // Meal Walks toggles
  const toggleMealWalk = (meal: "breakfast" | "lunch" | "dinner") => {
    const habitsHistory = { ...progress.dailyChecklistHistory };
    const todayHabits = habitsHistory[todayStr] || { ...dailyHabitState };
    
    const mealWalks = { ...todayHabits.mealWalks };
    mealWalks[meal] = !mealWalks[meal];
    todayHabits.mealWalks = mealWalks;

    const walkingMap = { ...progress.walkingHistory };
    walkingMap[todayStr] = mealWalks;

    habitsHistory[todayStr] = todayHabits;
    const updated = {
      ...progress,
      dailyChecklistHistory: habitsHistory,
      walkingHistory: walkingMap
    };
    syncProgress(updated);
  };

  // Next Day Progression
  const handleNextDay = () => {
    let nextDay = progress.currentDay + 1;
    let nextWeek = progress.currentWeek;
    
    if (nextDay > 7) {
      // Must complete 3 workouts of the week before unlocking the next week
      const currentWeekWorkouts = progress.completedWorkouts.filter(w => w.startsWith(`week_${progress.currentWeek}_`));
      if (currentWeekWorkouts.length < 3) {
        alert(`🔒 Progression Locked: You must complete at least 3 workouts from Week ${progress.currentWeek} before advancing to the next week.`);
        return;
      }
      nextDay = 1;
      nextWeek += 1;
    }

    if (nextWeek > 20) {
      alert("🏆 Incredibly job! You have fully finished the 5-Month Belly Fat Shred Program. Revisit any week to maintain your definition!");
      return;
    }

    const updated = {
      ...progress,
      currentWeek: nextWeek,
      currentDay: nextDay
    };
    syncProgress(updated);
  };

  const handlePrevDay = () => {
    let prevDay = progress.currentDay - 1;
    let prevWeek = progress.currentWeek;

    if (prevDay < 1) {
      if (prevWeek > 1) {
        prevWeek -= 1;
        prevDay = 7;
      } else {
        return; // already at week 1 day 1
      }
    }

    const updated = {
      ...progress,
      currentWeek: prevWeek,
      currentDay: prevDay
    };
    syncProgress(updated);
  };

  // Add weight
  const handleLogWeight = () => {
    const parsed = parseFloat(logWeightVal);
    if (isNaN(parsed) || parsed <= 0) return;
    const nextWeightHistory = [...progress.weightHistory, { date: todayStr, value: parsed }];
    const updated = {
      ...progress,
      weightHistory: nextWeightHistory
    };
    syncProgress(updated);
    setLogWeightVal("");
    alert("Weight successfully logged to trajectory index!");
  };

  // Add waist
  const handleLogWaist = () => {
    const parsed = parseFloat(logWaistVal);
    if (isNaN(parsed) || parsed <= 0) return;
    const nextWaistHistory = [...progress.waistHistory, { date: todayStr, value: parsed }];
    const updated = {
      ...progress,
      waistHistory: nextWaistHistory
    };
    syncProgress(updated);
    setLogWaistVal("");
    alert("Waist measurement successfully logged to metrics!");
  };

  // Simulate progress photo uploading
  const handleLogPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logPhotoUrl) return;
    const nextPhotos = [
      ...progress.progressPhotos,
      {
        date: todayStr,
        url: logPhotoUrl,
        note: logPhotoNote || "Transformation update"
      }
    ];
    const updated = {
      ...progress,
      progressPhotos: nextPhotos
    };
    syncProgress(updated);
    setLogPhotoUrl("");
    setLogPhotoNote("");
    setShowPhotoModal(false);
  };

  // Toggle Reminder Checkboxes
  const toggleReminder = (key: keyof BellyFatShredProgress["reminders"]) => {
    const nextReminders = { ...progress.reminders };
    nextReminders[key] = !nextReminders[key];
    const updated = {
      ...progress,
      reminders: nextReminders
    };
    syncProgress(updated);
  };

  // Static motivation messages matching current elapsed week
  const getMotivationalMessage = () => {
    const messages = [
      "Small actions every day create extraordinary results. Embrace the baseline phase.",
      "You are stronger than yesterday. Compound movements are training your metabolic engine.",
      "Discipline beats motivation. Sweat is just fat crying in silence.",
      "Consistency is the magic key. Spot reduction is a myth, but overall definition is inevitable.",
      "Caloric deficit combined with heavy resistance creates deep muscle tone.",
      "Hydration is fuel. Clean cucumber water optimizes hepatic detoxification pathways.",
      "Your abs are starting to tighten. Keep logging your steps and core compressions.",
      "Midpoint milestones! Complete every run to elevate aerobic threshold.",
      "Patience. Visceral fat is the first to form, but consistent deficit melts it permanently.",
      "Stay relentless. Your weekly performance score is setting high-altitude benchmarks.",
      "No shortcuts. Every burpee and treadmill step compounds into absolute luxury physics.",
      "Lean protein builds the scaffolding. Eliminate processed sugars, defend your discipline.",
      "70 days of deep commitment. Your waist measurements reflect supreme physical control.",
      "Sleep and recovery are non-negotiable. 8 hours of sleep regulates ghrelin and leptin.",
      "Advanced phase initiated. High power output intervals are pushing peak definitions.",
      "Defeat fatigue. You have unlocked ultimate cardiac resilience.",
      "The finish line is glowing. Your consistency score is elite.",
      "A complete abdominal sculpture is appearing. Keep drinking pure water and walking post-meal.",
      "Unbelievable stamina. You are operating at professional coach levels of performance.",
      "The 5-Month transformation is absolute. A testament to deep athletic discipline!"
    ];
    return messages[Math.min(messages.length - 1, progress.currentWeek - 1)];
  };

  return (
    <div className="bg-white text-slate-900 min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Luxury Header Card */}
      <div className="max-w-7xl mx-auto mb-8 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Cinematic Hero Image Background */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <img
            src="/src/assets/images/belly_shred_hero_1784283617530.jpg"
            alt="Belly Shred Program Hero Background"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-100 object-center md:object-right filter brightness-125 contrast-110 saturate-105"
          />
        </div>

        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Shield className="w-40 h-40 text-[#D32F2F] stroke-[1]" />
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10 bg-white/95 backdrop-blur-md p-6 rounded-2xl border border-slate-200 shadow-lg">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-black text-[#D32F2F] tracking-widest uppercase bg-[#D32F2F]/10 border border-[#D32F2F]/20 px-3 py-1 rounded-full">
                ★ PREMIUM COACHING MODULE
              </span>
              <span className="text-[10px] font-mono font-black text-amber-600 tracking-widest uppercase bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full animate-pulse">
                👑 ACTIVE
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight uppercase font-display text-slate-950">
              5 Month <span className="text-[#D32F2F]">Belly Fat Shred</span>
            </h1>
            <p className="text-xs text-slate-700 max-w-xl leading-relaxed font-semibold">
              An elite, scientifically-validated program combining progressive whole-body metabolic conditioning, 
              hiit intervals, targeted core compression, post-meal thermal walks, and high-fidelity hydration tracking.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => setView("dashboard")} 
              className="px-4 py-2 border border-[#D32F2F] text-[#D32F2F] hover:bg-[#D32F2F] hover:text-white rounded-xl text-xs transition font-bold cursor-pointer bg-white"
            >
              Main Dashboard
            </button>
            <button 
              onClick={handleRestartProgram} 
              className="px-4 py-2 bg-slate-50 text-slate-700 hover:text-[#D32F2F] border border-slate-200 hover:border-[#D32F2F] rounded-xl text-xs transition font-mono uppercase cursor-pointer"
            >
              Restart Program
            </button>
          </div>
        </div>

        {/* Horizontal Quick Progress Bar */}
        <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
          <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800/50">
            <span className="text-[10px] text-slate-500 font-mono uppercase">Current Period</span>
            <div className="text-xl font-black text-white uppercase mt-1">
              Week {progress.currentWeek} <span className="text-slate-500 text-xs font-normal">/ 20</span>
            </div>
            <p className="text-[10px] text-[#D32F2F] font-semibold uppercase mt-1">Day {progress.currentDay} of 7</p>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800/50">
            <span className="text-[10px] text-slate-500 font-mono uppercase">Program Completion</span>
            <div className="text-xl font-black text-white mt-1">
              {completionPercentage}%
            </div>
            {/* Miniature progress bar */}
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-[#D32F2F] h-full" style={{ width: `${completionPercentage}%` }}></div>
            </div>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800/50">
            <span className="text-[10px] text-slate-500 font-mono uppercase">Days Remaining</span>
            <div className="text-xl font-black text-white mt-1">
              {daysRemaining} <span className="text-xs text-slate-500 font-normal">/ 140</span>
            </div>
            <p className="text-[10px] text-emerald-500 font-semibold uppercase mt-1">{elapsedDays} days completed</p>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800/50">
            <span className="text-[10px] text-slate-500 font-mono uppercase">Daily Integrity</span>
            <div className="text-xl font-black text-white mt-1">
              {dailyScore} <span className="text-slate-500 text-xs font-normal">/ 100</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-emerald-500 h-full" style={{ width: `${dailyScore}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Motivation Banner */}
      <div className="max-w-7xl mx-auto mb-8 bg-[#D32F2F]/5 border border-[#D32F2F]/20 rounded-2xl p-4 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-[#D32F2F] shrink-0 mt-0.5" />
        <div>
          <span className="text-[9px] font-mono font-black text-[#D32F2F] uppercase tracking-wider block">COACH BRIEFING:</span>
          <p className="text-xs text-slate-300 font-medium italic mt-1 leading-relaxed">
            "{getMotivationalMessage()}"
          </p>
        </div>
      </div>

      {/* Main Switchboard Navigation Tabs */}
      <div className="max-w-7xl mx-auto mb-8 border-b border-slate-800 overflow-x-auto flex gap-1 scrollbar-none">
        {[
          { id: "dashboard", label: "My Board", icon: Trophy },
          { id: "workouts", label: "Workouts", icon: Dumbbell },
          { id: "running", label: "Cardio", icon: Footprints },
          { id: "nutrition", label: "Nutrition Guide", icon: Apple },
          { id: "analytics", label: "Analytics", icon: LineChart },
          { id: "coaching", label: "Reminders Desk", icon: Bell }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-3.5 px-5 text-xs font-black uppercase tracking-wider border-b-2 transition whitespace-nowrap cursor-pointer ${
                isActive 
                  ? "border-[#D32F2F] text-[#D32F2F] bg-slate-900/30" 
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Switchboard Content Container */}
      <div className="max-w-7xl mx-auto min-h-[500px]">
        
        {/* TAB 1: THE ACTIVE BOARD & DAILY CHECKLIST */}
        {activeTab === "dashboard" && (
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Left Column: Today's Action Center */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Day Switcher and Workout brief */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                  <div>
                    <span className="text-[9px] font-mono text-slate-500 uppercase">CALENDAR MATRIX</span>
                    <h2 className="text-lg font-black uppercase text-white font-display mt-0.5">
                      Active Period: W{progress.currentWeek} D{progress.currentDay}
                    </h2>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handlePrevDay} 
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-mono font-black px-2 text-slate-300">
                      DAY {progress.currentDay} / 7
                    </span>
                    <button 
                      onClick={handleNextDay} 
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Workout Briefing */}
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#D32F2F]/10 text-[#D32F2F] rounded-xl flex items-center justify-center font-bold">
                        {workoutInfo.difficulty === "Beginner" ? "B" : workoutInfo.difficulty === "Intermediate" ? "I" : "A"}
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-[#D32F2F] bg-[#D32F2F]/10 px-2 py-0.5 rounded uppercase">
                          {workoutInfo.phase}
                        </span>
                        <h3 className="text-sm font-black uppercase text-white mt-1 leading-tight">
                          {workoutInfo.title}
                        </h3>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 text-xs">
                      <div>
                        <span className="text-[9px] text-slate-500 block font-mono uppercase">Duration</span>
                        <span className="font-bold text-slate-200">{workoutInfo.duration}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 block font-mono uppercase">Difficulty</span>
                        <span className="font-bold text-slate-200">{workoutInfo.difficulty}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 block font-mono uppercase">Burn</span>
                        <span className="font-bold text-slate-200">{workoutInfo.calBurn.split(" ")[0]} kcal</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    Every training session is meticulously designed to create a total caloric deficit. 
                    This workout target includes <strong>{workoutInfo.exercisesList.join(", ")}</strong>, 
                    concluding with an incline interval walk to stimulate visceral fat mobilization.
                  </p>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleToggleWorkout}
                      className={`flex-1 py-3 px-5 rounded-xl font-sans font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer ${
                        dailyHabitState.workout
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                          : "bg-[#D32F2F] hover:bg-[#B71C1C] text-white"
                      }`}
                    >
                      {dailyHabitState.workout ? (
                        <>
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>Workout Completed</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-current" />
                          <span>Mark Workout Completed</span>
                        </>
                      )}
                    </button>

                    <button 
                      onClick={() => setActiveTab("workouts")} 
                      className="px-5 py-3 border border-slate-700 hover:border-slate-500 text-xs font-bold uppercase tracking-wider rounded-xl transition cursor-pointer"
                    >
                      View Drills
                    </button>
                  </div>
                </div>
              </div>

              {/* Interactive Daily Habit Checklist */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                  <div>
                    <span className="text-[9px] font-mono text-slate-500 uppercase">CALORIC DEFICIT LOGS</span>
                    <h2 className="text-lg font-black uppercase text-white font-display mt-0.5">
                      Daily Checklist
                    </h2>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-500 uppercase">
                    DAILY SCORE: {dailyScore}%
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  
                  {/* Workout Habit Card */}
                  <div 
                    onClick={handleToggleWorkout}
                    className={`p-4 rounded-2xl border transition duration-150 cursor-pointer flex items-center justify-between select-none ${
                      dailyHabitState.workout 
                        ? "bg-emerald-950/20 border-emerald-500/30 text-white" 
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${dailyHabitState.workout ? "bg-emerald-500/10 text-emerald-500" : "bg-slate-900 text-slate-500"}`}>
                        <Dumbbell className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black uppercase leading-tight">Workout Completed</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">Today's active session</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${dailyHabitState.workout ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-700"}`}>
                      {dailyHabitState.workout && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  {/* 5KM Run Card */}
                  <div 
                    onClick={handleToggleRun}
                    className={`p-4 rounded-2xl border transition duration-150 cursor-pointer flex items-center justify-between select-none ${
                      dailyHabitState.run 
                        ? "bg-emerald-950/20 border-emerald-500/30 text-white" 
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${dailyHabitState.run ? "bg-emerald-500/10 text-emerald-500" : "bg-slate-900 text-slate-500"}`}>
                        <Footprints className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black uppercase leading-tight">3-5 KM Run Plan</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {isRunScheduled ? "⚡ Scheduled Today" : "Rest or Active Walk"}
                        </p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${dailyHabitState.run ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-700"}`}>
                      {dailyHabitState.run && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  {/* Hydration Card */}
                  <div 
                    onClick={() => logWater(1.0)}
                    className={`p-4 rounded-2xl border transition duration-150 cursor-pointer flex items-center justify-between select-none ${
                      dailyHabitState.water 
                        ? "bg-emerald-950/20 border-emerald-500/30 text-white" 
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${dailyHabitState.water ? "bg-emerald-500/10 text-emerald-500" : "bg-slate-900 text-slate-500"}`}>
                        <Droplets className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black uppercase leading-tight">Drink Sufficient Water</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">{progress.waterIntake}L / {waterTarget}L Consumed</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${dailyHabitState.water ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-700"}`}>
                      {dailyHabitState.water && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  {/* Cucumber Lemon Card */}
                  <div 
                    onClick={handleToggleLemonWater}
                    className={`p-4 rounded-2xl border transition duration-150 cursor-pointer flex items-center justify-between select-none ${
                      dailyHabitState.lemonCucumber 
                        ? "bg-emerald-950/20 border-emerald-500/30 text-white" 
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${dailyHabitState.lemonCucumber ? "bg-emerald-500/10 text-emerald-500" : "bg-slate-900 text-slate-500"}`}>
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black uppercase leading-tight">Lemon Cucumber Routine</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {isLemonScheduled ? "⚡ Scheduled Today" : "Bonus Hydration"}
                        </p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${dailyHabitState.lemonCucumber ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-700"}`}>
                      {dailyHabitState.lemonCucumber && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  {/* Healthy Meals */}
                  <div 
                    onClick={() => toggleDailyHabit("healthyMeals")}
                    className={`p-4 rounded-2xl border transition duration-150 cursor-pointer flex items-center justify-between select-none ${
                      dailyHabitState.healthyMeals 
                        ? "bg-emerald-950/20 border-emerald-500/30 text-white" 
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${dailyHabitState.healthyMeals ? "bg-emerald-500/10 text-emerald-500" : "bg-slate-900 text-slate-500"}`}>
                        <Apple className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black uppercase leading-tight">Healthy Meals Only</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">Defended calorie-deficit plan</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${dailyHabitState.healthyMeals ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-700"}`}>
                      {dailyHabitState.healthyMeals && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  {/* Sleep Habit */}
                  <div 
                    onClick={() => toggleDailyHabit("sleep")}
                    className={`p-4 rounded-2xl border transition duration-150 cursor-pointer flex items-center justify-between select-none ${
                      dailyHabitState.sleep 
                        ? "bg-emerald-950/20 border-emerald-500/30 text-white" 
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${dailyHabitState.sleep ? "bg-emerald-500/10 text-emerald-500" : "bg-slate-900 text-slate-500"}`}>
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black uppercase leading-tight">Sleep 7 - 9 Hours</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">Crucial for fat-burning hormones</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${dailyHabitState.sleep ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-700"}`}>
                      {dailyHabitState.sleep && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  {/* Stretching completed */}
                  <div 
                    onClick={() => toggleDailyHabit("stretch")}
                    className={`p-4 rounded-2xl border transition duration-150 cursor-pointer flex items-center justify-between select-none ${
                      dailyHabitState.stretch 
                        ? "bg-emerald-950/20 border-emerald-500/30 text-white" 
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${dailyHabitState.stretch ? "bg-emerald-500/10 text-emerald-500" : "bg-slate-900 text-slate-500"}`}>
                        <Activity className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black uppercase leading-tight">Mobility / Stretch</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">Soreness reduction and alignment</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${dailyHabitState.stretch ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-700"}`}>
                      {dailyHabitState.stretch && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>

                </div>

                {/* Sub-section: Walks After Meal Habits */}
                <div className="mt-6 pt-6 border-t border-slate-800">
                  <h3 className="text-xs font-black uppercase tracking-wider text-white mb-3 flex items-center gap-2">
                    <Footprints className="w-4 h-4 text-emerald-400" />
                    <span>Post-Meal Thermal Walks (10-20 mins)</span>
                  </h3>
                  
                  <div className="grid grid-cols-3 gap-3">
                    {["breakfast", "lunch", "dinner"].map((meal) => {
                      const done = (dailyHabitState.mealWalks as any)[meal];
                      return (
                        <button
                          key={meal}
                          onClick={() => toggleMealWalk(meal as any)}
                          className={`py-3 px-3 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${
                            done
                              ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-400"
                              : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                          }`}
                        >
                          <span className="block font-black uppercase">{meal}</span>
                          <span className="text-[8px] font-normal text-slate-500 block mt-0.5">
                            {done ? "Completed" : "Not Done"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>

            {/* Right Column: Hydration Dashboard & Streaks */}
            <div className="space-y-8">
              
              {/* Daily Hydration Progress Ring card */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md text-center">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mb-1">HYDRATION TRACKER</span>
                <h3 className="text-sm font-black uppercase text-white font-display mb-4">Daily Fluid Balance</h3>
                
                {/* SVG Progress Ring */}
                <div className="relative w-36 h-36 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="72" cy="72" r="60" className="stroke-slate-800 fill-none" strokeWidth="8" />
                    <circle 
                      cx="72" 
                      cy="72" 
                      r="60" 
                      className="stroke-[#D32F2F] fill-none transition-all duration-300" 
                      strokeWidth="8" 
                      strokeDasharray="377" 
                      strokeDashoffset={377 - (377 * hydrationPercentage) / 100}
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-black text-white">{progress.waterIntake}L</span>
                    <span className="text-[9px] text-slate-400 uppercase font-mono">Target {waterTarget}L</span>
                  </div>
                </div>

                <div className="flex gap-2 justify-center mb-6">
                  <button 
                    onClick={() => logWater(0.25)} 
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-mono font-bold rounded-xl transition cursor-pointer"
                  >
                    +250ml
                  </button>
                  <button 
                    onClick={() => logWater(0.5)} 
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-mono font-bold rounded-xl transition cursor-pointer"
                  >
                    +500ml
                  </button>
                  <button 
                    onClick={() => logWater(1.0)} 
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-mono font-bold rounded-xl transition cursor-pointer"
                  >
                    +1.0L
                  </button>
                  <button 
                    onClick={() => logWater(-0.5)} 
                    className="p-2 bg-slate-800/50 hover:bg-slate-800 text-slate-500 hover:text-slate-300 text-[10px] font-mono font-bold rounded-xl transition cursor-pointer"
                  >
                    -500ml
                  </button>
                </div>

                {/* Hydro stat summaries */}
                <div className="grid grid-cols-2 gap-2 text-left pt-4 border-t border-slate-800/60">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-[9px] text-slate-500 font-mono uppercase block">Perfect Streak</span>
                    <span className="text-xs font-black text-white uppercase">{progress.streaks.hydrationStreak} Days</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-[9px] text-slate-500 font-mono uppercase block">Lemon routine</span>
                    <span className="text-xs font-black text-white uppercase">{progress.lemonCucumberCompleted.length} Completed</span>
                  </div>
                </div>
              </div>

              {/* Lemon & Cucumber Water Routine Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <Sparkles className="w-16 h-16 text-emerald-400" />
                </div>
                
                <span className="text-[9px] font-mono text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider inline-block">
                  CUCUMBER-LEMON DETOX DESK
                </span>
                
                <h4 className="text-sm font-black uppercase text-white mt-3 font-display">
                  Weekly Refresh Routine (3x/Week)
                </h4>
                
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                  Combine <strong>2 Liters of water</strong> with fresh organic cucumber slices and fresh lemon slices. 
                  Let it sit overnight to infuse. Drink throughout the day to satisfy your hydration metrics.
                </p>

                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 mt-4 space-y-2">
                  <span className="text-[9px] text-slate-500 font-mono uppercase block border-b border-slate-800 pb-1.5">HYDRATION BENEFITS:</span>
                  <div className="flex gap-2 items-start text-[10px] text-slate-300">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Supports Hydration:</strong> Encourages steady drinking patterns.</span>
                  </div>
                  <div className="flex gap-2 items-start text-[10px] text-slate-300">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Refreshing Taste:</strong> Substitutes boring water with clean flavor notes.</span>
                  </div>
                  <div className="flex gap-2 items-start text-[10px] text-slate-400 italic">
                    <Info className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span>Note: This is not an active fat-burning potion. Overall caloric deficit is what triggers real abdominal fat mobilization.</span>
                  </div>
                </div>

                <button
                  onClick={handleToggleLemonWater}
                  className={`w-full py-3 rounded-xl text-xs font-black uppercase mt-4 tracking-wider flex items-center justify-center gap-2 transition cursor-pointer ${
                    dailyHabitState.lemonCucumber
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                  }`}
                >
                  {dailyHabitState.lemonCucumber ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Incline Infusion Logged</span>
                    </>
                  ) : (
                    <span>Check off Infusion Drank Today</span>
                  )}
                </button>
              </div>

              {/* Achievements & Badges checklist */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mb-1">STREAKS & GOALS</span>
                <h3 className="text-sm font-black uppercase text-white font-display mb-4">Achievements</h3>
                
                <div className="space-y-3">
                  {[
                    { id: "welcomed_to_shred", title: "Shred Cadet", desc: "Initiate the 5-Month Program baseline", goal: 1 },
                    { id: "7_day_shredder", title: "Metabolic Crusader", desc: "Log 7 workouts of overall deficit", goal: 7 },
                    { id: "30_day_shredder", title: "Deficit General", desc: "Complete 30 progressive sessions", goal: 30 },
                    { id: "60_day_shredder", title: "Thermal Knight", desc: "Complete 60 workouts with post-walks", goal: 60 },
                    { id: "90_day_shredder", title: "Visceral Exorcist", desc: "Survive 90 high intensity drills", goal: 90 },
                    { id: "120_day_shredder", title: "Anatomy Alchemist", desc: "Synthesize 120 total workouts", goal: 120 },
                    { id: "150_day_veteran", title: "Belly Shred Elite", desc: "Complete 150 days of peak fat loss", goal: 150 }
                  ].map((ach) => {
                    const unlocked = progress.achievements.includes(ach.id);
                    return (
                      <div 
                        key={ach.id} 
                        className={`p-3 rounded-xl border flex items-center gap-3 transition ${
                          unlocked 
                            ? "bg-amber-500/10 border-amber-500/20 text-white" 
                            : "bg-slate-950/50 border-slate-800 text-slate-600"
                        }`}
                      >
                        <Trophy className={`w-5 h-5 ${unlocked ? "text-amber-500 animate-pulse" : "text-slate-700"}`} />
                        <div>
                          <h5 className="text-xs font-black uppercase leading-none">{ach.title}</h5>
                          <p className="text-[9px] text-slate-500 mt-1 leading-tight">{ach.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: DETAILED WORKOUT SCHEDULE */}
        {activeTab === "workouts" && (
          <div className="space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
              <span className="text-[9px] font-mono text-[#D32F2F] uppercase block tracking-widest mb-1">METABOLIC PROGRAMMING</span>
              <h2 className="text-2xl font-black uppercase text-white font-display">Active Routine Architecture</h2>
              <p className="text-xs text-slate-400 mt-2 max-w-xl">
                Difficulty increases dynamically every month. Follow the structural progression to mobilize body fat and prevent physical plateau.
              </p>

              {/* Progress switcher */}
              <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-6 border-t border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400">Current Phase:</span>
                  <span className="text-xs font-black uppercase tracking-wider text-white bg-[#D32F2F]/15 border border-[#D32F2F]/30 px-3 py-1 rounded-full">
                    {workoutInfo.phase}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-slate-500">Day:</span>
                  <button 
                    onClick={handlePrevDay} 
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded font-bold cursor-pointer"
                  >
                    Prev
                  </button>
                  <span className="text-white font-black px-2">W{progress.currentWeek} D{progress.currentDay}</span>
                  <button 
                    onClick={handleNextDay} 
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded font-bold cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

            {/* Workout Bento Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Routine structure card */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Dynamic workout layout */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
                  <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                    <div>
                      <h3 className="text-lg font-black uppercase text-white font-display leading-tight">
                        {workoutInfo.title}
                      </h3>
                      <p className="text-[10px] text-slate-500 mt-1 uppercase font-mono">
                        Estimating {workoutInfo.calBurn} • 3-4 sessions/week
                      </p>
                    </div>
                    
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                      {workoutInfo.difficulty} Drill
                    </span>
                  </div>

                  {/* Warmup */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase text-[#D32F2F] tracking-widest flex items-center gap-2 font-display">
                      <span>01. Warm-Up Mobility (5-8 Mins)</span>
                    </h4>
                    <ul className="grid sm:grid-cols-2 gap-2 text-xs text-slate-300">
                      {workoutInfo.warmup.map((drill, idx) => (
                        <li key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex items-center gap-2">
                          <span className="text-[#D32F2F] font-black">✔</span>
                          <span>{drill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Midsection stability */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase text-[#D32F2F] tracking-widest flex items-center gap-2 font-display">
                      <span>02. Midsection Compression (10 Mins)</span>
                    </h4>
                    <ul className="grid sm:grid-cols-2 gap-2 text-xs text-slate-300">
                      {workoutInfo.core.map((drill, idx) => (
                        <li key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex items-center gap-2">
                          <span className="text-[#D32F2F] font-black">✔</span>
                          <span>{drill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* HIIT intervals */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase text-[#D32F2F] tracking-widest flex items-center gap-2 font-display">
                      <span>03. Metabolic HIIT Intervals (15-20 Mins)</span>
                    </h4>
                    <ul className="grid sm:grid-cols-2 gap-2 text-xs text-slate-300">
                      {workoutInfo.hiit.map((drill, idx) => (
                        <li key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex items-center gap-2">
                          <span className="text-[#D32F2F] font-black">✔</span>
                          <span>{drill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Strength */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase text-[#D32F2F] tracking-widest flex items-center gap-2 font-display">
                      <span>04. Compound Overload Strength (20 Mins)</span>
                    </h4>
                    <ul className="grid sm:grid-cols-2 gap-2 text-xs text-slate-300">
                      {workoutInfo.strength.map((drill, idx) => (
                        <li key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex items-center gap-2">
                          <span className="text-[#D32F2F] font-black">✔</span>
                          <span>{drill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Incline walk finisher */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase text-[#D32F2F] tracking-widest flex items-center gap-2 font-display">
                      <span>05. Full-Body Finisher & 12-3-30 (15-45 Mins)</span>
                    </h4>
                    <ul className="grid sm:grid-cols-2 gap-2 text-xs text-slate-300">
                      {workoutInfo.fullBodyCircuit.map((drill, idx) => (
                        <li key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex items-center gap-2">
                          <span className="text-[#D32F2F] font-black">✔</span>
                          <span>{drill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Cooldown */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase text-[#D32F2F] tracking-widest flex items-center gap-2 font-display">
                      <span>06. Recovery Cooldown (5 Mins)</span>
                    </h4>
                    <ul className="grid sm:grid-cols-2 gap-2 text-xs text-slate-300">
                      {workoutInfo.cooldown.map((drill, idx) => (
                        <li key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex items-center gap-2">
                          <span className="text-[#D32F2F] font-black">✔</span>
                          <span>{drill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

              </div>

              {/* Modifications & Intensity Scaling panel */}
              <div className="space-y-6">
                
                {/* Target modifications */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                  <h3 className="text-sm font-black uppercase text-white font-display border-b border-slate-800 pb-3">
                    Intensity Modifications
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/60">
                      <span className="text-[9px] font-mono font-black text-slate-400 bg-slate-900 px-2.5 py-0.5 rounded uppercase">
                        Beginner Tuning
                      </span>
                      <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">
                        {workoutInfo.modifications.beginner}
                      </p>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/60">
                      <span className="text-[9px] font-mono font-black text-sky-400 bg-sky-900/10 px-2.5 py-0.5 rounded uppercase">
                        Intermediate Tuning
                      </span>
                      <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">
                        {workoutInfo.modifications.intermediate}
                      </p>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/60">
                      <span className="text-[9px] font-mono font-black text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded uppercase">
                        Advanced Tuning
                      </span>
                      <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">
                        {workoutInfo.modifications.advanced}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Science of overall deficit */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                  <h3 className="text-sm font-black uppercase text-white font-display border-b border-slate-800 pb-3 flex items-center gap-2">
                    <Info className="w-4 h-4 text-[#D32F2F]" />
                    <span>Scientific Fact Check</span>
                  </h3>
                  
                  <p className="text-[11px] text-slate-400 leading-relaxed mt-3">
                    <strong>Can you target belly fat directly?</strong> No, localized fat mobilization (spot reduction) is a physiological myth. 
                    Lipolysis is systemic. Fatty acids are released from adipose tissue pools throughout the body during a caloric deficit. 
                    Consistent compound exercises and high incline walks elevate your daily energy expenditure, pulling down overall fat percentages, 
                    which over time permanently reduces abdominal/visceral layers.
                  </p>
                </div>

              </div>

            </div>

            {/* Secure Premium Program Vault from API */}
            {premiumProgramContent ? (
              <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 mt-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                  <Shield className="w-48 h-48 text-amber-500" />
                </div>
                
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
                  <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                    <Trophy className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-black text-amber-500 uppercase tracking-widest">
                      🔒 SECURE PREMIUM PROGRAM DATA VAULT
                    </span>
                    <h3 className="text-xl font-black uppercase text-white font-display mt-0.5">
                      {premiumProgramContent.programName || "5-Month Belly Fat Shred Program"}
                    </h3>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {/* Column 1: Scientific Framework */}
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/80 space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      Scientific Deficit Matrix
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {premiumProgramContent.scientificFramework?.spotReductionMyth}
                    </p>
                    <div className="space-y-3 pt-2">
                      <span className="text-[10px] font-mono text-slate-500 uppercase font-black block">
                        5-Month Strategic Milestones
                      </span>
                      {premiumProgramContent.scientificFramework?.phases?.map((p: any) => (
                        <div key={p.phase} className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/40 text-[11px]">
                          <span className="font-mono font-black text-amber-500 block mb-0.5">
                            Phase {p.phase}: {p.title}
                          </span>
                          <span className="text-slate-400">{p.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Column 2: Elite Workouts */}
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/80 space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      Elite Circuit Protocols
                    </h4>
                    <div className="space-y-4">
                      {premiumProgramContent.eliteWorkouts?.map((w: any) => (
                        <div key={w.id} className="p-4 bg-slate-900/60 rounded-xl border border-slate-800/40 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-black text-white">{w.name}</span>
                            <span className="text-[10px] font-mono text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">
                              {w.duration}
                            </span>
                          </div>
                          <div className="space-y-2 pt-1 border-t border-slate-800/60">
                            {w.exercises?.map((ex: any, idx: number) => (
                              <div key={idx} className="text-[10px] text-slate-400">
                                <span className="font-mono text-white block">
                                  {ex.name} — {ex.sets}x{ex.reps}
                                </span>
                                <span className="text-slate-500 italic">{ex.instructions}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Column 3: Secret Hacks */}
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/80 space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      Thermodynamic Coaching Hacks
                    </h4>
                    <div className="space-y-4">
                      {premiumProgramContent.secretHacks?.map((hack: any, idx: number) => (
                        <div key={idx} className="p-4 bg-slate-900/60 rounded-xl border border-slate-800/40 space-y-2">
                          <span className="text-xs font-black text-amber-500 block">
                            💡 {hack.title}
                          </span>
                          <p className="text-[11px] text-slate-400 leading-relaxed">
                            {hack.details}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : fetchingPremiumContent ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center gap-3 mt-8">
                <RefreshCw className="w-6 h-6 text-amber-500 animate-spin" />
                <span className="text-xs font-mono text-slate-400">
                  Authorizing Token Credentials & Decrypting Program Module...
                </span>
              </div>
            ) : null}

          </div>
        )}

        {/* TAB 3: RUNNING PLAN */}
        {activeTab === "running" && (
          <div className="space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
              <span className="text-[9px] font-mono text-[#D32F2F] uppercase block tracking-widest mb-1">CARDIOVASCULAR METRICS</span>
              <h2 className="text-2xl font-black uppercase text-white font-display">Aerobic Running Protocol</h2>
              <p className="text-xs text-slate-400 mt-2 max-w-xl">
                Frequency: 2 to 3 sessions every week. Target distance: 3 to 5 Kilometer continuous run. Mark each session to maintain weekly statistics.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <span className="text-[9px] text-slate-500 font-mono uppercase block">Total Completed</span>
                  <span className="text-xl font-black text-white mt-1 block">{totalCompletedRuns} Runs</span>
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <span className="text-[9px] text-slate-500 font-mono uppercase block">Total Distance</span>
                  <span className="text-xl font-black text-[#D32F2F] mt-1 block">{totalKmCompleted} KM</span>
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <span className="text-[9px] text-slate-500 font-mono uppercase block">Weekly Average</span>
                  <span className="text-xl font-black text-white mt-1 block">{(totalCompletedRuns / Math.max(1, progress.currentWeek)).toFixed(1)} / Wk</span>
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <span className="text-[9px] text-slate-500 font-mono uppercase block">Streak Score</span>
                  <span className="text-xl font-black text-emerald-500 mt-1 block">{progress.streaks.runningStreak} Runs</span>
                </div>
              </div>
            </div>

            {/* Cardio logs layout */}
            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Target active run panel */}
              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-sm font-black uppercase text-white font-display">
                      Today's Cardio Assignment: W{progress.currentWeek} Day {progress.currentDay}
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-1 uppercase font-mono">
                      {isRunScheduled ? "★ ACTIVE RUN SCHEDULED TODAY" : "Active Walk / Rest Day"}
                    </p>
                  </div>
                  
                  <span className="text-xs font-bold text-slate-300">
                    3 - 5 KM TARGET
                  </span>
                </div>

                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    Aim for a sustained, steady-state zone 2 aerobic exertion (typically 65-75% of maximum heart rate). 
                    This zone maximizes lipid utilization relative to glycogen, protecting active muscle mass while expanding daily caloric output.
                  </p>
                  
                  <ul className="space-y-1.5 text-[11px] text-slate-400">
                    <li className="flex gap-2 items-center">
                      <span className="text-emerald-500">✓</span>
                      <span>Target: Maintain continuous breathing (conversational pace).</span>
                    </li>
                    <li className="flex gap-2 items-center">
                      <span className="text-emerald-500">✓</span>
                      <span>Cadence: Stay light on feet, strike mid-foot to prevent joint stress.</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={handleToggleRun}
                  className={`w-full py-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer ${
                    dailyHabitState.run
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-[#D32F2F] hover:bg-[#B71C1C] text-white"
                  }`}
                >
                  {dailyHabitState.run ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>3-5 KM Run Completed</span>
                    </>
                  ) : (
                    <span>Check off today's 3-5 KM Run</span>
                  )}
                </button>
              </div>

              {/* Running checklist / history log */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                <h3 className="text-sm font-black uppercase text-white font-display border-b border-slate-800 pb-3">
                  Run Progression Log
                </h3>
                
                <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                  {progress.completedRuns.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-500 italic">
                      No runs logged yet. Put on your trainers and hit the track!
                    </div>
                  ) : (
                    progress.completedRuns.map((runKey, idx) => {
                      const parts = runKey.split("_");
                      const wk = parts[1];
                      const dy = parts[3];
                      return (
                        <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-xs font-black text-slate-200">WEEK {wk} DAY {dy}</span>
                          </div>
                          <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">5.0 KM • COMPLETED</span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 4: NUTRITION GUIDE */}
        {activeTab === "nutrition" && (
          <div className="space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
              <span className="text-[9px] font-mono text-[#D32F2F] uppercase block tracking-widest mb-1">CALORIC STABILITY</span>
              <h2 className="text-2xl font-black uppercase text-white font-display">Target Shred Nutrition Desk</h2>
              <p className="text-xs text-[#6B6B6B] mt-2 max-w-xl">
                A structured calorie deficit of 300 to 500 kcal below maintenance is required. Center your menus on dense protein, fiber, and whole tubers.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              
              {/* Foods to eat frequently */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
                <h3 className="text-base font-black uppercase text-white font-display border-b border-slate-800 pb-3 flex items-center gap-2">
                  <Apple className="w-5 h-5 text-emerald-500" />
                  <span>Foods to Eat Frequently</span>
                </h3>

                <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
                  
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
                    <span className="text-[9px] font-mono text-emerald-500 font-bold uppercase">Dense Lean Proteins</span>
                    <h4 className="text-xs font-black text-white uppercase mt-1">Chicken, Turkey, Fish, Eggs, Beans</h4>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      Sufficient protein ingestion preserves fat-free mass while triggering high thermal effect of food (digestion expenditure).
                    </p>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
                    <span className="text-[9px] font-mono text-emerald-500 font-bold uppercase">Probiotics & Satiety</span>
                    <h4 className="text-xs font-black text-white uppercase mt-1">Greek Yogurt & Low-Fat Dairy</h4>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      Dense amino structures regulate appetite loops, protecting muscular integrity under fat-burning stresses.
                    </p>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
                    <span className="text-[9px] font-mono text-emerald-500 font-bold uppercase">Sustained Carbohydrates</span>
                    <h4 className="text-xs font-black text-white uppercase mt-1">Oats, Brown Rice, Sweet Potatoes, Yam</h4>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      Complex fibers with flat glycemic indexes feed muscular glycogen reserves without causing rapid insulin release.
                    </p>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
                    <span className="text-[9px] font-mono text-emerald-500 font-bold uppercase">Cruciferous & Leafy Greets</span>
                    <h4 className="text-xs font-black text-white uppercase mt-1">Spinach, Broccoli, Carrots, Cucumbers, Tomatoes</h4>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      High volume, low density fibers that mechanically distend the stomach, sending continuous fullness signals.
                    </p>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
                    <span className="text-[9px] font-mono text-emerald-500 font-bold uppercase">Lipid Regulators</span>
                    <h4 className="text-xs font-black text-white uppercase mt-1">Avocados, Walnuts, Almonds, Olive Oil</h4>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      Healthy monounsaturated fats optimize critical hormone production (including testosterone and thyroid hormones).
                    </p>
                  </div>

                </div>
              </div>

              {/* Foods to limit / avoid */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
                <h3 className="text-base font-black uppercase text-white font-display border-b border-slate-800 pb-3 flex items-center gap-2">
                  <Ban className="w-5 h-5 text-[#D32F2F]" />
                  <span>Foods to Limit or Avoid</span>
                </h3>

                <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
                  
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
                    <span className="text-[9px] font-mono text-[#D32F2F] font-bold uppercase">Refined Sugar Cascades</span>
                    <h4 className="text-xs font-black text-white uppercase mt-1">Sugary Drinks, Soda, Candy, Ice Cream</h4>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed font-sans">
                      <strong>Why:</strong> High fructose rapidly floods the bloodstream, forcing sudden insulin surges that immediately halt lipolysis and promote visceral fat storage.
                    </p>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
                    <span className="text-[9px] font-mono text-[#D32F2F] font-bold uppercase">Empty Ethanol Sinks</span>
                    <h4 className="text-xs font-black text-white uppercase mt-1">Alcohol, Cocktails, Beers</h4>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed font-sans">
                      <strong>Why:</strong> Ethanol is processed preferentially by the liver, pausing fat breakdown pathways. It also causes late-night appetite dysregulation.
                    </p>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
                    <span className="text-[9px] font-mono text-[#D32F2F] font-bold uppercase">Trans Fats & Oxidation</span>
                    <h4 className="text-xs font-black text-white uppercase mt-1">Deep Fried Foods, Fast Food Burgers</h4>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed font-sans">
                      <strong>Why:</strong> High thermal processed industrial seed oils trigger systemic arterial swelling, compounding vascular stresses.
                    </p>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
                    <span className="text-[9px] font-mono text-[#D32F2F] font-bold uppercase">Sodium & Processing Preservatives</span>
                    <h4 className="text-xs font-black text-white uppercase mt-1">Processed Meats, Hot Dogs, Pepperoni</h4>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed font-sans">
                      <strong>Why:</strong> Promotes subcutaneous fluid retention, obscuring abdominal vascularity and peaking blood pressure baselines.
                    </p>
                  </div>

                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 5: PROGRESS ANALYTICS & CHARTS */}
        {activeTab === "analytics" && (
          <div className="space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
              <span className="text-[9px] font-mono text-[#D32F2F] uppercase block tracking-widest mb-1">TRAJECTORY METRICS</span>
              <h2 className="text-2xl font-black uppercase text-white font-display">Performance Analytics</h2>
              <p className="text-xs text-slate-400 mt-2 max-w-xl">
                Plot weight curves and waist girth shrinkage. Track transformation consistency to defend your streak records.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-800">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center gap-4">
                  <div className="flex-1">
                    <label className="text-[9px] text-slate-500 font-mono uppercase block">Log Weight (kg)</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 78.5" 
                      value={logWeightVal}
                      onChange={(e) => setLogWeightVal(e.target.value)}
                      className="bg-slate-900 text-sm font-black text-white w-full py-2 px-3 border border-slate-800 rounded-xl mt-1.5 focus:border-[#D32F2F] focus:outline-none"
                    />
                  </div>
                  <button 
                    onClick={handleLogWeight}
                    className="h-10 px-4 bg-[#D32F2F] hover:bg-[#B71C1C] text-xs font-black uppercase text-white rounded-xl transition self-end cursor-pointer"
                  >
                    Log Weight
                  </button>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center gap-4">
                  <div className="flex-1">
                    <label className="text-[9px] text-slate-500 font-mono uppercase block">Log Waist Girth (cm)</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 84.0" 
                      value={logWaistVal}
                      onChange={(e) => setLogWaistVal(e.target.value)}
                      className="bg-slate-900 text-sm font-black text-white w-full py-2 px-3 border border-slate-800 rounded-xl mt-1.5 focus:border-[#D32F2F] focus:outline-none"
                    />
                  </div>
                  <button 
                    onClick={handleLogWaist}
                    className="h-10 px-4 bg-[#D32F2F] hover:bg-[#B71C1C] text-xs font-black uppercase text-white rounded-xl transition self-end cursor-pointer"
                  >
                    Log Waist
                  </button>
                </div>
              </div>
            </div>

            {/* Recharts Trajectory plots */}
            <div className="grid lg:grid-cols-2 gap-8">
              
              {/* Weight Plot */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                <h3 className="text-sm font-black uppercase text-white font-display border-b border-slate-800 pb-4 mb-4">
                  Weight Trajectory Index (KG)
                </h3>
                
                <div className="h-64 w-full">
                  {progress.weightHistory.length < 2 ? (
                    <div className="h-full flex items-center justify-center text-xs text-slate-500 italic">
                      Insufficient data to draw line curves. Log another weight entry!
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <ReLineChart data={progress.weightHistory}>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#1E293B" : "#e2e8f0"} />
                        <XAxis dataKey="date" stroke="#64748B" fontSize={10} />
                        <YAxis stroke="#64748B" fontSize={10} domain={["auto", "auto"]} />
                        <Tooltip contentStyle={{ backgroundColor: theme === "dark" ? "#111827" : "#ffffff", border: theme === "dark" ? "1px solid #1E293B" : "1px solid #e2e8f0", color: theme === "dark" ? "#f8fafc" : "#0f172a" }} />
                        <Line type="monotone" dataKey="value" stroke="#D32F2F" strokeWidth={3} dot={{ fill: "#D32F2F" }} />
                      </ReLineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Waist Plot */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                <h3 className="text-sm font-black uppercase text-white font-display border-b border-slate-800 pb-4 mb-4">
                  Waist Measurement Shrinkage (CM)
                </h3>
                
                <div className="h-64 w-full">
                  {progress.waistHistory.length < 2 ? (
                    <div className="h-full flex items-center justify-center text-xs text-slate-500 italic">
                      Insufficient data to draw curves. Log waist measurements over time!
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <ReLineChart data={progress.waistHistory}>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#1E293B" : "#e2e8f0"} />
                        <XAxis dataKey="date" stroke="#64748B" fontSize={10} />
                        <YAxis stroke="#64748B" fontSize={10} domain={["auto", "auto"]} />
                        <Tooltip contentStyle={{ backgroundColor: theme === "dark" ? "#111827" : "#ffffff", border: theme === "dark" ? "1px solid #1E293B" : "1px solid #e2e8f0", color: theme === "dark" ? "#f8fafc" : "#0f172a" }} />
                        <Line type="monotone" dataKey="value" stroke="#10B981" strokeWidth={3} dot={{ fill: "#10B981" }} />
                      </ReLineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

            </div>

            {/* Photo Diary Gallery */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-6">
                <div>
                  <span className="text-[9px] font-mono text-slate-500 uppercase">VISUAL TRANSFORMATIONS</span>
                  <h3 className="text-sm font-black uppercase text-white font-display mt-1">
                    Progress Photos Diary
                  </h3>
                </div>
                
                <button
                  onClick={() => setShowPhotoModal(true)}
                  className="px-4 py-2 bg-[#D32F2F] hover:bg-[#B71C1C] text-xs font-black uppercase rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Photo
                </button>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {progress.progressPhotos.length === 0 ? (
                  <div className="sm:col-span-2 lg:col-span-4 text-center py-12 text-xs text-slate-500 italic">
                    No progress photos saved yet. Upload a baseline photo to start tracking!
                  </div>
                ) : (
                  progress.progressPhotos.map((photo, idx) => (
                    <div key={idx} className="bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden group">
                      <div className="h-48 w-full bg-slate-900 overflow-hidden relative">
                        <img 
                          src={photo.url} 
                          alt={photo.note} 
                          className="w-full h-full object-cover transition duration-300 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-xs px-2 py-0.5 rounded text-[9px] font-mono font-bold text-[#D32F2F]">
                          {photo.date}
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-[11px] text-slate-300 font-bold uppercase truncate">{photo.note}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Photo Upload Dialog Modal */}
            {showPhotoModal && (
              <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <h4 className="text-sm font-black uppercase text-white font-display">Log Progress Photo</h4>
                    <button 
                      onClick={() => setShowPhotoModal(false)} 
                      className="text-slate-400 hover:text-white font-black text-xs cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <form onSubmit={handleLogPhoto} className="space-y-4">
                    <div>
                      <label className="text-[9px] text-slate-400 uppercase font-mono">Photo URL</label>
                      <input 
                        type="url" 
                        required
                        placeholder="Paste image link (or use Unsplash link)" 
                        value={logPhotoUrl}
                        onChange={(e) => setLogPhotoUrl(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-xl text-xs text-white p-3 w-full mt-1.5 focus:border-[#D32F2F] focus:outline-none"
                      />
                      <p className="text-[8px] text-slate-500 mt-1">
                        Use Unsplash links or external URLs. Refer to Unsplash search patterns.
                      </p>
                    </div>

                    <div>
                      <label className="text-[9px] text-slate-400 uppercase font-mono">Caption / Short Note</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Week 4 update - feeling tight" 
                        value={logPhotoNote}
                        onChange={(e) => setLogPhotoNote(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-xl text-xs text-white p-3 w-full mt-1.5 focus:border-[#D32F2F] focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-[#D32F2F] hover:bg-[#B71C1C] text-xs font-black uppercase tracking-wider text-white rounded-xl transition cursor-pointer"
                    >
                      Save Photo Entry
                    </button>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 6: NOTIFICATIONS & REMINDERS DESK */}
        {activeTab === "coaching" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-[9px] font-mono text-[#D32F2F] uppercase block tracking-widest mb-1">COMPLIANCE & TIMINGS</span>
              <h2 className="text-2xl font-black uppercase text-white font-display">Reminders Desk</h2>
              <p className="text-xs text-[#6B6B6B] mt-2 max-w-xl">
                Configure your transformation coach alerts. Standard reminders trigger local system scheduling logs to keep your daily calorie deficit on absolute track.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 border-t border-slate-800 pt-6">
              
              {/* Reminder checkboxes */}
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase text-white font-display">
                  Active Alerts Configuration
                </h3>
                
                <div className="space-y-2">
                  {[
                    { id: "workout", label: "Workout reminder", desc: "Alert me to log my active core and metabolic session" },
                    { id: "water", label: "Water intake reminder", desc: "Hourly notification to consume optimal water volumes" },
                    { id: "running", label: "Running day alarm", desc: "Remind me to finish my progressive 3-5 km run" },
                    { id: "meal", label: "Clean meal prep reminder", desc: "Keep me focused on high protein whole foods" },
                    { id: "walk", label: "Post-meal walks alarm", desc: "Trigger 10-minute walk alerts after principal meals" },
                    { id: "lemonCucumber", label: "Lemon cucumber drink checklist", desc: "Notify me on scheduled fresh infusion days" }
                  ].map((rem) => {
                    const active = (progress.reminders as any)[rem.id];
                    return (
                      <div 
                        key={rem.id}
                        onClick={() => toggleReminder(rem.id as any)}
                        className={`p-4 rounded-2xl border transition flex items-center justify-between cursor-pointer select-none ${
                          active 
                            ? "bg-slate-950 border-slate-800 text-white" 
                            : "bg-slate-950/40 border-slate-900/60 text-slate-600"
                        }`}
                      >
                        <div>
                          <h4 className="text-xs font-black uppercase leading-tight">{rem.label}</h4>
                          <p className="text-[10px] text-slate-500 mt-1 leading-none">{rem.desc}</p>
                        </div>
                        
                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${active ? "border-[#D32F2F] bg-[#D32F2F] text-white" : "border-slate-800"}`}>
                          {active && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Simulated system log box */}
              <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-4">
                <h3 className="text-xs font-mono font-black text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>SYSTEM NOTIFICATION DAEMON</span>
                </h3>
                
                <p className="text-xs text-slate-500 leading-relaxed font-sans">
                  Whenever an active reminder is configured, our background schedule daemon logs the timing triggers locally. 
                  Below are the simulated active event timing cues queued for today:
                </p>

                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 space-y-2 text-[10px] font-mono text-slate-400">
                  <p className="text-[#D32F2F] font-bold">W{progress.currentWeek} REMINDER THREADS ACTIVE:</p>
                  {progress.reminders.workout && <p>• [07:30] WORKOUT_ALARM: Ignite W{progress.currentWeek} Day {progress.currentDay} Full Body Burn</p>}
                  {progress.reminders.water && <p>• [09:00 - 19:00] HYDRO_DAEMON: Consume 250ml fluid increment (Male: 4L, Female: 3L)</p>}
                  {progress.reminders.running && isRunScheduled && <p>• [17:00] CARDIO_TRACKER: 3-5 KM Run assignment scheduled</p>}
                  {progress.reminders.walk && <p>• [13:30, 20:00] THERMAL_WALK: 15-minute post-meal calorie dispersion alerts ready</p>}
                  {progress.reminders.lemonCucumber && isLemonScheduled && <p>• [08:00] INFUSION_ALERT: Prepare Lemon & Cucumber Water Routine (2 Liters)</p>}
                </div>

                <div className="text-[10px] text-slate-500 leading-relaxed bg-[#D32F2F]/5 p-3 rounded-xl border border-[#D32F2F]/10">
                  👑 <strong>Premium Notice:</strong> Browser notification permissions must be granted to trigger persistent push popups. Otherwise, timings remain listed dynamically in your Coach Briefing logs on this page.
                </div>
              </div>

              {/* Automated Firebase Extension for Mail Integration */}
              <div className="md:col-span-2 bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-[#D32F2F] animate-pulse" />
                  <div>
                    <h3 className="text-sm font-black uppercase text-white font-display">
                      Automated Email Coaching Dispatcher
                    </h3>
                    <p className="text-[10px] font-mono text-slate-500 uppercase">
                      INTEGRATED VIA FIREBASE EXTENSION FOR MAIL
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  AlexFitnessHub integrates directly with <strong>Firebase Mail Extension Queue</strong>. In addition to fully automated emails sent on registration and weekly reports, you can manually trigger a high-fidelity sports-science <strong>Belly Fat Shred program reminder email</strong> tailored to your current progress stage (<strong>Week {progress.currentWeek} Day {progress.currentDay}</strong>) directly to your inbox.
                </p>

                {emailSuccess && (
                  <div className="text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl">
                    {emailSuccess}
                  </div>
                )}

                {emailError && (
                  <div className="text-[11px] text-rose-400 bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl">
                    {emailError}
                  </div>
                )}

                <button
                  onClick={handleSendBellyFatShredReminder}
                  disabled={emailSending}
                  className="px-6 py-3 bg-[#D32F2F] hover:bg-[#B71C1C] disabled:bg-slate-800 disabled:text-slate-500 text-xs font-black uppercase tracking-wider text-white rounded-xl transition flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
                >
                  {emailSending ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Dispatching Email Reminder...</span>
                    </>
                  ) : (
                    <>
                      <span>Send W{progress.currentWeek} Day {progress.currentDay} Program Email Reminder Now</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  );
}
