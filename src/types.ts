// Types for Agriculture Ecosystem Platform

export type Role = "Farmer" | "ShopOwner" | "Worker" | "SuperAdmin" | "None";

export interface FarmerProfile {
  name: string;
  village: string;
  state: string;
  farmSize: number; // in Acres
  cropsGrown: string; // comma-separated e.g. "Rice, Wheat"
  experience: number; // years
  profilePicture: string; // base64 or placeholder URL
  aadhaarDoc?: string;
  mobileNumber?: string;
  district?: string;
  fullAddress?: string;
}

export interface ShopOwnerProfile {
  shopName: string;
  ownerName: string;
  address: string;
  contactNumber: string;
  productsAvailable: string; // general description
  deliveryAvailability: boolean;
}

export interface WorkerProfile {
  name: string;
  village: string;
  skills: string; // e.g. "Harvesting, Irrigation, Spraying"
  experience: number; // years
  dailyWageExpectation: number; // ₹ per day
  availabilityStatus: "Available" | "Busy";
  profilePicture?: string;
  mobileNumber?: string;
  district?: string;
  state?: string;
}

export interface User {
  id: string;
  email: string;
  role: Role;
  password?: string;
  mobileNumber?: string;
  farmerProfile?: FarmerProfile;
  shopOwnerProfile?: ShopOwnerProfile;
  workerProfile?: WorkerProfile;
}

// Job Marketplace types
export type JobCategory = "Harvesting" | "Irrigation" | "Planting" | "Pesticide Spraying" | "Other";

export interface Job {
  id: string;
  farmerId: string;
  farmerName: string;
  title: string;
  category: JobCategory;
  description: string;
  village: string;
  state: string;
  wage: number; // Daily wage in ₹
  durationDays: number;
  startDate: string;
  status: "Open" | "Filled" | "Completed";
  createdAt: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  farmerId: string;
  farmerName: string;
  workerId: string;
  workerName: string;
  workerSkills: string;
  workerWageExpectation: number;
  status: "Pending" | "Accepted" | "Rejected";
  createdAt: string;
}

// Shop Product Listings
export interface Product {
  id: string;
  shopOwnerId: string;
  shopName: string;
  shopOwnerName?: string;
  name: string;
  category: "Seed" | "Pesticide" | "Fertilizer" | "Tool" | "Other";
  description: string;
  price: number; // in ₹
  stockCount: number;
  image: string; // Placeholder or base64
  images?: string[]; // Multiple images base64 or URLs
  location?: string;
  contactNumber?: string;
  isAvailable?: boolean;
  originalPrice?: number; // for promotions
  isPromo?: boolean;
  // Real agrarian product parameters
  brandName?: string; // e.g. Syngenta, IFFCO, Bayer
  composition?: string; // e.g. Carbendazim 12% + Mancozeb 63% WP
  cropCompatibility?: string; // e.g. Paddy, Cotton, Wheat
  dosageInstructions?: string; // e.g. 2g per Liter of water
  mfgDate?: string; // e.g. 2026-03-12
  expiryDate?: string; // e.g. 2028-03-11
  govtLicense?: string; // Government registration certification
  expectedYieldBoost?: string; // e.g. 18% spike in panicle formation
  safetyPrecautions?: string; // e.g. Wear protective masks, do not inhale
  soilCompatibility?: string; // e.g. Loamy or Clayey soils
}

// Shop Orders
export interface Order {
  id: string;
  farmerId: string;
  farmerName: string;
  shopOwnerId: string;
  shopName: string;
  productId: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  status: "Pending" | "Approved" | "Shipped" | "Delivered";
  farmerAddress: string;
  createdAt: string;
}

// Crop Diary logs
export interface DiaryEntry {
  id: string;
  farmerId: string;
  cropName: string;
  activityType: "Planting" | "Irrigation" | "Fertilization" | "Pest Control" | "Harvesting" | "Note";
  notes: string;
  date: string;
}

// Chat messages
export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: Role;
  receiverId: string;
  receiverName: string;
  content: string;
  createdAt: string;
}

// Community Feed
export interface FeedPost {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: Role;
  content: string;
  likesCount: number;
  likedBy: string[]; // List of user IDs who liked
  comments: FeedComment[];
  createdAt: string;
}

export interface FeedComment {
  id: string;
  authorName: string;
  authorRole: Role;
  content: string;
  createdAt: string;
}

// Customer request inquiry for shop owners
export interface CustomerRequest {
  id: string;
  farmerId: string;
  farmerName: string;
  shopOwnerId: string;
  subject: string;
  message: string;
  replyText?: string;
  createdAt: string;
}

// Crop market prices
export interface CropPrice {
  name: string;
  currentPrice: number; // ₹ per quintal
  changePercent: number; // positive or negative
  history: number[]; // past 6 weeks price sequence for charts
  market: string;
}

// Weather Forecast
export interface WeatherInfo {
  temp: number;
  condition: "Sunny" | "Rainy" | "Cloudy" | "Stormy" | "Windy";
  humidity: number;
  windSpeed: number;
  warning?: string;
  village: string;
  rainProbability?: number;
  sunrise?: string;
  sunset?: string;
  forecast?: {
    day: string;
    temp: number;
    cond: "Sunny" | "Rainy" | "Cloudy" | "Stormy" | "Windy";
    rain: string;
    label: string;
  }[];
  rainAlert?: string;
  cropAdvisory?: string;
  extremeHeatWarning?: string;
  stormWarning?: string;
  irrigationRecommendation?: string;
  hindiSummary?: string;
  hinglishSummary?: string;
  englishSummary?: string;
  locationDenied?: boolean;
  isFetching?: boolean;
  errorMsg?: string;
  lat?: number;
  lon?: number;
}
