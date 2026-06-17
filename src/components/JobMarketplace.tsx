import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Job, JobCategory, JobApplication } from "../types";
import { Briefcase, Plus, MapPin, DollarSign, Calendar, Sparkles, Star, Store, UserCheck } from "lucide-react";

export const JobMarketplace: React.FC = () => {
  const {
    currentUser,
    users,
    jobs,
    applications,
    createJob,
    applyForJob,
    updateApplicationStatus,
    products,
    triggerSystemDemoAction
  } = useApp();

  const [isPostingJob, setIsPostingJob] = useState(false);
  const [jTitle, setJTitle] = useState("");
  const [jCategory, setJCategory] = useState<JobCategory>("Harvesting");
  const [jDesc, setJDesc] = useState("");
  const [jWage, setJWage] = useState("");
  const [jDuration, setJDuration] = useState("");
  const [jStartDate, setJStartDate] = useState("");

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jTitle || !jWage || !jDuration || !jStartDate) return;

    createJob({
      title: jTitle,
      category: jCategory,
      description: jDesc,
      village: currentUser.farmerProfile?.village || "Kanakpur",
      state: currentUser.farmerProfile?.state || "Uttar Pradesh",
      wage: Number(jWage),
      durationDays: Number(jDuration),
      startDate: jStartDate
    });

    setIsPostingJob(false);
    setJTitle("");
    setJDesc("");
    setJWage("");
    setJDuration("");
    setJStartDate("");
    alert("New farming contract vacancy successfully broadcasted to the ecosystem!");
  };

  // Smart recommendation logic (Smart Matching)
  const getNearbyWorkers = () => {
    return users.filter((u) => u.role === "Worker" && u.workerProfile?.availabilityStatus === "Available");
  };

  const getNearbyFarmers = () => {
    return users.filter((u) => u.role === "Farmer");
  };

  const getNearbyShops = () => {
    return users.filter((u) => u.role === "ShopOwner");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            💼 Collaborative Farm Job Hub & Smart Matchmaker
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Farmers announce labor requirements, workers accept verified local contracts, and shops configure smart matching leads.
          </p>
        </div>

        {currentUser.role === "Farmer" && (
          <button
            onClick={() => setIsPostingJob(true)}
            className="flex items-center justify-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Post New Farm Job
          </button>
        )}
      </div>

      {/* Grid: Job listings + Smart Recommendation matching panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Column 1 & 2: Active jobs and post form */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Post active form */}
          {isPostingJob && (
            <form onSubmit={handlePostJob} className="bg-slate-50 border border-emerald-100 rounded-2xl p-6 space-y-4 text-xs animate-fade-in shadow-2xs">
              <span className="block font-bold text-sm text-slate-900">Post Agricultural Labor Listing</span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 font-semibold mb-1">Contract Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rice block A Harvesting"
                    value={jTitle}
                    onChange={(e) => setJTitle(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-gray-200 bg-white rounded-lg focus:outline focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 font-semibold mb-1">Labor Category</label>
                  <select
                    value={jCategory}
                    onChange={(e: any) => setJCategory(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-gray-200 bg-white rounded-lg focus:outline"
                  >
                    <option value="Harvesting">Harvesting 🌾</option>
                    <option value="Irrigation">Irrigation / Watering 💧</option>
                    <option value="Planting">Planting 👨‍🌾</option>
                    <option value="Pesticide Spraying">Pesticide Spraying 🧪</option>
                    <option value="Other">Other farm manual chore 🚜</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">Job description / notes</label>
                <textarea
                  required
                  placeholder="e.g. Sowing hybrid rice seeds on 3 acres. Tools will be provided."
                  value={jDesc}
                  onChange={(e) => setJDesc(e.target.value)}
                  className="w-full text-xs p-3 border border-gray-200 bg-white rounded-lg focus:outline"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-600 font-semibold mb-1">Daily Wage (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 450"
                    value={jWage}
                    onChange={(e) => setJWage(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-gray-200 bg-white rounded-lg focus:outline font-mono"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 font-semibold mb-1">Duration (No. of Days)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 3"
                    value={jDuration}
                    onChange={(e) => setJDuration(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-gray-200 bg-white rounded-lg focus:outline font-mono"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 font-semibold mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={jStartDate}
                    onChange={(e) => setJStartDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-gray-200 bg-white rounded-lg focus:outline"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 text-xs pt-2">
                <button
                  type="button"
                  onClick={() => setIsPostingJob(false)}
                  className="px-4 py-2 border border-gray-200 bg-white text-gray-700 rounded font-semibold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-bold cursor-pointer">
                  Publish Contract Vacancy
                </button>
              </div>
            </form>
          )}

          {/* Job listings directory */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4 shadow-sm">
            <h3 className="font-bold text-xs text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Active Labor Vacancies</h3>
            {jobs.length === 0 ? (
              <p className="text-gray-400 text-xs">No active farm vacancies listed. Check back tomorrow.</p>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => {
                  const alreadyApplied = applications.some((app) => app.jobId === job.id && app.workerId === currentUser.id);
                  return (
                    <div key={job.id} className="border border-slate-150 p-4 rounded-xl flex flex-col md:flex-row gap-4 justify-between items-start text-xs hover:border-emerald-100 transition shadow-4xs">
                      <div className="space-y-1.5 max-w-lg leading-relaxed">
                        <div className="flex items-center gap-2">
                          <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                            {job.category}
                          </span>
                          <span className="text-slate-400 text-[10px] flex items-center gap-0.5">
                            <MapPin className="h-3.5 w-3.5 text-gray-400" /> {job.village}, {job.state}
                          </span>
                        </div>

                        <strong className="block text-sm font-bold text-gray-905 mt-1 leading-tight">{job.title}</strong>
                        <p className="text-gray-600 font-normal leading-normal">{job.description}</p>
                        
                        <div className="text-[10px] text-gray-500 font-medium">
                          Farmer Account: <strong>{job.farmerName}</strong> • Start: {job.startDate} ({job.durationDays} Days Duration)
                        </div>
                      </div>

                      <div className="text-right flex flex-col gap-2 justify-between items-end self-stretch md:self-auto min-w-[100px]">
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-bold">wage offer:</span>
                          <strong className="text-sm font-black text-slate-900 block mt-0.5">₹{job.wage} <span className="font-normal text-[10px] text-slate-400">/ Day</span></strong>
                        </div>

                        {currentUser.role === "Worker" && job.status === "Open" && (
                          <button
                            onClick={() => {
                              if (alreadyApplied) return;
                              applyForJob(job.id);
                              alert("Job applied successfully! Farmer Rajesh will review.");
                            }}
                            disabled={alreadyApplied}
                            className={`w-full py-1.5 px-3 rounded text-[10px] uppercase tracking-widest font-bold text-white transition ${
                              alreadyApplied ? "bg-slate-300 cursor-default" : "bg-emerald-700 hover:bg-emerald-800 cursor-pointer shadow-3xs"
                            }`}
                          >
                            {alreadyApplied ? "Applied✓" : "Apply"}
                          </button>
                        )}

                        {currentUser.id === job.farmerId && (
                          <span className="text-[10px] text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded-full">Your Post</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Manage incoming applications directly for Farmers */}
          {currentUser.role === "Farmer" && (
            <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4 shadow-sm">
              <h3 className="font-bold text-xs text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Pending Worker Applications</h3>
              {applications.filter((app) => app.farmerId === currentUser.id && app.status === "Pending").length === 0 ? (
                <p className="text-gray-400 text-xs">No pending worker applications. Try triggering Sunil auto-application from switcher or wait.</p>
              ) : (
                <div className="space-y-3">
                  {applications
                    .filter((app) => app.farmerId === currentUser.id && app.status === "Pending")
                    .map((app) => (
                      <div key={app.id} className="border border-emerald-50 rounded-xl p-4 bg-emerald-50/10 text-xs flex justify-between items-center shadow-4xs leading-relaxed">
                        <div className="space-y-1.5 max-w-sm">
                          <strong className="text-gray-900 text-xs leading-normal">
                            Worker <strong>{app.workerName}</strong> wants to assist with &quot;{app.jobTitle}&quot;
                          </strong>
                          <div className="text-[10px] text-gray-500 leading-normal">
                            Skills: <u>{app.workerSkills}</u> • Expected: ₹{app.workerWageExpectation}/day
                          </div>
                        </div>

                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              updateApplicationStatus(app.id, "Rejected");
                            }}
                            className="bg-red-50 hover:bg-red-100 text-red-650 px-3 py-1 font-bold text-[10px] rounded"
                          >
                            Decline
                          </button>
                          <button
                            onClick={() => {
                              updateApplicationStatus(app.id, "Accepted");
                              alert(`Accepted ${app.workerName} for ${app.jobTitle}! Contract filled.`);
                            }}
                            className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-1 font-bold text-[10px] rounded cursor-pointer"
                          >
                            Accept & Appoint✓
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Column 3: Smart Matching / Recommendation Engine */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Recommendation Part 1: Nearby Workers to Farmers */}
          {currentUser.role === "Farmer" && (
            <div className="bg-white border-2 border-emerald-100 rounded-2xl p-5 space-y-4 shadow-sm">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest bg-emerald-100/70 p-1.5 rounded flex items-center gap-1.5 select-none font-sans">
                <Sparkles className="h-4 w-4 text-emerald-650 fill-emerald-650 animate-bounce" /> Nearby Workers Suggested
              </span>

              <div className="space-y-3">
                {getNearbyWorkers().map((worker) => (
                  <div key={worker.id} className="border border-slate-100 rounded-lg p-3 text-xs flex items-center justify-between">
                    <div>
                      <strong className="block text-slate-900">{worker.workerProfile?.name}</strong>
                      <span className="text-[10px] text-gray-400">Village: {worker.workerProfile?.village}</span>
                      <span className="block text-[10px] font-semibold text-emerald-750 mt-1">Skills: {worker.workerProfile?.skills}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold block text-slate-800">₹{worker.workerProfile?.dailyWageExpectation}/day</span>
                      <button
                        onClick={() => {
                          alert(`Bargaining request with ${worker.workerProfile?.name} initiated. Go to direct chat tab to simulate.`);
                        }}
                        className="text-[10px] bg-slate-150 hover:bg-emerald-50 text-emerald-900 px-2 py-0.5 rounded font-bold border mt-2 block"
                      >
                        Appoint
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendation Part 2: Nearby Farmers to Workers */}
          {currentUser.role === "Worker" && (
            <div className="bg-white border-2 border-teal-100 rounded-2xl p-5 space-y-4 shadow-sm">
              <span className="text-[10px] font-bold text-teal-800 uppercase tracking-widest bg-teal-100/70 p-1.5 rounded flex items-center gap-1.5 select-none font-mono">
                <Sparkles className="h-4 w-4 text-teal-650 fill-teal-650" /> Suggested Nearby Landowners
              </span>

              <div className="space-y-3 text-xs leading-relaxed">
                {getNearbyFarmers().map((farmer) => (
                  <div key={farmer.id} className="border border-slate-100 rounded-lg p-3 flex justify-between items-center">
                    <div>
                      <strong className="block text-slate-900">{farmer.farmerProfile?.name}</strong>
                      <span className="text-[10px] text-gray-400">Village: {farmer.farmerProfile?.village}</span>
                      <span className="block text-[10px] mt-0.5 text-gray-500">Crops: {farmer.farmerProfile?.cropsGrown}</span>
                    </div>
                    <button
                      onClick={() => {
                        alert(`Opening chat negotiations with ${farmer.farmerProfile?.name} in direct messaging...`);
                      }}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-705 p-1 rounded font-bold"
                    >
                      Bargain
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendation Part 3: Nearby Shops to Farmers */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4 shadow-sm text-xs leading-relaxed">
            <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-widest bg-indigo-50 p-1.5 rounded flex items-center gap-1.5 select-none font-mono">
              <Store className="h-4 w-4" /> Recommended Seed Dealers nearby
            </span>

            <div className="space-y-3">
              {getNearbyShops().map((shop) => (
                <div key={shop.id} className="border border-slate-100 rounded-lg p-3">
                  <strong className="block text-slate-900">{shop.shopOwnerProfile?.shopName}</strong>
                  <span className="text-[10px] text-gray-400">Address: {shop.shopOwnerProfile?.address}</span>
                  <div className="mt-1 flex items-center justify-between text-[11px]">
                    <span className="text-emerald-700">🚚 Delivery: Yes</span>
                    
                    <button
                      onClick={() => {
                        alert(`Heading over to Krishi Seva Kendra ordering section...`);
                      }}
                      className="text-[9px] bg-indigo-900 text-white px-2 py-0.5 rounded font-bold"
                    >
                      View Items
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
