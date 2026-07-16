import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { db, auth } from "../lib/firebase";
import PageHero from "./PageHero";
import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  getDoc, 
  query, 
  where 
} from "firebase/firestore";
import { motion, AnimatePresence } from "motion/react";
import { 
  Trophy, 
  Users, 
  Plus, 
  Flame, 
  Zap, 
  Award, 
  CheckCircle2, 
  Lock, 
  Calendar, 
  ChevronRight, 
  TrendingUp, 
  Sparkles, 
  Clock, 
  Dumbbell, 
  Droplet, 
  TrendingDown, 
  Info,
  Medal,
  RefreshCw,
  Crown,
  Shield
} from "lucide-react";

// Types for Challenges
interface Challenge {
  id: string;
  title: string;
  description: string;
  category: "strength" | "core" | "cardio" | "hydration" | "consistency";
  difficulty: "Easy" | "Medium" | "Hard";
  targetValue: number;
  unit: string;
  badgeId: string;
  badgeName: string;
  badgeDescription: string;
  badgeColor: string;
  icon: any;
  duration: string;
}

interface Enrollment {
  challengeId: string;
  currentValue: number;
  status: "active" | "completed";
  joinedAt: string;
  updatedAt: string;
}

interface LeaderboardUser {
  userId: string;
  userName: string;
  photoURL?: string;
  currentValue: number;
  isCurrentUser?: boolean;
}

// Preset Challenges available for community interaction
const COMMUNITY_CHALLENGES: Challenge[] = [
  {
    id: "squat_centurion",
    title: "Iron Centurion Squats",
    description: "Build exceptional quadricep and glute endurance by performing squat repetitions.",
    category: "strength",
    difficulty: "Medium",
    targetValue: 1000,
    unit: "reps",
    badgeId: "squat_crown",
    badgeName: "Iron Squat Crown",
    badgeDescription: "Awarded for exceptional quadricep and glute endurance of 1000 squats.",
    badgeColor: "from-amber-400 to-red-500",
    icon: Dumbbell,
    duration: "Monthly (30 Days)"
  },
  {
    id: "plank_citadel",
    title: "120-Min Plank Citadel",
    description: "Display unbreakable core fortress defense by accumulating static planks.",
    category: "core",
    difficulty: "Hard",
    targetValue: 120,
    unit: "mins",
    badgeId: "core_citadel_seal",
    badgeName: "Core Citadel Seal",
    badgeDescription: "Awarded to athletes with unbreakable core fortress defense.",
    badgeColor: "from-cyan-400 to-blue-600",
    icon: Shield,
    duration: "Monthly (30 Days)"
  },
  {
    id: "consistency_firestarter",
    title: "Daily Habit Firestarter",
    description: "Maintain continuous daily training habits and consistent logged actions.",
    category: "consistency",
    difficulty: "Easy",
    targetValue: 15,
    unit: "days",
    badgeId: "daily_phoenix",
    badgeName: "Daily Phoenix Medal",
    badgeDescription: "Awarded for active continuous training of 15 days.",
    badgeColor: "from-orange-400 to-red-600",
    icon: Flame,
    duration: "Monthly (30 Days)"
  },
  {
    id: "cardio_threshold",
    title: "Cardio Threshold Protocol",
    description: "Overcome oxygen thresholds by logging intensive high-heartrate workouts.",
    category: "cardio",
    difficulty: "Hard",
    targetValue: 300,
    unit: "mins",
    badgeId: "pegasus_wings",
    badgeName: "Pegasus Speed Wings",
    badgeDescription: "Awarded for logging 300 minutes of intensive cardio workouts.",
    badgeColor: "from-pink-400 to-purple-600",
    icon: Zap,
    duration: "Monthly (30 Days)"
  },
  {
    id: "hydration_sentinel",
    title: "Supreme Hydration Sentinel",
    description: "Master hydration metrics to power metabolic excellence and muscle repair.",
    category: "hydration",
    difficulty: "Medium",
    targetValue: 60,
    unit: "liters",
    badgeId: "neptune_trident",
    badgeName: "Neptune's Trident",
    badgeDescription: "Awarded for mastering hydration logs by consuming 60 liters.",
    badgeColor: "from-teal-400 to-emerald-600",
    icon: Droplet,
    duration: "Monthly (30 Days)"
  }
];

// Helper to simulate other leaderboard participants
const SIMULATED_PARTICIPANTS: Record<string, Omit<LeaderboardUser, "userId" | "isCurrentUser">[]> = {
  squat_centurion: [
    { userName: "Coach Marcus", currentValue: 920 },
    { userName: "Sarah Jenkins", currentValue: 710 },
    { userName: "Michael Carter", currentValue: 450 },
    { userName: "Elena Rostova", currentValue: 210 },
  ],
  plank_citadel: [
    { userName: "Coach Marcus", currentValue: 110 },
    { userName: "Sarah Jenkins", currentValue: 85 },
    { userName: "Elena Rostova", currentValue: 55 },
    { userName: "Michael Carter", currentValue: 30 },
  ],
  consistency_firestarter: [
    { userName: "Coach Marcus", currentValue: 14 },
    { userName: "Elena Rostova", currentValue: 12 },
    { userName: "Sarah Jenkins", currentValue: 11 },
    { userName: "Michael Carter", currentValue: 8 },
  ],
  cardio_threshold: [
    { userName: "Sarah Jenkins", currentValue: 280 },
    { userName: "Coach Marcus", currentValue: 240 },
    { userName: "Elena Rostova", currentValue: 180 },
    { userName: "Michael Carter", currentValue: 120 },
  ],
  hydration_sentinel: [
    { userName: "Elena Rostova", currentValue: 55 },
    { userName: "Coach Marcus", currentValue: 48 },
    { userName: "Sarah Jenkins", currentValue: 38 },
    { userName: "Michael Carter", currentValue: 25 },
  ]
};

export default function FitnessChallenges() {
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState<"challenges" | "trophies" | "leaderboard">("challenges");
  const [enrollments, setEnrollments] = useState<Record<string, Enrollment>>({});
  const [loading, setLoading] = useState<boolean>(true);
  
  // Interactive Logging state
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [logValue, setLogValue] = useState<string>("");
  const [logSuccessMessage, setLogSuccessMessage] = useState<string>("");
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [unlockedBadge, setUnlockedBadge] = useState<{ name: string; color: string } | null>(null);

  // Load user enrollments on startup
  useEffect(() => {
    if (!user) return;
    fetchEnrollments();
  }, [user]);

  const fetchEnrollments = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, "user_challenge_enrollments"),
        where("userId", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      const tempEnrollments: Record<string, Enrollment> = {};
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        tempEnrollments[data.challengeId] = {
          challengeId: data.challengeId,
          currentValue: data.currentValue || 0,
          status: data.status || "active",
          joinedAt: data.joinedAt,
          updatedAt: data.updatedAt
        };
      });
      setEnrollments(tempEnrollments);
    } catch (err) {
      console.error("[FitnessChallenges] Error fetching enrollments:", err);
    } finally {
      setLoading(false);
    }
  };

  // Join/Enroll function
  const handleJoinChallenge = async (challenge: Challenge) => {
    if (!user) return;
    
    const newEnrollment: Enrollment = {
      challengeId: challenge.id,
      currentValue: 0,
      status: "active",
      joinedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      // Save in Firestore
      const docId = `${user.uid}_${challenge.id}`;
      await setDoc(doc(db, "user_challenge_enrollments", docId), {
        userId: user.uid,
        userName: user.displayName || "Athlete",
        challengeId: challenge.id,
        challengeTitle: challenge.title,
        currentValue: 0,
        status: "active",
        joinedAt: newEnrollment.joinedAt,
        updatedAt: newEnrollment.updatedAt
      });

      setEnrollments(prev => ({
        ...prev,
        [challenge.id]: newEnrollment
      }));
    } catch (err) {
      console.error("[FitnessChallenges] Error enrolling in challenge:", err);
    }
  };

  // Submit Progress updates
  const handleLogProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedChallenge) return;
    
    const incrementAmount = parseFloat(logValue);
    if (isNaN(incrementAmount) || incrementAmount <= 0) {
      alert("Please enter a valid positive numeric value.");
      return;
    }

    const currentEnrollment = enrollments[selectedChallenge.id];
    const prevValue = currentEnrollment ? currentEnrollment.currentValue : 0;
    const newValue = Math.min(prevValue + incrementAmount, selectedChallenge.targetValue);
    const isNowCompleted = newValue >= selectedChallenge.targetValue;
    const newStatus = isNowCompleted ? "completed" : "active";

    const updatedEnrollment: Enrollment = {
      challengeId: selectedChallenge.id,
      currentValue: newValue,
      status: newStatus,
      joinedAt: currentEnrollment ? currentEnrollment.joinedAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      const docId = `${user.uid}_${selectedChallenge.id}`;
      await setDoc(doc(db, "user_challenge_enrollments", docId), {
        userId: user.uid,
        userName: user.displayName || "Athlete",
        challengeId: selectedChallenge.id,
        challengeTitle: selectedChallenge.title,
        currentValue: newValue,
        status: newStatus,
        joinedAt: updatedEnrollment.joinedAt,
        updatedAt: updatedEnrollment.updatedAt
      });

      // If completed, save dynamic badge in Firestore
      if (isNowCompleted && (!currentEnrollment || currentEnrollment.status !== "completed")) {
        const badgeDocId = `${user.uid}_${selectedChallenge.badgeId}`;
        await setDoc(doc(db, "user_earned_badges", badgeDocId), {
          userId: user.uid,
          badgeId: selectedChallenge.badgeId,
          badgeName: selectedChallenge.badgeName,
          badgeDescription: selectedChallenge.badgeDescription,
          badgeColor: selectedChallenge.badgeColor,
          earnedAt: new Date().toISOString()
        });

        // Trigger dynamic celebration
        setUnlockedBadge({
          name: selectedChallenge.badgeName,
          color: selectedChallenge.badgeColor
        });
        setShowCelebration(true);
      }

      setEnrollments(prev => ({
        ...prev,
        [selectedChallenge.id]: updatedEnrollment
      }));

      setLogSuccessMessage(`Successfully added ${incrementAmount} ${selectedChallenge.unit}!`);
      setLogValue("");
      setTimeout(() => {
        setLogSuccessMessage("");
      }, 4000);

    } catch (err) {
      console.error("[FitnessChallenges] Error updating progress:", err);
      alert("Failed to record progress. Please try again.");
    }
  };

  // Helper to construct dynamic leaderboard for a challenge
  const getLeaderboardData = (challenge: Challenge): LeaderboardUser[] => {
    const userEnrollment = enrollments[challenge.id];
    const baseList: LeaderboardUser[] = [
      ...SIMULATED_PARTICIPANTS[challenge.id].map((p, idx) => ({
        userId: `sim_${idx}`,
        userName: p.userName,
        currentValue: p.currentValue,
        isCurrentUser: false
      }))
    ];

    if (userEnrollment) {
      baseList.push({
        userId: user?.uid || "current",
        userName: `${user?.displayName || "You"} (Me)`,
        photoURL: user?.photoURL,
        currentValue: userEnrollment.currentValue,
        isCurrentUser: true
      });
    }

    // Sort descending by value
    return baseList.sort((a, b) => b.currentValue - a.currentValue);
  };

  // Count active / completed enrollments
  const activeCount = (Object.values(enrollments) as Enrollment[]).filter(e => e.status === "active").length;
  const completedCount = (Object.values(enrollments) as Enrollment[]).filter(e => e.status === "completed").length;

  return (
    <div id="fitness_challenges_root" className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans">
      
      {/* Premium Red Banner / Header Section */}
      <PageHero
        title="Fitness Challenges"
        subtitle="Athletic Arena"
        description="Join monthly community challenges, push past individual physical ceilings, track your live progress against elite competitors, and claim authentic digital badges."
        imageUrl="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop"
        category="ATHLETIC ARENA"
      />

      {/* Quick stats board */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 text-left shadow-sm">
            <span className="text-[10px] text-slate-500 font-mono font-black uppercase tracking-widest">Active Challenges</span>
            <p className="text-3xl font-black mt-1 text-[#D32F2F] font-sans">{activeCount}</p>
          </div>
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 text-left shadow-sm">
            <span className="text-[10px] text-slate-500 font-mono font-black uppercase tracking-widest">Completed / Badges</span>
            <p className="text-3xl font-black mt-1 text-amber-500 flex items-center gap-1.5 font-sans">
              <Crown className="h-6 w-6 fill-amber-400 text-amber-500 shrink-0" />
              {completedCount}
            </p>
          </div>
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 text-left shadow-sm">
            <span className="text-[10px] text-slate-500 font-mono font-black uppercase tracking-widest">Global Rank Tier</span>
            <p className="text-lg font-black mt-2 uppercase tracking-tight text-amber-600 font-sans">
              {completedCount >= 4 ? "Elite Sentinel" : completedCount >= 2 ? "Crucible Knight" : "Vanguard Initiate"}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs - High Contrast white background bar */}
      <div className="sticky top-[76px] z-30 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 flex gap-8">
          <button
            onClick={() => setActiveTab("challenges")}
            className={`py-5 text-xs font-black uppercase tracking-widest relative cursor-pointer transition-colors ${
              activeTab === "challenges" ? "text-[#D32F2F]" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Challenges
            {activeTab === "challenges" && (
              <motion.div layoutId="challengeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-[#D32F2F]" />
            )}
          </button>
          
          <button
            onClick={() => setActiveTab("trophies")}
            className={`py-5 text-xs font-black uppercase tracking-widest relative cursor-pointer transition-colors ${
              activeTab === "trophies" ? "text-[#D32F2F]" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            My Trophy Cabinet
            {activeTab === "trophies" && (
              <motion.div layoutId="challengeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-[#D32F2F]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("leaderboard")}
            className={`py-5 text-xs font-black uppercase tracking-widest relative cursor-pointer transition-colors ${
              activeTab === "leaderboard" ? "text-[#D32F2F]" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Leaderboard
            {activeTab === "leaderboard" && (
              <motion.div layoutId="challengeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-[#D32F2F]" />
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <RefreshCw className="h-10 w-10 text-[#D32F2F] animate-spin mb-4" />
            <p className="text-sm font-semibold text-slate-500">Retrieving athletic credentials...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            
            {/* TAB 1: CHALLENGES LIST */}
            {activeTab === "challenges" && (
              <motion.div
                key="challenges-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8 text-left"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 uppercase tracking-tight">
                      Available Community Challenges
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Enroll in one or more active challenges to record your progressive results.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {COMMUNITY_CHALLENGES.map((challenge) => {
                    const enrollment = enrollments[challenge.id];
                    const isEnrolled = !!enrollment;
                    const isCompleted = enrollment?.status === "completed";
                    const progressPercent = enrollment 
                      ? Math.round((enrollment.currentValue / challenge.targetValue) * 100) 
                      : 0;

                    return (
                      <motion.div
                        key={challenge.id}
                        id={`challenge_card_${challenge.id}`}
                        className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col h-[400px] justify-between group"
                        whileHover={{ y: -4 }}
                      >
                        {/* Card Header & Description */}
                        <div className="p-6 text-left">
                          <div className="flex justify-between items-start mb-4">
                            <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                              challenge.difficulty === "Easy" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                              challenge.difficulty === "Medium" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                              "bg-red-50 text-red-700 border border-red-100"
                            }`}>
                              {challenge.difficulty} Difficulty
                            </span>
                            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                              {challenge.duration}
                            </span>
                          </div>

                          <div className="flex items-center gap-3.5 mb-3">
                            <div className="h-11 w-11 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-[#D32F2F]">
                              <challenge.icon className="h-5 w-5" />
                            </div>
                            <div>
                              <h3 className="font-extrabold text-base text-slate-950 group-hover:text-[#D32F2F] transition-colors leading-tight">
                                {challenge.title}
                              </h3>
                              <p className="text-[11px] font-medium text-slate-400 uppercase mt-0.5">
                                Goal: {challenge.targetValue.toLocaleString()} {challenge.unit}
                              </p>
                            </div>
                          </div>

                          <p className="text-slate-600 text-xs leading-relaxed mt-2.5">
                            {challenge.description}
                          </p>

                          {/* Badge Reward preview */}
                          <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                            <div className={`h-9 w-9 rounded-xl bg-gradient-to-tr ${challenge.badgeColor} flex items-center justify-center text-white shadow-xs`}>
                              <Award className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <span className="block text-[10px] font-black uppercase text-amber-800 tracking-wider">Badge Reward</span>
                              <span className="block text-xs font-bold text-slate-900 truncate">{challenge.badgeName}</span>
                            </div>
                          </div>
                        </div>

                        {/* Interactive Footer */}
                        <div className="px-6 pb-6 pt-2 bg-slate-50/50 border-t border-slate-100 mt-auto">
                          {isCompleted ? (
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                                <CheckCircle2 className="h-4 w-4" /> Completed!
                              </span>
                              <button
                                onClick={() => {
                                  setSelectedChallenge(challenge);
                                }}
                                className="text-xs font-black text-[#D32F2F] hover:underline cursor-pointer"
                              >
                                View Trophy
                              </button>
                            </div>
                          ) : isEnrolled ? (
                            <div className="space-y-4">
                              <div className="flex justify-between text-xs font-bold">
                                <span className="text-slate-500">Progress: {progressPercent}%</span>
                                <span className="text-slate-900">{enrollment.currentValue} / {challenge.targetValue} {challenge.unit}</span>
                              </div>
                              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                                <motion.div 
                                  className="bg-gradient-to-r from-red-500 to-[#D32F2F] h-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${progressPercent}%` }}
                                  transition={{ duration: 0.8 }}
                                />
                              </div>
                              <button
                                onClick={() => {
                                  setSelectedChallenge(challenge);
                                }}
                                className="w-full bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-[11px] font-black uppercase tracking-wider py-2.5 px-4 rounded-xl transition-all shadow-xs hover:shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                              >
                                <Plus className="h-3.5 w-3.5" /> Log Challenge Progress
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleJoinChallenge(challenge)}
                              className="w-full border-2 border-slate-900 hover:bg-slate-900 hover:text-white text-slate-900 text-[11px] font-black uppercase tracking-wider py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <Plus className="h-3.5 w-3.5" /> Join Monthly Challenge
                            </button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* TAB 2: TROPHY CABINET / BADGES */}
            {activeTab === "trophies" && (
              <motion.div
                key="trophies-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8 text-left"
              >
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 uppercase tracking-tight">
                    My Trophy Cabinet
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Showcasing your earned badges of honor. Lock icons display achievements awaiting completion.
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {COMMUNITY_CHALLENGES.map((challenge) => {
                    const enrollment = enrollments[challenge.id];
                    const isEarned = enrollment?.status === "completed";

                    return (
                      <motion.div
                        key={challenge.id}
                        className={`border rounded-3xl p-6 text-center flex flex-col items-center justify-between transition-all ${
                          isEarned 
                            ? "bg-white border-amber-200 shadow-md shadow-amber-50/50" 
                            : "bg-slate-100/50 border-slate-200 opacity-60"
                        }`}
                        whileHover={isEarned ? { scale: 1.05 } : {}}
                      >
                        {/* Badge Sphere / Icon */}
                        <div className="relative mb-4">
                          <div className={`h-20 w-20 rounded-full flex items-center justify-center shadow-lg transition-transform ${
                            isEarned 
                              ? `bg-gradient-to-tr ${challenge.badgeColor} text-white scale-100 rotate-0` 
                              : "bg-slate-300 text-slate-500"
                          }`}>
                            {isEarned ? (
                              <Award className="h-10 w-10 animate-pulse" />
                            ) : (
                              <Lock className="h-8 w-8 text-slate-400" />
                            )}
                          </div>
                          
                          {/* Crown/Sticker for Earned Badges */}
                          {isEarned && (
                            <div className="absolute -top-2 -right-2 bg-amber-400 text-white rounded-full p-1 border-2 border-white shadow-xs">
                              <Crown className="h-3.5 w-3.5 fill-white" />
                            </div>
                          )}
                        </div>

                        {/* Title and details */}
                        <div className="space-y-1">
                          <h4 className="font-extrabold text-sm text-slate-900 leading-tight">
                            {challenge.badgeName}
                          </h4>
                          <p className="text-[10px] text-slate-500 max-w-[150px] mx-auto leading-relaxed">
                            {challenge.badgeDescription}
                          </p>
                        </div>

                        {/* Earned Date or status */}
                        <div className="mt-4 pt-3 border-t border-slate-100 w-full">
                          {isEarned ? (
                            <span className="inline-block text-[9px] font-black uppercase text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                              Earned Monthly Badge
                            </span>
                          ) : (
                            <span className="inline-block text-[9px] font-bold uppercase text-slate-400">
                              Locked
                            </span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* TAB 3: LEADERBOARD */}
            {activeTab === "leaderboard" && (
              <motion.div
                key="leaderboard-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8 text-left"
              >
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 uppercase tracking-tight">
                    Leaderboard & Competitor Tracker
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    See where you stand in active monthly challenges against the global community.
                  </p>
                </div>

                {/* Challenges breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {COMMUNITY_CHALLENGES.map((challenge) => {
                    const leaderboard = getLeaderboardData(challenge);
                    const userEnrollment = enrollments[challenge.id];

                    return (
                      <div 
                        key={challenge.id} 
                        className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
                            <div className="h-9 w-9 bg-slate-50 rounded-xl flex items-center justify-center text-[#D32F2F]">
                              <challenge.icon className="h-4 w-4" />
                            </div>
                            <div>
                              <h3 className="font-extrabold text-sm text-slate-950 uppercase tracking-tight">
                                {challenge.title}
                              </h3>
                              <p className="text-[10px] text-slate-400 font-bold uppercase">
                                Unit: {challenge.unit} • Target: {challenge.targetValue}
                              </p>
                            </div>
                          </div>

                          {/* Competitor rows */}
                          <div className="space-y-3">
                            {leaderboard.map((player, idx) => {
                              const rank = idx + 1;
                              const isGold = rank === 1;
                              const isSilver = rank === 2;
                              const isBronze = rank === 3;

                              return (
                                <div 
                                  key={player.userId}
                                  className={`flex items-center justify-between p-2.5 rounded-2xl transition-all ${
                                    player.isCurrentUser 
                                      ? "bg-red-50/50 border border-red-100 shadow-xs" 
                                      : "bg-slate-50 border border-transparent"
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    {/* Rank Sphere */}
                                    <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-black shadow-xs ${
                                      isGold ? "bg-amber-400 text-white" :
                                      isSilver ? "bg-slate-300 text-slate-800" :
                                      isBronze ? "bg-amber-600 text-white" :
                                      "bg-white text-slate-500 border border-slate-200"
                                    }`}>
                                      {rank}
                                    </div>

                                    {/* Photo/Avatar or First letter */}
                                    {player.photoURL ? (
                                      <img src={player.photoURL} alt={player.userName} className="w-8 h-8 rounded-full object-cover" referrerPolicy="no-referrer" />
                                    ) : (
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black uppercase text-white shadow-xs ${
                                        player.isCurrentUser ? "bg-[#D32F2F]" : "bg-slate-400"
                                      }`}>
                                        {player.userName[0]}
                                      </div>
                                    )}

                                    <span className={`text-xs font-bold ${player.isCurrentUser ? "text-[#D32F2F]" : "text-slate-800"}`}>
                                      {player.userName}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-black text-slate-900">
                                      {player.currentValue.toLocaleString()}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase">
                                      {challenge.unit}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {!userEnrollment && (
                          <div className="mt-5 pt-4 border-t border-slate-100">
                            <button
                              onClick={() => handleJoinChallenge(challenge)}
                              className="w-full bg-slate-950 hover:bg-slate-900 text-white text-[10px] font-black uppercase py-2 px-3 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1"
                            >
                              <Plus className="h-3 w-3" /> Enroll to join leaderboard
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        )}
      </div>

      {/* DIALOG/MODAL FOR LOGGING PROGRESS */}
      <AnimatePresence>
        {selectedChallenge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedChallenge(null)}
            />

            {/* Modal Body */}
            <motion.div 
              className="bg-white rounded-3xl w-full max-w-md border border-slate-200 overflow-hidden shadow-2xl relative z-10 text-left"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              {/* White background, Red Header theme styling */}
              <div className="bg-[#D32F2F] text-white p-6 relative">
                <button 
                  onClick={() => setSelectedChallenge(null)}
                  className="absolute top-4 right-4 text-white/80 hover:text-white font-extrabold text-sm"
                >
                  ✕
                </button>
                <span className="text-[9px] font-mono font-black uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded-full">
                  Progress Log
                </span>
                <h3 className="text-xl font-extrabold tracking-tight uppercase mt-2">
                  {selectedChallenge.title}
                </h3>
                <p className="text-white/80 text-xs mt-1">
                  Add completed effort to your monthly target value of {selectedChallenge.targetValue} {selectedChallenge.unit}.
                </p>
              </div>

              <div className="p-6">
                {/* Form to submit */}
                <form onSubmit={handleLogProgress} className="space-y-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wide text-slate-700 mb-1.5">
                      Enter Completed {selectedChallenge.unit}
                    </label>
                    <div className="relative">
                      <input 
                        type="number" 
                        required
                        step="any"
                        placeholder={`e.g. 50`}
                        value={logValue}
                        onChange={(e) => setLogValue(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#D32F2F]"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 uppercase">
                        {selectedChallenge.unit}
                      </span>
                    </div>
                  </div>

                  {logSuccessMessage && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      {logSuccessMessage}
                    </motion.div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedChallenge(null)}
                      className="flex-1 py-3 px-4 border border-slate-200 text-slate-600 font-bold rounded-xl text-xs uppercase hover:bg-slate-50 cursor-pointer text-center"
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 px-4 bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold rounded-xl text-xs uppercase shadow-sm cursor-pointer text-center"
                    >
                      Update Progress
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CELEBRATION MODAL FOR UNLOCKED BADGE */}
      <AnimatePresence>
        {showCelebration && unlockedBadge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Dark Backdrop */}
            <motion.div 
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Sparkles and particles celebration */}
            <motion.div
              className="bg-white border-2 border-amber-300 rounded-3xl w-full max-w-sm p-8 text-center shadow-2xl relative z-10 overflow-hidden"
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
            >
              {/* Confetti simulation elements */}
              <div className="absolute top-0 inset-x-0 h-1 flex justify-around">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-amber-400"
                    animate={{ 
                      y: [0, 400], 
                      x: [0, (i % 2 === 0 ? 30 : -30)],
                      opacity: [1, 0]
                    }}
                    transition={{ 
                      duration: 1.5 + Math.random() * 2, 
                      repeat: Infinity,
                      delay: Math.random() * 0.5
                    }}
                  />
                ))}
              </div>

              <div className="flex justify-center mb-6">
                <div className={`h-28 w-28 rounded-full bg-gradient-to-tr ${unlockedBadge.color} text-white flex items-center justify-center shadow-2xl shadow-amber-200 relative`}>
                  <Award className="h-14 w-14 animate-pulse" />
                  <motion.div 
                    className="absolute inset-0 rounded-full border-2 border-white"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </div>

              <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 block mb-2">
                Challenge Conquered!
              </span>
              <h2 className="text-2xl font-black text-slate-950 uppercase tracking-tight mb-3">
                Badge Unlocked!
              </h2>
              <p className="text-slate-900 font-extrabold text-sm mb-4">
                "{unlockedBadge.name}"
              </p>
              <p className="text-slate-500 text-xs leading-relaxed mb-6">
                Incredible athletic work! You have successfully completed this community challenge. The digital badge has been placed in your permanent Trophy Cabinet.
              </p>

              <button
                onClick={() => {
                  setShowCelebration(false);
                  setUnlockedBadge(null);
                  setActiveTab("trophies");
                }}
                className="w-full py-3.5 px-6 bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs uppercase rounded-xl shadow-md cursor-pointer"
              >
                View Cabinet Trophy
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
