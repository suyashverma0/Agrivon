import React, { createContext, useContext, useState, useEffect } from "react";
import {
  User,
  Role,
  Job,
  JobApplication,
  Product,
  Order,
  DiaryEntry,
  Message,
  FeedPost,
  CustomerRequest,
  CropPrice,
  WeatherInfo,
  JobCategory
} from "../types";
import { Language, translations } from "../lib/translations";

interface AppContextProps {
  currentUser: User;
  users: User[];
  jobs: Job[];
  applications: JobApplication[];
  products: Product[];
  orders: Order[];
  diaryEntries: DiaryEntry[];
  messages: Message[];
  feedPosts: FeedPost[];
  customerRequests: CustomerRequest[];
  cropPrices: CropPrice[];
  weather: WeatherInfo;
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: "green" | "classic";
  setTheme: (theme: "green" | "classic") => void;
  t: (key: string) => string;
  localT: (english: string, hindi: string, hinglish?: string) => string;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  setCurrentUserById: (id: string) => void;
  registerNewUser: (role: Role, profileData: any, email: string, password?: string, mobileNumber?: string) => User;
  updateFarmerProfile: (profile: any) => void;
  updateShopProfile: (profile: any) => void;
  updateWorkerProfile: (profile: any) => void;
  createJob: (jobData: Omit<Job, "id" | "farmerId" | "farmerName" | "status" | "createdAt">) => void;
  applyForJob: (jobId: string) => void;
  updateApplicationStatus: (appId: string, status: "Accepted" | "Rejected") => void;
  createProduct: (productData: Omit<Product, "id" | "shopOwnerId" | "shopName">) => void;
  addProduct: (productData: Omit<Product, "id" | "shopOwnerId" | "shopName">) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  placeOrder: (productId: string, quantity: number, address: string) => void;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  addDiaryEntry: (cropName: string, activityType: DiaryEntry["activityType"], notes: string) => void;
  sendChatMessage: (receiverId: string, content: string) => void;
  createFeedPost: (content: string) => void;
  likeFeedPost: (postId: string) => void;
  addCommentToPost: (postId: string, content: string) => void;
  sendCustomerRequest: (shopOwnerId: string, subject: string, message: string) => void;
  replyToCustomerRequest: (requestId: string, replyText: string) => void;
  triggerSystemDemoAction: (actionType: string) => void;
  requestUserLocation: () => Promise<void>;
  setManualLocation: (cityName: string, lat?: number, lon?: number) => Promise<void>;
  setWeatherWarning: (warning: string) => void;
  setCropPrices: (prices: CropPrice[]) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

// Rich Initial Pre-Seeded Data
const INITIAL_USERS: User[] = [
  {
    id: "user-admin",
    email: "admin@agrivon.com",
    role: "SuperAdmin",
    password: "AdminSecurePassword123",
    mobileNumber: "9999999999",
    workerProfile: {
      name: "Super Administrator",
      village: "Central Command",
      skills: "Platform Controls, Moderation, Sandbox Settings",
      experience: 8,
      dailyWageExpectation: 1000,
      availabilityStatus: "Available"
    }
  }
];

const INITIAL_JOBS: Job[] = [
  {
    id: "job-1",
    farmerId: "user-rajesh",
    farmerName: "Rajesh Kumar",
    title: "Urgent Rice Harvesting",
    category: "Harvesting",
    description: "Looking for 3 skilled experience hands to assist in harvesting 4 acres of Paddy crop. Sickles and bags provided. Refreshments will be given in the field twice daily.",
    village: "Kanakpur",
    state: "Uttar Pradesh",
    wage: 480,
    durationDays: 3,
    startDate: "2026-06-16",
    status: "Open",
    createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: "job-2",
    farmerId: "user-savitri",
    farmerName: "Savitri Devi",
    title: "Pesticide Spraying for Sugarcane pest control",
    category: "Pesticide Spraying",
    description: "Need an experienced worker with safety mask comfort to spray 2 acres of sugarcane fields. High priority.",
    village: "Kanakpur",
    state: "Uttar Pradesh",
    wage: 450,
    durationDays: 1,
    startDate: "2026-06-14",
    status: "Open",
    createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString()
  }
];

const INITIAL_APPLICATIONS: JobApplication[] = [
  {
    id: "app-1",
    jobId: "job-1",
    jobTitle: "Urgent Rice Harvesting",
    farmerId: "user-rajesh",
    farmerName: "Rajesh Kumar",
    workerId: "user-sunil",
    workerName: "Sunil Yadav",
    workerSkills: "Harvesting, Pesticide Spraying, Tractor Operation",
    workerWageExpectation: 450,
    status: "Pending",
    createdAt: new Date(Date.now() - 1.5 * 24 * 3600 * 1000).toISOString()
  }
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    shopOwnerId: "user-amit",
    shopName: "Krishi Seva Kendra",
    shopOwnerName: "Amit Kumar",
    name: "Neem Gold Bio-Pesticide (1 Litre)",
    category: "Pesticide",
    description: "100% organic neem kernel extract. Controls whiteflies, aphids, thrips, and leaf miners effectively.",
    price: 320,
    stockCount: 45,
    image: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&q=80&w=150",
    brandName: "Katyayani Organics",
    composition: "Azadirachtin 0.15% EC (1500 PPM) Neem Seed Concentrate",
    cropCompatibility: "Rice, Sugarcane, Sorghum, Cotton, Vegetables",
    dosageInstructions: "3-5 ml per Litre of clean water. Spray both sides of leaves thoroughly.",
    mfgDate: "2026-02-15",
    expiryDate: "2028-02-14",
    govtLicense: "CIB&RC/Reg-10825/Neem/2025",
    expectedYieldBoost: "12% reduction in insect infestations and shoot borer losses",
    safetyPrecautions: "Keep away from foodstuff. Hand wash with soap post-spraying. Wear eye shields.",
    soilCompatibility: "Applicable across all soil types via foliar drenching"
  },
  {
    id: "prod-2",
    shopOwnerId: "user-amit",
    shopName: "Krishi Seva Kendra",
    shopOwnerName: "Amit Kumar",
    name: "Hybrid Basmati Seed No. 1121 (10kg Bag)",
    category: "Seed",
    description: "High grain length, disease-resistant variety, excellent market cooking pricing potential.",
    price: 850,
    stockCount: 120,
    image: "https://images.unsplash.com/photo-1595273670150-db0a3bf44279?auto=format&fit=crop&q=80&w=150",
    originalPrice: 950,
    isPromo: true,
    brandName: "Pioneer Seeds Co.",
    composition: "F1 Genetically Sorted Basmati Paddy Seeds (Purity: 99.2%)",
    cropCompatibility: "Kharif Monsoon Sowing Only",
    dosageInstructions: "8-10 kg of seeds per Acre of nursery beds.",
    mfgDate: "2026-01-10",
    expiryDate: "2027-07-09",
    govtLicense: "UP-A-6582-AGR-SEEDS",
    expectedYieldBoost: "25-30% higher premium cooking grain elongation, high market value.",
    safetyPrecautions: "Treated with Carbendazim. Do not consume or feed to animals.",
    soilCompatibility: "Clayey, deep alluvial silt, or water-retaining clayey-loam"
  },
  {
    id: "prod-3",
    shopOwnerId: "user-amit",
    shopName: "Krishi Seva Kendra",
    shopOwnerName: "Amit Kumar",
    name: "Premium NPK 19:19:19 Fertilizer (5kg Bag)",
    category: "Fertilizer",
    description: "Water-soluble fertilizer containing all vital macro-elements in optimal equal formulation ratios.",
    price: 490,
    stockCount: 8,
    image: "https://images.unsplash.com/photo-1574325131876-a79996ed93ab?auto=format&fit=crop&q=80&w=150",
    brandName: "IFFCO India",
    composition: "Nitrogen 19%, Phosphate 19%, Soluble Potash 19% (Triple Balanced)",
    cropCompatibility: "Wheat, Sugarcane, Chana, Mustard, Maize, Onion",
    dosageInstructions: "4-5g per Litre of water for foliar spray. 3kg per acre for drip system.",
    mfgDate: "2026-03-01",
    expiryDate: "2029-02-28",
    govtLicense: "FCO-REG-1925/NPK/UP04",
    expectedYieldBoost: "Rapid early vegetative leaf greening and robust root network spike within 10 days.",
    safetyPrecautions: "Keep in a dry, ventilated place. Wear gloves during field broadcasting.",
    soilCompatibility: "Slightly acidic to neutral neutral silt soils"
  },
  {
    id: "prod-4",
    shopOwnerId: "user-amit",
    shopName: "Krishi Seva Kendra",
    shopOwnerName: "Amit Kumar",
    name: "Ergonomic Agri-Sprayer (16 Litre Tank)",
    category: "Tool",
    description: "Backpack mechanical manual pump sprayer with comfortable adjustable shoulder straps.",
    price: 1250,
    stockCount: 20,
    image: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=150",
    brandName: "Stihl Tools",
    composition: "High Density Polyethylene (HDPE) Tank, Brass Lance Nozzles",
    cropCompatibility: "Supports all chemical foliar spray applications",
    dosageInstructions: "Calibrate nozzle to fine mist dispersion for insecticide coverage.",
    mfgDate: "2025-11-20",
    expiryDate: "N/A (3 Year Mechanical Parts Warranty Included)",
    govtLicense: "ISO-9001-Certified Tooling Standards",
    expectedYieldBoost: "Uniform chemical distribution preventing local drug waste overruns.",
    safetyPrecautions: "Decompress pressure fully after spraying. Flush with clean water after use.",
    soilCompatibility: "N/A"
  }
];

const INITIAL_ORDERS: Order[] = [
  {
    id: "ord-1",
    farmerId: "user-rajesh",
    farmerName: "Rajesh Kumar",
    shopOwnerId: "user-amit",
    shopName: "Krishi Seva Kendra",
    productId: "prod-1",
    productName: "Neem Gold Bio-Pesticide (1 Litre)",
    quantity: 2,
    totalPrice: 640,
    status: "Delivered",
    farmerAddress: "House 24, Kanakpur High School Road",
    createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: "ord-2",
    farmerId: "user-rajesh",
    farmerName: "Rajesh Kumar",
    shopOwnerId: "user-amit",
    shopName: "Krishi Seva Kendra",
    productId: "prod-2",
    productName: "Hybrid Basmati Seed No. 1121 (10kg Bag)",
    quantity: 1,
    totalPrice: 850,
    status: "Shipped",
    farmerAddress: "House 24, Kanakpur High School Road",
    createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString()
  }
];

const INITIAL_DIARY: DiaryEntry[] = [
  {
    id: "diary-1",
    farmerId: "user-rajesh",
    cropName: "Paddy (Basmati)",
    activityType: "Planting",
    notes: "Nursery sowing completed in well-irrigated plot. Added vermicompost organically.",
    date: "2026-05-15"
  },
  {
    id: "diary-2",
    farmerId: "user-rajesh",
    cropName: "Paddy (Basmati)",
    activityType: "Irrigation",
    notes: "Transplantation plots flooded with 3cm water levels. Working smoothly.",
    date: "2026-06-02"
  }
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: "msg-1",
    senderId: "user-amit",
    senderName: "Amit Patel (Owner)",
    senderRole: "ShopOwner",
    receiverId: "user-rajesh",
    receiverName: "Rajesh Kumar",
    content: "Greetings Rajesh Ji! Your order of Hybrid Basmati is shipped. Sunil will deliver it on his bike.",
    createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString()
  },
  {
    id: "msg-2",
    senderId: "user-rajesh",
    senderName: "Rajesh Kumar",
    senderRole: "Farmer",
    receiverId: "user-amit",
    receiverName: "Amit Patel",
    content: "Thank you Amit Ji, let me know if you get new organic nitrogen booster inventory soon.",
    createdAt: new Date(Date.now() - 11.8 * 3600 * 1000).toISOString()
  }
];

const INITIAL_FEED: FeedPost[] = [
  {
    id: "post-1",
    authorId: "user-rajesh",
    authorName: "Rajesh Kumar",
    authorRole: "Farmer",
    content: "Wheat yield was phenomenal this year, got 24 quintals per acre on block B using organic cow-manure. Strongly recommend testing soil nitrogen deficiency before high nitrogen application!",
    likesCount: 5,
    likedBy: ["user-savitri", "user-amit"],
    comments: [
      {
        id: "comm-1",
        authorName: "Savitri Devi",
        authorRole: "Farmer",
        content: "Brilliant results Rajesh! Did you utilize deep tilling or zero tillage?",
        createdAt: new Date(Date.now() - 22 * 3600 * 1000).toISOString()
      },
      {
        id: "comm-2",
        authorName: "Rajesh Kumar",
        authorRole: "Farmer",
        content: "Savitri, I used shallow rotavator tilling this round to hold moisture.",
        createdAt: new Date(Date.now() - 21 * 3600 * 1000).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
  }
];

const INITIAL_CUSTOMER_REQUESTS: CustomerRequest[] = [
  {
    id: "req-1",
    farmerId: "user-rajesh",
    farmerName: "Rajesh Kumar",
    shopOwnerId: "user-amit",
    subject: "Availability of Organic Fungicide",
    message: "Hi Amit Bhai, do you have chemical substitutes or organic copper fungicides to spray for rice blast? My nursery crops are developing slight lesions.",
    createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    replyText: "Yes Rajesh! I have Bordeaux Mixture spray and Tricyclazole powder in stock. Come over to collect anytime."
  }
];

const CROP_PRICES: CropPrice[] = [
  { name: "Paddy (Kanal / Basmati)", currentPrice: 4250, changePercent: 2.1, history: [4100, 4120, 4150, 4180, 4220, 4250], market: "Mandi Kanakpur" },
  { name: "Wheat (Sonalika)", currentPrice: 2275, changePercent: -0.5, history: [2300, 2290, 2295, 2280, 2285, 2275], market: "Mandi Kanakpur" },
  { name: "Sugarcane (Co-0238)", currentPrice: 385, changePercent: 1.2, history: [375, 378, 380, 382, 381, 385], market: "UP State Mandi" },
  { name: "Mustard Seeds", currentPrice: 5600, changePercent: 4.8, history: [5300, 5350, 5400, 5480, 5500, 5600], market: "Mansi Grains Yard" },
  { name: "Potato (Jyoti Variety)", currentPrice: 1450, changePercent: -3.2, history: [1550, 1540, 1500, 1480, 1490, 1450], market: "Local Mandi" }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from local storage or fallback to initial preseeds
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("ag_lang");
    return (saved as Language) || "en";
  });

  const [theme, setThemeState] = useState<"green" | "classic">(() => {
    const saved = localStorage.getItem("ag_theme");
    return (saved as "green" | "classic") || "green";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("ag_lang", lang);
  };

  const setTheme = (thm: "green" | "classic") => {
    setThemeState(thm);
    localStorage.setItem("ag_theme", thm);
  };

  const t = (key: string): string => {
    const langDict = translations[language];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    return translations["en"]?.[key] || key;
  };

  const localT = (english: string, hindi: string, hinglish?: string): string => {
    if (language === "hi") return hindi;
    if (language === "hinglish") return hinglish || hindi || english;
    return english;
  };

  const [isAuthenticated, setIsAuthenticatedState] = useState<boolean>(() => {
    return localStorage.getItem("ag_authenticated") === "true";
  });

  const setIsAuthenticated = (auth: boolean) => {
    setIsAuthenticatedState(auth);
    localStorage.setItem("ag_authenticated", auth ? "true" : "false");
    if (!auth) {
      localStorage.removeItem("ag_curr_user_id");
    }
  };

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem("ag_users");
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const savedId = localStorage.getItem("ag_curr_user_id");
    const currentList = localStorage.getItem("ag_users");
    const list = currentList ? JSON.parse(currentList) : INITIAL_USERS;
    if (savedId) {
      const match = list.find((u: User) => u.id === savedId);
      if (match) return match;
    }
    return list[0] || { id: "none", email: "", role: "None" }; 
  });

  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem("ag_jobs");
    return saved ? JSON.parse(saved) : INITIAL_JOBS;
  });

  const [applications, setApplications] = useState<JobApplication[]>(() => {
    const saved = localStorage.getItem("ag_applications");
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem("ag_products");
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem("ag_orders");
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>(() => {
    const saved = localStorage.getItem("ag_diary");
    return saved ? JSON.parse(saved) : INITIAL_DIARY;
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem("ag_messages");
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [feedPosts, setFeedPosts] = useState<FeedPost[]>(() => {
    const saved = localStorage.getItem("ag_feed");
    return saved ? JSON.parse(saved) : INITIAL_FEED;
  });

  const [customerRequests, setCustomerRequests] = useState<CustomerRequest[]>(() => {
    const saved = localStorage.getItem("ag_requests");
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMER_REQUESTS;
  });

  const DEFAULT_WEATHER_DATA_BY_CITY: Record<string, any> = {
    "Lucknow": {
      temp: 34,
      condition: "Sunny",
      humidity: 58,
      windSpeed: 12,
      warning: "Monsoon rains approaching next week. Ensure high drainage pathways are clear in low sugarcane fields.",
      village: "Lucknow",
      rainProbability: 18,
      sunrise: "05:14 AM",
      sunset: "07:02 PM",
      forecast: [
        { dayOffset: 0, temp: 34, cond: "Sunny", rain: "18%", label: "Optimal sowing" },
        { dayOffset: 1, temp: 35, cond: "Sunny", rain: "10%", label: "Optimal sowing" },
        { dayOffset: 2, temp: 31, cond: "Cloudy", rain: "25%", label: "Slight weeding" },
        { dayOffset: 3, temp: 28, cond: "Rainy", rain: "85%", label: "Clear drainage!" },
        { dayOffset: 4, temp: 27, cond: "Stormy", rain: "90%", label: "Drain water logged" },
        { dayOffset: 5, temp: 30, cond: "Cloudy", rain: "40%", label: "Aerated space" },
        { dayOffset: 6, temp: 33, cond: "Sunny", rain: "15%", label: "Fertilizer spray" },
      ]
    },
    "Nagpur": {
      temp: 38,
      condition: "Sunny",
      humidity: 45,
      windSpeed: 14,
      warning: "Extreme heat advisory active. Avoid mid-day direct labor operations to prevent heat stroke.",
      village: "Nagpur",
      rainProbability: 5,
      sunrise: "05:32 AM",
      sunset: "06:50 PM",
      forecast: [
        { dayOffset: 0, temp: 38, cond: "Sunny", rain: "5%", label: "Water crops daily" },
        { dayOffset: 1, temp: 39, cond: "Sunny", rain: "5%", label: "Provide shading" },
        { dayOffset: 2, temp: 37, cond: "Sunny", rain: "10%", label: "Drip irrigation" },
        { dayOffset: 3, temp: 36, cond: "Cloudy", rain: "20%", label: "Weeding ideal" },
        { dayOffset: 4, temp: 33, cond: "Rainy", rain: "65%", label: "Farming relief!" },
        { dayOffset: 5, temp: 32, cond: "Cloudy", rain: "30%", label: "Sowing prep" },
        { dayOffset: 6, temp: 35, cond: "Sunny", rain: "10%", label: "Fertilizer spraying" },
      ]
    },
    "Bhatinda": {
      temp: 32,
      condition: "Windy",
      humidity: 62,
      windSpeed: 32,
      warning: "Dust storm warnings in place over northern Punjab. Protect seedlings from loose dust drift.",
      village: "Bhatinda",
      rainProbability: 15,
      sunrise: "05:22 AM",
      sunset: "07:35 PM",
      forecast: [
        { dayOffset: 0, temp: 32, cond: "Windy", rain: "15%", label: "Secure nurseries" },
        { dayOffset: 1, temp: 30, cond: "Stormy", rain: "45%", label: "Dust drift shields" },
        { dayOffset: 2, temp: 31, cond: "Cloudy", rain: "15%", label: "Irrigation check" },
        { dayOffset: 3, temp: 33, cond: "Sunny", rain: "8%", label: "Plow soil" },
        { dayOffset: 4, temp: 34, cond: "Sunny", rain: "5%", label: "Fertilize wheat" },
        { dayOffset: 5, temp: 35, cond: "Sunny", rain: "5%", label: "Basal dressing" },
        { dayOffset: 6, temp: 34, cond: "Sunny", rain: "8%", label: "Transplanting" },
      ]
    },
    "Patna": {
      temp: 29,
      condition: "Rainy",
      humidity: 88,
      windSpeed: 10,
      warning: "Heavy soil saturation graining. Rain and dampness provides major rice seedling water supplies.",
      village: "Patna",
      rainProbability: 95,
      sunrise: "05:00 AM",
      sunset: "06:45 PM",
      forecast: [
        { dayOffset: 0, temp: 29, cond: "Rainy", rain: "95%", label: "Hold bio-sprays" },
        { dayOffset: 1, temp: 28, cond: "Rainy", rain: "90%", label: "Check checkdams" },
        { dayOffset: 2, temp: 27, cond: "Stormy", rain: "85%", label: "Drain low plots" },
        { dayOffset: 3, temp: 30, cond: "Cloudy", rain: "45%", label: "Silt monitoring" },
        { dayOffset: 4, temp: 31, cond: "Cloudy", rain: "30%", label: "Weed manual pull" },
        { dayOffset: 5, temp: 32, cond: "Sunny", rain: "15%", label: "Optimal sowing" },
        { dayOffset: 6, temp: 33, cond: "Sunny", rain: "10%", label: "Optimal sowing" },
      ]
    },
    "Indore": {
      temp: 31,
      condition: "Cloudy",
      humidity: 70,
      windSpeed: 16,
      warning: "Normal soil dampness, high beneficial humidity for organic soy plant cultivation.",
      village: "Indore",
      rainProbability: 40,
      sunrise: "05:35 AM",
      sunset: "07:12 PM",
      forecast: [
        { dayOffset: 0, temp: 31, cond: "Cloudy", rain: "40%", label: "Soybean planting" },
        { dayOffset: 1, temp: 29, cond: "Rainy", rain: "75%", label: "No chemical sprays" },
        { dayOffset: 2, temp: 30, cond: "Cloudy", rain: "35%", label: "Aerated space" },
        { dayOffset: 3, temp: 32, cond: "Sunny", rain: "10%", label: "Normal watering" },
        { dayOffset: 4, temp: 33, cond: "Sunny", rain: "5%", label: "Micro nutrient sow" },
        { dayOffset: 5, temp: 34, cond: "Sunny", rain: "10%", label: "Deep tillage" },
        { dayOffset: 6, temp: 32, cond: "Cloudy", rain: "25%", label: "Irrigation check" },
      ]
    },
    "Kanakpur": {
      temp: 34,
      condition: "Sunny",
      humidity: 58,
      windSpeed: 12,
      warning: "Optimal weather for early sugarcane transplantation. Active soil monitoring.",
      village: "Kanakpur",
      rainProbability: 18,
      sunrise: "05:14 AM",
      sunset: "07:02 PM",
      forecast: [
        { dayOffset: 0, temp: 34, cond: "Sunny", rain: "18%", label: "Optimal sowing" },
        { dayOffset: 1, temp: 35, cond: "Sunny", rain: "10%", label: "Optimal sowing" },
        { dayOffset: 2, temp: 31, cond: "Cloudy", rain: "25%", label: "Slight weeding" },
        { dayOffset: 3, temp: 28, cond: "Rainy", rain: "85%", label: "Clear drainage!" },
        { dayOffset: 4, temp: 27, cond: "Stormy", rain: "90%", label: "Drain water logged" },
        { dayOffset: 5, temp: 30, cond: "Cloudy", rain: "40%", label: "Aerated space" },
        { dayOffset: 6, temp: 33, cond: "Sunny", rain: "15%", label: "Fertilizer spray" },
      ]
    },
    "Pune": {
      temp: 26,
      condition: "Cloudy",
      humidity: 78,
      windSpeed: 21,
      warning: "Strong winds drove coastal damp cloud layers inland. High air circulation is positive.",
      village: "Pune",
      rainProbability: 30,
      sunrise: "05:48 AM",
      sunset: "07:10 PM",
      forecast: [
        { dayOffset: 0, temp: 26, cond: "Cloudy", rain: "30%", label: "Tie creeper stalks" },
        { dayOffset: 1, temp: 25, cond: "Rainy", rain: "60%", label: "Stake vertical crops" },
        { dayOffset: 2, temp: 24, cond: "Rainy", rain: "80%", label: "Stake vertical crops" },
        { dayOffset: 3, temp: 26, cond: "Cloudy", rain: "45%", label: "Clear silt blockages" },
        { dayOffset: 4, temp: 27, cond: "Cloudy", rain: "25%", label: "Trimming branches" },
        { dayOffset: 5, temp: 28, cond: "Sunny", rain: "15%", label: "Bio-fertilizers OK" },
        { dayOffset: 6, temp: 29, cond: "Sunny", rain: "10%", label: "Stable harvest path" },
      ]
    }
  };

  const getConditionFromCode = (code: number, windSpeed: number): "Sunny" | "Rainy" | "Cloudy" | "Stormy" | "Windy" => {
    if (windSpeed > 30) return "Windy";
    if ([95, 96, 99].includes(code)) return "Stormy";
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82, 85, 86].includes(code)) return "Rainy";
    if ([1, 2, 3, 45, 48].includes(code)) return "Cloudy";
    return "Sunny";
  };

  const generateCustomFarmerFeatures = (cityName: string, temp: number, humidity: number, windSpeed: number, rainProb: number, condition: string) => {
    let rainAlert = "Low probability of precipitation. Maintain standard hydration patterns.";
    if (rainProb >= 70) {
      rainAlert = `⛈️ High probability of rain (${rainProb}%) in the next 24-48 hours. Secure stored harvests and clear blockages in low fields immediately!`;
    } else if (rainProb >= 40) {
      rainAlert = `🌦️ Moderate probability of rain (${rainProb}%). Prepare field bunds to conserve incoming water.`;
    }

    let cropAdvisory = "Atmospheric status is supportive of ongoing seasonal farming activities.";
    if (condition === "Rainy" || condition === "Stormy") {
      cropAdvisory = "🌧️ Ground moisture is high. Suspend all weedicide applications, chemical sprays, and basmati nursery transplantation to avoid runoff.";
    } else if (temp > 35) {
      cropAdvisory = "🔥 High thermal stress detected. Introduce green shading systems over fragile saplings and transplant only during late evenings.";
    } else if (humidity > 80 && temp > 25) {
      cropAdvisory = "🧴 High warmth and dampness represents high risk for blight and fungal spore proliferation. Monitor lower leaves carefully.";
    }

    let extremeHeatWarning = "";
    if (temp >= 38) {
      extremeHeatWarning = `🚨 EXTREME HEAT ALERT (Temp: ${temp}°C): High evaporative stress. Keep field moisture stable and avoid manual labor during peak solar radiation (11 AM to 4 PM).`;
    }

    let stormWarning = "";
    if (windSpeed >= 25 || condition === "Stormy") {
      stormWarning = `🌪️ SEVERE WIND WARNING (Wind: ${windSpeed} km/h): Strong gusts can cause crop lodging. Stake vertical sugarcane and vine creepers, and halt sprinkler systems.`;
    }

    let irrigationRecommendation = "Standard micro-irrigation schedules can be executed.";
    if (rainProb >= 75) {
      irrigationRecommendation = "🚫 IRRIGATION ADVISORY: Rainfall imminent. Disable tube wells, drip lines, and pumps immediately to avoid double watering and anaerobic root decay.";
    } else if (temp > 36) {
      irrigationRecommendation = "💧 IRRIGATION ADVISORY: Rapid evapotranspiration. Deliver a deep 30mm wetting cycle before dawn to maintain robust cell structure.";
    } else if (humidity < 40) {
      irrigationRecommendation = "💧 IRRIGATION ADVISORY: Ambient air is exceptionally dry. Implement short periodic sprinkler bursts to raise microclimate humidity levels.";
    }

    return {
      rainAlert,
      cropAdvisory,
      extremeHeatWarning: extremeHeatWarning || undefined,
      stormWarning: stormWarning || undefined,
      irrigationRecommendation
    };
  };

  const generateLanguageSummaries = (cityName: string, temp: number, rainProb: number) => {
    return {
      englishSummary: `Current temperature in ${cityName} is ${temp}°C with a ${rainProb}% chance of rain.`,
      hindiSummary: `${cityName} mein aaj ${temp}°C hai. Baarish ki sambhavana ${rainProb}% hai.`,
      hinglishSummary: `${cityName} mein aaj ${temp}°C temperature hai. Rain chance ${rainProb}% hai.`
    };
  };

  const [cropPrices, setCropPricesState] = useState<CropPrice[]>(() => {
    const saved = localStorage.getItem("ag_crop_prices");
    return saved ? JSON.parse(saved) : CROP_PRICES;
  });

  const setCropPrices = (prices: CropPrice[]) => {
    setCropPricesState(prices);
    localStorage.setItem("ag_crop_prices", JSON.stringify(prices));
  };

  const [weather, setWeatherState] = useState<WeatherInfo>(() => {
    const saved = localStorage.getItem("ag_weather_cache");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return {
      temp: 34,
      condition: "Sunny",
      humidity: 58,
      windSpeed: 12,
      warning: "Monsoon rains approaching next week. Ensure high drainage pathways are clear in low sugarcane fields.",
      village: "Lucknow",
      rainProbability: 18,
      sunrise: "05:14 AM",
      sunset: "07:02 PM",
      forecast: [
        { day: "Sat", temp: 34, cond: "Sunny", rain: "18%", label: "Optimal sowing" },
        { day: "Sun", temp: 35, cond: "Sunny", rain: "10%", label: "Optimal sowing" },
        { day: "Mon", temp: 31, cond: "Cloudy", rain: "25%", label: "Slight weeding" },
        { day: "Tue", temp: 28, cond: "Rainy", rain: "85%", label: "Clear drainage!" },
        { day: "Wed", temp: 27, cond: "Stormy", rain: "90%", label: "Drain water logged" },
        { day: "Thu", temp: 30, cond: "Cloudy", rain: "40%", label: "Aerated space" },
        { day: "Fri", temp: 33, cond: "Sunny", rain: "15%", label: "Fertilizer spray" },
      ],
      englishSummary: "Current temperature in Lucknow is 34°C with a 18% chance of rain.",
      hindiSummary: "Lucknow mein aaj 34°C hai. Baarish ki sambhavana 18% hai.",
      hinglishSummary: "Lucknow mein aaj 34°C temperature hai. Rain chance 18% hai.",
      isFetching: false
    };
  });

  const fetchWeatherByCoords = async (latitude: number, longitude: number, cityName?: string) => {
    setWeatherState(prev => ({ ...prev, isFetching: true, errorMsg: undefined }));
    try {
      let finalCityName = cityName;
      if (!finalCityName) {
        try {
          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`,
            { headers: { "User-Agent": "AgrivonPortalApp/1.0" } }
          );
          if (geoRes.ok) {
            const geoData = await geoRes.json();
            const addr = geoData.address;
            finalCityName = addr.city || addr.town || addr.village || addr.suburb || addr.municipality || addr.state_district || "Detected Location";
          }
        } catch (err) {
          console.warn("Reverse geocoding failed:", err);
        }
      }

      if (!finalCityName) {
        finalCityName = `GPS (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`;
      }

      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max&timezone=auto`
      );
      
      if (!weatherRes.ok) {
        throw new Error("Failed to retrieve live meteorology records");
      }

      const data = await weatherRes.json();
      const current = data.current;
      const daily = data.daily;

      const temp = Math.round(current.temperature_2m);
      const humidity = Math.round(current.relative_humidity_2m);
      const windSpeed = Math.round(current.wind_speed_10m);
      const conditionCode = current.weather_code;
      const cond = getConditionFromCode(conditionCode, windSpeed);

      const rainProbability = daily.precipitation_probability_max ? Math.round(daily.precipitation_probability_max[0]) : 15;
      
      const formatTime = (isoString?: string) => {
        if (!isoString) return "--:--";
        try {
          const d = new Date(isoString);
          return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (e) {
          return "--:--";
        }
      };

      const sunrise = formatTime(daily.sunrise?.[0]);
      const sunset = formatTime(daily.sunset?.[0]);

      const DAYS_ABBR = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const forecastList = [];
      
      if (daily.time) {
        for (let i = 0; i < Math.min(daily.time.length, 7); i++) {
          const dateStr = daily.time[i];
          const d = new Date(dateStr);
          const dayName = DAYS_ABBR[d.getDay()];
          const dailyTemp = Math.round(daily.temperature_2m_max[i]);
          const dailyCode = daily.weather_code[i];
          const dailyCond = getConditionFromCode(dailyCode, 10);
          const dailyRainProb = daily.precipitation_probability_max ? Math.round(daily.precipitation_probability_max[i]) : 20;
          
          let label = "Optimal sowing";
          if (dailyCond === "Rainy") label = "Clear drainage!";
          else if (dailyCond === "Stormy") label = "Drain water logged";
          else if (dailyCond === "Windy") label = "Secure nurseries";
          else if (dailyTemp > 35) label = "Heavy irrigation";

          forecastList.push({
            day: dayName,
            temp: dailyTemp,
            cond: dailyCond,
            rain: `${dailyRainProb}%`,
            label
          });
        }
      }

      const farmerFeats = generateCustomFarmerFeatures(finalCityName, temp, humidity, windSpeed, rainProbability, cond);
      const langSummaries = generateLanguageSummaries(finalCityName, temp, rainProbability);

      const updatedWeather: WeatherInfo = {
        temp,
        condition: cond,
        humidity,
        windSpeed,
        village: finalCityName,
        rainProbability,
        sunrise,
        sunset,
        forecast: forecastList,
        ...farmerFeats,
        ...langSummaries,
        lat: latitude,
        lon: longitude,
        locationDenied: false,
        isFetching: false,
        warning: weather.warning || "None"
      };

      setWeatherState(updatedWeather);
      localStorage.setItem("ag_weather_cache", JSON.stringify(updatedWeather));
      localStorage.setItem("ag_weather_preferred_city", finalCityName);
    } catch (err: any) {
      console.error("Failed fetching live weather from Open-Meteo:", err);
      
      const fallbackCity = cityName || "Lucknow";
      const cachedCityData = DEFAULT_WEATHER_DATA_BY_CITY[fallbackCity] || DEFAULT_WEATHER_DATA_BY_CITY["Lucknow"];
      
      const builtForecast = cachedCityData.forecast.map((f: any) => {
        const d = new Date();
        d.setDate(d.getDate() + f.dayOffset);
        const DAYS_ABBR = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        return {
          day: DAYS_ABBR[d.getDay()],
          temp: f.temp,
          cond: f.cond,
          rain: f.rain,
          label: f.label
        };
      });

      const farmerFeats = generateCustomFarmerFeatures(fallbackCity, cachedCityData.temp, cachedCityData.humidity, cachedCityData.windSpeed, cachedCityData.rainProbability, cachedCityData.condition);
      const langSummaries = generateLanguageSummaries(fallbackCity, cachedCityData.temp, cachedCityData.rainProbability);

      const blendedWeather: WeatherInfo = {
        temp: cachedCityData.temp,
        condition: cachedCityData.condition,
        humidity: cachedCityData.humidity,
        windSpeed: cachedCityData.windSpeed,
        village: fallbackCity,
        rainProbability: cachedCityData.rainProbability,
        sunrise: cachedCityData.sunrise,
        sunset: cachedCityData.sunset,
        forecast: builtForecast,
        ...farmerFeats,
        ...langSummaries,
        lat: latitude,
        lon: longitude,
        locationDenied: false,
        isFetching: false,
        warning: weather.warning || cachedCityData.warning,
        errorMsg: "Using offline backup telemetry records"
      };

      setWeatherState(blendedWeather);
      localStorage.setItem("ag_weather_cache", JSON.stringify(blendedWeather));
      localStorage.setItem("ag_weather_preferred_city", fallbackCity);
    }
  };

  const requestUserLocation = async () => {
    if (!navigator.geolocation) {
      setWeatherState(prev => ({
        ...prev,
        locationDenied: true,
        errorMsg: "Browser geolocation is not supported in this environment.",
        isFetching: false
      }));
      return;
    }

    setWeatherState(prev => ({ ...prev, isFetching: true, errorMsg: undefined }));

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        await fetchWeatherByCoords(latitude, longitude);
      },
      async (error) => {
        console.warn("Geolocation permission or capture failed:", error);
        setWeatherState(prev => ({
          ...prev,
          locationDenied: true,
          isFetching: false,
          errorMsg: "Geolocation permission denied. Choose option manually or review settings."
        }));

        const preferredCity = localStorage.getItem("ag_weather_preferred_city") || "Lucknow";
        await setManualLocation(preferredCity);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 3600000 }
    );
  };

  const setManualLocation = async (cityName: string, lat?: number, lon?: number) => {
    let finalLat = lat;
    let finalLon = lon;

    if (finalLat === undefined || finalLon === undefined) {
      const defaultData = DEFAULT_WEATHER_DATA_BY_CITY[cityName];
      if (defaultData) {
        const cityCoords: { [key: string]: { lat: number, lon: number } } = {
          "Lucknow": { lat: 26.8467, lon: 80.9462 },
          "Nagpur": { lat: 21.1458, lon: 79.0882 },
          "Bhatinda": { lat: 30.2110, lon: 74.9455 },
          "Patna": { lat: 25.5941, lon: 85.1376 },
          "Indore": { lat: 22.7196, lon: 75.8577 },
          "Kanakpur": { lat: 26.8377, lon: 81.0114 },
          "Pune": { lat: 18.5204, lon: 73.8567 }
        };
        const coords = cityCoords[cityName];
        if (coords) {
          finalLat = coords.lat;
          finalLon = coords.lon;
        }
      }
    }

    if (finalLat === undefined || finalLon === undefined) {
      finalLat = 26.8467;
      finalLon = 80.9462;
    }

    await fetchWeatherByCoords(finalLat, finalLon, cityName);
  };

  const setWeatherWarning = (warning: string) => {
    setWeatherState(prev => {
      const updated = { ...prev, warning };
      localStorage.setItem("ag_weather_cache", JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    const initializedLocal = localStorage.getItem("ag_weather_initialized");
    if (!initializedLocal) {
      localStorage.setItem("ag_weather_initialized", "true");
      requestUserLocation();
    } else {
      const preferredCity = localStorage.getItem("ag_weather_preferred_city") || "Lucknow";
      setManualLocation(preferredCity);
    }
  }, []);

  // Save changes automatically
  useEffect(() => {
    localStorage.setItem("ag_users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("ag_curr_user_id", currentUser.id);
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("ag_jobs", JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem("ag_applications", JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem("ag_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("ag_orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("ag_diary", JSON.stringify(diaryEntries));
  }, [diaryEntries]);

  useEffect(() => {
    localStorage.setItem("ag_messages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("ag_feed", JSON.stringify(feedPosts));
  }, [feedPosts]);

  useEffect(() => {
    localStorage.setItem("ag_requests", JSON.stringify(customerRequests));
  }, [customerRequests]);

  // Set user context
  const setCurrentUserById = (id: string) => {
    const match = users.find((u) => u.id === id);
    if (match) {
      setCurrentUser(match);
    }
  };

  // Register user
  const registerNewUser = (role: Role, profileData: any, email: string, password?: string, mobileNumber?: string): User => {
    const id = `user-${Date.now()}`;
    const newUser: User = {
      id,
      email,
      role,
      password,
      mobileNumber
    };

    if (role === "Farmer") {
      newUser.farmerProfile = {
        name: profileData.name || "Unnamed Farmer",
        village: profileData.village || "Unknown Village",
        state: profileData.state || "Unknown State",
        farmSize: Number(profileData.farmSize) || 1,
        cropsGrown: profileData.cropsGrown || "Paddy",
        experience: Number(profileData.experience) || 5,
        profilePicture: profileData.profilePicture || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=150"
      };
    } else if (role === "ShopOwner") {
      newUser.shopOwnerProfile = {
        shopName: profileData.shopName || "New Agro Store",
        ownerName: profileData.name || profileData.ownerName || "Agri Partner",
        address: profileData.address || "Main Street",
        contactNumber: mobileNumber || profileData.contactNumber || "0000000000",
        productsAvailable: profileData.productsAvailable || "Seeds, Fertilizers",
        deliveryAvailability: profileData.deliveryAvailability ?? true
      };
    } else if (role === "Worker") {
      newUser.workerProfile = {
        name: profileData.name || "Worker Name",
        village: profileData.village || "Unknown Village",
        skills: profileData.skills || "Ploughing, Irrigation",
        experience: Number(profileData.experience) || 1,
        dailyWageExpectation: Number(profileData.dailyWageExpectation) || 350,
        availabilityStatus: "Available"
      };
    }

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    return newUser;
  };

  // Profile Updates
  const updateFarmerProfile = (profile: any) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === currentUser.id) {
          const updated = { ...u, farmerProfile: { ...u.farmerProfile, ...profile } };
          setCurrentUser(updated);
          return updated;
        }
        return u;
      })
    );
  };

  const updateShopProfile = (profile: any) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === currentUser.id) {
          const updated = { ...u, shopOwnerProfile: { ...u.shopOwnerProfile, ...profile } };
          setCurrentUser(updated);
          return updated;
        }
        return u;
      })
    );
  };

  const updateWorkerProfile = (profile: any) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === currentUser.id) {
          const updated = { ...u, workerProfile: { ...u.workerProfile, ...profile } };
          setCurrentUser(updated);
          return updated;
        }
        return u;
      })
    );
  };

  // Job Operations
  const createJob = (jobData: Omit<Job, "id" | "farmerId" | "farmerName" | "status" | "createdAt">) => {
    const name = currentUser.farmerProfile?.name || "Farmer Partner";
    const newJob: Job = {
      ...jobData,
      id: `job-${Date.now()}`,
      farmerId: currentUser.id,
      farmerName: name,
      status: "Open",
      createdAt: new Date().toISOString()
    };
    setJobs((prev) => [newJob, ...prev]);
  };

  const applyForJob = (jobId: string) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return;

    const workerName = currentUser.workerProfile?.name || "Worker Partner";
    const newApp: JobApplication = {
      id: `app-${Date.now()}`,
      jobId,
      jobTitle: job.title,
      farmerId: job.farmerId,
      farmerName: job.farmerName,
      workerId: currentUser.id,
      workerName: workerName,
      workerSkills: currentUser.workerProfile?.skills || "General labor",
      workerWageExpectation: currentUser.workerProfile?.dailyWageExpectation || 400,
      status: "Pending",
      createdAt: new Date().toISOString()
    };

    setApplications((prev) => [newApp, ...prev]);
  };

  const updateApplicationStatus = (appId: string, status: "Accepted" | "Rejected") => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          // If accepted, mark the job as filled
          if (status === "Accepted") {
            setJobs((jb) =>
              jb.map((j) => (j.id === app.jobId ? { ...j, status: "Filled" } : j))
            );
          }
          return { ...app, status };
        }
        return app;
      })
    );
  };

  // Product Listings
  const createProduct = (productData: Omit<Product, "id" | "shopOwnerId" | "shopName">) => {
    const newProd: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      shopOwnerId: currentUser.id,
      shopName: currentUser.shopOwnerProfile?.shopName || "My Farm Shop"
    };
    setProducts((prev) => [newProd, ...prev]);
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Placing orders
  const placeOrder = (productId: string, quantity: number, address: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      farmerId: currentUser.id,
      farmerName: currentUser.farmerProfile?.name || "Customer Farmer",
      shopOwnerId: product.shopOwnerId,
      shopName: product.shopName,
      productId,
      productName: product.name,
      quantity,
      totalPrice: product.price * quantity,
      status: "Pending",
      farmerAddress: address,
      createdAt: new Date().toISOString()
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Fast deduct stock count
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stockCount: Math.max(0, p.stockCount - quantity) } : p))
    );
  };

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  };

  // Crop Diary Entries
  const addDiaryEntry = (cropName: string, activityType: DiaryEntry["activityType"], notes: string) => {
    const entry: DiaryEntry = {
      id: `diary-${Date.now()}`,
      farmerId: currentUser.id,
      cropName,
      activityType,
      notes,
      date: new Date().toISOString().split("T")[0]
    };
    setDiaryEntries((prev) => [entry, ...prev]);
  };

  // Chat Messages
  const sendChatMessage = (receiverId: string, content: string) => {
    const receiver = users.find((u) => u.id === receiverId);
    let rName = "User Partner";
    if (receiver) {
      rName = receiver.role === "Farmer"
        ? receiver.farmerProfile?.name || ""
        : receiver.role === "ShopOwner"
        ? receiver.shopOwnerProfile?.ownerName || ""
        : receiver.workerProfile?.name || "";
    }

    const sName = currentUser.role === "Farmer"
      ? currentUser.farmerProfile?.name || ""
      : currentUser.role === "ShopOwner"
      ? currentUser.shopOwnerProfile?.ownerName || ""
      : currentUser.workerProfile?.name || "";

    const msg: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: sName,
      senderRole: currentUser.role,
      receiverId,
      receiverName: rName,
      content,
      createdAt: new Date().toISOString()
    };
    setMessages((prev) => [...prev, msg]);
  };

  // Community Feed
  const createFeedPost = (content: string) => {
    const authorName = currentUser.role === "Farmer"
      ? currentUser.farmerProfile?.name || "Farmer Partner"
      : currentUser.role === "ShopOwner"
      ? currentUser.shopOwnerProfile?.ownerName || "Shop Partner"
      : currentUser.workerProfile?.name || "Worker Partner";

    const post: FeedPost = {
      id: `post-${Date.now()}`,
      authorId: currentUser.id,
      authorName,
      authorRole: currentUser.role,
      content,
      likesCount: 0,
      likedBy: [],
      comments: [],
      createdAt: new Date().toISOString()
    };
    setFeedPosts((prev) => [post, ...prev]);
  };

  const likeFeedPost = (postId: string) => {
    setFeedPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const alreadyLiked = post.likedBy.includes(currentUser.id);
          const likedBy = alreadyLiked
            ? post.likedBy.filter((id) => id !== currentUser.id)
            : [...post.likedBy, currentUser.id];
          return {
            ...post,
            likedBy,
            likesCount: likedBy.length
          };
        }
        return post;
      })
    );
  };

  const addCommentToPost = (postId: string, content: string) => {
    const authorName = currentUser.role === "Farmer"
      ? currentUser.farmerProfile?.name || "Farmer Partner"
      : currentUser.role === "ShopOwner"
      ? currentUser.shopOwnerProfile?.ownerName || "Shop Partner"
      : currentUser.workerProfile?.name || "Worker Partner";

    setFeedPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [
              ...post.comments,
              {
                id: `comm-${Date.now()}`,
                authorName,
                authorRole: currentUser.role,
                content,
                createdAt: new Date().toISOString()
              }
            ]
          };
        }
        return post;
      })
    );
  };

  // Customer Inquiries
  const sendCustomerRequest = (shopOwnerId: string, subject: string, message: string) => {
    const newReq: CustomerRequest = {
      id: `req-${Date.now()}`,
      farmerId: currentUser.id,
      farmerName: currentUser.farmerProfile?.name || "Farmer Resident",
      shopOwnerId,
      subject,
      message,
      createdAt: new Date().toISOString()
    };
    setCustomerRequests((prev) => [newReq, ...prev]);
  };

  const replyToCustomerRequest = (requestId: string, replyText: string) => {
    setCustomerRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, replyText } : r))
    );
  };

  // System Demo triggers to let users easily simulate operations
  const triggerSystemDemoAction = (actionType: string) => {
    if (actionType === "ORDER_BASMATI") {
      const amit = users.find((u) => u.role === "ShopOwner");
      const riceSeeds = products.find((p) => p.category === "Seed");
      if (amit && riceSeeds) {
        placeOrder(riceSeeds.id, 2, "Demo Farm House, Plot 7B");
      }
    } else if (actionType === "AUTO_APPLY_WORKER") {
      // Find dynamic worker or fallback
      let workerUser = users.find((u) => u.role === "Worker");
      if (!workerUser) {
        // Fallback or create dummy worker
        workerUser = {
          id: "worker-demo-auto",
          email: "demo-worker@agrivon.com",
          role: "Worker",
          workerProfile: {
            name: "Sunil Yadav (Applied)",
            village: "Mohanpur",
            skills: "Harvesting, Pesticide Spraying, Tractor Operation",
            experience: 5,
            dailyWageExpectation: 450,
            availabilityStatus: "Available"
          }
        };
      }
      const openJob = jobs.find((j) => j.status === "Open" && j.farmerId === currentUser.id);
      if (workerUser && openJob) {
        const alreadyApplied = applications.some((app) => app.jobId === openJob.id && app.workerId === workerUser.id);
        if (!alreadyApplied) {
          const newApp: JobApplication = {
            id: `app-${Date.now()}`,
            jobId: openJob.id,
            jobTitle: openJob.title,
            farmerId: openJob.farmerId,
            farmerName: openJob.farmerName,
            workerId: workerUser.id,
            workerName: workerUser.workerProfile?.name || "Sunil Yadav",
            workerSkills: workerUser.workerProfile?.skills || "Harvesting",
            workerWageExpectation: workerUser.workerProfile?.dailyWageExpectation || 450,
            status: "Pending",
            createdAt: new Date().toISOString()
          };
          setApplications((prev) => [newApp, ...prev]);
        }
      }
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        jobs,
        applications,
        products,
        orders,
        diaryEntries,
        messages,
        feedPosts,
        customerRequests,
        cropPrices,
        weather,
        requestUserLocation,
        setManualLocation,
        setWeatherWarning,
        setCropPrices,
        isAuthenticated,
        setIsAuthenticated,
        setCurrentUserById,
        registerNewUser,
        updateFarmerProfile,
        updateShopProfile,
        updateWorkerProfile,
        createJob,
        applyForJob,
        updateApplicationStatus,
        createProduct,
        addProduct: createProduct,
        updateProduct,
        deleteProduct,
        placeOrder,
        updateOrderStatus,
        addDiaryEntry,
        sendChatMessage,
        createFeedPost,
        likeFeedPost,
        addCommentToPost,
        sendCustomerRequest,
        replyToCustomerRequest,
        triggerSystemDemoAction,
        language,
        setLanguage,
        theme,
        setTheme,
        t,
        localT
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used inside an AppProvider");
  }
  return context;
};
