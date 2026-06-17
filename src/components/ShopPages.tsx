import React, { useState, useRef } from "react";
import { useApp } from "../context/AppContext";
import { Product, Order } from "../types";
import { ImageWithFallback } from "./ImageWithFallback";
import {
  TrendingUp, ShoppingBag, Truck, Inbox, MessageSquare, 
  Settings, User, PlusCircle, Search, Trash2, CheckCircle2, 
  LineChart, Sparkles, AlertTriangle, ShieldCheck, HelpCircle, Send, ArrowUpRight,
  Edit, Calendar, Info, Layers, Check, Shield, MapPin, Phone, Upload
} from "lucide-react";

// ==========================================
// CUSTOM RENDERING: SVG REVENUE BAR CHART
// ==========================================
export const ShopAnalyticsChart: React.FC = () => {
  const data = [
    { label: "Basmati Seed", sales: 120, revenue: 124000 },
    { label: "NPK 19:19", sales: 180, revenue: 98000 },
    { label: "Urea Sub", sales: 250, revenue: 154000 },
    { label: "Zinc Sulphate", sales: 90, revenue: 45000 },
    { label: "Neem Oil Bio", sales: 140, revenue: 64000 },
  ];

  const maxRevenue = Math.max(...data.map(d => d.revenue));
  const height = 180;

  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl text-xs text-slate-400">
      <div className="flex justify-between items-center mb-4">
        <div>
          <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-extrabold block">Finance Metrics</span>
          <h4 className="text-sm font-extrabold text-white">Itemized Revenue & Demand (Current Session)</h4>
        </div>
        <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full">
          Graphed via IoT
        </span>
      </div>

      <div className="space-y-3 pt-2">
        {data.map((d, idx) => {
          const ratio = (d.revenue / maxRevenue) * 100;
          return (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between items-center font-semibold text-slate-300">
                <span>{d.label}</span>
                <span className="font-mono text-[11px] text-white">₹{d.revenue.toLocaleString()} <span className="text-slate-500 font-medium">({d.sales} units)</span></span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${ratio}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


// --- PAGE 1: OVERVIEW ---
export const ShopOverview: React.FC<{ onViewTab: (tab: any) => void }> = ({ onViewTab }) => {
  const { orders, products, currentUser } = useApp();

  const shopOrders = orders.filter((o) => o.shopName === currentUser.shopOwnerProfile?.shopName);
  const totalRevenue = shopOrders.reduce((sum, o) => sum + o.totalPrice, 0);
  const pendingLeadsCount = 4; // simulated nearby leads

  return (
    <div className="space-y-6">
      
      {/* Welcome Hero banner */}
      <div className="bg-gradient-to-r from-teal-850 via-teal-900 to-slate-900 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.04]" />
        <div className="relative z-10 space-y-3">
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Enterprise Merchant Partner
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            Welcome, {currentUser.shopOwnerProfile?.ownerName || "Merchant Associate"}!
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm">
            Mandi License Store: <strong className="text-white">{currentUser.shopOwnerProfile?.shopName}</strong> at {currentUser.shopOwnerProfile?.address}.
          </p>
          <div className="pt-2 flex flex-wrap gap-2">
            <button onClick={() => onViewTab("inventory")} className="bg-white text-teal-950 font-bold text-xs px-4 py-2 rounded-xl hover:bg-slate-50 transition cursor-pointer shadow-1xs">
              Manage Products Catalog 📦
            </button>
            <button onClick={() => onViewTab("orders")} className="bg-teal-700/60 hover:bg-teal-700/80 text-white font-bold text-xs px-4 py-2 rounded-xl border border-teal-500/30 transition cursor-pointer">
              Review Unshipped bookings
            </button>
          </div>
        </div>
      </div>

      {/* Numerical Stats Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-semibold">
        <div className="bg-white border border-slate-150 p-4 rounded-xl flex items-center gap-3">
          <div className="p-3 bg-teal-100 text-teal-700 rounded-xl text-xl select-none">🏪</div>
          <div>
            <span className="text-[10px] text-slate-400 block tracking-wider uppercase">Active listings</span>
            <strong className="text-slate-800 text-base font-black block leading-none pt-1">{products.filter(p => p.shopName === currentUser.shopOwnerProfile?.shopName).length} items</strong>
          </div>
        </div>

        <div className="bg-white border border-slate-150 p-4 rounded-xl flex items-center gap-3">
          <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl text-xl select-none">🧾</div>
          <div>
            <span className="text-[10px] text-slate-400 block tracking-wider uppercase">Unprocessed bookings</span>
            <strong className="text-slate-800 text-base font-black block leading-none pt-1">{shopOrders.filter(o => o.status === "Pending").length} bookings</strong>
          </div>
        </div>

        <div className="bg-white border border-slate-150 p-4 rounded-xl flex items-center gap-3">
          <div className="p-3 bg-indigo-100 text-indigo-700 rounded-xl text-xl select-none">🪙</div>
          <div>
            <span className="text-[10px] text-slate-400 block tracking-wider uppercase">Sales Gross turnover</span>
            <strong className="text-slate-800 text-base font-black block leading-none pt-1">₹{totalRevenue.toLocaleString()}</strong>
          </div>
        </div>

        <div className="bg-white border border-slate-150 p-4 rounded-xl flex items-center gap-3">
          <div className="p-3 bg-amber-100 text-amber-700 rounded-xl text-xl select-none">⚡</div>
          <div>
            <span className="text-[10px] text-slate-400 block tracking-wider uppercase">Simulated Leads</span>
            <strong className="text-slate-800 text-base font-black block leading-none pt-1">{pendingLeadsCount} farmers nearby</strong>
          </div>
        </div>
      </div>

      {/* SaaS visual panel columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Unprocessed orders list (Col 8) */}
        <div className="lg:col-span-7 bg-white border border-slate-150 p-5 rounded-3xl shadow-3xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-teal-655" /> Bookings Requiring Dispatch
            </h3>
            <button onClick={() => onViewTab("orders")} className="text-[10px] text-teal-700 font-extrabold hover:underline">
              Manage View All
            </button>
          </div>

          <div className="space-y-3">
            {shopOrders.length === 0 ? (
              <div className="p-8 text-center text-slate-400 italic text-xs">
                No orders loaded yet! Let farmers switch context and purchase chemicals to see invoices trigger here.
              </div>
            ) : (
              shopOrders.slice(0, 3).map((o) => (
                <div key={o.id} className="p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl flex justify-between items-center text-xs">
                  <div>
                    <strong className="text-slate-800 font-bold block">{o.productName}</strong>
                    <span className="text-[10px] text-slate-500 font-medium">Recipient ID: {o.farmerId} • Qty: {o.quantity} units</span>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="font-mono text-xs font-black text-emerald-800 block">₹{o.totalPrice}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      o.status === "Delivered" ? "bg-emerald-100 text-emerald-800" : o.status === "Shipped" ? "bg-sky-100 text-sky-800" : "bg-amber-100 text-amber-800"
                    }`}>
                      {o.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Lead alerts (Col 5) */}
        <div className="lg:col-span-5 bg-white border border-slate-150 p-5 rounded-3xl shadow-3xs space-y-4">
          <h3 className="font-extrabold text-slate-800 text-sm border-b border-slate-100 pb-3 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-teal-600" /> Nearby Farmer Leads (AI matching)
          </h3>
          <div className="space-y-3">
            {[
              { farmer: "Ramesh Singh", village: "Kanakpur", seedQuery: "Basmati Paddy seed", costEst: "₹18,000" },
              { farmer: "Harpreet Brar", village: "Ludhiana Link", seedQuery: "Potassium Sulphate Fertilizers", costEst: "₹8,500" },
            ].map((l, idx) => (
              <div key={idx} className="p-3 bg-amber-500/5 border border-amber-200/50 rounded-xl flex justify-between items-center text-xs">
                <div>
                  <strong className="text-slate-800 font-bold block">{l.farmer} ({l.village})</strong>
                  <span className="text-[10px] text-slate-505">Searching: <span className="underline">{l.seedQuery}</span></span>
                </div>
                <button onClick={() => onViewTab("messages")} className="bg-amber-100 hover:bg-amber-100/80 text-amber-900 text-[10px] font-bold px-3 py-1.5 rounded-lg transition border border-amber-250 cursor-pointer">
                  Send Quote
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};


// --- PAGE 2: PRODUCTS CATALOG ---
export const ShopProductsCatalog: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, currentUser } = useApp();
  
  // States representing dynamic new item
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState<Product["category"]>("Seed");
  const [desc, setDesc] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  
  // Custom Seller added fields
  const [location, setLocation] = useState(currentUser.shopOwnerProfile?.address || "");
  const [contactNumber, setContactNumber] = useState(currentUser.shopOwnerProfile?.contactNumber || "");
  const [isAvailable, setIsAvailable] = useState(true);
  const [images, setImages] = useState<string[]>([]);
  const fileInputRefForProd = useRef<HTMLInputElement>(null);

  // Real Agrarian attributes state
  const [brandName, setBrandName] = useState("");
  const [composition, setComposition] = useState("");
  const [cropCompatibility, setCropCompatibility] = useState("");
  const [dosageInstructions, setDosageInstructions] = useState("");
  const [mfgDate, setMfgDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [govtLicense, setGovtLicense] = useState("");
  const [expectedYieldBoost, setExpectedYieldBoost] = useState("");
  const [safetyPrecautions, setSafetyPrecautions] = useState("");
  const [soilCompatibility, setSoilCompatibility] = useState("");

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [expandedProductSpec, setExpandedProductSpec] = useState<string | null>(null);

  const shopProducts = products.filter((p) => p.shopName === currentUser.shopOwnerProfile?.shopName);

  const handleStartEdit = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setPrice(String(p.price));
    setCategory(p.category);
    setDesc(p.description);
    setStock(String(p.stockCount));
    setImageUrl(p.image);
    
    // Custom Seller added fields
    setLocation(p.location || currentUser.shopOwnerProfile?.address || "");
    setContactNumber(p.contactNumber || currentUser.shopOwnerProfile?.contactNumber || "");
    setIsAvailable(p.isAvailable !== false);
    setImages(p.images || [p.image]);

    // Real elements
    setBrandName(p.brandName || "");
    setComposition(p.composition || "");
    setCropCompatibility(p.cropCompatibility || "");
    setDosageInstructions(p.dosageInstructions || "");
    setMfgDate(p.mfgDate || "");
    setExpiryDate(p.expiryDate || "");
    setGovtLicense(p.govtLicense || "");
    setExpandedProductSpec(p.id);
    setExpectedYieldBoost(p.expectedYieldBoost || "");
    setSafetyPrecautions(p.safetyPrecautions || "");
    setSoilCompatibility(p.soilCompatibility || "");

    // Scroll smoothly to form anchor
    const anchor = document.getElementById("product-form-anchor");
    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleClearForm = () => {
    setEditingProduct(null);
    setName("");
    setPrice("");
    setCategory("Seed");
    setDesc("");
    setStock("");
    setImageUrl("");
    setImages([]);
    setLocation(currentUser.shopOwnerProfile?.address || "");
    setContactNumber(currentUser.shopOwnerProfile?.contactNumber || "");
    setIsAvailable(true);
    setBrandName("");
    setComposition("");
    setCropCompatibility("");
    setDosageInstructions("");
    setMfgDate("");
    setExpiryDate("");
    setGovtLicense("");
    setExpectedYieldBoost("");
    setSafetyPrecautions("");
    setSoilCompatibility("");
  };

  const handlePrimaryImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Primary image exceeds the 2MB size limit!");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setImageUrl(base64);
      // Ensure the primary image is index 0 of images array
      setImages((prev) => {
        if (prev.length === 0) return [base64];
        const copy = [...prev];
        copy[0] = base64;
        return copy;
      });
    };
    reader.readAsDataURL(file);
  };

  const handleAdditionalImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const loadedImages: string[] = [];
    let processed = 0;

    Array.from(files).forEach((file: any) => {
      if (file.size > 2 * 1024 * 1024) {
        alert(`File "${file.name}" exceeds the 2MB size limit!`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        loadedImages.push(base64);
        processed++;

        if (processed === files.length) {
          setImages((prev) => [...prev, ...loadedImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddNewProduct = (e: React.FormEvent) => {
    e.preventDefault();

    // Required Fields Validation
    if (!name.trim()) {
      alert("Validation Error: Product Name is required.");
      return;
    }
    const valPrice = Number(price);
    if (isNaN(valPrice) || valPrice <= 0) {
      alert("Validation Error: Please enter a valid Price greater than 0.");
      return;
    }
    const valStock = Number(stock);
    if (isNaN(valStock) || valStock < 0) {
      alert("Validation Error: Quantity / Stock Count cannot be negative.");
      return;
    }
    if (!location.trim()) {
      alert("Validation Error: Location is required.");
      return;
    }
    if (!contactNumber.trim()) {
      alert("Validation Error: Contact Number is required.");
      return;
    }
    if (!imageUrl) {
      alert("Validation Error: Product Image is strictly REQUIRED. Please upload a product photo.");
      return;
    }

    const payload = {
      name: name.trim(),
      price: valPrice,
      category,
      description: desc || "High efficacy certified yield supply product",
      stockCount: valStock,
      image: imageUrl,
      images: images.length > 0 ? images : [imageUrl],
      location: location.trim(),
      contactNumber: contactNumber.trim(),
      isAvailable,
      // Real Agrarian attributes mapping
      brandName: brandName.trim() || undefined,
      composition: composition.trim() || undefined,
      cropCompatibility: cropCompatibility.trim() || undefined,
      dosageInstructions: dosageInstructions.trim() || undefined,
      mfgDate: mfgDate || undefined,
      expiryDate: expiryDate || undefined,
      govtLicense: govtLicense.trim() || undefined,
      expectedYieldBoost: expectedYieldBoost.trim() || undefined,
      safetyPrecautions: safetyPrecautions.trim() || undefined,
      soilCompatibility: soilCompatibility.trim() || undefined,
    };

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        ...payload,
      });
      alert(`Successfully saved revisions for agricultural product: "${name}"`);
    } else {
      addProduct({
        ...payload,
        shopName: currentUser.shopOwnerProfile?.shopName || "Active Shop",
        shopOwnerName: currentUser.shopOwnerProfile?.ownerName || currentUser.name || "Vendor Seller"
      });
      alert(`Success! Published real-world agricultural item: "${name}" to the live marketplace.`);
    }

    handleClearForm();
  };

  const handleDelete = (pId: string) => {
    if (confirm("Are you sure you want to remove this certified product from your available inventory catalog?")) {
      deleteProduct(pId);
      if (expandedProductSpec === pId) {
        setExpandedProductSpec(null);
      }
    }
  };

  // Image triggers based on category types
  const handleCategoryChoice = (cat: Product["category"]) => {
    setCategory(cat);
  };

  return (
    <div className="space-y-8">
      {/* Intro section */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 shadow-sm border border-slate-800">
        <div className="max-w-2xl">
          <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-full font-bold">
            Real Inventory Dispatch Center
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-white mt-3">Verified Farm Inventory & Agro-Chemical Supplies</h2>
          <p className="text-xs text-slate-350 leading-relaxed mt-1.5">
            Real farmers depend heavily on exact chemical ingredients, dosage constraints, and safety profiles to protect their crops and achieve high yields. Define highly accurate specifications to help farmers make correct, safe purchasing decisions.
          </p>
        </div>
      </div>

      <div id="product-form-anchor" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Extensive technical form (Col 5) */}
        <div className="lg:col-span-5 bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-6">
          <div>
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                {editingProduct ? "✏️ Edit Product Specifications" : "📦 Publish Genuine Crop Supply"}
              </h3>
              {editingProduct && (
                <button 
                  onClick={handleClearForm}
                  className="text-[10px] font-bold text-rose-600 hover:underline bg-rose-50 px-2 py-1 rounded"
                >
                  Cancel Edit
                </button>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">Specify real technical credentials to maintain certification listing standards.</p>
          </div>

          <form onSubmit={handleAddNewProduct} className="space-y-5 text-xs text-slate-700">
            
            {/* Form Section A: Core Parameters */}
            <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 space-y-3">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">A. General Catalog Profile</span>
              
              <div>
                <label className="block text-slate-600 font-bold mb-1">Commercial Product Name <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Syngenta Cruiser Pesticide (500ml)"
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Retail Price (₹/Unit) <span className="text-rose-500">*</span></label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 520"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">Units In Stock <span className="text-rose-500">*</span></label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="e.g. 80"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Category Type</label>
                  <select
                    value={category}
                    onChange={(e) => handleCategoryChoice(e.target.value as any)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-hidden font-semibold"
                  >
                    <option value="Seed">Agricultural Seeds 🌾</option>
                    <option value="Pesticide">Chemical Pesticide 🧪</option>
                    <option value="Fertilizer">NPK Fertilizer / Urea 📦</option>
                    <option value="Tool">Mechanical Farming Tool ⚙️</option>
                    <option value="Other">Other Agritech Supplies 🚜</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">Manufacturer Brand</label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="e.g. Syngenta, Bayer, IFFCO"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Short Description</label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="e.g. Controls root-aphids and early whiteflies on contact. Ideal for rice nursery treatments."
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Product Location <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Mandi Chowk, Kanakpur"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">Seller Contact Number <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    placeholder="e.g. +91 9876543210"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="isAvailableCheckbox"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor="isAvailableCheckbox" className="text-slate-700 font-black cursor-pointer select-none">
                  Mark Product as Available for Farmers
                </label>
              </div>

              <div className="space-y-4 pt-2 border-t border-slate-200/60">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">
                    Primary Product Image <span className="text-rose-500">*</span>
                  </label>
                  {imageUrl ? (
                    <div className="relative w-full h-32 rounded-2xl overflow-hidden border border-slate-200 shadow-3xs group">
                      <img src={imageUrl} className="w-full h-full object-cover" alt="Primary Product" />
                      <button
                        type="button"
                        onClick={() => {
                          setImageUrl("");
                          // Remove first image if it was the primary as well
                          setImages((prev) => prev.slice(1));
                        }}
                        className="absolute top-2 right-2 bg-rose-600 hover:bg-rose-700 text-white rounded-full px-2 py-1 text-[9px] font-bold cursor-pointer shadow-xs transition"
                        title="Remove primary image"
                      >
                        Remove Image ✕
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-2xl p-4 text-center cursor-pointer transition bg-slate-50 relative flex flex-col items-center justify-center min-h-[110px]">
                      <Upload className="w-6 h-6 text-slate-400 mb-1.5" />
                      <span className="text-[11px] font-bold text-slate-600 block">Click to Upload Primary Image</span>
                      <span className="text-[9px] text-slate-400 mt-0.5 block">Supports JPG, PNG (Max 2MB)</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePrimaryImageUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">
                    Additional Gallery Images (Optional)
                  </label>
                  <div className="flex flex-wrap gap-2 pt-1 items-center">
                    <div className="relative w-14 h-14 border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-xl flex items-center justify-center cursor-pointer bg-slate-50 transition flex-shrink-0">
                      <PlusCircle className="w-5 h-5 text-indigo-500" />
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleAdditionalImagesUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                    </div>

                    {images.slice(1).map((img, idx) => (
                      <div key={idx} className="relative w-14 h-14 rounded-xl overflow-hidden border border-slate-200 shadow-3xs group flex-shrink-0">
                        <img src={img} className="w-full h-full object-cover" alt="" />
                        <button
                          type="button"
                          onClick={() => {
                            // index in slice(1) is idx, index in actual images array is idx + 1
                            setImages((prev) => prev.filter((_, i) => i !== idx + 1));
                          }}
                          className="absolute -top-1 -right-1 bg-rose-600 hover:bg-rose-700 text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-black cursor-pointer shadow-xs border border-white"
                          title="Remove Image"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Form Section B: Real Technical Agrarian attributes */}
            <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 space-y-3">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">B. Tech Specifications & Safety (For Real Farmers)</span>
              
              <div>
                <label className="block text-slate-600 font-bold mb-1">Active Ingredients Formula / composition</label>
                <input
                  type="text"
                  value={composition}
                  onChange={(e) => setComposition(e.target.value)}
                  placeholder="e.g. Thiamethoxam 30% FS Liquid Concentrate"
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Target Crops</label>
                  <input
                    type="text"
                    value={cropCompatibility}
                    onChange={(e) => setCropCompatibility(e.target.value)}
                    placeholder="e.g. Rice, Wheat, Cotton, Chilli"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">Dilution / Dosage Instructions</label>
                  <input
                    type="text"
                    value={dosageInstructions}
                    onChange={(e) => setDosageInstructions(e.target.value)}
                    placeholder="e.g. 2 ml per Litre of clean water"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Compatible Soil</label>
                  <input
                    type="text"
                    value={soilCompatibility}
                    onChange={(e) => setSoilCompatibility(e.target.value)}
                    placeholder="e.g. Alluvial, sandy-loam, clayey"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">Expected Yield Lift (%)</label>
                  <input
                    type="text"
                    value={expectedYieldBoost}
                    onChange={(e) => setExpectedYieldBoost(e.target.value)}
                    placeholder="e.g. 15-20% higher wheat volume"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Safety Warnings & Protective Measures</label>
                <input
                  type="text"
                  value={safetyPrecautions}
                  onChange={(e) => setSafetyPrecautions(e.target.value)}
                  placeholder="e.g. Highly toxic, wear protective gloves and respirator masks. Prevent container contamination."
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Form Section C: Batch and Government Licensing Compliance */}
            <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 space-y-3">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">C. Compliance Certifications</span>
              
              <div>
                <label className="block text-slate-600 font-bold mb-1">Govt License / Registration No (CIB&RC / FCO)</label>
                <input
                  type="text"
                  value={govtLicense}
                  onChange={(e) => setGovtLicense(e.target.value)}
                  placeholder="e.g. CIR-12942/2026/Thiamethoxam"
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-hidden font-mono text-[10px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Manufacturing Date</label>
                  <input
                    type="date"
                    value={mfgDate}
                    onChange={(e) => setMfgDate(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">Expiration Date</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-hidden font-mono"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-slate-900 hover:bg-slate-950 text-white font-bold py-3 rounded-2xl text-xs uppercase tracking-widest cursor-pointer transition shadow-xs flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              {editingProduct ? "Save Revised Technical Specs ⚡" : "Publish Registered Supply ⚡"}
            </button>
          </form>
          
          {/* Instant live preview widget */}
          <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-700 flex items-center gap-1.5 font-mono">
              <Sparkles className="w-3.5 h-3.5" /> Instant Live Display Card Preview (Farmers' View)
            </span>
            <div className="bg-white p-4 border border-slate-200 rounded-xl space-y-3">
              <div className="flex gap-3">
                <ImageWithFallback src={imageUrl} category={category} fallbackType="product" className="w-16 h-16 object-cover rounded-xl flex-shrink-0" referrerPolicy="no-referrer" />
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start">
                    <span className="text-[8px] bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded uppercase font-bold">{category}</span>
                    <span className="text-[9px] font-mono text-indigo-600 font-bold">{brandName || "Generic Brand"}</span>
                  </div>
                  <strong className="text-slate-900 block font-bold text-xs">{name || "Supply Name Placeholder"}</strong>
                  <p className="text-[10px] text-slate-400 line-clamp-1">{desc || "Highly recommended certified agricultural products for village crops."}</p>
                  <div className="flex justify-between items-baseline pt-1">
                    <span className="font-mono text-xs font-black text-emerald-800">₹{price || "0"}/unit</span>
                    <span className="text-[9px] text-slate-500">Stock: {stock || "0"} pack</span>
                  </div>
                </div>
              </div>

              {/* Dynamic images gallery preview */}
              {images.length > 0 && (
                <div className="flex gap-1.5 overflow-x-auto py-1">
                  {images.map((img, i) => (
                    <img key={i} src={img} className="w-8 h-8 rounded object-cover border border-slate-150 flex-shrink-0" alt="" />
                  ))}
                </div>
              )}

              {/* Attributes block */}
              <div className="text-[10px] bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1 text-slate-500 font-semibold">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-slate-400" /> Location: <span className="text-slate-800">{location || "Village Center"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-slate-400" /> Hotline: <span className="text-slate-800">{contactNumber || "+91 9999999999"}</span>
                </div>
                <div className="flex items-center gap-1.5 pt-1">
                  <span className={`w-2 h-2 rounded-full ${isAvailable ? "bg-emerald-550" : "bg-rose-500 animate-pulse"}`}></span>
                  Status: <span className={isAvailable ? "text-emerald-750 font-bold" : "text-rose-600 font-bold"}>{isAvailable ? "Available" : "Unavailable (Hidden or Out of stock)"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Active Inventory Bento-Grid (Col 7) */}
        <div className="lg:col-span-7 bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-5">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">🏪 Current Store Inventory</h3>
              <p className="text-xs text-slate-400">Total listed items: {shopProducts.length}</p>
            </div>
            <div className="text-xs bg-slate-100 px-3 py-1.5 rounded-full font-bold text-slate-700">
              Verified Seller Status
            </div>
          </div>
          
          <div className="space-y-4">
            {shopProducts.length === 0 ? (
              <div className="text-center p-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-450 italic font-medium text-xs">
                No items registered on your store yet. Use our left panel specify exact technical sheets for real farmers.
              </div>
            ) : (
              shopProducts.map((p) => {
                const isExpanded = expandedProductSpec === p.id;
                const prodAvailable = p.isAvailable !== false;

                const handleToggleAvailability = () => {
                  updateProduct({
                    ...p,
                    isAvailable: !prodAvailable
                  });
                };

                return (
                  <div key={p.id} className={`border rounded-2xl overflow-hidden hover:border-slate-300 transition-all bg-white shadow-3xs hover:shadow-2xs ${!prodAvailable ? "opacity-75 border-rose-100 bg-rose-50/5" : "border-slate-100"}`}>
                    
                    {/* Head section */}
                    <div className="p-4 flex gap-4 items-start">
                      <ImageWithFallback src={p.image} category={p.category} fallbackType="product" className="w-16 h-16 object-cover rounded-xl flex-shrink-0" referrerPolicy="no-referrer" />
                      
                      <div className="flex-1 min-w-0 pr-2">
                        <div className="flex gap-2 items-center flex-wrap">
                          <span className="text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded uppercase font-bold">
                            {p.category}
                          </span>
                          {p.brandName && (
                            <span className="text-[9px] text-indigo-700 font-bold uppercase tracking-wider bg-indigo-50 px-2 py-0.2 rounded">
                              {p.brandName}
                            </span>
                          )}
                          {p.govtLicense && (
                            <span className="text-[8px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded font-bold">
                              ✓ {p.govtLicense}
                            </span>
                          )}
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${prodAvailable ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600"}`}>
                            {prodAvailable ? "Active/Available" : "Unavailable (Hidden)"}
                          </span>
                        </div>
                        
                        <strong className="text-slate-900 block leading-snug font-bold text-xs mt-1 truncate">
                          {p.name}
                        </strong>
                        <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{p.description}</p>
                        
                        <div className="flex items-center gap-4 text-[10px] mt-1.5">
                          <span className="font-semibold text-emerald-700 font-mono">
                            ₹{p.price}/unit
                          </span>
                          <span className={`font-bold ${p.stockCount < 10 ? "text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded animate-pulse" : "text-sky-700"}`}>
                            Stock: {p.stockCount} units left
                          </span>
                        </div>

                        {/* Custom location & contact overlays */}
                        <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1.5 mt-1 border-t border-slate-100 text-[9px] text-slate-500 font-semibold">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400 font-bold" /> {p.location || "Store Desk"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400 font-bold" /> {p.contactNumber || "Hotline Connected"}
                          </span>
                        </div>

                        {/* Extra image gallery strip */}
                        {p.images && p.images.length > 1 && (
                          <div className="flex gap-1 mt-2">
                            {p.images.slice(0, 4).map((img, index) => (
                              <img key={index} src={img} className="w-7 h-7 rounded object-cover border border-slate-150 flex-shrink-0" alt="" />
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Action Triggers */}
                      <div className="flex flex-col gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => handleStartEdit(p)}
                          className="p-1 px-2.5 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer rounded-lg text-[9px] font-bold text-slate-600 transition flex items-center justify-center gap-1 border border-slate-100 w-full"
                        >
                          <Edit className="w-2.5 h-2.5" /> Edit
                        </button>
                        <button
                          onClick={handleToggleAvailability}
                          className={`p-1 px-2.5 cursor-pointer rounded-lg text-[9px] font-bold transition text-center w-full ${prodAvailable ? "bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100" : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-100"}`}
                          title="Toggle availability of this product in marketplace"
                        >
                          {prodAvailable ? "Mark Unavailable" : "Mark Available"}
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1 px-2.5 bg-slate-50 hover:bg-rose-50 hover:text-rose-600 cursor-pointer rounded-lg text-[9px] font-bold text-slate-600 transition flex items-center justify-center gap-1 border border-slate-100 w-full"
                        >
                          <Trash2 className="w-2.5 h-2.5" /> Delete
                        </button>
                        <button
                          onClick={() => setExpandedProductSpec(isExpanded ? null : p.id)}
                          className="p-1 px-2 bg-indigo-900 hover:bg-indigo-950 text-white cursor-pointer rounded-lg text-[9px] font-mono font-bold transition text-center w-full"
                        >
                          {isExpanded ? "Hide Specs" : "View Specs"}
                        </button>
                      </div>
                    </div>

                    {/* Spec Sheet slideout for Real Farmer */}
                    {isExpanded && (
                      <div className="bg-slate-50/75 p-4 border-t border-slate-100 text-[10px] text-slate-705 leading-relaxed space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-200/60 pb-1.5 mb-1.5">
                          <span className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wide flex items-center gap-1">
                            <Info className="w-3.5 h-3.5 text-indigo-600" /> Agrarian Compliance Spec Sheet
                          </span>
                          <span className="text-[9px] text-indigo-600 font-mono">Ready for verified field-use</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 font-semibold">
                          {p.brandName && (
                            <div>
                              <span className="text-slate-400 block font-normal">Manufacturer Brand:</span>
                              <span className="text-slate-800">{p.brandName}</span>
                            </div>
                          )}
                          {p.composition && (
                            <div>
                              <span className="text-slate-400 block font-normal">Active Ingredients:</span>
                              <span className="text-slate-850 bg-indigo-50/50 px-1 py-0.2 rounded font-mono">{p.composition}</span>
                            </div>
                          )}
                          {p.cropCompatibility && (
                            <div>
                              <span className="text-slate-400 block font-normal">Target Crop Ecosystem:</span>
                              <span className="text-slate-800">{p.cropCompatibility}</span>
                            </div>
                          )}
                          {p.dosageInstructions && (
                            <div>
                              <span className="text-slate-400 block font-normal">Recommended Dosage:</span>
                              <span className="text-indigo-900">{p.dosageInstructions}</span>
                            </div>
                          )}
                          {p.soilCompatibility && (
                            <div>
                              <span className="text-slate-400 block font-normal">Soil Compatibility:</span>
                              <span className="text-slate-800">{p.soilCompatibility}</span>
                            </div>
                          )}
                          {p.expectedYieldBoost && (
                            <div>
                              <span className="text-slate-400 block font-normal">Verified Output Lift Target:</span>
                              <span className="text-emerald-800">{p.expectedYieldBoost}</span>
                            </div>
                          )}
                          {p.govtLicense && (
                            <div>
                              <span className="text-slate-400 block font-normal">Government License Registry No:</span>
                              <span className="text-slate-850 font-mono">{p.govtLicense}</span>
                            </div>
                          )}
                          {(p.mfgDate || p.expiryDate) && (
                            <div>
                              <span className="text-slate-400 block font-normal">Production Run Dates:</span>
                              <span className="text-slate-805 font-mono">
                                MFG: {p.mfgDate || "N/A"} • EXP: {p.expiryDate || "N/A"}
                              </span>
                            </div>
                          )}
                        </div>

                        {p.safetyPrecautions && (
                          <div className="bg-rose-50 border border-rose-100 p-2.5 rounded-xl mt-2">
                            <span className="text-rose-850 font-bold block flex items-center gap-1 text-[9px] uppercase tracking-wider mb-0.5">
                              <ShieldCheck className="w-3.5 h-3.5 text-rose-600" /> Essential Safety Precautions & Warnings:
                            </span>
                            <span className="text-rose-900 leading-normal block">{p.safetyPrecautions}</span>
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

    </div>
  );
};


// --- PAGE 3: ORDERS MANAGEMENT ---
export const ShopOrdersManager: React.FC = () => {
  const { orders, updateOrderStatus, currentUser } = useApp();

  const shopOrders = orders.filter((o) => o.shopName === currentUser.shopOwnerProfile?.shopName);

  return (
    <div className="bg-white border border-slate-150 p-6 rounded-3xl shadow-3xs space-y-4">
      <h3 className="font-extrabold text-slate-850 text-sm uppercase tracking-wider">📦 Dispatch & invoice processing center</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-medium">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 uppercase tracking-widest text-[9px] font-bold text-slate-500">
              <th className="p-3">Order ID</th>
              <th className="p-3">Products Ordered</th>
              <th className="p-3">Client (Farmer ID)</th>
              <th className="p-3">Total Due</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Logistics Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {shopOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-450 italic font-medium">No order requests placed for your shop yet.</td>
              </tr>
            ) : (
              shopOrders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50 text-slate-800 font-semibold">
                  <td className="p-3 font-mono text-[10px] text-slate-550">{o.id}</td>
                  <td className="p-3">{o.productName} ({o.quantity} units)</td>
                  <td className="p-3 text-mono">{o.farmerId}</td>
                  <td className="p-3 font-mono text-emerald-800">₹{o.totalPrice}</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                      o.status === "Delivered" ? "bg-emerald-100 text-emerald-800 border border-emerald-150" : o.status === "Shipped" ? "bg-sky-150 text-sky-800" : "bg-amber-100 text-amber-800"
                    }`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex gap-1 justify-center">
                      {o.status === "Pending" && (
                        <button
                          onClick={() => updateOrderStatus(o.id, "Shipped")}
                          className="bg-sky-600 hover:bg-sky-700 text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-lg transition"
                        >
                          Ship Cargo 🚀
                        </button>
                      )}
                      {o.status === "Shipped" && (
                        <button
                          onClick={() => updateOrderStatus(o.id, "Delivered")}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-lg transition"
                        >
                          Mark Delivered ✅
                        </button>
                      )}
                      {o.status === "Delivered" && (
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Archived Invoice</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};


// --- PAGE 4: CUSTOMERS ---
export const ShopCustomersPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-150 p-6 rounded-3xl shadow-3xs space-y-4">
        <div>
          <h3 className="font-extrabold text-slate-900 text-sm">📞 Client Requests & Soil Diagnostics</h3>
          <p className="text-xs text-slate-400">Farmers coordinate with you for soil pesticide availability. Replying logs straight into the chat messages portal.</p>
        </div>

        <div className="space-y-4">
          {[
            { farmer: "Ramesh Singh", village: "Kanakpur", query: "Do you have copper oxychloride in stock? Need 5kg for potato nursery blights.", replyStatus: "Pending Reply" },
            { farmer: "Harpreet Brar", village: "Ludhiana Link", query: "Does Basmati seeds have a verified germination certification this season?", replyStatus: "Answered" }
          ].map((c, idx) => (
            <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs leading-normal font-semibold">
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <strong className="font-extrabold text-slate-905">{c.farmer} ({c.village})</strong>
                  <span className={`px-2 py-0.2 rounded text-[9px] font-bold ${
                    c.replyStatus === "Pending Reply" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-850"
                  }`}>
                    {c.replyStatus}
                  </span>
                </div>
                <p className="text-slate-555 font-medium italic">"{c.query}"</p>
              </div>
              <div className="flex gap-2">
                <button className="bg-white border border-slate-250 py-1.5 px-4 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-slate-100 cursor-pointer transition">
                  Reject Query
                </button>
                <button className="bg-teal-705 hover:bg-teal-800 text-white py-1.5 px-4 rounded-xl cursor-pointer transition flex items-center gap-1.5">
                  Send Response <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


// --- PAGE 5: ANALYTICS ---
export const ShopAnalytics: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-6">
      
      {/* Chart column (Col 8) */}
      <div className="lg:col-span-8 space-y-6">
        <ShopAnalyticsChart />

        <div className="bg-white border border-slate-150 p-5 rounded-3xl space-y-3 shadow-3xs text-xs font-semibold">
          <h4 className="font-extrabold text-slate-805 text-sm mb-2 uppercase">📈 Operations summary report (Current Month)</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50/70 border border-slate-200 rounded-xl">
              <span className="text-[10px] uppercase text-slate-400 block tracking-wider leading-none">Net EBITDA profit margin</span>
              <strong className="text-emerald-700 text-lg font-black block pt-1.5">₹1,84,000 <span className="text-xs text-slate-500 font-normal">(+12.4%)</span></strong>
            </div>

            <div className="p-3 bg-slate-50/70 border border-slate-200 rounded-xl">
              <span className="text-[10px] uppercase text-slate-400 block tracking-wider leading-none">Mean inventory turnaround days</span>
              <strong className="text-indigo-700 text-lg font-black block pt-1.5">8.4 Business days</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Side insights (Col 4) */}
      <div className="lg:col-span-4 bg-white border border-slate-150 p-5 rounded-3xl shadow-3xs space-y-4 text-xs font-semibold">
        <h4 className="font-extrabold text-slate-900 text-sm uppercase">🏪 Top Selling Agrisupplies</h4>
        <div className="space-y-3.5">
          {[
            { item: "Organic Neem oil Bio-pesticide", stockLeft: 22, score: "High Demand (Most requested)" },
            { item: "Premium NPK 19:19:19 bio-fertilizer", stockLeft: 8, score: "Low Stock Warning!" },
            { item: "Potassium Phosphate Powder 10kg", stockLeft: 45, score: "Moderate demand" }
          ].map((item, idx) => (
            <div key={idx} className="p-3 bg-slate-50 border-l-4 border-indigo-500 rounded-r-xl space-y-1">
              <strong className="text-slate-850 block font-bold text-xs">{item.item}</strong>
              <div className="flex justify-between text-[11px] font-medium text-slate-400">
                <span>Stock left: {item.stockLeft} units</span>
                <span className={`font-bold ${item.score.includes("Warning") ? "text-rose-600" : "text-emerald-700"}`}>
                  {item.score}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};


// --- PAGE 6: PROFILE ---
export const ShopProfilePage: React.FC = () => {
  const { currentUser } = useApp();

  return (
    <div className="space-y-6">
      
      {/* Shop card */}
      <div className="bg-white border border-slate-150 rounded-3xl p-6 shadow-3xs grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-3 flex flex-col items-center space-y-3">
          <div className="w-24 h-24 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center text-4xl select-none text-white font-bold shadow-md">
            🏪
          </div>
          <span className="text-[10px] bg-teal-50 text-teal-800 border border-teal-200 font-bold px-2 py-0.5 rounded-full uppercase">Certified Vendor</span>
        </div>

        <div className="md:col-span-9 space-y-3.5 text-xs text-slate-600 leading-relaxed font-semibold">
          <h3 className="text-xl font-black text-slate-950">{currentUser.shopOwnerProfile?.shopName}</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-slate-105 pt-3">
            <div>
              <span className="text-[10px] uppercase text-slate-400 block tracking-wider leading-none">General Owner</span>
              <strong className="text-slate-800 text-xs block mt-1">{currentUser.shopOwnerProfile?.ownerName}</strong>
            </div>

            <div>
              <span className="text-[10px] uppercase text-slate-400 block tracking-wider leading-none">Address location</span>
              <strong className="text-slate-800 text-xs block mt-1">{currentUser.shopOwnerProfile?.address}</strong>
            </div>

            <div>
              <span className="text-[10px] uppercase text-slate-400 block tracking-wider leading-none">Business Contact</span>
              <strong className="text-slate-800 text-xs block mt-1">{currentUser.shopOwnerProfile?.contactNumber}</strong>
            </div>

            <div>
              <span className="text-[10px] uppercase text-slate-400 block tracking-wider leading-none">Initial Inventory Focus</span>
              <strong className="text-slate-800 text-xs block mt-1">{currentUser.shopOwnerProfile?.productsAvailable}</strong>
            </div>

            <div>
              <span className="text-[10px] uppercase text-slate-400 block tracking-wider leading-none">Home Field Delivery</span>
              <strong className="text-teal-700 text-xs block mt-1">Available to local farms</strong>
            </div>

            <div>
              <span className="text-[10px] uppercase text-slate-400 block tracking-wider leading-none">Agrivon Status</span>
              <strong className="text-emerald-700 text-xs block mt-1">Merchant Platinum Medalist</strong>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
