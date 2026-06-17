import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { ImageWithFallback } from "./ImageWithFallback";
import { 
  CloudSun,
  ShieldCheck,
  Activity,
  DollarSign,
  TrendingUp,
  MessageSquare,
  BookOpen,
  ShoppingBag,
  Users,
  Sparkles,
  ChevronRight,
  Send,
  Plus,
  Compass,
  CheckCircle,
  Truck,
  HelpCircle,
  UserCheck,
  UserX,
  Upload,
  Droplets,
  Wind,
  PlusCircle,
  Info,
  Globe
} from "lucide-react";

export const FarmerDashboard: React.FC = () => {
  const {
    currentUser,
    users,
    language,
    weather,
    cropPrices,
    feedPosts,
    diaryEntries,
    orders,
    messages,
    customerRequests,
    createFeedPost,
    likeFeedPost,
    addCommentToPost,
    addDiaryEntry,
    sendChatMessage,
    sendCustomerRequest,
    placeOrder,
    products,
    triggerSystemDemoAction
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    "weather" | "ai-disease" | "medicine" | "prices" | "yield" | "feed" | "chat" | "diary" | "orders"
  >("weather");

  const [followedIdList, setFollowedIdList] = useState<string[]>([]); // Pre-followed

  // state for Disease detection
  const [diseaseCrop, setDiseaseCrop] = useState("Rice");
  const [symptomDesc, setSymptomDesc] = useState("");
  const [isDetecting, setIsDetecting] = useState(false);
  const [diseaseResult, setDiseaseResult] = useState<any>(null);
  const [fileName, setFileName] = useState("");

  // state for Medicine Recommendations
  const [medCrop, setMedCrop] = useState("Wheat");
  const [medProblem, setMedProblem] = useState("");
  const [isMedLoading, setIsMedLoading] = useState(false);
  const [medResult, setMedResult] = useState<any>(null);

  // state for Yield Prediction
  const [yieldCrops, setYieldCrops] = useState("Rice");
  const [yieldSoil, setYieldSoil] = useState("Clay Loam");
  const [yieldWater, setYieldWater] = useState("Canal + Drip");
  const [isYieldLoading, setIsYieldLoading] = useState(false);
  const [yieldResult, setYieldResult] = useState<any>(null);

  // state for Diary Entry
  const [diaryCrop, setDiaryCrop] = useState("");
  const [diaryType, setDiaryType] = useState<"Planting" | "Irrigation" | "Fertilization" | "Pest Control" | "Harvesting" | "Note">("Planting");
  const [diaryNote, setDiaryNote] = useState("");

  // state for Community Feed
  const [postContent, setPostContent] = useState("");
  const [commentInput, setCommentInput] = useState<{ [postId: string]: string }>({});

  // state for Direct Chat
  const [activeChatRecipientId, setActiveChatRecipientId] = useState<string>("");
  const [chatMessageText, setChatMessageText] = useState("");

  // state for Chat translation
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

  // state for Orders and Customer requests
  const [selectedProductId, setSelectedProductId] = useState("");
  const [orderQty, setOrderQty] = useState(1);
  const [orderAddress, setOrderAddress] = useState(currentUser.farmerProfile?.village + ", " + currentUser.farmerProfile?.state);
  const [inquirySubject, setInquirySubject] = useState("");
  const [inquiryMsg, setInquiryMsg] = useState("");

  // Filter other farmers for follow workflow
  const otherFarmers = users.filter((u) => u.role === "Farmer" && u.id !== currentUser.id);

  // AI disease diagnosis api trigger
  const handleDiseaseDetect = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDetecting(true);
    setDiseaseResult(null);

    try {
      const response = await fetch("/api/gemini/disease-detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cropName: diseaseCrop,
          description: symptomDesc,
          imageBase64: "", // simulate text description fallback
          mimeType: "",
          selectedLanguage: language,
          locale: language === "en" ? "en-US" : "hi-IN",
          userLanguagePreference: language
        })
      });
      const data = await response.json();
      setDiseaseResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsDetecting(false);
    }
  };

  // Medicine recs API trigger
  const handleMedicineRec = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!medProblem) return;
    setIsMedLoading(true);
    setMedResult(null);

    try {
      const response = await fetch("/api/gemini/medicine-rec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cropName: medCrop,
          problem: medProblem,
          selectedLanguage: language,
          locale: language === "en" ? "en-US" : "hi-IN",
          userLanguagePreference: language
        })
      });
      const data = await response.json();
      setMedResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsMedLoading(false);
    }
  };

  // Yield prediction API trigger
  const handleYieldPredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsYieldLoading(true);
    setYieldResult(null);

    try {
      const response = await fetch("/api/gemini/yield-predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          farmSize: currentUser.farmerProfile?.farmSize || 5,
          cropsGrown: yieldCrops,
          state: currentUser.farmerProfile?.state || "Uttar Pradesh",
          village: currentUser.farmerProfile?.village || "Kanakpur",
          soilType: yieldSoil,
          waterSource: yieldWater,
          experience: currentUser.farmerProfile?.experience || 5,
          selectedLanguage: language,
          locale: language === "en" ? "en-US" : "hi-IN",
          userLanguagePreference: language
        })
      });
      const data = await response.json();
      setYieldResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsYieldLoading(false);
    }
  };

  const submitDiary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!diaryCrop || !diaryNote) return;
    addDiaryEntry(diaryCrop, diaryType, diaryNote);
    setDiaryCrop("");
    setDiaryNote("");
  };

  const submitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;
    createFeedPost(postContent);
    setPostContent("");
  };

  const submitComment = (postId: string) => {
    const text = commentInput[postId] || "";
    if (!text.trim()) return;
    addCommentToPost(postId, text);
    setCommentInput((prev) => ({ ...prev, [postId]: "" }));
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChatRecipientId || !chatMessageText.trim()) return;
    sendChatMessage(activeChatRecipientId, chatMessageText);
    setChatMessageText("");
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return;
    placeOrder(selectedProductId, orderQty, orderAddress);
    setSelectedProductId("");
    alert("Supply order placed successfully! Shop Owner has been notified.");
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    const shopOwner = users.find((u) => u.role === "ShopOwner");
    if (!shopOwner || !inquirySubject || !inquiryMsg) return;
    sendCustomerRequest(shopOwner.id, inquirySubject, inquiryMsg);
    setInquirySubject("");
    setInquiryMsg("");
    alert("Inquiry transmitted to " + shopOwner.shopOwnerProfile?.shopName);
  };

  const toggleFollow = (id: string) => {
    setFollowedIdList((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Chats involving active user
  const chatPartners = users.filter((u) => u.id !== currentUser.id);
  const activeChatMessages = messages.filter(
    (m) =>
      (m.senderId === currentUser.id && m.receiverId === activeChatRecipientId) ||
      (m.senderId === activeChatRecipientId && m.receiverId === currentUser.id)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Farmer Profile Card Ribbon */}
      <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6 mb-6 flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-white to-emerald-50/20">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.farmerProfile?.profilePicture || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=150"}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover border-2 border-emerald-600 shadow-xs"
          />
          <div>
            <h1 className="text-xl font-bold text-gray-900">{currentUser.farmerProfile?.name} 🍂</h1>
            <p className="text-xs text-gray-500 font-mono">
              Role: Farmer • Village: {currentUser.farmerProfile?.village}, {currentUser.farmerProfile?.state}
            </p>
            <div className="flex gap-2 mt-1.5 flex-wrap">
              <span className="bg-emerald-100/70 text-emerald-800 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full">
                {currentUser.farmerProfile?.farmSize} Acres
              </span>
              <span className="bg-amber-100/70 text-amber-800 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full">
                {currentUser.farmerProfile?.cropsGrown}
              </span>
              <span className="bg-teal-100/70 text-teal-800 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full">
                {currentUser.farmerProfile?.experience} years experience
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <button 
            onClick={() => { setActiveTab("ai-disease") }} 
            className="flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition"
          >
            <Sparkles className="h-3.5 w-3.5" /> AI Disease Scan
          </button>
          <button 
            onClick={() => { setActiveTab("orders") }} 
            className="flex items-center justify-center gap-2 bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 px-4 py-2 rounded-xl text-xs font-bold shadow-2xs transition"
          >
            <ShoppingBag className="h-3.5 w-3.5" /> Buy Supplies
          </button>
        </div>
      </div>

      {/* Grid: Sidemenu & Tab panel content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-1 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm h-fit">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-3 py-2">Farmer Services</h2>
          
          <button
            onClick={() => setActiveTab("weather")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "weather" ? "bg-emerald-700 text-white shadow-xs" : "text-gray-700 hover:bg-emerald-50"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <CloudSun className="h-4 w-4" /> Weather Dashboard
            </span>
            <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          </button>

          <button
            onClick={() => setActiveTab("ai-disease")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "ai-disease" ? "bg-emerald-700 text-white shadow-xs" : "text-gray-700 hover:bg-emerald-50"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Sparkles className="h-4 w-4 text-amber-500 fill-amber-500" /> AI Disease Detection
            </span>
            <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          </button>

          <button
            onClick={() => setActiveTab("medicine")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "medicine" ? "bg-emerald-700 text-white shadow-xs" : "text-gray-700 hover:bg-emerald-50"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Activity className="h-4 w-4" /> Medicine Suggestions
            </span>
            <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          </button>

          <button
            onClick={() => setActiveTab("prices")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "prices" ? "bg-emerald-700 text-white shadow-xs" : "text-gray-700 hover:bg-emerald-50"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <TrendingUp className="h-4 w-4" /> Crop Price Dashboard
            </span>
            <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          </button>

          <button
            onClick={() => setActiveTab("yield")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "yield" ? "bg-emerald-700 text-white shadow-xs" : "text-gray-700 hover:bg-emerald-50"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <DollarSign className="h-4 w-4" /> Yield Prediction
            </span>
            <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          </button>

          <button
            onClick={() => setActiveTab("feed")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "feed" ? "bg-emerald-700 text-white shadow-xs" : "text-gray-700 hover:bg-emerald-50"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Users className="h-4 w-4" /> Community Feed
            </span>
            <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          </button>

          <button
            onClick={() => setActiveTab("chat")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "chat" ? "bg-emerald-700 text-white shadow-xs" : "text-gray-700 hover:bg-emerald-50"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <MessageSquare className="h-4 w-4" /> Direct Chat
            </span>
            <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          </button>

          <button
            onClick={() => setActiveTab("diary")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "diary" ? "bg-emerald-700 text-white shadow-xs" : "text-gray-700 hover:bg-emerald-50"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <BookOpen className="h-4 w-4" /> Crop Diary
            </span>
            <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "orders" ? "bg-emerald-700 text-white shadow-xs" : "text-gray-700 hover:bg-emerald-50"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <ShoppingBag className="h-4 w-4" /> Stores & Order History
            </span>
            <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          </button>
        </div>

        {/* Dynamic Panel Content - lg:col-span-3 */}
        <div className="lg:col-span-3">
          
          {/* 1. WEATHER DASHBOARD */}
          {activeTab === "weather" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Weather Forecast</h3>
                  <p className="text-xs text-gray-500">Live regional weather updates for crop safety triggers.</p>
                </div>
                <CloudSun className="h-8 w-8 text-amber-500 animate-pulse" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block mb-1">Temperature</span>
                  <span className="text-3xl font-extrabold text-slate-800">{weather.temp}°C</span>
                  <span className="text-xs text-slate-500 block mt-1">{weather.condition} Sky</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block mb-1">Soil Moisture / Humidity</span>
                  <span className="text-3xl font-extrabold text-slate-800 flex items-center justify-center gap-1">
                    <Droplets className="h-5 w-5 text-blue-500 inline-block" /> {weather.humidity}%
                  </span>
                  <span className="text-xs text-slate-500 block mt-1">Excellent for planting propagation</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block mb-1">Wind Velocity</span>
                  <span className="text-3xl font-extrabold text-slate-800 flex items-center justify-center gap-1">
                    <Wind className="h-5 w-5 text-teal-500 inline-block" /> {weather.windSpeed} km/h
                  </span>
                  <span className="text-xs text-slate-500 block mt-1">Safe for insecticide spraying</span>
                </div>
              </div>

              {weather.warning && (
                <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-4 flex gap-3 text-xs leading-relaxed">
                  <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">Important Weather Advisory:</strong>
                    <p className="mt-1">{weather.warning}</p>
                  </div>
                </div>
              )}

              {/* Dynamic matching / quick tips for local coordinates */}
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <h4 className="font-semibold text-xs uppercase text-gray-400 tracking-wider">Suggested Actions Based on Weather</h4>
                <ul className="space-y-2">
                  <li className="text-xs text-gray-600 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                    Moderate soil moisture and windy safety is ideal today to administer pesticide sprays.
                  </li>
                  <li className="text-xs text-gray-600 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                    Ensure paddy irrigation channels are cleared in anticipation of monsoon showers.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* 2. AI DISEASE DETECTION */}
          {activeTab === "ai-disease" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-amber-500" /> Server-side Gemini AI Disease Scan
                  </h3>
                  <p className="text-xs text-gray-500">Provide field notes or upload custom images of symptoms to analyze crop diseases instantly.</p>
                </div>
              </div>

              {/* Simulation Notice */}
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-xs text-emerald-800 leading-relaxed">
                <p>
                  <strong>How to use:</strong> Select your crop name, type in details of the symptom (e.g. <i>&quot;brown spots with yellow borders near leaf margins on paddy plant&quot;</i>), and press diagnostic scan. This routes securely to our custom server side <code>gemini-3.5-flash</code> endpoint!
                </p>
              </div>

              <form onSubmit={handleDiseaseDetect} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Crop Type</label>
                    <select
                      value={diseaseCrop}
                      onChange={(e) => setDiseaseCrop(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none"
                    >
                      <option value="Rice">Rice (Paddy)</option>
                      <option value="Wheat">Wheat</option>
                      <option value="Sugarcane">Sugarcane</option>
                      <option value="Tomato">Tomato</option>
                      <option value="Mustard">Mustard</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Image Attachment</label>
                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer flex items-center gap-1.5 px-3 py-2 border border-dashed border-gray-300 hover:border-emerald-500 hover:bg-emerald-50/20 rounded-lg text-xs font-medium text-gray-600 transition">
                        <Upload className="h-4 w-4 text-emerald-700" />
                        <span>{fileName ? fileName : "Add Crop Photo"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setFileName(file.name);
                            }
                          }}
                        />
                      </label>
                      {fileName && (
                        <button
                          type="button"
                          onClick={() => setFileName("")}
                          className="text-[10px] text-red-500 underline font-medium"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Symptom Description & Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Describe what you see: leaf curling, spots, yellowing, rotting roots, insect chewing..."
                    value={symptomDesc}
                    onChange={(e) => setSymptomDesc(e.target.value)}
                    className="w-full text-xs p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isDetecting}
                  className="w-full bg-emerald-750 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-lg text-xs shadow-xs transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isDetecting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      Communicating securely with Gemini Pathology Model...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" /> Run Intelligent Diagnostics
                    </>
                  )}
                </button>
              </form>

              {diseaseResult && (
                <div id="disease-diagnosis-result" className="border border-emerald-100 rounded-xl bg-slate-50 overflow-hidden mt-6 animate-fade-in text-xs leading-relaxed">
                  <div className="bg-emerald-800 text-white p-3 flex justify-between items-center">
                    <span className="font-bold">Gemini Diagnosis Output:</span>
                    <span className="bg-emerald-600 text-white px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
                      Confidence: {diseaseResult.confidence}%
                    </span>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="block text-gray-500">Disease Identified:</span>
                        <strong className="text-sm text-amber-700 font-bold">{diseaseResult.diseaseName}</strong>
                      </div>
                      <div>
                        <span className="block text-gray-500">Biological Cause:</span>
                        <strong className="text-gray-900">{diseaseResult.cause}</strong>
                      </div>
                    </div>

                    <div>
                      <span className="block font-semibold text-gray-700 mb-1">Key Diagnosis Symptoms:</span>
                      <ul className="list-disc leading-loose pl-4 text-gray-600">
                        {diseaseResult.symptoms?.map((s: string, idx: number) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-200">
                      <div>
                        <span className="block font-bold text-xs text-amber-800 mb-1">🌿 Organic/Cultural Controls:</span>
                        <p className="text-gray-700 bg-white p-2.5 rounded-lg border border-gray-100">{diseaseResult.organicTreatment}</p>
                      </div>
                      <div>
                        <span className="block font-bold text-xs text-rose-800 mb-1">🧪 Recommended Chemical/Medicine:</span>
                        <p className="text-gray-700 bg-white p-2.5 rounded-lg border border-gray-100">{diseaseResult.chemicalTreatment}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-200">
                      <span className="block font-bold text-xs text-slate-800 mb-1">🛡️ Prevention practices next season:</span>
                      <p className="text-gray-600">{diseaseResult.prevention}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. MEDICINE RECOMMENDATIONS */}
          {activeTab === "medicine" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Expert Medicine Recommendations</h3>
                <p className="text-xs text-gray-500">Get specific brand recommendations and application dosage instructions securely from an AI agronomist.</p>
              </div>

              <form onSubmit={handleMedicineRec} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Target Crop</label>
                    <input
                      type="text"
                      className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg"
                      value={medCrop}
                      onChange={(e) => setMedCrop(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Ailment Symptoms / Plant Status</label>
                    <input
                      type="text"
                      className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg"
                      placeholder="e.g. powdery residue, leaf miners, root decay"
                      required
                      value={medProblem}
                      onChange={(e) => setMedProblem(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isMedLoading}
                  className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 rounded-lg text-xs transition uppercase tracking-widest cursor-pointer"
                >
                  {isMedLoading ? "Querying Expert Database..." : "Fetch Dosage & Medication Schedule"}
                </button>
              </form>

              {medResult && (
                <div className="border border-slate-200 rounded-xl bg-orange-50/10 p-5 space-y-4 text-xs leading-relaxed">
                  <div>
                    <h4 className="text-sm font-bold text-amber-900 mb-1">Pathology Diagnosis:</h4>
                    <p className="text-gray-700">{medResult.diagnosis}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-emerald-50/40 p-3 rounded-lg border border-emerald-100">
                      <h5 className="font-bold text-emerald-800 text-xs mb-1">Natural & Organic Solutions</h5>
                      <ul className="list-disc pl-4 space-y-1 text-gray-700">
                        {medResult.organicSolutions?.map((s: string, idx: number) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-rose-50/40 p-3 rounded-lg border border-rose-100">
                      <h5 className="font-bold text-rose-800 text-xs mb-1">Targeted Chemical Compounds</h5>
                      <ul className="list-disc pl-4 space-y-1 text-gray-700">
                        {medResult.chemicalSolutions?.map((s: string, idx: number) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-gray-100">
                    <h5 className="font-bold text-gray-800 text-xs mb-1 flex items-center gap-1">🗣️ Spraying & Dosage Instructions:</h5>
                    <p className="text-gray-600">{medResult.usageInstructions}</p>
                  </div>

                  <div className="bg-amber-100/30 p-3 rounded-lg border border-amber-200 text-amber-900">
                    <span className="font-bold block mb-0.5">⚠️ Handling Precautions:</span>
                    <p>{medResult.precautions}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 4. CROP PRICE DASHBOARD */}
          {activeTab === "prices" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Mandi Market Crop Prices</h3>
                  <p className="text-xs text-gray-500">Government MSP & bulk Mandi auction values in nearby yards.</p>
                </div>
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cropPrices.map((crop, idx) => (
                  <div key={idx} className="border border-gray-100 rounded-xl p-4 flex flex-col justify-between hover:shadow-xs transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-semibold text-gray-950 block">{crop.name}</span>
                        <span className="text-[10px] text-gray-400">{crop.market}</span>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 font-bold rounded-full ${
                        crop.changePercent > 0 ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                      }`}>
                        {crop.changePercent > 0 ? "+" : ""}{crop.changePercent}%
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between mt-4">
                      <span className="text-sm font-extrabold text-gray-900">₹{crop.currentPrice} <span className="font-normal text-xs text-gray-400">/ Quintal</span></span>
                    </div>

                    {/* Simple sparkline render representation */}
                    <div className="mt-3 flex gap-1.5 items-end justify-between h-8 bg-slate-50/50 p-1.5 rounded">
                      <span className="text-[9px] text-gray-400 mt-auto">Trend:</span>
                      {crop.history?.map((pt, index) => (
                        <div
                          key={index}
                          style={{ height: `${((pt - 300) / 6000) * 100}%` }}
                          className={`w-3.5 rounded-xs ${crop.changePercent > 0 ? "bg-emerald-600/60" : "bg-rose-600/60"}`}
                          title={`Week ${index}: ₹${pt}`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. YIELD PREDICTION */}
          {activeTab === "yield" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Predictive Yield Forecaster</h3>
                <p className="text-xs text-gray-500">Calculate estimated harvests with statistical models compiled secure via Gemini Pathology models.</p>
              </div>

              <form onSubmit={handleYieldPredict} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Target Crop</label>
                    <select
                      value={yieldCrops}
                      onChange={(e) => setYieldCrops(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg"
                    >
                      <option value="Rice (Basmati)">Rice (Basmati Variety)</option>
                      <option value="Sonalika Wheat">Sonalika Wheat</option>
                      <option value="Mustard Seeds">Mustard Seeds</option>
                      <option value="Sugarcane">Sugarcane</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Soil Properties</label>
                    <select
                      value={yieldSoil}
                      onChange={(e) => setYieldSoil(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg"
                    >
                      <option value="Clay Loam">Alluvial / Clay Loam</option>
                      <option value="Sandy Soil">Sandy Loam</option>
                      <option value="Red Laterite">Red Laterite</option>
                      <option value="Black Cotton">Black Cotton Soil</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Water Source Mode</label>
                    <select
                      value={yieldWater}
                      onChange={(e) => setYieldWater(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg"
                    >
                      <option value="Canal Drip">Canal and Micro-Drip</option>
                      <option value="Borewell Flood">Tubewell Flood irrigation</option>
                      <option value="Rainfed Only">Monsoon Rainfed</option>
                    </select>
                  </div>
                </div>

                <div className="text-xs text-gray-500 bg-slate-50 p-3 rounded-lg flex items-center gap-1.5 border border-slate-100">
                  <span className="font-bold text-gray-700">Farmer profile:</span> Auto-applying your farm size ({currentUser.farmerProfile?.farmSize} Acres) and farming history ({currentUser.farmerProfile?.experience} years experience).
                </div>

                <button
                  type="submit"
                  disabled={isYieldLoading}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-lg text-xs transition cursor-pointer"
                >
                  {isYieldLoading ? "Calculating Yield Estimates..." : "Predict Crop Productivity Model"}
                </button>
              </form>

              {yieldResult && (
                <div className="border border-slate-100 rounded-xl bg-teal-50/10 p-5 space-y-4 text-xs leading-relaxed">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-3xs">
                      <span className="block text-slate-400 text-[10px] uppercase font-bold tracking-widest">Predicted Volume</span>
                      <strong className="text-xl text-emerald-800 font-extrabold">{yieldResult.estimatedYield}</strong>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-3xs">
                      <span className="block text-slate-400 text-[10px] uppercase font-bold tracking-widest">Est. Market Value</span>
                      <strong className="text-xl text-teal-800 font-extrabold">{yieldResult.monetaryValueEstimate}</strong>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-900 text-xs mb-1">⚙️ Soil & Water Factors Impacting Productivity:</h4>
                    <ul className="list-disc pl-4 space-y-1 text-gray-600">
                      {yieldResult.factorsInfluencing?.map((f: string, idx: number) => (
                        <li key={idx}>{f}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-900 text-xs mb-1">💡 Professional Agronomy Tips to Maximize Volume:</h4>
                    <ul className="list-disc pl-4 space-y-1 text-gray-600">
                      {yieldResult.actionableTips?.map((t: string, idx: number) => (
                        <li key={idx}>{t}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3.5 rounded-lg">
                    <span className="font-bold text-amber-950 block mb-1">🚩 Risks to Monitor:</span>
                    <ul className="list-disc pl-4">
                      {yieldResult.potentialRisks?.map((r: string, idx: number) => (
                        <li key={idx}>{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 6. COMMUNITY FEED */}
          {activeTab === "feed" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Agricultural Village Feed</h3>
                  <p className="text-xs text-gray-500">Ask questions, share advice, and explore followed farmers updates.</p>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded font-semibold">Followed Farmers updates first</span>
                </div>
              </div>

              {/* Creator form */}
              <form onSubmit={submitPost} className="space-y-3 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                <textarea
                  required
                  placeholder="Share crop findings with the local farming community... e.g., 'Urea stocking up at bazar store, pricing is ₹480.'"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="w-full text-xs p-3 bg-white rounded-lg border border-gray-200 focus:outline-none"
                  rows={2}
                />
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-gray-500">Posting as {currentUser.farmerProfile?.name}</span>
                  <button type="submit" className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-1.5 rounded-lg text-xs cursor-pointer">
                    Publish Post
                  </button>
                </div>
              </form>

              {/* Post Lists */}
              <div className="space-y-6">
                {feedPosts.map((post) => (
                  <div key={post.id} className="border border-gray-100 rounded-xl p-5 space-y-4 shadow-3xs hover:shadow-2xs transition">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="bg-amber-100 text-amber-800 text-xs font-bold h-8 w-8 rounded-full flex items-center justify-center">
                          {post.authorName.charAt(0)}
                        </div>
                        <div>
                          <strong className="text-xs text-gray-900 block">{post.authorName}</strong>
                          <span className="text-[9px] text-gray-400 uppercase font-bold tracking-wider">{post.authorRole} • village hub</span>
                        </div>
                      </div>

                      {/* Follow farmers trigger */}
                      {post.authorId !== currentUser.id && post.authorRole === "Farmer" && (
                        <button
                          onClick={() => toggleFollow(post.authorId)}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition ${
                            followedIdList.includes(post.authorId)
                              ? "bg-slate-100 text-slate-700"
                              : "border-emerald-600 text-emerald-700 hover:bg-emerald-50"
                          }`}
                        >
                          {followedIdList.includes(post.authorId) ? "Following" : "+ Follow Farmer"}
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">{post.content}</p>

                    <div className="flex gap-4 text-xs items-center border-t border-b border-slate-50 py-2">
                      <button
                        onClick={() => likeFeedPost(post.id)}
                        className={`font-semibold flex items-center gap-1 text-[11px] ${
                          post.likedBy.includes(currentUser.id) ? "text-rose-600" : "text-gray-500 hover:text-gray-900"
                        }`}
                      >
                        👍 Likes ({post.likesCount})
                      </button>
                      <span className="text-gray-400 text-[10px]">Comments ({post.comments?.length || 0})</span>
                    </div>

                    {/* Comments */}
                    <div className="space-y-3 bg-slate-50 p-3.5 rounded-lg">
                      {post.comments?.map((comment) => (
                        <div key={comment.id} className="text-xs leading-relaxed divide-y divide-gray-100 py-1 first:pt-0">
                          <div className="flex items-center justify-between gap-2.5 mb-1">
                            <span className="font-bold text-gray-900">{comment.authorName}</span>
                            <span className="text-[9px] bg-slate-200 text-slate-600 px-1 py-0.2 rounded font-semibold tracking-wider">{comment.authorRole}</span>
                          </div>
                          <p className="text-gray-600 text-xs font-normal">{comment.content}</p>
                        </div>
                      ))}

                      {/* Add comment input */}
                      <div className="flex gap-2 pt-2">
                        <input
                          type="text"
                          placeholder="Write reply..."
                          value={commentInput[post.id] || ""}
                          onChange={(e) => setCommentInput({ ...commentInput, [post.id]: e.target.value })}
                          className="flex-grow text-xs px-2.5 py-1 text-black bg-white border border-gray-200 rounded-lg focus:outline-none"
                        />
                        <button
                          onClick={() => submitComment(post.id)}
                          className="bg-slate-700 hover:bg-slate-800 text-white px-3 py-1 rounded-lg text-xs"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. DIRECT CHAT */}
          {activeTab === "chat" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-3 min-h-[500px]">
              
              {/* Left Contact Directory */}
              <div className="border-r border-gray-100 p-4 space-y-4 bg-slate-50/50">
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Directory</span>
                <div className="space-y-1.5">
                  {chatPartners.map((u) => {
                    const name = u.role === "Farmer"
                      ? u.farmerProfile?.name + " (Farmer 🌾)"
                      : u.role === "ShopOwner"
                      ? u.shopOwnerProfile?.shopName + " (Store 🏪)"
                      : u.workerProfile?.name + " (Worker 👨🌾)";
                    return (
                      <button
                        key={u.id}
                        onClick={() => setActiveChatRecipientId(u.id)}
                        className={`w-full text-left px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                          activeChatRecipientId === u.id
                            ? "bg-emerald-700 text-white font-semibold shadow-xs"
                            : "text-gray-700 bg-white border border-gray-100 hover:bg-emerald-50/55"
                        }`}
                      >
                        {name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Active Chat Pane */}
              <div className="col-span-2 flex flex-col justify-between p-4 h-full">
                {activeChatRecipientId ? (
                  <>
                    {/* Header */}
                    <div className="border-b border-gray-100 pb-3 mb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <h4 className="font-bold text-xs text-gray-850">
                        Chatting with{" "}
                        {users.find((u) => u.id === activeChatRecipientId)?.role === "Farmer"
                          ? users.find((u) => u.id === activeChatRecipientId)?.farmerProfile?.name
                          : users.find((u) => u.id === activeChatRecipientId)?.role === "ShopOwner"
                          ? users.find((u) => u.id === activeChatRecipientId)?.shopOwnerProfile?.shopName
                          : users.find((u) => u.id === activeChatRecipientId)?.workerProfile?.name}
                      </h4>
                      <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-2 py-1 rounded-xl">
                        <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1">
                          <Globe className="h-3 w-3 text-emerald-700" /> Preferred Language:
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

                    {/* Chat Bubble List */}
                    <div className="flex-grow overflow-y-auto space-y-3 pr-1 max-h-96 min-h-[300px]">
                      {activeChatMessages.length === 0 ? (
                        <div className="text-gray-400 text-xs text-center py-12">No communication logged. Send a message to start trading/negotiating.</div>
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
                                            className="underline font-bold text-emerald-900 ml-1 cursor-pointer"
                                          >
                                            Retry
                                          </button>
                                        </div>
                                      )
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => handleTranslateMessage(msg.id, msg.content, preferredLanguage)}
                                        className="text-[10px] font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
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

                    {/* Input bar */}
                    <form onSubmit={handleSendChatMessage} className="flex gap-2 pt-3 border-t border-gray-100 mt-3">
                      <input
                        type="text"
                        required
                        placeholder="Type message here..."
                        value={chatMessageText}
                        onChange={(e) => setChatMessageText(e.target.value)}
                        className="flex-grow text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                      <button type="submit" className="bg-emerald-700 hover:bg-emerald-800 text-white p-2 rounded-lg cursor-pointer">
                        <Send className="h-4 w-4" />
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-24 text-gray-400 text-xs">
                    Select a Farmer, Worker, or Shop Owner from the left directory to chat.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 8. CROP DIARY */}
          {activeTab === "diary" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Crop Diary🌾</h3>
                  <p className="text-xs text-gray-500">Record agricultural activities (sowing, watering, spray timings) for easy reference and yield tracking.</p>
                </div>
              </div>

              {/* Log Input */}
              <form onSubmit={submitDiary} className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
                <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Post Log Entry</span>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Crop Subject</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Basmati Paddy / Sugarcane"
                      value={diaryCrop}
                      onChange={(e) => setDiaryCrop(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Activity Type</label>
                    <select
                      value={diaryType}
                      onChange={(e: any) => setDiaryType(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none"
                    >
                      <option value="Planting">Planting / Sowing</option>
                      <option value="Irrigation">Irrigation / Watering</option>
                      <option value="Fertilization">Fertilization</option>
                      <option value="Pest Control">Pest Control / Spraying</option>
                      <option value="Harvesting">Harvesting</option>
                      <option value="Note">General Observation Note</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Diary Field Notes</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Enter observations e.g. Added neem fertilizer; water level normal."
                    value={diaryNote}
                    onChange={(e) => setDiaryNote(e.target.value)}
                    className="w-full text-xs p-3 border border-gray-200 rounded-lg focus:outline"
                  />
                </div>

                <div className="flex justify-end">
                  <button type="submit" className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-lg text-xs cursor-pointer">
                    Append Diary Entry
                  </button>
                </div>
              </form>

              {/* History timeline logs */}
              <div className="space-y-4">
                <h4 className="font-semibold text-xs text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Completed Field Cycles</h4>
                {diaryEntries.filter((e) => e.farmerId === currentUser.id).length === 0 ? (
                  <p className="text-xs text-gray-400">No diary logs written. Log down observations to predict yield cycle outputs.</p>
                ) : (
                  <div className="relative border-l border-emerald-100 pl-4 space-y-4 ml-2">
                    {diaryEntries
                      .filter((e) => e.farmerId === currentUser.id)
                      .map((log) => (
                        <div key={log.id} className="relative text-xs">
                          {/* Dot accent marker */}
                          <span className="absolute -left-[21.5px] top-1 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white" />
                          <span className="text-[10px] text-gray-400 font-mono block">{log.date}</span>
                          <strong className="text-gray-950 font-bold block mt-0.5">{log.cropName} — <span className="text-emerald-700">{log.activityType}</span></strong>
                          <p className="text-gray-600 mt-1">{log.notes}</p>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 9. STORES & ORDER HISTORY */}
          {activeTab === "orders" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
              
              {/* Buy supplies panel */}
              <div>
                <h3 className="text-lg font-bold text-gray-900">Seed & Pesticide Marketplace</h3>
                <p className="text-xs text-gray-500">Order seeds, fertilizers, and tools directly from registered local dealers.</p>
              </div>

              {/* Browse products available */}
              <div className="space-y-4">
                <h4 className="font-bold text-xs text-gray-400 uppercase tracking-widest">Available Store Inventory</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.map((p) => (
                    <div key={p.id} className="border border-gray-100 rounded-xl p-4 flex gap-3 hover:shadow-xs transition">
                      <ImageWithFallback
                        src={p.image}
                        alt={p.name}
                        category={p.category}
                        fallbackType="product"
                        className="w-16 h-16 rounded object-cover flex-shrink-0"
                      />
                      <div className="flex-grow flex flex-col justify-between text-xs">
                        <div>
                          <strong className="font-bold text-gray-950 block leading-tight">{p.name}</strong>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-gray-400 uppercase font-semibold">{p.category}</span>
                            <span className="text-[9px] bg-slate-100 px-1 py-0.1 select-none rounded text-slate-500">{p.shopName}</span>
                          </div>
                          <p className="text-gray-500 text-[10px] mt-1 leading-normal line-clamp-1">{p.description}</p>
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-50">
                          <span className="font-bold text-gray-900">
                            ₹{p.price}{" "}
                            {p.originalPrice && (
                              <span className="text-[10px] line-through text-red-400 font-normal ml-1">₹{p.originalPrice}</span>
                            )}
                          </span>
                          
                          <button
                            onClick={() => {
                              setSelectedProductId(p.id);
                              setOrderQty(1);
                            }}
                            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-2.5 py-1 rounded text-[10px] cursor-pointer"
                          >
                            Select Order
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order purchase Form sheet */}
              {selectedProductId && (
                <form onSubmit={handlePlaceOrder} className="bg-amber-50 p-4 border border-amber-200 rounded-xl space-y-3 leading-relaxed">
                  <span className="text-xs font-bold text-amber-900 block">Confirm Supply Purchase order:</span>
                  <div className="text-xs text-gray-700">
                    Buying: <strong>{products.find((p) => p.id === selectedProductId)?.name}</strong> for ₹{products.find((p) => p.id === selectedProductId)?.price}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">Quantity</label>
                      <input
                        type="number"
                        min={1}
                        className="w-full bg-white px-2.5 py-1 border border-gray-200 rounded"
                        value={orderQty}
                        onChange={(e) => setOrderQty(Math.max(1, Number(e.target.value)))}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">Delivery Address</label>
                      <input
                        type="text"
                        required
                        className="w-full bg-white px-2.5 py-1 border border-gray-200 rounded"
                        value={orderAddress}
                        onChange={(e) => setOrderAddress(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 text-xs pt-1">
                    <button
                      type="button"
                      onClick={() => setSelectedProductId("")}
                      className="px-3 py-1 bg-white border border-amber-300 text-amber-800 rounded font-medium"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="px-4 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-bold cursor-pointer">
                      Confirm Dispatch
                    </button>
                  </div>
                </form>
              )}

              {/* Order history lists */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Order Tracking History</h4>
                {orders.filter((o) => o.farmerId === currentUser.id).length === 0 ? (
                  <p className="text-xs text-gray-400">No items bought yet.</p>
                ) : (
                  <div className="space-y-2">
                    {orders
                      .filter((o) => o.farmerId === currentUser.id)
                      .map((o) => (
                        <div key={o.id} className="border border-slate-100 rounded-lg p-3 text-xs flex justify-between items-center shadow-3xs">
                          <div>
                            <strong className="block text-gray-900">{o.productName} ({o.quantity} units)</strong>
                            <span className="text-[10px] text-gray-500 block">Ordered from: {o.shopName}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-gray-950 block">₹{o.totalPrice}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 inline-block rounded-full mt-1 ${
                              o.status === "Delivered" ? "bg-emerald-100 text-emerald-800" :
                              o.status === "Shipped" ? "bg-blue-100 text-blue-800" : "bg-amber-100 text-amber-850"
                            }`}>
                              {o.status}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Store Customer Request Inquiry transmission */}
              <div className="pt-6 border-t border-gray-100 space-y-4">
                <div>
                  <h4 className="font-bold text-xs text-gray-400 uppercase tracking-widest">Send Inquiry / Stock Request to Amit Bhai</h4>
                  <p className="text-[10px] text-gray-500">Ask the shop keeper about custom pesticide concentrations or raw seed supply shipments.</p>
                </div>

                <form onSubmit={handleSendInquiry} className="space-y-3 p-4 border border-slate-100 rounded-xl bg-slate-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">Subject</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Bulk Urea stock"
                        className="w-full bg-white px-2.5 py-1.5 border border-gray-200 rounded"
                        value={inquirySubject}
                        onChange={(e) => setInquirySubject(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">Inquiry Details</label>
                    <textarea
                      required
                      placeholder="Hi Amit, when do you get the organic potassium booster spray shipments?"
                      rows={2}
                      className="w-full bg-white text-xs p-2.5 border border-gray-200 rounded-lg focus:outline"
                      value={inquiryMsg}
                      onChange={(e) => setInquiryMsg(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end">
                    <button type="submit" className="bg-slate-700 hover:bg-slate-800 text-white font-bold px-4 py-1.5 rounded-lg text-xs cursor-pointer">
                      Send Request
                    </button>
                  </div>
                </form>

                {/* Received Replies */}
                <div className="space-y-3">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Active Store Inquiries</span>
                  {customerRequests.filter((r) => r.farmerId === currentUser.id).length === 0 ? (
                    <p className="text-gray-400 text-xs">No active inquiries submitted.</p>
                  ) : (
                    <div className="space-y-2.5">
                      {customerRequests
                        .filter((r) => r.farmerId === currentUser.id)
                        .map((req) => (
                          <div key={req.id} className="p-3 border border-gray-100 bg-white rounded-xl text-xs space-y-2 shadow-4xs">
                            <div className="flex justify-between items-start font-bold">
                              <span>Subject: {req.subject}</span>
                              <span className="text-[9px] text-gray-400 font-normal">{req.createdAt.split("T")[0]}</span>
                            </div>
                            <p className="text-gray-600 italic">“{req.message}”</p>
                            {req.replyText ? (
                              <div className="bg-emerald-50 rounded p-2 text-emerald-900 border-l-2 border-emerald-500">
                                <strong className="block text-[10px] uppercase tracking-wider text-emerald-850">Reply from Krishi Seva Kendra:</strong>
                                <p className="mt-0.5">{req.replyText}</p>
                              </div>
                            ) : (
                              <span className="text-amber-700 font-semibold text-[10px] block">⏳ Pending reply from Shop Owner</span>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
