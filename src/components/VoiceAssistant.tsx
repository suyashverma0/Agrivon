import React, { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import { motion, AnimatePresence } from "motion/react";
import { 
  Mic, MicOff, Volume2, Sparkles, HelpCircle, CornerDownLeft, 
  Play, X, Check, VolumeX, MessageSquare, Minimize2, Send, RotateCcw, 
  MapPin, CloudRain, ShieldAlert, ArrowUpRight
} from "lucide-react";

interface VoiceAssistantProps {
  onNavigate: (tabId: string) => void;
  availableTabs: Array<{ id: string; label: string }>;
}

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
  status?: "matched" | "unmatched" | "info" | "error";
  navigatedTab?: string;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onNavigate, availableTabs }) => {
  const { language, setLanguage, t, currentUser, localT } = useApp();
  
  // Widget Open State
  const [isOpen, setIsOpen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  // Voice recognition states
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [supported, setSupported] = useState(true);
  const [speakConfirm, setSpeakConfirm] = useState(true);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  
  // Chat context states
  const [chatInput, setChatInput] = useState("");
  const [isAskingAI, setIsAskingAI] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem("ag_ai_chat_history");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }));
      } catch (e) {
        // ignore
      }
    }
    
    // Default initial greetings
    return [
      {
        id: "greet-1",
        sender: "ai",
        text: "Namaste! 🙏 I am AGRIVON AI, your floating smart agricultural assistant. Speak or chat with me in English, हिन्दी or Hinglish! Tell me things like 'open weather' or ask 'organic soy farming tips'.",
        timestamp: new Date(),
        status: "info"
      }
    ];
  });

  const recognitionRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages, isAskingAI, isOpen]);

  // Persist chat history
  useEffect(() => {
    localStorage.setItem("ag_ai_chat_history", JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    // Check SpeechRecognition API support
    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition || 
      (window as any).mozSpeechRecognition || 
      (window as any).msSpeechRecognition;

    if (!SpeechRecognition) {
      setSupported(false);
    } else {
      setSupported(true);
      const rec = new SpeechRecognition();
      rec.continuous = false; // Stop automatically when user stops speaking to match native chatbot behavior
      rec.interimResults = true;
      
      rec.onstart = () => {
        setIsListening(true);
        setVoiceNotice(null);
      };

      rec.onresult = (event: any) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const trans = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += trans;
          } else {
            interimTranscript += trans;
          }
        }

        const activeTranscript = finalTranscript || interimTranscript;
        if (activeTranscript) {
          setTranscript(activeTranscript);
        }

        if (finalTranscript) {
          handleIncomingQuery(finalTranscript);
        }
      };

      rec.onerror = (event: any) => {
        console.error("Speech Recognition Error", event.error);
        
        switch (event.error) {
          case "not-allowed":
            setVoiceNotice("Microphone permission blocked. Please enable mic access. You can also type directly in the chat input!");
            break;
          case "no-speech":
            setVoiceNotice("No voice detected. Try speaking closer to your mic.");
            break;
          case "network":
            setVoiceNotice("Network connection issue in speech decoder.");
            break;
          default:
            setVoiceNotice(`Speech notice: ${event.error}. Feel free to use the text input.`);
        }
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [language]);

  // Update speech language of recognition
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = language === "hi" ? "hi-IN" : language === "hinglish" ? "hi-IN" : "en-IN";
    }
  }, [language]);

  // Commands lookup table
  const commandsMapList = [
    {
      tabId: "dashboard",
      triggers: [
        "dashboard", "home", "main", "overview", "mukhya", "shuruaat", "pehle", "first page", "ghar",
        "डैशबोर्ड", "होम", "मुख्य", "शुरुआत", "घर", "mukhiya shadow", "start", "shuru"
      ]
    },
    {
      tabId: "weather",
      triggers: [
        "weather", "alert", "rain", "temperature", "temp", "mausam", "barish", "bhavishya", "forecast", "heavy rain",
        "मौसम", "बारिश", "तापमान", "फोरकास्ट", "mausam kholo", "mausam updates", "weather details", "climate"
      ]
    },
    {
      tabId: "ai-disease",
      triggers: [
        "disease", "scan", "detect", "leaf", "camera", "pathologist", "bimari", "bimaari", "rog", "chehra", "patti", "patta",
        "बीमारी", "रोग", "पत्ता", "पट्टी", "पत्ती", "स्कैन", "bimari scan", "diagnose", "diagnosis"
      ]
    },
    {
      tabId: "medicine",
      triggers: [
        "recommendation", "medicine", "bio", "dawa", "davai", "upchar", "ilaaj", "ilaj", "treatment",
        "दवा", "इलाज", "उपचार", "जैविक दवा", "recommendations", "dawaiya"
      ]
    },
    {
      tabId: "prices",
      triggers: [
        "market", "price", "mandi", "bhav", "rate", "msp", "paisey", "paisa", "rupay", "rupaye",
        "मंडे", "मंडी", "भाव", "मूल्य", "रेट", "mandi rate", "mandi bhav"
      ]
    },
    {
      tabId: "community",
      triggers: [
        "community", "feed", "social", "samaj", "panchayat", "charcha", "post", "feeds",
        "कम्युनिटी", "चर्चा", "फीड", "पोस्ट", "समाज"
      ]
    },
    {
      tabId: "messages",
      triggers: [
        "message", "chat", "direct message", "baat", "baat-cheet", "baatchit", "sms", "bol", "chat rooms",
        "वार्तालाप", "बातचीत", "मैसेज", "चैट", "baat chit", "chating"
      ]
    },
    {
      tabId: "diary",
      triggers: [
        "diary", "schedule", "entry", "calender", "calendar", "kisani diary", "diary likhna", "schedule diary",
        "डायर", "डायरी", "कैलेंडर", "shchedule"
      ]
    },
    {
      tabId: "yield",
      triggers: [
        "predict", "yield", "future", "kamai", "fayda", "faida", "munafa", "prediction",
        "भविष्यवाणी", "कमाई", "फायदा", "मुनाफा", "उपज"
      ]
    },
    {
      tabId: "orders",
      triggers: [
        "order", "shop", "buy", "purchase", "samaan", "saman", "kharidari", "kharidna", "order list", "skins", "store",
        "ऑर्डर", "दुकान", "खरीदारी", "सामान", "orders"
      ]
    },
    {
      tabId: "inventory",
      triggers: [
        "inventory", "catalog", "products", "item", "stock", "stock list",
        "इन्वेंट्री", "स्टॉक", "कैटलॉग"
      ]
    },
    {
      tabId: "customers",
      triggers: [
        "customer", "requests", "client", "grahak",
        "ग्राहक", "क्लाइंट"
      ]
    },
    {
      tabId: "analytics",
      triggers: [
        "analytics", "sales", "earnings", "chart", "graph", "kamai report",
        "कमाई रिपोर्ट", "चार्ट"
      ]
    },
    {
      tabId: "jobs",
      triggers: [
        "job", "work", "hiring", "naukri", "kaam", "kam", "labor", "field work",
        "नौकरी", "काम", "मजदूरी"
      ]
    },
    {
      tabId: "applications",
      triggers: [
        "application", "applied", "history", "form", "request status", "applied jobs", "aavedan",
        "आवेदन", "स्टेटस"
      ]
    },
    {
      tabId: "profile",
      triggers: [
        "profile", "identity", "account", "biodata", "mera naam", "mera profile",
        "प्रोफ़ाइल", "खाता", "विवरण"
      ]
    },
    {
      tabId: "admin-dashboard",
      triggers: [
        "admin-dashboard", "admin dashboard", "control", "control panel", "central controller",
        "सैंडबॉक्स", "एडमिन", "कंट्रोल"
      ]
    }
  ];

  const speakFeedback = (text: string) => {
    if (!speakConfirm) return;
    const synth = window.speechSynthesis;
    if (synth) {
      try {
        synth.cancel(); // cancel previous Speech readout
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language === "hi" ? "hi-IN" : "en-US";
        utterance.rate = 1.05;
        synth.speak(utterance);
      } catch (e) {
        console.warn("SpeechSynthesis issue:", e);
      }
    }
  };

  // Main unified dispatcher for processing user's queries (both Voice and Text inputs)
  const handleIncomingQuery = async (queryText: string) => {
    if (!queryText.trim()) return;

    // Add User query as a message in the chat panel history
    const userMsgId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: "user",
      text: queryText,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMsg]);
    setTranscript("");

    const cleaned = queryText.toLowerCase().trim();
    console.log("Analyzing command routing:", cleaned);

    // Track matching tab or routings
    let foundTabId: string | null = null;
    let matchingTrigger = "";

    for (const item of commandsMapList) {
      for (const trig of item.triggers) {
        if (cleaned.includes(trig)) {
          foundTabId = item.tabId;
          matchingTrigger = trig;
          break;
        }
      }
      if (foundTabId) break;
    }

    if (foundTabId) {
      // Direct Navigation Controller command matched
      const isAllowedTab = availableTabs.some(tab => tab.id === foundTabId);
      if (isAllowedTab) {
        onNavigate(foundTabId);
        
        let replyString = "";
        if (language === "hi") {
          replyString = `निर्देशक कमांड चालू! आपको "${t("tab_" + foundTabId)}" पेज पर भेजा जा रहा है।`;
        } else if (language === "hinglish") {
          replyString = `Mil gaya! Redirecting you to "${t("tab_" + foundTabId)}" page.`;
        } else {
          replyString = `Command matched! Navigating you to the "${t("tab_" + foundTabId)}" portal section.`;
        }

        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: replyString,
          timestamp: new Date(),
          status: "matched",
          navigatedTab: foundTabId
        };

        setChatMessages(prev => [...prev, aiMsg]);
        speakFeedback(replyString);
      } else {
        // Tab is restricted for this user's current chosen role
        let restrictedString = "";
        if (language === "hi") {
          restrictedString = `क्षमा करें, "${t("tab_" + foundTabId)}" पेज आपके वर्तमान सक्रिय रोल "${currentUser.role}" के लिए वर्जित है।`;
        } else if (language === "hinglish") {
          restrictedString = `Bhaiyya, is page "${t("tab_" + foundTabId)}" par direct access aapke active custom role "${currentUser.role}" ke liye restricted hai.`;
        } else {
          restrictedString = `I matched "${t("tab_" + foundTabId)}", but that panel is restricted for your active character role: ${currentUser.role}.`;
        }

        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: restrictedString,
          timestamp: new Date(),
          status: "error"
        };

        setChatMessages(prev => [...prev, aiMsg]);
        speakFeedback(restrictedString);
      }
    } else {
      // Fallback: Dispatch request to server-side Gemini Model for conversational agricultural answer
      setIsAskingAI(true);
      try {
        const response = await fetch("/api/gemini/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: queryText,
            selectedLanguage: language,
            history: chatMessages.slice(-6).map(m => ({ sender: m.sender, text: m.text }))
          })
        });

        if (!response.ok) {
          throw new Error("Agrivon AI backend service error");
        }

        const data = await response.json();
        const aiResponseText = data.reply;

        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: aiResponseText,
          timestamp: new Date(),
          status: "unmatched"
        };

        setChatMessages(prev => [...prev, aiMsg]);
        speakFeedback(aiResponseText);
      } catch (err: any) {
        console.error("Gemini AI conversation error:", err);
        
        let errorReply = "I am having temporary trouble reaching the core cloud satellite services. Please query again in a moment.";
        if (language === "hi") {
          errorReply = "मौसम उपग्रह डेटा संचरण व्यस्त है। कृपया कुछ ही सेकंडों में पुनः प्रयास करें।";
        } else if (language === "hinglish") {
          errorReply = "Server busy hai, response aane me thodi dikkat ho rahi hai. Please thodi der me try karein!";
        }

        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: errorReply,
          timestamp: new Date(),
          status: "error"
        };
        setChatMessages(prev => [...prev, aiMsg]);
        speakFeedback(errorReply);
      } finally {
        setIsAskingAI(false);
      }
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const value = chatInput;
    setChatInput("");
    handleIncomingQuery(value);
  };

  const toggleListening = async () => {
    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch (e) {
        setIsListening(false);
      }
    } else {
      setTranscript("");
      setVoiceNotice(null);
      
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          await navigator.mediaDevices.getUserMedia({ audio: true });
          if (recognitionRef.current) {
            recognitionRef.current.start();
          } else {
            setVoiceNotice("Speech Recognition not initialized. Try typing instead!");
          }
        } catch (err) {
          console.error("Microphone access denied:", err);
          setVoiceNotice("Microphone access denied. Please grant browser permissions or type your query below.");
          setIsListening(false);
        }
      } else {
        try {
          recognitionRef.current?.start();
        } catch (err) {
          setVoiceNotice("Could not active native mic. Feel free to use the text bar simulator.");
        }
      }
    }
  };

  const clearChatHistory = () => {
    if (confirm("Are you sure you want to clear your conversation history?")) {
      const resetMsg: ChatMessage[] = [
        {
          id: "greet-reset",
          sender: "ai",
          text: "Agrivon AI history cleared. How can I help you today? 👍",
          timestamp: new Date(),
          status: "info"
        }
      ];
      setChatMessages(resetMsg);
    }
  };

  const handleSuggestionClick = (keyword: string) => {
    handleIncomingQuery(keyword);
  };

  return (
    <>
      {/* 1. FLOATING AI ASSISTANT召唤 FLOATING BUTTON */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="floating-trigger-btn"
            initial={{ scale: 0.6, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 h-15 w-15 md:h-16 md:w-16 rounded-full bg-emerald-600 border-2 border-emerald-400 text-white shadow-2xl flex items-center justify-center cursor-pointer overflow-hidden focus:outline-none"
            style={{ touchAction: "manipulation" }}
            id="floating-voice-assistant-trigger"
            title="Summon Agrivon AI Assistant"
          >
            {/* Ping effect ring animation when talking or idling */}
            <span className="absolute inset-0 rounded-full bg-emerald-400/25 animate-ping" style={{ animationDuration: '3s' }} />
            
            <div className="relative flex flex-col items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-300 absolute -top-1 -right-2 animate-bounce" />
              <Mic className="w-6 h-6 text-white" />
              <span className="text-[7.5px] font-black uppercase tracking-widest text-emerald-100 mt-0.5 leading-none">AI</span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* 2. EXPANDABLE FLOATING CHAT & VOICE PANEL WITH SLIDE/SCALE ANIMATIONS */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="floating-assistant-panel"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className={`fixed z-50 bg-slate-950 text-white shadow-2xl border border-emerald-500/25 flex flex-col overflow-hidden transition-all duration-300
              ${/* Responsive Styling: Desktop bottom-right vs Mobile Bottom Sheet */ ''}
              bottom-0 right-0 left-0 w-full h-[75vh] rounded-t-3xl md:bottom-6 md:right-6 md:left-auto md:w-[410px] md:h-[590px] md:rounded-3xl
            `}
            id="floating-ai-assistant-panel"
          >
            {/* Header Block in Deep Dark-Emerald Grid */}
            <div className="bg-gradient-to-r from-emerald-950 to-slate-900 border-b border-emerald-800/40 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <div className="absolute top-1 right-1 flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                  </div>
                  <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
                </div>
                
                <div>
                  <h3 className="font-extrabold text-sm tracking-wide text-white flex items-center gap-1.5">
                    AGRIVON AI
                  </h3>
                  <span className="text-[10px] text-emerald-400 font-bold block leading-none tracking-widest font-mono uppercase">
                    Speech & Text Companion
                  </span>
                </div>
              </div>

              {/* Action Buttons: Sound, Help, Clear, Minimize */}
              <div className="flex items-center gap-1">
                {/* Voice Feedback Readout Toggle */}
                <button
                  type="button"
                  onClick={() => setSpeakConfirm(!speakConfirm)}
                  className={`p-1.5 rounded-lg border transition min-h-[38px] ${speakConfirm ? "border-emerald-500/25 bg-emerald-950/40 text-emerald-300" : "border-slate-800 text-slate-500 hover:bg-slate-900"}`}
                  title={speakConfirm ? "Text-to-Speech active: Sound ON" : "Text-to-Speech active: Muted"}
                >
                  {speakConfirm ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
                </button>

                {/* Show Help instructions sheet */}
                <button
                  type="button"
                  onClick={() => setShowHelp(!showHelp)}
                  className={`p-1.5 rounded-lg border transition min-h-[38px] ${showHelp ? "border-amber-500/30 bg-amber-950/20 text-amber-300" : "border-slate-800 text-slate-400 hover:bg-slate-900"}`}
                  title="Show active Voice Dictionary instructions"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>

                {/* Clear local log */}
                <button
                  type="button"
                  onClick={clearChatHistory}
                  className="p-1.5 rounded-lg border border-slate-850 hover:bg-slate-900 text-slate-400 hover:text-rose-400 transition min-h-[38px]"
                  title="Clear conversation chat records"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Minimize Widget */}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-855 text-slate-300 hover:text-white transition duration-200 min-h-[38px] min-w-[38px] flex items-center justify-center border border-slate-800"
                  title="Minimize AI Chatbot Assistant"
                  id="btn-close-floating-assistant"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Language Option Tab Selector Row inside Assistant */}
            <div className="bg-slate-900/80 px-4 py-2 border-b border-slate-850 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 uppercase font-mono tracking-widest font-bold">Speech Recognition Dialect:</span>
              
              <div className="inline-flex bg-slate-950/80 p-0.5 rounded-lg border border-slate-800">
                {(["en", "hi", "hinglish"] as const).map((langId) => (
                  <button
                    key={langId}
                    type="button"
                    onClick={() => {
                      setLanguage(langId);
                      speakFeedback(langId === "hi" ? "हिंदी सेट" : langId === "hinglish" ? "Hinglish set" : "English speech model set");
                    }}
                    className={`px-2 py-1 rounded text-[10px] font-bold transition uppercase ${
                      language === langId 
                        ? "bg-emerald-600 text-white shadow-3xs" 
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {langId === "en" ? "EN 🇬🇧" : langId === "hi" ? "हिन्दी 🇮🇳" : "Hinglish 🗣️"}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable Chat Area */}
            <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-slate-950 relative" ref={scrollRef}>
              
              {/* HELP OVERLAY SHEET IN-WIDGET */}
              {showHelp && (
                <div className="bg-slate-900/95 border-2 border-emerald-500/30 p-4 rounded-2xl text-xs space-y-3 shadow-lg absolute inset-x-3 top-3 z-30">
                  <div className="flex items-center justify-between border-b border-emerald-800/40 pb-2">
                    <span className="font-extrabold text-emerald-400 flex items-center gap-1">
                      <HelpCircle className="w-4 h-4" /> COMMAND DICTIONARY
                    </span>
                    <button type="button" onClick={() => setShowHelp(false)} className="text-slate-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <p className="text-[11px] text-slate-300 leading-normal font-semibold">
                    Speak or type any of the trigger codes below to auto-navigate instantly, or ask any other agricultural questions straight to our satellite AI brains!
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[10px] max-h-56 overflow-y-auto pr-1">
                    <div className="p-2 bg-emerald-950/30 border border-emerald-900/30 rounded-xl hover:bg-emerald-950/50 cursor-pointer" onClick={() => handleSuggestionClick("open weather")}>
                      <strong className="text-white block mb-0.5">🌦️ Weather Page</strong>
                      <span className="text-slate-400 font-medium">"weather", "mausam", "barish forecast"</span>
                    </div>

                    <div className="p-2 bg-emerald-950/30 border border-emerald-900/30 rounded-xl hover:bg-emerald-950/50 cursor-pointer" onClick={() => handleSuggestionClick("scan disease")}>
                      <strong className="text-white block mb-0.5">📸 Leaf Scan</strong>
                      <span className="text-slate-400 font-medium">"detect leaf disease", "bimari check", "patti diagnostics"</span>
                    </div>

                    <div className="p-2 bg-emerald-950/30 border border-emerald-900/30 rounded-xl hover:bg-emerald-950/50 cursor-pointer" onClick={() => handleSuggestionClick("mandi bhav")}>
                      <strong className="text-white block mb-0.5">🪙 Prices</strong>
                      <span className="text-slate-400 font-medium">"mandi rates", "crop price bhav", "MSP"</span>
                    </div>

                    <div className="p-2 bg-emerald-950/30 border border-emerald-900/30 rounded-xl hover:bg-emerald-950/50 cursor-pointer" onClick={() => handleSuggestionClick("direct chat")}>
                      <strong className="text-white block mb-0.5">💬 Direct Chat</strong>
                      <span className="text-slate-400 font-medium">"open chat room", "baatchit karayein"</span>
                    </div>

                    <div className="p-2 bg-emerald-950/30 border border-emerald-900/30 rounded-xl hover:bg-emerald-950/50 cursor-pointer" onClick={() => handleSuggestionClick("jobs board")}>
                      <strong className="text-white block mb-0.5">💼 Jobs</strong>
                      <span className="text-slate-400 font-medium">"jobs board", "field labor work", "naukri list"</span>
                    </div>

                    <div className="p-2 bg-emerald-950/30 border border-emerald-900/30 rounded-xl hover:bg-emerald-950/50 cursor-pointer" onClick={() => handleSuggestionClick("organic medicine")}>
                      <strong className="text-white block mb-0.5">🧴 Remedies</strong>
                      <span className="text-slate-400 font-medium">"bio medicine", "crop treatment dawa"</span>
                    </div>
                  </div>
                </div>
              )}

              {/* General notices (e.g. Mic alerts) */}
              {voiceNotice && (
                <div className="p-3 bg-amber-950/30 border border-amber-500/20 text-amber-300 text-[11px] rounded-xl flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <p className="font-medium leading-normal">{voiceNotice}</p>
                </div>
              )}

              {!supported && (
                <div className="p-3 bg-indigo-950/40 border border-indigo-500/20 text-indigo-300 text-[11px] rounded-xl flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <p className="font-semibold leading-normal">
                    Voice mic input is sandboxed in this browser. Please use the styled interactive keyboard sending panel!
                  </p>
                </div>
              )}

              {/* Chat messages list */}
              {chatMessages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} items-start gap-2`}
                >
                  {msg.sender === "ai" && (
                    <div className="h-7 w-7 rounded-lg bg-emerald-950 border border-emerald-500/35 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                  )}
                  
                  <div className="space-y-1 max-w-[82%]">
                    <div 
                      className={`text-xs px-3.5 py-2.5 rounded-2xl font-medium leading-relaxed
                        ${msg.sender === "user" 
                          ? "bg-emerald-700 text-white rounded-tr-none shadow-xs" 
                          : msg.status === "matched"
                          ? "bg-slate-900 border border-emerald-500/40 text-emerald-100 rounded-tl-none font-bold shadow-sm"
                          : msg.status === "error"
                          ? "bg-rose-950/30 border border-rose-500/20 text-rose-200 rounded-tl-none font-semibold"
                          : "bg-slate-905 border border-slate-800 text-slate-100 rounded-tl-none"
                        }
                      `}
                    >
                      <p>{msg.text}</p>
                      
                      {msg.navigatedTab && (
                        <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md mt-2 font-black leading-none">
                          Jumped direct to <ArrowUpRight className="w-2.5 h-2.5 inline" /> {t("tab_" + msg.navigatedTab)}
                        </span>
                      )}
                    </div>
                    {/* Timestamp */}
                    <span className="text-[8.5px] text-slate-500 font-semibold block px-1 block text-right">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}

              {/* Loading AI reply state */}
              {isAskingAI && (
                <div className="flex justify-start items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-emerald-950 border border-emerald-500/35 flex items-center justify-center flex-shrink-0 animate-spin">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1.5 shadow-xs">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              {/* Quick suggestion tags floating in scroll helper */}
              {!isAskingAI && chatMessages.length < 5 && (
                <div className="pt-2 space-y-2">
                  <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block">Suggestion triggers:</span>
                  <div className="flex flex-wrap gap-1.5">
                    <button onClick={() => handleSuggestionClick("Open weather")} className="px-2.5 py-1 bg-slate-900 hover:bg-slate-850 hover:border-emerald-500/40 border border-slate-800 text-[10px] text-emerald-300 font-bold rounded-lg cursor-pointer transition">
                      ☀️ Mausam Info
                    </button>
                    <button onClick={() => handleSuggestionClick("Detect crop disease")} className="px-2.5 py-1 bg-slate-900 hover:bg-slate-850 hover:border-emerald-500/40 border border-slate-800 text-[10px] text-emerald-300 font-bold rounded-lg cursor-pointer transition">
                      🍁 Scan Leaf
                    </button>
                    <button onClick={() => handleSuggestionClick("Show mandi price rate")} className="px-2.5 py-1 bg-slate-900 hover:bg-slate-850 hover:border-emerald-500/40 border border-slate-800 text-[10px] text-emerald-300 font-bold rounded-lg cursor-pointer transition">
                      🪙 Mandi Rates
                    </button>
                    <button onClick={() => handleSuggestionClick("Paddy organic farming tips")} className="px-2.5 py-1 bg-slate-900 hover:bg-slate-850 hover:border-emerald-500/40 border border-slate-800 text-[10px] text-slate-300 font-bold rounded-lg cursor-pointer transition">
                      🌾 Rice Tips?
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Listening Wave Visualizer Strip at bottom of history (if active) */}
            {isListening && (
              <div className="bg-emerald-950/90 border-t border-emerald-500/20 px-4 py-2.5 flex items-center justify-between gap-3 animate-pulse">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  <span className="text-[10px] font-black uppercase text-emerald-300 tracking-widest leading-none">
                    {t("mic_listening")}...
                  </span>
                </div>

                <div className="flex items-center gap-1 overflow-hidden h-4 pr-2">
                  {[0.3, 0.8, 0.5, 0.9, 0.4, 0.7, 0.3, 0.8].map((val, idx) => (
                    <div 
                      key={idx} 
                      className="w-0.75 bg-emerald-400 rounded-full" 
                      style={{ height: `${val * 16}px`, animation: 'bounce 0.8s infinite', animationDelay: `${idx * 80}ms` }} 
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Real-time speech transcription buffer feedback box (if transcribing live) */}
            {transcript && (
              <div className="bg-slate-900 border-t border-slate-800 px-4 py-2 text-[11px] leading-relaxed italic text-emerald-300 font-medium">
                💬 Interpreting voice: <span className="text-white font-bold">"{transcript}"</span>
              </div>
            )}

            {/* Bottom Keyboard + Mic Sending Panel Form */}
            <form onSubmit={handleTextSubmit} className="bg-slate-900 border-t border-slate-800 p-3 flex items-center gap-2.5">
              
              {/* Mic Icon Click-to-speech Trigger */}
              <button
                type="button"
                onClick={toggleListening}
                className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center transition-all cursor-pointer min-h-[40px] min-w-[40px]
                  ${isListening 
                    ? "bg-red-500 hover:bg-red-600 text-white animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.4)]" 
                    : "bg-emerald-700 hover:bg-emerald-600 border border-emerald-500/20 text-white hover:scale-105"
                  }
                `}
                title="Click to dictate voice instruction"
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {/* Text box */}
              <div className="flex-grow relative flex items-center">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={localT(
                    "Ask or say 'weather'...",
                    "प्रश्न पूछें या 'mandi bhav' लिखें...",
                    "Ask or say 'weather'..."
                  )}
                  disabled={isAskingAI}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-600 text-xs px-3.5 pr-9 py-2.5 rounded-xl text-white placeholder-slate-500 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
                  id="assistant-keyboard-input"
                />
                
                {chatInput && (
                  <button
                    type="submit"
                    disabled={isAskingAI}
                    className="absolute right-2.5 text-emerald-400 hover:text-emerald-300 p-1 rounded-md cursor-pointer transition"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Execute Icon shortcut (alternate submit button) */}
              <button
                type="submit"
                disabled={isAskingAI || !chatInput.trim()}
                className="h-10 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] rounded-xl transition-all cursor-pointer flex items-center gap-1 py-1 sm:px-4 disabled:opacity-50 disabled:bg-slate-800 disabled:text-slate-400 min-h-[40px]"
              >
                <Play className="w-3 nav-arrow-icon" /> {localT("Send", "भेजें", "Send")}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
