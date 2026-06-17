import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Briefcase,
  Layers,
  History,
  TrendingUp,
  MessageSquare,
  MapPin,
  CircleDollarSign,
  Sparkles,
  CheckCircle,
  FileText,
  Calendar,
  Send,
  UserCheck,
  Globe
} from "lucide-react";
import { Job, JobApplication } from "../types";

export const WorkerDashboard: React.FC = () => {
  const {
    currentUser,
    users,
    jobs,
    applications,
    messages,
    applyForJob,
    sendChatMessage,
    language
  } = useApp();

  const [activeTab, setActiveTab] = useState<"jobs" | "applications" | "history" | "earnings" | "chat">("jobs");

  // Chat negotiation state
  const [activeNegotiatingFarmerId, setActiveNegotiatingFarmerId] = useState("");
  const [negotiateText, setNegotiateText] = useState("");

  // Chats translation state
  const [preferredLanguage, setPreferredLanguage] = useState(() => localStorage.getItem("ag_pref_lang") || "English");
  const [translations, setTranslations] = useState<{
    [msgId: string]: {
      detectedLanguage: string;
      translatedText: string;
      confidence?: number;
      loading: boolean;
      success: boolean;
      error?: string;
    };
  }>({});

  const handleTranslateMessage = async (msgId: string, content: string, targetLang: string) => {
    if (translations[msgId]?.loading) return;

    setTranslations((prev) => ({
      ...prev,
      [msgId]: { detectedLanguage: "", translatedText: "", loading: true, success: false },
    }));

    try {
      const res = await fetch("/api/gemini/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: content,
          targetLanguage: targetLang,
          selectedLanguage: language,
          locale: language === "en" ? "en-US" : "hi-IN",
          userLanguagePreference: language
        }),
      });
      const data = await res.json();
      setTranslations((prev) => ({
        ...prev,
        [msgId]: {
          detectedLanguage: data.detectedLanguage || "Unknown",
          translatedText: data.translatedText || content,
          confidence: data.confidence,
          loading: false,
          success: true,
        },
      }));
    } catch (err) {
      console.error("Translation error:", err);
      setTranslations((prev) => ({
        ...prev,
        [msgId]: {
          detectedLanguage: "Error",
          translatedText: content,
          loading: false,
          success: false,
          error: "Translation failed",
        },
      }));
    }
  };

  const handleApply = (jobId: string) => {
    // Check if already applied
    const alreadyApplied = applications.some((app) => app.jobId === jobId && app.workerId === currentUser.id);
    if (alreadyApplied) {
      alert("You have already applied for this farm vacancy.");
      return;
    }
    applyForJob(jobId);
    alert("Application submitted! Farmer has been alerted.");
  };

  const handleSendNegotiationMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeNegotiatingFarmerId || !negotiateText.trim()) return;
    sendChatMessage(activeNegotiatingFarmerId, negotiateText);
    setNegotiateText("");
  };

  // Filter jobs worker can apply for
  const openJobs = jobs.filter((j) => j.status === "Open" || j.status === "Filled");
  const myApplications = applications.filter((app) => app.workerId === currentUser.id);
  
  // Work History (completed jobs or accepted jobs)
  const acceptedApps = myApplications.filter((app) => app.status === "Accepted");
  
  // Earnings tracking calculator
  const baseEarnings = acceptedApps.reduce((sum, app) => {
    const matchingJob = jobs.find((j) => j.id === app.jobId);
    if (matchingJob) {
      return sum + matchingJob.wage * matchingJob.durationDays;
    }
    return sum;
  }, 0);

  // Pre-seed some past work history earnings to make the tracker alive!
  const mockWorkHistory = [
    { id: "past-1", title: "Sugarcane Planting assistance", farmer: "Savitri Devi", days: 4, wage: 400, payout: 1600, date: "2026-05-10" },
    { id: "past-2", title: "Tube well channel digging", farmer: "Rajesh Kumar", days: 2, wage: 450, payout: 900, date: "2026-05-24" }
  ];

  const totalMockEarnings = mockWorkHistory.reduce((sum, item) => sum + item.payout, 0);
  const aggregateEarnings = baseEarnings + totalMockEarnings;

  // Active chats
  const chatPartners = users.filter((u) => u.role === "Farmer");
  const activeChatMessages = messages.filter(
    (m) =>
      (m.senderId === currentUser.id && m.receiverId === activeNegotiatingFarmerId) ||
      (m.senderId === activeNegotiatingFarmerId && m.receiverId === currentUser.id)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-900 to-emerald-950 text-white rounded-2xl p-6 mb-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="bg-emerald-500 text-white text-[10px] uppercase font-mono font-bold tracking-widest px-2.5 py-0.5 rounded-full select-none">
            Krishi Shramik Center
          </span>
          <h1 className="text-2xl font-bold mt-2">{currentUser.workerProfile?.name} 👨‍🌾</h1>
          <p className="text-emerald-100 text-xs mt-1">
            Village: {currentUser.workerProfile?.village} • Skillset: {currentUser.workerProfile?.skills}
          </p>
          <div className="flex gap-2 mt-4 flex-wrap text-xs">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              ⭐ {currentUser.workerProfile?.experience} Years Experience
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              💰 Expected Wage: ₹{currentUser.workerProfile?.dailyWageExpectation}/day
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/35 px-3 py-1 rounded-full text-xs font-semibold">
              ● Status: {currentUser.workerProfile?.availabilityStatus}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
          <div className="bg-white/10 p-4 rounded-xl text-center">
            <span className="block text-[10px] uppercase text-emerald-250 font-bold tracking-wider mb-1">Total Earnings</span>
            <span className="text-lg font-black text-amber-300 font-mono">₹{aggregateEarnings}</span>
          </div>
          <div className="bg-white/10 p-4 rounded-xl text-center">
            <span className="block text-[10px] uppercase text-emerald-250 font-bold tracking-wider mb-1">Jobs Assisted</span>
            <span className="text-lg font-black text-teal-350 font-mono">{acceptedApps.length + 2} fields</span>
          </div>
        </div>
      </div>

      {/* Main Grid Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Navigation lists */}
        <div className="lg:col-span-1 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm h-fit space-y-1">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-3 py-2">Labor Desk</h2>

          <button
            onClick={() => setActiveTab("jobs")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "jobs" ? "bg-emerald-800 text-white shadow-xs" : "text-gray-700 hover:bg-slate-50"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Briefcase className="h-4 w-4" /> Available Jobs Nearby
            </span>
            <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded-full font-bold">
              {openJobs.filter((j) => j.status === "Open").length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("applications")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "applications" ? "bg-emerald-800 text-white shadow-xs" : "text-gray-700 hover:bg-slate-50"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Layers className="h-4 w-4" /> Applications Hub
            </span>
            <span className="text-[10px] bg-blue-150 text-blue-700 px-1.5 py-0.2 rounded-full font-bold">{myApplications.length}</span>
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "history" ? "bg-emerald-800 text-white shadow-xs" : "text-gray-700 hover:bg-slate-50"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <History className="h-4 w-4" /> Past Work History
            </span>
          </button>

          <button
            onClick={() => setActiveTab("earnings")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "earnings" ? "bg-emerald-800 text-white shadow-xs" : "text-gray-700 hover:bg-slate-50"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <CircleDollarSign className="h-4 w-4" /> Earnings Tracker
            </span>
          </button>

          <button
            onClick={() => setActiveTab("chat")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "chat" ? "bg-emerald-800 text-white shadow-xs" : "text-gray-700 hover:bg-slate-50"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <MessageSquare className="h-4 w-4" /> Negotiate with Farmer
            </span>
            <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-1 py-0.2 rounded uppercase">Chat</span>
          </button>
        </div>

        {/* Dynamic Display Panel */}
        <div className="lg:col-span-3">
          
          {/* 1. AVAILABLE JOBS */}
          {activeTab === "jobs" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Immediate Field Openings</h3>
                <p className="text-xs text-gray-500">Apply for harvesting, planting, irrigation, or spraying listings posted by local landowners.</p>
              </div>

              {/* Jobs Directory Lists */}
              <div className="space-y-4">
                {openJobs.filter((j) => j.status === "Open").length === 0 ? (
                  <p className="text-xs text-gray-400">All neighborhood harvesting jobs have been filled. Check back later.</p>
                ) : (
                  openJobs
                    .filter((j) => j.status === "Open")
                    .map((job) => {
                      const applied = applications.some((app) => app.jobId === job.id && app.workerId === currentUser.id);
                      return (
                        <div key={job.id} className="border border-slate-100 rounded-xl p-4 flex flex-col md:flex-row justify-between gap-4 shadow-3xs hover:border-emerald-50 transition text-xs leading-relaxed">
                          <div className="space-y-1.5 max-w-xl">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="bg-emerald-50 text-emerald-805 text-[9px] font-bold uppercase px-2 py-0.5 rounded-full">
                                {job.category}
                              </span>
                              <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                                <MapPin className="h-3.5 w-3.5 text-gray-400" /> {job.village}, {job.state}
                              </span>
                            </div>

                            <strong className="block text-sm text-slate-900 leading-tight">{job.title}</strong>
                            <p className="text-slate-600 font-normal leading-normal">{job.description}</p>
                            
                            <span className="block text-[10px] text-slate-500">
                              Landowner: <strong>{job.farmerName}</strong> • Crop cycle starting: {job.startDate} ({job.durationDays} days cycle)
                            </span>
                          </div>

                          <div className="flex flex-col justify-between items-end gap-2 text-right">
                            <div>
                              <span className="text-[10px] text-gray-400 block">Proposed Wage:</span>
                              <strong className="text-sm font-extrabold text-slate-905">₹{job.wage} <span className="font-normal text-[10px] text-gray-400">/ Day</span></strong>
                            </div>

                            <div className="flex gap-1">
                              <button
                                onClick={() => {
                                  setActiveTab("chat");
                                  setActiveNegotiatingFarmerId(job.farmerId);
                                }}
                                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold transition"
                              >
                                Negotiate
                              </button>
                              <button
                                onClick={() => handleApply(job.id)}
                                disabled={applied}
                                className={`px-4 py-1.5 rounded font-bold text-white transition ${
                                  applied ? "bg-slate-350 cursor-default" : "bg-emerald-700 hover:bg-emerald-800 cursor-pointer"
                                }`}
                              >
                                {applied ? "Applied✓" : "Apply Instantly"}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            </div>
          )}

          {/* 2. APPLICATIONS HUB */}
          {activeTab === "applications" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Your Applications</h3>
                <p className="text-xs text-gray-500">Track accepted contracts and negotiate wage updates with farm owners.</p>
              </div>

              <div className="space-y-4">
                {myApplications.length === 0 ? (
                  <p className="text-xs text-gray-400">You haven&apos;t posted any digital applications yet. Browse openings first.</p>
                ) : (
                  myApplications.map((app) => (
                    <div key={app.id} className="border border-slate-100 rounded-xl p-4 flex justify-between items-center text-xs">
                      <div>
                        <strong className="block text-slate-900 leading-tight">{app.jobTitle}</strong>
                        <span className="text-[10px] text-gray-400 mt-1 block">Landowner: {app.farmerName} • Applied wage: ₹{app.workerWageExpectation}/day</span>
                      </div>
                      <div className="text-right">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          app.status === "Accepted" ? "bg-emerald-100 text-emerald-800" :
                          app.status === "Rejected" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-850"
                        }`}>
                          {app.status}
                        </span>
                        {app.status === "Accepted" && (
                          <span className="text-[9px] text-emerald-600 block mt-1">✓ Report to {app.farmerName}&apos;s farm</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* 3. PAST WORK HISTORY */}
          {activeTab === "history" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Assisted Harvest Cycles</h3>
                <p className="text-xs text-gray-500">List of completed contracts with full payouts credited to your account.</p>
              </div>

              <div className="space-y-3">
                {mockWorkHistory.map((past) => (
                  <div key={past.id} className="border border-slate-50 bg-slate-50/40 rounded-xl p-4 flex justify-between items-center text-xs leading-relaxed shadow-4xs">
                    <div>
                      <span className="text-[10px] text-gray-400 font-mono">{past.date}</span>
                      <strong className="block text-slate-905 mt-0.5">{past.title}</strong>
                      <span className="text-slate-500">Farmer: {past.farmer} • Assisted: {past.days} days</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-gray-400 block">Payout Received:</span>
                      <strong className="text-emerald-800 font-black text-sm block">₹{past.payout}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. EARNINGS TRACKER */}
          {activeTab === "earnings" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Daily Earnings Sheet</h3>
                <p className="text-xs text-gray-500">Financial tracker compiling overall earnings from both past records and newly completed contracts.</p>
              </div>

              {/* Bento statistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Contracted Payouts</span>
                  <span className="text-2xl font-black text-emerald-850 font-mono">₹{baseEarnings}</span>
                  <p className="text-[10px] text-gray-400 mt-1">From {acceptedApps.length} upcoming/active contracts</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Total Savings</span>
                  <span className="text-2xl font-black text-teal-850 font-mono">₹{aggregateEarnings}</span>
                  <p className="text-[10px] text-gray-400 mt-1">Cumulative verified digital savings</p>
                </div>
              </div>

              {/* Visual graph layout of monthly trends */}
              <div className="border border-slate-100 rounded-xl p-4 space-y-3">
                <span className="text-xs font-semibold text-slate-900 block uppercase tracking-wide">Historical Income Progression (3 Months)</span>
                <div className="flex gap-2 items-end justify-between h-24 bg-slate-50/50 p-3 rounded pt-6">
                  <div className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-emerald-600/70 rounded-t" style={{ height: "45%" }} title="₹1200" />
                    <span className="text-[9px] text-gray-400 mt-1">April</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-emerald-600/70 rounded-t" style={{ height: "70%" }} title="₹2500" />
                    <span className="text-[9px] text-gray-400 mt-1">May</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-emerald-600 rounded-t" style={{ height: "85%" }} title="₹3200" />
                    <span className="text-[9px] text-gray-400 mt-1">June (Current)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. NEGOTIATION CHAT */}
          {activeTab === "chat" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-3 min-h-[500px]">
              
              {/* Directory */}
              <div className="border-r border-gray-100 p-4 space-y-4 bg-slate-50/50 text-xs">
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Village Farmers</span>
                <div className="space-y-1.5">
                  {chatPartners.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => setActiveNegotiatingFarmerId(u.id)}
                      className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
                        activeNegotiatingFarmerId === u.id
                          ? "bg-emerald-800 text-white shadow-xs"
                          : "text-gray-700 bg-white border border-gray-100 hover:bg-emerald-50/50"
                      }`}
                    >
                      🌾 {u.farmerProfile?.name} ({u.farmerProfile?.village})
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat view */}
              <div className="col-span-2 flex flex-col justify-between p-4 h-full">
                {activeNegotiatingFarmerId ? (
                  <>
                    <div className="border-b border-gray-100 pb-3 mb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <h4 className="font-bold text-xs text-slate-805">
                        Direct Wage Negotiations: <strong>{users.find((u) => u.id === activeNegotiatingFarmerId)?.farmerProfile?.name}</strong>
                      </h4>
                      <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-2   py-1 rounded-xl">
                        <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1">
                          <Globe className="h-3 w-3 text-emerald-800" /> Preferred Language:
                        </span>
                        <select
                          value={preferredLanguage}
                          onChange={(e) => {
                            const val = e.target.value;
                            setPreferredLanguage(val);
                            localStorage.setItem("ag_pref_lang", val);
                          }}
                          className="text-[10px] pb-0.5 font-bold text-slate-800 bg-transparent border-none focus:outline-none cursor-pointer"
                        >
                          <option value="English">English 🇬🇧</option>
                          <option value="Hindi">Hindi 🇮🇳</option>
                          <option value="Spanish">Spanish 🇪🇸</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex-grow overflow-y-auto space-y-3 pr-1 max-h-96 min-h-[300px]">
                      {activeChatMessages.length === 0 ? (
                        <div className="text-gray-400 text-xs text-center py-12">No active conversation. Propose your daily wage demands.</div>
                      ) : (
                        activeChatMessages.map((msg) => {
                          const isSent = msg.senderId === currentUser.id;
                          const trans = translations[msg.id];
                          return (
                            <div key={msg.id} className={`flex flex-col ${isSent ? "items-end" : "items-start"}`}>
                              <span className="text-[10px] text-gray-400 mb-0.5">{msg.senderName}</span>
                              <div
                                className={`p-3 rounded-2xl text-xs max-w-sm ${
                                  isSent ? "bg-emerald-800 text-white rounded-br-none" : "bg-gray-100 text-gray-800 rounded-bl-none"
                                }`}
                              >
                                <div>{msg.content}</div>

                                {/* Translation Trigger and Output */}
                                {!isSent && (
                                  <div className="mt-2 pt-1.5 border-t border-gray-200/40">
                                    {trans ? (
                                      trans.loading ? (
                                        <div className="flex items-center gap-1 text-[9px] text-gray-500 animate-pulse">
                                          <Sparkles className="h-2.5 w-2.5 animate-spin" />
                                          Detecting & Translating...
                                        </div>
                                      ) : trans.success ? (
                                        <div className="bg-emerald-100/70 p-2 rounded-lg text-emerald-950 text-[11px] mt-1">
                                          <div className="flex items-center justify-between text-[9px] font-bold text-emerald-800 uppercase tracking-wider mb-1">
                                            <span>🛰️ Detected: {trans.detectedLanguage}</span>
                                            {trans.confidence !== undefined && (
                                              <span>{trans.confidence}% Match</span>
                                            )}
                                          </div>
                                          <div className="font-semibold whitespace-pre-line text-xs">{trans.translatedText}</div>
                                        </div>
                                      ) : (
                                        <div className="text-[9px] text-rose-600 flex items-center gap-1">
                                          ⚠️ Failed: {trans.error || "Please try again"}
                                          <button
                                            type="button"
                                            onClick={() => handleTranslateMessage(msg.id, msg.content, preferredLanguage)}
                                            className="underline font-bold text-emerald-950 ml-1 cursor-pointer"
                                          >
                                            Retry
                                          </button>
                                        </div>
                                      )
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => handleTranslateMessage(msg.id, msg.content, preferredLanguage)}
                                        className="text-[10px] font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
                                      >
                                        <Globe className="h-3 w-3" /> Offer Translation to {preferredLanguage}
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

                    <form onSubmit={handleSendNegotiationMessage} className="flex gap-2 pt-3 border-t border-gray-100 mt-3">
                      <input
                        type="text"
                        required
                        placeholder="Type bargaining proposal here..."
                        value={negotiateText}
                        onChange={(e) => setNegotiateText(e.target.value)}
                        className="flex-grow text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none"
                      />
                      <button type="submit" className="bg-emerald-700 hover:bg-emerald-800 text-white p-2 rounded-lg">
                        <Send className="h-4 w-4" />
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-24 text-gray-400 text-xs font-sans">
                    Pick a farmer lead from the directory to start direct labor pricing negotiations.
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
