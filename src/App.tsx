import React, { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { WelcomeScreen } from "./components/WelcomeScreen";

// Page component imports
import {
  FarmerOverview,
  WeatherPage,
  DiseaseDetectionPage,
  MedicineRecommendationsPage,
  CropPricesPage,
  CommunityPage,
  MessagesPage,
  CropDiaryPage,
  YieldPredictionPage,
  OrdersPage,
  ProfilePage as FarmerProfilePage
} from "./components/FarmerPages";

import {
  ShopOverview,
  ShopProductsCatalog,
  ShopOrdersManager,
  ShopCustomersPage,
  ShopAnalytics,
  ShopProfilePage
} from "./components/ShopPages";

import {
  WorkerOverview,
  JobsBoardPage,
  ApplicationsPage,
  WorkerProfilePage
} from "./components/WorkerPages";

import { AdminPanel } from "./components/AdminPanel";
import { VoiceAssistant } from "./components/VoiceAssistant";

// Lucide icons for the Sidebar Navigation shell
import { 
  Sprout, LayoutDashboard, CloudSun, ShieldCheck, Activity, DollarSign, 
  TrendingUp, Users, MessageSquare, BookOpen, ShoppingBag, Settings, 
  Briefcase, ClipboardList, LogOut, Menu, X, HelpCircle, User, Box, Sparkles,
  ShieldAlert
} from "lucide-react";

function MainAppContent() {
  const { currentUser, setCurrentUserById, language, setLanguage, theme, setTheme, t, isAuthenticated, setIsAuthenticated } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Active page state per role
  const [farmerActiveTab, setFarmerActiveTab] = useState<
    "dashboard" | "weather" | "ai-disease" | "medicine" | "prices" | "community" | "messages" | "diary" | "yield" | "orders" | "profile" | "settings"
  >("dashboard");

  const [shopActiveTab, setShopActiveTab] = useState<
    "dashboard" | "inventory" | "orders" | "customers" | "analytics" | "messages" | "profile"
  >("dashboard");

  const [workerActiveTab, setWorkerActiveTab] = useState<
    "dashboard" | "jobs" | "applications" | "messages" | "profile"
  >("dashboard");

  const [superAdminActiveTab, setSuperAdminActiveTab] = useState<
    "admin-dashboard" | "platforms" | "moderation" | "analytics"
  >("admin-dashboard");

  if (!isAuthenticated) {
    return <WelcomeScreen onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  // Define sidebar items based on roles
  const getSidebarConfig = () => {
    switch (currentUser.role) {
      case "Farmer":
        return [
          { id: "dashboard", label: t("tab_dashboard"), icon: <LayoutDashboard className="w-4.5 h-4.5" /> },
          { id: "weather", label: t("tab_weather"), icon: <CloudSun className="w-4.5 h-4.5" /> },
          { id: "ai-disease", label: t("tab_disease"), icon: <ShieldCheck className="w-4.5 h-4.5" /> },
          { id: "medicine", label: t("tab_medicine"), icon: <Activity className="w-4.5 h-4.5" /> },
          { id: "prices", label: t("tab_prices"), icon: <DollarSign className="w-4.5 h-4.5" /> },
          { id: "community", label: t("tab_community"), icon: <Users className="w-4.5 h-4.5" /> },
          { id: "messages", label: t("tab_messages"), icon: <MessageSquare className="w-4.5 h-4.5" /> },
          { id: "diary", label: t("tab_diary"), icon: <BookOpen className="w-4.5 h-4.5" /> },
          { id: "yield", label: t("tab_yield"), icon: <TrendingUp className="w-4.5 h-4.5" /> },
          { id: "orders", label: t("tab_orders"), icon: <ShoppingBag className="w-4.5 h-4.5" /> },
          { id: "profile", label: t("tab_profile"), icon: <User className="w-4.5 h-4.5" /> },
          { id: "settings", label: t("tab_settings"), icon: <Settings className="w-4.5 h-4.5" /> }
        ];
      case "ShopOwner":
        return [
          { id: "dashboard", label: t("tab_dashboard"), icon: <LayoutDashboard className="w-4.5 h-4.5" /> },
          { id: "inventory", label: t("tab_inventory"), icon: <Box className="w-4.5 h-4.5" /> },
          { id: "orders", label: t("tab_orders_mgr"), icon: <ShoppingBag className="w-4.5 h-4.5" /> },
          { id: "customers", label: t("tab_customers"), icon: <Users className="w-4.5 h-4.5" /> },
          { id: "analytics", label: t("tab_analytics"), icon: <TrendingUp className="w-4.5 h-4.5" /> },
          { id: "messages", label: t("tab_messages"), icon: <MessageSquare className="w-4.5 h-4.5" /> },
          { id: "profile", label: t("tab_profile"), icon: <User className="w-4.5 h-4.5" /> }
        ];
      case "Worker":
        return [
          { id: "dashboard", label: t("tab_dashboard"), icon: <LayoutDashboard className="w-4.5 h-4.5" /> },
          { id: "jobs", label: t("tab_jobs"), icon: <Briefcase className="w-4.5 h-4.5" /> },
          { id: "applications", label: t("tab_applications"), icon: <ClipboardList className="w-4.5 h-4.5" /> },
          { id: "messages", label: t("tab_messages"), icon: <MessageSquare className="w-4.5 h-4.5" /> },
          { id: "profile", label: t("tab_profile"), icon: <User className="w-4.5 h-4.5" /> }
        ];
      case "SuperAdmin":
        return [
          { id: "admin-dashboard", label: "Admin Dashboard", icon: <LayoutDashboard className="w-4.5 h-4.5 text-indigo-400" /> },
          { id: "platforms", label: "Platform Settings", icon: <Settings className="w-4.5 h-4.5 text-emerald-400" /> },
          { id: "moderation", label: "Moderation Features", icon: <ShieldAlert className="w-4.5 h-4.5 text-red-500" /> },
          { id: "analytics", label: "Analytics & Reports", icon: <TrendingUp className="w-4.5 h-4.5 text-amber-500" /> }
        ];
      default:
        return [];
    }
  };

  const activeTab = currentUser.role === "Farmer" ? farmerActiveTab : currentUser.role === "ShopOwner" ? shopActiveTab : currentUser.role === "Worker" ? workerActiveTab : superAdminActiveTab;
  const setActiveTab = (tab: any) => {
    if (currentUser.role === "Farmer") setFarmerActiveTab(tab);
    else if (currentUser.role === "ShopOwner") setShopActiveTab(tab);
    else if (currentUser.role === "Worker") setWorkerActiveTab(tab);
    else if (currentUser.role === "SuperAdmin") setSuperAdminActiveTab(tab);
    setMobileMenuOpen(false);
  };

  // Render the selected dedicated subpage component
  const renderActivePageContent = () => {
    // Role-Based Access Control Guard
    const isAdminTab = activeTab === "sandbox" || activeTab === "admin-dashboard" || activeTab === "platforms" || activeTab === "moderation" || activeTab === "analytics";
    if (isAdminTab && currentUser.role !== "SuperAdmin") {
      return (
        <div className="bg-white border border-red-200 text-slate-800 p-8 rounded-3xl shadow-lg max-w-md mx-auto my-12 text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black uppercase text-red-700">🔒 Access Denied</h3>
          <p className="text-xs font-semibold text-slate-500">You do not have administrative credentials to view the Sandbox Central Controller.</p>
          <button 
            onClick={() => {
              if (currentUser.role === "Farmer") setFarmerActiveTab("dashboard");
              else if (currentUser.role === "ShopOwner") setShopActiveTab("dashboard");
              else if (currentUser.role === "Worker") setWorkerActiveTab("dashboard");
            }} 
            className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Return to Dashboard
          </button>
        </div>
      );
    }

    if (currentUser.role === "Farmer") {
      switch (farmerActiveTab) {
        case "dashboard":
          return <FarmerOverview onViewTab={(t) => setFarmerActiveTab(t)} />;
        case "weather":
          return <WeatherPage />;
        case "ai-disease":
          return <DiseaseDetectionPage />;
        case "medicine":
          return <MedicineRecommendationsPage />;
        case "prices":
          return <CropPricesPage />;
        case "community":
          return <CommunityPage />;
        case "messages":
          return <MessagesPage />;
        case "diary":
          return <CropDiaryPage />;
        case "yield":
          return <YieldPredictionPage />;
        case "orders":
          return <OrdersPage />;
        case "profile":
          return <FarmerProfilePage />;
        case "settings":
          return <FarmerProfilePage />; // reuse profile for user context settings
        default:
          return <FarmerOverview onViewTab={(t) => setFarmerActiveTab(t)} />;
      }
    } else if (currentUser.role === "ShopOwner") {
      switch (shopActiveTab) {
        case "dashboard":
          return <ShopOverview onViewTab={(t) => setShopActiveTab(t)} />;
        case "inventory":
          return <ShopProductsCatalog />;
        case "orders":
          return <ShopOrdersManager />;
        case "customers":
          return <ShopCustomersPage />;
        case "analytics":
          return <ShopAnalytics />;
        case "messages":
          return <MessagesPage />; // Shared messages layout
        case "profile":
          return <ShopProfilePage />;
        default:
          return <ShopOverview onViewTab={(t) => setShopActiveTab(t)} />;
      }
    } else if (currentUser.role === "Worker") {
      switch (workerActiveTab) {
        case "dashboard":
          return <WorkerOverview onViewTab={(t) => setWorkerActiveTab(t)} />;
        case "jobs":
          return <JobsBoardPage />;
        case "applications":
          return <ApplicationsPage />;
        case "messages":
          return <MessagesPage />; // Shared messages layout
        case "profile":
          return <WorkerProfilePage />;
        default:
          return <WorkerOverview onViewTab={(t) => setWorkerActiveTab(t)} />;
      }
    } else if (currentUser.role === "SuperAdmin") {
      switch (superAdminActiveTab) {
        case "admin-dashboard":
          return <AdminPanel />;
        case "platforms":
          return (
            <div className="bg-white p-6 border border-slate-150 rounded-3xl shadow-3xs space-y-4">
              <h3 className="text-lg font-black text-slate-900 border-b pb-2">⚙️ Agrivon Platform Configuration</h3>
              <p className="text-xs text-slate-500 font-medium">Configure network node endpoints, global backup registries, and general transaction fee percentages.</p>
              <div className="p-4 bg-slate-50 rounded-xl space-y-2 text-xs font-semibold">
                <div>Nodes: <span className="bg-slate-200 px-1 py-0.5 rounded text-indigo-800 font-mono">cluster-delhi-0</span></div>
                <div>Fee Split: <span className="text-slate-800">1.2% Escrow Fee</span></div>
                <div>Backup Registry: <span className="text-emerald-700">Encrypted LocalStorage DB</span></div>
              </div>
            </div>
          );
        case "moderation":
          return (
            <div className="bg-white p-6 border border-slate-150 rounded-3xl shadow-3xs space-y-4">
              <h3 className="text-lg font-black text-rose-800 border-b pb-2">🛡️ Moderation Operations</h3>
              <p className="text-xs text-slate-500 font-medium">Monitor community chat reports, active transaction disputes, and flagged documents.</p>
              <div className="p-4 bg-red-50 text-red-900 rounded-xl text-xs font-bold">
                ● 0 Active Flagged Incidents in Kanakpur cluster. Safe and sound.
              </div>
            </div>
          );
        case "analytics":
          return (
            <div className="bg-white p-6 border border-slate-150 rounded-3xl shadow-3xs space-y-4">
              <h3 className="text-lg font-black text-slate-900 border-b pb-2">📊 Analytics & Regional Metrics</h3>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Metrics Snapshot</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-950 font-bold text-xs">
                  <span>Gross Sown Value (GSV)</span>
                  <div className="text-xl font-black mt-1">₹4,85,200</div>
                </div>
                <div className="p-4 bg-amber-50 rounded-2xl text-amber-950 font-bold text-xs">
                  <span>Active Jobs Sourced</span>
                  <div className="text-xl font-black mt-1">12 Open Contracts</div>
                </div>
              </div>
            </div>
          );
        default:
          return <AdminPanel />;
      }
    }
    return <div className="p-8 text-center bg-white rounded-2xl">{t("page_not_found") || "Page Not Found"}</div>;
  };

  const activePageLabel = getSidebarConfig().find((n) => n.id === activeTab)?.label || "Workspace";
  const userRoleText = currentUser.role === "Farmer" ? t("role_farmer") : currentUser.role === "ShopOwner" ? t("role_shopowner") : currentUser.role === "Worker" ? t("role_worker") : "Super Admin";
  const profileName = currentUser.role === "Farmer" ? currentUser.farmerProfile?.name : currentUser.role === "ShopOwner" ? currentUser.shopOwnerProfile?.shopName : currentUser.role === "Worker" ? currentUser.workerProfile?.name : "Super Administrator";

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      theme === "green" 
        ? "theme-green bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100/80 text-emerald-950 selection:bg-emerald-600 selection:text-white" 
        : "bg-slate-100 text-slate-900 selection:bg-emerald-600 selection:text-white"
    }`}>
      
      <div className="flex-grow flex relative">
        
        {/* ==========================================
            DESKTOP SIDEBAR NAVIGATION (250px Width)
            ========================================== */}
        <aside className={`hidden lg:flex flex-col w-64 flex-shrink-0 relative z-30 justify-between transition-colors duration-300 ${
          theme === "green" 
            ? "bg-white border-r border-emerald-500/10 text-slate-850" 
            : "bg-slate-900 text-slate-300 border-r border-slate-950"
        }`}>
          <div className="space-y-6">
            
            {/* Logo Brand Title */}
            <div className={`p-5 border-b flex items-center gap-2.5 ${theme === "green" ? "border-emerald-500/10" : "border-slate-950/35"}`}>
              <div className={`p-2 rounded-xl border ${theme === "green" ? "bg-emerald-50 border-emerald-500/20 text-emerald-800" : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"}`}>
                <Sprout className="w-5 h-5" />
              </div>
              <div>
                <strong className={`text-base font-extrabold tracking-tight block leading-none ${theme === "green" ? "text-emerald-800" : "text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300"}`}>
                  Agrivon
                </strong>
                <span className={`text-[10px] font-semibold tracking-wider font-mono uppercase ${theme === "green" ? "text-neutral-500" : "text-emerald-400/85"}`}>{t("app_subtitle")}</span>
              </div>
            </div>

            {/* Sidebar nav items checklist */}
            <nav className="px-3.5 space-y-1">
              {getSidebarConfig().map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-lg transition cursor-pointer text-left ${
                    activeTab === item.id
                      ? "bg-emerald-700 text-white shadow-sm"
                      : theme === "green"
                        ? "text-slate-600 hover:bg-emerald-50 hover:text-emerald-800"
                        : "hover:bg-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <span className={`${activeTab === item.id ? "text-white" : "text-emerald-600"}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

          </div>

          {/* Sidebar Active User profile Footer card info */}
          <div className={`p-4 border-t space-y-3 ${theme === "green" ? "border-emerald-700/10 bg-slate-50/50" : "border-emerald-955 bg-black/30"}`}>
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2.5 w-full text-left p-1.5 rounded-xl transition duration-150 cursor-pointer ${
                theme === "green" 
                  ? "hover:bg-emerald-600/5 active:bg-emerald-600/10" 
                  : "hover:bg-white/5 active:bg-white/10"
              }`}
              title={t("view_profile") || "View Profile Specifications"}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs select-none ${theme === "green" ? "bg-emerald-50 text-emerald-700 border border-emerald-500/20" : "bg-emerald-500/10 text-emerald-400"}`}>
                {profileName?.charAt(0)}
              </div>
              <div className="max-w-[150px] overflow-hidden flex-grow text-left">
                <span className={`block font-bold text-xs truncate leading-tight ${theme === "green" ? "text-neutral-805 text-neutral-800" : "text-white"}`}>{profileName}</span>
                <span className={`text-[9px] font-bold block ${theme === "green" ? "text-neutral-500" : "text-slate-400"}`}>{userRoleText}</span>
              </div>
            </button>

            <button
              onClick={() => setIsAuthenticated(false)}
              className={`w-full flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] uppercase font-bold cursor-pointer transition text-center ${
                theme === "green"
                  ? "bg-emerald-50 hover:bg-emerald-100/80 text-emerald-700 border border-emerald-500/20"
                  : "bg-slate-800 hover:bg-slate-800 text-slate-300 py-1.5 hover:text-white border border-slate-700/65"
              }`}
            >
              <LogOut className="w-3.5 h-3.5" /> {t("exit_gate")}
            </button>
          </div>

        </aside>

        {/* ==========================================
            MOBILE DRAWER EMBED OVERLAY
            ========================================== */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 bg-slate-900/80 z-50 backdrop-blur-xs transition-opacity duration-200" onClick={() => setMobileMenuOpen(false)}>
            <div className="w-64 bg-slate-900 border-r border-slate-950 text-slate-200 h-full p-5 space-y-6 flex flex-col justify-between" onClick={(e) => e.stopPropagation()}>
              <div className="space-y-6">
                
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">{t("app_title")} Menu</span>
                  <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-white cursor-pointer select-none border border-slate-800 p-1.5 rounded-lg">
                    <X className="w-4 h-4 text-slate-300" />
                  </button>
                </div>

                <nav className="space-y-1.5">
                  {getSidebarConfig().map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-3.5 py-3 text-xs font-bold rounded-xl transition cursor-pointer text-left ${
                        activeTab === item.id
                          ? "bg-emerald-700 text-white shadow-md"
                          : "hover:bg-slate-800 text-slate-400 hover:text-slate-250"
                      }`}
                    >
                      <span className={`${activeTab === item.id ? "text-white" : "text-emerald-500"}`}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              <button
                onClick={() => setIsAuthenticated(false)}
                className="w-full bg-slate-800 border border-slate-750 hover:bg-slate-700 py-3.5 rounded-xl text-[10px] text-slate-350 hover:text-white text-center font-black font-mono tracking-widest uppercase cursor-pointer transition"
              >
                {t("exit_gate")}
              </button>
            </div>
          </div>
        )}

        {/* ==========================================
            RIGHT MAIN WINDOW VIEWPORT GRID FRAME
            ========================================== */}
        <section className="flex-grow flex flex-col overflow-hidden">
          
          {/* Main workspace Header */}
          <header className={`py-3.5 px-6 flex flex-col md:flex-row gap-4 md:items-center justify-between z-10 shadow-xs transition-colors duration-300 ${
            theme === "green" 
              ? "bg-white/80 border-b-2 border-emerald-500/40 text-emerald-950 backdrop-blur-md" 
              : "bg-white border-b border-slate-150 text-slate-900"
          }`}>
            <div className="flex items-center gap-3">
              {/* Hamburger Toggle button on mobile */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 border border-slate-205 cursor-pointer text-slate-600"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div>
                <h1 className="text-sm font-black uppercase tracking-wider">{activePageLabel}</h1>
                <p className="text-[10px] text-slate-400 font-extrabold tracking-wide uppercase leading-none mt-0.5">{userRoleText} {t("active_namespace")}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              
              {/* LANGUAGE SWITCHER WIDGET CONVERTER */}
              <div className="flex bg-slate-900/40 border border-emerald-900/30 rounded-xl p-0.5 select-none shadow-xs">
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                    language === "en" ? "bg-emerald-600 text-white shadow-2xs" : "text-emerald-300 hover:text-white"
                  }`}
                  title="Switch to English"
                >
                  🇬🇧 ENG
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("hi")}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                    language === "hi" ? "bg-emerald-600 text-white shadow-2xs" : "text-emerald-300 hover:text-white"
                  }`}
                  title="Switch to Hindi (हिन्दी)"
                >
                  🇮🇳 हिन्दी
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("hinglish")}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                    language === "hinglish" ? "bg-emerald-600 text-white shadow-2xs" : "text-emerald-300 hover:text-white"
                  }`}
                  title="Switch to Hinglish (Conversational)"
                >
                  🌾 Hinglish
                </button>
              </div>

              {/* INTEGRATED THEME CONFIGURATION OVERLORD BUTTON */}
              <button
                type="button"
                onClick={() => setTheme(theme === "green" ? "classic" : "green")}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer shadow-xs ${
                  theme === "green"
                    ? "bg-emerald-850 hover:bg-emerald-800 border-emerald-700/60 text-emerald-300"
                    : "bg-slate-50 hover:bg-slate-100 border-slate-205 text-slate-700"
                }`}
              >
                💚 {theme === "green" ? t("green_theme") : t("classic_theme")}
              </button>

              {/* Ecology synchronization live beep */}
              <div className="hidden md:flex items-center gap-2 bg-emerald-500/5 px-3 py-1.5 rounded-xl border border-emerald-500/15">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[9px] font-bold text-emerald-400 tracking-wider font-mono">{t("ecology_sync")}</span>
              </div>
              
              <span className="text-xs font-mono font-bold text-slate-350 bg-black/20 border border-emerald-900/30 px-2.5 py-1 rounded-lg">
                Role: {currentUser.role}
              </span>
            </div>
          </header>

          {/* Active component viewport frame wrapper scroll */}
          <div className="flex-grow p-4 sm:p-6 overflow-y-auto max-w-7xl w-full mx-auto space-y-6">
            {renderActivePageContent()}
          </div>

          {/* PERSISTENT ALWAYS-READY FLOATING INTELLIGENT AI VOICE COMMAND ASSISTANT PANEL */}
          <VoiceAssistant 
            onNavigate={(tabId) => setActiveTab(tabId)} 
            availableTabs={getSidebarConfig()} 
          />

        </section>

      </div>

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
