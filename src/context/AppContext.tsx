import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
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
import { supabase, isSupabaseConfigured } from "../lib/supabase";

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
  registerNewUser: (role: Role, profileData: any, email: string, password?: string, mobileNumber?: string) => Promise<User>;
  updateFarmerProfile: (profile: any) => Promise<void>;
  updateShopProfile: (profile: any) => Promise<void>;
  updateWorkerProfile: (profile: any) => Promise<void>;
  createJob: (jobData: Omit<Job, "id" | "farmerId" | "farmerName" | "status" | "createdAt">) => Promise<void>;
  applyForJob: (jobId: string) => Promise<void>;
  updateApplicationStatus: (appId: string, status: "Accepted" | "Rejected") => Promise<void>;
  createProduct: (productData: Omit<Product, "id" | "shopOwnerId" | "shopName">) => Promise<void>;
  addProduct: (productData: Omit<Product, "id" | "shopOwnerId" | "shopName">) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  placeOrder: (productId: string, quantity: number, address: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order["status"]) => Promise<void>;
  addDiaryEntry: (cropName: string, activityType: DiaryEntry["activityType"], notes: string) => void;
  sendChatMessage: (receiverId: string, content: string) => Promise<void>;
  createFeedPost: (content: string) => Promise<void>;
  likeFeedPost: (postId: string) => Promise<void>;
  addCommentToPost: (postId: string, content: string) => Promise<void>;
  sendCustomerRequest: (shopOwnerId: string, subject: string, message: string) => void;
  replyToCustomerRequest: (requestId: string, replyText: string) => void;
  triggerSystemDemoAction: (actionType: string) => void;
  requestUserLocation: () => Promise<void>;
  setManualLocation: (cityName: string, lat?: number, lon?: number) => Promise<void>;
  setWeatherWarning: (warning: string) => void;
  setCropPrices: (prices: CropPrice[]) => void;
  isBackendConnected: boolean;
  activeChatPartnerId: string | null;
  setActiveChatPartnerId: (id: string | null) => void;
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
    startDate: "2026-0 Mon-14",
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

  const { session, currentUser: authUser, logout: authLogout, signup: authSignup, login: authLogin } = useAuth();

  const [activeChatPartnerId, setActiveChatPartnerId] = useState<string | null>(null);

  // Local state as fallbacks / cache
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]);
  const [isAuthenticated, setIsAuthenticatedState] = useState<boolean>(false);

  useEffect(() => {
    if (authUser) {
      setCurrentUser(authUser);
      setIsAuthenticatedState(true);
      localStorage.setItem("ag_curr_user_id", authUser.id);
      localStorage.setItem("ag_authenticated", "true");
    } else {
      setCurrentUser(INITIAL_USERS[0]);
      setIsAuthenticatedState(false);
      localStorage.removeItem("ag_curr_user_id");
      localStorage.removeItem("ag_authenticated");
    }
  }, [authUser]);

  const setIsAuthenticated = (auth: boolean) => {
    setIsAuthenticatedState(auth);
    localStorage.setItem("ag_authenticated", auth ? "true" : "false");
    if (!auth) {
      localStorage.removeItem("ag_curr_user_id");
      authLogout().catch(console.error);
    }
  };
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [applications, setApplications] = useState<JobApplication[]>(INITIAL_APPLICATIONS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>(INITIAL_DIARY);
  const [messages, setMessages] = useState<Message[]>([]);
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>([]);
  const [customerRequests, setCustomerRequests] = useState<CustomerRequest[]>([]);

  // Open-Meteo setup
  const [weather, setWeatherState] = useState<WeatherInfo>({
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
  });

  const [cropPrices, setCropPricesState] = useState<CropPrice[]>(CROP_PRICES);

  // Helper Mappers to convert DB objects into App Objects
  const mapDbUserToUser = (dbUser: any): User => {
    const user: User = {
      id: dbUser.id,
      email: dbUser.email,
      role: dbUser.role as Role,
      mobileNumber: dbUser.mobile_number || "",
    };

    if (dbUser.role === "Farmer") {
      user.farmerProfile = {
        name: dbUser.name || "Farmer Resident",
        village: dbUser.village || "",
        state: dbUser.state_name || "",
        farmSize: Number(dbUser.farm_size) || 2,
        cropsGrown: dbUser.crops_grown || "Paddy",
        experience: Number(dbUser.experience) || 5,
        profilePicture: dbUser.avatar_url || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=150",
        mobileNumber: dbUser.mobile_number || "",
        fullAddress: `${dbUser.village || ""}, ${dbUser.state_name || ""}`
      };
    } else if (dbUser.role === "ShopOwner") {
      user.shopOwnerProfile = {
        shopName: dbUser.shop_name || "Krishi Seva Kendra",
        ownerName: dbUser.name || "Agri Merchant",
        address: dbUser.shop_address || dbUser.village || "Mandi Center",
        contactNumber: dbUser.mobile_number || "9876543210",
        productsAvailable: dbUser.crops_grown || "Seeds, Pesticides",
        deliveryAvailability: dbUser.shop_delivery ?? true
      };
    } else if (dbUser.role === "Worker") {
      user.workerProfile = {
        name: dbUser.name || "Labour Buddy",
        village: dbUser.village || "",
        skills: dbUser.skills || "Ploughing, Irrigation",
        experience: Number(dbUser.experience) || 3,
        dailyWageExpectation: Number(dbUser.daily_wage_expectation) || 350,
        availabilityStatus: (dbUser.availability_status || "Available") as "Available" | "Busy",
        profilePicture: dbUser.avatar_url || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=150",
        mobileNumber: dbUser.mobile_number || "",
        state: dbUser.state_name || ""
      };
    }
    return user;
  };

  const mapDbProductToProduct = (dbProd: any, usersList: User[]): Product => {
    const shopkeeper = usersList.find((u) => u.id === dbProd.shopkeeper_id);
    const shopName = shopkeeper?.shopOwnerProfile?.shopName || "My Farm Shop";
    const shopOwnerName = shopkeeper?.shopOwnerProfile?.ownerName || "Merchant";
    const contactNumber = shopkeeper?.mobileNumber || shopkeeper?.shopOwnerProfile?.contactNumber || "";

    return {
      id: dbProd.id,
      shopOwnerId: dbProd.shopkeeper_id,
      shopName: shopName,
      shopOwnerName: shopOwnerName,
      name: dbProd.title,
      category: dbProd.category as any,
      description: dbProd.description || "",
      price: Number(dbProd.price) || 0,
      stockCount: Number(dbProd.stock) || 0,
      image: dbProd.image_url || "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&q=80&w=150",
      brandName: dbProd.brand_name || "",
      composition: dbProd.composition || "",
      cropCompatibility: dbProd.crop_compatibility || "",
      dosageInstructions: dbProd.dosage_instructions || "",
      mfgDate: dbProd.mfg_date || "",
      expiryDate: dbProd.expiry_date || "",
      govtLicense: dbProd.govt_license || "",
      expectedYieldBoost: dbProd.expected_yield_boost || "",
      safetyPrecautions: dbProd.safety_precautions || "",
      soilCompatibility: dbProd.soil_compatibility || "",
      isPromo: dbProd.is_promo ?? false,
      originalPrice: dbProd.original_price ? Number(dbProd.original_price) : undefined,
      contactNumber: contactNumber,
      isAvailable: (Number(dbProd.stock) || 0) > 0
    };
  };

  const mapDbOrderToOrder = (dbOrder: any, productsList: Product[], usersList: User[]): Order => {
    const farmer = usersList.find((u) => u.id === dbOrder.farmer_id);
    const product = productsList.find((p) => p.id === dbOrder.product_id);

    return {
      id: dbOrder.id,
      farmerId: dbOrder.farmer_id,
      farmerName: farmer?.farmerProfile?.name || "Farmer Partner",
      shopOwnerId: product?.shopOwnerId || "",
      shopName: product?.shopName || "Agro Shop",
      productId: dbOrder.product_id,
      productName: product?.name || "Premium Supply",
      quantity: Number(dbOrder.quantity) || 1,
      totalPrice: (product?.price || 0) * (Number(dbOrder.quantity) || 1),
      status: dbOrder.status as any,
      farmerAddress: dbOrder.farmer_address || "Mandi Block",
      createdAt: dbOrder.created_at
    };
  };

  // Synchronize dynamic lists from Supabase
  const syncAllFromSupabase = async () => {
    if (!isSupabaseConfigured) return;

    try {
      // 1. Fetch Users
      const { data: dbUsers, error: usersErr } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (usersErr) throw usersErr;

      const mappedUsers = (dbUsers || []).map(mapDbUserToUser);
      setUsers(mappedUsers);

      // Keep Current User Profile up-to-date
      const storedUserId = localStorage.getItem("ag_curr_user_id");
      if (storedUserId) {
        const found = mappedUsers.find(u => u.id === storedUserId);
        if (found) {
          setCurrentUser(found);
        }
      }

      // 2. Fetch Products
      const { data: dbProducts, error: prodErr } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (prodErr) throw prodErr;

      const mappedProducts = (dbProducts || []).map(p => mapDbProductToProduct(p, mappedUsers));
      setProducts(mappedProducts);

      // 3. Fetch Orders
      const { data: dbOrders, error: orderErr } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (orderErr) throw orderErr;

      const mappedOrders = (dbOrders || []).map(o => mapDbOrderToOrder(o, mappedProducts, mappedUsers));
      setOrders(mappedOrders);

      // 4. Fetch Community Messages
      const { data: dbCommMessages, error: commErr } = await supabase
        .from("community_messages")
        .select("*")
        .order("created_at", { ascending: true });

      if (commErr) throw commErr;

      const mappedComm = (dbCommMessages || []).map((dbMsg: any) => {
        const senderObj = mappedUsers.find((u) => u.id === dbMsg.user_id) as any;
        const senderName = senderObj?.farmerProfile?.name || senderObj?.shopOwnerProfile?.ownerName || senderObj?.workerProfile?.name || senderObj?.name || "Anonymous";
        const senderRole = senderObj?.role || "Farmer";
        return {
          id: dbMsg.id,
          senderId: dbMsg.user_id,
          senderName: senderName,
          senderRole: senderRole,
          receiverId: "community",
          receiverName: "Community Forum",
          content: dbMsg.message,
          createdAt: dbMsg.created_at
        };
      });

      // 5. Fetch Direct Messages
      const { data: dbDirectMessages, error: dmErr } = await supabase
        .from("direct_messages")
        .select("*")
        .order("created_at", { ascending: true });

      if (dmErr) throw dmErr;

      const mappedDMs = (dbDirectMessages || []).map((dbMsg: any) => {
        const senderObj = mappedUsers.find((u) => u.id === dbMsg.sender_id) as any;
        const receiverObj = mappedUsers.find((u) => u.id === dbMsg.receiver_id) as any;
        const senderName = senderObj?.farmerProfile?.name || senderObj?.shopOwnerProfile?.ownerName || senderObj?.workerProfile?.name || senderObj?.name || "Anonymous";
        const receiverName = receiverObj?.farmerProfile?.name || receiverObj?.shopOwnerProfile?.ownerName || receiverObj?.workerProfile?.name || receiverObj?.name || "User";
        return {
          id: dbMsg.id,
          senderId: dbMsg.sender_id,
          senderName: senderName,
          senderRole: senderObj?.role || "Farmer",
          receiverId: dbMsg.receiver_id,
          receiverName: receiverName,
          content: dbMsg.message,
          createdAt: dbMsg.created_at
        };
      });

      setMessages([...mappedComm, ...mappedDMs]);

    } catch (err) {
      console.error("❌ Supabase Sync Failed:", err);
    }
  };

  // On mount, load states
  useEffect(() => {
    // Local persistence layer recovery
    const savedUsers = localStorage.getItem("ag_users");
    if (savedUsers) {
      try {
        setUsers(JSON.parse(savedUsers));
      } catch (e) {}
    }

    const savedCurId = localStorage.getItem("ag_curr_user_id");
    const activeList = savedUsers ? JSON.parse(savedUsers) : INITIAL_USERS;
    if (savedCurId) {
      const match = activeList.find((u: User) => u.id === savedCurId);
      if (match) setCurrentUser(match);
    }

    if (isSupabaseConfigured) {
      syncAllFromSupabase();

      // Realtime sub for immediate updates
      const channel = supabase
        .channel("table_db_updates")
        .on("postgres_changes", { event: "*", schema: "public" }, () => {
          syncAllFromSupabase();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  // Save changes to localStorage as a robust local backup
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem("ag_users", JSON.stringify(users));
    }
  }, [users]);

  useEffect(() => {
    if (currentUser.id !== "none") {
      localStorage.setItem("ag_curr_user_id", currentUser.id);
    }
  }, [currentUser]);

  // Set user context
  const setCurrentUserById = (id: string) => {
    const match = users.find((u) => u.id === id);
    if (match) {
      setCurrentUser(match);
      localStorage.setItem("ag_curr_user_id", id);
    }
  };

  // Register user
  const registerNewUser = async (
    role: Role,
    profileData: any,
    email: string,
    password?: string,
    mobileNumber?: string
  ): Promise<User> => {
    const fields = {
      village: profileData.village || "Kanakpur",
      state: profileData.state || "Uttar Pradesh",
      farmSize: profileData.farmSize ? Number(profileData.farmSize) : undefined,
      cropsGrown: profileData.cropsGrown || profileData.productsAvailable,
      experience: profileData.experience ? Number(profileData.experience) : undefined,
      shopName: profileData.shopName,
      address: profileData.address,
      deliveryAvailability: profileData.deliveryAvailability,
      skills: profileData.skills,
      dailyWageExpectation: profileData.dailyWageExpectation,
      profilePicture: profileData.profilePicture
    };

    const registered = await authSignup(
      email,
      password || "AgrivonMandiUser2026!",
      role,
      profileData.name || profileData.ownerName || "Agrivon Member",
      mobileNumber || "",
      fields
    );

    if (isSupabaseConfigured) {
      await syncAllFromSupabase();
    }
    return registered;
  };

  const __deprecated_registerNewUser = async (
    role: Role,
    profileData: any,
    email: string,
    password?: string,
    mobileNumber?: string
  ): Promise<User> => {
    const id = isSupabaseConfigured ? undefined : `user-${Date.now()}`;
    
    // Default avatar
    const defaultAvatar = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=150";

    const dbRow: any = {
      name: profileData.name || profileData.ownerName || "Agrivon Member",
      email: email.trim(),
      role: role,
      mobile_number: mobileNumber || profileData.contactNumber || profileData.mobileNumber || "",
      avatar_url: profileData.profilePicture || profileData.profilePicture || defaultAvatar,
      village: profileData.village || "Kanakpur",
      state_name: profileData.state || "Uttar Pradesh",
      farm_size: profileData.farmSize ? Number(profileData.farmSize) : null,
      crops_grown: profileData.cropsGrown || profileData.productsAvailable || "Paddy",
      experience: profileData.experience ? Number(profileData.experience) : null,
      shop_name: profileData.shopName || null,
      shop_address: profileData.address || null,
      shop_delivery: profileData.deliveryAvailability ?? null,
      skills: profileData.skills || null,
      daily_wage_expectation: profileData.dailyWageExpectation ? Number(profileData.dailyWageExpectation) : null,
      availability_status: "Available"
    };

    if (id) {
      dbRow.id = id;
    }

    let createdUser: User;

    if (isSupabaseConfigured) {
      try {
        // Try creating standard Auth user, ignore errors to guarantee robustness
        const { data: authData } = await supabase.auth.signUp({
          email: email.trim(),
          password: password || "AgrivonMandiUser2026!",
        });

        // Use Auth UUID if successful
        const resolvedId = authData?.user?.id;
        const rowWithId = { ...dbRow };
        if (resolvedId) {
          rowWithId.id = resolvedId;
        }

        const { data: insertedRows, error: insertErr } = await supabase
          .from("users")
          .insert(rowWithId)
          .select();

        if (insertErr) throw insertErr;
        
        const freshRow = insertedRows?.[0] || rowWithId;
        createdUser = mapDbUserToUser(freshRow);
      } catch (err) {
        console.warn("⚠️ Auth Sign-Up or database insert failed, using fallback:", err);
        // Fallback row insert directly without formal Supabase Auth to guarantee registration succeeds
        const { data: fallbackRows } = await supabase
          .from("users")
          .insert(dbRow)
          .select();
        
        const freshRow = fallbackRows?.[0] || dbRow;
        createdUser = mapDbUserToUser(freshRow);
      }
    } else {
      // Local caching fallback
      createdUser = {
        id: id!,
        email: email,
        role: role,
        mobileNumber: mobileNumber || ""
      };

      if (role === "Farmer") {
        createdUser.farmerProfile = {
          name: profileData.name || "Unnamed Farmer",
          village: profileData.village || "Kanakpur",
          state: profileData.state || "Uttar Pradesh",
          farmSize: Number(profileData.farmSize) || 2,
          cropsGrown: profileData.cropsGrown || "Paddy",
          experience: Number(profileData.experience) || 5,
          profilePicture: defaultAvatar
        };
      } else if (role === "ShopOwner") {
        createdUser.shopOwnerProfile = {
          shopName: profileData.shopName || "Krishi Kendra",
          ownerName: profileData.ownerName || "Merchant Partner",
          address: profileData.address || "Main Street",
          contactNumber: mobileNumber || "9876543210",
          productsAvailable: profileData.productsAvailable || "Seeds, Fertilizers",
          deliveryAvailability: profileData.deliveryAvailability ?? true
        };
      } else if (role === "Worker") {
        createdUser.workerProfile = {
          name: profileData.name || "Worker Name",
          village: profileData.village || "Unknown Village",
          skills: profileData.skills || "Ploughing, Irrigation",
          experience: Number(profileData.experience) || 3,
          dailyWageExpectation: Number(profileData.dailyWageExpectation) || 350,
          availabilityStatus: "Available"
        };
      }
    }

    setUsers((prev) => {
      const filtered = prev.filter(u => u.email.trim().toLowerCase() !== email.trim().toLowerCase());
      return [...filtered, createdUser];
    });
    setCurrentUser(createdUser);
    localStorage.setItem("ag_curr_user_id", createdUser.id);
    setIsAuthenticated(true);
    
    if (isSupabaseConfigured) {
      await syncAllFromSupabase();
    }
    return createdUser;
  };

  // Profile Updates
  const updateFarmerProfile = async (profile: any) => {
    const updatedUser = { ...currentUser, farmerProfile: { ...currentUser.farmerProfile, ...profile } };
    setCurrentUser(updatedUser);

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from("users")
          .update({
            name: profile.name || currentUser.farmerProfile?.name,
            village: profile.village || currentUser.farmerProfile?.village,
            state_name: profile.state || currentUser.farmerProfile?.state,
            farm_size: profile.farmSize ? Number(profile.farmSize) : undefined,
            crops_grown: profile.cropsGrown || currentUser.farmerProfile?.cropsGrown,
            experience: profile.experience ? Number(profile.experience) : undefined,
            avatar_url: profile.profilePicture || currentUser.farmerProfile?.profilePicture
          })
          .eq("id", currentUser.id);
        await syncAllFromSupabase();
      } catch (err) {
        console.error(err);
      }
    } else {
      setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
    }
  };

  const updateShopProfile = async (profile: any) => {
    const updatedUser = { ...currentUser, shopOwnerProfile: { ...currentUser.shopOwnerProfile, ...profile } };
    setCurrentUser(updatedUser);

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from("users")
          .update({
            shop_name: profile.shopName || currentUser.shopOwnerProfile?.shopName,
            name: profile.ownerName || currentUser.shopOwnerProfile?.ownerName,
            shop_address: profile.address || currentUser.shopOwnerProfile?.address,
            mobile_number: profile.contactNumber || currentUser.shopOwnerProfile?.contactNumber,
            crops_grown: profile.productsAvailable || currentUser.shopOwnerProfile?.productsAvailable,
            shop_delivery: profile.deliveryAvailability ?? undefined
          })
          .eq("id", currentUser.id);
        await syncAllFromSupabase();
      } catch (err) {
        console.error(err);
      }
    } else {
      setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
    }
  };

  const updateWorkerProfile = async (profile: any) => {
    const updatedUser = { ...currentUser, workerProfile: { ...currentUser.workerProfile, ...profile } };
    setCurrentUser(updatedUser);

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from("users")
          .update({
            name: profile.name || currentUser.workerProfile?.name,
            village: profile.village || currentUser.workerProfile?.village,
            skills: profile.skills || currentUser.workerProfile?.skills,
            experience: profile.experience ? Number(profile.experience) : undefined,
            daily_wage_expectation: profile.dailyWageExpectation ? Number(profile.dailyWageExpectation) : undefined,
            availability_status: profile.availabilityStatus || currentUser.workerProfile?.availabilityStatus,
            avatar_url: profile.profilePicture || currentUser.workerProfile?.profilePicture
          })
          .eq("id", currentUser.id);
        await syncAllFromSupabase();
      } catch (err) {
        console.error(err);
      }
    } else {
      setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
    }
  };

  // Job Operations (Simple fallbacks)
  const createJob = async (jobData: Omit<Job, "id" | "farmerId" | "farmerName" | "status" | "createdAt">) => {
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

  const applyForJob = async (jobId: string) => {
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

  const updateApplicationStatus = async (appId: string, status: "Accepted" | "Rejected") => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
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

  // Products CRUD
  const createProduct = async (productData: Omit<Product, "id" | "shopOwnerId" | "shopName">) => {
    if (isSupabaseConfigured) {
      try {
        const { error: insErr } = await supabase
          .from("products")
          .insert({
            shopkeeper_id: currentUser.id,
            title: productData.name,
            description: productData.description,
            category: productData.category,
            price: productData.price,
            image_url: productData.image,
            stock: productData.stockCount,
            brand_name: productData.brandName || null,
            composition: productData.composition || null,
            crop_compatibility: productData.cropCompatibility || null,
            dosage_instructions: productData.dosageInstructions || null,
            mfg_date: productData.mfgDate || null,
            expiry_date: productData.expiryDate || null,
            govt_license: productData.govtLicense || null,
            expected_yield_boost: productData.expectedYieldBoost || null,
            safety_precautions: productData.safetyPrecautions || null,
            soil_compatibility: productData.soilCompatibility || null,
            is_promo: productData.isPromo ?? false,
            original_price: productData.originalPrice || null
          });
        if (insErr) throw insErr;
        await syncAllFromSupabase();
      } catch (err) {
        console.error(err);
      }
    } else {
      const newProd: Product = {
        ...productData,
        id: `prod-${Date.now()}`,
        shopOwnerId: currentUser.id,
        shopName: currentUser.shopOwnerProfile?.shopName || "My Farm Shop"
      };
      setProducts((prev) => [newProd, ...prev]);
    }
  };

  const updateProduct = async (updated: Product) => {
    if (isSupabaseConfigured) {
      try {
        const { error: updErr } = await supabase
          .from("products")
          .update({
            title: updated.name,
            description: updated.description,
            category: updated.category,
            price: updated.price,
            image_url: updated.image,
            stock: updated.stockCount,
            brand_name: updated.brandName,
            composition: updated.composition,
            crop_compatibility: updated.cropCompatibility,
            dosage_instructions: updated.dosageInstructions,
            mfg_date: updated.mfgDate,
            expiry_date: updated.expiryDate,
            govt_license: updated.govtLicense,
            expected_yield_boost: updated.expectedYieldBoost,
            safety_precautions: updated.safetyPrecautions,
            soil_compatibility: updated.soilCompatibility,
            is_promo: updated.isPromo,
            original_price: updated.originalPrice
          })
          .eq("id", updated.id);
        if (updErr) throw updErr;
        await syncAllFromSupabase();
      } catch (err) {
        console.error(err);
      }
    } else {
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    }
  };

  const deleteProduct = async (id: string) => {
    if (isSupabaseConfigured) {
      try {
        const { error: delErr } = await supabase
          .from("products")
          .delete()
          .eq("id", id);
        if (delErr) throw delErr;
        await syncAllFromSupabase();
      } catch (err) {
        console.error(err);
      }
    } else {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // Place Orders
  const placeOrder = async (productId: string, quantity: number, address: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    if (isSupabaseConfigured) {
      try {
        const { error: ordErr } = await supabase
          .from("orders")
          .insert({
            farmer_id: currentUser.id,
            product_id: productId,
            quantity: quantity,
            status: "Pending",
            farmer_address: address
          });
        
        if (ordErr) throw ordErr;

        // update local stock decrement immediately
        const newStock = Math.max(0, product.stockCount - quantity);
        await supabase
          .from("products")
          .update({ stock: newStock })
          .eq("id", productId);

        await syncAllFromSupabase();
      } catch (err) {
        console.error(err);
      }
    } else {
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
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, stockCount: Math.max(0, p.stockCount - quantity) } : p))
      );
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order["status"]) => {
    if (isSupabaseConfigured) {
      try {
        const { error: updErr } = await supabase
          .from("orders")
          .update({ status: status })
          .eq("id", orderId);
        
        if (updErr) throw updErr;
        await syncAllFromSupabase();
      } catch (err) {
        console.error(err);
      }
    } else {
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    }
  };

  // Chat Messages - real direct or community channel!
  const sendChatMessage = async (receiverId: string, content: string) => {
    if (!content.trim()) return;

    if (isSupabaseConfigured) {
      try {
        if (receiverId === "community") {
          // Send community forum chat
          const { error: err } = await supabase
            .from("community_messages")
            .insert({
              user_id: currentUser.id,
              message: content.trim()
            });
          if (err) throw err;
        } else {
          // Send private direct message
          const { error: err } = await supabase
            .from("direct_messages")
            .insert({
              sender_id: currentUser.id,
              receiver_id: receiverId,
              message: content.trim()
            });
          if (err) throw err;
        }
        await syncAllFromSupabase();
      } catch (err) {
        console.error("sendChatMessage error:", err);
      }
    } else {
      // Local fallback
      const sName = currentUser.role === "Farmer"
        ? currentUser.farmerProfile?.name || ""
        : currentUser.role === "ShopOwner"
        ? currentUser.shopOwnerProfile?.ownerName || ""
        : currentUser.workerProfile?.name || "";

      const receiver = users.find((u) => u.id === receiverId);
      const rName = receiver?.role === "Farmer"
        ? receiver.farmerProfile?.name || "User"
        : receiver?.role === "ShopOwner"
        ? receiver.shopOwnerProfile?.shopName || "Merchant"
        : receiver?.workerProfile?.name || "Buddy";

      const msg: Message = {
        id: `msg-${Date.now()}`,
        senderId: currentUser.id,
        senderName: sName,
        senderRole: currentUser.role,
        receiverId,
        receiverName: rName,
        content: content.trim(),
        createdAt: new Date().toISOString()
      };
      setMessages((prev) => [...prev, msg]);
    }
  };

  // Crop Diary (simple state tracker)
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

  // Unimplemented simulation methods preserved
  const createFeedPost = async (content: string) => {};
  const likeFeedPost = async (postId: string) => {};
  const addCommentToPost = async (postId: string, content: string) => {};
  const sendCustomerRequest = (shopOwnerId: string, subject: string, message: string) => {};
  const replyToCustomerRequest = (requestId: string, replyText: string) => {};

  // Location and Coordinate meteorological retrievals
  const fetchWeatherByCoords = async (latitude: number, longitude: number, cityName?: string) => {
    setWeatherState(prev => ({ ...prev, isFetching: true, errorMsg: undefined }));
    try {
      let finalCityName = cityName || "Lucknow";
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max&timezone=auto`
      );
      
      if (!weatherRes.ok) throw new Error();
      const data = await weatherRes.json();
      const current = data.current;
      const daily = data.daily;

      const temp = Math.round(current.temperature_2m);
      const humidity = Math.round(current.relative_humidity_2m);
      const windSpeed = Math.round(current.wind_speed_10m);

      setWeatherState({
        temp,
        condition: "Sunny",
        humidity,
        windSpeed,
        village: finalCityName,
        rainProbability: 10,
        sunrise: "05:25 AM",
        sunset: "07:05 PM",
        forecast: [
          { day: "Today", temp, cond: "Sunny", rain: "5%", label: "Optimal Sowing" },
          { day: "Tomorrow", temp: temp + 1, cond: "Sunny", rain: "10%", label: "Optimal Sowing" }
        ],
        isFetching: false
      });
    } catch (e) {
      setWeatherState(prev => ({ ...prev, isFetching: false }));
    }
  };

  const requestUserLocation = async () => {
    await fetchWeatherByCoords(26.8467, 80.9462, "Kanakpur Regional Mandi");
  };

  const setManualLocation = async (cityName: string) => {
    await fetchWeatherByCoords(26.8467, 80.9462, cityName);
  };

  const setWeatherWarning = (warning: string) => {
    setWeatherState(prev => ({ ...prev, warning }));
  };

  const setCropPrices = (prices: CropPrice[]) => {
    setCropPricesState(prices);
  };

  const triggerSystemDemoAction = (actionType: string) => {
    if (actionType === "ORDER_BASMATI") {
      const seedProduct = products.find(p => p.category === "Seed");
      if (seedProduct) {
        placeOrder(seedProduct.id, 1, "Mandi Plot Road");
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
        localT,
        isBackendConnected: isSupabaseConfigured,
        activeChatPartnerId,
        setActiveChatPartnerId
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
