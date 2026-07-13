export interface Exercise {
  id: string;
  name: string;
  muscleGroups: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  instructions: string[];
  equipment: string[];
  category: string;
  commonMistakes: string[];
  safetyTips: string[];
  alternativeExercises: string[];
  progressionVariations: string[];
  isPremium: boolean;
  
  // Real Biomechanical coaching fields
  startingPosition: string;
  movementExecution: string;
  finishingPosition: string;
  regressionVariations: string[];
  musclesWorked: string[];
  gifUrl: string; // HD professional fitness loop / video url
  customMediaType?: "image" | "video";
  customMediaUrl?: string;

  // Detailed Coaching Parameters
  breathingInstructions?: string;
  recommendedSetsReps?: string;
  benefits?: string[];
  trainingRecommendations?: string;

  // Curated Refactoring Fields
  bodyPart?: string;
  recommendedSets?: string;
  recommendedReps?: string;
  restTime?: string;
  caloriesBurned?: number;
  trainerTips?: string;
  safetyNotes?: string;
  variations?: string[];
}

export function getExerciseGifUrl(name: string, category: string = ""): string {
  const nameLower = name.toLowerCase();
  
  if (nameLower.includes("bench press") || nameLower.includes("chest press") || nameLower.includes("push up") || nameLower.includes("pushup") || nameLower.includes("fly")) {
    return "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3h0YnpwM2wzdW9vdG9ndjY5NHdvdnBwdXB4Mm5qNXRpcG5xMDlxMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o84U6421O1IIXbowg/giphy.gif";
  }
  if (nameLower.includes("squat") || nameLower.includes("leg press") || nameLower.includes("lunges") || nameLower.includes("lunge")) {
    return "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3h2bzNyMTZ4ZHp0aXB6dnZzcDZrcTZhbmplbmF2MnpydzF1b3ByMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/u8946fAnhQ6cH9R16e/giphy.gif";
  }
  if (nameLower.includes("plank") || nameLower.includes("crunch") || nameLower.includes("twist") || nameLower.includes("abdominal") || nameLower.includes("sit up") || nameLower.includes("situp")) {
    return "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3NiaXQxMGxkcTVwZGxhbjVvNnlvZDJ4bnB4ZGpwNnZxdThscDZ6eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT8qB7Sbwskk27Rdy8/giphy.gif";
  }
  if (nameLower.includes("glute bridge") || nameLower.includes("hip thrust")) {
    return "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOTVxbGRzNDVleW12ZTRsdXoxeDJmd2t2enN5YnYwdXhyeTV6ZW5xeCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/v1F0A8f5Ff6hO/giphy.gif";
  }
  if (nameLower.includes("mountain climber") || nameLower.includes("burpee") || nameLower.includes("jacks") || nameLower.includes("bike") || nameLower.includes("cycling") || nameLower.includes("run") || nameLower.includes("sprint") || nameLower.includes("walk")) {
    return "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3h2bzNyMTZ4ZHp0aXB6dnZzcDZrcTZhbmplbmF2MnpydzF1b3ByMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/13sc1CHidbO6S4/giphy.gif";
  }
  if (nameLower.includes("row") || nameLower.includes("pull-up") || nameLower.includes("pullup") || nameLower.includes("chin-up") || nameLower.includes("chinup") || nameLower.includes("deadlift")) {
    return "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExZW1sODNuY2Q3N29pd2VrdGkzbndpdTJ4cnFkM3pxOHdqN3huc2sybyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/duuVpx00In40Syc7m6/giphy.gif";
  }
  if (nameLower.includes("curl") || nameLower.includes("biceps") || nameLower.includes("bicep")) {
    return "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3NiaXQxMGxkcTVwZGxhbjVvNnlvZDJ4bnB4ZGpwNnZxdThscDZ6eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7qE1YN7aBOFPRw8E/giphy.gif";
  }
  if (nameLower.includes("dip") || nameLower.includes("dips") || nameLower.includes("tricep") || nameLower.includes("triceps") || nameLower.includes("pushdown") || nameLower.includes("extension")) {
    return "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOTV4bHF2eXU4eWZsc29tZndyYWVtbjR6dWU3dGkwdHNyeTV6ZW5xeCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o84U39K5Cj6D0v2w0/giphy.gif";
  }
  if (nameLower.includes("press") || nameLower.includes("raise") || nameLower.includes("deltoid") || nameLower.includes("shoulders") || nameLower.includes("delts")) {
    return "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExZHp5NDZocWlkNDNuN2psZHZpcXpnaXR2MXByajVwNG9tZG5reHR1NCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7qE6b39zV1LALZRe/giphy.gif";
  }

  return "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3h2bzNyMTZ4ZHp0aXB6dnZzcDZrcTZhbmplbmF2MnpydzF1b3ByMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/u8946fAnhQ6cH9R16e/giphy.gif";
}

export interface Program {
  id: string;
  name: string;
  category: "Home Workout Programs" | "Men's Programs" | "Women's Programs" | "Calisthenics Programs" | "Training Styles";
  description: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  searchTags: string[];
  imageUrl: string;
  isPremium: boolean;
  schedule: {
    day: string;
    focus: string;
    exercises: string[]; // exercise names or IDs
    mealPlan?: string;  // Shred, Bulk, or Lean meal plans
  }[];
}

export const BACKUP_EXERCISE_MEDIA = {
  chest: "",
  back: "",
  shoulders: "",
  arms: "",
  core: "",
  legs: "",
  neck: "",
  cardio: "",
  mobility: ""
};

export const REAL_EXERCISE_MEDIA = {
  chest: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&auto=format&fit=crop&q=80",
  back: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=600&auto=format&fit=crop&q=80",
  shoulders: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&auto=format&fit=crop&q=80",
  arms: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80",
  core: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
  legs: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop&q=80",
  neck: "",
  cardio: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=600&auto=format&fit=crop&q=80",
  mobility: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80"
};

interface RawExerciseData {
  name: string;
  displayName?: string;
  category: "Gym Workouts" | "Home Workouts" | "Cardio Workouts" | "Calisthenics Workouts" | "Military Style Fitness";
  sub: string; // Sub-segment like Chest, Back, HIIT Cardio, Beginner Calisthenics etc.
  equipment: string[];
  primary: string;
  secondary: string[];
  diff: "Beginner" | "Intermediate" | "Advanced";
}

const RAW_EXERCISES_DATA: RawExerciseData[] = [
  // ================= GYM WORKOUTS =================
  // CHEST
  { name: "Barbell Bench Press", category: "Gym Workouts", sub: "Chest", equipment: ["Barbell"], primary: "Chest", secondary: ["Triceps", "Shoulders"], diff: "Intermediate" },
  { name: "Incline Dumbbell Press", category: "Gym Workouts", sub: "Chest", equipment: ["Dumbbell"], primary: "Chest", secondary: ["Shoulders"], diff: "Intermediate" },
  { name: "Dumbbell Chest Press", category: "Gym Workouts", sub: "Chest", equipment: ["Dumbbell"], primary: "Chest", secondary: ["Triceps"], diff: "Intermediate" },
  { name: "Decline Bench Press", category: "Gym Workouts", sub: "Chest", equipment: ["Barbell"], primary: "Chest", secondary: ["Triceps"], diff: "Intermediate" },
  { name: "Cable Chest Fly", category: "Gym Workouts", sub: "Chest", equipment: ["Cable Machine"], primary: "Chest", secondary: ["Front Delts"], diff: "Intermediate" },
  { name: "Dumbbell Fly", category: "Gym Workouts", sub: "Chest", equipment: ["Dumbbell"], primary: "Chest", secondary: ["Front Delts"], diff: "Beginner" },
  { name: "Push Ups", category: "Gym Workouts", sub: "Chest", equipment: ["Bodyweight"], primary: "Chest", secondary: ["Triceps", "Core"], diff: "Beginner" },
  { name: "Chest Dips", category: "Gym Workouts", sub: "Chest", equipment: ["Bodyweight"], primary: "Chest", secondary: ["Triceps", "Shoulders"], diff: "Intermediate" },
  { name: "Machine Chest Press", category: "Gym Workouts", sub: "Chest", equipment: ["Machine"], primary: "Chest", secondary: ["Triceps"], diff: "Beginner" },
  { name: "Pec Deck Fly", category: "Gym Workouts", sub: "Chest", equipment: ["Machine"], primary: "Chest", secondary: ["Front Delts"], diff: "Beginner" },

  // BACK
  { name: "Pull Ups", category: "Gym Workouts", sub: "Back", equipment: ["Bodyweight"], primary: "Back", secondary: ["Biceps", "Lats"], diff: "Intermediate" },
  { name: "Lat Pulldown", category: "Gym Workouts", sub: "Back", equipment: ["Machine"], primary: "Back", secondary: ["Biceps"], diff: "Beginner" },
  { name: "Barbell Row", category: "Gym Workouts", sub: "Back", equipment: ["Barbell"], primary: "Back", secondary: ["Biceps", "Core"], diff: "Intermediate" },
  { name: "Seated Cable Row", category: "Gym Workouts", sub: "Back", equipment: ["Cable Machine"], primary: "Back", secondary: ["Biceps"], diff: "Beginner" },
  { name: "Dumbbell Row", category: "Gym Workouts", sub: "Back", equipment: ["Dumbbell"], primary: "Back", secondary: ["Biceps"], diff: "Beginner" },
  { name: "T Bar Row", category: "Gym Workouts", sub: "Back", equipment: ["Barbell"], primary: "Back", secondary: ["Biceps"], diff: "Intermediate" },
  { name: "Deadlift", category: "Gym Workouts", sub: "Back", equipment: ["Barbell"], primary: "Back", secondary: ["Hamstrings", "Glutes", "Lower Back"], diff: "Advanced" },
  { name: "Straight Arm Pulldown", category: "Gym Workouts", sub: "Back", equipment: ["Cable Machine"], primary: "Back", secondary: ["Triceps"], diff: "Intermediate" },
  { name: "Face Pulls", category: "Gym Workouts", sub: "Back", equipment: ["Cable Machine"], primary: "Back", secondary: ["Shoulders", "Traps"], diff: "Beginner" },
  { name: "Back Extension", category: "Gym Workouts", sub: "Back", equipment: ["Machine"], primary: "Back", secondary: ["Glutes", "Hamstrings"], diff: "Beginner" },

  // SHOULDERS
  { name: "Overhead Barbell Press", category: "Gym Workouts", sub: "Shoulders", equipment: ["Barbell"], primary: "Shoulders", secondary: ["Triceps"], diff: "Intermediate" },
  { name: "Dumbbell Shoulder Press", category: "Gym Workouts", sub: "Shoulders", equipment: ["Dumbbell"], primary: "Shoulders", secondary: ["Triceps"], diff: "Intermediate" },
  { name: "Lateral Raises", category: "Gym Workouts", sub: "Shoulders", equipment: ["Dumbbell"], primary: "Shoulders", secondary: ["Traps"], diff: "Beginner" },
  { name: "Front Raises", category: "Gym Workouts", sub: "Shoulders", equipment: ["Dumbbell"], primary: "Shoulders", secondary: ["Chest"], diff: "Beginner" },
  { name: "Rear Delt Fly", category: "Gym Workouts", sub: "Shoulders", equipment: ["Dumbbell"], primary: "Shoulders", secondary: ["Traps"], diff: "Beginner" },
  { name: "Arnold Press", category: "Gym Workouts", sub: "Shoulders", equipment: ["Dumbbell"], primary: "Shoulders", secondary: ["Triceps"], diff: "Intermediate" },
  { name: "Cable Lateral Raise", category: "Gym Workouts", sub: "Shoulders", equipment: ["Cable Machine"], primary: "Shoulders", secondary: ["Traps"], diff: "Intermediate" },
  { name: "Upright Row", category: "Gym Workouts", sub: "Shoulders", equipment: ["Barbell"], primary: "Shoulders", secondary: ["Traps"], diff: "Intermediate" },
  { name: "Shrugs", category: "Gym Workouts", sub: "Shoulders", equipment: ["Dumbbell"], primary: "Shoulders", secondary: ["Traps"], diff: "Beginner" },
  { name: "Machine Shoulder Press", category: "Gym Workouts", sub: "Shoulders", equipment: ["Machine"], primary: "Shoulders", secondary: ["Triceps"], diff: "Beginner" },

  // BICEPS
  { name: "Barbell Curl", category: "Gym Workouts", sub: "Biceps", equipment: ["Barbell"], primary: "Biceps", secondary: ["Forearms"], diff: "Beginner" },
  { name: "Dumbbell Curl", category: "Gym Workouts", sub: "Biceps", equipment: ["Dumbbell"], primary: "Biceps", secondary: ["Forearms"], diff: "Beginner" },
  { name: "Hammer Curl", category: "Gym Workouts", sub: "Biceps", equipment: ["Dumbbell"], primary: "Biceps", secondary: ["Forearms"], diff: "Beginner" },
  { name: "Preacher Curl", category: "Gym Workouts", sub: "Biceps", equipment: ["EZ-Bar"], primary: "Biceps", secondary: ["Forearms"], diff: "Beginner" },
  { name: "Cable Curl", category: "Gym Workouts", sub: "Biceps", equipment: ["Cable Machine"], primary: "Biceps", secondary: ["Forearms"], diff: "Beginner" },
  { name: "Concentration Curl", category: "Gym Workouts", sub: "Biceps", equipment: ["Dumbbell"], primary: "Biceps", secondary: ["Forearms"], diff: "Beginner" },
  { name: "Incline Dumbbell Curl", category: "Gym Workouts", sub: "Biceps", equipment: ["Dumbbell"], primary: "Biceps", secondary: ["Forearms"], diff: "Beginner" },
  { name: "EZ Bar Curl", category: "Gym Workouts", sub: "Biceps", equipment: ["EZ-Bar"], primary: "Biceps", secondary: ["Forearms"], diff: "Beginner" },

  // TRICEPS
  { name: "Triceps Pushdown", category: "Gym Workouts", sub: "Triceps", equipment: ["Cable Machine"], primary: "Triceps", secondary: ["Forearms"], diff: "Beginner" },
  { name: "Skull Crushers", category: "Gym Workouts", sub: "Triceps", equipment: ["EZ-Bar"], primary: "Triceps", secondary: ["Forearms"], diff: "Intermediate" },
  { name: "Close Grip Bench Press", category: "Gym Workouts", sub: "Triceps", equipment: ["Barbell"], primary: "Triceps", secondary: ["Chest", "Shoulders"], diff: "Intermediate" },
  { name: "Overhead Triceps Extension", category: "Gym Workouts", sub: "Triceps", equipment: ["Dumbbell"], primary: "Triceps", secondary: ["Forearms"], diff: "Beginner" },
  { name: "Dips", category: "Gym Workouts", sub: "Triceps", equipment: ["Bodyweight"], primary: "Triceps", secondary: ["Chest", "Shoulders"], diff: "Intermediate" },
  { name: "Dumbbell Kickbacks", category: "Gym Workouts", sub: "Triceps", equipment: ["Dumbbell"], primary: "Triceps", secondary: ["Shoulders"], diff: "Beginner" },
  { name: "Cable Overhead Extension", category: "Gym Workouts", sub: "Triceps", equipment: ["Cable Machine"], primary: "Triceps", secondary: ["Forearms"], diff: "Intermediate" },

  // LEGS
  { name: "Barbell Squat", category: "Gym Workouts", sub: "Legs", equipment: ["Barbell"], primary: "Legs", secondary: ["Glutes", "Hamstrings"], diff: "Intermediate" },
  { name: "Leg Press", category: "Gym Workouts", sub: "Legs", equipment: ["Machine"], primary: "Legs", secondary: ["Hamstrings", "Glutes"], diff: "Beginner" },
  { name: "Lunges", category: "Gym Workouts", sub: "Legs", equipment: ["Dumbbell"], primary: "Legs", secondary: ["Glutes", "Hamstrings"], diff: "Beginner" },
  { name: "Romanian Deadlift", category: "Gym Workouts", sub: "Legs", equipment: ["Barbell"], primary: "Legs", secondary: ["Glutes", "Hamstrings"], diff: "Intermediate" },
  { name: "Leg Extension", category: "Gym Workouts", sub: "Legs", equipment: ["Machine"], primary: "Legs", secondary: [], diff: "Beginner" },
  { name: "Leg Curl", category: "Gym Workouts", sub: "Legs", equipment: ["Machine"], primary: "Legs", secondary: [], diff: "Beginner" },
  { name: "Calf Raises", category: "Gym Workouts", sub: "Legs", equipment: ["Dumbbell"], primary: "Calves", secondary: [], diff: "Beginner" },
  { name: "Bulgarian Split Squat", category: "Gym Workouts", sub: "Legs", equipment: ["Dumbbell"], primary: "Legs", secondary: ["Glutes", "Hamstrings"], diff: "Intermediate" },
  { name: "Hip Thrust", category: "Gym Workouts", sub: "Legs", equipment: ["Barbell"], primary: "Glutes", secondary: ["Hamstrings"], diff: "Intermediate" },
  { name: "Goblet Squat", category: "Gym Workouts", sub: "Legs", equipment: ["Kettlebell"], primary: "Legs", secondary: ["Glutes", "Core"], diff: "Beginner" },

  // ABS AND CORE
  { name: "Hanging Leg Raise", category: "Gym Workouts", sub: "Abs and Core", equipment: ["Pullup Bar"], primary: "Core", secondary: ["Abs"], diff: "Intermediate" },
  { name: "Cable Crunch", category: "Gym Workouts", sub: "Abs and Core", equipment: ["Cable Machine"], primary: "Core", secondary: ["Abs"], diff: "Intermediate" },
  { name: "Plank", category: "Gym Workouts", sub: "Abs and Core", equipment: ["Bodyweight"], primary: "Core", secondary: ["Shoulders"], diff: "Beginner" },
  { name: "Russian Twist", category: "Gym Workouts", sub: "Abs and Core", equipment: ["Bodyweight"], primary: "Core", secondary: ["Obliques"], diff: "Beginner" },
  { name: "Bicycle Crunch", category: "Gym Workouts", sub: "Abs and Core", equipment: ["Bodyweight"], primary: "Core", secondary: ["Abs"], diff: "Beginner" },
  { name: "Mountain Climbers", category: "Gym Workouts", sub: "Abs and Core", equipment: ["Bodyweight"], primary: "Core", secondary: ["Cardio"], diff: "Beginner" },
  { name: "Ab Wheel Rollout", category: "Gym Workouts", sub: "Abs and Core", equipment: ["Ab Wheel"], primary: "Core", secondary: ["Lats"], diff: "Intermediate" },
  { name: "Sit Ups", category: "Gym Workouts", sub: "Abs and Core", equipment: ["Bodyweight"], primary: "Core", secondary: ["Abs"], diff: "Beginner" },

  // ================= HOME WORKOUTS =================
  // FULL BODY HOME WORKOUT
  { name: "Full Body Home Workout: Push Ups", displayName: "Push Ups", category: "Home Workouts", sub: "Full Body Home Workout", equipment: ["Bodyweight"], primary: "Chest", secondary: ["Triceps", "Core"], diff: "Beginner" },
  { name: "Full Body Home Workout: Bodyweight Squats", displayName: "Bodyweight Squats", category: "Home Workouts", sub: "Full Body Home Workout", equipment: ["Bodyweight"], primary: "Legs", secondary: ["Glutes", "Hamstrings"], diff: "Beginner" },
  { name: "Full Body Home Workout: Lunges", displayName: "Lunges", category: "Home Workouts", sub: "Full Body Home Workout", equipment: ["Bodyweight"], primary: "Legs", secondary: ["Glutes", "Hamstrings"], diff: "Beginner" },
  { name: "Full Body Home Workout: Glute Bridges", displayName: "Glute Bridges", category: "Home Workouts", sub: "Full Body Home Workout", equipment: ["Bodyweight"], primary: "Glutes", secondary: ["Hamstrings"], diff: "Beginner" },
  { name: "Full Body Home Workout: Plank", displayName: "Plank", category: "Home Workouts", sub: "Full Body Home Workout", equipment: ["Bodyweight"], primary: "Core", secondary: ["Shoulders"], diff: "Beginner" },
  { name: "Full Body Home Workout: Mountain Climbers", displayName: "Mountain Climbers", category: "Home Workouts", sub: "Full Body Home Workout", equipment: ["Bodyweight"], primary: "Core", secondary: ["Cardio"], diff: "Beginner" },
  { name: "Full Body Home Workout: Burpees", displayName: "Burpees", category: "Home Workouts", sub: "Full Body Home Workout", equipment: ["Bodyweight"], primary: "Full Body", secondary: ["Cardio"], diff: "Intermediate" },
  { name: "Full Body Home Workout: Jumping Jacks", displayName: "Jumping Jacks", category: "Home Workouts", sub: "Full Body Home Workout", equipment: ["Bodyweight"], primary: "Cardio", secondary: ["Full Body"], diff: "Beginner" },
  { name: "Full Body Home Workout: High Knees", displayName: "High Knees", category: "Home Workouts", sub: "Full Body Home Workout", equipment: ["Bodyweight"], primary: "Cardio", secondary: ["Legs"], diff: "Beginner" },
  { name: "Full Body Home Workout: Bear Crawl", displayName: "Bear Crawl", category: "Home Workouts", sub: "Full Body Home Workout", equipment: ["Bodyweight"], primary: "Full Body", secondary: ["Core"], diff: "Intermediate" },

  // HOME CHEST WORKOUT
  { name: "Home Chest Workout: Standard Push Ups", displayName: "Standard Push Ups", category: "Home Workouts", sub: "Home Chest Workout", equipment: ["Bodyweight"], primary: "Chest", secondary: ["Triceps"], diff: "Beginner" },
  { name: "Home Chest Workout: Wide Push Ups", displayName: "Wide Push Ups", category: "Home Workouts", sub: "Home Chest Workout", equipment: ["Bodyweight"], primary: "Chest", secondary: ["Shoulders"], diff: "Beginner" },
  { name: "Home Chest Workout: Diamond Push Ups", displayName: "Diamond Push Ups", category: "Home Workouts", sub: "Home Chest Workout", equipment: ["Bodyweight"], primary: "Triceps", secondary: ["Chest"], diff: "Intermediate" },
  { name: "Home Chest Workout: Incline Push Ups", displayName: "Incline Push Ups", category: "Home Workouts", sub: "Home Chest Workout", equipment: ["Bodyweight"], primary: "Lower Chest", secondary: ["Triceps"], diff: "Beginner" },
  { name: "Home Chest Workout: Decline Push Ups", displayName: "Decline Push Ups", category: "Home Workouts", sub: "Home Chest Workout", equipment: ["Bodyweight"], primary: "Upper Chest", secondary: ["Triceps"], diff: "Intermediate" },
  { name: "Home Chest Workout: Chest Squeeze Push Ups", displayName: "Chest Squeeze Push Ups", category: "Home Workouts", sub: "Home Chest Workout", equipment: ["Bodyweight"], primary: "Inner Chest", secondary: ["Triceps"], diff: "Intermediate" },

  // HOME LEG WORKOUT
  { name: "Home Leg Workout: Bodyweight Squats", displayName: "Bodyweight Squats", category: "Home Workouts", sub: "Home Leg Workout", equipment: ["Bodyweight"], primary: "Legs", secondary: ["Glutes"], diff: "Beginner" },
  { name: "Home Leg Workout: Jump Squats", displayName: "Jump Squats", category: "Home Workouts", sub: "Home Leg Workout", equipment: ["Bodyweight"], primary: "Legs", secondary: ["Cardio"], diff: "Intermediate" },
  { name: "Home Leg Workout: Walking Lunges", displayName: "Walking Lunges", category: "Home Workouts", sub: "Home Leg Workout", equipment: ["Bodyweight"], primary: "Legs", secondary: ["Glutes"], diff: "Beginner" },
  { name: "Home Leg Workout: Reverse Lunges", displayName: "Reverse Lunges", category: "Home Workouts", sub: "Home Leg Workout", equipment: ["Bodyweight"], primary: "Legs", secondary: ["Glutes"], diff: "Beginner" },
  { name: "Home Leg Workout: Wall Sit", displayName: "Wall Sit", category: "Home Workouts", sub: "Home Leg Workout", equipment: ["Bodyweight"], primary: "Legs", secondary: ["Calves"], diff: "Beginner" },
  { name: "Home Leg Workout: Single Leg Glute Bridge", displayName: "Single Leg Glute Bridge", category: "Home Workouts", sub: "Home Leg Workout", equipment: ["Bodyweight"], primary: "Glutes", secondary: ["Hamstrings"], diff: "Intermediate" },
  { name: "Home Leg Workout: Calf Raises", displayName: "Calf Raises", category: "Home Workouts", sub: "Home Leg Workout", equipment: ["Bodyweight"], primary: "Calves", secondary: [], diff: "Beginner" },

  // HOME CORE WORKOUT
  { name: "Home Core Workout: Plank", displayName: "Plank", category: "Home Workouts", sub: "Home Core Workout", equipment: ["Bodyweight"], primary: "Core", secondary: ["Shoulders"], diff: "Beginner" },
  { name: "Home Core Workout: Side Plank", displayName: "Side Plank", category: "Home Workouts", sub: "Home Core Workout", equipment: ["Bodyweight"], primary: "Obliques", secondary: ["Core"], diff: "Intermediate" },
  { name: "Home Core Workout: Leg Raises", displayName: "Leg Raises", category: "Home Workouts", sub: "Home Core Workout", equipment: ["Bodyweight"], primary: "Core", secondary: ["Abs"], diff: "Beginner" },
  { name: "Home Core Workout: Sit Ups", displayName: "Sit Ups", category: "Home Workouts", sub: "Home Core Workout", equipment: ["Bodyweight"], primary: "Core", secondary: ["Abs"], diff: "Beginner" },
  { name: "Home Core Workout: Crunches", displayName: "Crunches", category: "Home Workouts", sub: "Home Core Workout", equipment: ["Bodyweight"], primary: "Abs", secondary: [], diff: "Beginner" },
  { name: "Home Core Workout: Flutter Kicks", displayName: "Flutter Kicks", category: "Home Workouts", sub: "Home Core Workout", equipment: ["Bodyweight"], primary: "Abs", secondary: ["Core"], diff: "Beginner" },
  { name: "Home Core Workout: Russian Twist", displayName: "Russian Twist", category: "Home Workouts", sub: "Home Core Workout", equipment: ["Bodyweight"], primary: "Obliques", secondary: ["Core"], diff: "Beginner" },

  // ================= CARDIO WORKOUTS =================
  // FAT BURNING CARDIO
  { name: "Fat Burning Cardio: Running", displayName: "Running", category: "Cardio Workouts", sub: "Fat Burning Cardio", equipment: ["Bodyweight"], primary: "Cardio", secondary: ["Legs"], diff: "Beginner" },
  { name: "Fat Burning Cardio: Walking", displayName: "Walking", category: "Cardio Workouts", sub: "Fat Burning Cardio", equipment: ["Bodyweight"], primary: "Cardio", secondary: ["Legs"], diff: "Beginner" },
  { name: "Fat Burning Cardio: Cycling", displayName: "Cycling", category: "Cardio Workouts", sub: "Fat Burning Cardio", equipment: ["Stationary Bike"], primary: "Cardio", secondary: ["Legs"], diff: "Beginner" },
  { name: "Fat Burning Cardio: Jump Rope", displayName: "Jump Rope", category: "Cardio Workouts", sub: "Fat Burning Cardio", equipment: ["Jump Rope"], primary: "Cardio", secondary: ["Calves"], diff: "Beginner" },
  { name: "Fat Burning Cardio: Rowing Machine", displayName: "Rowing Machine", category: "Cardio Workouts", sub: "Fat Burning Cardio", equipment: ["Rowing Machine"], primary: "Cardio", secondary: ["Back", "Arms"], diff: "Intermediate" },
  { name: "Fat Burning Cardio: Stair Climbing", displayName: "Stair Climbing", category: "Cardio Workouts", sub: "Fat Burning Cardio", equipment: ["Bodyweight"], primary: "Cardio", secondary: ["Legs"], diff: "Beginner" },
  { name: "Fat Burning Cardio: Elliptical Training", displayName: "Elliptical Training", category: "Cardio Workouts", sub: "Fat Burning Cardio", equipment: ["Elliptical Machine"], primary: "Cardio", secondary: ["Legs"], diff: "Beginner" },
  { name: "Fat Burning Cardio: Swimming", displayName: "Swimming", category: "Cardio Workouts", sub: "Fat Burning Cardio", equipment: ["Bodyweight"], primary: "Cardio", secondary: ["Full Body"], diff: "Intermediate" },
  { name: "Fat Burning Cardio: Hiking", displayName: "Hiking", category: "Cardio Workouts", sub: "Fat Burning Cardio", equipment: ["Bodyweight"], primary: "Cardio", secondary: ["Legs"], diff: "Beginner" },
  { name: "Fat Burning Cardio: Sprint Intervals", displayName: "Sprint Intervals", category: "Cardio Workouts", sub: "Fat Burning Cardio", equipment: ["Bodyweight"], primary: "Cardio", secondary: ["Legs"], diff: "Intermediate" },

  // HIIT CARDIO
  { name: "HIIT Cardio: Burpees", displayName: "Burpees", category: "Cardio Workouts", sub: "HIIT Cardio", equipment: ["Bodyweight"], primary: "Cardio", secondary: ["Full Body"], diff: "Intermediate" },
  { name: "HIIT Cardio: High Knees", displayName: "High Knees", category: "Cardio Workouts", sub: "HIIT Cardio", equipment: ["Bodyweight"], primary: "Cardio", secondary: ["Legs"], diff: "Beginner" },
  { name: "HIIT Cardio: Jump Squats", displayName: "Jump Squats", category: "Cardio Workouts", sub: "HIIT Cardio", equipment: ["Bodyweight"], primary: "Cardio", secondary: ["Legs"], diff: "Intermediate" },
  { name: "HIIT Cardio: Mountain Climbers", displayName: "Mountain Climbers", category: "Cardio Workouts", sub: "HIIT Cardio", equipment: ["Bodyweight"], primary: "Cardio", secondary: ["Core"], diff: "Beginner" },
  { name: "HIIT Cardio: Jumping Jacks", displayName: "Jumping Jacks", category: "Cardio Workouts", sub: "HIIT Cardio", equipment: ["Bodyweight"], primary: "Cardio", secondary: ["Full Body"], diff: "Beginner" },
  { name: "HIIT Cardio: Sprint Intervals", displayName: "Sprint Intervals", category: "Cardio Workouts", sub: "HIIT Cardio", equipment: ["Bodyweight"], primary: "Cardio", secondary: ["Legs"], diff: "Intermediate" },
  { name: "HIIT Cardio: Skater Jumps", displayName: "Skater Jumps", category: "Cardio Workouts", sub: "HIIT Cardio", equipment: ["Bodyweight"], primary: "Cardio", secondary: ["Legs"], diff: "Intermediate" },
  { name: "HIIT Cardio: Battle Ropes", displayName: "Battle Ropes", category: "Cardio Workouts", sub: "HIIT Cardio", equipment: ["Battle Ropes"], primary: "Cardio", secondary: ["Arms", "Shoulders"], diff: "Intermediate" },
  { name: "HIIT Cardio: Box Jumps", displayName: "Box Jumps", category: "Cardio Workouts", sub: "HIIT Cardio", equipment: ["Plyo Box"], primary: "Cardio", secondary: ["Legs"], diff: "Intermediate" },
  { name: "HIIT Cardio: Kettlebell Swings", displayName: "Kettlebell Swings", category: "Cardio Workouts", sub: "HIIT Cardio", equipment: ["Kettlebell"], primary: "Cardio", secondary: ["Hamstrings", "Core"], diff: "Intermediate" },

  // ================= CALISTHENICS WORKOUTS =================
  // BEGINNER CALISTHENICS
  { name: "Beginner Calisthenics: Push Ups", displayName: "Push Ups", category: "Calisthenics Workouts", sub: "Beginner Calisthenics", equipment: ["Bodyweight"], primary: "Chest", secondary: ["Triceps"], diff: "Beginner" },
  { name: "Beginner Calisthenics: Bodyweight Squats", displayName: "Bodyweight Squats", category: "Calisthenics Workouts", sub: "Beginner Calisthenics", equipment: ["Bodyweight"], primary: "Legs", secondary: ["Glutes"], diff: "Beginner" },
  { name: "Beginner Calisthenics: Assisted Pull Ups", displayName: "Assisted Pull Ups", category: "Calisthenics Workouts", sub: "Beginner Calisthenics", equipment: ["Pullup Bar", "Resistance Band"], primary: "Back", secondary: ["Biceps"], diff: "Beginner" },
  { name: "Beginner Calisthenics: Dips", displayName: "Dips", category: "Calisthenics Workouts", sub: "Beginner Calisthenics", equipment: ["Dip Bar"], primary: "Triceps", secondary: ["Chest"], diff: "Beginner" },
  { name: "Beginner Calisthenics: Plank", displayName: "Plank", category: "Calisthenics Workouts", sub: "Beginner Calisthenics", equipment: ["Bodyweight"], primary: "Core", secondary: ["Shoulders"], diff: "Beginner" },
  { name: "Beginner Calisthenics: Lunges", displayName: "Lunges", category: "Calisthenics Workouts", sub: "Beginner Calisthenics", equipment: ["Bodyweight"], primary: "Legs", secondary: ["Glutes"], diff: "Beginner" },
  { name: "Beginner Calisthenics: Hollow Body Hold", displayName: "Hollow Body Hold", category: "Calisthenics Workouts", sub: "Beginner Calisthenics", equipment: ["Bodyweight"], primary: "Core", secondary: ["Abs"], diff: "Beginner" },
  { name: "Beginner Calisthenics: Jumping Jacks", displayName: "Jumping Jacks", category: "Calisthenics Workouts", sub: "Beginner Calisthenics", equipment: ["Bodyweight"], primary: "Cardio", secondary: ["Full Body"], diff: "Beginner" },

  // INTERMEDIATE CALISTHENICS
  { name: "Intermediate Calisthenics: Pull Ups", displayName: "Pull Ups", category: "Calisthenics Workouts", sub: "Intermediate Calisthenics", equipment: ["Pullup Bar"], primary: "Back", secondary: ["Biceps"], diff: "Intermediate" },
  { name: "Intermediate Calisthenics: Muscle Ups", displayName: "Muscle Ups", category: "Calisthenics Workouts", sub: "Intermediate Calisthenics", equipment: ["Pullup Bar"], primary: "Back", secondary: ["Arms", "Chest"], diff: "Advanced" },
  { name: "Intermediate Calisthenics: Handstand Hold", displayName: "Handstand Hold", category: "Calisthenics Workouts", sub: "Intermediate Calisthenics", equipment: ["Bodyweight"], primary: "Shoulders", secondary: ["Core"], diff: "Intermediate" },
  { name: "Intermediate Calisthenics: Pistol Squats", displayName: "Pistol Squats", category: "Calisthenics Workouts", sub: "Intermediate Calisthenics", equipment: ["Bodyweight"], primary: "Legs", secondary: ["Core"], diff: "Intermediate" },
  { name: "Intermediate Calisthenics: Archer Push Ups", displayName: "Archer Push Ups", category: "Calisthenics Workouts", sub: "Intermediate Calisthenics", equipment: ["Bodyweight"], primary: "Chest", secondary: ["Triceps", "Shoulders"], diff: "Intermediate" },
  { name: "Intermediate Calisthenics: Diamond Push Ups", displayName: "Diamond Push Ups", category: "Calisthenics Workouts", sub: "Intermediate Calisthenics", equipment: ["Bodyweight"], primary: "Triceps", secondary: ["Chest"], diff: "Intermediate" },
  { name: "Intermediate Calisthenics: L Sit", displayName: "L Sit", category: "Calisthenics Workouts", sub: "Intermediate Calisthenics", equipment: ["Dip Bar"], primary: "Core", secondary: ["Abs", "Shoulders"], diff: "Intermediate" },
  { name: "Intermediate Calisthenics: Dips", displayName: "Dips", category: "Calisthenics Workouts", sub: "Intermediate Calisthenics", equipment: ["Dip Bar"], primary: "Triceps", secondary: ["Chest"], diff: "Intermediate" },
  { name: "Intermediate Calisthenics: Dragon Flag", displayName: "Dragon Flag", category: "Calisthenics Workouts", sub: "Intermediate Calisthenics", equipment: ["Bench"], primary: "Core", secondary: ["Lats"], diff: "Advanced" },
  { name: "Intermediate Calisthenics: Front Lever Progression", displayName: "Front Lever Progression", category: "Calisthenics Workouts", sub: "Intermediate Calisthenics", equipment: ["Pullup Bar"], primary: "Back", secondary: ["Core"], diff: "Intermediate" },

  // ADVANCED CALISTHENICS
  { name: "Advanced Calisthenics: Handstand Push Ups", displayName: "Handstand Push Ups", category: "Calisthenics Workouts", sub: "Advanced Calisthenics", equipment: ["Bodyweight"], primary: "Shoulders", secondary: ["Triceps"], diff: "Advanced" },
  { name: "Advanced Calisthenics: Muscle Ups", displayName: "Muscle Ups", category: "Calisthenics Workouts", sub: "Advanced Calisthenics", equipment: ["Pullup Bar"], primary: "Back", secondary: ["Arms", "Chest"], diff: "Advanced" },
  { name: "Advanced Calisthenics: Front Lever", displayName: "Front Lever", category: "Calisthenics Workouts", sub: "Advanced Calisthenics", equipment: ["Pullup Bar"], primary: "Back", secondary: ["Core"], diff: "Advanced" },
  { name: "Advanced Calisthenics: Back Lever", displayName: "Back Lever", category: "Calisthenics Workouts", sub: "Advanced Calisthenics", equipment: ["Pullup Bar"], primary: "Shoulders", secondary: ["Back", "Biceps"], diff: "Advanced" },
  { name: "Advanced Calisthenics: Planche", displayName: "Planche", category: "Calisthenics Workouts", sub: "Advanced Calisthenics", equipment: ["Bodyweight"], primary: "Shoulders", secondary: ["Chest", "Core"], diff: "Advanced" },
  { name: "Advanced Calisthenics: One Arm Push Up", displayName: "One Arm Push Up", category: "Calisthenics Workouts", sub: "Advanced Calisthenics", equipment: ["Bodyweight"], primary: "Chest", secondary: ["Triceps", "Core"], diff: "Advanced" },
  { name: "Advanced Calisthenics: Human Flag", displayName: "Human Flag", category: "Calisthenics Workouts", sub: "Advanced Calisthenics", equipment: ["Stall Bars"], primary: "Shoulders", secondary: ["Obliques", "Core"], diff: "Advanced" },
  { name: "Advanced Calisthenics: Pistol Squat", displayName: "Pistol Squat", category: "Calisthenics Workouts", sub: "Advanced Calisthenics", equipment: ["Bodyweight"], primary: "Legs", secondary: ["Core"], diff: "Advanced" },
  { name: "Advanced Calisthenics: Handstand Walking", displayName: "Handstand Walking", category: "Calisthenics Workouts", sub: "Advanced Calisthenics", equipment: ["Bodyweight"], primary: "Shoulders", secondary: ["Core"], diff: "Advanced" },
  { name: "Advanced Calisthenics: Dragon Flag", displayName: "Dragon Flag", category: "Calisthenics Workouts", sub: "Advanced Calisthenics", equipment: ["Bench"], primary: "Core", secondary: ["Lats"], diff: "Advanced" },

  // ================= MILITARY STYLE FITNESS =================
  { name: "Military Style Fitness: Push Ups", displayName: "Push Ups", category: "Military Style Fitness", sub: "Military Fitness", equipment: ["Bodyweight"], primary: "Chest", secondary: ["Triceps"], diff: "Intermediate" },
  { name: "Military Style Fitness: Sit Ups", displayName: "Sit Ups", category: "Military Style Fitness", sub: "Military Fitness", equipment: ["Bodyweight"], primary: "Core", secondary: ["Abs"], diff: "Beginner" },
  { name: "Military Style Fitness: Pull Ups", displayName: "Pull Ups", category: "Military Style Fitness", sub: "Military Fitness", equipment: ["Pullup Bar"], primary: "Back", secondary: ["Biceps"], diff: "Intermediate" },
  { name: "Military Style Fitness: Burpees", displayName: "Burpees", category: "Military Style Fitness", sub: "Military Fitness", equipment: ["Bodyweight"], primary: "Cardio", secondary: ["Full Body"], diff: "Intermediate" },
  { name: "Military Style Fitness: Running", displayName: "Running", category: "Military Style Fitness", sub: "Military Fitness", equipment: ["Bodyweight"], primary: "Cardio", secondary: ["Legs"], diff: "Beginner" },
  { name: "Military Style Fitness: Sprinting", displayName: "Sprinting", category: "Military Style Fitness", sub: "Military Fitness", equipment: ["Bodyweight"], primary: "Cardio", secondary: ["Legs"], diff: "Intermediate" },
  { name: "Military Style Fitness: Bear Crawl", displayName: "Bear Crawl", category: "Military Style Fitness", sub: "Military Fitness", equipment: ["Bodyweight"], primary: "Full Body", secondary: ["Core"], diff: "Intermediate" },
  { name: "Military Style Fitness: Mountain Climbers", displayName: "Mountain Climbers", category: "Military Style Fitness", sub: "Military Fitness", equipment: ["Bodyweight"], primary: "Core", secondary: ["Cardio"], diff: "Beginner" },
  { name: "Military Style Fitness: Bodyweight Squats", displayName: "Bodyweight Squats", category: "Military Style Fitness", sub: "Military Fitness", equipment: ["Bodyweight"], primary: "Legs", secondary: ["Glutes"], diff: "Beginner" },
  { name: "Military Style Fitness: Lunges", displayName: "Lunges", category: "Military Style Fitness", sub: "Military Fitness", equipment: ["Bodyweight"], primary: "Legs", secondary: ["Glutes"], diff: "Beginner" },
  { name: "Military Style Fitness: Plank Holds", displayName: "Plank Holds", category: "Military Style Fitness", sub: "Military Fitness", equipment: ["Bodyweight"], primary: "Core", secondary: ["Shoulders"], diff: "Beginner" },
  { name: "Military Style Fitness: Jump Squats", displayName: "Jump Squats", category: "Military Style Fitness", sub: "Military Fitness", equipment: ["Bodyweight"], primary: "Legs", secondary: ["Cardio"], diff: "Intermediate" }
];

const generateExercises = (): Exercise[] => {
  return RAW_EXERCISES_DATA.map((raw, idx) => {
    const id = `exercise-${raw.category.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${raw.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
    const displayName = raw.displayName || raw.name;
    
    const instructions = [
      `Set up your starting alignment and stabilize your shoulders, lower back, and feet securely.`,
      `Begin executing ${displayName} focusing heavy attention on keeping tension strictly on your primary ${raw.primary}.`,
      `Hold the peak squeeze contraction at the top for 1 full second before moving to eccentric recovery.`,
      `Slowly lower the resistance under complete muscle control back to your baseline starting posture.`
    ];

    const commonMistakes = [
      `Allowing other neighboring joints to hyperextend or absorb joint load.`,
      `Using structural momentum or rushing through the lower eccentric segment.`
    ];

    const safetyTips = [
      `Always keep your spine completely neutral and avoid hyperextending joints.`,
      `Lower the resistance or weight immediately if pain or pinching is felt.`
    ];

    const benefits = [
      `Triggers powerful muscular hypertrophy inside active ${raw.primary} fiber bundles.`,
      `Reinforces compound mechanical stability across your target skeletal structure.`
    ];

    const isPremium = raw.diff === "Advanced" || idx % 4 === 0;

    return {
      id,
      name: displayName, // display name is simple, concise and exactly as requested
      muscleGroups: [raw.primary, ...raw.secondary],
      difficulty: raw.diff,
      instructions,
      equipment: raw.equipment,
      category: raw.category,
      commonMistakes,
      safetyTips,
      alternativeExercises: [raw.name.includes("Press") ? "Push Ups" : "Plank"],
      progressionVariations: ["Increase duration or increase weight load slightly", "Perform with longer eccentric counts"],
      isPremium,
      startingPosition: `Align with the ${raw.equipment.join(" and ")}, engage your abdominal core, and set your joints safely.`,
      movementExecution: `Drive the concentric phase forcefully through your ${raw.primary} muscles with strict biomechanical tension.`,
      finishingPosition: `Squeeze the active target area tightly at lock-out before releasing under total control.`,
      regressionVariations: ["Reduce sets or perform with partial range of motion initially"],
      musclesWorked: [raw.primary],
      gifUrl: getExerciseGifUrl(displayName, raw.category),
      breathingInstructions: "Inhale on the negative eccentric phase. Exhale forcefully on the active concentric execution.",
      recommendedSetsReps: "3 Sets x 10-12 Reps",
      recommendedSets: "3",
      recommendedReps: "10-12",
      restTime: "60s",
      caloriesBurned: raw.diff === "Beginner" ? 85 : raw.diff === "Intermediate" ? 115 : 145,
      benefits,
      trainerTips: `Focus closely on active mind-muscle connection. Keep tension on the ${raw.primary} rather than neighboring joints.`,
      safetyNotes: "Always warm up with light sets before attempting heavier work. Secure weights safely.",
      bodyPart: raw.sub
    };
  });
};

export const EXERCISES: Exercise[] = generateExercises();

export const PROGRAMS: Program[] = [
  {
    id: "gym-chest-mastery",
    name: "Gym Chest Mastery",
    category: "Training Styles",
    description: "Build severe chest thickness using premium gym equipment. Bench presses, incline presses, and cable flies combined with advanced biomechanical coaching.",
    duration: "4 Weeks",
    difficulty: "Intermediate",
    searchTags: ["gym", "chest", "bench press", "hypertrophy"],
    imageUrl: REAL_EXERCISE_MEDIA.chest,
    isPremium: false,
    schedule: [
      { day: "Day 1", focus: "Horizontal Push Power", exercises: ["Barbell Bench Press", "Dumbbell Chest Press", "Chest Dips"] },
      { day: "Day 2", focus: "Upper Chest Expansion", exercises: ["Incline Dumbbell Press", "Cable Chest Fly", "Push Ups"] }
    ]
  },
  {
    id: "gym-back-thickness",
    name: "V-Taper Gym Back Builder",
    category: "Training Styles",
    description: "Strengthen your Latissimus Dorsi, Traps and Rhomboids with heavy compound rows, pull ups, and lat pulldowns.",
    duration: "6 Weeks",
    difficulty: "Advanced",
    searchTags: ["back", "lats", "pullups", "deadlift"],
    imageUrl: REAL_EXERCISE_MEDIA.back,
    isPremium: true,
    schedule: [
      { day: "Day 1", focus: "Vertical Pulling Width", exercises: ["Pull Ups", "Lat Pulldown", "Straight Arm Pulldown"] },
      { day: "Day 2", focus: "Horizontal Thickness & Pull", exercises: ["Barbell Row", "Seated Cable Row", "Deadlift"] }
    ]
  },
  {
    id: "home-fullbody-shred",
    name: "Home Bodyweight Shred",
    category: "Home Workout Programs",
    description: "Perfect fat burner with zero gear. High intensity mountain climbers, squats, burpees, and planks directly from your living room.",
    duration: "4 Weeks",
    difficulty: "Beginner",
    searchTags: ["home", "bodyweight", "no equipment", "fat burn"],
    imageUrl: REAL_EXERCISE_MEDIA.mobility,
    isPremium: false,
    schedule: [
      { day: "Day 1", focus: "Full Body Fat Burn", exercises: ["Push Ups", "Bodyweight Squats", "Burpees", "Plank"] },
      { day: "Day 2", focus: "Cardio Endurance & Core", exercises: ["Jumping Jacks", "High Knees", "Mountain Climbers", "Glute Bridges"] }
    ]
  },
  {
    id: "elite-military-fitness",
    name: "Elite Military Conditioning",
    category: "Training Styles",
    description: "High-repetition military-style bodyweight training paired with sprint work to maximize combat-level fitness and peak structural longevity.",
    duration: "8 Weeks",
    difficulty: "Advanced",
    searchTags: ["military", "conditioning", "burpees", "running"],
    imageUrl: REAL_EXERCISE_MEDIA.shoulders,
    isPremium: true,
    schedule: [
      { day: "Day 1", focus: "Combat Conditioning", exercises: ["Push Ups", "Pull Ups", "Burpees", "Sprinting"] },
      { day: "Day 2", focus: "Core Endurance", exercises: ["Sit Ups", "Plank Holds", "Bear Crawl", "Jump Squats"] }
    ]
  }
];

export const MUSCLE_GROUPS = [
  "Chest", "Back", "Shoulders", "Biceps", "Triceps", "Legs", "Calves", "Core", "Abs", "Cardio", "Full Body"
];

export const WORKOUT_CATEGORIES = [
  "Gym Workouts", "Home Workouts", "Cardio Workouts", "Calisthenics Workouts", "Military Style Fitness"
];
