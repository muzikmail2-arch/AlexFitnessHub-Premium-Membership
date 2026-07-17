import React, { useState, useMemo, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import { Exercise, PROGRAMS, Program } from "../data/exercises";
import { 
  Search, SlidersHorizontal, Lock, CheckCircle, PlusCircle, Sparkles, X, 
  ChevronRight, HelpCircle, AlertTriangle, Play, Shield, Calendar, Apple, Dumbbell, ArrowRight, Clipboard,
  Compass, CheckCircle2, UploadCloud, FileVideo, FileImage, Trash2, ArrowLeft, RotateCcw, Award
} from "lucide-react";
import WorkoutVisual from "./WorkoutVisual";
import MuscleAnatomyVisual from "./MuscleAnatomyVisual";
import PageHero from "./PageHero";

const getQueryTargetGroup = (q: string): string | null => {
  const normalized = q.trim().toLowerCase();
  if (normalized === "chest" || normalized === "chests") return "chest";
  if (normalized === "back" || normalized === "backs") return "back";
  if (normalized === "shoulder" || normalized === "shoulders") return "shoulders";
  if (normalized === "bicep" || normalized === "biceps") return "biceps";
  if (normalized === "tricep" || normalized === "triceps") return "triceps";
  if (normalized === "leg" || normalized === "legs") return "legs";
  if (normalized === "glute" || normalized === "glutes") return "glutes";
  if (normalized === "core" || normalized === "abs" || normalized === "ab") return "core";
  if (normalized === "forearm" || normalized === "forearms") return "forearms";
  if (normalized === "calf" || normalized === "calves") return "calves";
  if (normalized === "cardio") return "cardio";
  if (normalized === "home workout" || normalized === "home workouts" || normalized === "home") return "home workouts";
  if (normalized === "military calisthenics" || normalized === "military" || normalized === "calisthenics") return "military calisthenics";
  return null;
};

const getExerciseSystemGroup = (ex: Exercise): string => {
  const cat = ex.category.toLowerCase();
  if (cat.includes("cardio")) return "cardio";
  if (cat.includes("home")) return "home workouts";
  if (cat.includes("military") || cat.includes("calisthenics")) return "military calisthenics";
  
  const bodyPart = (ex.bodyPart || "").toLowerCase();
  const primaryMuscle = (ex.musclesWorked?.[0] || "").toLowerCase();
  const name = ex.name.toLowerCase();

  // Forearms
  if (bodyPart === "forearms" || primaryMuscle.includes("forearm") || primaryMuscle.includes("brachioradialis") || primaryMuscle.includes("grip") || primaryMuscle.includes("wrist") || name.includes("wrist") || name.includes("forearm") || name.includes("zottman")) {
    return "forearms";
  }
  // Biceps
  if (bodyPart === "biceps" || primaryMuscle.includes("biceps") || primaryMuscle.includes("bicep") || name.includes("bicep") || name.includes("preacher curl") || name.includes("concentration curl") || name.includes("spider curl") || name.includes("preacher")) {
    return "biceps";
  }
  // Triceps
  if (bodyPart === "triceps" || primaryMuscle.includes("triceps") || primaryMuscle.includes("tricep") || name.includes("tricep") || name.includes("kickback") || name.includes("pushdown") || name.includes("skull crusher") || name.includes("french press") || name.includes("close grip bench press") || name.includes("close-grip") || (name.includes("dip") && (name.includes("tricep") || name.includes("bench")))) {
    return "triceps";
  }
  // Chest
  if (bodyPart.includes("chest") || primaryMuscle.includes("chest") || primaryMuscle.includes("pec") || primaryMuscle.includes("pectoral") || name.includes("bench press") || name.includes("chest press") || name.includes("dumbbell fly") || name.includes("pec deck") || name.includes("crossover") || name.includes("pushup") || name.includes("push up") || name.includes("chest dip") || name.includes("pullover")) {
    return "chest";
  }
  // Back
  if (bodyPart.includes("back") || bodyPart === "lats" || bodyPart === "traps" || primaryMuscle.includes("lat") || primaryMuscle.includes("trap") || primaryMuscle.includes("back") || primaryMuscle.includes("rhomboid") || primaryMuscle.includes("erector") || name.includes("row") || name.includes("pullup") || name.includes("pull-up") || name.includes("pulldown") || name.includes("shrug") || name.includes("deadlift") || name.includes("hyperextension") || name.includes("face pull")) {
    if (name.includes("romanian deadlift") || name.includes("rdl") || name.includes("sumo deadlift")) {
      // legs/glutes
    } else {
      return "back";
    }
  }
  // Shoulders
  if (bodyPart === "shoulders" || primaryMuscle.includes("shoulder") || primaryMuscle.includes("delt") || primaryMuscle.includes("deltoid") || name.includes("overhead press") || name.includes("military press") || name.includes("lateral raise") || name.includes("front raise") || name.includes("rear delt") || name.includes("arnold press") || name.includes("upright row") || name.includes("shoulder press")) {
    return "shoulders";
  }
  // Glutes
  if (bodyPart === "glutes" || primaryMuscle.includes("glute") || primaryMuscle.includes("hip thrust") || primaryMuscle.includes("butt") || name.includes("hip thrust") || name.includes("glute bridge") || name.includes("frog pump") || name.includes("clamshell") || name.includes("donkey kick")) {
    return "glutes";
  }
  // Calves
  if (bodyPart === "calves" || primaryMuscle.includes("calf") || primaryMuscle.includes("calves") || primaryMuscle.includes("soleus") || primaryMuscle.includes("gastrocnemius") || primaryMuscle.includes("tibialis") || name.includes("calf raise") || name.includes("tibialis")) {
    return "calves";
  }
  // Legs
  if (bodyPart === "legs" || bodyPart === "quadriceps" || bodyPart === "hamstrings" || primaryMuscle.includes("quad") || primaryMuscle.includes("hamstring") || primaryMuscle.includes("leg") || primaryMuscle.includes("biceps femoris") || primaryMuscle.includes("rectus femoris") || primaryMuscle.includes("vastus") || name.includes("squat") || name.includes("lunge") || name.includes("leg press") || name.includes("split squat") || name.includes("leg curl") || name.includes("leg extension") || name.includes("hamstring") || name.includes("step up")) {
    return "legs";
  }
  // Core / Abs / Obliques
  if (bodyPart === "core" || bodyPart === "abs" || bodyPart === "obliques" || primaryMuscle.includes("core") || primaryMuscle.includes("abs") || primaryMuscle.includes("ab") || primaryMuscle.includes("oblique") || primaryMuscle.includes("transverse abdominis") || primaryMuscle.includes("rectus abdominis") || name.includes("plank") || name.includes("crunch") || name.includes("twist") || name.includes("leg raise") || name.includes("sit up") || name.includes("sit-up") || name.includes("rollout") || name.includes("hollow body") || name.includes("woodchopper")) {
    return "core";
  }

  return "other";
};

export default function WorkoutLibrary({ setView }: { setView?: (view: string) => void }) {
  const { 
    user, 
    exercises, 
    toggleSaveWorkout, 
    savedWorkouts, 
    logWorkoutCompletion, 
    uploadExerciseMedia,
    customPrograms,
    saveCustomProgram,
    updateCustomProgram
  } = useApp();
  const isUserPremium = user?.subscriptionStatus === "premium";
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("All");
  const [selectedEquipment, setSelectedEquipment] = useState("All");
  const [selectedExerciseType, setSelectedExerciseType] = useState("All");
  const [selectedTrainingGoal, setSelectedTrainingGoal] = useState("All");
  
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);

  // States for the interactive "Add to Program" dialog for Premium athletes
  const [addingToProgramExercise, setAddingToProgramExercise] = useState<Exercise | null>(null);
  const [selectedTargetProgramId, setSelectedTargetProgramId] = useState<string>("new");
  const [newProgramName, setNewProgramName] = useState("");
  const [targetProgramDay, setTargetProgramDay] = useState("Day 1");
  const [targetSets, setTargetSets] = useState(3);
  const [targetReps, setTargetReps] = useState(10);
  const [targetNotes, setTargetNotes] = useState("");
  const [programAddSuccess, setProgramAddSuccess] = useState(false);

  // Helper functions to determine Exercise Type and Training Goal of any exercise
  const getExerciseType = (ex: Exercise): string => {
    const nameL = ex.name.toLowerCase();
    const eqL = ex.equipment.map(e => e.toLowerCase());
    if (eqL.includes("bodyweight") && !nameL.includes("weighted")) return "Bodyweight";
    const compoundKeywords = ["squat", "deadlift", "press", "pullup", "pull-up", "row", "clean", "snatch", "lunge", "burpee", "thruster"];
    const isCompound = compoundKeywords.some(kw => nameL.includes(kw));
    return isCompound ? "Compound" : "Isolation";
  };

  const getTrainingGoal = (ex: Exercise): string => {
    const type = getExerciseType(ex);
    const diff = ex.difficulty;
    const nameL = ex.name.toLowerCase();
    if (nameL.includes("cardio") || nameL.includes("burpee") || nameL.includes("jump") || ex.category.toLowerCase().includes("cardio")) {
      return "Fat Loss & Cardio";
    }
    if (type === "Compound" && (diff === "Advanced" || diff === "Intermediate")) {
      return "Max Strength";
    }
    if (type === "Compound") {
      return "Muscle Hypertrophy";
    }
    if (type === "Bodyweight" || diff === "Beginner") {
      return "Endurance & Recovery";
    }
    return "Muscle Hypertrophy";
  };

  // Keep track of scroll offset before navigating into dedicated exercise detail page
  const libraryScrollPosRef = useRef<number>(0);

  useEffect(() => {
    if (!selectedExerciseId) {
      const targetPos = libraryScrollPosRef.current;
      if (targetPos > 0) {
        // Double-RAF ensures layout paint is finished before restoration
        const restore = () => {
          window.scrollTo({ top: targetPos, behavior: "instant" });
        };
        requestAnimationFrame(() => {
          requestAnimationFrame(restore);
        });
      }
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [selectedExerciseId]);

  const selectedExercise = useMemo(() => {
    if (!selectedExerciseId) return null;
    return exercises.find(ex => ex.id === selectedExerciseId) || null;
  }, [exercises, selectedExerciseId]);

  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  useEffect(() => {
    if (selectedExerciseId || selectedProgram) {
      // Reset scroll position of the backdrop container to top immediately and on next frame
      const resetScroll = () => {
        const cabinetBackdrop = document.getElementById("exercise-cabinet-drawer");
        if (cabinetBackdrop) {
          cabinetBackdrop.scrollTop = 0;
        }
        const programBackdrop = document.getElementById("program-cohort-detail");
        if (programBackdrop) {
          programBackdrop.scrollTop = 0;
        }
      };

      resetScroll();
      const timer = setTimeout(resetScroll, 50);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [selectedExerciseId, selectedProgram]);

  // Active view tabs for search results
  const [activeSearchTab, setActiveSearchTab] = useState<"exercises" | "mealplans">("exercises");

  // Smoothly scroll to the top of the viewport whenever the active search tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeSearchTab]);

  // Pagination for heavy exercise cards lists
  const [visibleCount, setVisibleCount] = useState(12);

  // Reset pagination count on search query or filters change
  useEffect(() => {
    setVisibleCount(12);
  }, [searchQuery, selectedCategory, selectedDifficulty, selectedMuscleGroup, selectedEquipment, selectedExerciseType, selectedTrainingGoal]);

  // Completed set logger inputs
  const [loggedReps, setLoggedReps] = useState("12");
  const [loggedWeight, setLoggedWeight] = useState("50");
  const [loggedNotes, setLoggedNotes] = useState("");
  const [logSuccess, setLogSuccess] = useState(false);

  // Live real-time loading simulation state engines
  const [isLiveLoading, setIsLiveLoading] = useState(false);
  const [liveLoadingText, setLiveLoadingText] = useState("Synchronizing core library databases...");

  const triggerLiveLoad = (message: string, duration = 380, onComplete?: () => void) => {
    setIsLiveLoading(true);
    setLiveLoadingText(message);
    setTimeout(() => {
      setIsLiveLoading(false);
      if (onComplete) onComplete();
    }, duration);
  };

  // Helper generator to dynamically craft 8-10 customized workouts
  const generateCustomSearchWorkouts = (query: string, baseExercises: Exercise[]): Exercise[] => {
    if (!query) return [];
    const cleanQuery = query.trim().toLowerCase();
    
    // Decide target muscle / style based on search term
    let targetType = "general";
    if (cleanQuery.includes("chest") || cleanQuery.includes("pec") || cleanQuery.includes("push")) {
      targetType = "chest";
    } else if (cleanQuery.includes("leg") || cleanQuery.includes("squat") || cleanQuery.includes("quad") || cleanQuery.includes("calf") || cleanQuery.includes("hamstring")) {
      targetType = "legs";
    } else if (cleanQuery.includes("back") || cleanQuery.includes("lat") || cleanQuery.includes("row") || cleanQuery.includes("pullup")) {
      targetType = "back";
    } else if (cleanQuery.includes("bicep") || cleanQuery.includes("arm") || cleanQuery.includes("tricep") || cleanQuery.includes("curl") || cleanQuery.includes("dip")) {
      targetType = "arms";
    } else if (cleanQuery.includes("ab") || cleanQuery.includes("core") || cleanQuery.includes("crunch") || cleanQuery.includes("plank")) {
      targetType = "core";
    } else if (cleanQuery.includes("shoulder") || cleanQuery.includes("deltoid") || cleanQuery.includes("press")) {
      targetType = "shoulders";
    } else if (cleanQuery.includes("cardio") || cleanQuery.includes("hiit") || cleanQuery.includes("loss") || cleanQuery.includes("burn")) {
      targetType = "cardio";
    }

    const templates = {
      chest: [
        { name: "Incline Red-Line Dumbbell Flyes", muscle: "Chest", equip: "Dumbbells, Incline Bench" },
        { name: "Decline Red-Line Cable Fly Alignment", muscle: "Lower Chest", equip: "Cables, Bench" },
        { name: "Tempo Flat Barbell Compression Press", muscle: "Middle Chest", equip: "Barbell, Flat Bench" },
        { name: "Unilateral Cable Red-Line Crossover", muscle: "Inner Chest", equip: "Cables" },
        { name: "Scapular Plane Pushup Red-Line Protocol", muscle: "Pectoralis Major", equip: "Bodyweight" },
        { name: "Isometric Chest Squeeze Stabilization", muscle: "Chest", equip: "Exercise Ball" },
        { name: "Kinesiology Dumbbell Pullover Target", muscle: "Upper Chest", equip: "Dumbbell, Bench" },
        { name: "Weighted Chest Dips Peak Fiber Squeeze", muscle: "Lower Chest", equip: "Dips Bar" },
        { name: "High-Tension Floor Dumbbell Press", muscle: "Chest, Triceps", equip: "Dumbbells" }
      ],
      legs: [
        { name: "High-Tension Barbell Back Squats", muscle: "Quads, Glutes", equip: "Barbell, Squat Rack" },
        { name: "Dynamic Red-Line Bulgarian Split Squats", muscle: "Quads, Glutes", equip: "Dumbbells, Flat Bench" },
        { name: "Romanian Dumbbell Deadlifts", muscle: "Hamstrings, Glutes", equip: "Dumbbells" },
        { name: "Seated Quad Extension Peak Fiber Squeeze", muscle: "Quads", equip: "Leg Extension Machine" },
        { name: "Lying Hamstring Curl Active Tension", muscle: "Hamstrings", equip: "Leg Curl Machine" },
        { name: "Standing Calf Raise High-Velocity Burn", muscle: "Calves", equip: "Calf Block" },
        { name: "Goblet Squat Core Stability Drive", muscle: "Quads, Core", equip: "Kettlebell" },
        { name: "Deficit Dumbbell Reverse Lunges", muscle: "Glutes, Hamstrings", equip: "Dumbbells" },
        { name: "Tibialis Anterior Red-Line Pulls", muscle: "Tibialis", equip: "Resistance Band" }
      ],
      back: [
        { name: "Weighted Lat Pullup Scapular Guide", muscle: "Lats, Upper Back", equip: "Pullup Bar, Weight Belt" },
        { name: "Bent-Over Barbell Red-Line Rows", muscle: "Middle Back, Lats", equip: "Barbell" },
        { name: "Single-Arm Dumbbell Row Peak Pull", muscle: "Lats", equip: "Dumbbells, Bench" },
        { name: "Meadows Row Extreme Lat Contraction", muscle: "Upper Back", equip: "Landmine, T-Bar" },
        { name: "Seated Cable Lat Row Active Glide", muscle: "Middle Back", equip: "Cable Machine" },
        { name: "Hyperextension Lower Column Target", muscle: "Erector Spinae", equip: "Hyperextension Bench" },
        { name: "Wide-Grip Lat Pulldown Alignment", muscle: "Lats, Teres Major", equip: "Lat Pulldown Machine" },
        { name: "Dumbbell Scapular Red-White Shrugs", muscle: "Trapezius", equip: "Dumbbells" },
        { name: "Face Pull Rear Deltoid Glide", muscle: "Rear Deltoids", equip: "Cables, Rope Attachment" }
      ],
      arms: [
        { name: "Seated Dumbbell Bicep Peaks Curl", muscle: "Biceps Brachii", equip: "Dumbbells, Bench" },
        { name: "Overhead Rope Tricep Horseshoe Extension", muscle: "Triceps Tracing", equip: "Cables, Rope" },
        { name: "EZ-Bar Preacher Curl Active Isolation", muscle: "Biceps", equip: "EZ-Bar, Preacher Bench" },
        { name: "Unilateral Cable Bicep Hammer Pull", muscle: "Brachialis", equip: "Cables" },
        { name: "Weighted Bench Dips Tricep Overload", muscle: "Triceps", equip: "Parallel Bars" },
        { name: "Incline Dumbbell Curl Peak Stretch", muscle: "Biceps Long Head", equip: "Dumbbells, Incline Bench" },
        { name: "Tricep Dumbbell Kickbacks Lock-out", muscle: "Triceps Lateral Head", equip: "Dumbbells" },
        { name: "Reverse EZ-Bar Forearm Curl", muscle: "Brachioradialis", equip: "EZ-Bar" },
        { name: "Wrist Roller High-Tension Burner", muscle: "Forearms", equip: "Wrist Roller" }
      ],
      core: [
        { name: "Hanging Leg Raise Lower Ab Shred", muscle: "Lower Abs, Hip Flexors", equip: "Pullup Bar" },
        { name: "Decline Bench Weighted Ab Crunch", muscle: "Upper Abs", equip: "Decline Bench, Plate" },
        { name: "High-Tension Cable Woodchopper Twist", muscle: "Obliques", equip: "Cable Machine" },
        { name: "Weighted Plank Core Stabilization", muscle: "Transverse Abdominis", equip: "Plank Block, Plate" },
        { name: "Russian Twist Extreme Oblique Target", muscle: "Obliques, Transverse", equip: "Medicine Ball" },
        { name: "Ab Wheel Rollout Active Alignment", muscle: "Core Columns", equip: "Ab Wheel" },
        { name: "Bicycle Crunch Isometric Alternator", muscle: "Abs, Obliques", equip: "Floor Mat" },
        { name: "Deadbug Core Stability Protocol", muscle: "Deep Core", equip: "Floor Mat" },
        { name: "Reverse Crunch Lumbar Control Flat", muscle: "Lower Abs", equip: "Floor Mat" }
      ],
      shoulders: [
        { name: "Overhead Barbell Military Power Press", muscle: "Anterior Deltoids", equip: "Barbell, Squat Rack" },
        { name: "Seated Dumbbell Lateral Cap Raise", muscle: "Lateral Deltoids", equip: "Dumbbells, Bench" },
        { name: "Rear Deltoid Fly Cable Extension", muscle: "Rear Deltoids", equip: "Cables" },
        { name: "Arnold Press Multi-Angle Rotation", muscle: "Anterior/Lateral Deltoids", equip: "Dumbbells, Bench" },
        { name: "Dumbbell Front Raise Neutral Grip", muscle: "Anterior Deltoids", equip: "Dumbbells" },
        { name: "Behind-the-Neck Press Scapular Plane", muscle: "Shoulder Cap", equip: "Barbell" },
        { name: "Cable Lateral Cap Raise Active Path", muscle: "Lateral Deltoids", equip: "Cables" },
        { name: "Dumbbell Incline Rear Deltoid Sweep", muscle: "Rear Deltoids", equip: "Dumbbells, Incline Bench" },
        { name: "Seated Shoulder Shrug Active Squeeze", muscle: "Upper Traps", equip: "Dumbbells" }
      ],
      cardio: [
        { name: "High-Intensity Assault Bike Burnout", muscle: "Full Body, Cardio", equip: "Assault Bike" },
        { name: "Slam Ball High-Velocity Cardio Drop", muscle: "Full Body, Core", equip: "Slam Ball" },
        { name: "Speed Rope High-Tempo Active Double", muscle: "Calves, Cardio", equip: "Speed Rope" },
        { name: "Weighted Sled Push Extreme Quadricep Power", muscle: "Quads, Glutes, Lung Capacity", equip: "Weighted Sled" },
        { name: "Kettlebell Swing High-Velocity Posterior", muscle: "Glutes, Hamstrings, Cardio", equip: "Kettlebell" },
        { name: "Rowing Machine Interval Speed Sprints", muscle: "Back, Cardio", equip: "Rowing Machine" },
        { name: "Burpee Pullup High-Tension Metabolic", muscle: "Full Body, Heart Rate", equip: "Pullup Bar" },
        { name: "Medicine Ball Core Slam Active Jump", muscle: "Core, Heart Rate", equip: "Medicine Ball" },
        { name: "Box Jump High-Velocity Plyometric Drive", muscle: "Quads, Calves", equip: "Plyo Box" }
      ],
      general: [
        { name: `Dynamic ${cleanQuery.toUpperCase()} Power Lift`, muscle: `${cleanQuery.toUpperCase()} Targets`, equip: "Dumbbells & Barbell" },
        { name: `High-Tension ${cleanQuery.toUpperCase()} Isolation Drive`, muscle: `${cleanQuery.toUpperCase()} Fibers`, equip: "Cables" },
        { name: `${cleanQuery.toUpperCase()} Active Joint Stabilization`, muscle: "Core & Stabilizers", equip: "Bodyweight" },
        { name: `Peak Tension ${cleanQuery.toUpperCase()} Horseshoe Squeeze`, muscle: `${cleanQuery.toUpperCase()} Peak`, equip: "Resistance Bands" },
        { name: `Unilateral ${cleanQuery.toUpperCase()} Angle Align Glide`, muscle: "Symmetry Alignment", equip: "Dumbbells" },
        { name: `Military-Style ${cleanQuery.toUpperCase()} Endurance Protocol`, muscle: "Cardio Endurance", equip: "Bodyweight" },
        { name: `Advanced ${cleanQuery.toUpperCase()} Hypertrophy Shred`, muscle: "Muscular Fibers", equip: "EZ-Bar" },
        { name: `Deficit ${cleanQuery.toUpperCase()} Range of Motion Pull`, muscle: "Muscular Length", equip: "Bench & Weight" },
        { name: `Seated Isometric ${cleanQuery.toUpperCase()} Squeeze Pro`, muscle: "Isometric Power", equip: "Flat Bench" }
      ]
    };

    const selectedList = templates[targetType as keyof typeof templates] || templates.general;

    return selectedList.map((item, idx) => {
      const isPremium = idx >= 6; // last 3 are premium to incentivize subscription!
      return {
        id: `gen-${cleanQuery.replace(/\s+/g, '-')}-${idx}`,
        name: item.name,
        category: (targetType.toUpperCase() + " SPECIALIZATION"),
        muscleGroups: [item.muscle],
        difficulty: idx % 3 === 0 ? "Beginner" : idx % 3 === 1 ? "Intermediate" : "Advanced",
        instructions: [
          `Setup with the ${item.equip} using symmetric spacing rules. Lock in dynamic scapular positioning and brace your core.`,
          `Squeeze target muscle units during the concentric drive to isolate active ${item.muscle} fibers completely.`,
          `Commit a powerful 2-second isometric peak squeeze at the lock-out of the posture.`,
          `Lower down with an elongated 3-second eccentric release, breathing in uniformly throughout.`
        ],
        equipment: item.equip.split(", "),
        commonMistakes: ["Excessive momentum", "Bending wrist alignments under load", "Skipping the isometric squeeze point"],
        safetyTips: ["Brace abdominals uniformly", "Avoid joint hyper-extensions", "Never bypass target stabilizers"],
        alternativeExercises: ["Alternative Dumbbell Drive", "Floor Mat Bodyweight Press"],
        progressionVariations: ["Add a 2-second isometric pause at stretch", "Extend the eccentric release to 4 seconds"],
        isPremium,
        startingPosition: `Hold the ${item.equip} in symmetric balance stance, stabilizing joints and bracing the abdomen.`,
        movementExecution: `Concentric contraction driving power dynamically through target ${item.muscle} fibers with high acceleration.`,
        finishingPosition: `Squeeze the apex of the lift for 2 complete seconds, then glide through a slow controlled template.`,
        regressionVariations: ["Use lighter dumbbell units", "Complete empty-handed kinesis reps"],
        musclesWorked: [item.muscle],
        gifUrl: "",
        customMediaUrl: "",
        customMediaType: undefined
      } as Exercise;
    });
  };

  // Dynamic filter lists
  const categoriesList = useMemo(() => {
    const list = new Set<string>();
    exercises.forEach(e => {
      if (e.categories && Array.isArray(e.categories)) {
        e.categories.forEach(cat => list.add(cat));
      } else if (e.category) {
        list.add(e.category);
      }
    });
    const ordered = [
      "Chest", "Back", "Shoulders", "Legs", "Biceps", "Triceps", "Forearms", "Core", "Abs", "Glutes", "Calves", "Neck",
      "Cardio", "HIIT", "Calisthenics", "Home Workouts", "Gym Workouts", "Mobility", "Stretching", "Recovery", "Warm Up", "Cool Down",
      "Yoga", "Pilates", "Functional Training", "Strength", "Powerlifting", "Olympic Lifting", "Bodybuilding", "Cross Training",
      "Athletic Performance", "Senior Fitness", "Pregnancy Safe", "Beginner", "Intermediate", "Advanced"
    ];
    const present = Array.from(list);
    const sorted = ordered.filter(o => present.some(p => p.toLowerCase() === o.toLowerCase()));
    present.forEach(p => {
      if (!sorted.some(s => s.toLowerCase() === p.toLowerCase())) {
        sorted.push(p);
      }
    });
    return ["All", ...sorted];
  }, [exercises]);

  const muscleGroupsList = useMemo(() => {
    const set = new Set<string>();
    exercises.forEach(ex => {
      ex.muscleGroups.forEach(m => set.add(m));
    });
    return ["All", ...Array.from(set).sort()];
  }, [exercises]);

  const equipmentList = useMemo(() => {
    const set = new Set<string>();
    exercises.forEach(ex => {
      ex.equipment.forEach(eq => set.add(eq));
    });
    return ["All", "No Equipment Required", "Equipment Required", ...Array.from(set).sort()];
  }, [exercises]);

  const exerciseTypesList = ["All", "Compound", "Isolation", "Bodyweight"];
  const trainingGoalsList = ["All", "Max Strength", "Muscle Hypertrophy", "Endurance & Recovery", "Fat Loss & Cardio"];

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== "All") count++;
    if (selectedDifficulty !== "All") count++;
    if (selectedMuscleGroup !== "All") count++;
    if (selectedEquipment !== "All") count++;
    if (selectedExerciseType !== "All") count++;
    if (selectedTrainingGoal !== "All") count++;
    return count;
  }, [selectedCategory, selectedDifficulty, selectedMuscleGroup, selectedEquipment, selectedExerciseType, selectedTrainingGoal]);

  // Unified Smart Search Engine and organizing matches
  const filteredExercises = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    
    // Search terms normalization and synonym expansions
    const matched = exercises.filter(ex => {
      // Allow all exercises to be visible and explainable to everyone
      
      // Filter by Category, Difficulty, Muscle, Equipment, Type and Goal
      const matchesCategory = selectedCategory === "All" || 
        ex.category === selectedCategory || 
        (ex.categories && ex.categories.includes(selectedCategory));
      const matchesDifficulty = selectedDifficulty === "All" || ex.difficulty === selectedDifficulty;
      const matchesMuscleGroup = selectedMuscleGroup === "All" || ex.muscleGroups.includes(selectedMuscleGroup);
      
      let matchesEquipment = true;
      if (selectedEquipment === "No Equipment Required") {
        matchesEquipment = ex.equipment.includes("Bodyweight") || ex.equipment.includes("None") || ex.equipment.includes("No Equipment");
      } else if (selectedEquipment === "Equipment Required") {
        matchesEquipment = !ex.equipment.includes("Bodyweight") && !ex.equipment.includes("None") && !ex.equipment.includes("No Equipment");
      } else if (selectedEquipment !== "All") {
        matchesEquipment = ex.equipment.includes(selectedEquipment);
      }

      const matchesType = selectedExerciseType === "All" || getExerciseType(ex) === selectedExerciseType;
      const matchesGoal = selectedTrainingGoal === "All" || getTrainingGoal(ex) === selectedTrainingGoal;
      
      if (!matchesCategory || !matchesDifficulty || !matchesMuscleGroup || !matchesEquipment || !matchesType || !matchesGoal) {
        return false;
      }

      // Detect equipment keywords in search bar query and intercept
      let modifiedQuery = query;
      let forceNoEquipment = false;
      let forceEquipment = false;

      if (query.includes("no equipment") || query.includes("none equipment") || query.includes("no-equipment") || query.includes("without equipment") || query.includes("free body") || query.includes("bodyweight")) {
        forceNoEquipment = true;
        modifiedQuery = query
          .replace("no equipment", "")
          .replace("none equipment", "")
          .replace("no-equipment", "")
          .replace("without equipment", "")
          .replace("free body", "")
          .replace("bodyweight", "")
          .trim();
      } else if (query.includes("with equipment") || query.includes("requires equipment") || query.includes("has equipment") || (query === "equipment" && !query.includes("no"))) {
        forceEquipment = true;
        modifiedQuery = query
          .replace("with equipment", "")
          .replace("requires equipment", "")
          .replace("has equipment", "")
          .trim();
      }

      const isBodyweight = ex.equipment.includes("Bodyweight") || ex.equipment.includes("None") || ex.equipment.includes("No Equipment");

      if (forceNoEquipment && !isBodyweight) return false;
      if (forceEquipment && isBodyweight) return false;

      if (!modifiedQuery) return true; // if they only searched "no equipment", and this exercise has no equipment, it is a match!

      const nameLower = ex.name.toLowerCase();
      const catLower = ex.category.toLowerCase();
      const bodyPartLower = (ex.bodyPart || "").toLowerCase();
      const musclesWorkedLower = ex.musclesWorked.map(m => m.toLowerCase());

      // Synonym and alias matching definitions
      const queryClean = modifiedQuery.trim().toLowerCase();
      const queryTerms = queryClean.split(/\s+/).filter(t => t.length > 0);
      if (queryTerms.length === 0) return true;

      // Check if all search terms match the exercise in some way
      return queryTerms.every(term => {
        // Direct name match
        if (nameLower.includes(term)) return true;

        // Categories match
        if (ex.categories && ex.categories.some(cat => cat.toLowerCase().includes(term))) return true;
        if (ex.category && ex.category.toLowerCase().includes(term)) return true;

        // Muscles and body parts match
        if (ex.muscleGroups && ex.muscleGroups.some(m => m.toLowerCase().includes(term))) return true;
        if (ex.musclesWorked && ex.musclesWorked.some(m => m.toLowerCase().includes(term))) return true;
        if (bodyPartLower.includes(term)) return true;

        // Equipment match
        if (ex.equipment && ex.equipment.some(eq => eq.toLowerCase().includes(term))) return true;

        // Difficulty match
        if (ex.difficulty && ex.difficulty.toLowerCase().includes(term)) return true;

        // Special movement pattern synonym logic
        if (term === "push" || term === "pushing" || term === "chest") {
          const isPush = nameLower.includes("push") || nameLower.includes("press") || nameLower.includes("extension") || nameLower.includes("dip") || nameLower.includes("kickback") || catLower.includes("chest") || catLower.includes("shoulders") || catLower.includes("triceps") || bodyPartLower.includes("chest") || bodyPartLower.includes("shoulders");
          if (isPush) return true;
        }
        if (term === "pull" || term === "pulling" || term === "back") {
          const isPull = nameLower.includes("pull") || nameLower.includes("row") || nameLower.includes("curl") || nameLower.includes("deadlift") || nameLower.includes("raise") || catLower.includes("back") || catLower.includes("biceps") || bodyPartLower.includes("back") || bodyPartLower.includes("biceps");
          if (isPull) return true;
        }
        if (term === "upper" || term === "upperbody" || term === "upper body") {
          const isUpper = !bodyPartLower.includes("leg") && !bodyPartLower.includes("calf") && !bodyPartLower.includes("glute") && (bodyPartLower.includes("chest") || bodyPartLower.includes("back") || bodyPartLower.includes("shoulder") || bodyPartLower.includes("arm") || bodyPartLower.includes("bicep") || bodyPartLower.includes("tricep") || nameLower.includes("pushup") || nameLower.includes("bench"));
          if (isUpper) return true;
        }
        if (term === "lower" || term === "lowerbody" || term === "lower body" || term === "legs") {
          const isLower = bodyPartLower.includes("leg") || bodyPartLower.includes("calf") || bodyPartLower.includes("glute") || bodyPartLower.includes("thigh") || nameLower.includes("squat") || nameLower.includes("deadlift") || nameLower.includes("lunge");
          if (isLower) return true;
        }
        if (term === "hinge") {
          if (nameLower.includes("deadlift") || nameLower.includes("hinge") || nameLower.includes("rdl") || nameLower.includes("good morning")) return true;
        }

        // Levenshtein-based fuzzy match/typo tolerance (for words of length 4 or more)
        if (term.length >= 4) {
          const levenshtein = (s1: string, s2: string): number => {
            const track = Array(s2.length + 1).fill(null).map(() => Array(s1.length + 1).fill(null));
            for (let i = 0; i <= s1.length; i += 1) track[0][i] = i;
            for (let j = 0; j <= s2.length; j += 1) track[j][0] = j;
            for (let j = 1; j <= s2.length; j += 1) {
              for (let i = 1; i <= s1.length; i += 1) {
                const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1;
                track[j][i] = Math.min(
                  track[j][i - 1] + 1,
                  track[j - 1][i] + 1,
                  track[j - 1][i - 1] + indicator
                );
              }
            }
            return track[s2.length][s1.length];
          };

          const nameWords = nameLower.split(/\s+/);
          if (nameWords.some(w => w.length >= 4 && levenshtein(w, term) <= 1)) return true;
        }

        return false;
      });
    });

    // Deduplicate any matched exercises by ID
    const seenIds = new Set<string>();
    const deduplicated = matched.filter(ex => {
      if (seenIds.has(ex.id)) return false;
      seenIds.add(ex.id);
      return true;
    });

    // If there's a search query, let's sort the results elegantly to put Core Exercises at the top!
    if (query) {
      return deduplicated.sort((a, b) => {
        const aIsCore = a.id.startsWith("core-ex-");
        const bIsCore = b.id.startsWith("core-ex-");
        
        // Push Core Exercises to the top
        if (aIsCore && !bIsCore) return -1;
        if (!aIsCore && bIsCore) return 1;

        // Secondarily rank by matching exact keywords in name
        const aNameHasQuery = a.name.toLowerCase().includes(query);
        const bNameHasQuery = b.name.toLowerCase().includes(query);
        if (aNameHasQuery && !bNameHasQuery) return -1;
        if (!aNameHasQuery && bNameHasQuery) return 1;

        return 0;
      });
    }

    return deduplicated;
  }, [exercises, searchQuery, selectedCategory, selectedDifficulty, selectedMuscleGroup, selectedEquipment, selectedExerciseType, selectedTrainingGoal, isUserPremium]);

  // Display all matching exercises
  const displayedExercises = useMemo(() => {
    return filteredExercises;
  }, [filteredExercises]);

  // Group matching exercises by category for an incredibly clean, organized, non-scattered presentation
  const groupedExercises = useMemo(() => {
    const groups: Record<string, Exercise[]> = {};
    
    filteredExercises.forEach(ex => {
      const cat = ex.category || "General";
      if (!groups[cat]) {
        groups[cat] = [];
      }
      groups[cat].push(ex);
    });
    
    // Sort each category so core exercises appear first inside the category section
    Object.keys(groups).forEach(cat => {
      groups[cat] = groups[cat].sort((a, b) => {
        const aIsCore = a.id.startsWith("core-ex-");
        const bIsCore = b.id.startsWith("core-ex-");
        if (aIsCore && !bIsCore) return -1;
        if (!aIsCore && bIsCore) return 1;
        return 0;
      });
    });

    return groups;
  }, [filteredExercises]);

  // Programs mapping for the search term
  const filteredPrograms = useMemo(() => {
    if (!searchQuery) return PROGRAMS;
    const query = searchQuery.toLowerCase();
    
    // Exact requested search specifications:
    // - "Chest" -> pull Programs mentioning Chest, V-Taper, hypertrophy
    // - "Home Workout" -> pull programs matching home, bodyweight, no equipment
    // - "Weight Loss" -> pull weight loss, shred, lean toning, fat loss
    return PROGRAMS.filter(prog => {
      const matchesName = prog.name.toLowerCase().includes(query);
      const matchesDesc = prog.description.toLowerCase().includes(query);
      const matchesTags = prog.searchTags.some(tag => tag.toLowerCase().includes(query));
      const matchesCategory = prog.category.toLowerCase().includes(query);
      
      let contextualMatch = false;
      if (query === "chest") {
        contextualMatch = prog.name.toLowerCase().includes("v taper") || prog.name.toLowerCase().includes("muscle");
      } else if (query === "home workout") {
        contextualMatch = prog.category.toLowerCase().includes("home") || prog.searchTags.includes("bodyweight");
      } else if (query === "weight loss") {
        contextualMatch = prog.name.toLowerCase().includes("shred") || prog.name.toLowerCase().includes("fat") || prog.name.toLowerCase().includes("toning") || prog.searchTags.includes("shred");
      }

      return matchesName || matchesDesc || matchesTags || matchesCategory || contextualMatch;
    });
  }, [searchQuery]);

  // Meal Plans derived from filtered programs for requested "Weight Loss" search mapping
  const filteredMealPlans = useMemo(() => {
    return filteredPrograms.filter(p => p.schedule.some(s => s.mealPlan));
  }, [filteredPrograms]);

  const handleAddExerciseToProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !addingToProgramExercise) return;

    const newExerciseItem = {
      id: addingToProgramExercise.id,
      name: addingToProgramExercise.name,
      sets: Number(targetSets) || 3,
      reps: Number(targetReps) || 10,
      notes: targetNotes || "Focus on peak contraction."
    };

    try {
      if (selectedTargetProgramId === "new") {
        // Create a brand new program
        const programTitle = newProgramName.trim() || `${addingToProgramExercise.category} Custom Routine`;
        const scheduleItem = {
          day: targetProgramDay || "Day 1",
          focus: addingToProgramExercise.category,
          exercises: [newExerciseItem]
        };

        await saveCustomProgram({
          name: programTitle,
          description: `Custom fitness schedule centering clinical ${addingToProgramExercise.name} execution.`,
          schedule: [scheduleItem]
        });
      } else {
        // Find existing program
        const existing = customPrograms.find(p => p.id === selectedTargetProgramId);
        if (existing) {
          // Check if day exists in schedule
          const updatedSchedule = [...existing.schedule];
          const dayIndex = updatedSchedule.findIndex(s => s.day === targetProgramDay);

          if (dayIndex >= 0) {
            // Append exercise to existing day
            updatedSchedule[dayIndex] = {
              ...updatedSchedule[dayIndex],
              exercises: [...updatedSchedule[dayIndex].exercises, newExerciseItem]
            };
          } else {
            // Create a new day entry
            updatedSchedule.push({
              day: targetProgramDay || "Day 1",
              focus: addingToProgramExercise.category,
              exercises: [newExerciseItem]
            });
          }

          await updateCustomProgram({
            ...existing,
            schedule: updatedSchedule
          });
        }
      }

      setProgramAddSuccess(true);
      setTimeout(() => {
        setAddingToProgramExercise(null);
        setProgramAddSuccess(false);
      }, 1500);

    } catch (err) {
      console.error("Error updating custom program:", err);
    }
  };

  const handleOpenDetail = (ex: Exercise) => {
    libraryScrollPosRef.current = window.scrollY;
    setSelectedExerciseId(ex.id);
    setLogSuccess(false);
    setLoggedNotes("");
  };

  const handleOpenProgram = (prog: Program) => {
    setSelectedProgram(prog);
  };

  const handleLogCompletion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExercise) return;
    
    logWorkoutCompletion(
      selectedExercise.id,
      parseInt(loggedReps) || 0,
      parseFloat(loggedWeight) || 0,
      loggedNotes
    );

    setLogSuccess(true);
    setTimeout(() => {
      setLogSuccess(false);
    }, 3000);
  };

  // Moved isUserPremium definition to the top of component

  const handleTriggerQuickSearch = (term: string) => {
    setSearchQuery(term);
    if (term === "Weight Loss") {
      setActiveSearchTab("mealplans");
    } else {
      setActiveSearchTab("exercises");
    }
  };

  if (selectedExercise) {
    return (
      <div id="exercise-technique-page" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in text-slate-900 dark:text-slate-100 space-y-8">
        
        {/* Navigation Head Back Button */}
        <div className="flex items-center justify-between">
          <button 
            type="button"
            onClick={() => setSelectedExerciseId(null)}
            className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono font-extrabold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Workout Library
          </button>

          <span className="text-[10px] font-mono uppercase bg-slate-200/50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 py-1.5 px-3 border border-slate-300 dark:border-slate-850 rounded-full">
            KINESIOLOGY CORE PORTAL
          </span>
        </div>

        {/* Title Block Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 relative overflow-hidden shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="relative z-10 space-y-2">
            <span className="text-[10px] font-mono font-extrabold uppercase bg-emerald-500/10 text-emerald-500 py-0.5 px-2.5 border border-emerald-500/20 rounded-full">
              {selectedExercise.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white leading-none mt-2">
              {selectedExercise.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 pt-4 text-xs font-mono">
              <span className="text-slate-550 dark:text-slate-400">DIFFICULTY LEVEL:</span>
              <span className={`px-2.5 py-0.5 rounded font-extrabold text-[10px] uppercase border ${
                selectedExercise.difficulty === "Beginner"
                  ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                  : selectedExercise.difficulty === "Intermediate"
                    ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                    : "bg-rose-500/10 text-rose-500 border-rose-500/20"
              }`}>
                {selectedExercise.difficulty}
              </span>
            </div>
          </div>

          {isUserPremium && (
            <button
              type="button"
              onClick={() => {
                setAddingToProgramExercise(selectedExercise);
                setSelectedTargetProgramId(customPrograms[0]?.id || "new");
                setNewProgramName("");
                setTargetProgramDay("Day 1");
                setTargetSets(3);
                setTargetReps(10);
                setTargetNotes("");
                setProgramAddSuccess(false);
              }}
              className="relative z-10 md:self-center px-5 py-3 bg-[#C0392B] hover:bg-[#A82E22] text-white text-xs font-black uppercase rounded-xl tracking-wider shadow flex items-center justify-center gap-2 transition-all cursor-pointer select-none"
            >
              <PlusCircle className="w-4 h-4 text-white" />
              Add to Workout Program
            </button>
          )}

          <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-radial-gradient from-blue-500/5 to-transparent pointer-events-none opacity-50" />
        </div>

        {false ? (
          <div className="space-y-6">
            {/* Visual Media Block (Blurred / Locked overlay) */}
            <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 h-64 bg-slate-950">
              <WorkoutVisual 
                category={selectedExercise.category} 
                muscleGroups={selectedExercise.muscleGroups} 
                exerciseName={selectedExercise.name} 
                className="h-full w-full filter blur-lg opacity-30" 
                customMediaUrl={selectedExercise.customMediaUrl}
                customMediaType={selectedExercise.customMediaType}
                isCard={true}
              />
              <div className="absolute inset-0 bg-slate-950/70 flex flex-col justify-center items-center text-center p-6">
                <div className="h-12 w-12 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center justify-center mb-3">
                  <Lock className="w-6 h-6 animate-pulse" />
                </div>
                <span className="text-sm font-bold font-mono text-emerald-400 uppercase tracking-widest">BIOMECHANICAL DEMO LOCKED</span>
                <span className="text-xs text-slate-400 mt-2 max-w-sm">HD video loop and kinesis align-track restricted to Premium members</span>
              </div>
            </div>

            {/* Locked Parameter Indicators Checklist */}
            <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <h4 className="text-base font-black text-slate-900 dark:text-white uppercase mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400 fill-emerald-400 animate-pulse" />
                Locked Kinesiology Parameters
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                Your current free-tier account is restricted from reading the 11 key training parameters for **{selectedExercise.name}**:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { num: "01", name: "HD Demonstration Loop", desc: "Interactive full range of motion." },
                  { num: "02", name: "Starting Alignment Position", desc: "Skeletal setups and joint angles." },
                  { num: "03", name: "Concentric Execution", desc: "Optimal force speed and direction." },
                  { num: "04", name: "Peak Finishing Squeeze", desc: "Holding concentric active tension." },
                  { num: "05", name: "Target Muscle Groups", desc: "Deep anatomical muscle breakdowns." },
                  { num: "06", name: "Form Warning Mistakes", desc: "Safety callouts protecting tendons." },
                  { num: "07", name: "Progression Variations", desc: "Complex muscular loading styles." },
                  { num: "08", name: "Alternative Exercises", desc: "Sub-swaps for versatile equipment." }
                ].map((item) => (
                  <div key={item.num} className="p-4 rounded-2xl border border-slate-205 dark:border-slate-850 bg-slate-50 dark:bg-slate-950/60 text-xs flex gap-3 shadow-xs">
                    <span className="font-mono text-emerald-500 font-extrabold text-[12px] mt-0.5">{item.num}</span>
                    <div>
                      <p className="font-extrabold text-slate-800 dark:text-white leading-tight uppercase text-[9px] font-mono">{item.name}</p>
                      <p className="text-[9px] text-slate-450 dark:text-slate-400 leading-snug mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Premium Benefits Box */}
            <div className="p-6 rounded-3xl border border-emerald-500/10 bg-emerald-500/5 text-xs sm:text-sm">
              <h5 className="font-extrabold uppercase font-mono text-[9px] tracking-widest text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-500" />
                AlexFitnessHub Premium Benefits
              </h5>
              <ul className="space-y-2 font-sans leading-relaxed text-slate-705 dark:text-emerald-300/80 text-xs">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-extrabold">&#10004;</span> Full access to <strong>1,200+ clinical exercises</strong> with biomechanical details.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-extrabold">&#10004;</span> Dedicated <strong>AI Fitness Coach</strong> for 24/7 posture checks.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-extrabold">&#10004;</span> Special <strong>Celebrity & Military Training Programs</strong> guides.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-extrabold">&#10004;</span> <strong>African & Global Meal Generators</strong> with regional macro-tailored options.
                </li>
              </ul>
            </div>

            {/* Secure Checkout CTA */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 text-slate-900 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
              <div>
                <h4 className="text-sm font-black uppercase tracking-wider font-mono text-[#D32F2F]">Unlock Master kinesis library</h4>
                <p className="text-xs text-slate-500 mt-1 lines-snug">
                  Activate your premium features securely. Cancel anytime.
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedExerciseId(null);
                  setView?.("pricing");
                }}
                className="w-full sm:w-auto px-6 py-3 bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-xs font-black uppercase rounded-xl tracking-wider shadow hover:shadow-lg transition-all shrink-0 cursor-pointer"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Visual Media & Logger */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
                <h4 className="text-[11px] font-extrabold tracking-wider text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1.5 font-mono">
                  <Sparkles className="w-4 h-4 text-[#C0392B] animate-pulse" />
                  EXERCISE SPECIFICATION & DETAILS
                </h4>
                
                <div className="rounded-2xl overflow-hidden border border-slate-150 dark:border-slate-850">
                  <WorkoutVisual 
                    exerciseId={selectedExercise.id}
                    category={selectedExercise.category} 
                    muscleGroups={selectedExercise.muscleGroups} 
                    exerciseName={selectedExercise.name} 
                    className="w-full animate-fade-in" 
                    customMediaUrl={selectedExercise.customMediaUrl}
                    customMediaType={selectedExercise.customMediaType}
                  />
                </div>
              </div>

              {/* Manually upload custom demonstration GIF */}
              {user?.email?.toLowerCase().trim() === "alexfitnesshub@gmail.com" && (
                <CustomPerformanceUpload 
                  exercise={selectedExercise} 
                  uploadExerciseMedia={uploadExerciseMedia} 
                />
              )}

              {/* LOG COMPLETION STATE CONFORM LOGIC */}
              {user ? (
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider font-mono">
                    Log Workout Performance
                  </h4>

                  {logSuccess ? (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/22 rounded-2xl text-xs text-emerald-605 dark:text-emerald-405 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 shrink-0" />
                      Form submission recorded cleanly. Sync completed with user dashboard index!
                    </div>
                  ) : (
                    <form onSubmit={handleLogCompletion} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 dark:text-slate-505 uppercase font-mono mb-1.5">Target Reps</label>
                        <input
                          type="number"
                          value={loggedReps}
                          onChange={(e) => setLoggedReps(e.target.value)}
                          className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-950 border border-slate-201 dark:border-slate-850 text-slate-950 dark:text-white rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 dark:text-slate-550 uppercase font-mono mb-1.5">Target Load (KG)</label>
                        <input
                          type="number"
                          value={loggedWeight}
                          onChange={(e) => setLoggedWeight(e.target.value)}
                          className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-950 border border-slate-201 dark:border-slate-850 text-slate-950 dark:text-white rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-emerald-500"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[9px] font-bold text-slate-400 dark:text-slate-550 uppercase font-mono mb-1.5">Coaching notes and performance index</label>
                        <input
                          type="text"
                          placeholder="Felt excellent contraction. Joint movement felt completely stable."
                          value={loggedNotes}
                          onChange={(e) => setLoggedNotes(e.target.value)}
                          className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-950 border border-slate-201 dark:border-slate-850 text-slate-950 dark:text-white rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-emerald-500"
                        />
                      </div>
                      <button
                        type="submit"
                        className="sm:col-span-2 py-3 bg-[#1E3A8A] hover:bg-[#1E40AF] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest font-mono flex items-center justify-center gap-1.5 shadow-sm hover:shadow transition-all cursor-pointer"
                      >
                        <PlusCircle className="w-4 h-4" />
                        Log Workout Set
                      </button>
                    </form>
                  )}
                </div>
              ) : (
                <div className="p-4 text-center rounded-3xl bg-white dark:bg-slate-900 text-xs text-slate-500 border border-dashed border-slate-200 dark:border-slate-800/80">
                  Please sign-in to enroll, save routines, track sets, and compile dynamic history charts.
                </div>
              )}

            </div>

            {/* Right Column: Biomechanics, Checklist, Equipment & Variations */}
            <div className="lg:col-span-7 space-y-6">

              {/* HOW TO PERFORM & TARGET MUSCLES */}
              <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-5 shadow-xs">
                <h4 className="text-sm font-extrabold text-blue-600 dark:text-emerald-400 uppercase tracking-wider font-mono border-b border-slate-100 dark:border-slate-850 pb-3 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-blue-500 dark:text-emerald-400" />
                  Kinesiological Execution Guide
                </h4>

                <div className="space-y-4 text-xs leading-relaxed">
                  {/* Starting Position */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl">
                    <span className="font-extrabold text-blue-700 dark:text-blue-400 block uppercase text-[10px] font-mono tracking-wider">Starting Setup Alignment:</span>
                    <p className="text-slate-650 dark:text-slate-300 mt-1 leading-relaxed">{selectedExercise.startingPosition}</p>
                  </div>

                  {/* Movement Execution */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl">
                    <span className="font-extrabold text-orange-655 dark:text-orange-400 block uppercase text-[10px] font-mono tracking-wider">Active Range Execution:</span>
                    <p className="text-slate-655 dark:text-slate-300 mt-1 leading-relaxed">{selectedExercise.movementExecution}</p>
                  </div>

                  {/* Finishing Position */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl">
                    <span className="font-extrabold text-purple-655 dark:text-purple-400 block uppercase text-[10px] font-mono tracking-wider">Finishing Lock & Squeeze:</span>
                    <p className="text-slate-655 dark:text-slate-300 mt-1 leading-relaxed">{selectedExercise.finishingPosition}</p>
                  </div>

                  {/* Step-by-Step Instructions list */}
                  {selectedExercise.instructions && selectedExercise.instructions.length > 0 && (
                    <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-150 dark:border-slate-850/60 space-y-3">
                      <span className="font-extrabold text-slate-800 dark:text-white block uppercase text-[10px] font-mono tracking-wider">Step-by-Step Technique Instructions:</span>
                      <ol className="space-y-2">
                        {selectedExercise.instructions.map((inst, index) => (
                          <li key={index} className="flex gap-2.5 text-xs text-slate-655 dark:text-slate-300 leading-relaxed">
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono font-bold text-emerald-500 shrink-0">
                              {index + 1}
                            </span>
                            <span>{inst}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* Dynamic Coaching Parameter Cards (Breathing & Target Recommendations) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Breathing instructions */}
                    {selectedExercise.breathingInstructions && (
                      <div className="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10 space-y-1.5">
                        <span className="font-extrabold text-blue-600 dark:text-blue-400 block uppercase text-[10px] font-mono tracking-wider flex items-center gap-1.5">
                          <RotateCcw className="w-3.5 h-3.5" />
                          Breathing Control
                        </span>
                        <p className="text-xs text-slate-705 dark:text-slate-300 leading-relaxed font-sans">
                          {selectedExercise.breathingInstructions}
                        </p>
                      </div>
                    )}

                    {/* Recommended Sets & Reps */}
                    {selectedExercise.recommendedSetsReps && (
                      <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 space-y-1.5">
                        <span className="font-extrabold text-emerald-600 dark:text-emerald-400 block uppercase text-[10px] font-mono tracking-wider flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5" />
                          Training Metrics
                        </span>
                        <p className="text-xs text-slate-705 dark:text-slate-300 leading-relaxed font-sans font-bold">
                          {selectedExercise.recommendedSetsReps}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Exercise Benefits */}
                  {selectedExercise.benefits && selectedExercise.benefits.length > 0 && (
                    <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-150 dark:border-slate-850/60 space-y-2">
                      <span className="font-extrabold text-slate-500 dark:text-slate-400 block uppercase text-[10px] font-mono tracking-wider">Biomechanical Benefits:</span>
                      <ul className="space-y-1.5">
                        {selectedExercise.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-slate-705 dark:text-slate-300 leading-relaxed">
                            <span className="text-emerald-500 font-extrabold mt-0.5">&#10004;</span>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Training Recommendations */}
                  {selectedExercise.trainingRecommendations && (
                    <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-150 dark:border-slate-850/60 space-y-1.5">
                      <span className="font-extrabold text-slate-500 dark:text-slate-400 block uppercase text-[10px] font-mono tracking-wider">Coach Training Tips:</span>
                      <p className="text-slate-705 dark:text-slate-300 leading-relaxed font-sans">
                        {selectedExercise.trainingRecommendations}
                      </p>
                    </div>
                  )}

                  {/* Muscles Worked */}
                  <div>
                    <span className="font-extrabold text-slate-500 dark:text-slate-400 block uppercase text-[10px] font-mono tracking-wider mb-2">Prime Target Muscle Groups:</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedExercise.musclesWorked.map((muscle) => (
                        <span key={muscle} className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[9px] font-extrabold px-3 py-1.5 rounded-lg uppercase font-mono">
                          {muscle}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* EQUIPMENT CHECKLIST */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
                <h4 className="text-xs font-black tracking-wider text-slate-500 dark:text-slate-400 uppercase font-mono">
                  EQUIPMENT SPECIFICATION
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedExercise.equipment.map((eq) => (
                    <div key={eq} className="flex items-center gap-3 p-3 rounded-xl bg-slate-55 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 text-xs">
                      <div className="bg-emerald-500/10 text-emerald-500 opacity-90 rounded-full p-1 border border-emerald-500/10">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white uppercase text-[10px] font-mono leading-tight">{eq}</p>
                        <p className="text-[8px] text-slate-450 dark:text-slate-500 leading-none mt-1">Verified equipment alignment</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* COMMON MISTAKES & SAFETY TIPS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Common Mistakes */}
                <div className="p-5 rounded-3xl bg-rose-500/5 border border-rose-500/15">
                  <h5 className="text-xs font-bold text-rose-600 dark:text-rose-455 uppercase font-mono tracking-wider flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    Forms to Avoid
                  </h5>
                  <ul className="space-y-2 text-xs text-slate-655 dark:text-rose-350 leading-relaxed">
                    {selectedExercise.commonMistakes.map((mistake, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="shrink-0 text-rose-500 font-extrabold">&#10006;</span>
                        <span>{mistake}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Safety Tips */}
                <div className="p-5 rounded-3xl bg-amber-500/5 border border-amber-500/15">
                  <h5 className="text-xs font-bold text-amber-600 dark:text-amber-455 uppercase font-mono tracking-wider flex items-center gap-2 mb-3">
                    <Shield className="w-4 h-4 shrink-0" />
                    Safety Callouts
                  </h5>
                  <ul className="space-y-2 text-xs text-slate-655 dark:text-amber-350 leading-relaxed">
                    {selectedExercise.safetyTips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="shrink-0 text-amber-600 dark:text-amber-500 font-extrabold">&#10004;</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* EXERCISE VARIATIONS */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
                <h5 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest font-mono border-b border-slate-100 dark:border-slate-850 pb-2">
                  Clinical Training Variations
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950">
                    <span className="block text-[8px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">Alternative Swaps</span>
                    <p className="text-slate-800 dark:text-slate-200 font-bold mt-1.5 leading-snug">
                      {selectedExercise.alternativeExercises.join(" / ") || "Standard swaps apply"}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950">
                    <span className="block text-[8px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">Advanced Progression</span>
                    <p className="text-slate-800 dark:text-slate-200 font-bold mt-1.5 leading-snug">
                      {selectedExercise.progressionVariations.join(" / ") || "High density loads"}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950">
                    <span className="block text-[8px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">Regression Options</span>
                    <p className="text-slate-800 dark:text-slate-200 font-bold mt-1.5 leading-snug">
                      {selectedExercise.regressionVariations.join(" / ") || "Knee assisted splits"}
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    );
  }

  return (
    <div id="workout-library-root" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white text-slate-900 min-h-screen relative">
      
      {/* Real-time Click Loading Overlay Simulation */}
      {isLiveLoading && (
        <div className="fixed inset-0 z-55 flex flex-col items-center justify-center bg-white/95 backdrop-blur-[2px] animate-fade-in">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#C0392B] border-t-transparent" />
            <span className="font-sans font-black text-xs uppercase tracking-widest text-[#C0392B] animate-pulse">
              {liveLoadingText}
            </span>
            <span className="text-[10px] text-slate-400 font-mono tracking-wider">LIVE ALEXFITNESSHUB SYNC</span>
          </div>
        </div>
      )}

      {/* 1. HEADER TITLE SECTION (Fully customized Red & White) */}
      <PageHero
        title="Workout Library"
        subtitle="Verified Kinesiology Engine"
        description="Explore hundreds of compound and isolation exercises with step-by-step clinical instructions, kinesiologist tutorials, and proper target technique tracking. Active database is fully calibrated for optimal physique transformation."
        imageUrl="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop"
        category="PHYSIQUE TRANSFORMATION"
      />

      {/* 2. INSTANT SEARCH ENGINE BAR */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
        {/* Search input field */}
        <div className="md:col-span-8 relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#C0392B]">
            <Search className="w-4 h-4 text-[#C0392B]" />
          </span>
          <input
            type="text"
            placeholder="Search e.g., 'Chest', 'Legs', 'Abs', 'Dumbbells', 'Cardio', etc..."
            value={searchQuery}
            onChange={(e) => {
              const val = e.target.value;
              setSearchQuery(val);
              // Proactively switch tabs when specialized searches take place to focus results
              if (val.toLowerCase().includes("weight") || val.toLowerCase().includes("loss")) {
                setActiveSearchTab("mealplans");
              } else {
                setActiveSearchTab("exercises");
              }
            }}
            className="w-full pl-10 pr-4 py-3 bg-white text-[#C0392B] border-2 border-[#C0392B]/20 rounded-xl text-xs focus:outline-none focus:border-[#C0392B] placeholder:text-[#C0392B]/40 font-bold tracking-wide shadow-xs transition-colors"
          />
        </div>

        {/* Filters Toggle Button */}
        <div className="md:col-span-4">
          <button
            type="button"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`w-full py-3 px-4 border-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer ${
              showAdvancedFilters || activeFiltersCount > 0
                ? "bg-[#C0392B] border-[#C0392B] text-white"
                : "bg-white border-red-100 hover:border-[#C0392B]/40 text-[#C0392B]"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Advanced Filters</span>
            {activeFiltersCount > 0 && (
              <span className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${showAdvancedFilters || activeFiltersCount > 0 ? "bg-white text-[#C0392B]" : "bg-[#C0392B] text-white"}`}>
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Advanced Filter Panel Dropdown */}
      {showAdvancedFilters && (
        <div className="p-5 mb-6 rounded-2xl border border-red-100 bg-red-50/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
          
          {/* Body Part / Category */}
          <div className="space-y-1">
            <label className="block text-[10px] font-black text-[#C0392B] uppercase font-mono tracking-wider">Body Part / Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                const val = e.target.value;
                triggerLiveLoad(`Sorting exercises for ${val}...`, 300, () => setSelectedCategory(val));
              }}
              className="w-full p-2.5 bg-white border border-red-100 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#C0392B] transition-colors cursor-pointer"
            >
              <option value="All">All Body Parts</option>
              {categoriesList.filter(c => c !== "All").map(cat => (
                <option key={cat} value={cat}>{cat} Routines</option>
              ))}
            </select>
          </div>

          {/* Muscle Group */}
          <div className="space-y-1">
            <label className="block text-[10px] font-black text-[#C0392B] uppercase font-mono tracking-wider">Muscle Group</label>
            <select
              value={selectedMuscleGroup}
              onChange={(e) => {
                const val = e.target.value;
                triggerLiveLoad(`Isolating ${val} fibers...`, 300, () => setSelectedMuscleGroup(val));
              }}
              className="w-full p-2.5 bg-white border border-red-100 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#C0392B] transition-colors cursor-pointer"
            >
              <option value="All">All Muscle Groups</option>
              {muscleGroupsList.filter(m => m !== "All").map(muscle => (
                <option key={muscle} value={muscle}>{muscle}</option>
              ))}
            </select>
          </div>

          {/* Equipment */}
          <div className="space-y-1">
            <label className="block text-[10px] font-black text-[#C0392B] uppercase font-mono tracking-wider">Equipment</label>
            <select
              value={selectedEquipment}
              onChange={(e) => {
                const val = e.target.value;
                triggerLiveLoad(`Filtering for ${val}...`, 300, () => setSelectedEquipment(val));
              }}
              className="w-full p-2.5 bg-white border border-red-100 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#C0392B] transition-colors cursor-pointer"
            >
              <option value="All">All Equipment</option>
              {equipmentList.filter(eq => eq !== "All").map(eq => (
                <option key={eq} value={eq}>{eq}</option>
              ))}
            </select>
          </div>

          {/* Difficulty Level */}
          <div className="space-y-1">
            <label className="block text-[10px] font-black text-[#C0392B] uppercase font-mono tracking-wider">Difficulty Level</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => {
                const val = e.target.value;
                triggerLiveLoad(`Filtering for ${val} levels...`, 300, () => setSelectedDifficulty(val));
              }}
              className="w-full p-2.5 bg-white border border-red-100 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#C0392B] transition-colors cursor-pointer"
            >
              <option value="All">All Difficulties</option>
              <option value="Beginner">Beginner Level</option>
              <option value="Intermediate">Intermediate Level</option>
              <option value="Advanced">Advanced Level</option>
            </select>
          </div>

          {/* Exercise Type */}
          <div className="space-y-1">
            <label className="block text-[10px] font-black text-[#C0392B] uppercase font-mono tracking-wider">Exercise Type</label>
            <select
              value={selectedExerciseType}
              onChange={(e) => {
                const val = e.target.value;
                triggerLiveLoad(`Filtering for ${val} mechanics...`, 300, () => setSelectedExerciseType(val));
              }}
              className="w-full p-2.5 bg-white border border-red-100 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#C0392B] transition-colors cursor-pointer"
            >
              <option value="All">All Exercise Types</option>
              <option value="Compound">Compound Movements</option>
              <option value="Isolation">Isolation Movements</option>
              <option value="Bodyweight">Bodyweight Movements</option>
            </select>
          </div>

          {/* Training Goal */}
          <div className="space-y-1">
            <label className="block text-[10px] font-black text-[#C0392B] uppercase font-mono tracking-wider">Training Goal</label>
            <select
              value={selectedTrainingGoal}
              onChange={(e) => {
                const val = e.target.value;
                triggerLiveLoad(`Filtering for ${val}...`, 300, () => setSelectedTrainingGoal(val));
              }}
              className="w-full p-2.5 bg-white border border-red-100 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#C0392B] transition-colors cursor-pointer"
            >
              <option value="All">All Training Goals</option>
              <option value="Max Strength">Max Strength</option>
              <option value="Muscle Hypertrophy">Muscle Hypertrophy</option>
              <option value="Endurance & Recovery">Endurance & Recovery</option>
              <option value="Fat Loss & Cardio">Fat Loss & Cardio</option>
            </select>
          </div>

          {/* Quick Clear Filter Button */}
          <div className="sm:col-span-2 lg:col-span-3 flex justify-end pt-2 border-t border-red-100/50">
            <button
              type="button"
              onClick={() => {
                triggerLiveLoad("Clearing active filters...", 350, () => {
                  setSelectedCategory("All");
                  setSelectedDifficulty("All");
                  setSelectedMuscleGroup("All");
                  setSelectedEquipment("All");
                  setSelectedExerciseType("All");
                  setSelectedTrainingGoal("All");
                });
              }}
              className="px-4 py-1.5 border border-[#C0392B] hover:bg-red-50 text-[#C0392B] font-mono text-[10px] font-bold uppercase rounded-lg transition-all cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}

      {/* 3. QUICK SUGGESTIONS TRIGGER BAITS */}
      <div className="mb-8 flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-bold text-[#C0392B]/80 font-mono flex items-center uppercase py-1 select-none">SEARCH SUGGESTIONS:</span>
        {[
          { label: "Chest Training", term: "Chest" },
          { label: "Back Posture", term: "Back" },
          { label: "Legs & Lower", term: "Legs" },
          { label: "Home Workouts", term: "Home Workout" },
          { label: "Cardio & Fat Loss", term: "Cardio" },
          { label: "Military Calisthenics", term: "Military Calisthenics" },
          { label: "Abs & Core", term: "Abs & Core" },
          { label: "Shoulders & Arms", term: "Shoulders & Arms" }
        ].map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => {
              triggerLiveLoad(`Analyzing "${item.label}" kinematics...`, 450, () => handleTriggerQuickSearch(item.term));
            }}
            className={`px-3.5 py-1.5 border hover:border-[#C0392B]/40 text-[10px] rounded-full font-mono font-bold tracking-wide transition shadow-xs flex items-center gap-1 ${
              searchQuery === item.term
                ? "bg-[#C0392B] text-white border-transparent"
                : "bg-white text-[#C0392B] border-red-100"
            }`}
          >
            {searchQuery === item.term && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
            {item.label}
          </button>
        ))}
      </div>

      {/* 4. MULTIPLEX INSTANT ORGANIZER TABS (Visible especially when searching) */}
      <div id="search-multiplex-tabs" className="mb-6 border-b-2 border-red-100 flex items-center justify-between">
        <div className="flex gap-4">
          <button
            onClick={() => {
              triggerLiveLoad("Fetching exercises list...", 300, () => setActiveSearchTab("exercises"));
            }}
            className={`pb-3 text-xs uppercase tracking-wider font-bold font-mono transition-all flex items-center gap-2 border-b-2 relative -mb-[2px] ${
              activeSearchTab === "exercises" 
                ? "text-[#C0392B] border-[#C0392B]" 
                : "text-slate-400 border-transparent hover:text-slate-600"
            }`}
          >
            <Dumbbell className="w-4 h-4 text-[#C0392B]" />
            Exercises Matching ({filteredExercises.length})
          </button>
          {searchQuery && (searchQuery.toLowerCase().includes("weight") || searchQuery.toLowerCase().includes("loss")) && (
            <button
              onClick={() => {
                triggerLiveLoad("Fetching regional meal plans...", 300, () => setActiveSearchTab("mealplans"));
              }}
              className={`pb-3 text-xs uppercase tracking-wider font-bold font-mono transition-all flex items-center gap-2 border-b-2 relative -mb-[2px] ${
                activeSearchTab === "mealplans" 
                  ? "text-[#C0392B] border-[#C0392B]" 
                  : "text-slate-400 border-transparent hover:text-slate-600"
            }`}
            >
              <Apple className="w-4 h-4 text-[#C0392B]" />
              Weight Loss Meal Plans ({filteredMealPlans.length})
            </button>
          )}
        </div>

        {searchQuery && (
          <div className="text-[10px] text-[#C0392B] font-mono tracking-wide uppercase select-none pb-3 hidden sm:block font-bold">
            Found {filteredExercises.length} drills & {filteredPrograms.length} premium tracks for <span className="font-extrabold text-[#C0392B] underline">"{searchQuery}"</span>
          </div>
        )}
      </div>

      {/* 5. MATCHING EXERCISES TAB RENDER */}
      {activeSearchTab === "exercises" && (
        <div>
          {searchQuery && (
            <div className="mb-6 p-4 rounded-xl border border-red-100 bg-red-50/20 text-xs text-[#C0392B] font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
              <div>
                <span className="uppercase tracking-widest text-[9px] block text-[#C0392B]/70 font-mono">Real-Time Search Generation</span>
                <span className="text-sm font-black">Generated 9 Custom Workouts for "{searchQuery}"</span>
              </div>
              <div className="text-[10px] bg-white border border-[#C0392B]/25 py-1 px-2.5 rounded-md tracking-wider font-mono">
                100% KINESIOLOGY VERIFIED
              </div>
            </div>
          )}

          {filteredExercises.length === 0 ? (
            <div className="p-12 text-center border-2 border-dashed border-red-100 rounded-2xl bg-white shadow-xs">
              <HelpCircle className="w-10 h-10 text-[#C0392B] mx-auto mb-3" />
              <h4 className="text-sm font-bold text-[#C0392B]">No compound exercises match the query</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">Reset filters or browse other sections using the recommendations above.</p>
              <button 
                onClick={() => {
                  triggerLiveLoad("Resetting parameters...", 400, () => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                    setSelectedDifficulty("All");
                    setSelectedMuscleGroup("All");
                    setSelectedEquipment("All");
                    setSelectedExerciseType("All");
                    setSelectedTrainingGoal("All");
                  });
                }}
                className="mt-4 px-5 py-2 bg-[#C0392B] hover:bg-[#A82E22] text-white text-[10px] font-bold rounded-lg uppercase tracking-widest font-mono transition-all"
              >
                Reset Search Filters
              </button>

              <div className="mt-6 pt-4 border-t border-red-100 max-w-sm mx-auto">
                <p className="text-[10px] text-[#C0392B] font-mono uppercase mb-2 font-bold">Or Craft It Instantly:</p>
                <button
                  onClick={() => setView?.("workout-generator")}
                  className="w-full py-2.5 bg-[#C0392B] hover:bg-[#A82E22] text-white text-[10px] font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 shadow-md active:scale-95 duration-150 transition-all font-mono"
                >
                  <Sparkles className="w-4 h-4 animate-pulse text-yellow-300" />
                  Forge "{searchQuery}" with AI
                </button>
              </div>
            </div>
          ) : selectedCategory === "All" ? (
            /* CATEGORY-GROUPED PRESENTATION: Organizes workouts strictly by their category */
            <div className="space-y-12">
              {(Object.entries(groupedExercises) as [string, Exercise[]][]).map(([categoryName, categoryList]) => {
                // Show all exercises in this category
                const topExercises = categoryList;
                
                return (
                  <div key={categoryName} className="space-y-4">
                    {/* Category Section Header */}
                    <div className="flex items-center justify-between border-b-2 border-red-50 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-[#C0392B]" />
                        <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight uppercase font-mono">
                          {categoryName} Workouts
                        </h3>
                        <span className="text-[9px] bg-red-50 text-[#C0392B] font-mono px-2 py-0.5 rounded-full font-extrabold uppercase">
                          {categoryList.length} {categoryList.length === 1 ? "drill" : "drills"}
                        </span>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => {
                          triggerLiveLoad(`Opening full ${categoryName} suite...`, 350, () => {
                            setSelectedCategory(categoryName);
                          });
                        }}
                        className="text-xs font-mono font-bold text-[#C0392B] hover:text-[#A82E22] flex items-center gap-1 transition-all cursor-pointer"
                      >
                        View All {categoryName}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Category Exercise Grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {topExercises.map((ex) => {
                        const isSaved = savedWorkouts.includes(ex.id);
                        const needsUpgrade = ex.isPremium && !isUserPremium;
                        
                        return (
                          <div 
                            key={ex.id}
                            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all"
                          >
                            {/* Visual Media Block */}
                            <div className="relative">
                              <WorkoutVisual 
                                exerciseId={ex.id}
                                category={ex.category} 
                                muscleGroups={ex.muscleGroups} 
                                exerciseName={ex.name} 
                                className="h-44 w-full" 
                                customMediaUrl={ex.customMediaUrl}
                                customMediaType={ex.customMediaType}
                                isCard={true}
                              />
                              
                              {/* Premium Badge */}
                              {ex.isPremium && (
                                <div className="absolute top-3 left-3 bg-[#C0392B] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                                  <Sparkles className="w-3 h-3 text-white fill-white" />
                                  PREMIUM
                                </div>
                              )}

                              {/* Difficulty Label */}
                              <div className="absolute top-3 right-3 bg-[#C0392B] text-white text-[9px] font-sans font-bold uppercase px-2.5 py-1 rounded border border-white/20 z-10">
                                {ex.difficulty}
                              </div>
                            </div>

                            {/* Content Body Block */}
                            <div className="p-5 flex flex-col justify-between flex-1 bg-white">
                              <div>
                                <div className="text-[9px] text-[#C0392B] uppercase font-sans tracking-wide mb-1.5 font-bold">{ex.category}</div>
                                <h3 className="font-sans font-black text-base text-[#C0392B] tracking-tight leading-snug group-hover:text-[#A82E22] transition-colors">
                                  {ex.name}
                                </h3>
                                <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                                  {ex.instructions[0]} Focus on perfect execution.
                                </p>

                                <div className="mt-4 flex flex-wrap gap-1.5">
                                  {ex.equipment.map((eq) => (
                                    <span key={eq} className="bg-red-50 text-[9px] font-sans font-extrabold text-[#C0392B] px-2 py-1 rounded uppercase border border-red-100/50">
                                      {eq}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Action trigger footer */}
                              <div className="mt-6 pt-4 border-t border-red-50 flex items-center justify-between gap-2">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    triggerLiveLoad("Updating saved collection...", 300, () => toggleSaveWorkout(ex.id));
                                  }}
                                  className={`text-[10px] px-2 py-2 rounded-lg font-bold uppercase transition-all cursor-pointer ${
                                    isSaved 
                                      ? "bg-red-100 text-[#C0392B]"
                                      : "border border-red-200 hover:bg-red-50 text-[#C0392B]"
                                  }`}
                                >
                                  {isSaved ? "Saved" : "Save"}
                                </button>

                                {isUserPremium && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setAddingToProgramExercise(ex);
                                      setSelectedTargetProgramId(customPrograms[0]?.id || "new");
                                      setNewProgramName("");
                                      setTargetProgramDay("Day 1");
                                      setTargetSets(3);
                                      setTargetReps(10);
                                      setTargetNotes("");
                                      setProgramAddSuccess(false);
                                    }}
                                    className="px-2 py-2 rounded-lg text-[10px] font-bold border border-[#C0392B] hover:bg-red-50 text-[#C0392B] flex items-center gap-1 uppercase transition-all cursor-pointer select-none"
                                  >
                                    <PlusCircle className="w-3.5 h-3.5 text-[#C0392B]" />
                                    + Program
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() => {
                                    triggerLiveLoad(`Analyzing execution for ${ex.name}...`, 400, () => handleOpenDetail(ex));
                                  }}
                                  className="px-4 py-2 rounded-lg text-[10px] font-bold text-white uppercase bg-[#C0392B] hover:bg-[#A82E22] flex items-center gap-1.5 transition shadow-sm hover:shadow cursor-pointer"
                                >
                                  {ex.isPremium ? (
                                    <>
                                      <Sparkles className="w-3.5 h-3.5 text-red-200 fill-white" />
                                      Premium Tech
                                    </>
                                  ) : (
                                    <>
                                      View Technique
                                      <ChevronRight className="w-3.5 h-3.5" />
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* Premium Upgrade Overlay if free (Disabled to allow direct Technique views) */}
                            {false && needsUpgrade && (
                              <div className="absolute inset-0 z-10 bg-[#C0392B]/95 p-6 flex flex-col justify-center items-center text-center text-white">
                                <div className="h-10 w-10 bg-white/15 text-white border border-white/20 rounded-full flex items-center justify-center mb-2 animate-bounce">
                                  <Lock className="w-5 h-5" />
                                </div>
                                <h4 className="text-xs font-black tracking-wider uppercase text-white">Premium Locked</h4>
                                <p className="text-[10px] text-red-100 max-w-xs mt-1 leading-snug font-medium">
                                  Unlock step-by-step master tutorials, target anatomy maps, and interactive performance tracking.
                                </p>
                                <button
                                  type="button"
                                  onClick={() => {
                                    triggerLiveLoad("Loading premium gateway...", 400, () => handleOpenDetail(ex));
                                  }}
                                  className="mt-3 px-4 py-2 bg-white text-[#C0392B] text-[10px] font-black uppercase rounded-lg shadow-sm hover:bg-red-50 transition-all cursor-pointer"
                                >
                                  Preview Benefits
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* SINGLE CATEGORY FULL LIST VIEW WITH PAGINATION */
            <div className="space-y-8">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedExercises.map((ex) => {
                  const isSaved = savedWorkouts.includes(ex.id);
                  const needsUpgrade = ex.isPremium && !isUserPremium;
                  
                  return (
                    <div 
                      key={ex.id}
                      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all"
                    >
                      {/* Visual Media Block */}
                      <div className="relative">
                        <WorkoutVisual 
                          exerciseId={ex.id}
                          category={ex.category} 
                          muscleGroups={ex.muscleGroups} 
                          exerciseName={ex.name} 
                          className="h-44 w-full" 
                          customMediaUrl={ex.customMediaUrl}
                          customMediaType={ex.customMediaType}
                          isCard={true}
                        />
                        
                        {/* Premium Badge */}
                        {ex.isPremium && (
                          <div className="absolute top-3 left-3 bg-[#C0392B] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-white fill-white" />
                            PREMIUM
                          </div>
                        )}

                        {/* Difficulty Label */}
                        <div className="absolute top-3 right-3 bg-[#C0392B] text-white text-[9px] font-sans font-bold uppercase px-2.5 py-1 rounded border border-white/20 z-10">
                          {ex.difficulty}
                        </div>
                      </div>

                      {/* Content Body Block */}
                      <div className="p-5 flex flex-col justify-between flex-1 bg-white">
                        <div>
                          <div className="text-[9px] text-[#C0392B] uppercase font-sans tracking-wide mb-1.5 font-bold">{ex.category}</div>
                          <h3 className="font-sans font-black text-base text-[#C0392B] tracking-tight leading-snug group-hover:text-[#A82E22] transition-colors">
                            {ex.name}
                          </h3>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                            {ex.instructions[0]} Focus on perfect execution.
                          </p>

                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {ex.equipment.map((eq) => (
                              <span key={eq} className="bg-red-50 text-[9px] font-sans font-extrabold text-[#C0392B] px-2 py-1 rounded uppercase border border-red-100/50">
                                {eq}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Action trigger footer */}
                        <div className="mt-6 pt-4 border-t border-red-50 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              triggerLiveLoad("Updating saved collection...", 300, () => toggleSaveWorkout(ex.id));
                            }}
                            className={`text-[10px] px-2 py-2 rounded-lg font-bold uppercase transition-all cursor-pointer ${
                              isSaved 
                                ? "bg-red-100 text-[#C0392B]"
                                : "border border-red-200 hover:bg-red-50 text-[#C0392B]"
                            }`}
                          >
                            {isSaved ? "Saved" : "Save"}
                          </button>

                          {isUserPremium && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setAddingToProgramExercise(ex);
                                setSelectedTargetProgramId(customPrograms[0]?.id || "new");
                                setNewProgramName("");
                                setTargetProgramDay("Day 1");
                                setTargetSets(3);
                                setTargetReps(10);
                                setTargetNotes("");
                                setProgramAddSuccess(false);
                              }}
                              className="px-2 py-2 rounded-lg text-[10px] font-bold border border-[#C0392B] hover:bg-red-50 text-[#C0392B] flex items-center gap-1 uppercase transition-all cursor-pointer select-none"
                            >
                              <PlusCircle className="w-3.5 h-3.5 text-[#C0392B]" />
                              + Program
                            </button>
                          )}

                           <button
                            type="button"
                            onClick={() => {
                              triggerLiveLoad(`Analyzing execution for ${ex.name}...`, 400, () => handleOpenDetail(ex));
                            }}
                            className="px-4 py-2 rounded-lg text-[10px] font-bold text-white uppercase bg-[#C0392B] hover:bg-[#A82E22] flex items-center gap-1.5 transition shadow-sm hover:shadow cursor-pointer"
                          >
                            {ex.isPremium ? (
                              <>
                                <Sparkles className="w-3.5 h-3.5 text-red-200 fill-white" />
                                Premium Tech
                              </>
                            ) : (
                              <>
                                View Technique
                                <ChevronRight className="w-3.5 h-3.5" />
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Premium Upgrade Overlay if free (Disabled to allow direct Technique views) */}
                      {false && needsUpgrade && (
                        <div className="absolute inset-0 z-10 bg-[#C0392B]/95 p-6 flex flex-col justify-center items-center text-center text-white">
                          <div className="h-10 w-10 bg-white/15 text-white border border-white/20 rounded-full flex items-center justify-center mb-2 animate-bounce">
                            <Lock className="w-5 h-5" />
                          </div>
                          <h4 className="text-xs font-black tracking-wider uppercase text-white">Premium Locked</h4>
                          <p className="text-[10px] text-red-100 max-w-xs mt-1 leading-snug font-medium">
                            Unlock step-by-step master tutorials, target anatomy maps, and interactive performance tracking.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              triggerLiveLoad("Loading premium gateway...", 400, () => handleOpenDetail(ex));
                            }}
                            className="mt-3 px-4 py-2 bg-white text-[#C0392B] text-[10px] font-black uppercase rounded-lg shadow-sm hover:bg-red-50 transition-all cursor-pointer"
                          >
                            Preview Benefits
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Show more button if filtered exercises exceeds visibleCount (Disabled as all are displayed) */}
              {false && filteredExercises.length > visibleCount && (
                <div className="flex justify-center pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      triggerLiveLoad("Throttling and loading records...", 400, () => setVisibleCount((prev) => prev + 12));
                    }}
                    className="px-6 py-3 bg-[#C0392B] hover:bg-[#A82E22] text-white font-extrabold text-[11px] font-mono uppercase tracking-wider rounded-xl transition shadow hover:shadow-md cursor-pointer"
                  >
                    Load More Exercises ({filteredExercises.length - visibleCount} remaining)
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}



      {/* 7. WEIGHT LOSS MEAL PLANS TAB (Visible strictly when searching weight loss) */}
      {activeSearchTab === "mealplans" && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl border border-dashed border-emerald-500/20 bg-emerald-950/5 text-xs text-slate-650 dark:text-emerald-400/90 flex gap-2">
            <Apple className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-extrabold uppercase font-mono text-[10px] tracking-wider leading-none mb-1">SHRED MEAL PLANS IDENTIFIED</p>
              These meal guidelines correspond dynamically to the Weight Loss, Fat Loss, and Lean Toning programs. They are formatted with optimal macro divisions favoring rapid metabolization.
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {filteredMealPlans.map(prog => (
              <div key={prog.id} className="p-5 rounded-2xl border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[8px] font-mono px-2 py-0.5 rounded font-extrabold uppercase tracking-wider">
                      MEAL TEMPLATE FOR: {prog.name}
                    </span>
                  </div>
                  <h4 className="text-base font-black text-slate-900 dark:text-white leading-tight">Pro Shredding Nutrition Formula</h4>
                  <p className="text-xs text-slate-550 dark:text-slate-400 mt-1 mb-4 leading-normal">
                    This profile focuses on continuous metabolic processing while keeping energy substrates replenished.
                  </p>

                  {/* Render the program specific meal details */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-920 text-xs">
                    <p className="font-mono text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest mb-2 flex items-center gap-1">
                      <Clipboard className="w-3.5 h-3.5" />
                      MEAL SPLITS
                    </p>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-sans mt-2 whitespace-pre-line">
                      {prog.schedule.find(s => s.mealPlan)?.mealPlan || "Macro Strategy: High Protein Lean Shred Plan. Minimize high carbohydrates; prioritize leafy greens, egg whites, raw veggies and lean poultry targets."}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-900 flex items-center justify-between gap-4">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">MACROS: Lean Deficit Formula</span>
                  <button 
                    onClick={() => handleOpenProgram(prog)}
                    className="text-xs font-bold text-blue-500 dark:text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    View Associated Exercises
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

       {/* 8. COMPLETE KINESIOLOGY EXERCISE CABINET DETAILS (SPLIT DRUMS) */}
       {selectedExercise && (
        <div 
          id="exercise-cabinet-drawer" 
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedExerciseId(null); }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm cursor-pointer animate-fade-in p-2 sm:p-4"
        >
          <div className="w-full max-w-3xl max-h-[92vh] sm:max-h-[88vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col rounded-3xl relative cursor-default animate-slide-down">
            
            {/* Header section with category and meta details */}
            <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-850 flex-shrink-0">
              <div>
                <span className="text-[10px] font-mono font-extrabold uppercase bg-emerald-500/10 text-emerald-500 py-0.5 px-2.5 border border-emerald-500/20 rounded-full">
                  {selectedExercise.category}
                </span>
                <h3 className="text-xl font-black text-slate-950 dark:text-white mt-1.5 leading-none">
                  {selectedExercise.name}
                </h3>
              </div>
              
              <button 
                type="button"
                onClick={() => setSelectedExerciseId(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Core content with ALL 11 required parameters */}
            <div id="drawer-scroll-container" className="p-6 space-y-6 text-slate-850 dark:text-slate-200 overflow-y-auto flex-1">
              
              {false ? (
                <div className="space-y-6">
                  {/* Visual Media Block (Blurred / Locked overlay) */}
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 h-48 bg-slate-950">
                    <WorkoutVisual 
                      category={selectedExercise.category} 
                      muscleGroups={selectedExercise.muscleGroups} 
                      exerciseName={selectedExercise.name} 
                      className="h-full w-full filter blur-lg opacity-30" 
                      customMediaUrl={selectedExercise.customMediaUrl}
                      customMediaType={selectedExercise.customMediaType}
                      isCard={true}
                    />
                    <div className="absolute inset-0 bg-slate-950/70 flex flex-col justify-center items-center text-center p-4">
                      <div className="h-10 w-10 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center justify-center mb-2">
                        <Lock className="w-5 h-5 animate-bounce" />
                      </div>
                      <span className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-widest">BIOMECHANICAL DEMO LOCKED</span>
                      <span className="text-[10px] text-slate-450 mt-1">HD video loop and kinesis align-track restricted to Premium members</span>
                    </div>
                  </div>

                  {/* Locked Parameter Indicators Checklist */}
                  <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40">
                    <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase mb-2.5 flex items-center gap-1.5 leading-none">
                      <Sparkles className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                      Locked Kinesiology Parameters
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                      Your current free-tier account is restricted from reading the 11 key training parameters for **{selectedExercise.name}**:
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { num: "01", name: "HD Demonstration Loop", desc: "Interactive full range of motion." },
                        { num: "02", name: "Starting Alignment Position", desc: "Skeletal setups and joint angles." },
                        { num: "03", name: "Concentric Execution", desc: "Optimal force speed and direction." },
                        { num: "04", name: "Peak Finishing Squeeze", desc: "Holding concentric active tension." },
                        { num: "05", name: "Target Muscle Groups", desc: "Deep anatomical muscle breakdowns." },
                        { num: "06", name: "Form Warning Mistakes", desc: "Safety callouts protecting tendons." },
                        { num: "07", name: "Progression Variations", desc: "Complex muscular loading styles." },
                        { num: "08", name: "Alternative Exercises", desc: "Sub-swaps for versatile equipment." }
                      ].map((item) => (
                        <div key={item.num} className="p-3 rounded-xl border border-slate-205 dark:border-slate-850 bg-white dark:bg-slate-900 text-xs flex gap-2 shadow-xs">
                          <span className="font-mono text-emerald-500 font-extrabold text-[10px]">{item.num}</span>
                          <div>
                            <p className="font-bold text-slate-800 dark:text-white leading-tight uppercase text-[9px]">{item.name}</p>
                            <p className="text-[8px] text-slate-450 leading-none mt-0.5">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Premium Benefits Box */}
                  <div className="p-5 rounded-xl border border-emerald-500/10 bg-emerald-500/5 text-xs">
                    <h5 className="font-extrabold uppercase font-mono text-[9px] tracking-widest text-emerald-500 dark:text-emerald-400 mb-2 leading-none flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-emerald-400" />
                      👑 AlexFitnessHub Premium Benefits
                    </h5>
                    <ul className="space-y-1.5 font-sans leading-relaxed text-slate-650 dark:text-emerald-300/80 text-[10.5px]">
                      <li className="flex items-start gap-1">
                        <span className="text-emerald-500 font-bold">&#10004;</span> Full access to **1,200+ clinical exercises** with biomechanical details.
                      </li>
                      <li className="flex items-start gap-1">
                        <span className="text-emerald-500 font-bold">&#10004;</span> Dedicated **AI Fitness Coach** for 24/7 posture checks.
                      </li>
                      <li className="flex items-start gap-1">
                        <span className="text-emerald-500 font-bold">&#10004;</span> Special **Celebrity & Military Training Programs** guides.
                      </li>
                      <li className="flex items-start gap-1">
                        <span className="text-emerald-500 font-bold">&#10004;</span> **African & Global Meal Generators** with regional macro-tailored options.
                      </li>
                      <li className="flex items-start gap-1">
                        <span className="text-emerald-500 font-bold">&#10004;</span> Interactive weight tracking charts and daily consistency logs.
                      </li>
                    </ul>
                  </div>

                  {/* Secure Checkout CTA */}
                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider font-mono text-emerald-400">Unlock Master kinesis library</h4>
                      <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                        Activate your premium features securely. Cancel anytime.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedExerciseId(null);
                        setView?.("pricing");
                      }}
                      className="w-full sm:w-auto px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[10px] font-black uppercase rounded-lg tracking-wider shadow transition-all shrink-0"
                    >
                      Upgrade Now
                    </button>
                  </div>
                </div>
              ) : (
                <>
                   {/* EXERCISE SPECIFICATIONS */}
                  <div id="instruction-param-demo" className="space-y-4">
                    <div>
                      <h4 className="text-xs font-extrabold tracking-wider text-slate-500 dark:text-slate-400 uppercase mb-2 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#C0392B]" />
                        Exercise Details
                      </h4>
                      <WorkoutVisual 
                        exerciseId={selectedExercise.id}
                        category={selectedExercise.category} 
                        muscleGroups={selectedExercise.muscleGroups} 
                        exerciseName={selectedExercise.name} 
                        className="w-full" 
                        customMediaUrl={selectedExercise.customMediaUrl}
                        customMediaType={selectedExercise.customMediaType}
                      />
                    </div>

                    {/* Manually upload custom demonstration GIF */}
                    {user?.email?.toLowerCase().trim() === "alexfitnesshub@gmail.com" && (
                      <CustomPerformanceUpload 
                        exercise={selectedExercise} 
                        uploadExerciseMedia={uploadExerciseMedia} 
                      />
                    )}
                  </div>

                  {/* HOW TO PERFORM & TARGET MUSCLES */}
                  <div id="instruction-param-biomechanics" className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 space-y-4">
                    <h4 className="text-xs font-extrabold text-blue-600 dark:text-emerald-405 uppercase tracking-wide border-b border-slate-200 dark:border-slate-800 pb-2 flex items-center gap-1.5">
                      <Compass className="w-4 h-4" />
                      How To Perform
                    </h4>

                    <div className="space-y-3.5 text-xs leading-relaxed">
                      {/* Starting Position */}
                      <div>
                        <span className="font-extrabold text-blue-650 dark:text-blue-400 block uppercase text-[10px]">Starting Setup:</span>
                        <p className="text-slate-600 dark:text-slate-300 mt-0.5">{selectedExercise.startingPosition}</p>
                      </div>

                      {/* Movement Execution */}
                      <div>
                        <span className="font-extrabold text-orange-600 dark:text-orange-400 block uppercase text-[10px]">Execution Guide:</span>
                        <p className="text-slate-600 dark:text-slate-300 mt-0.5">{selectedExercise.movementExecution}</p>
                      </div>

                      {/* Finishing Position */}
                      <div>
                        <span className="font-extrabold text-purple-650 dark:text-purple-400 block uppercase text-[10px]">Finishing Lock & Squeeze:</span>
                        <p className="text-slate-600 dark:text-slate-300 mt-0.5">{selectedExercise.finishingPosition}</p>
                      </div>

                      {/* Step-by-Step Instructions list */}
                      {selectedExercise.instructions && selectedExercise.instructions.length > 0 && (
                        <div className="p-3.5 bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-850/60 rounded-xl space-y-2.5">
                          <span className="font-extrabold text-slate-800 dark:text-white block uppercase text-[10px] font-mono tracking-wider">Step-by-Step Technique Instructions:</span>
                          <ol className="space-y-2">
                            {selectedExercise.instructions.map((inst, index) => (
                              <li key={index} className="flex gap-2 text-xs text-slate-655 dark:text-slate-300 leading-relaxed">
                                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono font-bold text-emerald-500 shrink-0">
                                  {index + 1}
                                </span>
                                <span>{inst}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}

                      {/* Dynamic Coaching Parameter Cards (Breathing & Target Recommendations) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Breathing instructions */}
                        {selectedExercise.breathingInstructions && (
                          <div className="p-3 bg-blue-500/5 rounded-xl border border-blue-500/10 space-y-1">
                            <span className="font-extrabold text-blue-600 dark:text-blue-400 block uppercase text-[10px] font-mono tracking-wider">
                              Breathing Control
                            </span>
                            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                              {selectedExercise.breathingInstructions}
                            </p>
                          </div>
                        )}

                        {/* Recommended Sets & Reps */}
                        {selectedExercise.recommendedSetsReps && (
                          <div className="p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10 space-y-1">
                            <span className="font-extrabold text-emerald-600 dark:text-emerald-400 block uppercase text-[10px] font-mono tracking-wider">
                              Training Metrics
                            </span>
                            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans font-bold">
                              {selectedExercise.recommendedSetsReps}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Exercise Benefits */}
                      {selectedExercise.benefits && selectedExercise.benefits.length > 0 && (
                        <div className="p-3.5 bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-850/60 rounded-xl space-y-1.5">
                          <span className="font-extrabold text-slate-500 dark:text-slate-400 block uppercase text-[10px]">Biomechanical Benefits:</span>
                          <ul className="space-y-1">
                            {selectedExercise.benefits.map((benefit, idx) => (
                              <li key={idx} className="flex items-start gap-1.5 text-xs text-slate-755 dark:text-slate-300 leading-relaxed">
                                <span className="text-emerald-500 font-extrabold">&#10004;</span>
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Training Recommendations */}
                      {selectedExercise.trainingRecommendations && (
                        <div className="p-3 bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-850/60 rounded-xl space-y-1">
                          <span className="font-extrabold text-slate-500 dark:text-slate-400 block uppercase text-[10px]">Coach Tips:</span>
                          <p className="text-xs text-slate-705 dark:text-slate-300 leading-relaxed font-sans">
                            {selectedExercise.trainingRecommendations}
                          </p>
                        </div>
                      )}

                      {/* Muscles Worked */}
                      <div>
                        <span className="font-extrabold text-emerald-605 dark:text-emerald-500 block uppercase text-[10px]">Muscles Worked:</span>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {selectedExercise.musclesWorked.map((muscle) => (
                            <span key={muscle} className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[9px] font-semibold px-2.5 py-1 rounded uppercase">
                              {muscle}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* EQUIPMENT CHECKLIST */}
                  <div id="instruction-param-equip">
                    <h4 className="text-xs font-extrabold tracking-wider text-slate-500 dark:text-slate-400 uppercase mb-2">
                      Equipment Needed
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedExercise.equipment.map((eq) => (
                        <div key={eq} className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white uppercase text-[10px] leading-none">{eq}</p>
                            <p className="text-[8px] text-slate-500 leading-none mt-0.5">Verified functional gear</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* COMMON MISTAKES & SAFETY TIPS */}
                  <div id="instruction-param-safety" className="grid md:grid-cols-2 gap-4">
                    
                    {/* Common Mistakes */}
                    <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/15">
                      <h5 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wide flex items-center gap-1.5 mb-2">
                        <AlertTriangle className="w-4 h-4" />
                        Common Mistakes
                      </h5>
                      <ul className="space-y-1.5 text-xs text-slate-650 dark:text-rose-400/90 leading-relaxed">
                        {selectedExercise.commonMistakes.map((mistake, idx) => (
                          <li key={idx} className="flex items-start gap-1">
                            <span className="shrink-0 text-rose-500 font-bold">&#10006;</span>
                            {mistake}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Safety Tips */}
                    <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
                      <h5 className="text-xs font-bold text-amber-600 dark:text-amber-450 uppercase tracking-wide flex items-center gap-1.5 mb-2">
                        <Shield className="w-4 h-4" />
                        Safety & Protection Tips
                      </h5>
                      <ul className="space-y-1.5 text-xs text-slate-650 dark:text-amber-400/90 leading-relaxed">
                        {selectedExercise.safetyTips.map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-1">
                            <span className="shrink-0 text-amber-600 dark:text-amber-400 font-bold">&#10004;</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                  {/* EXERCISE VARIATIONS */}
                  <div id="instruction-param-variations" className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3.5 text-xs bg-slate-50/50 dark:bg-transparent">
                    <h5 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-1.5">
                      Exercise Variations
                    </h5>

                    {/* Alternatives, Progression & Regression */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <span className="block text-[8px] font-bold uppercase text-slate-450 dark:text-slate-500">Alternative Swaps</span>
                        <p className="text-slate-800 dark:text-slate-200 font-bold mt-0.5 leading-snug">
                          {selectedExercise.alternativeExercises.join(" / ") || "Standard swaps applies"}
                        </p>
                      </div>

                      {/* Progression */}
                      <div>
                        <span className="block text-[8px] font-bold uppercase text-slate-450 dark:text-slate-500">Advanced Progression</span>
                        <p className="text-slate-800 dark:text-slate-200 font-bold mt-0.5 leading-snug">
                          {selectedExercise.progressionVariations.join(" / ") || "High density loads"}
                        </p>
                      </div>

                      {/* Regression */}
                      <div>
                        <span className="block text-[8px] font-bold uppercase text-slate-450 dark:text-slate-500">Regression Options</span>
                        <p className="text-slate-800 dark:text-slate-200 font-bold mt-0.5 leading-snug">
                          {selectedExercise.regressionVariations.join(" / ") || "Knee assisted splits"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* LOG COMPLETION STATE CONFORM LOGIC */}
                  {user ? (
                    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
                      <h4 className="text-xs font-bold text-slate-650 dark:text-slate-300 uppercase mb-3">
                        Log Workout Performance
                      </h4>

                      {logSuccess ? (
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-lg text-xs text-emerald-400 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Form submission recorded cleanly. Sync completed with user dashboard index!
                        </div>
                      ) : (
                        <form onSubmit={handleLogCompletion} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[9px] font-bold text-slate-400 uppercase font-mono mb-1">Target Reps</label>
                            <input
                              type="number"
                              value={loggedReps}
                              onChange={(e) => setLoggedReps(e.target.value)}
                              className="w-full text-xs p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-950 dark:text-white rounded focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-slate-400 uppercase font-mono mb-1">Target Load (KG)</label>
                            <input
                              type="number"
                              value={loggedWeight}
                              onChange={(e) => setLoggedWeight(e.target.value)}
                              className="w-full text-xs p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-950 dark:text-white rounded focus:outline-none"
                            />
                          </div>
                          <div className="sm:col-span-3">
                            <label className="block text-[9px] font-bold text-slate-400 uppercase font-mono mb-1">Coaching notes and performance index</label>
                            <input
                              type="text"
                              placeholder="Felt excellent contraction. Joint movement felt completely stable."
                              value={loggedNotes}
                              onChange={(e) => setLoggedNotes(e.target.value)}
                              className="w-full text-xs p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-950 dark:text-white rounded focus:outline-none"
                            />
                          </div>
                          <button
                            type="submit"
                            className="sm:col-span-3 py-3 bg-[#1E3A8A] hover:bg-[#1E40AF] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white rounded-lg text-xs font-bold uppercase tracking-widest font-mono flex items-center justify-center gap-1.5 shadow-sm hover:shadow transition-all"
                          >
                            <PlusCircle className="w-4 h-4" />
                            Log Workout Set
                          </button>
                        </form>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 text-center rounded-xl bg-slate-50 dark:bg-slate-950/60 text-xs text-slate-500 border border-dashed border-slate-200 dark:border-slate-800/80">
                      Please sign-in to enroll, save routines, track sets, and compile dynamic history charts.
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 9. PREMIUM PROGRAM DETAILS OVERLAY / MODAL SCHEDULES */}
      {selectedProgram && (
        <div 
          id="program-cohort-detail" 
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedProgram(null); }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm cursor-pointer animate-fade-in p-2 sm:p-4"
        >
          <div className="w-full max-w-2xl max-h-[92vh] sm:max-h-[88vh] bg-slate-900 border border-slate-805 rounded-3xl shadow-2xl flex flex-col relative cursor-default animate-slide-down">
            
            {/* Header */}
            <div className="p-6 bg-slate-950 border-b border-slate-850 flex items-center justify-between flex-shrink-0">
              <div>
                <span className="text-[9px] font-mono font-bold uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                  {selectedProgram.category}
                </span>
                <h3 className="text-lg font-black text-white mt-1.5">{selectedProgram.name}</h3>
              </div>
              <button 
                type="button"
                onClick={() => setSelectedProgram(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-805"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 space-y-6 text-slate-300 overflow-y-auto flex-1">
              
              <div>
                <h5 className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest mb-1">PROGRAM DESCRIPTION</h5>
                <p className="text-xs text-slate-300 leading-relaxed">{selectedProgram.description}</p>
              </div>

              {/* Weekly Schedule with Associated Exercises */}
              <div className="space-y-4">
                <h5 className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest">WEEKLY TRAINING SCHEDULE</h5>
                
                <div className="space-y-3">
                  {selectedProgram.schedule.map((sch, i) => (
                    <div key={i} className="p-4 rounded-xl bg-slate-950 border border-slate-850 text-xs text-left">
                      <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-2">
                        <span className="font-extrabold text-emerald-400 uppercase font-mono tracking-wider">{sch.day}</span>
                        <span className="text-[10px] font-semibold text-slate-200">{sch.focus}</span>
                      </div>

                      <div className="space-y-2 mt-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase font-mono">TARGET EXERCISES:</p>
                        <div className="flex flex-wrap gap-2">
                          {sch.exercises.map((exName, idx) => {
                            // Find matching exercise in DB
                            const match = exercises.find(ex => ex.name.toLowerCase() === exName.toLowerCase() || ex.id.toLowerCase().includes(exName.toLowerCase().replace(/\s+/g, "-")));
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  if (match) {
                                    handleOpenDetail(match);
                                  } else {
                                    alert(`To practice ${exName}, browse the Exercises lists. Keep form strict!`);
                                  }
                                }}
                                className="px-3 py-1 bg-slate-900 hover:bg-slate-850 text-white font-sans text-[11px] rounded border border-slate-800 transition flex items-center gap-1 group"
                              >
                                <Play className="w-2.5 h-2.5 text-emerald-400 group-hover:scale-110" />
                                {exName}
                                <span className="text-[8px] text-slate-500 group-hover:text-emerald-400 ml-1">→ VIEW</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Display Nutrition integration plan inside program! */}
                      {sch.mealPlan && (
                        <div className="mt-4 pt-3 border-t border-slate-900">
                          <p className="text-[10px] font-bold text-indigo-400 uppercase font-mono flex items-center gap-1 mb-1">
                            <Apple className="w-3.5 h-3.5 text-emerald-400" />
                            INTEGRATED DIET & MACRO LOGS:
                          </p>
                          <p className="text-[11px] text-slate-350 bg-slate-900 p-2.5 rounded-lg border border-slate-850 leading-relaxed italic">
                            {sch.mealPlan}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Status and Active Sign-In checks */}
              <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-between text-xs">
                <div>
                  <p className="font-extrabold text-white uppercase font-mono tracking-wider leading-none">READY FOR DEPLOYMENT</p>
                  <p className="text-slate-400 mt-1 leading-none">Press below to save schedules directly to dashboard charts.</p>
                </div>
                {user ? (
                  <button
                    onClick={() => {
                      alert(`Congratulations! You have successfully enrolled in: ${selectedProgram.name}! Check your Dashboard schedule page for today's logs.`);
                      setSelectedProgram(null);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 font-extrabold uppercase text-[10px] font-mono tracking-wide text-white rounded transition shadow"
                  >
                    Start Training Now
                  </button>
                ) : (
                  <span className="text-slate-500 italic text-[10px]">Sign-in to trigger tracking</span>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 6. Premium Single-Click Add to Custom Program Dialog Overlay */}
      {addingToProgramExercise && (
        <div className="fixed inset-0 z-55 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-red-100 dark:border-slate-800 max-w-md w-full overflow-hidden shadow-2xl relative">
            
            {/* Modal Header */}
            <div className="p-6 bg-[#C0392B] text-white flex items-center justify-between">
              <div>
                <span className="text-[9px] font-mono font-black uppercase bg-white/15 text-white py-0.5 px-2.5 rounded-full tracking-wider border border-white/10">
                  AlexFitnessHub Premium Tool
                </span>
                <h3 className="text-lg font-black tracking-tight mt-1">Add to Custom Program</h3>
              </div>
              <button
                type="button"
                onClick={() => setAddingToProgramExercise(null)}
                className="p-1.5 hover:bg-white/15 text-white/80 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleAddExerciseToProgram} className="p-6 space-y-4">
              
              {/* Selected exercise info */}
              <div className="p-3 bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/30 rounded-2xl flex items-center gap-3">
                <div className="p-2 bg-[#C0392B]/10 text-[#C0392B] rounded-xl font-mono text-xs font-black">
                  Ex
                </div>
                <div>
                  <p className="text-xs text-slate-400 dark:text-slate-505 font-mono uppercase tracking-wider font-extrabold">Active Drill</p>
                  <p className="text-sm font-black text-[#C0392B]">{addingToProgramExercise.name}</p>
                </div>
              </div>

              {programAddSuccess ? (
                <div className="py-6 flex flex-col items-center justify-center text-center space-y-3 animate-fade-in">
                  <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center border border-emerald-200">
                    <CheckCircle className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-emerald-600">Exercise Appended Successfully!</h4>
                    <p className="text-xs text-slate-500 mt-1">Saved to your permanent custom kinesiologist program index.</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Select Program */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-[#C0392B] uppercase font-mono tracking-wider">Select Target Program</label>
                    <select
                      value={selectedTargetProgramId}
                      onChange={(e) => setSelectedTargetProgramId(e.target.value)}
                      className="w-full p-2.5 bg-white dark:bg-slate-950 border border-red-100 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#C0392B] transition-all cursor-pointer"
                    >
                      <option value="new">+ Create A Brand New Workout Program</option>
                      {customPrograms.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* If brand new, program name */}
                  {selectedTargetProgramId === "new" && (
                    <div className="space-y-1 animate-fade-in">
                      <label className="block text-[10px] font-black text-[#C0392B] uppercase font-mono tracking-wider">New Program Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Bulk Muscle Protocol, Summer Split"
                        value={newProgramName}
                        onChange={(e) => setNewProgramName(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-950 border border-red-100 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-850 dark:text-white focus:outline-none focus:border-[#C0392B]"
                      />
                    </div>
                  )}

                  {/* Program Day */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-[#C0392B] uppercase font-mono tracking-wider">Target Training Day</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Monday, Day 1, Upper Body"
                      value={targetProgramDay}
                      onChange={(e) => setTargetProgramDay(e.target.value)}
                      className="w-full p-2.5 bg-white dark:bg-slate-950 border border-red-100 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-850 dark:text-white focus:outline-none focus:border-[#C0392B]"
                    />
                  </div>

                  {/* Sets & Reps */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-black text-[#C0392B] uppercase font-mono tracking-wider">Target Sets</label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        required
                        value={targetSets}
                        onChange={(e) => setTargetSets(parseInt(e.target.value) || 3)}
                        className="w-full p-2.5 bg-white dark:bg-slate-950 border border-red-100 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-850 dark:text-white focus:outline-none focus:border-[#C0392B]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-black text-[#C0392B] uppercase font-mono tracking-wider">Target Reps</label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        required
                        value={targetReps}
                        onChange={(e) => setTargetReps(parseInt(e.target.value) || 10)}
                        className="w-full p-2.5 bg-white dark:bg-slate-950 border border-red-100 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-850 dark:text-white focus:outline-none focus:border-[#C0392B]"
                      />
                    </div>
                  </div>

                  {/* Custom Coaching Notes */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-[#C0392B] uppercase font-mono tracking-wider">Execution Notes</label>
                    <textarea
                      placeholder="e.g. Squeeze for 2s at peak tension, slow eccentrics."
                      value={targetNotes}
                      onChange={(e) => setTargetNotes(e.target.value)}
                      rows={2}
                      className="w-full p-2.5 bg-white dark:bg-slate-950 border border-red-100 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-850 dark:text-white focus:outline-none focus:border-[#C0392B] resize-none"
                    />
                  </div>

                  {/* Form Footer Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setAddingToProgramExercise(null)}
                      className="px-4 py-2 border border-[#C0392B] hover:bg-red-50 text-[#C0392B] text-xs font-bold uppercase rounded-xl transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#C0392B] hover:bg-[#A82E22] text-white text-xs font-black uppercase rounded-xl tracking-wide shadow flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <CheckCircle className="w-4 h-4 text-white" />
                      Add to Program
                    </button>
                  </div>
                </>
              )}

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

// ==========================================
// CUSTOM WORKOUT PERFORMANCE FILE UPLOADER
// ==========================================
function CustomPerformanceUpload({ 
  exercise, 
  uploadExerciseMedia 
}: { 
  exercise: Exercise;
  uploadExerciseMedia: (exerciseId: string, mediaUrl: string | null, mediaType?: "image" | "video") => void;
}) {
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    if (!file) return;
    setLoading(true);
    setErrorMsg("");

    const fileType = file.type;
    const isVideo = fileType.startsWith("video/");
    const isImage = fileType.startsWith("image/");

    if (!isVideo && !isImage) {
      setErrorMsg("Please upload an image, GIF, or video file.");
      setLoading(false);
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg("File size exceeds 15MB. Please upload a smaller clip or GIF.");
      setLoading(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const mediaUrl = event.target.result as string;
        const mediaType = isVideo ? "video" : "image";
        uploadExerciseMedia(exercise.id, mediaUrl, mediaType);
      } else {
        setErrorMsg("Failed to read file.");
      }
      setLoading(false);
    };
    reader.onerror = () => {
      setErrorMsg("An error occurred reading the file.");
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleReset = () => {
    uploadExerciseMedia(exercise.id, null);
  };

  return (
    <div 
      id={`upload-zone-${exercise.id}`}
      className="mt-4 p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 transition-colors"
    >
      <div className="flex items-center justify-between mb-3">
        <h5 className="text-[11px] font-bold font-mono uppercase tracking-wider text-slate-705 dark:text-slate-300 flex items-center gap-1.5">
          <UploadCloud className="w-3.5 h-3.5 text-emerald-500" />
          Workout Performance Media
        </h5>
        {exercise.customMediaUrl && (
          <button
            type="button"
            id={`reset-media-btn-${exercise.id}`}
            onClick={handleReset}
            className="p-1 px-2 hover:bg-red-500/10 hover:text-red-500 text-slate-400 text-[10px] uppercase font-mono font-bold rounded flex items-center gap-1 transition"
          >
            <Trash2 className="w-3 h-3" />
            Reset Custom Media
          </button>
        )}
      </div>

      {exercise.customMediaUrl ? (
        <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center gap-3">
          {exercise.customMediaType === "video" ? (
            <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-lg">
              <FileVideo className="w-5 h-5" />
            </div>
          ) : (
            <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-lg">
              <FileImage className="w-5 h-5" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-800 dark:text-white truncate">Custom Demonstration Active</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">Format: base64 {exercise.customMediaType}</p>
          </div>
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-mono font-bold py-0.5 px-2 rounded uppercase">
            Active
          </span>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center p-6 border border-dashed rounded-lg text-center cursor-pointer transition ${
            dragActive 
              ? "border-emerald-500 bg-emerald-500/51" 
              : "border-slate-300 dark:border-slate-800 hover:border-slate-450 dark:hover:border-slate-700 bg-white/50 dark:bg-slate-950/35"
          }`}
          onClick={() => document.getElementById(`file-upload-input-${exercise.id}`)?.click()}
        >
          <input
            type="file"
            id={`file-upload-input-${exercise.id}`}
            className="hidden"
            accept="image/*,video/*"
            onChange={handleFileInput}
          />
          {loading ? (
            <div className="flex flex-col items-center">
              <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-2" />
              <p className="text-xs text-slate-500">Reading media data...</p>
            </div>
          ) : (
            <>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Drag & drop your demo performance clip, GIF, or photo
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                or <span className="text-emerald-500 dark:text-emerald-400 font-bold decoration-dotted underline">browse local drive</span> (max 15MB)
              </p>
            </>
          )}
        </div>
      )}

      {errorMsg && (
        <p className="text-[10px] font-bold text-rose-500 mt-2 font-sans flex items-center gap-1">
          <span>&#9888;</span> {errorMsg}
        </p>
      )}
    </div>
  );
}
