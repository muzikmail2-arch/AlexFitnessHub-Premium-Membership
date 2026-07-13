import React, { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { Exercise } from "../data/exercises";
import WorkoutVisual from "./WorkoutVisual";
import { 
  Sparkles, Lock, ChevronRight, Bookmark, Search, Trash2, 
  Dumbbell, CheckCircle2, Award, Calendar, HelpCircle, X, Check, Clipboard
} from "lucide-react";

interface SavedExercisesViewProps {
  setView: (view: string) => void;
}

export default function SavedExercisesView({ setView }: SavedExercisesViewProps) {
  const { 
    user, 
    exercises, 
    savedWorkouts, 
    toggleSaveWorkout, 
    logWorkoutCompletion 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);

  React.useEffect(() => {
    if (selectedExerciseId) {
      // Reset scroll position of the backdrop container to top immediately and on next frame
      const resetScroll = () => {
        const backdrop = document.getElementById("saved-modal-backdrop");
        if (backdrop) {
          backdrop.scrollTop = 0;
        }
      };

      resetScroll();
      const timer = setTimeout(resetScroll, 50);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [selectedExerciseId]);

  // Form states for completion logger
  const [loggedReps, setLoggedReps] = useState("10");
  const [loggedWeight, setLoggedWeight] = useState("60");
  const [loggedNotes, setLoggedNotes] = useState("");
  const [logSuccess, setLogSuccess] = useState(false);

  const isUserPremium = user?.subscriptionStatus === "premium";

  // Filter bookmarked exercises
  const bookmarkedExercises = useMemo(() => {
    return exercises.filter((ex) => savedWorkouts.includes(ex.id));
  }, [exercises, savedWorkouts]);

  // Unique categories in saved list
  const categories = useMemo(() => {
    const list = new Set(bookmarkedExercises.map((e) => e.category));
    return ["All", ...Array.from(list)];
  }, [bookmarkedExercises]);

  // Filter and Search saved list
  const filteredExercises = useMemo(() => {
    return bookmarkedExercises.filter((ex) => {
      const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.muscleGroups.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === "All" || ex.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [bookmarkedExercises, searchQuery, selectedCategory]);

  const selectedExercise = useMemo(() => {
    if (!selectedExerciseId) return null;
    return exercises.find(ex => ex.id === selectedExerciseId) || null;
  }, [exercises, selectedExerciseId]);

  const handleOpenDetail = (ex: Exercise) => {
    setSelectedExerciseId(ex.id);
    setLogSuccess(false);
    setLoggedNotes("");
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

  const needsUpgrade = (ex: Exercise) => ex.isPremium && !isUserPremium;

  return (
    <div id="saved-exercises-root" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-white text-slate-900 min-h-screen">
      
      {/* 1. HERO TITLE BLOCK (Beautiful customized Red & White header) */}
      <div className="relative bg-white border-2 border-[#C0392B] rounded-3xl p-6 sm:p-8 overflow-hidden shadow-md">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Bookmark className="w-48 h-48 text-[#C0392B]" />
        </div>
        <div className="absolute inset-0 bg-red-50/20 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-red-50 border border-red-100 px-3.5 py-1.5 rounded-full mb-3">
              <span className="w-2 h-2 rounded-full bg-[#C0392B] animate-pulse" />
              <span className="text-[10px] sm:text-xs font-mono font-bold text-[#C0392B] uppercase tracking-widest">
                Dynamic Saved Vault ({bookmarkedExercises.length} Exercises)
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-sans font-black tracking-tight text-[#C0392B] leading-tight">
              YOUR SAVED WORKOUTS & EXERCISES
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mt-2 font-sans leading-relaxed">
              Curate and master your core biomechanical patterns. Pin your favorites here, preview video templates, and log performance history.
            </p>
          </div>
          <button
            onClick={() => setView("library")}
            className="self-start md:self-center px-5 py-3 rounded-xl text-xs font-mono font-black uppercase tracking-wider bg-[#C0392B] hover:bg-[#A82E22] text-white transition-all flex items-center gap-1.5 shadow-lg cursor-pointer"
          >
            <Dumbbell className="w-4 h-4" />
            <span>Discover Exercises</span>
          </button>
        </div>
      </div>

      {/* 2. SEARCH & RECOMMENDATION SECTION */}
      {bookmarkedExercises.length > 0 && (
        <div className="bg-white rounded-2xl border-2 border-red-50 p-5 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
          {/* Custom Styled Input bar */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#C0392B] pointer-events-none" />
            <input 
              type="text" 
              placeholder="Search by exercise name or primary muscle family..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-red-100 bg-white text-[#C0392B] placeholder:text-[#C0392B]/40 text-xs font-sans focus:outline-hidden focus:border-[#C0392B] transition-all outline-hidden font-bold"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C0392B] hover:text-red-800 text-xs font-black px-1.5"
              >
                ×
              </button>
            )}
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#C0392B] text-white shadow-xs"
                    : "bg-red-50/50 border border-red-100 text-[#C0392B] hover:bg-red-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. EXERCISES GRID LISTING */}
      {bookmarkedExercises.length === 0 ? (
        <div className="py-20 px-8 text-center border-2 border-dashed border-red-100 rounded-3xl bg-white max-w-3xl mx-auto flex flex-col items-center justify-center shadow-xs">
          <div className="w-16 h-16 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mb-4">
            <Bookmark className="w-8 h-8 text-[#C0392B]" />
          </div>
          <h3 className="text-lg font-sans font-extrabold text-[#C0392B] leading-tight animate-pulse">Your Saved Vault is Empty</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
            As you explore the workout library, bookmark technical movements so you can store tips, record practice sets, and customize coaching media.
          </p>
          <button
            onClick={() => setView("library")}
            className="mt-6 px-5 py-2.5 bg-[#C0392B] hover:bg-[#A82E22] text-white text-[10px] font-mono font-black uppercase tracking-widest rounded-xl transition shadow-md active:scale-95 cursor-pointer"
          >
            Go to Workout Library
          </button>
        </div>
      ) : filteredExercises.length === 0 ? (
        <div className="p-12 text-center border-2 border-dashed border-red-100 rounded-2xl bg-white shadow-xs">
          <HelpCircle className="w-10 h-10 text-[#C0392B] mx-auto mb-3" />
          <h4 className="text-sm font-bold text-[#C0392B]">No saved matches found</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">Try adapting your search tag or filter query.</p>
          <button 
            onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
            className="mt-4 px-5 py-2 bg-[#C0392B] hover:bg-[#A82E22] text-white text-[10px] font-bold rounded-lg uppercase tracking-widest font-mono transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map((ex) => {
            const hasUpgrade = needsUpgrade(ex);
            return (
              <div 
                key={ex.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white border-2 border-red-100 hover:border-[#C0392B] hover:shadow-lg transition-all"
              >
                {/* Visual Media Header Block */}
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
                  
                  {/* Premium Tag */}
                  {ex.isPremium && (
                    <div className="absolute top-3 left-3 bg-[#C0392B] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-white fill-white" />
                      PREMIUM
                    </div>
                  )}

                  {/* Difficulty Tag */}
                  <div className="absolute top-3 right-3 bg-[#C0392B] text-white text-[9px] font-sans font-bold uppercase px-2.5 py-1 rounded border border-white/20">
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
                    <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                      {ex.instructions[0]} Focus on high structural execution on every repetition.
                    </p>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {ex.equipment.map((eq) => (
                        <span key={eq} className="bg-red-50 text-[9px] font-sans font-extrabold text-[#C0392B] px-2 py-1 rounded uppercase border border-red-100/50">
                          {eq}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer actions */}
                  <div className="mt-6 pt-4 border-t border-red-50 flex items-center justify-between gap-2">
                    <button
                      onClick={() => toggleSaveWorkout(ex.id)}
                      className="bg-red-50 hover:bg-[#C0392B] hover:text-white text-[#C0392B] text-[10px] px-3.5 py-2 rounded-lg font-bold uppercase transition-all flex items-center gap-1 shadow-xs cursor-pointer border border-red-100"
                      title="Remove from saved list"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>

                    <button
                      onClick={() => handleOpenDetail(ex)}
                      className="px-4 py-2 rounded-lg text-[10px] font-bold text-white uppercase bg-[#C0392B] hover:bg-[#A82E22] flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                    >
                      {hasUpgrade ? (
                        <>
                          <Lock className="w-3.5 h-3.5 text-red-200" />
                          Premium Limit
                        </>
                      ) : (
                        <>
                          View & Log
                          <ChevronRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Protected Upgrade Overlay for Premium variants */}
                {hasUpgrade && (
                  <div className="absolute inset-0 z-10 bg-[#C0392B]/95 p-6 flex flex-col justify-center items-center text-center text-white">
                    <div className="h-10 w-10 bg-white/10 text-white border border-white/20 rounded-full flex items-center justify-center mb-2 animate-bounce">
                      <Lock className="w-5 h-5" />
                    </div>
                    <h4 className="text-xs font-black tracking-wider uppercase text-white">Premium Locked</h4>
                    <p className="text-[10px] text-red-100 max-w-xs mt-1.5 leading-snug">
                      Access precise instructions, multi-angle biomechanical loops, and active performance trackers.
                    </p>
                    <button
                      onClick={() => handleOpenDetail(ex)}
                      className="mt-3.5 px-4 py-2 bg-white text-[#C0392B] text-[10px] font-black uppercase rounded-lg shadow-sm hover:bg-red-50 transition-all cursor-pointer"
                    >
                      Preview Benefits
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 4. MODAL DETAILED OVERLAY ZONE */}
      {selectedExercise && (
        <div 
          id="saved-modal-backdrop"
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedExerciseId(null); }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm cursor-pointer animate-fade-in p-2 sm:p-4"
        >
          <div className="relative w-full max-w-4xl max-h-[92vh] sm:max-h-[88vh] bg-white rounded-3xl border-2 border-[#C0392B] shadow-2xl flex flex-col cursor-default animate-slide-down">
            
            {/* Header control banner */}
            <div className="px-6 py-4 border-b border-red-100 bg-red-50 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="bg-[#C0392B] text-white text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded">
                  {selectedExercise.category}
                </span>
                <span className="text-xs text-red-300">•</span>
                <span className="text-xs font-bold text-[#C0392B]">Saved Target ID</span>
              </div>
              <button
                onClick={() => setSelectedExerciseId(null)}
                className="p-1.5 rounded-lg bg-white border border-red-100 hover:bg-red-50 text-[#C0392B] transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Modal Core Content */}
            <div id="saved-modal-scroll-container" className="p-6 sm:p-8 space-y-8 overflow-y-auto flex-1">
              <div className="grid md:grid-cols-12 gap-8">
                
                {/* Standard Media Visual Column */}
                <div className="md:col-span-7 space-y-4">
                  <h4 className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Execution Demonstration Loop
                  </h4>
                  <WorkoutVisual 
                    exerciseId={selectedExercise.id}
                    category={selectedExercise.category} 
                    muscleGroups={selectedExercise.muscleGroups} 
                    exerciseName={selectedExercise.name} 
                    className="h-72 w-full rounded-2xl overflow-hidden" 
                    customMediaUrl={selectedExercise.customMediaUrl}
                    customMediaType={selectedExercise.customMediaType}
                  />

                  {/* Muscles Worked Matrix Map */}
                  <div className="p-5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-850/40">
                    <h5 className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Target Anatomy Map Activation</h5>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedExercise.musclesWorked.map((muscle) => (
                        <span key={muscle} className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 dark:text-emerald-400 text-[10px] font-sans font-bold px-2.5 py-1 rounded">
                          {muscle}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Metadata and Logging Panel */}
                <div className="md:col-span-5 space-y-6 flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-sans font-black text-[#C0392B] tracking-tight leading-tight">
                      {selectedExercise.name}
                    </h2>
                    
                    {/* Equipment labels */}
                    <div className="mt-3 flex flex-wrap gap-1.5 pb-4 border-b border-red-100">
                      {selectedExercise.equipment.map((eq) => (
                        <span key={eq} className="bg-red-50 border border-red-100 text-[10px] font-sans font-bold text-[#C0392B] px-2 py-0.5 rounded">
                          {eq}
                        </span>
                      ))}
                      <span className="bg-red-50 border border-red-100 text-[10px] font-sans font-bold text-[#C0392B] px-2 py-0.5 rounded">
                        {selectedExercise.difficulty}
                      </span>
                    </div>

                    {/* Check if upgrade required */}
                    {needsUpgrade(selectedExercise) ? (
                      <div className="mt-6 p-5 rounded-2xl border border-dashed border-[#C0392B]/30 bg-red-50/20 space-y-4">
                        <div className="flex gap-3">
                          <Lock className="w-5 h-5 text-[#C0392B] mt-0.5 shrink-0" />
                          <div>
                            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#C0392B]">Biomechanical Upgrade Required</h4>
                            <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                              Upgrade to unlocked master accounts to read precise instructions, alternative setups, injury prevention tips, and complete logs.
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setView("pricing")}
                          className="w-full py-2.5 rounded-xl bg-[#C0392B] hover:bg-[#A82E22] text-white text-[10px] font-mono font-black uppercase tracking-widest shadow-lg transition"
                        >
                          Unlock All Premium Exercises
                        </button>
                      </div>
                    ) : (
                      <div className="mt-6 space-y-4">
                        {/* Dynamic Step Instructions */}
                        <div>
                          <h4 className="text-[10px] font-mono font-bold text-[#C0392B] uppercase tracking-widest mb-2">Step-by-step Execution</h4>
                          <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-600 leading-relaxed font-sans">
                            {selectedExercise.instructions.map((inst, i) => (
                              <li key={i} className="pl-1 text-slate-755"><span className="font-semibold text-slate-800">{inst}</span></li>
                            ))}
                          </ol>
                        </div>

                        {/* Starting/Execution states */}
                        <div className="mt-6 space-y-3.5 pt-4 border-t border-red-100">
                          <div>
                            <span className="text-[10px] font-mono font-bold text-[#C0392B] uppercase tracking-widest block">Position:</span>
                            <span className="text-xs text-slate-600 leading-relaxed">{selectedExercise.startingPosition}</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-mono font-bold text-[#C0392B] uppercase tracking-widest block">Execution:</span>
                            <span className="text-xs text-slate-600 leading-relaxed">{selectedExercise.movementExecution}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Practice Completion Logger */}
                  {!needsUpgrade(selectedExercise) && (
                    <div className="mt-8 pt-6 border-t border-red-100 bg-red-50/10 p-5 rounded-2xl border border-red-100">
                      <div className="flex items-center gap-2 mb-4">
                        <Clipboard className="w-4 h-4 text-[#C0392B]" />
                        <h4 className="text-[10px] font-mono font-bold text-[#C0392B] uppercase tracking-widest leading-none">Record Log Training Set</h4>
                      </div>

                      <form onSubmit={handleLogCompletion} className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[9px] font-mono font-bold text-[#C0392B] uppercase tracking-wider block mb-1">Reps Performed</label>
                            <input 
                              type="number" 
                              value={loggedReps}
                              onChange={(e) => setLoggedReps(e.target.value)}
                              className="w-full bg-white border border-red-100 text-[#C0392B] px-3 py-1.5 rounded-lg text-xs focus:ring-1 focus:ring-[#C0392B] outline-none" 
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-mono font-bold text-[#C0392B] uppercase tracking-wider block mb-1">Load / Weight (KG)</label>
                            <input 
                              type="number" 
                              value={loggedWeight}
                              onChange={(e) => setLoggedWeight(e.target.value)}
                              className="w-full bg-white border border-red-100 text-[#C0392B] px-3 py-1.5 rounded-lg text-xs focus:ring-1 focus:ring-[#C0392B] outline-none" 
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[9px] font-mono font-bold text-[#C0392B] uppercase tracking-wider block mb-1">Performance Form Notes</label>
                          <textarea 
                            rows={2}
                            placeholder="e.g., felt solid elbow lockout, slow negative velocity."
                            value={loggedNotes}
                            onChange={(e) => setLoggedNotes(e.target.value)}
                            className="w-full bg-white border border-red-100 text-[#C0392B] px-3 py-1.5 rounded-lg text-xs placeholder-[#C0392B]/40 focus:ring-1 focus:ring-[#C0392B] outline-none resize-none"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2 bg-[#C0392B] hover:bg-[#A82E22] text-white font-mono font-bold text-[10px] uppercase tracking-wider rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Submit Session Log</span>
                        </button>
                      </form>

                      {logSuccess && (
                        <div className="mt-3 p-2 bg-red-50 border border-red-100 text-[#C0392B] rounded-lg text-[10px] font-mono flex items-center gap-1">
                          <Check className="w-3 h-3 shrink-0" />
                          <span>Session successfully logged in your personal analytics!</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom standard quick footer */}
            <div className="px-6 py-4 border-t border-red-100 bg-red-50 flex items-center justify-end flex-shrink-0">
              <button
                onClick={() => setSelectedExerciseId(null)}
                className="px-4 py-2 bg-[#C0392B] hover:bg-[#A82E22] text-white font-mono text-[10px] font-bold uppercase tracking-wider rounded-xl transition cursor-pointer"
              >
                Close Panel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
