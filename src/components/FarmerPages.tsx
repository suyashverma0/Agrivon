import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { Product } from "../types";
import { ImageWithFallback } from "./ImageWithFallback";
import { 
  CloudSun, ShieldCheck, Activity, DollarSign, TrendingUp, MessageSquare, 
  BookOpen, ShoppingBag, Users, Sparkles, ChevronRight, Send, Plus, 
  Compass, CheckCircle, Truck, HelpCircle, Upload, Droplets, Wind, 
  PlusCircle, Info, Globe, Calendar, ArrowUpRight, ArrowDownRight, 
  Award, Search, Camera, Settings, MapPin, Inbox, AlertTriangle, Eye, ThumbsUp, CornerDownLeft, Filter, Sprout, Layers, Phone, User,
  Sun, Cloud, CloudRain, CloudLightning, Volume2, RefreshCw
} from "lucide-react";

// ==========================================
// CUSTOM RENDERING: INTERACTIVE SVG PRICE CHART
// ==========================================
interface PriceChartProps {
  history: number[];
  cropName: string;
}

export const CropPriceChart: React.FC<PriceChartProps> = ({ history, cropName }) => {
  const max = Math.max(...history) * 1.05;
  const min = Math.min(...history) * 0.95;
  const range = max - min;
  const width = 500;
  const height = 200;
  const padding = 35;

  // Map history to SVG coordinates
  const points = history.map((val, idx) => {
    const x = padding + (idx * (width - padding * 2)) / (history.length - 1);
    const y = height - padding - ((val - min) * (height - padding * 2)) / range;
    return { x, y, val };
  });

  // SVG Path generator
  let pathD = "";
  if (points.length > 0) {
    pathD = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(" ");
  }

  // Gradient area path
  let areaD = "";
  if (points.length > 0) {
    areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;
  }

  return (
    <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-[10px] text-emerald-800 font-extrabold uppercase tracking-widest block font-mono">Market Index Trends</span>
          <h4 className="text-base font-black text-slate-900">{cropName} Auction Prices (Past 6 Weeks)</h4>
        </div>
        <span className="text-[9px] text-emerald-850 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-500/10 font-bold uppercase tracking-wider">
          Live MSP Exchange
        </span>
      </div>

      {/* SVG Container */}
      <div className="relative w-full overflow-hidden" style={{ height: `${height}px` }}>
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2E7D32" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#2E7D32" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = padding + ratio * (height - padding * 2);
            const val = max - ratio * range;
            return (
              <g key={idx}>
                <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#f1f5f9" strokeDasharray="3 3" />
                <text x={padding - 8} y={y + 3} fill="#94a3b8" fontSize="8" fontWeight="bold" textAnchor="end" className="font-mono">
                  ₹{Math.round(val)}
                </text>
              </g>
            );
          })}

          {/* Gradient fill */}
          {areaD && <path d={areaD} fill="url(#chart-grad)" />}

          {/* Stroke Line */}
          {pathD && <path d={pathD} fill="none" stroke="#2E7D32" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}

          {/* Interactive nodes */}
          {points.map((p, idx) => (
            <g key={idx} className="group/node cursor-pointer">
              <circle cx={p.x} cy={p.y} r="4" fill="#ffffff" stroke="#2E7D32" strokeWidth="2.5" className="hover:scale-150 transition-transform duration-100" />
              <circle cx={p.x} cy={p.y} r="8" fill="#2E7D32" opacity="0.05" className="animate-pulse" />
              
              {/* Tooltip text always readable */}
              <text x={p.x} y={p.y - 12} fill="#1B1B1B" fontSize="9" fontWeight="bold" textAnchor="middle" className="pointer-events-none opacity-0 group-hover/node:opacity-100 transition-opacity duration-100 font-mono">
                ₹{p.val}
              </text>
              
              <text x={p.x} y={height - 8} fill="#94a3b8" fontSize="8" fontWeight="extrabold" textAnchor="middle">
                W{idx + 1}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};

// ==========================================
// FARMER PAGES EXPORTS
// ==========================================

// --- PAGE 1: DASHBOARD ---
export const FarmerOverview: React.FC<{ onViewTab: (tab: any) => void }> = ({ onViewTab }) => {
  const { weather, cropPrices, diaryEntries, orders, currentUser } = useApp();

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-emerald-800 via-emerald-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-emerald-700/20 lg:min-h-[220px] flex flex-col justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(76,175,80,0.15),transparent_60%)] pointer-events-none" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center w-full">
          
          {/* Left Column info */}
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> AGRI-AI INTELLIGENCE CO-PILOT
            </div>
            
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3.5xl font-black tracking-tight leading-tight">
                Good Morning, {currentUser.farmerProfile?.name || "Suyash"} 🌾
              </h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-emerald-200/90 font-medium">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Lucknow, Uttar Pradesh
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/40 hidden sm:inline" />
                <span className="flex items-center gap-1">
                  <CloudSun className="w-3.5 h-3.5 text-emerald-400" /> Weather: 32°C | Humidity 68%
                </span>
              </div>
            </div>

            {/* AI Recommendation panel */}
            <div className="bg-white/10 backdrop-blur-xs border border-white/10 rounded-2xl p-4 space-y-1 max-w-xl">
              <span className="text-[9px] uppercase tracking-widest text-emerald-400 font-extrabold block">AI Soil & Spray Recommendation</span>
              <p className="text-xs text-white font-medium leading-relaxed">
                "Rain expected tomorrow. Avoid pesticide spraying today."
              </p>
            </div>

            <div className="pt-1 flex flex-wrap gap-2.5">
              <button onClick={() => onViewTab("ai-disease")} className="bg-white text-emerald-950 hover:bg-emerald-50 font-extrabold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer shadow-sm hover:scale-[1.02] active:scale-100 flex items-center gap-1.5">
                Launch Diagnostic Scan <Camera className="w-4 h-4 text-emerald-700" />
              </button>
              <button onClick={() => onViewTab("weather")} className="bg-emerald-700/40 hover:bg-emerald-700/60 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition border border-emerald-500/35 cursor-pointer">
                Check Weather Warning
              </button>
            </div>
          </div>

          {/* Right Column visual illustration */}
          <div className="lg:col-span-4 hidden lg:flex justify-end pr-2">
            <svg width="220" height="150" viewBox="0 0 220 150" className="opacity-95" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="hill-grad-1" x1="110" y1="150" x2="110" y2="80" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#2E7D32" stopOpacity="0.8"/>
                  <stop offset="100%" stopColor="#4CAF50" stopOpacity="0.2"/>
                </linearGradient>
                <linearGradient id="sun-grad" x1="180" y1="30" x2="180" y2="70" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FFC107" stopOpacity="1"/>
                  <stop offset="100%" stopColor="#FF9800" stopOpacity="0.3"/>
                </linearGradient>
              </defs>
              {/* Sun */}
              <circle cx="170" cy="50" r="28" fill="url(#sun-grad)" />
              {/* Rays */}
              <line x1="170" y1="12" x2="170" y2="4" stroke="#FFC107" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
              <line x1="132" y1="50" x2="124" y2="50" stroke="#FFC107" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
              <line x1="208" y1="50" x2="216" y2="50" stroke="#FFC107" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
              <line x1="143" y1="23" x2="137" y2="17" stroke="#FFC107" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
              <line x1="197" y1="23" x2="203" y2="17" stroke="#FFC107" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />

              {/* Rolling Hills contours representing agricultural green landscape */}
              <path d="M-10 160 C 50 110, 150 135, 230 110 L 230 160 L -10 160 Z" fill="url(#hill-grad-1)" />
              <path d="M30 160 C 100 130, 160 125, 240 142 L 240 160 L 30 160 Z" fill="#2E7D32" opacity="0.6" />
              
              {/* Geometric plants / leaves sprouting */}
              <g stroke="#81C784" strokeWidth="3" strokeLinecap="round" opacity="0.9">
                {/* Plant 1 */}
                <path d="M60 145 V 110" />
                <path d="M60 125 Q 75 115 80 120" />
                <path d="M60 133 Q 45 125 40 130" />
                {/* Plant 2 */}
                <path d="M120 135 V 95" />
                <path d="M120 112 Q 138 100 143 107" />
                <path d="M120 122 Q 102 110 97 116" />
                {/* Plant 3 */}
                <path d="M185 140 V 118" />
                <path d="M185 128 Q 198 120 202 125" />
              </g>

              {/* Dynamic Tech Grid accent */}
              <path d="M20 30 H 80 M20 45 H 65 M20 60 H 50" stroke="rgba(255,255,255,0.08)" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-150 p-4 rounded-2xl shadow-3xs flex items-center gap-3">
          <div className="p-3 bg-emerald-100 text-emerald-700 rounded-2xl select-none text-xl">🌾</div>
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Crops Planted</p>
            <p className="text-sm font-black text-slate-800 mt-0.5">{currentUser.farmerProfile?.cropsGrown || "Paddy, Wheat"}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-150 p-4 rounded-2xl shadow-3xs flex items-center gap-3">
          <div className="p-3 bg-amber-100 text-amber-700 rounded-2xl select-none text-xl">☀️</div>
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Current Temperature</p>
            <p className="text-sm font-black text-slate-800 mt-0.5">{weather.temp}°C • {weather.condition}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-150 p-4 rounded-2xl shadow-3xs flex items-center gap-3">
          <div className="p-3 bg-blue-100 text-blue-700 rounded-2xl select-none text-xl">📦</div>
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Orders Shipped</p>
            <p className="text-sm font-black text-slate-800 mt-0.5">{orders.filter(o => o.farmerId === currentUser.id).length} Active</p>
          </div>
        </div>

        <div className="bg-white border border-slate-150 p-4 rounded-2xl shadow-3xs flex items-center gap-3">
          <div className="p-3 bg-violet-100 text-violet-700 rounded-2xl select-none text-xl">📝</div>
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Crop Logs logged</p>
            <p className="text-sm font-black text-slate-800 mt-0.5">{diaryEntries.filter(d => d.farmerId === currentUser.id).length} Entries</p>
          </div>
        </div>
      </div>

      {/* Main two-column block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Quick Actions & Alerts */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Quick AI Diagnostics promo */}
          <div className="bg-white border border-gradient p-5 rounded-2xl shadow-2xs space-y-4">
            <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5 border-b border-slate-100 pb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> AI Diagnostic Neural Net (Real-Time pathologist)
            </h3>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-100/50 flex-shrink-0 w-24">
                <span className="text-3xl select-none">🔬</span>
              </div>
              <div className="space-y-1.5">
                <p className="text-xs font-bold text-slate-800">Identify infections & pest threats instantly</p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Agrivon incorporates high-resolution visual model parameters capable of diagnosing over 42 leaf pathology anomalies in crops like Rice, Wheat, Mustard, and sugarcane.
                </p>
              </div>
            </div>
            <button onClick={() => onViewTab("ai-disease")} className="w-full bg-emerald-50 hover:bg-emerald-100/80 text-emerald-900 border border-emerald-200 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer">
              Go to Disease Pathologist Studio <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Price index quick summary */}
          <div className="bg-white border border-slate-150 p-5 rounded-2xl shadow-3xs space-y-3">
            <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5 border-b border-slate-100 pb-3">
              <TrendingUp className="w-4 h-4 text-indigo-600" /> Mandi MSP Market Indicator Rate
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {cropPrices.slice(0, 4).map((p) => (
                <div key={p.name} className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 flex justify-between items-center">
                  <div>
                    <span className="text-[11px] font-bold text-slate-800 block">{p.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono italic">{p.market}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-slate-800 block">₹{p.currentPrice}/Qtl</span>
                    <span className={`text-[9px] font-bold ${p.changePercent >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                      {p.changePercent >= 0 ? "▲" : "▼"} {Math.abs(p.changePercent)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => onViewTab("prices")} className="w-full bg-slate-50 hover:bg-slate-150/70 text-slate-700 py-2.5 rounded-xl text-xs font-bold border border-slate-200 transition cursor-pointer">
              Launch Detailed Price Trends & Charts
            </button>
          </div>

        </div>

        {/* Right column: Recent Diary Entries & Meteorological forecast snippet */}
        <div className="space-y-6">
          
          {/* Weather Alert */}
          <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl shadow-3xs space-y-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-amber-100 text-amber-800 rounded-lg select-none text-sm">📡</span>
              <strong className="text-xs text-amber-950 font-bold uppercase tracking-wider">Meteorology Broadcast</strong>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed font-medium">
              "{weather.warning}"
            </p>
          </div>

          {/* Quick Diary Checklist */}
          <div className="bg-white border border-slate-150 p-5 rounded-2xl shadow-3xs space-y-4">
            <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5 border-b border-slate-100 pb-3">
              <BookOpen className="w-4 h-4 text-emerald-600" /> Recent Crop Diary Logs
            </h3>
            <div className="space-y-3 max-h-56 overflow-y-auto">
              {diaryEntries.filter(d => d.farmerId === currentUser.id).length === 0 ? (
                <div className="text-center p-4 text-slate-400 text-xs italic">
                  No diary entries found. Use the menu to log daily sowing activities!
                </div>
              ) : (
                diaryEntries.filter(d => d.farmerId === currentUser.id).map((e) => (
                  <div key={e.id} className="p-3 bg-slate-50 border-l-4 border-emerald-600 rounded-r-xl space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                        {e.activityType}
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono">{e.date}</span>
                    </div>
                    <strong className="text-xs font-bold text-slate-800 block">{e.cropName}</strong>
                    <p className="text-[10px] text-slate-500 italic">"{e.notes}"</p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export const WeatherPage: React.FC = () => {
  const { weather, requestUserLocation, setManualLocation, language } = useApp();
  const [selectedLanguageTab, setSelectedLanguageTab] = useState<"en" | "hi" | "hinglish">("en");
  
  // Update state whenever context language shifts
  useEffect(() => {
    if (language === "hi") setSelectedLanguageTab("hi");
    else if (language === "hinglish") setSelectedLanguageTab("hinglish");
    else setSelectedLanguageTab("en");
  }, [language]);

  const fallbackCitiesList = ["Lucknow", "Nagpur", "Bhatinda", "Patna", "Indore", "Kanakpur", "Pune"];

  const getWeatherIcon = (cond: string) => {
    switch (cond) {
      case "Rainy":
        return <CloudRain className="w-8 h-8 text-blue-500 animate-bounce" />;
      case "Cloudy":
        return <Cloud className="w-8 h-8 text-slate-400 animate-pulse" />;
      case "Stormy":
        return <CloudLightning className="w-8 h-8 text-indigo-700 animate-pulse" />;
      case "Windy":
        return <Wind className="w-8 h-8 text-teal-500 animate-pulse" />;
      default:
        return <Sun className="w-8 h-8 text-amber-500 animate-spin" style={{ animationDuration: '8s' }} />;
    }
  };

  const getForecastIcon = (cond: string) => {
    switch (cond) {
      case "Rainy":
        return "🌧️";
      case "Cloudy":
        return "☁️";
      case "Stormy":
        return "⛈️";
      case "Windy":
        return "💨";
      default:
        return "☀️";
    }
  };

  // Safe checks with defaults in case of empty states
  const village = weather.village || "Lucknow";
  const temp = weather.temp !== undefined ? weather.temp : 34;
  const humidity = weather.humidity !== undefined ? weather.humidity : 58;
  const windSpeed = weather.windSpeed !== undefined ? weather.windSpeed : 12;
  const condition = weather.condition || "Sunny";
  const rainProbability = weather.rainProbability !== undefined ? weather.rainProbability : 18;
  const sunrise = weather.sunrise || "05:14 AM";
  const sunset = weather.sunset || "07:02 PM";
  const errorMsg = weather.errorMsg;
  const isFetching = weather.isFetching;
  const locationDenied = weather.locationDenied;

  const defaultForecast = [
    { day: "Sat", temp: 34, cond: "Sunny" as const, rain: "18%", label: "Optimal sowing" },
    { day: "Sun", temp: 35, cond: "Sunny" as const, rain: "10%", label: "Optimal sowing" },
    { day: "Mon", temp: 31, cond: "Cloudy" as const, rain: "25%", label: "Slight weeding" },
    { day: "Tue", temp: 28, cond: "Rainy" as const, rain: "85%", label: "Clear drainage!" },
    { day: "Wed", temp: 27, cond: "Stormy" as const, rain: "90%", label: "Drain water logged" },
    { day: "Thu", temp: 30, cond: "Cloudy" as const, rain: "40%", label: "Aerated space" },
    { day: "Fri", temp: 33, cond: "Sunny" as const, rain: "15%", label: "Fertilizer spray" },
  ];
  const forecast = weather.forecast || defaultForecast;

  // Render summaries according to selection
  const englishSummaryText = weather.englishSummary || `Current temperature in ${village} is ${temp}°C with a ${rainProbability}% chance of rain.`;
  const hindiSummaryText = weather.hindiSummary || `${village} mein aaj ${temp}°C hai. Baarish ki sambhavana ${rainProbability}% hai.`;
  const hinglishSummaryText = weather.hinglishSummary || `${village} mein aaj ${temp}°C temperature hai. Rain chance ${rainProbability}% hai.`;

  return (
    <div className="space-y-6">
      
      {/* GEOLOCATION AND MANUAL BAR */}
      <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-slate-800 font-extrabold text-sm uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-600 animate-spin" style={{ animationDuration: '12s' }} /> Real-Time Weather Positioning
          </h2>
          <p className="text-xs text-slate-500 font-semibold leading-relaxed">
            Detect location dynamically using your cellular/ISP GPS, or select an agro-hub manually.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2.5">
          <button 
            type="button"
            onClick={() => requestUserLocation()}
            disabled={isFetching}
            className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs rounded-xl transition shadow-xs ${isFetching ? "opacity-60 cursor-not-allowed" : ""}`}
            id="btn-detect-location"
          >
            <MapPin className="w-3.5 h-3.5" /> 
            {isFetching ? "Detecting Position..." : "Fetch GPS Coordinates"}
          </button>
          
          <button
            type="button"
            onClick={() => setManualLocation(village)}
            disabled={isFetching}
            className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition border border-slate-200"
            id="btn-refresh-weather"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>
      </div>

      {/* ERROR / PERMISSION DENIED BANNERS */}
      {locationDenied && (
        <div className="p-4 bg-amber-50 border border-amber-200/60 rounded-2xl text-xs text-amber-900 leading-relaxed flex gap-2 w-full" id="geo-permission-warning">
          <AlertTriangle className="w-4.5 h-4.5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="font-extrabold block">Location Access Restricted (Permission Withheld / First Use)</strong>
            <p className="mt-0.5 text-amber-800 font-medium">
              We were unable to directly retrieve your coordinates. Please grant location permissions in your browser, or pick any of our pre-coded active agriculture regions below to customize weather parameters manually.
            </p>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 leading-relaxed flex gap-2 w-full animate-pulse" id="weather-network-info">
          <Info className="w-4.5 h-4.5 text-slate-500 flex-shrink-0 mt-0.5" />
          <p className="font-semibold text-slate-600">
            {errorMsg}
          </p>
        </div>
      )}

      {/* MANUAL LOCATION QUICK PICK SELECTION */}
      <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-xs space-y-3">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Select Agricultural Hub Manually</span>
        <div className="flex flex-wrap gap-2">
          {fallbackCitiesList.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => setManualLocation(city)}
              disabled={isFetching}
              className={`cursor-pointer px-3.5 py-1.5 text-xs rounded-xl font-bold transition border ${
                village === city 
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs" 
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200"
              }`}
            >
              🏢 {city}
            </button>
          ))}
        </div>
      </div>

      {/* LOADING SPINNER STATE */}
      {isFetching ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-sm" id="weather-loading-skeleton">
          <RefreshCw className="w-10 h-10 text-emerald-700 animate-spin" />
          <h3 className="font-extrabold text-sm text-slate-700 uppercase tracking-widest">Retrieving Satellite Meteorology Telemetry...</h3>
          <p className="text-xs text-slate-400 max-w-xs leading-normal">
            Querying coordinates and syncing sensor feeds for humidity and crop indexes. Please wait...
          </p>
        </div>
      ) : (
        <>
          {/* WEATHER MAIN INFO METEOROLOGY BLOCK */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden" id="weather-meteorology-panel">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Block: Current Weather & Location info */}
              <div className="lg:col-span-6 space-y-5">
                <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-500/10 px-3 py-1 rounded-full text-xs font-semibold">
                  <MapPin className="w-3.5 h-3.5" /> {village}, India
                </div>
                
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Current Atmospheric Conditions</span>
                  <div className="flex items-center gap-4">
                    <span className="text-6xl sm:text-7xl font-extrabold tracking-tight text-slate-900">{temp}°C</span>
                    <div className="text-left space-y-0.5">
                      <div className="text-lg font-bold text-slate-800 flex items-center gap-1.5">
                        {getWeatherIcon(condition)} <span>{condition}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-semibold block">Synced via live satellite meteorology feeds</span>
                    </div>
                  </div>
                </div>

                {/* Quick stats grid */}
                <div className="grid grid-cols-4 gap-4 pt-3 border-t border-slate-100">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Humidity</span>
                    <span className="text-sm font-extrabold text-slate-800 flex items-center gap-0.5">
                      <Droplets className="w-4 h-4 text-emerald-600 inline" /> {humidity}%
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Wind Speed</span>
                    <span className="text-sm font-extrabold text-slate-800 flex items-center gap-0.5">
                      <Wind className="w-4 h-4 text-emerald-600 inline" /> {windSpeed} km/h
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Rain Prob</span>
                    <span className="text-sm font-extrabold text-blue-700 block">
                      ☔ {rainProbability}%
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Sun Cycles</span>
                    <span className="text-[10px] font-bold text-slate-700 block leading-tight">
                      🌅 {sunrise}<br/>🌇 {sunset}
                    </span>
                  </div>
                </div>

                {weather.warning && (
                  <div className="p-4 bg-amber-50/70 border border-amber-200/50 rounded-2xl text-xs text-amber-900 leading-relaxed flex gap-2 w-full">
                    <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold">Active Weather Warning:</strong>
                      <p className="mt-0.5 text-amber-800">{weather.warning}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Block: Dynamic Temperature Curve graph component representing high tech analytics */}
              <div className="lg:col-span-6 bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Precision Chart</span>
                    <h4 className="text-xs font-bold text-slate-800">Humidity & Sowing Viability Trend</h4>
                  </div>
                  <span className="text-[9px] bg-white border border-slate-200 text-slate-500 px-2 py-0.5 rounded-full font-mono">
                    7-Day Curve
                  </span>
                </div>

                {/* Custom SVG line graph representing weather fluctuations */}
                <div className="w-full h-32 relative overflow-hidden">
                  <svg viewBox="0 0 400 120" className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="weather-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2E7D32" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#2E7D32" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Grid guidelines */}
                    <line x1="10" y1="20" x2="390" y2="20" stroke="#e2e8f0" strokeDasharray="3 3" />
                    <line x1="10" y1="60" x2="390" y2="60" stroke="#e2e8f0" strokeDasharray="3 3" />
                    <line x1="10" y1="100" x2="390" y2="100" stroke="#e2e8f0" strokeDasharray="3 3" />

                    {/* Sowing curve path fill */}
                    <path d="M 10 70 Q 70 30, 130 50 T 250 85 T 390 40 L 390 110 L 10 110 Z" fill="url(#weather-grad)" />
                    {/* Sowing curve path stroke */}
                    <path d="M 10 70 Q 70 30, 130 50 T 250 85 T 390 40" fill="none" stroke="#2E7D32" strokeWidth="2.5" strokeLinecap="round" />

                    {/* Nodes with custom stats */}
                    <circle cx="70" cy="35" r="4.5" fill="#2E7D32" stroke="#fff" strokeWidth="1.5" />
                    <text x="70" y="22" fill="#1e293b" fontSize="8" fontWeight="bold" textAnchor="middle">{condition === "Rainy" || condition === "Stormy" ? "Poor Spraying" : "85% Optimal"}</text>

                    <circle cx="250" cy="85" r="4.5" fill="#4CAF50" stroke="#fff" strokeWidth="1.5" />
                    <text x="250" y="75" fill="#ef4444" fontSize="8" fontWeight="bold" textAnchor="middle">{humidity > 70 ? "Excess Humidity" : "Normal Moisty"}</text>

                    {/* Labels */}
                    <text x="10" y="112" fill="#94a3b8" fontSize="8">Mon</text>
                    <text x="130" y="112" fill="#94a3b8" fontSize="8">Wed</text>
                    <text x="250" y="112" fill="#94a3b8" fontSize="8">Fri</text>
                    <text x="390" y="112" fill="#94a3b8" fontSize="8" textAnchor="end">Sun</text>
                  </svg>
                </div>
                
                <p className="text-[10px] text-slate-500 leading-normal font-semibold">
                  *Ambient temperature measures <strong>{temp}°C</strong>. {temp > 35 ? "Evaporation levels are elevated—irrigate regularly." : "Thermal parameters are well suited for local cropping patterns."}
                </p>
              </div>

            </div>
          </div>

          {/* REGIONAL DIALECT BROADCAST WEATHER UPDATES CARD */}
          <div className="bg-white border border-slate-150 rounded-3xl p-5 shadow-3xs space-y-4" id="weather-dialect-card">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-100 pb-3">
              <div className="space-y-0.5">
                <span className="text-[9px] uppercase font-bold text-emerald-700 tracking-wider block">📡 Radio Broadcast Readings</span>
                <h3 className="text-slate-800 font-extrabold text-sm uppercase tracking-wider">Multi-Dialect Weather Summaries</h3>
              </div>
              
              <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedLanguageTab("en")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${selectedLanguageTab === "en" ? "bg-white text-slate-900 shadow-3xs border border-slate-200" : "text-slate-500 hover:text-slate-800"}`}
                >
                  English 🇬🇧
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedLanguageTab("hi")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${selectedLanguageTab === "hi" ? "bg-white text-slate-900 shadow-3xs border border-slate-200" : "text-slate-500 hover:text-slate-800"}`}
                >
                  Hindi 🇮🇳
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedLanguageTab("hinglish")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${selectedLanguageTab === "hinglish" ? "bg-white text-slate-900 shadow-3xs border border-slate-200" : "text-slate-500 hover:text-slate-800"}`}
                >
                  Hinglish 🗣️
                </button>
              </div>
            </div>

            <div className="p-5 bg-emerald-50/40 rounded-2xl border border-emerald-100 flex items-start gap-3.5">
              <Globe className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-1 animate-pulse" />
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-bold">Speech Transcription Output</span>
                <p className="text-sm sm:text-base font-extrabold text-slate-850 italic leading-relaxed">
                  "{selectedLanguageTab === "en" ? englishSummaryText : selectedLanguageTab === "hi" ? hindiSummaryText : hinglishSummaryText}"
                </p>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  Dialect audio text broadcast synchronized based on {village} regional parameters
                </p>
              </div>
            </div>
          </div>

          {/* 7-DAY FORECAST SECTION */}
          <div className="bg-white border border-slate-150 p-6 rounded-3xl space-y-4 shadow-3xs" id="weather-7day-forecast">
            <h3 className="text-slate-800 font-extrabold text-sm uppercase tracking-wider border-b border-slate-100 pb-3">
              7-Day Dynamic Weather Forecast
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {forecast.map((f, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-250 p-3.5 rounded-xl text-center space-y-2 hover:bg-slate-100/60 transition">
                  <p className="text-xs font-black text-slate-600 block">{f.day}</p>
                  <p className="text-xl font-extrabold text-slate-800">{f.temp}°C</p>
                  <span className="text-[11px] font-bold text-slate-500 block uppercase">
                    {getForecastIcon(f.cond)} {f.cond}
                  </span>
                  <p className="text-[10px] text-indigo-600 font-semibold leading-none">💧 {f.rain} Rain</p>
                  <div className="border-t border-slate-200/50 pt-2">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-extrabold block leading-none">{f.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SPECIFIC FARMER ADVISORIES AND MULTI CHANNELS */}
          <div className="bg-emerald-50/55 border border-emerald-150 p-6 rounded-3xl space-y-4" id="weather-farmer-advisory">
            <h3 className="font-extrabold text-emerald-950 text-xs uppercase tracking-wider flex items-center gap-2">
              🌾 Dynamic Farmer-centric Meteorological Advisories
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-emerald-900 leading-relaxed">
              {/* Rain Alerts */}
              <div className="space-y-1.5 bg-white p-4 rounded-xl border border-emerald-100 flex flex-col justify-between">
                <div>
                  <span className="font-extrabold block text-emerald-950 uppercase tracking-wide text-[10px]">1. Rain Alerts</span>
                  <p className="text-emerald-800 mt-2 font-medium leading-relaxed">
                    {weather.rainAlert || `Current parameters point to a ${rainProbability}% probability of localized showers. Maintain crop-covers on stored grain bags.`}
                  </p>
                </div>
                <div className="mt-3 text-[10px] text-emerald-600 font-bold border-t border-emerald-50 pt-2 uppercase">
                  Alert Status: Active Tracker
                </div>
              </div>

              {/* Crop Advisory */}
              <div className="space-y-1.5 bg-white p-4 rounded-xl border border-emerald-100 flex flex-col justify-between">
                <div>
                  <span className="font-extrabold block text-emerald-950 uppercase tracking-wide text-[10px]">2. Agronomic Crop Advisory</span>
                  <p className="text-emerald-800 mt-2 font-medium leading-relaxed">
                    {weather.cropAdvisory || `Atmospheric conditions at ${temp}°C support basmati paddies. Adjust pesticide application to align with impending storm timings.`}
                  </p>
                </div>
                <div className="mt-3 text-[10px] text-emerald-600 font-bold border-t border-emerald-50 pt-2 uppercase">
                  Advice Status: Crop Balanced
                </div>
              </div>

              {/* Irrigation Recommendations */}
              <div className="space-y-1.5 bg-white p-4 rounded-xl border border-emerald-100 flex flex-col justify-between">
                <div>
                  <span className="font-extrabold block text-emerald-950 uppercase tracking-wide text-[10px]">3. Smarter Irrigation Directives</span>
                  <p className="text-emerald-800 mt-2 font-medium leading-relaxed">
                    {weather.irrigationRecommendation || `Tube well schedules should remain active during pre-dawn cycles to accommodate ${humidity}% humidity trends.`}
                  </p>
                </div>
                <div className="mt-3 text-[10px] text-emerald-600 font-bold border-t border-emerald-50 pt-2 uppercase">
                  Device Status: Sensors Linked
                </div>
              </div>
            </div>

            {/* EXTREME ALERTS FLOATING (HEAT/STORM WARNINGS) */}
            {(weather.extremeHeatWarning || weather.stormWarning) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {weather.extremeHeatWarning && (
                  <div className="p-4 bg-rose-50 border border-rose-250 rounded-2xl text-xs text-rose-900 leading-relaxed flex gap-2">
                    <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-extrabold uppercase tracking-wide block">Extreme High Thermal Wave Wave Advisory</strong>
                      <p className="mt-1 text-rose-800 font-semibold">{weather.extremeHeatWarning}</p>
                    </div>
                  </div>
                )}
                {weather.stormWarning && (
                  <div className="p-4 bg-indigo-50 border border-indigo-250 rounded-2xl text-xs text-indigo-900 leading-relaxed flex gap-2">
                    <AlertTriangle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-extrabold uppercase tracking-wide block">Severe Mechanical Wind & Lodging advisory</strong>
                      <p className="mt-1 text-indigo-800 font-semibold">{weather.stormWarning}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

    </div>
  );
};


// --- PAGE 3: DISEASE DETECTION ---
export const DiseaseDetectionPage: React.FC = () => {
  const { language } = useApp();
  const [selectedCrop, setSelectedCrop] = useState("Rice");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preset Leaf Samples to let users easily trigger actual Gemini API diagnostics
  const presetSamples = [
    {
      name: "Rice Leaf Blast (Sample Leaf)",
      imageUrl: "https://images.unsplash.com/photo-1595273670150-db0a3bf44279?auto=format&fit=crop&q=80&w=300",
      imageBase64Placeholder: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", // tiny dummy
      desc: "Small diamond shape brown lesions on leaf blade.",
      crop: "Rice"
    },
    {
      name: "Wheat Yellow Rust (Rust Infection)",
      imageUrl: "https://images.unsplash.com/photo-1574325131876-a79996ed93ab?auto=format&fit=crop&q=80&w=300",
      imageBase64Placeholder: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", 
      desc: "Long linear yellow stripes of powdery circles on leaf blade surface.",
      crop: "Wheat"
    }
  ];

  const handleApplyPreset = (sample: typeof presetSamples[0]) => {
    setSelectedCrop(sample.crop);
    setDescription(sample.desc);
    setImageBase64(sample.imageBase64Placeholder);
    setPreviewUrl(sample.imageUrl);
    setImageFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64((reader.result as string).split(",")[1]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64((reader.result as string).split(",")[1]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setResult(null);

    try {
      const payload = {
        imageBase64: imageBase64 || "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
        mimeType: "image/png",
        description,
        cropName: selectedCrop,
        selectedLanguage: language,
        locale: language === "en" ? "en-US" : "hi-IN",
        userLanguagePreference: language
      };

      const res = await fetch("/api/gemini/disease-detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setResult({
        diseaseName: "Rice Blast (Infection Blast)",
        confidence: 88,
        symptoms: ["Grey-green diamond lesions with dark borders", "Premature drying of leaf", "Premature lodging"],
        cause: "Magnaporthe oryzae Fungus Spores",
        organicTreatment: "Spray 5% neem seed kernel extract formulation. Ensure potassium supplement to reinforce cell walls.",
        chemicalTreatment: "Spray Tricyclazole 75% WP @ 120 grams per acre diluted in 200 liters water.",
        prevention: "Destroy field stubble. Maintain proper seedling row distances.",
        severity: "High"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER OVERVIEW */}
      <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
        <div>
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-500/10 inline-block mb-3">AI Pathologist Neural Net v4.0</span>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-1.5 leading-tight">
            🎯 Crop Leaf Disease Diagnosis
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Diagnose plant stress, leaf blight, or fungal infections instantly. Upload photos of leaf blades directly of paddy, wheat, sugarcane, mustard or potato crops to run advanced agronomical deep analysis.
          </p>
        </div>

        {/* Easy Presets */}
        <div className="space-y-2.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Simulation Samples (Try Instantly)</span>
          <div className="flex flex-wrap gap-3">
            {presetSamples.map((ps, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(ps)}
                className="flex items-center gap-3 bg-slate-50 hover:bg-emerald-50/40 border border-slate-200/60 p-2.5 rounded-2xl text-left cursor-pointer transition duration-150 text-xs font-semibold text-slate-700 hover:border-emerald-500/20 shadow-3xs"
              >
                <img src={ps.imageUrl} className="w-8 h-8 rounded-lg object-cover" />
                <div>
                  <span className="block font-bold">{ps.name}</span>
                  <span className="block text-[9px] text-slate-400 font-normal">Crop: {ps.crop}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 pt-5 border-t border-slate-100">
          
          {/* Form Actions Column: Upload box and properties */}
          <div className="lg:col-span-5 space-y-4">
            
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Target Crop Category</label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white text-slate-800 font-semibold"
              >
                <option value="Rice">Rice (Paddy)</option>
                <option value="Wheat">Wheat</option>
                <option value="Mustard">Mustard Seeds</option>
                <option value="Sugarcane">Sugarcane</option>
                <option value="Potato">Potato</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Describe Leaf Symptoms (Optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Small diamond shaped spots appearing on upper leaf sheaths since last Thursday after watering..."
                rows={3}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white text-slate-800 font-medium placeholder-slate-400"
              />
            </div>

            {/* Direct leaf upload with DRAG-AND-DROP support */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Drag & Drop Leaf Photo</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer min-h-[160px] flex flex-col items-center justify-center gap-2.5 ${
                  isDragging
                    ? "border-emerald-600 bg-emerald-50/50"
                    : "border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-emerald-500"
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                {previewUrl ? (
                  <div className="space-y-2">
                    <img src={previewUrl} className="w-16 h-16 rounded-xl object-cover mx-auto shadow-sm border border-slate-200" />
                    <span className="text-xs font-bold text-emerald-800 block">✓ Attachment Selected</span>
                    <span className="text-[10px] text-slate-400">Click zone to change photograph</span>
                  </div>
                ) : (
                  <>
                    <Camera className="w-8 h-8 text-slate-400" />
                    <span className="text-xs font-bold text-slate-700">
                      {imageFile ? imageFile.name : "Drag your file here or click to select"}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">JPEG, PNG up to 10MB formats</span>
                  </>
                )}
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || (!imageBase64 && !imageFile)}
              className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-100 disabled:text-slate-400 text-white font-extrabold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider cursor-pointer transition shadow-3xs flex items-center justify-center gap-1.5"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                  Running Agri-AI Neural Diagnostics...
                </>
              ) : (
                "Diagnose Plant Health Now ✨"
              )}
            </button>

          </div>

          {/* Results Block Column */}
          <div className="lg:col-span-7 bg-slate-50/50 border border-slate-100 rounded-3xl p-6 min-h-[350px] flex flex-col justify-center">
            {isAnalyzing && (
              <div className="text-center py-12 space-y-4">
                <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <div>
                  <strong className="text-base font-extrabold text-slate-900 block animate-pulse">Running Neural Convolution Systems...</strong>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1 leading-relaxed">Processing foliage geometry ratios, coloration profiles, and symptom analysis weights on cloud instances.</p>
                </div>
              </div>
            )}

            {!isAnalyzing && !result && (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-12 space-y-3">
                <ShieldCheck className="w-12 h-12 text-slate-300" />
                <div>
                  <p className="text-sm font-bold text-slate-700">Live Diagnosis Report Pending</p>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1 leading-relaxed">Select a quick sample preset on top of this panel or upload a leaf photo to trigger analysis reports.</p>
                </div>
              </div>
            )}

            {!isAnalyzing && result && (
              <div className="space-y-5 animate-fade-in text-xs leading-relaxed">
                
                {/* Result header */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    {previewUrl && (
                      <img src={previewUrl} className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-3xs" />
                    )}
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">AI Diagnosis Report</span>
                      <h3 className="text-base font-black text-slate-900">{result.diseaseName}</h3>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Diagnosed instantly via Vision AI</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <div className="bg-emerald-50 border border-emerald-500/10 px-3 py-1 rounded-2xl text-center">
                      <span className="text-[8px] text-slate-400 block uppercase font-bold">Confidence</span>
                      <strong className="text-emerald-800 text-sm font-black">{result.confidence}%</strong>
                    </div>
                    <div className={`px-3 py-1 rounded-2xl text-center border ${
                      result.severity === "High" ? "bg-rose-50 border-rose-100 text-rose-800" : "bg-amber-50 border-amber-100 text-amber-800"
                    }`}>
                      <span className="text-[8px] uppercase font-bold text-slate-400 block">Severity</span>
                      <strong className="text-sm font-black">{result.severity}</strong>
                    </div>
                  </div>
                </div>

                {/* Sickness Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 bg-white p-4 rounded-xl border border-slate-100">
                    <strong className="text-slate-800 font-bold block text-xs">Observed Symptoms</strong>
                    <ul className="list-disc pl-4 space-y-1.5 text-slate-600 font-medium">
                      {result.symptoms?.map((s: string, idx: number) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-1.5 bg-white p-4 rounded-xl border border-slate-100">
                    <strong className="text-slate-800 font-bold block text-xs">Biological Cause</strong>
                    <p className="text-slate-600 font-medium leading-relaxed">{result.cause}</p>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-emerald-50/50 border border-emerald-500/10 p-4.5 rounded-2xl space-y-2.5">
                  <h4 className="font-bold text-emerald-950 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <Sprout className="w-4 h-4 text-emerald-700" /> Organic Solution (Ecological/Biodynamic first)
                  </h4>
                  <p className="text-emerald-900 leading-normal bg-white p-3 rounded-xl border border-emerald-500/5 font-medium">
                    {result.organicTreatment}
                  </p>
                </div>

                <div className="bg-indigo-50/30 border border-indigo-500/10 p-4.5 rounded-2xl space-y-2.5">
                  <h4 className="font-bold text-indigo-950 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-indigo-700" /> Targeted Chemical Treatment (If severities propagate)
                  </h4>
                  <p className="text-indigo-900 leading-normal bg-white p-3 rounded-xl border border-indigo-500/5 font-medium">
                    {result.chemicalTreatment}
                  </p>
                </div>

                <div className="bg-amber-50/40 border border-amber-500/10 p-4 rounded-2xl space-y-1">
                  <span className="font-bold text-amber-950 block text-[10px] uppercase tracking-wider">Agronomist Proactive Guidelines</span>
                  <p className="text-amber-900 font-medium leading-relaxed text-[11px]">{result.prevention}</p>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};


// --- PAGE 4: MEDICINE RECOMMENDATIONS ---
export const MedicineRecommendationsPage: React.FC = () => {
  const { products, language } = useApp();
  const [crop, setCrop] = useState("Rice");
  const [problemDescription, setProblemDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recs, setRecs] = useState<any>(null);
  const [activeDealerMap, setActiveDealerMap] = useState<any>(null);

  const handleFetchRecommendations = async () => {
    setIsLoading(true);
    setRecs(null);

    try {
      const res = await fetch("/api/gemini/medicine-rec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cropName: crop,
          problem: problemDescription,
          selectedLanguage: language,
          locale: language === "en" ? "en-US" : "hi-IN",
          userLanguagePreference: language
        })
      });
      const data = await res.json();
      setRecs(data);
    } catch (err) {
      console.error(err);
      // Fallback structured diagnostic values
      setRecs({
        diagnosis: "Slight Nitrogen/Phosphorous deficiency on soil leaves.",
        organicSolutions: ["Liquid vermi-urine fertilizer spray", "Drip application of organic cow dung mixture"],
        chemicalSolutions: ["Premium NPK 19:19:19 formulation spray", "Zinc sulphate monohydrate"],
        usageInstructions: "Mix 25g NPK powder per 15L water spray pump. Distribute uniformly before sunset.",
        precautions: "Wear filter nose masks. Keep animal grazers away for 48 hours post spray."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* MEDICAL CALCULATOR FORM */}
      <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
        <div>
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-500/10 inline-block mb-3">Therapeutic Formulation Engine</span>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-1.5 leading-tight">
            📦 Medical & Bio-Medicine Recommendations
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
            Diagnose active field strain or mineral shortages. Input your crop metrics to generate prescriptions and find certified physical merchants nearby.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Crop Name / Variety</label>
            <input
              type="text"
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full text-xs p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white text-slate-800 font-semibold"
              placeholder="e.g., Basmati Paddy Rice, CO-0238 Sugarcane, Wheat"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-sans">Active Symptoms / Challenge</label>
            <input
              type="text"
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              className="w-full text-xs p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white text-slate-800 font-semibold"
              placeholder="e.g., small leaf blades turning dry red and folding, white powder dots"
            />
          </div>
        </div>

        <button
          onClick={handleFetchRecommendations}
          disabled={isLoading}
          className="bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-100 text-white font-extrabold py-3 px-6 rounded-xl text-xs uppercase tracking-wider cursor-pointer transition shadow-3xs flex items-center gap-1.5 justify-center sm:w-fit"
        >
          {isLoading ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
              Querying Treatment Datasets...
            </>
          ) : (
            "Generate Bio-Prescription Plan ✨"
          )}
        </button>

        {recs && (
          <div className="border-t border-slate-100 pt-6 space-y-4 animate-fade-in text-xs leading-relaxed text-slate-800">
            <div className="bg-emerald-50 border border-emerald-500/10 p-4 rounded-2xl">
              <strong className="text-emerald-950 font-bold block text-xs">Clinical Agronomy Diagnosis</strong>
              <p className="mt-1 font-medium">{recs.diagnosis}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white border border-slate-100 p-4 rounded-2xl space-y-2">
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Eco-Biological Remedies</span>
                <ul className="list-disc pl-4 space-y-1.5 text-slate-600 font-medium">
                  {recs.organicSolutions?.map((sol: string, idx: number) => (
                    <li key={idx}>{sol}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-white border border-slate-100 p-4 rounded-2xl space-y-2">
                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">Bio-Chemical Prescription</span>
                <ul className="list-disc pl-4 space-y-1.5 text-slate-600 font-medium">
                  {recs.chemicalSolutions?.map((sol: string, idx: number) => (
                    <li key={idx}>{sol}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Foliage Application Dosage Instructions</span>
              <p className="mt-1 font-mono text-[11px] leading-relaxed text-slate-750 font-semibold">{recs.usageInstructions}</p>
            </div>

            <div className="p-4 bg-rose-50/60 border border-rose-500/10 rounded-2xl flex items-start gap-2.5 text-rose-800">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-600 mt-0.5" />
              <div>
                <strong className="block text-rose-950 font-bold">Toxicity & Safety Precautions</strong>
                <p className="text-rose-905 mt-0.5 font-medium">{recs.precautions}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* STYLISH PREMIUM MEDICINE CARDS IN STORES */}
      <div className="bg-white border border-slate-100 p-6 rounded-3xl space-y-5 shadow-sm">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Store Locator Integration</span>
          <h3 className="font-extrabold text-slate-900 text-sm">🏪 Premium Certified Medicines & Bio-Inputs</h3>
          <p className="text-slate-400 text-[11px] mt-0.5">Authorised high-yield fertilizers and pesticide bags nearby under local licensing coordinates.</p>
        </div>

        {/* Dealer Details Drawer overlay if open */}
        {activeDealerMap && (
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-500/10 rounded-2xl p-4.5 text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping" />
                <strong className="text-emerald-950 text-xs">Dealer Location Coordinates Located!</strong>
              </div>
              <p className="font-medium text-emerald-800 leading-normal">
                Authorized Supplier: <strong className="text-slate-900 font-extrabold">{activeDealerMap.shopName}</strong> • Sitapur Road Mandi Junction, Lucknow (2.4 km away).
              </p>
              <span className="font-mono text-[10px] text-slate-500 block">Stock Level: <strong className="text-emerald-700">12 bags available</strong> | Phone verification: +91 94502 XXXXX</span>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => window.open && window.open("https://maps.google.com")}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-[10px] uppercase tracking-wider py-2 px-4 rounded-xl transition cursor-pointer flex-grow sm:flex-grow-0 text-center"
              >
                Launch Map Navigation 🗺️
              </button>
              <button
                onClick={() => setActiveDealerMap(null)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-[10px] py-2 px-3 rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.slice(0, 4).map((p) => (
            <div key={p.id} className="bg-white border border-slate-100 rounded-3xl p-4 flex flex-col justify-between hover:shadow-md transition duration-200">
              <div className="space-y-2.5">
                <div className="relative">
                  <ImageWithFallback src={p.image} category={p.category} fallbackType="product" className="w-full h-32 object-cover rounded-2xl border border-slate-100" />
                  <span className="text-[8px] bg-slate-900/90 text-white px-2 py-0.5 rounded-md font-extrabold uppercase tracking-wider absolute bottom-2 left-2">
                    {p.category}
                  </span>
                </div>
                
                <div className="space-y-1">
                  <h4 className="font-extrabold text-slate-900 leading-tight block">{p.name}</h4>
                  <span className="text-[10px] text-slate-400 block font-semibold">Dosage: 2-3g / Litre of Foliage Spray</span>
                </div>
                
                <p className="text-[10px] text-slate-500 leading-relaxed font-semibold italic">"{p.description}"</p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100 mt-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono text-sm font-black text-slate-900">₹{p.price}</span>
                  <span className="text-[8px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-500/10">In Stock</span>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveDealerMap({ shopName: p.shopName, productName: p.name })}
                  className="w-full bg-slate-50 hover:bg-emerald-700 hover:text-white border border-slate-200/80 hover:border-emerald-700 text-slate-800 text-[10px] uppercase tracking-wider py-2 rounded-xl transition duration-150 cursor-pointer text-center font-extrabold"
                >
                  Find Nearby Shop 🏪
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};


// --- PAGE 5: CROP PRICES ---
export const CropPricesPage: React.FC = () => {
  const { cropPrices } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCropRecord, setSelectedCropRecord] = useState(cropPrices[0]);

  const filteredPrices = cropPrices.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Target crop cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Crop Indices (12-5 span) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-150 p-5 rounded-3xl shadow-3xs space-y-4">
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm">🌾 Mandi Grain Indices</h3>
              <p className="text-[11px] text-slate-400">Search wheat, rice, mustard, or sugarcane</p>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Crops..."
                className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 text-slate-800 font-semibold"
              />
            </div>

            <div className="space-y-2 max-h-[350px] overflow-y-auto">
              {filteredPrices.map((p) => (
                <button
                  key={p.name}
                  onClick={() => setSelectedCropRecord(p)}
                  className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${
                    selectedCropRecord.name === p.name
                      ? "bg-emerald-500/10 border-emerald-500 text-emerald-950 font-extrabold shadow-3xs"
                      : "bg-slate-50/50 border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold block">{p.name}</span>
                    <span className="text-[9px] text-slate-400 font-mono">{p.market}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black block">₹{p.currentPrice}/Qtl</span>
                    <span className={`text-[9px] font-bold ${p.changePercent >= 0 ? "text-emerald-700" : "text-rose-600"}`}>
                      {p.changePercent >= 0 ? "▲" : "▼"} {p.changePercent}%
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Historical Analysis (12-8 span) */}
        <div className="lg:col-span-8 space-y-6">
          {selectedCropRecord && (
            <>
              {/* Detailed Trend SVG Chart */}
              <CropPriceChart history={selectedCropRecord.history} cropName={selectedCropRecord.name} />

              {/* Forecast Card and info */}
              <div className="bg-white border border-slate-150 p-6 rounded-3xl shadow-3xs space-y-4">
                <h3 className="font-extrabold text-slate-900 text-sm">📈 Price Forecast Analysis</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-1">
                    <span className="text-[10px] uppercase text-slate-400 block tracking-wider">Suggested Option</span>
                    <strong className="text-emerald-700 text-sm font-black block uppercase">Strong Hold</strong>
                    <p className="text-[9px] text-slate-400 font-normal leading-normal">Prices are expected to increase over next 4 weeks due to harvesting delays.</p>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-1">
                    <span className="text-[10px] uppercase text-slate-400 block tracking-wider">Estimated High</span>
                    <strong className="text-slate-800 text-sm font-black block">₹{Math.round(selectedCropRecord.currentPrice * 1.08)}/Qtl</strong>
                    <p className="text-[9px] text-slate-400 font-normal leading-normal">Projected target based on seasonal demand shortages during Mandi trading auctions.</p>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-1">
                    <span className="text-[10px] uppercase text-slate-400 block tracking-wider">Mandi Arrival Load</span>
                    <strong className="text-indigo-700 text-sm font-bold block uppercase">Moderate Loading</strong>
                    <p className="text-[9px] text-slate-400 font-normal leading-normal">Paddy transportation metrics remain low, preventing supply overflow index crashes.</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

      </div>

    </div>
  );
};


// --- PAGE 6: COMMUNITY ---
export const CommunityPage: React.FC = () => {
  const { feedPosts, createFeedPost, likeFeedPost, addCommentToPost, language } = useApp();
  const [postInput, setPostInput] = useState("");
  const [commentInput, setCommentInput] = useState<{ [postId: string]: string }>({});
  const [feedTranslations, setFeedTranslations] = useState<{ [postId: string]: { text: string; lang: string; loading: boolean } }>({});

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postInput.trim()) return;
    createFeedPost(postInput);
    setPostInput("");
  };

  const handleCommentSubmit = (postId: string) => {
    const text = commentInput[postId];
    if (!text || !text.trim()) return;
    addCommentToPost(postId, text);
    setCommentInput(prev => ({ ...prev, [postId]: "" }));
  };

  const handleTranslateFeed = async (postId: string, content: string, targetLang: string) => {
    setFeedTranslations(prev => ({
      ...prev,
      [postId]: { text: prev[postId]?.text || "", lang: targetLang, loading: true }
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
        })
      });
      const data = await res.json();
      setFeedTranslations(prev => ({
        ...prev,
        [postId]: { text: data.translatedText || content, lang: targetLang, loading: false }
      }));
    } catch (err) {
      console.error(err);
      setFeedTranslations(prev => ({
        ...prev,
        [postId]: { text: content, lang: targetLang, loading: false }
      }));
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Create Post Banner */}
      <div className="bg-white border border-slate-100 p-6 sm:p-7 rounded-3xl shadow-sm space-y-4">
        <div>
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-500/10 inline-block mb-3">Community Square</span>
          <h3 className="font-extrabold text-slate-900 text-base">📣 Farmer Discussion Portal</h3>
          <p className="text-slate-400 text-xs mt-0.5">Share seasonal harvests, ask fertilizer questions, or get real-time crop remedies.</p>
        </div>
        
        <form onSubmit={handlePostSubmit} className="space-y-3">
          <textarea
            value={postInput}
            onChange={(e) => setPostInput(e.target.value)}
            placeholder="Share sugarcane sowing results, vermicompost tips, or local mandi update queries with village buddies..."
            rows={2}
            className="w-full text-xs p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-600 focus:bg-white text-slate-800 font-medium placeholder-slate-400"
          />
          <div className="flex justify-between items-center pt-2">
            <span className="text-[10px] text-slate-400 font-mono">Agrivon Local Net • Hinglish & Hindi Translator Enabled</span>
            <button
              type="submit"
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs py-2.5 px-6 rounded-xl transition cursor-pointer flex items-center gap-1 shadow-3xs"
            >
              Post Announcement <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>

      {/* Social Feed List */}
      <div className="space-y-5">
        {feedPosts.map((post) => {
          const trans = feedTranslations[post.id];
          return (
            <div key={post.id} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
              
              {/* Post Header */}
              <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-800 rounded-2xl flex items-center justify-center font-black text-sm border border-emerald-500/10">
                    {post.authorName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-xs font-extrabold text-slate-900">{post.authorName}</strong>
                      <span className="text-[8px] bg-slate-100 text-slate-500 font-extrabold px-1.5 py-0.5 rounded uppercase">
                        {post.authorRole}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
                      {new Date(post.createdAt).toLocaleDateString()} • Mandi Hub
                    </span>
                  </div>
                </div>
                
                <button type="button" className="text-[10px] text-emerald-800 font-extrabold bg-emerald-50/50 hover:bg-emerald-700 hover:text-white px-3 py-1.5 rounded-xl cursor-pointer transition border border-emerald-500/10">
                  + Follow
                </button>
              </div>

              {/* Post Content */}
              <div className="space-y-3">
                {trans?.loading ? (
                  <div className="py-2 flex items-center gap-2 text-slate-400 text-xs">
                    <div className="w-3 h-3 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing syntax and generating translation...</span>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <p className="text-xs text-slate-800 leading-relaxed font-semibold">
                      {trans ? trans.text : post.content}
                    </p>
                    {trans && (
                      <span className="text-[9px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full inline-block">
                        ✓ Translated to {trans.lang}
                      </span>
                    )}
                  </div>
                )}

                {/* Translate buttons widget */}
                <div className="flex flex-wrap items-center gap-1.5 bg-slate-50 p-2 rounded-2xl w-fit">
                  <span className="text-[9px] text-slate-400 font-bold block px-2 uppercase tracking-wider">Translate Post:</span>
                  <button
                    onClick={() => handleTranslateFeed(post.id, post.content, "English")}
                    className={`text-[9px] font-extrabold px-2 py-1 rounded-xl cursor-pointer transition ${
                      trans?.lang === "English" ? "bg-emerald-700 text-white" : "bg-white text-slate-700 border border-slate-200/60 hover:bg-slate-100"
                    }`}
                  >
                    🇬🇧 EN
                  </button>
                  <button
                    onClick={() => handleTranslateFeed(post.id, post.content, "Hindi")}
                    className={`text-[9px] font-extrabold px-2 py-1 rounded-xl cursor-pointer transition ${
                      trans?.lang === "Hindi" ? "bg-emerald-700 text-white" : "bg-white text-slate-700 border border-slate-200/60 hover:bg-slate-100"
                    }`}
                  >
                    🇮🇳 हिन्दी
                  </button>
                  <button
                    onClick={() => handleTranslateFeed(post.id, post.content, "Hinglish")}
                    className={`text-[9px] font-extrabold px-2 py-1 rounded-xl cursor-pointer transition ${
                      trans?.lang === "Hinglish" ? "bg-emerald-700 text-white" : "bg-white text-slate-700 border border-slate-200/60 hover:bg-slate-100"
                    }`}
                  >
                    🗣️ Hinglish
                  </button>
                  {trans && (
                    <button
                      onClick={() => {
                        const copy = { ...feedTranslations };
                        delete copy[post.id];
                        setFeedTranslations(copy);
                      }}
                      className="text-[9px] font-bold text-slate-400 underline px-1.5"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>

              {/* Post Actions */}
              <div className="flex items-center gap-4 pt-4 border-t border-slate-50 text-xs">
                <button
                  onClick={() => likeFeedPost(post.id)}
                  className="flex items-center gap-1.5 font-bold text-slate-500 hover:text-emerald-750 transition cursor-pointer"
                >
                  <ThumbsUp className="w-4 h-4 text-slate-400 hover:text-emerald-700" /> Like ({post.likesCount})
                </button>
                <div className="text-slate-400 font-semibold flex items-center gap-1">
                  <span>💬</span> {post.comments?.length || 0} Comments
                </div>
              </div>

              {/* Comment lists inside */}
              <div className="space-y-2.5 bg-slate-50/50 p-4.5 rounded-2xl border border-slate-100">
                {post.comments?.map((c) => (
                  <div key={c.id} className="border-b border-slate-100 last:border-0 pb-2.5 last:pb-0 text-xs space-y-0.5">
                    <div className="flex items-center justify-between">
                      <strong className="font-extrabold text-slate-900">{c.authorName} <span className="text-[9px] font-normal text-slate-400">({c.authorRole})</span></strong>
                      <span className="text-[9px] text-slate-400 font-mono">{new Date(c.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-slate-600 font-medium italic">"{c.content}"</p>
                  </div>
                ))}

                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Provide friendly agronomist input..."
                    value={commentInput[post.id] || ""}
                    onChange={(e) => setCommentInput({ ...commentInput, [post.id]: e.target.value })}
                    className="flex-grow text-xs px-3.5 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white text-slate-800 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => handleCommentSubmit(post.id)}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-[10px] uppercase px-4 py-2 rounded-xl cursor-pointer shadow-3xs transition"
                  >
                    Reply
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};


// --- PAGE 7: MESSAGES ---
export const MessagesPage: React.FC = () => {
  const { messages, sendChatMessage, users, currentUser, language } = useApp();
  const [recipientId, setRecipientId] = useState("");
  const [chatText, setChatText] = useState("");
  const [translations, setTranslations] = useState<{ [msgId: string]: string }>({});
  const [loadingTranslationId, setLoadingTranslationId] = useState<string | null>(null);

  const filteredRecipients = users.filter((u) => u.id !== currentUser.id);
  const activeChatRecipient = users.find((u) => u.id === recipientId);

  // Filter messages exchanged between active currentUser and selected recipientId
  const chatMessages = messages.filter(
    (m) =>
      (m.senderId === currentUser.id && m.receiverId === recipientId) ||
      (m.senderId === recipientId && m.receiverId === currentUser.id)
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatText.trim() || !recipientId) return;
    sendChatMessage(recipientId, chatText);
    setChatText("");
  };

  const handleTranslate = async (msgId: string, content: string) => {
    setLoadingTranslationId(msgId);
    try {
      const res = await fetch("/api/gemini/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: content,
          targetLanguage: "Hindi",
          selectedLanguage: language,
          locale: language === "en" ? "en-US" : "hi-IN",
          userLanguagePreference: language
        })
      });
      const data = await res.json();
      setTranslations((prev) => ({ ...prev, [msgId]: data.translatedText }));
    } catch (err) {
      console.error(err);
      setTranslations((prev) => ({ ...prev, [msgId]: content }));
    } finally {
      setLoadingTranslationId(null);
    }
  };

  return (
    <div className="bg-white border border-slate-150 rounded-3xl shadow-3xs overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
      
      {/* Sidebar Recipient List (Col 4) */}
      <div className="md:col-span-4 border-r border-slate-150 flex flex-col justify-between">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <input
            type="text"
            placeholder="Search Contacts..."
            className="w-full text-xs px-3 py-2 border border-grey-200 rounded-xl focus:outline-none"
          />
        </div>

        <div className="flex-grow max-h-[400px] overflow-y-auto divide-y divide-slate-100">
          {filteredRecipients.map((u) => {
            const name = u.role === "Farmer" ? u.farmerProfile?.name : u.role === "ShopOwner" ? u.shopOwnerProfile?.shopName : u.workerProfile?.name;
            const emoji = u.role === "Farmer" ? "🌾" : u.role === "ShopOwner" ? "🏪" : "👨‍🌾";
            return (
              <button
                key={u.id}
                onClick={() => setRecipientId(u.id)}
                className={`w-full flex items-center gap-3 p-3 text-left transition cursor-pointer text-xs font-semibold ${
                  recipientId === u.id ? "bg-emerald-500/10 text-emerald-950 font-extrabold" : "hover:bg-slate-50 text-slate-800"
                }`}
              >
                <span className="text-lg bg-white shadow-3xs p-1 rounded-lg select-none">{emoji}</span>
                <div>
                  <span className="block font-bold leading-tight">{name}</span>
                  <span className="text-[10px] text-slate-400 font-mono tracking-wide">{u.role}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Chat Deck (Col 8) */}
      <div className="md:col-span-8 flex flex-col justify-between bg-slate-50/50 min-h-[450px]">
        {recipientId ? (
          <>
            {/* Header */}
            <div className="bg-slate-100 p-4 border-b border-slate-200 flex items-center gap-2">
              <span className="text-xl">👤</span>
              <div>
                <strong className="text-xs text-slate-805 block">
                  {activeChatRecipient?.role === "Farmer" ? activeChatRecipient.farmerProfile?.name : activeChatRecipient?.role === "ShopOwner" ? activeChatRecipient.shopOwnerProfile?.shopName : activeChatRecipient?.workerProfile?.name}
                </strong>
                <span className="text-[9px] text-emerald-700 leading-none block font-semibold font-mono">Mobile Synchronizer Online</span>
              </div>
            </div>

            {/* Messages Content */}
            <div className="flex-grow p-4 overflow-y-auto space-y-3 max-h-[300px]">
              {chatMessages.length === 0 ? (
                <div className="text-center p-8 text-slate-400 italic text-xs">
                  No chat logs recorded yet. Send a message to initiate bargaining!
                </div>
              ) : (
                chatMessages.map((m) => {
                  const isOwn = m.senderId === currentUser.id;
                  const translated = translations[m.id];
                  const isLoadingTr = loadingTranslationId === m.id;

                  return (
                    <div key={m.id} className={`flex flex-col max-w-[80%] space-y-1 ${isOwn ? "ml-auto items-end" : "mr-auto items-start"}`}>
                      <div className={`p-3 rounded-2xl text-xs font-medium ${
                        isOwn ? "bg-emerald-700 text-white rounded-tr-none" : "bg-white border border-slate-200 text-slate-800 rounded-tl-none"
                      }`}>
                        <p>{m.content}</p>
                        
                        {translated && (
                          <div className="border-t border-emerald-500/20 pt-1.5 mt-1.5 text-[10px] text-amber-200 block italic leading-normal">
                             Trans: "{translated}"
                          </div>
                        )}
                      </div>

                      {/* Translate query button */}
                      {!isOwn && (
                        <button
                          onClick={() => handleTranslate(m.id, m.content)}
                          className="text-[9px] text-indigo-700 hover:underline font-bold"
                          disabled={isLoadingTr}
                        >
                          {isLoadingTr ? "Translating to Hindi..." : "Translate to Hindi 🗣️"}
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Form submit */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-150 flex gap-2">
              <input
                type="text"
                placeholder="Type your crop price negotiation details..."
                value={chatText}
                onChange={(e) => setChatText(e.target.value)}
                className="flex-grow text-xs px-3 py-2 border border-slate-250 rounded-xl focus:outline"
              />
              <button type="submit" className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-2 px-5 rounded-xl transition cursor-pointer">
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-405 italic text-xs p-12">
            <span>💬</span>
            <p className="mt-1 font-bold">Select a local farmer or seed shop buddy to coordinate services</p>
          </div>
        )}
      </div>

    </div>
  );
};


// --- PAGE 8: CROP DIARY ---
export const CropDiaryPage: React.FC = () => {
  const { diaryEntries, addDiaryEntry } = useApp();
  const [crop, setCrop] = useState("");
  const [notes, setNotes] = useState("");
  const [activity, setActivity] = useState<"Planting" | "Irrigation" | "Fertilization" | "Pest Control" | "Harvesting" | "Note">("Planting");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!crop || !notes) return;
    addDiaryEntry(crop, activity, notes);
    setCrop("");
    setNotes("");
  };

  return (
    <div className="space-y-6">
      
      {/* Calendar Form */}
      <div className="bg-white border border-slate-150 p-6 rounded-3xl shadow-3xs space-y-4">
        <h3 className="font-extrabold text-slate-800 text-sm">📅 Crop Cycle Diary Scheduler</h3>
        <p className="text-xs text-slate-400">Log sowed dates, chemical dosages, nursery watering logs, or harvest estimates.</p>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Crop Name</label>
            <input
              type="text"
              required
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              placeholder="e.g. Basmati Paddy B-1"
              className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Activity Type</label>
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value as any)}
              className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl"
            >
              <option value="Planting">Sowing & Planting Date</option>
              <option value="Irrigation">Irrigation Log</option>
              <option value="Fertilization">Fertilizer/Compost application</option>
              <option value="Pest Control">Pesticide Spray Cycle</option>
              <option value="Harvesting">Harvesting Date</option>
              <option value="Note">General Field Note</option>
            </select>
          </div>

          <div className="md:col-span-4">
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Details/Anomalies</label>
            <input
              type="text"
              required
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Nursery transplanted B-7, added 20kg vermi-zinc"
              className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <button type="submit" className="md:col-span-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 rounded-xl text-xs uppercase cursor-pointer">
            Add Log Entry
          </button>
        </form>
      </div>

      {/* Diary Timeline list */}
      <div className="bg-white border border-slate-150 p-6 rounded-3xl shadow-3xs space-y-4">
        <h3 className="font-extrabold text-slate-800 text-sm">📅 Log History</h3>
        <div className="relative border-l border-slate-200 pl-6 space-y-4">
          {diaryEntries.map((e) => (
            <div key={e.id} className="relative space-y-1">
              {/* Dot marker */}
              <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white" />
              <div className="flex gap-2 items-center">
                <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">{e.date}</span>
                <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-bold uppercase">{e.activityType}</span>
              </div>
              <strong className="text-xs font-bold text-slate-900 block">{e.cropName}</strong>
              <p className="text-xs text-slate-500 italic">"{e.notes}"</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};


// --- PAGE 9: YIELD PREDICTION ---
export const YieldPredictionPage: React.FC = () => {
  const { currentUser, language } = useApp();
  const [size, setSize] = useState(currentUser.farmerProfile?.farmSize || 5);
  const [crop, setCrop] = useState("Rice");
  const [soil, setSoil] = useState("Clay Loam");
  const [water, setWater] = useState("Canal + Drip");
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setPrediction(null);

    try {
      const res = await fetch("/api/gemini/yield-predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          farmSize: size,
          cropsGrown: crop,
          soilType: soil,
          waterSource: water,
          state: currentUser.farmerProfile?.state,
          village: currentUser.farmerProfile?.village,
          experience: currentUser.farmerProfile?.experience,
          selectedLanguage: language,
          locale: language === "en" ? "en-US" : "hi-IN",
          userLanguagePreference: language
        })
      });
      const data = await res.json();
      setPrediction(data);
    } catch (err) {
      console.error(err);
      setPrediction({
        estimatedYield: "125 - 140 Quintals total output",
        monetaryValueEstimate: "₹3,15,000 - ₹3,60,000 gross revenue",
        factorsInfluencing: ["Optimal clay soil nutrient retention", "Monsoon moisture indexing forecasts", "High-efficiency drip sprinkler layouts"],
        actionableTips: ["Utilize shallow rotary tiling to prevent deep sand evaporation", "Drip feed boron supplements early during grain maturity stage", "Complete paddy weeding before next rainfall dissipation"],
        potentialRisks: ["Pest spore Dissipation during rain humidity spikes", "Nitrate depletion cycles"]
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Input Form */}
      <div className="bg-white border border-slate-150 p-6 rounded-3xl shadow-3xs space-y-4">
        <h3 className="font-extrabold text-slate-800 text-sm">🌾 Soil Science & Crop Yield Predictor</h3>
        <p className="text-xs text-slate-400">Provide parameters to run dynamic machine learning simulation models based on local Uttar Pradesh weather and land size records.</p>
        
        <form onSubmit={handlePredict} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Target Crop Variety</label>
            <input
              type="text"
              required
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              placeholder="e.g. Basmati Rice, Wheat Dwarf"
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Land Size (Acres)</label>
            <input
              type="number"
              required
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              placeholder="e.g. 5"
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Soil Type Classification</label>
            <select
              value={soil}
              onChange={(e) => setSoil(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            >
              <option value="Clay Loam">Heavy Clay Loam (Paddy suited)</option>
              <option value="Sandy Sand">Alluvial Sandy Loam</option>
              <option value="Black Soil">Medium Black Soil</option>
              <option value="Red Sandy">Red Sandy Silt</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Watering Setup</label>
            <select
              value={water}
              onChange={(e) => setWater(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            >
              <option value="Canal + Drip">Dynamic Canal + Micro-Drip</option>
              <option value="Borewell Sprinkler">Submersible Tubewell Sprinkler</option>
              <option value="Rainfed purely">纯 Rainfed monsoon purely</option>
            </select>
          </div>

          <button type="submit" disabled={isLoading} className="md:col-span-4 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-200 text-white font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-widest cursor-pointer transition">
            {isLoading ? "Running mathematical soil regressions..." : "Run Yield Predictor ✨"}
          </button>
        </form>
      </div>

      {/* Yield Prediction Cards */}
      {prediction && (
        <div className="bg-white border border-slate-150 p-6 rounded-3xl shadow-3xs space-y-4 animate-fade-in text-xs leading-relaxed text-slate-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Projected Volume Yield */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl block text-center space-y-1">
              <span className="text-[10px] uppercase text-emerald-800 font-bold block tracking-wider">PROJECTED HARVEST OUTPUT</span>
              <strong className="text-emerald-950 text-xl font-black block">{prediction.estimatedYield}</strong>
              <p className="text-[9px] text-emerald-800 font-normal">Based on optimal seedling row spacing and recommended fertilizer ratios.</p>
            </div>

            {/* Projected Gross Revenue */}
            <div className="bg-indigo-50 border border-indigo-150 p-5 rounded-2xl block text-center space-y-1">
              <span className="text-[10px] uppercase text-indigo-800 font-bold block tracking-wider">PROJECTED MARKET REVENUE METRIC</span>
              <strong className="text-indigo-950 text-xl font-black block">{prediction.monetaryValueEstimate}</strong>
              <p className="text-[9px] text-indigo-800 font-normal">Calculated based on current Mandi MSP indices of the Uttar Pradesh registry.</p>
            </div>

          </div>

          {/* Tips list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Maximize Harvest Tips</span>
              <ul className="list-disc pl-4 space-y-1 text-slate-655 font-medium">
                {prediction.actionableTips?.map((tip: string, idx: number) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Identified biological hazards</span>
              <ul className="list-disc pl-4 space-y-1 text-slate-655 font-medium">
                {prediction.potentialRisks?.map((risk: string, idx: number) => (
                  <li key={idx}>{risk}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};


// --- PAGE 10: ORDERS (AGRI SUPPLY MARKETPLACE) ---
export const OrdersPage: React.FC = () => {
  const { orders, currentUser, products, placeOrder } = useApp();
  const [selectedProdForPurchase, setSelectedProdForPurchase] = useState("");
  const [qty, setQty] = useState(1);
  const [deliveryAddress, setDeliveryAddress] = useState("Kanakpur Block B, House 57");

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTabFilter, setActiveTabFilter] = useState<"All" | "Seed" | "Pesticide" | "Fertilizer" | "Tool">("All");

  // Detail Modal state
  const [inspectedProduct, setInspectedProduct] = useState<Product | null>(null);
  const [activeDetailImage, setActiveDetailImage] = useState<string>("");

  // Quick purchase accordion on cards
  const [quickBuyId, setQuickBuyId] = useState<string | null>(null);

  // Track active thumbnail image displays per product card
  const [activeCardImages, setActiveCardImages] = useState<Record<string, string>>({});

  const farmerOrders = orders.filter((o) => o.farmerId === currentUser.id);

  // Filtered supplies
  const filteredProducts = products.filter((p) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (p.brandName || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
      (p.composition || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeTabFilter === "All" || p.category === activeTabFilter;
    return matchesSearch && matchesCategory;
  });

  const handlePlaceOrderWithDetails = (productId: string, orderQty: number, addressText: string) => {
    if (!productId) return;
    const target = products.find(p => p.id === productId);
    if (!target) return;
    
    if (orderQty > target.stockCount) {
      alert(`Insufficient stock! Shop only has ${target.stockCount} units remaining.`);
      return;
    }

    placeOrder(productId, orderQty, addressText);
    alert(`Voucher Placed! Your order for ${orderQty} x "${target.name}" has been routed to "${target.shopName}".`);
    
    // reset configurations
    setQuickBuyId(null);
    setInspectedProduct(null);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Dynamic Marketplace Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-900 text-white p-6 rounded-3xl shadow-sm border border-emerald-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-xl">
          <span className="bg-emerald-500/20 text-emerald-300 text-[10px] uppercase font-mono font-bold tracking-widest px-3 py-1 rounded-full border border-emerald-500/10">
            Certified Krishi Marketplace
          </span>
          <h2 className="text-2xl font-black mt-3 text-white tracking-tight">Direct Agro-Chemicals & Certified Supplies Shelf</h2>
          <p className="text-xs text-emerald-100/80 leading-relaxed mt-1">
            Browse and order high-performance chemical pesticides, dual balanced NPK fertilizers, manual pressure weeding sprayers, and non-treated hybrid seeds directly. All products feature full technical datasheets and state license certifications.
          </p>
        </div>
        
        {/* Marketplace stats */}
        <div className="flex gap-4 self-stretch md:self-auto">
          <div className="flex-1 bg-white/5 border border-white/10 p-3.5 rounded-2xl text-center min-w-28">
            <span className="block text-[9px] text-emerald-200 uppercase font-mono font-bold">Local Vendors</span>
            <span className="text-lg font-black text-white font-mono mt-0.5 block">Active</span>
          </div>
          <div className="flex-1 bg-white/5 border border-white/10 p-3.5 rounded-2xl text-center min-w-28">
            <span className="block text-[9px] text-emerald-200 uppercase font-mono font-bold">Vouchers</span>
            <span className="text-lg font-black text-emerald-300 font-mono mt-0.5 block">{farmerOrders.length} Booked</span>
          </div>
        </div>
      </div>

      {/* Directory Searching & Filtration controls */}
      <div className="bg-white border border-slate-100 p-4 rounded-3xl shadow-3xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          
          {/* Text Search */}
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search by brand, chemicals, active formula or seed type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
            />
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-3 text-[10px] font-bold text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Filters Pill-Group */}
          <div className="flex flex-wrap gap-1.5 items-center w-full md:w-auto">
            <span className="text-[10px] text-slate-400 font-bold uppercase mr-1 select-none hidden xl:inline">Filter Shelf:</span>
            {[
              { id: "All", label: "All Supplies", icon: "📦" },
              { id: "Seed", label: "Seeds 🌾", icon: "🌾" },
              { id: "Pesticide", label: "Pesticides 🧪", icon: "🧪" },
              { id: "Fertilizer", label: "Fertilizers 📦", icon: "📦" },
              { id: "Tool", label: "Tools ⚙️", icon: "⚙️" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTabFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTabFilter === tab.id 
                    ? "bg-slate-900 text-white shadow-xs" 
                    : "bg-slate-50 text-slate-650 hover:bg-slate-100"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
          
        </div>
      </div>

      {/* Primary Products Shelf Catalog UI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full bg-slate-50 border border-dashed border-slate-200 rounded-3xl p-16 text-center space-y-3">
            <div className="max-w-sm mx-auto text-slate-400 space-y-2">
              <span className="text-3xl block">🔍</span>
              <h4 className="font-bold text-slate-700 text-sm">No Agritech Supplies Matches Match Your Query</h4>
              <p className="text-xs">
                We couldn't locate active inventory elements fitting "{searchQuery}". Try selecting another category tab or resetting filters.
              </p>
              <button
                type="button"
                onClick={() => { setSearchQuery(""); setActiveTabFilter("All"); }}
                className="mt-2 text-xs text-emerald-700 font-bold hover:underline cursor-pointer"
              >
                Reset Search Filters
              </button>
            </div>
          </div>
        ) : (
          filteredProducts.map((p) => {
            const isQuickBuyActive = quickBuyId === p.id;
            const currentImg = activeCardImages[p.id] || p.image;
            const prodAvailable = p.isAvailable !== false;

            return (
              <div 
                key={p.id} 
                className={`bg-white border rounded-3xl overflow-hidden transition-all flex flex-col justify-between ${
                  !prodAvailable
                    ? "opacity-80 bg-rose-50/5 border-rose-100 shadow-3xs"
                    : isQuickBuyActive 
                    ? "border-emerald-600 ring-1 ring-emerald-600/30 shadow-md" 
                    : "border-slate-150 hover:border-slate-350 shadow-3xs"
                }`}
              >
                
                {/* Upper block */}
                <div className="p-5 space-y-4">
                  <div className="relative">
                    <ImageWithFallback 
                      src={currentImg} 
                      category={p.category}
                      fallbackType="product"
                      className="w-full h-36 object-cover rounded-2xl" 
                      alt={p.name}
                    />
                    
                    {/* Floating Categories & Brand labels */}
                    <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                      <span className="bg-white/95 backdrop-blur-xs text-[9px] text-slate-800 font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-3xs">
                        {p.category}
                      </span>
                      {p.brandName && (
                        <span className="bg-emerald-900/90 text-[9px] text-white font-extrabold px-2.5 py-0.5 rounded-full uppercase shadow-3xs">
                          {p.brandName}
                        </span>
                      )}
                    </div>

                    {/* Stock & Availability Alerts overlay */}
                    <div className="absolute bottom-2 right-2 flex flex-col items-end gap-1">
                      {!prodAvailable ? (
                        <span className="bg-rose-600 text-white text-[9px] font-black px-2 py-0.5 rounded-lg shadow-3xs uppercase tracking-wide animate-pulse">
                          Sold Out / Unavailable
                        </span>
                      ) : (
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-lg shadow-3xs ${
                          p.stockCount < 10 
                            ? "bg-rose-50 text-rose-600 border border-rose-200 animate-pulse" 
                            : "bg-slate-900/80 text-white"
                        }`}>
                          Stock: {p.stockCount} Pack left
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Multiple image gallery strip in marketplace */}
                  {p.images && p.images.length > 1 && (
                    <div className="flex gap-1 overflow-x-auto py-1">
                      {p.images.slice(0, 5).map((img, imgIdx) => (
                        <button
                          key={imgIdx}
                          type="button"
                          onClick={() => setActiveCardImages(prev => ({ ...prev, [p.id]: img }))}
                          className={`w-8 h-8 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                            currentImg === img ? "border-emerald-600 ring-1 ring-emerald-600/20" : "border-slate-200 hover:border-slate-350"
                          }`}
                        >
                          <img src={img} className="w-full h-full object-cover" alt="" />
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-x-2 text-[10px] text-slate-400 font-semibold uppercase">
                      <span className="text-emerald-600 font-bold">Seller: {p.shopOwnerName || "Amit Kumar"}</span>
                      <span className="text-slate-350 font-bold">•</span>
                      <span>{p.shopName}</span>
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-sm leading-tight hover:text-emerald-700 transition line-clamp-2 mt-1">
                      {p.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>
                  </div>

                  {/* Location & Hotline Contact Overlays */}
                  <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100 text-[10px] font-bold text-slate-600/95 bg-slate-50/50 p-2 rounded-xl">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 font-bold" /> Mandi: <span>{p.location || "Village Center Depot"}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400 font-bold" /> Phone: <span className="font-mono">{p.contactNumber || "Hotline Connected"}</span>
                    </span>
                  </div>

                  {/* Real agricultural specifications snippet if they exist */}
                  {(p.composition || p.cropCompatibility) && (
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/60 text-[10px] space-y-1">
                      {p.composition && (
                        <div className="truncate">
                          <span className="text-slate-400">Formula:</span> <span className="font-mono text-slate-700 font-semibold">{p.composition}</span>
                        </div>
                      )}
                      {p.cropCompatibility && (
                        <div className="truncate">
                          <span className="text-slate-400">Target Crops:</span> <span className="text-emerald-800 font-bold">{p.cropCompatibility}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Pricing & CTA block */}
                <div className="p-5 pt-0 mt-auto border-t border-slate-50 space-y-4">
                  <div className="flex justify-between items-center pt-3">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Unit Cost</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-base font-black text-slate-900 font-mono">₹{p.price}</span>
                        <span className="text-[10px] text-slate-400">/unit pack</span>
                      </div>
                    </div>
                    
                    {/* Compliance Check Checkbox icon */}
                    <div className="text-right">
                      {prodAvailable ? (
                        <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block animate-ping"></span>
                          Verified Supply
                        </span>
                      ) : (
                        <span className="text-[9px] font-black text-rose-800 bg-rose-50 px-2.5 py-1 rounded inline-flex items-center gap-1">
                          Temporarily Unavailable
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Inline collapse accordion for quick delivery buying */}
                  {isQuickBuyActive && prodAvailable && (
                    <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 space-y-3 animate-fade-in text-xs text-slate-700">
                      <span className="block font-bold text-slate-900">⚡ Direct Village Checkout Desk</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-500 font-bold mb-1">Quantity (unit packs)</label>
                          <input
                            type="number"
                            required
                            min={1}
                            max={p.stockCount}
                            value={qty}
                            onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                            className="w-full p-2 bg-white border border-slate-200 rounded-xl"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-500 font-bold mb-1">Total Due</label>
                          <div className="p-2 bg-white border border-slate-200 rounded-xl font-mono font-black text-slate-800">
                            ₹{(qty * p.price).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-500 font-bold mb-1">Field/Village Delivery Address</label>
                        <input
                          type="text"
                          required
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-200 rounded-xl"
                        />
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <button
                          onClick={() => setQuickBuyId(null)}
                          className="text-[11px] text-rose-600 font-bold hover:underline"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handlePlaceOrderWithDetails(p.id, qty, deliveryAddress)}
                          className="bg-emerald-850 hover:bg-emerald-900 text-white font-bold px-4 py-2 rounded-xl text-[11px] cursor-pointer"
                        >
                          Confirm Order 🌾
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Outer Main Button Links */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => { setInspectedProduct(p); setActiveDetailImage(p.image); }}
                      className="w-full py-2 border border-slate-200 hover:border-slate-350 rounded-xl text-xs font-bold text-slate-700 text-center transition flex items-center justify-center gap-1 cursor-pointer bg-slate-50/50 hover:bg-slate-50"
                    >
                      <Info className="w-3.5 h-3.5 text-slate-400" />
                      View Technical Specs
                    </button>
                    
                    <button
                      disabled={!prodAvailable}
                      onClick={() => {
                        if (isQuickBuyActive) {
                          setQuickBuyId(null);
                        } else {
                          setQty(1);
                          setQuickBuyId(p.id);
                        }
                      }}
                      className={`w-full py-2 text-white rounded-xl text-xs font-bold text-center transition flex items-center justify-center gap-1 cursor-pointer ${
                        !prodAvailable
                          ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                          : "bg-emerald-850 hover:bg-emerald-900"
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      {isQuickBuyActive ? "Close Desk" : !prodAvailable ? "Unavailable" : "Instant Buy"}
                    </button>
                  </div>

                </div>

              </div>
            );
          })
        )}
      </div>

      {/* REAL PHYSICAL PRODUCT SPECIFICATION DRAWER / MODAL DIALOG */}
      {inspectedProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-100 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl space-y-6 flex flex-col justify-between">
            
            {/* Header band */}
            <div className="p-6 pb-4 border-b border-slate-100 flex justify-between items-start">
              <div>
                <span className="bg-emerald-100 text-emerald-800 text-[9px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full inline-block mb-1">
                  Verified {inspectedProduct.category} Catalog Listing
                </span>
                <h3 className="text-lg font-black text-slate-900">{inspectedProduct.name}</h3>
                <p className="text-[11px] text-slate-400">Sold by certified village merchant: "{inspectedProduct.shopName}"</p>
              </div>
              <button 
                onClick={() => setInspectedProduct(null)}
                className="text-slate-400 hover:text-slate-600 bg-slate-100 p-1.5 rounded-full cursor-pointer transition text-xs font-black"
                title="Close specifications"
              >
                ✕
              </button>
            </div>

            {/* Spec Body info panel */}
            <div className="p-6 pt-0 space-y-5 overflow-y-auto flex-1 text-xs text-slate-700">
              
              {/* Large Active Product Image */}
              <div className="relative w-full h-48 md:h-56 bg-slate-50 rounded-2xl overflow-hidden border border-slate-150 shadow-3xs flex items-center justify-center">
                <ImageWithFallback 
                  src={activeDetailImage || inspectedProduct.image} 
                  category={inspectedProduct.category} 
                  fallbackType="product" 
                  className="w-full h-full object-cover" 
                  alt={inspectedProduct.name}
                />
                <span className="text-[9px] bg-slate-900/90 text-white px-2.5 py-0.5 rounded-md font-extrabold uppercase tracking-wider absolute bottom-3 left-3 shadow-sm">
                  {inspectedProduct.category}
                </span>
              </div>

              {/* Pricing & Stock parameters */}
              <div className="flex gap-4 items-center bg-emerald-50/20 p-4 rounded-2xl border border-emerald-500/10">
                <div>
                  <span className="font-mono text-sm font-black text-slate-900">₹{inspectedProduct.price} <span className="text-[10px] text-slate-400 font-normal">per pack unit</span></span>
                  <div className="text-[10px] text-slate-500 mt-1">
                    Manufacturer Brand: <span className="font-bold text-slate-700">{inspectedProduct.brandName || "Local Certified Vendor"}</span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Remaining Store Inventory: <span className="font-semibold text-emerald-700 font-bold">{inspectedProduct.stockCount} packs left</span>
                  </div>
                </div>
              </div>

              {/* Interactive swap gallery */}
              {inspectedProduct.images && inspectedProduct.images.length > 0 && (
                <div className="space-y-1.5 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono">Product Gallery Showcase (Click to switch)</span>
                  <div className="flex gap-2 overflow-x-auto py-0.5">
                    {inspectedProduct.images.map((img, idx) => {
                      const isSelected = (activeDetailImage || inspectedProduct.image) === img;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveDetailImage(img)}
                          className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 flex-shrink-0 shadow-3xs cursor-pointer transition-all ${
                            isSelected ? "border-emerald-600 ring-2 ring-emerald-600/10 scale-95" : "border-slate-250 hover:border-slate-350"
                          }`}
                        >
                          <img src={img} className="w-full h-full object-cover" alt="" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Seller / Vendor Logistics Details */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2.5 text-[11px] text-slate-600">
                <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono border-b border-slate-200/60 pb-1">Verified Seller Profile</span>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" /> Seller Name: <span className="text-slate-800 font-black">{inspectedProduct.shopOwnerName || "Amit Kumar"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" /> Location / Mandi: <span className="text-slate-800 font-bold">{inspectedProduct.location || "Village Center Mandi Depot"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" /> Seller Contact: <span className="text-slate-800 font-mono font-bold">{inspectedProduct.contactNumber || "Hotline Connected"}</span>
                </div>
              </div>

              {/* Technical Grid Parameter blocks (Use for Real) */}
              <div className="space-y-4">
                <h4 className="font-black text-slate-800 text-[11px] uppercase tracking-wider border-b border-slate-100 pb-1.5 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-emerald-700" /> Agrarian Chemistry & Specifications
                </h4>

                <div className="grid grid-cols-2 gap-4 leading-relaxed font-semibold">
                  <div>
                    <span className="text-slate-400 block font-normal">Composition / Form:</span>
                    <span className="text-slate-800 bg-emerald-50 px-1.5 py-0.2 rounded font-mono text-[11px]">{inspectedProduct.composition || "Native Single Extraction formula"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-normal">Approved Target Crop Sowing:</span>
                    <span className="text-slate-800">{inspectedProduct.cropCompatibility || "All general crops and vegetables"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-normal font-sans">Dosage Guidance:</span>
                    <span className="text-slate-800 text-indigo-900 bg-indigo-50/50 px-1.5 py-0.2 rounded inline-block">{inspectedProduct.dosageInstructions || "Calibrated for crop safety standards"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-normal">Compatible Soil:</span>
                    <span className="text-slate-800">{inspectedProduct.soilCompatibility || "Fertile field loam, silt, and red/black soil blends"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-normal">Yield Output Targets:</span>
                    <span className="text-emerald-800">{inspectedProduct.expectedYieldBoost || "Boosts defensive immunity and limits pathogen loss"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-normal">Government License Registry No:</span>
                    <span className="text-slate-800 font-mono text-[10px] uppercase">{inspectedProduct.govtLicense || "Verified local vendor registry"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-normal">Mfg & Expiration Dates:</span>
                    <span className="text-slate-800 font-mono text-[10px]">
                      MFG: {inspectedProduct.mfgDate || "Fresh Lot"} • EXP: {inspectedProduct.expiryDate || "Shelf Safe"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Safety Precautions overlay */}
              <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl space-y-1.5 text-[11px]">
                <strong className="text-rose-900 font-black block uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-rose-600" /> Crucial Agricultural Safety Protocols:
                </strong>
                <p className="text-rose-950 leading-relaxed">
                  {inspectedProduct.safetyPrecautions || "Treated chemical product. Keep out of reach of children and dairy animals. Wear facial shields, non-porous chemical-resistant gloves, and safety boots. Flush eyes and wash thoroughly with clean water immediately in case of contact."}
                </p>
              </div>

              {/* Inside dialog direct booking form */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mt-4 space-y-3">
                <span className="block font-bold text-slate-800 text-xs">🌾 Secure Direct Booking Form</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">Buy Units (qty)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={inspectedProduct.stockCount}
                      value={qty}
                      onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">Total Pricing</label>
                    <div className="p-2.5 bg-white border border-slate-200 rounded-xl font-mono font-black text-slate-800 text-sm">
                      ₹{(qty * inspectedProduct.price).toLocaleString()} + ₹40 Cart Fee
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-500 font-bold mb-1">Village Delivery Address</label>
                  <input
                    type="text"
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Panel Actions */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-between gap-3 text-xs leading-relaxed rounded-b-3xl">
              <button
                onClick={() => setInspectedProduct(null)}
                className="px-5 py-2.5 border border-slate-200 hover:border-slate-350 rounded-xl text-slate-600 font-bold"
              >
                Go Back
              </button>
              
              <button
                onClick={() => handlePlaceOrderWithDetails(inspectedProduct.id, qty, deliveryAddress)}
                className="px-6 py-2.5 bg-emerald-850 hover:bg-emerald-900 text-white rounded-xl font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" /> Book Farmer Invoice Order
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Invoices & Placed Orders Ledger Trackers */}
      <div className="bg-white border border-slate-150 p-6 rounded-3xl shadow-3xs space-y-4">
        <div>
          <h3 className="font-extrabold text-slate-805 text-sm uppercase tracking-wider flex items-center gap-1.5 text-slate-800">
            <Truck className="w-4.5 h-4.5 text-emerald-700" />
            Placed Vouchers & Dispatch Tracking
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Real-time status of chemical and agricultural seed invoices.</p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-100">
          <table className="w-full text-left text-xs font-medium">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-widest text-[9px] font-bold">
                <th className="p-3.5">Invoice SKU ID</th>
                <th className="p-3.5">Supplies Checked out</th>
                <th className="p-3.5">Merchant Shop</th>
                <th className="p-3.5">Units</th>
                <th className="p-3.5">Total Charge</th>
                <th className="p-3.5 text-center">Logistics Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {farmerOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-slate-400 italic">No bookings placed under this account context. Choose a supply card above and place active vouchers.</td>
                </tr>
              ) : (
                farmerOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/50 text-slate-800 font-semibold">
                    <td className="p-3.5 font-mono text-[10px] text-slate-500">{o.id}</td>
                    <td className="p-3.5 text-slate-900 font-bold">{o.productName}</td>
                    <td className="p-3.5 text-slate-600">{o.shopName}</td>
                    <td className="p-3.5 font-mono">{o.quantity} bags/pacs</td>
                    <td className="p-3.5 font-mono font-black text-emerald-800">₹{o.totalPrice}</td>
                    <td className="p-3.5 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold inline-block border ${
                        o.status === "Delivered" 
                          ? "bg-emerald-50 text-emerald-800 border-emerald-100/50" 
                          : o.status === "Shipped" 
                            ? "bg-blue-50 text-blue-800 border-blue-105" 
                            : "bg-amber-50 text-amber-805 border-amber-105"
                      }`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};


// --- PAGE 11: PROFILE ---
export const ProfilePage: React.FC = () => {
  const { currentUser, updateFarmerProfile, t } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser.farmerProfile?.name || "",
    mobileNumber: currentUser.farmerProfile?.mobileNumber || "",
    village: currentUser.farmerProfile?.village || "",
    district: currentUser.farmerProfile?.district || "",
    state: currentUser.farmerProfile?.state || "",
    fullAddress: currentUser.farmerProfile?.fullAddress || "",
    farmSize: currentUser.farmerProfile?.farmSize || 0,
    cropsGrown: currentUser.farmerProfile?.cropsGrown || "",
    experience: currentUser.farmerProfile?.experience || 0,
    profilePicture: currentUser.farmerProfile?.profilePicture || "",
    aadhaarDoc: currentUser.farmerProfile?.aadhaarDoc || "",
  });

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const aadhaarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentUser.farmerProfile) {
      setFormData({
        name: currentUser.farmerProfile.name || "",
        mobileNumber: currentUser.farmerProfile.mobileNumber || "",
        village: currentUser.farmerProfile.village || "",
        district: currentUser.farmerProfile.district || "",
        state: currentUser.farmerProfile.state || "",
        fullAddress: currentUser.farmerProfile.fullAddress || "",
        farmSize: currentUser.farmerProfile.farmSize || 0,
        cropsGrown: currentUser.farmerProfile.cropsGrown || "",
        experience: currentUser.farmerProfile.experience || 0,
        profilePicture: currentUser.farmerProfile.profilePicture || "",
        aadhaarDoc: currentUser.farmerProfile.aadhaarDoc || "",
      });
    }
  }, [currentUser]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isAadhaar = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast(t("file_too_large") || "File is too large! Max limit is 2MB.", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (isAadhaar) {
        setFormData(prev => ({ ...prev, aadhaarDoc: base64 }));
        showToast(t("aadhaar_success") || "Identity Aadhaar document loaded successfully!", "success");
      } else {
        setFormData(prev => ({ ...prev, profilePicture: base64 }));
        showToast(t("avatar_success") || "Profile photo loaded successfully!", "success");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      showToast(t("name_required") || "Full Name is required!", "error");
      return;
    }
    updateFarmerProfile(formData);
    setIsEditing(false);
    showToast(t("profile_saved") || "Farmer Profile saved and synchronized!", "success");
  };

  // Calculate profile completion metric
  const fieldsToCheck = [
    formData.name,
    formData.mobileNumber,
    formData.village,
    formData.district,
    formData.state,
    formData.fullAddress,
    formData.farmSize > 0 ? "size" : "",
    formData.cropsGrown,
    formData.profilePicture,
  ];
  const filledFieldsCount = fieldsToCheck.filter(Boolean).length;
  const completionPercentage = Math.round((filledFieldsCount / fieldsToCheck.length) * 100);

  return (
    <div className="space-y-6 relative pb-12">
      {/* Dynamic Toast feedback banner */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-55 flex items-center gap-2 px-5 py-3.5 rounded-2xl text-xs font-bold text-white shadow-lg animate-bounce ${
          toast.type === "success" ? "bg-emerald-600 border border-emerald-500" : "bg-red-500 border border-red-400"
        }`}>
          <span>{toast.type === "success" ? "✓" : "⚠"}</span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* ELITE COVER & PROFILE FRAME */}
      <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
        {/* Scenic field cover banner */}
        <div className="h-40 sm:h-48 w-full relative bg-emerald-900">
          <img 
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200" 
            className="w-full h-full object-cover opacity-80"
            alt="Field Cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Profile details overlap row */}
        <div className="px-6 pb-6 pt-0 relative flex flex-col md:flex-row items-center md:items-end justify-between gap-6 mt-4">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left w-full">
            <div className="relative group cursor-pointer -mt-16 md:-mt-20 z-10 flex-shrink-0" onClick={() => fileInputRef.current?.click()}>
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white shadow-xl bg-slate-50 overflow-hidden relative">
                <ImageWithFallback
                  src={formData.profilePicture}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  alt="Avatar"
                  fallbackType="avatar"
                />
                <div className="absolute inset-0 bg-black/50 text-white text-[9px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-bold uppercase tracking-wider text-center p-2">
                  Change Photo
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                accept="image/*" 
                onChange={(e) => handleFileChange(e, false)} 
                className="hidden" 
              />
            </div>

            <div className="md:pb-1 flex-grow">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-none">
                  {formData.name || t("name_placeholder") || "Farming Partner"}
                </h3>
                <span className="text-[9px] md:text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-500/10 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Verified Agronomist
                </span>
              </div>
              <p className="text-xs text-slate-500 font-semibold mt-1.5 md:mt-1">
                Platform License ID: <code className="font-mono text-emerald-750 bg-emerald-50 px-1 py-0.5 rounded font-black">AGR-2026-9452</code>
              </p>
              
              {/* Regional subtitle summary */}
              <p className="text-[10px] md:text-xs text-slate-500 mt-2 font-bold uppercase tracking-wide flex items-center justify-center md:justify-start gap-1">
                <span>📍</span> {formData.village || "No Village Specified"}, {formData.district || "No District"}, {formData.state || "No State"}
              </p>
            </div>
          </div>

          <div className="md:pb-1 w-full md:w-auto flex-shrink-0">
            <button
              type="button"
              onClick={() => {
                if (isEditing) {
                  handleSave();
                } else {
                  setIsEditing(true);
                }
              }}
              className={`w-full md:w-auto text-white font-extrabold text-[10px] uppercase tracking-widest py-3 px-5 rounded-xl cursor-pointer transition shadow-3xs hover:opacity-90 min-h-[44px] ${
                isEditing ? "bg-emerald-600 hover:bg-emerald-700" : "bg-slate-900"
              }`}
            >
              {isEditing ? `✓ ${t("save_profile") || "Save Profile Specs"}` : `⚡ ${t("edit_profile") || "Edit Farm Profile"}`}
            </button>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="px-6 pb-6 pt-4 border-t border-slate-50 bg-slate-50/40">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs text-slate-500 font-semibold">
            <div className="space-y-1">
              <span className="text-[10px] uppercase text-slate-400 block tracking-wider font-bold">Settlement Hub</span>
              <strong className="text-slate-800 block text-xs font-black truncate">{formData.village || "Not Specified"}</strong>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase text-slate-400 block tracking-wider font-bold">District / State</span>
              <strong className="text-slate-855 block text-xs font-black truncate">{formData.district ? `${formData.district}, ${formData.state}` : formData.state || "Not Specified"}</strong>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase text-slate-400 block tracking-wider font-bold">Cultivation Size</span>
              <strong className="text-slate-900 block text-xs font-black">{formData.farmSize || "0"} Net Acres</strong>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase text-slate-400 block tracking-wider font-bold">Standard Crop Mix</span>
              <strong className="text-slate-905 block text-xs font-black truncate">{formData.cropsGrown || "Not Specified"}</strong>
            </div>

            <div className="space-y-1 col-span-2 md:col-span-1">
              <span className="text-[10px] uppercase text-slate-400 block tracking-wider font-bold">Experience Handled</span>
              <strong className="text-emerald-755 text-emerald-700 block text-xs font-black">{formData.experience || "0"} Years Active</strong>
            </div>
          </div>
        </div>
      </div>

      {/* THREE-COLUMN GRID DETAIL CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Profile Completion Indicator & Documents Block (lg:col-span-4) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Completion Card */}
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-4">
            <h4 className="font-extrabold text-slate-900 text-sm">{t("profile_completion") || "Profile Completion Status"}</h4>
            
            <div className="flex items-center gap-4.5 bg-emerald-50/20 border border-emerald-500/10 p-4 rounded-2xl">
              {/* Radial Score Circle */}
              <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="32" cy="32" r="28" className="stroke-slate-100 fill-none" strokeWidth="6" />
                  <circle cx="32" cy="32" r="28" className="stroke-emerald-600 fill-none transition-all duration-500" strokeWidth="6"
                    strokeDasharray={`${2 * Math.PI * 28}`}
                    strokeDashoffset={`${2 * Math.PI * 28 * (1 - completionPercentage / 100)}`}
                  />
                </svg>
                <span className="absolute text-xs font-black text-emerald-850 font-mono">{completionPercentage}%</span>
              </div>
              <div>
                <strong className="text-xs font-black text-slate-900 block">
                  {completionPercentage === 100 ? "100% Sown & Harvested! Check Approved" : "Complete Profile Fields"}
                </strong>
                <span className="text-[10px] text-slate-400 font-medium block mt-1 leading-snug">
                  Fill up identity paperwork and crop details for agro-merchant credibility.
                </span>
              </div>
            </div>
          </div>

          {/* Identity Document Verification Card */}
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-extrabold text-slate-900 text-sm">{t("identity_verification") || "Government Identity Verification"}</h4>
              <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                formData.aadhaarDoc ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
              }`}>
                {formData.aadhaarDoc ? "Uploaded" : "Pending"}
              </span>
            </div>
            
            <p className="text-slate-450 text-[10px] leading-relaxed">
              Upload your National Identity Smartcard (Aadhaar or local crop certificate) to apply for jobs and unlock wholesale order credits.
            </p>

            <div 
              onClick={() => aadhaarInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 hover:border-emerald-500 bg-slate-50/50 hover:bg-emerald-50/10 p-4.5 rounded-2xl text-center cursor-pointer transition duration-150 space-y-2 flex flex-col items-center justify-center"
            >
              <input 
                type="file" 
                ref={aadhaarInputRef} 
                accept="image/*,application/pdf" 
                onChange={(e) => handleFileChange(e, true)} 
                className="hidden" 
              />
              
              {formData.aadhaarDoc ? (
                <div className="space-y-1.5 w-full">
                  <ImageWithFallback 
                    src={formData.aadhaarDoc} 
                    className="w-full h-24 rounded-lg object-contain bg-white border border-slate-100" 
                    alt="Aadhaar Document Preview"
                    fallbackType="document"
                  />
                  <span className="text-[9px] text-emerald-700 font-semibold block uppercase">✓ Aadhaar Card Loaded</span>
                </div>
              ) : (
                <>
                  <span className="text-xl">🪪</span>
                  <div>
                    <strong className="text-[10px] text-slate-700 block font-bold">Select Identity Smartcard</strong>
                    <span className="text-[9px] text-slate-400 font-medium block mt-0.5">Drag PDF/JPG here or Click to select (max 2MB)</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Profile Specifications Form (lg:col-span-8) */}
        <div className="lg:col-span-8 bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-50">
            <h4 className="font-extrabold text-slate-900 text-sm">🌾 {t("profile_detail_specs") || "Agronomic Profile Specifications"}</h4>
            {isEditing && (
              <button 
                type="button"
                onClick={() => setIsEditing(false)} 
                className="text-[9px] bg-slate-100 hover:bg-slate-200 text-slate-600 font-black px-2.5 py-1 rounded-lg uppercase"
              >
                Cancel ✕
              </button>
            )}
          </div>

          {isEditing ? (
            /* Editing State Form Layout */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-705">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block">Full Name *</label>
                <input 
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter full name"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500 text-slate-800 font-bold text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block">Mobile Number</label>
                <input 
                  type="text"
                  maxLength={10}
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, mobileNumber: e.target.value.replace(/\D/g, "") }))}
                  placeholder="Enter 10-digit mobile"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500 text-slate-800 font-bold text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block">Village / Settlement</label>
                <input 
                  type="text"
                  value={formData.village}
                  onChange={(e) => setFormData(prev => ({ ...prev, village: e.target.value }))}
                  placeholder="Specify local Village"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500 text-slate-800 font-bold text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block">District / Division</label>
                <input 
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}
                  placeholder="Specify District"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500 text-slate-800 font-bold text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block">State</label>
                <input 
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                  placeholder="Specify State"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500 text-slate-800 font-bold text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block">Farm Cultivation Size (Net Acres)</label>
                <input 
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.farmSize || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, farmSize: Number(e.target.value) }))}
                  placeholder="e.g. 5.5"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500 text-slate-800 font-bold text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block">Farming Experience (Years)</label>
                <input 
                  type="number"
                  min="0"
                  value={formData.experience || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, experience: Number(e.target.value) }))}
                  placeholder="e.g. 10"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500 text-slate-800 font-bold text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block">Main Crop Seeding Mixes</label>
                <input 
                  type="text"
                  value={formData.cropsGrown}
                  onChange={(e) => setFormData(prev => ({ ...prev, cropsGrown: e.target.value }))}
                  placeholder="e.g. Paddy, Wheat, Sugarcane"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500 text-slate-800 font-bold text-xs"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block">Full Physical Address</label>
                <textarea 
                  rows={2}
                  value={formData.fullAddress}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullAddress: e.target.value }))}
                  placeholder="Describe complete home and plot geography address"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500 text-slate-800 font-semibold text-xs resize-none"
                />
              </div>

              <div className="sm:col-span-2 pt-2">
                <button
                  type="button"
                  onClick={handleSave}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] uppercase tracking-widest py-3 rounded-xl transition cursor-pointer shadow-3xs"
                >
                  Publish and Save Specifications ⚡
                </button>
              </div>
            </div>
          ) : (
            /* Normal Static Display Grid Layout */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/50 space-y-1 flex flex-col justify-center">
                <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 block font-bold">Registration Name</span>
                <strong className="text-slate-800 font-bold text-xs">{formData.name || "Rajesh Kumar (Farmer)"}</strong>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/50 space-y-1 flex flex-col justify-center">
                <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 block font-bold">Primary Mobile contact</span>
                <strong className="text-slate-800 font-bold text-xs font-mono">{formData.mobileNumber ? `+91 ${formData.mobileNumber}` : "+91 94522 10834"}</strong>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/50 space-y-1 flex flex-col justify-center">
                <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 block font-bold">Farming Geography</span>
                <strong className="text-slate-800 font-bold text-xs">
                  {formData.village || "Kanakpur Village"}, {formData.district || "Bijnor"}, {formData.state || "Uttar Pradesh"}
                </strong>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/50 space-y-1 flex flex-col justify-center">
                <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 block font-bold">Sowing Crop Varieties</span>
                <strong className="text-emerald-750 font-bold text-xs">{formData.cropsGrown || "Paddy, HD-2967 Wheat, Sugarcane"}</strong>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/50 space-y-1 flex flex-col justify-center">
                <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 block font-bold">Cultivated Size Bounds</span>
                <strong className="text-slate-800 font-bold text-xs">{formData.farmSize || 8.5} Net Cultivation Acres</strong>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/50 space-y-1 flex flex-col justify-center">
                <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 block font-bold font-mono">Platform Tenure active</span>
                <strong className="text-slate-800 font-bold text-xs">{formData.experience || 12} Seasons Active</strong>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/50 space-y-1 sm:col-span-2 flex flex-col justify-center">
                <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 block font-bold">Plots Registered Address</span>
                <p className="text-slate-700 font-semibold text-xs leading-relaxed">
                  {formData.fullAddress || "Plot No 425 & 428, Kanakpur Agricultural Block, Bijnor Tehsil, Bijnor District, Uttar Pradesh, 246701."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
