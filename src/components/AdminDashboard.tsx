import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { 
  Users, Sparkles, Dumbbell, ShieldCheck, UserCheck, Trash2, ArrowUpDown, Key, ToggleLeft, ToggleRight,
  Check, Copy, Link, Cpu, Globe, Activity, ChevronRight, AlertTriangle, Terminal, Settings, CreditCard, RefreshCw
} from "lucide-react";
import { TestimonialAdminManager } from "./TestimonialAdminManager";

export default function AdminDashboard() {
  const { user, exercises, allSystemUsers, adminTogglePremium, adminUpdateUserTier, adminModifySubscription } = useApp();
  
  const [userQuery, setUserQuery] = useState("");
  const [exerciseQuery, setExerciseQuery] = useState("");
  const [activeAdminTab, setActiveAdminTab] = useState<"directory" | "paystack">("directory");

  // Smoothly scroll to the top of the viewport whenever the active admin tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeAdminTab]);

  // Paystack Integration Status state
  const [paystackStatus, setPaystackStatus] = useState<any>(null);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Fetch Paystack configuration status
  const fetchPaystackStatus = async () => {
    setLoadingStatus(true);
    try {
      const res = await fetch("/api/payments/status");
      const data = await res.json();
      if (data.success) {
        setPaystackStatus(data);
      }
    } catch (err) {
      console.warn("Failed to fetch Paystack configuration status:", err);
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchPaystackStatus();
    }
  }, [user]);

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Safeguard view access
  if (!user || user.role !== "admin") {
    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <div className="p-8 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-xl space-y-4">
          <div className="h-12 w-12 bg-rose-500/10 text-rose-500 border border-rose-550/20 rounded-full flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold uppercase tracking-wider font-mono text-rose-500">Access Restricted</h4>
          <p className="text-xs text-slate-500">
            This module represents the primary administrative dashboard, accessible strictly to the admin email profile (<code className="bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded font-bold text-slate-950 dark:text-white">{(import.meta as any).env?.VITE_ADMIN_EMAIL || "alexfitnesshub@gmail.com"}</code>).
          </p>
        </div>
      </div>
    );
  }

  // Aggregate stats calculations
  const totalUsers = allSystemUsers.length;
  const premiumCount = allSystemUsers.filter(u => u.subscriptionStatus === "premium").length;
  const estimatedMonthlyRevenue = premiumCount * 19999;
  const totalPremiumExercises = exercises.filter(e => e.isPremium).length;

  const filteredUsers = allSystemUsers.filter(u => 
    u.displayName.toLowerCase().includes(userQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(userQuery.toLowerCase())
  );

  const filteredExercises = exercises.filter(e => 
    e.name.toLowerCase().includes(exerciseQuery.toLowerCase()) ||
    e.category.toLowerCase().includes(exerciseQuery.toLowerCase()) ||
    (e.categories && e.categories.some(cat => cat.toLowerCase().includes(exerciseQuery.toLowerCase())))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Title Panel */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 text-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div>
          <span className="text-[10px] font-extrabold uppercase font-mono tracking-widest text-[#D32F2F]">System Core Security Panel</span>
          <h2 className="text-2xl font-black tracking-tight mt-1 sm:text-3xl font-sans text-[#D32F2F]">
            AlexFitnessHub Administrative Terminal
          </h2>
          <p className="text-xs text-slate-500 max-w-xl mt-1">
            Perform global overrides, manage Paystack live webhooks, toggle premium exercises, and monitor subscription lifecycles.
          </p>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#D32F2F]/10 text-[#D32F2F] border border-[#D32F2F]/20 rounded-full text-xs font-mono font-bold uppercase">
          <ShieldCheck className="w-4 h-4 text-[#D32F2F]" />
          Alex Admin Active
        </div>
      </div>

      {/* CORE STATS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850">
          <Users className="w-5 h-5 text-blue-500 mb-2" />
          <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">Total Active Users</span>
          <h4 className="text-2xl font-black text-slate-950 dark:text-white mt-1">{totalUsers}</h4>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850">
          <Sparkles className="w-5 h-5 text-emerald-500 mb-2" />
          <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">Premium Members</span>
          <h4 className="text-2xl font-black text-emerald-400 mt-1">{premiumCount}</h4>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850">
          <span className="text-emerald-500 font-bold text-xs font-mono block mb-2">₦</span>
          <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">Monthly Revenue Rate</span>
          <h4 className="text-2xl font-black text-slate-950 dark:text-white mt-1">₦{estimatedMonthlyRevenue.toLocaleString()}</h4>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850">
          <Dumbbell className="w-5 h-5 text-violet-500 mb-2" />
          <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">Premium Exercises</span>
          <h4 className="text-2xl font-black text-slate-950 dark:text-white mt-1">{totalPremiumExercises}</h4>
        </div>

      </div>

      {/* TAB NAVIGATION SELECTOR */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveAdminTab("directory")}
          className={`pb-3 px-6 text-xs font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
            activeAdminTab === "directory"
              ? "border-[#D32F2F] text-[#D32F2F]"
              : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-350"
          }`}
        >
          Athletes & Exercises
        </button>
        <button
          onClick={() => setActiveAdminTab("paystack")}
          className={`pb-3 px-6 text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeAdminTab === "paystack"
              ? "border-[#D32F2F] text-[#D32F2F]"
              : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-350"
          }`}
        >
          <CreditCard className="w-4 h-4" />
          Paystack Webhooks & Callbacks
        </button>
      </div>

      {/* VIEW RENDERER BASED ON ACTIVE TAB */}
      {activeAdminTab === "directory" ? (
        <div className="grid lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: ACTIVE USER DIRECTORY OVERRIDES */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Active Athlete Profiles</h3>
                  <p className="text-[11px] text-slate-500 leading-normal">Database student record catalog with direct account upgrade override toggles.</p>
                </div>
                
                <input
                  type="text"
                  placeholder="Filter email / names..."
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  className="text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-950 dark:text-white focus:outline-none focus:border-[#D32F2F] max-w-[200px]"
                />
              </div>

              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                {filteredUsers.length === 0 ? (
                  <p className="text-center py-8 text-xs text-slate-500">No matching athlete records identified.</p>
                ) : (
                  filteredUsers.map((userProfile) => {
                    const isUserPremium = userProfile.subscriptionStatus === "premium";
                    return (
                      <div key={userProfile.uid} className="p-3.5 border border-slate-200 dark:border-slate-800/80 rounded-xl bg-slate-50 dark:bg-slate-900/40 flex justify-between items-center gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition">
                        <div>
                          <h5 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            {userProfile.displayName}
                            {userProfile.role === "admin" && (
                              <span className="text-[8px] font-bold bg-blue-500/10 text-blue-500 px-1 py-0.2 rounded uppercase font-mono">ROOT</span>
                            )}
                          </h5>
                          <span className="text-[10px] text-slate-500 font-mono tracking-wide">{userProfile.email}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-mono uppercase font-bold py-0.5 px-1.5 rounded ${
                            isUserPremium 
                              ? "bg-emerald-500/15 text-emerald-500" 
                              : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                          }`}>
                            {userProfile.subscriptionStatus || "free"}
                          </span>
                          
                          {/* Only toggle non-root admin accounts */}
                          {userProfile.role !== "admin" && (
                            <div className="flex items-center gap-1.5 flex-wrap justify-end">
                              <button
                                onClick={() => adminModifySubscription(userProfile.uid, "activate")}
                                title="Activate Premium (30 days)"
                                className="px-2 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white text-[9px] font-black uppercase rounded transition-all cursor-pointer"
                              >
                                Activate
                              </button>
                              <button
                                onClick={() => adminModifySubscription(userProfile.uid, "extend")}
                                title="Extend subscription (+30 days)"
                                className="px-2 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500 hover:text-white text-[9px] font-black uppercase rounded transition-all cursor-pointer"
                              >
                                Extend
                              </button>
                              {isUserPremium ? (
                                <button
                                  onClick={() => adminModifySubscription(userProfile.uid, "suspend")}
                                  title="Suspend Premium access immediately"
                                  className="px-2 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-white text-[9px] font-black uppercase rounded transition-all cursor-pointer"
                                >
                                  Suspend
                                </button>
                              ) : (
                                <button
                                  onClick={() => adminModifySubscription(userProfile.uid, "cancel")}
                                  title="Cancel Premium subscription completely"
                                  className="px-2 py-1 bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white text-[9px] font-black uppercase rounded transition-all cursor-pointer"
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: ROUTINE LOCK AND RELEASE OVERRIDES */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Database Exercises</h3>
                  <p className="text-[11px] text-slate-500 leading-normal">Toggle exercises as standard Free or locked under Premium.</p>
                </div>
                
                <input
                  type="text"
                  placeholder="Filter names..."
                  value={exerciseQuery}
                  onChange={(e) => setExerciseQuery(e.target.value)}
                  className="text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-950 dark:text-white focus:outline-none focus:border-indigo-500 max-w-[150px]"
                />
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {filteredExercises.map((ex) => (
                  <div key={ex.id} className="p-2.5 border border-slate-100 dark:border-slate-900 rounded-lg flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-slate-900 transition">
                    <div className="truncate max-w-[200px]">
                      <h5 className="font-semibold text-slate-900 dark:text-slate-200 truncate">{ex.name}</h5>
                      <span className="text-[9px] text-slate-400 font-mono italic">{ex.category}</span>
                    </div>

                    <button
                      onClick={() => adminTogglePremium(ex.id)}
                      title={ex.isPremium ? "Click to set standard FREE" : "Click to lock under PREMIUM"}
                      className="flex items-center gap-1.5 focus:outline-none"
                    >
                      {ex.isPremium ? (
                        <span className="flex items-center gap-1 text-emerald-400 font-mono text-[10px] font-bold">
                          <ToggleRight className="w-6 h-6 text-emerald-500" />
                          Premium
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-slate-400 font-mono text-[10px]">
                          <ToggleLeft className="w-6 h-6" />
                          Standard Lite
                        </span>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

        </div>
      ) : (
        /* NEW PAYSTACK LIVE INTEGRATION PANEL */
        <div className="max-w-3xl mx-auto animate-fade-in space-y-8">
          
          {/* INFORMATION & SETUP CHECKLIST */}
          <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
            
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#D32F2F]" />
                Paystack Gateway Connection Status
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Your application communicates directly with Paystack’s payment core. Configure these values inside your Paystack Merchant account to activate live or test flows.
              </p>
            </div>

            {/* STATUS CARDS */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 space-y-2">
                <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Secret Key (`PAYSTACK_SECRET_KEY`)</span>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                    {paystackStatus?.secretKeySet ? "Loaded ✓" : "Fallback Key"}
                  </span>
                  <span className={`h-2.5 w-2.5 rounded-full ${paystackStatus?.secretKeySet ? "bg-emerald-500 animate-pulse" : "bg-amber-400"}`} />
                </div>
                <p className="text-[9px] text-slate-400 font-mono">
                  Active verification key: <code className="text-slate-600 dark:text-slate-350">{paystackStatus?.secretKeyMasked}</code>
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 space-y-2">
                <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Public Key (`VITE_PAYSTACK_PUBLIC_KEY`)</span>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                    {paystackStatus?.publicKeySet ? "Loaded ✓" : "Fallback Key"}
                  </span>
                  <span className={`h-2.5 w-2.5 rounded-full ${paystackStatus?.publicKeySet ? "bg-emerald-500 animate-pulse" : "bg-amber-400"}`} />
                </div>
                <p className="text-[9px] text-slate-400 font-mono">
                  Active script key: <code className="text-slate-600 dark:text-slate-350">{paystackStatus?.publicKeyMasked}</code>
                </p>
              </div>
            </div>

            {/* INTEGRATION TARGETS */}
            <div className="space-y-4 pt-2">
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase font-mono tracking-wider text-slate-500">Required Paystack Webhook URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={paystackStatus?.detectedWebhookUrl || ""}
                    className="w-full text-xs font-mono p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                  <button
                    onClick={() => copyToClipboard(paystackStatus?.detectedWebhookUrl || "", "webhook")}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition flex items-center justify-center text-xs text-slate-600 dark:text-slate-300 font-bold cursor-pointer shrink-0"
                  >
                    {copiedField === "webhook" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[9.5px] text-slate-400 leading-normal">
                  Copy this exact address into the <strong>Webhook URL</strong> field under the API Keys & Webhooks tab in your Paystack dashboard. This secures offline subscription triggers.
                </p>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-[10px] font-extrabold uppercase font-mono tracking-wider text-slate-500">Required Callback / Redirect URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={paystackStatus?.detectedCallbackUrl || ""}
                    className="w-full text-xs font-mono p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                  <button
                    onClick={() => copyToClipboard(paystackStatus?.detectedCallbackUrl || "", "callback")}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition flex items-center justify-center text-xs text-slate-600 dark:text-slate-300 font-bold cursor-pointer shrink-0"
                  >
                    {copiedField === "callback" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[9.5px] text-slate-400 leading-normal">
                  Copy this exact address into the <strong>Callback URL</strong> field under checkout parameters. It automatically routes athletes back with a valid payment verification token on success.
                </p>
              </div>

            </div>

            {/* SYSTEM DETECTED ENDPOINTS HELPER */}
            <div className="p-4 rounded-xl bg-[#D32F2F]/5 border border-[#D32F2F]/10 space-y-2 text-xs">
              <h5 className="font-bold text-[#D32F2F] flex items-center gap-1.5 font-sans">
                <AlertTriangle className="w-4 h-4" /> Detected Container Context
              </h5>
              <div className="space-y-1 text-[10px] font-mono text-slate-500">
                <p>Detected Base App: <code className="bg-white dark:bg-slate-900 px-1 py-0.5 rounded border dark:border-slate-800 font-bold text-slate-800 dark:text-slate-200">{paystackStatus?.detectedBaseUrl}</code></p>
                <p>Detected Webhook Endpoint: <code className="bg-white dark:bg-slate-900 px-1 py-0.5 rounded border dark:border-slate-800 font-bold text-slate-800 dark:text-slate-200">{paystackStatus?.detectedWebhookUrl}</code></p>
                <p>Detected Callback Endpoint: <code className="bg-white dark:bg-slate-900 px-1 py-0.5 rounded border dark:border-slate-800 font-bold text-slate-800 dark:text-slate-200">{paystackStatus?.detectedCallbackUrl}</code></p>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Testimonials popup and scheduling management hub */}
      <TestimonialAdminManager />

    </div>
  );
}
