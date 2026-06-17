import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { 
  Briefcase, CheckCircle2, TrendingUp, DollarSign, MapPin, 
  Search, ClipboardList, Clock, Sparkles, Filter, ShieldAlert, BadgeCheck
} from "lucide-react";

// --- PAGE 1: OVERVIEW/DASHBOARD ---
export const WorkerOverview: React.FC<{ onViewTab: (tab: any) => void }> = ({ onViewTab }) => {
  const { jobs, applications: jobApplications, currentUser } = useApp();

  const myApplications = jobApplications.filter((a) => a.workerId === currentUser.id);
  const activeContractsCount = myApplications.filter(a => a.status === "Accepted").length;
  const pendingCount = myApplications.filter(a => a.status === "Pending").length;

  const totalEarningsSimulated = myApplications
    .filter((a) => a.status === "Accepted")
    .reduce((sum, a) => {
      // Find associated job wage
      const associatedJob = jobs.find((j) => j.id === a.jobId);
      return sum + (associatedJob ? associatedJob.dailyWage : 400) * 5; // simulated 5 days work
    }, 0);

  return (
    <div className="space-y-6">
      
      {/* Worker Welcome Banner */}
      <div className="bg-gradient-to-r from-amber-705 via-amber-800 to-amber-950 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.04] pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-mono font-bold tracking-wider">
            Verified Laborer Active
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            Namaste, {currentUser.workerProfile?.name || "Farm Buddy"}!
          </h2>
          <p className="text-amber-100/90 text-xs sm:text-sm">
            Primary Skills: <strong className="text-white">{currentUser.workerProfile?.skills}</strong> • Residence: <span className="underline decoration-amber-400 decoration-2">{currentUser.workerProfile?.village || "Mohana Res"}</span>.
          </p>
          <div className="pt-2 flex flex-wrap gap-2">
            <button onClick={() => onViewTab("jobs")} className="bg-white text-amber-950 font-bold px-4 py-2 rounded-xl hover:bg-amber-50 text-xs transition cursor-pointer">
              Explore Nearby Jobs Board 🌾
            </button>
            <button onClick={() => onViewTab("applications")} className="bg-amber-700/60 hover:bg-amber-700/80 text-white font-bold px-4 py-2 rounded-xl text-xs border border-amber-500/20 transition cursor-pointer">
              Check My Applied Jobs
            </button>
          </div>
        </div>
      </div>

      {/* Stats Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-semibold">
        <div className="bg-white border border-slate-150 p-4 rounded-xl flex items-center gap-3">
          <div className="p-3 bg-amber-100 text-amber-800 rounded-xl text-xl select-none">👨‍🌾</div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Applied listings</span>
            <strong className="text-slate-805 text-base font-black block pt-1">{myApplications.length} applied</strong>
          </div>
        </div>

        <div className="bg-white border border-slate-150 p-4 rounded-xl flex items-center gap-3">
          <div className="p-3 bg-emerald-100 text-emerald-805 rounded-xl text-xl select-none">💼</div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Active Contracts</span>
            <strong className="text-slate-805 text-base font-black block pt-1">{activeContractsCount} Accepted</strong>
          </div>
        </div>

        <div className="bg-white border border-slate-150 p-4 rounded-xl flex items-center gap-3">
          <div className="p-3 bg-rose-100 text-rose-800 rounded-xl text-xl select-none">⏳</div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Pending Decisions</span>
            <strong className="text-slate-805 text-base font-black block pt-1">{pendingCount} Pending</strong>
          </div>
        </div>

        <div className="bg-white border border-slate-150 p-4 rounded-xl flex items-center gap-3">
          <div className="p-3 bg-indigo-105 text-indigo-700 rounded-xl text-xl select-none">₹</div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Simulated Earnings</span>
            <strong className="text-slate-805 text-base font-black block pt-1">₹{totalEarningsSimulated || "0"}</strong>
          </div>
        </div>
      </div>

      {/* Main SaaS panel column split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recommended jobs dashboard link (Col 2 span) */}
        <div className="lg:col-span-2 bg-white border border-slate-150 p-5 rounded-3xl shadow-3xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-850 text-sm flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-amber-700" /> Vetted Sowing Jobs Nearby
            </h3>
            <button onClick={() => onViewTab("jobs")} className="text-[10px] text-amber-700 font-extrabold hover:underline">
              View Board
            </button>
          </div>

          <div className="space-y-3">
            {jobs.slice(0, 3).map((job) => (
              <div key={job.id} className="p-4 bg-slate-50 border border-slate-205 rounded-xl flex justify-between items-center text-xs">
                <div>
                  <strong className="text-slate-805 font-bold block">{job.title} ({job.cropType})</strong>
                  <span className="text-[10px] text-slate-500 font-medium">Village: {job.location} • Tenure: {job.duration}</span>
                </div>
                <div className="text-right space-y-1.5">
                  <span className="font-mono text-xs font-black text-amber-800 block">₹{job.dailyWage}/Day</span>
                  <button onClick={() => onViewTab("jobs")} className="text-[10px] bg-amber-500 text-amber-950 font-bold px-2.5 py-1 rounded-lg">
                    Apply Fast
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Worker profile badge checklist */}
        <div className="bg-white border border-slate-150 p-5 rounded-3xl shadow-3xs space-y-4">
          <h3 className="font-extrabold text-slate-805 text-sm border-b border-slate-100 pb-3 flex items-center gap-1.5">
            <ClipboardList className="w-3.5 h-3.5 text-amber-600" /> Platform Verification Status
          </h3>
          <div className="space-y-4 text-xs font-semibold leading-relaxed text-slate-700">
            <div className="flex gap-2.5">
              <span className="text-emerald-600">✅</span>
              <div>
                <strong className="text-slate-900 block leading-none">KYC Mandi Sowing Cert Verified</strong>
                <span className="text-[10px] text-slate-400 font-medium">Active account matching registered residence</span>
              </div>
            </div>

            <div className="flex gap-2.5">
              <span className="text-emerald-600">✅</span>
              <div>
                <strong className="text-slate-900 block leading-none">Wage Escrow active</strong>
                <span className="text-[10px] text-slate-400 font-medium">Security daily disbursements active</span>
              </div>
            </div>

            <div className="flex gap-2.5">
              <span className="text-amber-500">⏳</span>
              <div>
                <strong className="text-slate-900 block leading-none">Biological safety index training</strong>
                <span className="text-[10px] text-slate-405 font-medium">Training modules pending completion</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};


// --- PAGE 2: JOBS BOARD ---
export const JobsBoardPage: React.FC = () => {
  const { jobs, applications: jobApplications, applyForJob, currentUser } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [minSalary, setMinSalary] = useState("");

  const filteredJobs = jobs.filter((j) => {
    const matchesSearch = j.title.toLowerCase().includes(searchTerm.toLowerCase()) || j.cropType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSalary = minSalary ? j.dailyWage >= Number(minSalary) : true;
    return matchesSearch && matchesSalary;
  });

  const myAppliedJobIds = jobApplications
    .filter((a) => a.workerId === currentUser.id)
    .map((a) => a.jobId);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-150 p-6 rounded-3xl shadow-3xs space-y-6">
        <div>
          <h2 className="text-lg font-black text-slate-850 flex items-center gap-1.5">
            💼 Local Sowing & Harvesting Job Marketplace
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Apply for vetted agricultural service contracts immediately. Farmers disburse escrow daily wages.
          </p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-slate-100">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              placeholder="Search Crop, Skill, or village..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-205 rounded-xl text-slate-800 font-semibold focus:outline-none"
            />
          </div>

          <div>
            <input
              type="number"
              placeholder="Minimum Daily Wage (₹/day)..."
              value={minSalary}
              onChange={(e) => setMinSalary(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-205 rounded-xl text-slate-805 font-semibold focus:outline-none"
            />
          </div>
        </div>

        {/* Job Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.length === 0 ? (
            <div className="col-span-3 text-center p-8 text-slate-400 italic">No matching agricultural opportunities listed.</div>
          ) : (
            filteredJobs.map((j) => {
              const alreadyApplied = myAppliedJobIds.includes(j.id);
              return (
                <div key={j.id} className="bg-slate-50 border border-slate-205 p-5 rounded-2xl flex flex-col justify-between hover:border-amber-450 transition-colors">
                  <div className="space-y-3 font-semibold text-xs text-slate-600 leading-normal">
                    <div className="flex justify-between items-start gap-3">
                      <span className="text-[10px] bg-slate-250 text-slate-700 font-extrabold uppercase px-2 py-0.5 rounded">
                        {j.cropType}
                      </span>
                      <strong className="font-mono text-sm font-black text-amber-800">₹{j.dailyWage}/Day</strong>
                    </div>

                    <h4 className="text-sm font-black text-slate-900 leading-tight">{j.title}</h4>
                    
                    <div className="space-y-1 text-slate-505">
                      <p>📍 Location: <strong className="text-slate-700">{j.location}</strong></p>
                      <p>⏳ Project Span: <strong className="text-slate-705">{j.duration}</strong></p>
                      <p>📋 Requirements: <strong className="text-slate-705">{j.description}</strong></p>
                    </div>
                  </div>

                  <div className="border-t border-slate-200/50 pt-4 mt-4">
                    {alreadyApplied ? (
                      <button disabled className="w-full bg-slate-200 text-slate-400 font-bold py-2 px-4 rounded-xl text-xs uppercase tracking-widest leading-none">
                        Already Applied
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          applyForJob(j.id);
                          alert("Job Application filed successfully! Verified index created in real-time tracker.");
                        }}
                        className="w-full bg-amber-500 hover:bg-amber-600 hover:text-amber-950 text-white font-extrabold py-2.5 px-4 rounded-xl text-xs uppercase tracking-widest cursor-pointer transition shadow-xs"
                      >
                        File Application
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};


// --- PAGE 3: APPLICATIONS STATUS ---
export const ApplicationsPage: React.FC = () => {
  const { applications: jobApplications, jobs, currentUser } = useApp();

  const myApps = jobApplications.filter((a) => a.workerId === currentUser.id);

  return (
    <div className="bg-white border border-slate-150 p-6 rounded-3xl shadow-3xs space-y-4">
      <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider mb-2">📋 My job application tracking list</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-medium">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 uppercase tracking-widest text-[9px] font-bold text-slate-500">
              <th className="p-3">Track ID</th>
              <th className="p-3">Role applied for</th>
              <th className="p-3">Village Market</th>
              <th className="p-3">Daily Wage Offer</th>
              <th className="p-3 text-center">Escrow Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {myApps.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400 italic">You haven't requested any farm assignments yet. Explore the Jobs tab to begin!</td>
              </tr>
            ) : (
              myApps.map((a) => {
                const job = jobs.find((j) => j.id === a.jobId);
                return (
                  <tr key={a.id} className="hover:bg-slate-50 text-slate-800 font-semibold">
                    <td className="p-3 font-mono text-[10px] text-slate-500">{a.id}</td>
                    <td className="p-3">{job?.title || "Harvest Hand"} ({job?.cropType})</td>
                    <td className="p-3">{job?.location || "Kanakpur"}</td>
                    <td className="p-3 font-mono">₹{job?.dailyWage || "420"}/Day</td>
                    <td className="p-3 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                        a.status === "Accepted" ? "bg-emerald-100 text-emerald-800 border border-emerald-150" : a.status === "Pending" ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800"
                      }`}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};


// --- PAGE 4: PROFILE ---
export const WorkerProfilePage: React.FC = () => {
  const { currentUser, updateWorkerProfile } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [name, setName] = useState(currentUser.workerProfile?.name || "");
  const [village, setVillage] = useState(currentUser.workerProfile?.village || "");
  const [district, setDistrict] = useState(currentUser.workerProfile?.district || "");
  const [state, setState] = useState(currentUser.workerProfile?.state || "");
  const [mobileNumber, setMobileNumber] = useState(currentUser.workerProfile?.mobileNumber || "");
  const [skills, setSkills] = useState(currentUser.workerProfile?.skills || "");
  const [experience, setExperience] = useState(currentUser.workerProfile?.experience || 0);
  const [dailyWageExpectation, setDailyWageExpectation] = useState(currentUser.workerProfile?.dailyWageExpectation || 350);
  const [availabilityStatus, setAvailabilityStatus] = useState<"Available" | "Busy">(currentUser.workerProfile?.availabilityStatus || "Available");
  const [profilePicture, setProfilePicture] = useState(currentUser.workerProfile?.profilePicture || "");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateWorkerProfile({
      name,
      village,
      district,
      state,
      mobileNumber,
      skills,
      experience: Number(experience),
      dailyWageExpectation: Number(dailyWageExpectation),
      availabilityStatus,
      profilePicture
    });
    setSuccessMsg("Worker credentials saved and synchronized successfully!");
    setIsEditing(false);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  return (
    <div className="space-y-6">
      {successMsg && (
        <div className="bg-emerald-600 text-white font-bold p-4 rounded-xl text-xs flex items-center gap-2 animate-bounce">
          <BadgeCheck className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Worker Card */}
      <div className="bg-white border border-slate-150 rounded-3xl p-6 shadow-3xs">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-black text-slate-900">👨‍🌾 Laborer Workspace Profile</h2>
            <p className="text-xs text-slate-500 mt-0.5">Manage and update your physical agrarian service profile.</p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-amber-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-amber-700 transition cursor-pointer"
          >
            {isEditing ? "View Profile Details" : "⚡ Customize Profile"}
          </button>
        </div>

        {!isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Read-Only Mode */}
            <div className="md:col-span-3 flex flex-col items-center space-y-3">
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt={name}
                  className="w-24 h-24 object-cover rounded-full border-4 border-amber-500 shadow-md bg-slate-50"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=150";
                  }}
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center text-4xl select-none text-white font-bold shadow-md">
                  👨‍🌾
                </div>
              )}
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                availabilityStatus === "Available"
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-rose-50 text-rose-800 border-rose-200"
              }`}>
                {availabilityStatus === "Available" ? "● Active & Available" : "● Busy on Job"}
              </span>
            </div>

            <div className="md:col-span-9 space-y-3.5 text-xs text-slate-600 leading-relaxed font-semibold">
              <h3 className="text-xl font-black text-slate-950 flex items-center gap-2">
                {name || "Unnamed Laborer"}
                <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 font-bold px-2 py-0.5 rounded-full uppercase">Verified Laborer</span>
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-slate-105 pt-3">
                <div>
                  <span className="text-[10px] uppercase text-slate-400 block tracking-wider leading-none">Home Settlement</span>
                  <strong className="text-slate-800 text-xs block mt-1">{village || "Not Specified"}</strong>
                </div>

                <div>
                  <span className="text-[10px] uppercase text-slate-400 block tracking-wider leading-none">Regional District / State</span>
                  <strong className="text-slate-800 text-xs block mt-1">{district ? `${district}, ${state || "India"}` : state || "Not Specified"}</strong>
                </div>

                <div>
                  <span className="text-[10px] uppercase text-slate-400 block tracking-wider leading-none">Mobile Contact</span>
                  <strong className="text-slate-800 text-xs block mt-1">{mobileNumber || "Not Specified"}</strong>
                </div>

                <div>
                  <span className="text-[10px] uppercase text-slate-400 block tracking-wider leading-none">Primary Agrisupplies Skills</span>
                  <strong className="text-slate-800 text-xs block mt-1">{skills || "Not Specified"}</strong>
                </div>

                <div>
                  <span className="text-[10px] uppercase text-slate-400 block tracking-wider leading-none">Experience Tenure</span>
                  <strong className="text-slate-800 text-xs block mt-1">{experience} Years Active</strong>
                </div>

                <div>
                  <span className="text-[10px] uppercase text-slate-400 block tracking-wider leading-none">Daily Minimum Expected</span>
                  <strong className="text-emerald-700 text-xs block mt-1">₹{dailyWageExpectation}/Day</strong>
                </div>

                <div>
                  <span className="text-[10px] uppercase text-slate-400 block tracking-wider leading-none">Escrow Status</span>
                  <strong className="text-emerald-700 text-xs block mt-1">Approved & Active</strong>
                </div>

                <div>
                  <span className="text-[10px] uppercase text-slate-400 block tracking-wider leading-none">Agrivon Status Badge</span>
                  <strong className="text-amber-800 text-xs block mt-1">Sovereign Harvester Medal</strong>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4 text-xs font-semibold">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-500 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-205 rounded-lg focus:outline bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Mobile Contact</label>
                <input
                  type="text"
                  required
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-205 rounded-lg focus:outline bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Village Residence</label>
                <input
                  type="text"
                  required
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-205 rounded-lg focus:outline bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">District</label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-205 rounded-lg focus:outline bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">State</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-205 rounded-lg focus:outline bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Specialized Skills / Capabilities</label>
                <input
                  type="text"
                  required
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-205 rounded-lg focus:outline bg-white font-medium"
                  placeholder="e.g. Sowing, Pesticide Spraying"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Work Experience (Years)</label>
                <input
                  type="number"
                  required
                  value={experience}
                  onChange={(e) => setExperience(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 border border-slate-205 rounded-lg focus:outline bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Daily Wage Expectation (₹)</label>
                <input
                  type="number"
                  required
                  value={dailyWageExpectation}
                  onChange={(e) => setDailyWageExpectation(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 border border-slate-205 rounded-lg focus:outline bg-white font-medium font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Availability Status</label>
                <select
                  value={availabilityStatus}
                  onChange={(e) => setAvailabilityStatus(e.target.value as any)}
                  className="w-full text-xs px-3 py-2 border border-slate-205 rounded-lg focus:outline bg-white font-medium"
                >
                  <option value="Available">Available for Work</option>
                  <option value="Busy">Currently Busy / Not Available</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Profile Photo URL</label>
                <input
                  type="text"
                  value={profilePicture}
                  onChange={(e) => setProfilePicture(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-205 rounded-lg focus:outline bg-white font-medium"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-emerald-600 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-emerald-700 transition cursor-pointer"
              >
                ✓ Save Labor Profile
              </button>
            </div>
          </form>
        )}
      </div>

    </div>
  );
};
