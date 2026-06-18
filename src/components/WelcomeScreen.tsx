import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { Role } from "../types";
import { 
  Sprout, LogIn, ArrowRight, Sparkles, ShieldCheck, Cpu, 
  UserCheck, Lock, Mail, Phone, User, Eye, EyeOff, CheckCircle2, ShieldAlert
} from "lucide-react";

interface WelcomeScreenProps {
  onLoginSuccess: () => void;
}

const LOCAL_TRANSLATIONS = {
  en: {
    login_tab: "Sign In",
    register_tab: "Register Account",
    login_title: "Welcome Back",
    login_sub: "Sign in to access your dashboard, order history, disease models, and agricultural features.",
    email_or_mobile: "Email Address or Mobile Number",
    password: "Password",
    confirm_password: "Confirm Password",
    forgot_password: "Forgot Password?",
    remember_me: "Remember Me on this device",
    signin_btn: "Sign In Securely",
    register_title: "Join Agrivon Network",
    register_sub: "Create a verified profile to hire workers, manage crop sales, or find localized labor jobs.",
    full_name: "Full Name",
    mobile_number: "Mobile Phone Number",
    email_address: "Email Address",
    choose_role: "Operational User Role Selection",
    role_farmer: "Farmer Partner (कृषक)",
    role_worker: "Farm Laborer (श्रमिक)",
    role_seller: "Agro Merchant Seller (विक्रेता)",
    register_btn: "Register & Access Portal",
    footer_text: "🔒 Agrivon secure sandboxing mechanism active. All data stores securely.",
    already_member: "Already have an account? Login",
    new_here: "New to the platform? Register here",
    forgot_help_title: "Forgot Credentials Contact Info",
    forgot_help_desc: "For security compliance, automated resets are disabled. Please contact the Mandi Administrator or drop a credential query ticket to support@agrivon.com.",
    error_passwords_dont_match: "Passwords do not match! Verify passwords.",
    error_invalid_login: "Log in failed! No registered profile matches that credentials pair.",
    error_fill_all_fields: "Please fill in all mandatory inputs.",
    error_admin_role_forbidden: "Super Administrator accounts cannot be registered dynamically.",
    success_registration: "Profile registered successfully! Initiating auto-login...",
    language_label: "Translate Portal:"
  },
  hi: {
    login_tab: "लॉग इन",
    register_tab: "नया खाता बनाएं",
    login_title: "स्वागत है",
    login_sub: "अपने डैशबोर्ड, ऑर्डर इतिहास, फसल रोग मॉडल और कृषि सुविधाओं तक पहुँचने के लिए लॉगिन करें।",
    email_or_mobile: "ईमेल पता या मोबाइल नंबर",
    password: "पासवर्ड",
    confirm_password: "पासवर्ड की पुष्टि करें",
    forgot_password: "पासवर्ड भूल गए?",
    remember_me: "इस डिवाइस पर मुझे याद रखें",
    signin_btn: "सुरक्षित रूप से लॉगिन करें",
    register_title: "एग्रीवोन नेटवर्क से जुड़ें",
    register_sub: "मजदूरों को काम पर रखने, कृषि उत्पाद बेचने या काम खोजने के लिए सत्यापित प्रोफाइल बनाएं।",
    full_name: "पूरा नाम",
    mobile_number: "मोबाइल फोन नंबर",
    email_address: "ईमेल पता",
    choose_role: "आपकी परिचालन भूमिका",
    role_farmer: "किसान पार्टनर",
    role_worker: "कृषि श्रमिक / मजदूर",
    role_seller: "कृषि इनपुट विक्रेता (Seller)",
    register_btn: "खाता निर्माण पूरा करें",
    footer_text: "🔒 एग्रीवोन सुरक्षा सक्रिय है। आपका सभी डेटा सुरक्षित रूप से संग्रहीत है।",
    already_member: "पहले से खाता है? लॉगिन करें",
    new_here: "नए यूजर हैं? यहाँ रजिस्टर करें",
    forgot_help_title: "पासवर्ड रीसेट सहायता",
    forgot_help_desc: "सुरक्षा अनुपालन के लिए, पासवर्ड रीसेट करने के लिए कृपया हमारे ईमेल support@agrivon.com पर संपर्क करें या स्थानीय एग्रीवोन केंद्र पर जाएं।",
    error_passwords_dont_match: "पासवर्ड मेल नहीं खा रहे हैं! पुनः जांचें।",
    error_invalid_login: "लॉगिन विफल! प्रदान किए गए क्रेडेंशियल किसी भी खाते से मेल नहीं खाते हैं।",
    error_fill_all_fields: "कृपया सभी फ़ील्ड अवश्य भरें।",
    error_admin_role_forbidden: "सुपर एडमिन खाता केवल मुख्य कार्यालय द्वारा सेट किया जा सकता है।",
    success_registration: "खाता सफलतापूर्वक बन गया है! लॉगिन हो रहा है...",
    language_label: "भाषा चुनें:"
  },
  hinglish: {
    login_tab: "Log In",
    register_tab: "Register Account",
    login_title: "Welcome Back",
    login_sub: "Log in karke apna dashboard, disease diagnostics, aur products check karein.",
    email_or_mobile: "Email Address ya Mobile Number",
    password: "Password",
    confirm_password: "Confirm Password",
    forgot_password: "Password bhool gaye?",
    remember_me: "Mujhe yaad rakho (Remember Me)",
    signin_btn: "Secure Sign in karein",
    register_title: "Agrivon Network Join Karein",
    register_sub: "Kisan help, mandi prices, labor hiring ya shops manage karne ke liye account banayein.",
    full_name: "Aapka Full Name",
    mobile_number: "Mobile Phone Number",
    email_address: "Email Id Address",
    choose_role: "Apna Role Selection karein",
    role_farmer: "Kisan Partner (Farmer)",
    role_worker: "Khet Mazdoor (Worker)",
    role_seller: "Agro Merchant Seller (Seller)",
    register_btn: "Account Register Karein",
    footer_text: "🔒 Agrivon secure sandboxing active hai. Data safely saved rahega.",
    already_member: "Pehle se account hai? Log In karo",
    new_here: "Naya member? Account create karo",
    forgot_help_title: "Password Reset Help",
    forgot_help_desc: "Credential recover karne ke liye kripya support@agrivon.com par mail drop karein ya local admin se contact karein.",
    error_passwords_dont_match: "Passwords match nahi kare. Check again.",
    error_invalid_login: "Login failed! Galat email/mobile ya password entered.",
    error_fill_all_fields: "Sari options bharna mandatory hai.",
    error_admin_role_forbidden: "Super Admin registers dynamically disabled.",
    success_registration: "Profile register ho gayi! System me auto-login ho raha hai...",
    language_label: "Bhasha Chunein:"
  }
};

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onLoginSuccess }) => {
  const { users, registerNewUser, language, setLanguage } = useApp();
  const { login } = useAuth();

  const [authType, setAuthType] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);

  // Form Fields
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role>("Farmer");
  const [rememberMe, setRememberMe] = useState(false);

  // States
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showForgotHelper, setShowForgotHelper] = useState(false);

  const translate = (key: keyof typeof LOCAL_TRANSLATIONS["en"]): string => {
    const dict = LOCAL_TRANSLATIONS[language] || LOCAL_TRANSLATIONS["en"];
    return dict[key] || LOCAL_TRANSLATIONS["en"][key] || String(key);
  };

  // On mount, load remembered login details if checkbox is active
  useEffect(() => {
    const remembered = localStorage.getItem("ag_remembered_username");
    if (remembered) {
      setEmail(remembered);
      setRememberMe(true);
    }
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const trimmedInput = email.trim();
    if (!trimmedInput || !password) {
      setError(translate("error_fill_all_fields"));
      return;
    }

    try {
      await login(trimmedInput, password);
      
      if (rememberMe) {
        localStorage.setItem("ag_remembered_username", trimmedInput);
      } else {
        localStorage.removeItem("ag_remembered_username");
      }
      
      setSuccessMsg("Logged in successfully! Loading your Agrivon profile...");
      setTimeout(() => {
        onLoginSuccess();
      }, 1000);
    } catch (err: any) {
      console.error("Login attempt failed:", err);
      const errMsg = err.message || "";
      if (errMsg.includes("Email not confirmed") || errMsg.includes("Email address has not been confirmed")) {
        setError("Login attempt failed: Email not confirmed. Please check your inbox and verify your email.");
      } else if (errMsg.includes("Invalid login credentials") || errMsg.includes("invalid_credentials") || errMsg.includes("invalid") || errMsg.includes("Incorrect")) {
        setError("Login attempt failed: Invalid login credentials. Please check your email and password.");
      } else {
        setError(`Login attempt failed: ${errMsg}`);
      }
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!fullName.trim() || !mobile.trim() || !email.trim() || !password || !confirmPassword || !selectedRole) {
      setError(translate("error_fill_all_fields"));
      return;
    }

    if (password !== confirmPassword) {
      setError(translate("error_passwords_dont_match"));
      return;
    }

    // Restrict Admin Registration
    if (selectedRole === "SuperAdmin") {
      setError(translate("error_admin_role_forbidden"));
      return;
    }

    // Check unique email and mobile phone number locally if users list is populated
    const userExists = users.some(
      (u) => 
        u.email.trim().toLowerCase() === email.trim().toLowerCase() || 
        (u.mobileNumber && u.mobileNumber.trim() === mobile.trim())
    );

    if (userExists) {
      setError("An account is already registered with this Email Address or Mobile Number.");
      return;
    }

    try {
      // Set up default registration data values to prevent dashboard lookup breakages
      let profileData: any = { name: fullName };
      
      await registerNewUser(
        selectedRole,
        profileData,
        email.trim(),
        password,
        mobile.trim()
      );

      setSuccessMsg(translate("success_registration"));
      
      // Auto redirection timeout
      setTimeout(() => {
        onLoginSuccess();
      }, 1500);
    } catch (err: any) {
      console.error("Registration failed:", err);
      setError(err.message || "Registration failed. This email may already be in use or format is invalid.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white relative overflow-hidden">
      {/* Decorative Matrix Backgrounds */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c1322_1px,transparent_1px),linear-gradient(to_bottom,#0c1322_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-40 pointer-events-none" />
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Header Row */}
      <header className="max-w-7xl mx-auto w-full px-6 py-5 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 opacity-60 blur-xs" />
            <div className="relative bg-slate-900 border border-emerald-500/30 p-2.5 rounded-xl">
              <Sprout className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-wider text-white">
              AGRIVON <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ml-1">PORTAL</span>
            </h1>
            <p className="text-[9px] text-slate-400 font-mono">SECURE MULTI-ROLE AGRITECH NETWORK</p>
          </div>
        </div>

        {/* Global Multi-Language Switcher Header Widget */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-1.5 shadow-lg">
          <span className="text-[10px] text-slate-400 font-bold hidden sm:inline">{translate("language_label")}</span>
          <div className="flex gap-1">
            {(["en", "hi", "hinglish"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-2 py-1 text-[9px] font-black uppercase rounded-lg transition-all cursor-pointer ${
                  language === lang 
                    ? "bg-emerald-600 text-white shadow-xs" 
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                {lang === "en" ? "EN" : lang === "hi" ? "हिंदी" : "Hinglish"}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Container Workspace */}
      <main className="max-w-7xl mx-auto w-full px-6 py-6 md:py-12 flex-grow flex items-center justify-center z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full max-w-6xl">
          
          {/* Left Column: Platform Branding & Credentials Guarantee */}
          <div className="lg:col-span-6 space-y-6 text-left hidden lg:block">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 text-xs px-3 py-1.5 rounded-full font-semibold border border-emerald-500/20">
              <Sparkles className="w-3.5 h-3.5" /> Direct IoT Integrations & AI Diagnostics
            </div>
            <h2 className="text-4xl font-black text-white leading-tight tracking-tight">
              An Absolute <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                Agriculture Ecosystem
              </span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              Connect seamlessly with local seed sellers, employ professional farm labor crews on verified mandates, and leverage computer-vision diagnostic models to save crops.
            </p>

            {/* Platform Feature Badges */}
            <div className="space-y-4 pt-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">AI Leaf Disease Pathology</h4>
                  <p className="text-slate-500 text-[11px] mt-0.5">High precision regression models detect anomalies instantly.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">Verified Merchant Marketplace</h4>
                  <p className="text-slate-500 text-[11px] mt-0.5">Sow premium grade products and purchase secure agro-goods.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">Labor Hiring Integration</h4>
                  <p className="text-slate-500 text-[11px] mt-0.5">Real-time daily wage schedules and application matching tools.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Unified Authentication Form Shell */}
          <div className="lg:col-span-6 w-full max-w-md mx-auto">
            <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-md">
              
              {/* Custom Segmented Authentication Switch Tabs */}
              <div className="flex bg-slate-950 p-1.5 rounded-2xl mb-8 border border-slate-800/65">
                <button
                  type="button"
                  onClick={() => {
                    setAuthType("login");
                    setError("");
                    setSuccessMsg("");
                  }}
                  className={`w-1/2 py-2.5 rounded-xl text-xs font-black tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                    authType === "login" 
                      ? "bg-slate-800 text-white shadow-md border hover:border-slate-700 border-slate-700" 
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {translate("login_tab")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthType("register");
                    setError("");
                    setSuccessMsg("");
                  }}
                  className={`w-1/2 py-2.5 rounded-xl text-xs font-black tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                    authType === "register" 
                      ? "bg-slate-800 text-white shadow-md border hover:border-slate-700 border-slate-700" 
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {translate("register_tab")}
                </button>
              </div>

              {/* Status Notifications Alerts */}
              {error && (
                <div className="mb-5 p-3.5 bg-red-950/40 border border-red-900/50 rounded-xl flex items-start gap-2.5 text-xs text-red-300 animate-fadeIn">
                  <ShieldAlert className="w-4.5 h-4.5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{error}</p>
                </div>
              )}

              {successMsg && (
                <div className="mb-5 p-3.5 bg-emerald-950/40 border border-emerald-900/50 rounded-xl flex items-start gap-2.5 text-xs text-emerald-300 animate-fadeIn">
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <p className="leading-relaxed font-bold">{successMsg}</p>
                </div>
              )}

              {/* Forgot Password Recovery Dialogue assistance */}
              {showForgotHelper && (
                <div className="mb-6 p-4 bg-slate-950 border border-slate-800 rounded-2xl relative animate-fadeIn">
                  <button 
                    onClick={() => setShowForgotHelper(false)} 
                    className="absolute top-2 right-2 hover:text-white text-xs font-semibold text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800"
                  >
                    Close
                  </button>
                  <h4 className="text-xs font-black text-rose-400 uppercase tracking-widest">{translate("forgot_help_title")}</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed mt-2">{translate("forgot_help_desc")}</p>
                </div>
              )}

              {/* ====================================
                  LOGIN SCREEN RENDER
                  ==================================== */}
              {authType === "login" && (
                <form onSubmit={handleLoginSubmit} className="space-y-5">
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-white tracking-tight">{translate("login_title")}</h3>
                    <p className="text-slate-400 text-xs mt-1 leading-normal">{translate("login_sub")}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="text-left">
                      <label className="block text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-1.5">
                        {translate("email_or_mobile")}
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                          <Mail className="w-4 h-4" />
                        </span>
                        <input
                          type="text"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. admin@agrivon.com or 9999999999"
                          className="w-full text-xs pl-10 pr-3.5 py-3 bg-slate-950 border border-slate-850 rounded-xl focus:outline-none focus:border-emerald-500 transition text-white placeholder-slate-700"
                        />
                      </div>
                    </div>

                    <div className="text-left">
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
                          {translate("password")}
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowForgotHelper(true)}
                          className="text-[10px] font-black text-emerald-400 hover:text-emerald-350 cursor-pointer"
                        >
                          {translate("forgot_password")}
                        </button>
                      </div>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                          <Lock className="w-4 h-4" />
                        </span>
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full text-xs pl-10 pr-10 py-3 bg-slate-950 border border-slate-850 rounded-xl focus:outline-none focus:border-emerald-500 transition text-white placeholder-slate-700"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-350 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 select-none">
                    <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded bg-slate-950 border-slate-800 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                      />
                      <span>{translate("remember_me")}</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-200 shadow-md hover:shadow-emerald-500/10 cursor-pointer flex items-center justify-center gap-2 mt-4"
                  >
                    <LogIn className="w-4 h-4" strokeWidth={2.5} /> {translate("signin_btn")}
                  </button>
                </form>
              )}

              {/* ====================================
                  REGISTRATION SCREEN RENDER
                  ==================================== */}
              {authType === "register" && (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-white tracking-tight">{translate("register_title")}</h3>
                    <p className="text-slate-400 text-xs mt-1 leading-normal">{translate("register_sub")}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="text-left">
                      <label className="block text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-1">
                        {translate("full_name")}
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                          <User className="w-4 h-4" />
                        </span>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Rajesh Kumar"
                          className="w-full text-xs pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:outline-none focus:border-emerald-500 transition text-white placeholder-slate-700"
                        />
                      </div>
                    </div>

                    <div className="text-left">
                      <label className="block text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-1">
                        {translate("mobile_number")}
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                          <Phone className="w-4 h-4" />
                        </span>
                        <input
                          type="tel"
                          required
                          pattern="^[0-9]{10}$"
                          maxLength={10}
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                          placeholder="e.g. 9876543210 (10 digits)"
                          className="w-full text-xs pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:outline-none focus:border-emerald-500 transition text-white placeholder-slate-700"
                        />
                      </div>
                    </div>

                    <div className="text-left">
                      <label className="block text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-1">
                        {translate("email_address")}
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                          <Mail className="w-4 h-4" />
                        </span>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. rajesh@farmer.com"
                          className="w-full text-xs pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:outline-none focus:border-emerald-500 transition text-white placeholder-slate-700"
                        />
                      </div>
                    </div>

                    <div className="text-left">
                      <label className="block text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-1">
                        {translate("choose_role")}
                      </label>
                      <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value as Role)}
                        className="w-full text-xs px-3.5 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-205 text-white"
                      >
                        <option value="Farmer">{translate("role_farmer")}</option>
                        <option value="Worker">{translate("role_worker")}</option>
                        <option value="ShopOwner">{translate("role_seller")}</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="text-left">
                        <label className="block text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-1">
                          {translate("password")}
                        </label>
                        <input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Password"
                          className="w-full text-xs px-3.5 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:outline-none focus:border-emerald-500 transition text-white placeholder-slate-700"
                        />
                      </div>
                      <div className="text-left">
                        <label className="block text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-1">
                          {translate("confirm_password")}
                        </label>
                        <input
                          type="password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm"
                          className="w-full text-xs px-3.5 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:outline-none focus:border-emerald-500 transition text-white placeholder-slate-700"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-cyan-700 hover:bg-cyan-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-200 shadow-md cursor-pointer flex items-center justify-center gap-1.5 mt-4"
                  >
                    {translate("register_btn")} <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* Bottom login toggle prompt links */}
              <div className="mt-6 pt-4 border-t border-slate-850 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setAuthType(authType === "login" ? "register" : "login");
                    setError("");
                    setSuccessMsg("");
                  }}
                  className="text-xs text-slate-400 hover:text-emerald-400 hover:underline transition cursor-pointer"
                >
                  {authType === "login" ? translate("new_here") : translate("already_member")}
                </button>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Modern Compact SaaS Footer */}
      <footer className="w-full py-5 text-center text-[10px] text-slate-500 border-t border-slate-900 bg-slate-950/80 z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>{translate("footer_text")}</p>
          <div className="flex gap-4">
            <span className="hover:text-emerald-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-emerald-400 cursor-pointer">Security Safeguard Policy</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
