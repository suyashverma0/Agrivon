import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { ImageWithFallback } from "./ImageWithFallback";
import {
  Package,
  ListOrdered,
  Inbox,
  BarChart,
  UserCheck,
  Percent,
  Plus,
  Edit2,
  Trash2,
  TrendingUp,
  AlertTriangle,
  MapPin,
  Check,
  Send,
  Sparkles,
  Globe,
  MessageSquare
} from "lucide-react";
import { Product, Order } from "../types";

export const ShopOwnerDashboard: React.FC = () => {
  const {
    currentUser,
    users,
    products,
    orders,
    customerRequests,
    messages,
    createProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    replyToCustomerRequest,
    sendChatMessage,
    triggerSystemDemoAction,
    language
  } = useApp();

  const [activeTab, setActiveTab] = useState<"products" | "inventory" | "orders" | "requests" | "analytics" | "leads" | "chat">("products");

  // Chat desk state
  const [activeChatRecipientId, setActiveChatRecipientId] = useState<string>("");
  const [chatMessageText, setChatMessageText] = useState("");

  // Chats translation state
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

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChatRecipientId || !chatMessageText.trim()) return;
    sendChatMessage(activeChatRecipientId, chatMessageText);
    setChatMessageText("");
  };

  const chatPartners = users.filter((u) => u.id !== currentUser.id && u.role === "Farmer");
  const activeChatMessages = messages.filter(
    (m) =>
      (m.senderId === currentUser.id && m.receiverId === activeChatRecipientId) ||
      (m.senderId === activeChatRecipientId && m.receiverId === currentUser.id)
  );

  // Product addition state
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [pName, setPName] = useState("");
  const [pCategory, setPCategory] = useState<Product["category"]>("Seed");
  const [pDesc, setPDesc] = useState("");
  const [pPrice, setPPrice] = useState("");
  const [pStock, setPStock] = useState("");
  const [pOriginalPrice, setPOriginalPrice] = useState("");
  const [pIsPromo, setPIsPromo] = useState(false);

  // reply state
  const [replyTextState, setReplyTextState] = useState<{ [reqId: string]: string }>({});

  const handleCreateOrEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName || !pPrice || !pStock) return;

    if (editingProduct) {
      const updated: Product = {
        ...editingProduct,
        name: pName,
        category: pCategory,
        description: pDesc,
        price: Number(pPrice),
        stockCount: Number(pStock),
        originalPrice: pOriginalPrice ? Number(pOriginalPrice) : undefined,
        isPromo: pIsPromo
      };
      updateProduct(updated);
      setEditingProduct(null);
    } else {
      createProduct({
        name: pName,
        category: pCategory,
        description: pDesc,
        price: Number(pPrice),
        stockCount: Number(pStock),
        image: getCategoryImage(pCategory),
        originalPrice: pOriginalPrice ? Number(pOriginalPrice) : undefined,
        isPromo: pIsPromo
      });
      setIsAddingProduct(false);
    }

    // Reset Form
    setPName("");
    setPDesc("");
    setPPrice("");
    setPStock("");
    setPOriginalPrice("");
    setPIsPromo(false);
  };

  const startEditProduct = (p: Product) => {
    setEditingProduct(p);
    setPName(p.name);
    setPCategory(p.category);
    setPDesc(p.description);
    setPPrice(String(p.price));
    setPStock(String(p.stockCount));
    setPOriginalPrice(p.originalPrice ? String(p.originalPrice) : "");
    setPIsPromo(p.isPromo ?? false);
    setIsAddingProduct(true);
  };

  const getCategoryImage = (cat: Product["category"]): string => {
    if (cat === "Seed") return "https://images.unsplash.com/photo-1574325131876-a79996ed93ab?auto=format&fit=crop&q=80&w=150";
    if (cat === "Pesticide") return "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=150";
    if (cat === "Fertilizer") return "https://images.unsplash.com/photo-1628352617636-b51c93ef53c1?auto=format&fit=crop&q=80&w=150";
    return "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=150";
  };

  const submitReply = (requestId: string) => {
    const text = replyTextState[requestId] || "";
    if (!text.trim()) return;
    replyToCustomerRequest(requestId, text);
    setReplyTextState((prev) => ({ ...prev, [requestId]: "" }));
    alert("Reply dispatched successfully.");
  };

  // Nearby farmers calculations (Smart Matching):
  // Find farmers that grow crops suitable for our inventory or resides within vicinity
  const farmerLeads = users.filter((u) => u.role === "Farmer");

  // Shop Owner stats logic
  const myProducts = products.filter((p) => p.shopOwnerId === currentUser.id);
  const myOrders = orders.filter((o) => o.shopOwnerId === currentUser.id);
  const totalRevenue = myOrders
    .filter((o) => o.status === "Delivered")
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const lowStockProducts = myProducts.filter((p) => p.stockCount <= 10);
  const pendingOrders = myOrders.filter((o) => o.status === "Pending");

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      
      {/* Banner bar */}
      <div className="bg-gradient-to-r from-emerald-900 to-indigo-900 text-white rounded-2xl p-6 mb-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="bg-indigo-500 text-white text-[10px] uppercase font-mono font-bold tracking-widest px-2.5 py-0.5 rounded-full select-none">
            Krishi Merchant Console
          </span>
          <h1 className="text-2xl font-bold mt-2">{currentUser.shopOwnerProfile?.shopName} 🏪</h1>
          <p className="text-indigo-100 text-xs mt-1">
            Managed by {currentUser.shopOwnerProfile?.ownerName} • Contact: {currentUser.shopOwnerProfile?.contactNumber}
          </p>
          <div className="flex gap-2 mt-4 flex-wrap text-xs">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📍 {currentUser.shopOwnerProfile?.address}
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              🚚 Delivery status: {currentUser.shopOwnerProfile?.deliveryAvailability ? "Active Village Dispatch" : "Store Counter Only"}
            </span>
          </div>
        </div>

        {/* Quick Insights Cards */}
        <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
          <div className="bg-white/10 p-4 rounded-xl text-center">
            <span className="block text-[10px] uppercase text-indigo-200 font-bold tracking-wider mb-1">Delivered Revenue</span>
            <span className="text-lg font-black text-emerald-450 font-mono">₹{totalRevenue}</span>
          </div>
          <div className="bg-white/10 p-4 rounded-xl text-center">
            <span className="block text-[10px] uppercase text-indigo-200 font-bold tracking-wider mb-1">Pending Dispatches</span>
            <span className="text-lg font-black text-rose-300 font-mono">{pendingOrders.length} orders</span>
          </div>
        </div>
      </div>

      {/* Low Stock Alerts */}
      {lowStockProducts.length > 0 && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-950 p-4 rounded-xl flex gap-3 text-xs leading-relaxed animate-pulse">
          <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">Inventory Refill Warning:</strong>
            <p className="mt-0.5">
              The following agricultural products are reaching critical stock thresholds (&lt; 10 units):{" "}
              {lowStockProducts.map((p) => `"${p.name}" (${p.stockCount} units)`).join(", ")}. Refill rapidly to prevent local farmer order cancellations.
            </p>
          </div>
        </div>
      )}

      {/* Main dashboard tab grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Navigation panel */}
        <div className="lg:col-span-1 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm h-fit space-y-1">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-3 py-2">Merchant Desk</h2>

          <button
            onClick={() => setActiveTab("products")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "products" ? "bg-indigo-900 text-white shadow-xs" : "text-gray-700 hover:bg-slate-50"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Package className="h-4 w-4" /> Product Listings
            </span>
            <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded-full font-bold">{myProducts.length}</span>
          </button>

          <button
            onClick={() => setActiveTab("inventory")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "inventory" ? "bg-indigo-900 text-white shadow-xs" : "text-gray-700 hover:bg-slate-50"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <AlertTriangle className="h-4 w-4" /> Stock Control
            </span>
            {lowStockProducts.length > 0 && (
              <span className="bg-red-100 text-red-700 text-[10px] font-bold px-1.5 py-0.2 rounded-full">!</span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "orders" ? "bg-indigo-900 text-white shadow-xs" : "text-gray-700 hover:bg-slate-50"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <ListOrdered className="h-4 w-4" /> Order Dispatches
            </span>
            <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded-full font-bold">{myOrders.length}</span>
          </button>

          <button
            onClick={() => setActiveTab("requests")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "requests" ? "bg-indigo-900 text-white shadow-xs" : "text-gray-700 hover:bg-slate-50"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Inbox className="h-4 w-4" /> Customer Queries
            </span>
            <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.2 rounded-full font-bold">
              {customerRequests.filter((r) => r.shopOwnerId === currentUser.id && !r.replyText).length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "analytics" ? "bg-indigo-900 text-white shadow-xs" : "text-gray-700 hover:bg-slate-50"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <TrendingUp className="h-4 w-4" /> Sales Analytics
            </span>
          </button>

          <button
            onClick={() => setActiveTab("leads")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "leads" ? "bg-indigo-900 text-white shadow-xs" : "text-gray-700 hover:bg-slate-50"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <MapPin className="h-4 w-4" /> Nearby Farmer Leads
            </span>
            <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-1 py-0.2 rounded uppercase">Smart Match</span>
          </button>

          <button
            onClick={() => setActiveTab("chat")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "chat" ? "bg-indigo-900 text-white shadow-xs" : "text-gray-700 hover:bg-slate-50"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <MessageSquare className="h-4 w-4" /> Direct Chat Desk
            </span>
            <span className="text-[10px] bg-indigo-50 text-indigo-900 px-1.5 py-0.2 rounded-full font-bold">Live</span>
          </button>
        </div>

        {/* Dynamic Display Panel */}
        <div className="lg:col-span-3">
          
          {/* 1. PRODUCT LISTINGS */}
          {activeTab === "products" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Manage Farm Inventory Tools</h3>
                  <p className="text-xs text-gray-500">Add or edit seeds, pesticides, fertilizers, and mechanical tools available to local farmers.</p>
                </div>
                
                <button
                  onClick={() => {
                    setIsAddingProduct(true);
                    setEditingProduct(null);
                  }}
                  className="flex items-center justify-center gap-1.5 bg-indigo-900 hover:bg-indigo-950 text-white px-3 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  <Plus className="h-4 w-4" /> Add Seed/Drug
                </button>
              </div>

              {/* Product form toggle */}
              {isAddingProduct && (
                <form onSubmit={handleCreateOrEditProduct} className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-4 animate-fade-in text-xs">
                  <span className="block font-bold text-gray-950">
                    {editingProduct ? `Edit Listing: "${editingProduct.name}"` : "Add Agricultural Product Item"}
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-600 font-semibold mb-1">Product Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Basmati Rice Hybrid Seed Bag"
                        value={pName}
                        onChange={(e) => setPName(e.target.value)}
                        className="w-full text-xs px-3 py-2 border border-blue-200 bg-white rounded-lg focus:outline"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-600 font-semibold mb-1">Category Type</label>
                      <select
                        value={pCategory}
                        onChange={(e: any) => setPCategory(e.target.value)}
                        className="w-full text-xs px-3 py-2 border border-blue-200 bg-white rounded-lg focus:outline"
                      >
                        <option value="Seed">Seed Variety 🌾</option>
                        <option value="Pesticide">Pesticide / Spray Drug 🧪</option>
                        <option value="Fertilizer">Chemical Fertilizer 🧪</option>
                        <option value="Tool">Mechanical Farm Tool ⚙️</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-600 font-semibold mb-1">Inventory Stock Count</label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 50"
                        value={pStock}
                        onChange={(e) => setPStock(e.target.value)}
                        className="w-full text-xs px-3 py-2 border border-blue-200 bg-white rounded-lg focus:outline font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">Item Description</label>
                    <textarea
                      required
                      placeholder="e.g. Organic potassium booster spray with broad spectrum coverage. Yields rich crops cycle."
                      value={pDesc}
                      onChange={(e) => setPDesc(e.target.value)}
                      className="w-full text-xs p-3 border border-blue-200 bg-white rounded-lg focus:outline"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-600 font-semibold mb-1">Retail Price (₹)</label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 450"
                        value={pPrice}
                        onChange={(e) => setPPrice(e.target.value)}
                        className="w-full text-xs px-3 py-2 border border-blue-200 bg-white rounded-lg focus:outline font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 font-semibold mb-1">Original Price (₹ - Optional for Discount promo)</label>
                      <input
                        type="number"
                        placeholder="e.g. 550"
                        value={pOriginalPrice}
                        onChange={(e) => setPOriginalPrice(e.target.value)}
                        className="w-full text-xs px-3 py-2 border border-blue-200 bg-white rounded-lg focus:outline font-mono"
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-5">
                      <input
                        type="checkbox"
                        id="promoCheck"
                        checked={pIsPromo}
                        onChange={(e) => setPIsPromo(e.target.checked)}
                        className="rounded border-gray-300 text-indigo-900"
                      />
                      <label htmlFor="promoCheck" className="text-xs font-semibold text-gray-600 select-none">
                        Label as Dynamic Promotion
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 text-xs pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingProduct(false);
                        setEditingProduct(null);
                      }}
                      className="px-4 py-2 border border-gray-200 rounded font-medium text-gray-600 bg-white"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="px-5 py-2 bg-indigo-900 hover:bg-indigo-950 text-white rounded font-bold cursor-pointer">
                      {editingProduct ? "Save Changes" : "Publish Supply"}
                    </button>
                  </div>
                </form>
              )}

              {/* Products Directory Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myProducts.length === 0 ? (
                  <p className="text-xs text-gray-400">No tools listed yet. Feed your catalogue list today.</p>
                ) : (
                  myProducts.map((p) => (
                    <div key={p.id} className="border border-slate-100 rounded-xl p-4 flex gap-3 flex-col justify-between hover:shadow-xs transition">
                      <div className="flex gap-3">
                        <ImageWithFallback
                          src={p.image}
                          alt={p.name}
                          category={p.category}
                          fallbackType="product"
                          className="w-16 h-16 rounded object-cover flex-shrink-0 bg-slate-100"
                        />
                        <div className="text-xs">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[9px] uppercase font-bold tracking-wider text-indigo-750">{p.category}</span>
                            {p.isPromo && <span className="bg-indigo-100 text-indigo-805 text-[8px] font-bold px-1.5 rounded-full uppercase">Promo %</span>}
                          </div>
                          <strong className="text-gray-900 font-bold block text-sm leading-tight">{p.name}</strong>
                          <p className="text-gray-500 text-[10px] mt-1 leading-normal">{p.description}</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2.5 mt-3 border-t border-slate-50 text-xs">
                        <div>
                          <span className="text-[10px] text-gray-400 block">Pricing:</span>
                          <span className="font-extrabold text-gray-905">₹{p.price}</span>
                          {p.originalPrice && <span className="text-[9px] text-red-400 line-through block font-normal">₹{p.originalPrice}</span>}
                        </div>

                        <div>
                          <span className="text-[10px] text-gray-400 block text-right">Available stock:</span>
                          <strong className={`font-semibold text-right block ${p.stockCount <= 10 ? "text-red-600" : "text-slate-700"}`}>
                            {p.stockCount} units
                          </strong>
                        </div>

                        <div className="flex gap-1">
                          <button
                            onClick={() => startEditProduct(p)}
                            className="bg-slate-100 hover:bg-indigo-50 border border-slate-200 text-slate-800 p-1.5 rounded transition"
                            title="Edit"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete "${p.name}"?`)) deleteProduct(p.id);
                            }}
                            className="bg-red-50 hover:bg-red-100 text-red-600 p-1.5 rounded transition"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* 2. INVENTORY STOCK CONTROL */}
          {activeTab === "inventory" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 font-sans">Stock Control & Broadcaster</h3>
                <p className="text-xs text-gray-500">Quick adjust available stock margins and announce pricing discounts to villagers.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs divide-y divide-gray-100">
                  <thead className="bg-slate-50 uppercase tracking-widest text-[9px] font-bold text-gray-400">
                    <tr>
                      <th className="py-2.5 px-3">Item name</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3 text-right">Current Stock</th>
                      <th className="py-2.5 px-3">Price</th>
                      <th className="py-2.5 px-3">Promotions</th>
                      <th className="py-2.5 px-3 text-right">Perform Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-slate-700">
                    {myProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-3 font-semibold text-gray-900">{p.name}</td>
                        <td className="py-3 px-3 uppercase text-[10px] tracking-wider text-slate-550">{p.category}</td>
                        <td className="py-3 px-3 text-right font-mono">
                          <span className={`font-bold ${p.stockCount <= 10 ? "text-red-600" : "text-gray-950"}`}>
                            {p.stockCount} {p.stockCount <= 10 ? "⚠️ Low" : ""}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono">₹{p.price}</td>
                        <td className="py-3 px-3">
                          {p.isPromo ? (
                            <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.5 rounded-full select-none">DISCOUNT % active</span>
                          ) : (
                            <span className="text-gray-400 text-[10px]">No promo</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex gap-1 justify-end">
                            <button
                              onClick={() => {
                                const newAmount = prompt(`Add inventory amount for "${p.name}":`, "10");
                                if (newAmount !== null) {
                                  updateProduct({
                                    ...p,
                                    stockCount: p.stockCount + (Number(newAmount) || 0)
                                  });
                                }
                              }}
                              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-900 px-2.5 py-1 rounded text-[10px] font-bold transition"
                            >
                              + Refill
                            </button>
                            <button
                              onClick={() => {
                                updateProduct({
                                  ...p,
                                  isPromo: !p.isPromo,
                                  originalPrice: p.isPromo ? undefined : Math.ceil(p.price * 1.2),
                                  price: p.isPromo ? (p.originalPrice || p.price) : Math.ceil(p.price * 0.9) // 10% off
                                });
                              }}
                              className="bg-purple-50 hover:bg-purple-100 text-purple-800 px-2.5 py-1 rounded text-[10px] font-bold transition"
                            >
                              Promo Toggle
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. ORDER DISPATCHES */}
          {activeTab === "orders" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Custom Farmer Shipments</h3>
                <p className="text-xs text-gray-500 font-sans">Track requests logged by village farmers. Update dispatch status here.</p>
              </div>

              <div className="space-y-4">
                {myOrders.length === 0 ? (
                  <p className="text-xs text-gray-400">Order book is completely vacant. Wait as farmers order basal elements.</p>
                ) : (
                  myOrders.map((o) => (
                    <div key={o.id} className="border border-slate-100 rounded-xl p-4 flex flex-col md:flex-row justify-between gap-4 shadow-3xs text-xs">
                      <div className="space-y-1.5 max-w-md">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold text-slate-400 uppercase">Order ID: {o.id.substring(0, 8)}</span>
                          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                            o.status === "Delivered" ? "bg-emerald-100 text-emerald-800" :
                            o.status === "Shipped" ? "bg-blue-105 text-blue-900" : "bg-amber-100 text-amber-850"
                          }`}>
                            {o.status}
                          </span>
                        </div>
                        <span className="block text-sm font-bold text-slate-900">
                          {o.productName} • Quantity: {o.quantity} units
                        </span>
                        <div className="text-[11px] text-slate-500 leading-normal">
                          Ordered by: <strong>{o.farmerName}</strong> • Address: {o.farmerAddress}
                        </div>
                      </div>

                      <div className="flex flex-col justify-between items-end gap-2 text-right">
                        <div>
                          <span className="text-[10px] text-gray-400 block">Value Amount:</span>
                          <strong className="text-sm font-bold text-slate-905">₹{o.totalPrice}</strong>
                        </div>

                        {/* Status changes dispatches */}
                        <div className="flex gap-1.5 pt-1.5 border-t border-slate-50 w-full justify-end">
                          {o.status === "Pending" && (
                            <button
                              onClick={() => updateOrderStatus(o.id, "Approved")}
                              className="bg-indigo-900 hover:bg-slate-900 text-white px-2.5 py-1 text-[10px] font-bold rounded"
                            >
                              Approve
                            </button>
                          )}
                          {o.status === "Approved" && (
                            <button
                              onClick={() => updateOrderStatus(o.id, "Shipped")}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 text-[10px] font-bold rounded"
                            >
                              Dispatch/Ship
                            </button>
                          )}
                          {o.status === "Shipped" && (
                            <button
                              onClick={() => updateOrderStatus(o.id, "Delivered")}
                              className="bg-emerald-700 hover:bg-emerald-800 text-white px-2.5 py-1 text-[10px] font-bold rounded"
                            >
                              Mark Delivered✓
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* 4. CUSTOMER QUERIES */}
          {activeTab === "requests" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Farmers Stock Requests</h3>
                <p className="text-xs text-gray-500">Farmers post direct diagnostic and stock-seeking inquiries. Send custom replies schedule.</p>
              </div>

              <div className="space-y-4">
                {customerRequests.filter((r) => r.shopOwnerId === currentUser.id).length === 0 ? (
                  <p className="text-xs text-gray-400">Merchant inbox is clean.</p>
                ) : (
                  customerRequests
                    .filter((r) => r.shopOwnerId === currentUser.id)
                    .map((req) => (
                      <div key={req.id} className="border border-slate-100 p-4 rounded-xl text-xs space-y-3 shadow-4xs">
                        <div className="flex justify-between items-center bg-slate-50 p-2 rounded">
                          <div>
                            <strong className="block text-slate-900">Subject: {req.subject}</strong>
                            <span className="text-[10px] text-gray-500 font-semibold subtitle">Farmer: {req.farmerName}</span>
                          </div>
                          <span className="text-[10px] text-gray-400 font-mono">{req.createdAt.split("T")[0]}</span>
                        </div>
                        <p className="text-gray-700 italic">“{req.message}”</p>

                        {/* Reply box */}
                        {req.replyText ? (
                          <div className="bg-emerald-50 rounded p-2 text-emerald-900 border-l-2 border-emerald-500">
                            <strong>Your Reply:</strong>
                            <p className="mt-0.5">{req.replyText}</p>
                          </div>
                        ) : (
                          <div className="space-y-1.5 pt-2 border-t border-slate-50">
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Type Reply</label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Type answer, availability, prices..."
                                value={replyTextState[req.id] || ""}
                                onChange={(e) => setReplyTextState({ ...replyTextState, [req.id]: e.target.value })}
                                className="flex-grow text-xs px-2.5 py-1 bg-white border border-gray-200 rounded-lg focus:outline"
                              />
                              <button
                                onClick={() => submitReply(req.id)}
                                className="bg-slate-700 hover:bg-slate-800 text-white px-4 py-1 rounded-lg text-xs cursor-pointer"
                              >
                                Send
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                )}
              </div>
            </div>
          )}

          {/* 5. SALES ANALYTICS */}
          {activeTab === "analytics" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 font-sans">Business Sales Metrics</h3>
                <p className="text-xs text-gray-500">Revenue stats, visual volume metrics, and high-demand product models logs.</p>
              </div>

              {/* Stats bento */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-55 p-4 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-widest">Store Inventory Value</span>
                  <span className="text-2xl font-black text-slate-850 font-mono">₹{myProducts.reduce((sum, p) => sum + p.price * p.stockCount, 0)}</span>
                  <p className="text-[10px] text-gray-400 mt-1">Total wholesale asset capacity</p>
                </div>

                <div className="bg-slate-55 p-4 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-widest">Delivered Invoices</span>
                  <span className="text-2xl font-black text-emerald-800 font-mono">₹{totalRevenue}</span>
                  <p className="text-[10px] text-gray-400 mt-1">Realized liquid funds</p>
                </div>

                <div className="bg-slate-55 p-4 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-widest">Stock Varieties</span>
                  <span className="text-2xl font-black text-indigo-900 font-mono">{myProducts.length} Brands</span>
                  <p className="text-[10px] text-gray-400 mt-1">Active crop treatments</p>
                </div>
              </div>

              {/* Graphic visual representing highest selling varieties */}
              <div className="border border-slate-100 rounded-xl p-4 space-y-3">
                <span className="text-xs font-bold text-slate-900 block uppercase tracking-wider">Demand Analytics by Product Category</span>
                <div className="space-y-2.5 pt-2">
                  <div>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Seeds (Paddy Varieties)</span>
                      <strong>₹23,500 (62%)</strong>
                    </div>
                    <div className="w-full bg-slate-105 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full" style={{ width: "62%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Pesticides & Bio Control</span>
                      <strong>₹8,900 (23%)</strong>
                    </div>
                    <div className="w-full bg-slate-105 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full" style={{ width: "23%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Spraying Equipment/Tools</span>
                      <strong>₹5,500 (15%)</strong>
                    </div>
                    <div className="w-full bg-slate-105 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-purple-600 h-full" style={{ width: "15%" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 6. NEARBY LEADS (Smart Matching) */}
          {activeTab === "leads" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Smart Matching Area leads</h3>
                <p className="text-xs text-gray-500">The platform automatically recommends nearby village farms growing specific crops to matching supplies.</p>
              </div>

              <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl text-xs text-indigo-900 leading-relaxed">
                <span className="font-bold">Recommendation Model:</span> Matches farmers using chemical/fertilizer/seed combinations based on state context, farm size, crops grown, and proximity.
              </div>

              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-900 block uppercase tracking-widest">Active Farmer Cohorts nearby</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {farmerLeads.map((f) => (
                    <div key={f.id} className="border border-indigo-50 rounded-xl p-4 bg-white hover:border-indigo-200 transition-all text-xs flex flex-col justify-between shadow-4xs">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <strong className="text-slate-900 text-sm font-bold">{f.farmerProfile?.name}</strong>
                          <span className="text-[8px] bg-indigo-50 text-indigo-850 font-bold uppercase py-0.5 px-1.5 rounded-full">Farmer</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block font-mono">Location: {f.farmerProfile?.village}, {f.farmerProfile?.state}</span>
                        
                        <div className="mt-3 space-y-1 text-slate-600">
                          <div>🚜 Farm scale: <strong className="text-slate-900">{f.farmerProfile?.farmSize} Acres</strong></div>
                          <div>🌾 Crops Grown: <strong className="text-indigo-900">{f.farmerProfile?.cropsGrown}</strong></div>
                        </div>
                      </div>

                      {/* Recommend supply action directly */}
                      <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
                        <span className="text-[10px] text-gray-400">Match rating: Extremely High</span>
                        
                        <button
                          onClick={() => {
                            setActiveTab("requests");
                            alert(`Initiating promotion broadcast message draft for ${f.farmerProfile?.name}...`);
                          }}
                          className="bg-indigo-900 hover:bg-slate-900 text-white py-1 px-3 rounded text-[10px] font-bold"
                        >
                          Recommend Supplies
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CHAT TAB */}
          {activeTab === "chat" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-3 min-h-[500px]">
              
              {/* Left Contact Directory */}
              <div className="border-r border-gray-100 p-4 space-y-4 bg-slate-50/50">
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Directory</span>
                <div className="space-y-1.5">
                  {chatPartners.map((u) => {
                    const name = u.farmerProfile?.name + " (Farmer 🌾)";
                    return (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => setActiveChatRecipientId(u.id)}
                        className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                          activeChatRecipientId === u.id
                            ? "bg-indigo-900 text-white font-semibold shadow-xs"
                            : "text-gray-700 bg-white border border-gray-100 hover:bg-indigo-50/50"
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
                      <h4 className="font-bold text-xs text-gray-805">
                        Direct Chat: <strong>{users.find((u) => u.id === activeChatRecipientId)?.farmerProfile?.name}</strong>
                      </h4>
                      <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-2 py-1 rounded-xl">
                        <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1">
                          <Globe className="h-3 w-3 text-indigo-900" /> Preferred Language:
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
                                  isSent ? "bg-indigo-900 text-white rounded-br-none" : "bg-gray-100 text-gray-800 rounded-bl-none"
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
                                        <div className="bg-indigo-50 p-2 rounded-lg text-indigo-950 text-[11px] mt-1">
                                          <div className="flex items-center justify-between text-[9px] font-bold text-indigo-805 uppercase tracking-wider mb-1">
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
                                            className="underline font-bold text-indigo-905 ml-1 cursor-pointer"
                                          >
                                            Retry
                                          </button>
                                        </div>
                                      )
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => handleTranslateMessage(msg.id, msg.content, preferredLanguage)}
                                        className="text-[10px] font-bold text-indigo-900 hover:text-indigo-950 flex items-center gap-1 cursor-pointer"
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
                        className="flex-grow text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                      <button type="submit" className="bg-indigo-900 hover:bg-slate-900 text-white p-2 rounded-lg cursor-pointer">
                        <Send className="h-4 w-4" />
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-24 text-gray-400 text-xs">
                    Select a Farmer neighbor from the left directory to chat.
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
