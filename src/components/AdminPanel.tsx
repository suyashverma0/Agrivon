import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { 
  ShieldAlert, Users, TrendingUp, BookOpen, Truck, 
  CloudSun, RefreshCw, PlusCircle, Trash2, ArrowUpRight, Check, Sparkles
} from "lucide-react";

export const AdminPanel: React.FC = () => {
  const { 
    currentUser, users, cropPrices, feedPosts, orders, applications: jobApplications, jobs,
    setWeatherWarning, updateOrderStatus, updateJobApplicationStatus, addProduct, setCropPrices
  } = useApp();

  const [activeTab, setActiveTab] = useState<"users" | "prices" | "posts" | "orders" | "weather">("users");
  const [warningInput, setWarningInput] = useState("Severe thunderous cloud formation predicted over western basin on Tuesday night.");

  // Simulation controls
  const handleTriggerPriceSpike = () => {
    const upgradedPrices = cropPrices.map(p => ({
      ...p,
      currentPrice: Math.round(p.currentPrice * 1.08), // 8% spike
      changePercent: Number((p.changePercent + 4.2).toFixed(1))
    }));
    // We update prices in the context so children react in real-time
    setCropPrices(upgradedPrices);
    alert("Simulated a global 8% MSP raw price spike across all trading indices!");
  };

  const handleUpdateWeatherBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    setWeatherWarning(warningInput);
    alert("Active Meteorology telemetry broadcast updated successfully!");
  };

  return (
    <div className="bg-white border border-slate-150 rounded-3xl shadow-3xs overflow-hidden">
      
      {/* Header Admin */}
      <div className="bg-slate-900 text-white p-6 flex justify-between items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 space-y-1.5 text-xs text-slate-400 font-semibold">
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
            ⚙️ Agrivon Sandbox Mode Active
          </div>
          <h2 className="text-xl font-black text-white leading-none pt-1">Central Controller Simulation Registry</h2>
          <p>Tweak weather alerts, spike MSP crop prices, and approve open hiring tickets across all registered characters.</p>
        </div>
      </div>

      {/* Admin tabs switcher */}
      <div className="bg-slate-50 border-b border-slate-150 p-2 overflow-x-auto flex gap-1">
        {[
          { id: "users", label: "Users Registry 👥", count: users.length },
          { id: "prices", label: "Mandi MSP Pricing 🪙", count: cropPrices.length },
          { id: "posts", label: "Community Feed 📣", count: feedPosts.length },
          { id: "orders", label: "Escrow Orders 🧾", count: orders.length },
          { id: "weather", label: "Weather Broadcast ⛈️", count: 1 },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex-shrink-0 ${
              activeTab === t.id
                ? "bg-slate-900 text-white shadow-3xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {/* Controller body wrapper */}
      <div className="p-6">
        
        {activeTab === "users" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <strong className="text-slate-800 text-xs">Registered System Entities</strong>
              <span className="text-[10px] text-slate-400 font-mono">Real-time simulation store</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {users.map((u) => {
                const nameText = u.role === "Farmer" ? u.farmerProfile?.name : u.role === "ShopOwner" ? u.shopOwnerProfile?.shopName : u.workerProfile?.name;
                const descText = u.role === "Farmer" ? `Farm: ${u.farmerProfile?.farmSize} Acres, Sows: ${u.farmerProfile?.cropsGrown}` : u.role === "ShopOwner" ? `Owner: ${u.shopOwnerProfile?.ownerName}, Products: ${u.shopOwnerProfile?.productsAvailable}` : `Skills: ${u.workerProfile?.skills}, expects ₹${u.workerProfile?.dailyWageExpectation}/day`;
                return (
                  <div key={u.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex justify-between items-start text-xs font-semibold">
                    <div>
                      <strong className="text-slate-900 block font-black leading-tight">{nameText}</strong>
                      <span className="text-[10px] text-indigo-700 font-mono tracking-wide mt-0.5 block">{u.role}</span>
                      <p className="text-[10px] text-slate-500 font-normal italic mt-1 leading-normal">"{descText}"</p>
                    </div>
                    <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-150 font-extrabold px-2 py-0.5 rounded">Active State</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CROP PRICES CONTROL */}
        {activeTab === "prices" && (
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-150 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="space-y-1 text-xs">
                <strong className="text-emerald-950 font-extrabold flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" /> Simulate Mandi Trading Spikes
                </strong>
                <p className="text-emerald-900 font-medium leading-normal">Instantly spike national MSP rate indicators across all crop markets by 8% to observe client bargaining behaviors.</p>
              </div>
              <button
                type="button"
                onClick={handleTriggerPriceSpike}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-[10px] uppercase tracking-wider py-2 px-4 rounded-xl cursor-pointer transition shadow-2xs"
              >
                Trigger 8% Price Spike ⚡
              </button>
            </div>

            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left text-xs font-medium">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 uppercase tracking-widest text-[9px] font-bold text-slate-500">
                    <th className="p-3">Crop Name</th>
                    <th className="p-3">Reference Mandi Market</th>
                    <th className="p-3">Current MSP Rate</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cropPrices.map((p) => (
                    <tr key={p.name} className="hover:bg-slate-50 text-slate-805 font-semibold">
                      <td className="p-3">{p.name}</td>
                      <td className="p-3 font-mono text-[10px] text-slate-500">{p.market}</td>
                      <td className="p-3 font-mono text-emerald-800">₹{p.currentPrice}/Qtl</td>
                      <td className="p-3 text-center">
                        <span className="text-[10px] text-emerald-705 bg-emerald-50 font-bold px-1.5 py-0.2 rounded-full border border-emerald-100 uppercase">Live</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* FEED CONTROL */}
        {activeTab === "posts" && (
          <div className="space-y-4">
            <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Modulate village community board posts</span>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {feedPosts.map((post) => (
                <div key={post.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex justify-between items-start gap-4 text-xs font-semibold">
                  <div className="space-y-1">
                    <strong className="text-slate-800">{post.authorName} ({post.authorRole})</strong>
                    <p className="text-slate-600 font-normal leading-relaxed italic">"{post.content}"</p>
                  </div>
                  <button className="text-rose-600 hover:text-rose-800 p-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg cursor-pointer transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ORDERS LIST */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Simulate entire platform escrow shipments</span>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-medium">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 uppercase tracking-widest text-[9px] font-bold text-slate-500">
                    <th className="p-3">Order SKU</th>
                    <th className="p-3">Product Item</th>
                    <th className="p-3">Owner/Shop</th>
                    <th className="p-3">Recipient/Client</th>
                    <th className="p-3">Gross due</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50 text-slate-808 font-semibold">
                      <td className="p-3 font-mono text-[10px] text-slate-400">{o.id}</td>
                      <td className="p-3">{o.productName} ({o.quantity} units)</td>
                      <td className="p-3">{o.shopName}</td>
                      <td className="p-3 text-mono">{o.farmerId}</td>
                      <td className="p-3 font-mono text-emerald-800">₹{o.totalPrice}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          o.status === "Delivered" ? "bg-emerald-100 text-emerald-800 border border-emerald-150" : o.status === "Shipped" ? "bg-sky-100 text-sky-800" : "bg-amber-100 text-amber-850"
                        }`}>
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* WEATHER TELEMETRY BROADCAST */}
        {activeTab === "weather" && (
          <div className="space-y-4">
            <form onSubmit={handleUpdateWeatherBroadcast} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <div className="space-y-1">
                <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider">Central Meteorology Warning Broadcast</label>
                <textarea
                  value={warningInput}
                  onChange={(e) => setWarningInput(e.target.value)}
                  rows={3}
                  className="w-full text-xs p-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800"
                  placeholder="e.g. Warning: Heavy rain precipitation expected Monday evening..."
                />
              </div>
              <button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-[10px] uppercase tracking-wider py-2.5 px-6 rounded-xl cursor-pointer shadow-1xs transition"
              >
                Deploy Warning Alert Broadcast ✨
              </button>
            </form>
          </div>
        )}

      </div>

    </div>
  );
};
