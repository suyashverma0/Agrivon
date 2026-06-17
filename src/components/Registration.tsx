import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Role } from "../types";
import { User, Store, ShieldAlert, CheckCircle2 } from "lucide-react";

interface RegistrationProps {
  onCancel?: () => void;
}

export const Registration: React.FC<RegistrationProps> = ({ onCancel }) => {
  const { registerNewUser } = useApp();
  const [selectedRole, setSelectedRole] = useState<Role>("Farmer");
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  // Farmer fields
  const [farmerName, setFarmerName] = useState("");
  const [farmerVillage, setFarmerVillage] = useState("");
  const [farmerState, setFarmerState] = useState("");
  const [farmerSize, setFarmerSize] = useState("");
  const [farmerCrops, setFarmerCrops] = useState("");
  const [farmerExp, setFarmerExp] = useState("");

  // ShopOwner fields
  const [shopName, setShopName] = useState("");
  const [shopOwnerName, setShopOwnerName] = useState("");
  const [shopAddr, setShopAddr] = useState("");
  const [shopContact, setShopContact] = useState("");
  const [shopProds, setShopProds] = useState("");
  const [shopDelivery, setShopDelivery] = useState(true);

  // Worker fields
  const [workerName, setWorkerName] = useState("");
  const [workerVillage, setWorkerVillage] = useState("");
  const [workerSkills, setWorkerSkills] = useState("");
  const [workerExp, setWorkerExp] = useState("");
  const [workerWage, setWorkerWage] = useState("");
  const [workerMobile, setWorkerMobile] = useState("");
  const [workerDistrict, setWorkerDistrict] = useState("");
  const [workerState, setWorkerState] = useState("");
  const [workerPic, setWorkerPic] = useState("https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=150");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    let profileData: any = {};
    if (selectedRole === "Farmer") {
      profileData = {
        name: farmerName || "Farmer Partner",
        village: farmerVillage || "Wheat Village",
        state: farmerState || "State",
        farmSize: Number(farmerSize) || 2,
        cropsGrown: farmerCrops || "Wheat",
        experience: Number(farmerExp) || 3,
        profilePicture: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=150"
      };
    } else if (selectedRole === "ShopOwner") {
      profileData = {
        shopName: shopName || "Agri Seeds",
        ownerName: shopOwnerName || "Shop Partner",
        address: shopAddr || "Market Road",
        contactNumber: shopContact || "9876543210",
        productsAvailable: shopProds || "Seeds and Pesticides",
        deliveryAvailability: shopDelivery
      };
    } else if (selectedRole === "Worker") {
      profileData = {
        name: workerName || "Worker Buddy",
        village: workerVillage || "Harvest Village",
        district: workerDistrict || "District",
        state: workerState || "State",
        mobileNumber: workerMobile || "9999999999",
        skills: workerSkills || "Irrigation, Planting",
        experience: Number(workerExp) || 4,
        dailyWageExpectation: Number(workerWage) || 380,
        availabilityStatus: "Available",
        profilePicture: workerPic
      };
    }

    registerNewUser(selectedRole, profileData, email);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-2xl shadow-xl p-8 border border-emerald-100 text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="h-10 w-10 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Complete!</h2>
        <p className="text-gray-600 mb-6 text-sm">
          Welcome to the Agriculture Ecosystem Platform as a <strong>{selectedRole}</strong>. Your account has been initialized instantly.
        </p>
        <button
          onClick={() => {
            setSuccess(false);
            if (onCancel) onCancel();
          }}
          className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
        >
          Go To My Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto my-8 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 p-6 text-white">
        <h2 className="text-2xl font-bold">Join Our Agriculture Platform</h2>
        <p className="text-emerald-100 text-sm mt-1">Connect, trade, find labor, and use advanced AI crop diagnostics.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-3">Choose Your Role</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setSelectedRole("Farmer")}
              className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center text-center gap-2 transition-all ${
                selectedRole === "Farmer"
                  ? "border-emerald-600 bg-emerald-50/70 text-emerald-900"
                  : "border-gray-100 bg-white hover:border-gray-200 text-gray-700"
              }`}
            >
              <span className="text-3xl">🌾</span>
              <span className="font-semibold text-sm">Farmer</span>
              <span className="text-[10px] opacity-80">Post jobs, track prices, detect pests, buy supplies</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole("ShopOwner")}
              className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center text-center gap-2 transition-all ${
                selectedRole === "ShopOwner"
                  ? "border-emerald-600 bg-emerald-50/70 text-emerald-900"
                  : "border-gray-100 bg-white hover:border-gray-200 text-gray-700"
              }`}
            >
              <span className="text-3xl">🏪</span>
              <span className="font-semibold text-sm">Shop Owner</span>
              <span className="text-[10px] opacity-80">List supplies, manage orders, view nearby leads</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole("Worker")}
              className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center text-center gap-2 transition-all ${
                selectedRole === "Worker"
                  ? "border-emerald-600 bg-emerald-50/70 text-emerald-900"
                  : "border-gray-100 bg-white hover:border-gray-200 text-gray-700"
              }`}
            >
              <span className="text-3xl">👨‍🌾</span>
              <span className="font-semibold text-sm">Farm Worker</span>
              <span className="text-[10px] opacity-80">Apply for farm jobs, track wage earnings, chat with owners</span>
            </button>
          </div>
        </div>

        <div className="space-y-4 pt-2 border-t border-gray-100">
          <h3 className="font-semibold text-sm text-gray-900">Account Credentials & Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="farmer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-sm px-3.5 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Fields */}
        {selectedRole === "Farmer" && (
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="font-semibold text-sm text-gray-950 flex items-center gap-1.5">
              <span>🌾</span> Farmer Profile Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Singh"
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Village Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rampur"
                  value={farmerVillage}
                  onChange={(e) => setFarmerVillage(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">State</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Punjab"
                  value={farmerState}
                  onChange={(e) => setFarmerState(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Total Farm Size (Acres)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 5"
                  value={farmerSize}
                  onChange={(e) => setFarmerSize(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Principal Crops Grown</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wheat, Sugarcane (comma separated)"
                  value={farmerCrops}
                  onChange={(e) => setFarmerCrops(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Farming Experience (Years)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 10"
                  value={farmerExp}
                  onChange={(e) => setFarmerExp(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline"
                />
              </div>
            </div>
          </div>
        )}

        {selectedRole === "ShopOwner" && (
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="font-semibold text-sm text-gray-950 flex items-center gap-1.5">
              <span>🏪</span> Shop & Inventory Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Agricultural Shop Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kisan Seed Store"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Owner Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amit Patel"
                  value={shopOwnerName}
                  onChange={(e) => setShopOwnerName(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Business Address</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Plot 15, Near Local Grain Mandi"
                  value={shopAddr}
                  onChange={(e) => setShopAddr(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Business Contact Number</label>
                <input
                  type="text"
                  required
                  placeholder="10-digit mobile"
                  value={shopContact}
                  onChange={(e) => setShopContact(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Products/Supplies Available</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Basmati seeds, Urea, sprayers"
                  value={shopProds}
                  onChange={(e) => setShopProds(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline"
                />
              </div>
              <div className="md:col-span-2 flex items-center gap-2 py-2">
                <input
                  type="checkbox"
                  id="shopDeliveryCheck"
                  checked={shopDelivery}
                  onChange={(e) => setShopDelivery(e.target.checked)}
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="shopDeliveryCheck" className="text-xs text-gray-700 font-medium">
                  We provide direct field delivery to local village farms
                </label>
              </div>
            </div>
          </div>
        )}

        {selectedRole === "Worker" && (
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="font-semibold text-sm text-gray-950 flex items-center gap-1.5">
              <span>👨‍🌾</span> Laborer & Worker Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sunil Yadav"
                  value={workerName}
                  onChange={(e) => setWorkerName(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Village Residence</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mohana"
                  value={workerVillage}
                  onChange={(e) => setWorkerVillage(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Specialized Skills</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Paddy Sowing, Spraying, Drip setup"
                  value={workerSkills}
                  onChange={(e) => setWorkerSkills(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Experience (Years)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 4"
                  value={workerExp}
                  onChange={(e) => setWorkerExp(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Daily Wage Expectation (₹)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 400"
                  value={workerWage}
                  onChange={(e) => setWorkerWage(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">District</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ludhiana"
                  value={workerDistrict}
                  onChange={(e) => setWorkerDistrict(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">State</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Punjab"
                  value={workerState}
                  onChange={(e) => setWorkerState(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Mobile Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 9876543210"
                  value={workerMobile}
                  onChange={(e) => setWorkerMobile(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Profile Photo URL</label>
                <input
                  type="text"
                  placeholder="e.g. https://images.unsplash.com/photo-..."
                  value={workerPic}
                  onChange={(e) => setWorkerPic(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg transition"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-6 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition"
          >
            Create Account & Dashboard
          </button>
        </div>
      </form>
    </div>
  );
};
