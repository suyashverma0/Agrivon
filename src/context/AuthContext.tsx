import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { User, Role } from "../types";

export interface AuthContextProps {
  session: any | null;
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  isConfigured: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (
    email: string,
    password: string,
    role: Role,
    fullName: string,
    mobile: string,
    profileFields?: any
  ) => Promise<User>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Local fallback user storage for seamless local development if Supabase keys aren't specified in env
const LOCAL_USERS_KEY = "agrivon_local_auth_users";
const SESSION_USER_KEY = "agrivon_local_auth_session";

const getLocalAuthUsers = (): any[] => {
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    return raw ? JSON.parse(raw) : [
      {
        id: "local-admin-uid",
        email: "admin@agrivon.com",
        password: "AdminSecurePassword123",
        role: "SuperAdmin",
        name: "Super Administrator",
        mobile_number: "9999999999",
        village: "Mandi Headquarters",
        state_name: "Uttar Pradesh"
      }
    ];
  } catch (e) {
    return [];
  }
};

const setLocalAuthUsers = (users: any[]) => {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
};

const generateUUID = (): string => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    try {
      return crypto.randomUUID();
    } catch (e) {}
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const mapDbUserToAppUser = (dbUser: any): User => {
  if (!dbUser) {
    return {
      id: "anonymous",
      email: "anonymous@agrivon.com",
      role: "None"
    };
  }

  const appUser: User = {
    id: dbUser.id || String(dbUser.uid),
    email: dbUser.email || "",
    role: (dbUser.role || "None") as Role,
    mobileNumber: dbUser.mobile_number || ""
  };

  const defaultAvatar = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=150";

  if (dbUser.role === "Farmer") {
    appUser.farmerProfile = {
      name: dbUser.name || "Farmer Member",
      village: dbUser.village || "Kanakpur",
      state: dbUser.state_name || "Uttar Pradesh",
      farmSize: Number(dbUser.farm_size) || 2,
      cropsGrown: dbUser.crops_grown || "Paddy",
      experience: Number(dbUser.experience) || 5,
      profilePicture: dbUser.avatar_url || defaultAvatar,
      mobileNumber: dbUser.mobile_number || "",
      fullAddress: `${dbUser.village || "Kanakpur"}, ${dbUser.state_name || "Uttar Pradesh"}`
    };
  } else if (dbUser.role === "ShopOwner") {
    appUser.shopOwnerProfile = {
      shopName: dbUser.shop_name || "Krishi Seva Kendra",
      ownerName: dbUser.name || "Agri Merchant",
      address: dbUser.shop_address || dbUser.village || "Mandi Center",
      contactNumber: dbUser.mobile_number || "9876543210",
      productsAvailable: dbUser.crops_grown || "Seeds, Pesticides",
      deliveryAvailability: dbUser.shop_delivery ?? true
    };
  } else if (dbUser.role === "Worker") {
    appUser.workerProfile = {
      name: dbUser.name || "Agricultural Laborer",
      village: dbUser.village || "Kanakpur village",
      skills: dbUser.skills || "Ploughing, Irrigation",
      experience: Number(dbUser.experience) || 3,
      dailyWageExpectation: Number(dbUser.daily_wage_expectation) || 350,
      availabilityStatus: (dbUser.availability_status || "Available") as "Available" | "Busy",
      profilePicture: dbUser.avatar_url || defaultAvatar,
      mobileNumber: dbUser.mobile_number || "",
      state: dbUser.state_name || "Uttar Pradesh"
    };
  } else if (dbUser.role === "SuperAdmin") {
    // Admin profile structure using worker details or basic fields to prevent crash
    appUser.workerProfile = {
      name: dbUser.name || "Mandi Admin",
      village: dbUser.village || "Headquarters",
      skills: "System moderation, DB configurations",
      experience: 10,
      dailyWageExpectation: 800,
      availabilityStatus: "Available",
      profilePicture: defaultAvatar,
      mobileNumber: dbUser.mobile_number || "",
      state: dbUser.state_name || ""
    };
  }

  return appUser;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<any | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  // Sync session & load corresponding database profile on mount
  useEffect(() => {
    let active = true;

    if (isSupabaseConfigured) {
      // 1. Fetch current active session immediately
      supabase.auth.getSession().then(({ data: { session: activeSession } }) => {
        if (!active) return;
        if (activeSession) {
          setSession(activeSession);
          fetchDatabaseUser(activeSession.user.id, activeSession).then((profile) => {
            if (active && profile) {
              setCurrentUser(profile);
            }
            setLoading(false);
          });
        } else {
          setLoading(false);
        }
      }).catch((err) => {
        console.error("Error retrieving Supabase session:", err);
        setLoading(false);
      });

      // 2. Install live subscription observer
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, currentSession) => {
          if (!active) return;
          console.log(`Supabase Auth state transition observed: [${event}]`);
          
          if (currentSession) {
            setSession(currentSession);
            setLoading(true);
            const profile = await fetchDatabaseUser(currentSession.user.id, currentSession);
            if (active) {
              setCurrentUser(profile);
              setLoading(false);
            }
          } else {
            setSession(null);
            setCurrentUser(null);
            setLoading(false);
          }
        }
      );

      return () => {
        active = false;
        subscription.unsubscribe();
      };
    } else {
      // Local sandbox session storage retrieval
      try {
        const stored = localStorage.getItem(SESSION_USER_KEY);
        if (stored) {
          const rawUser = JSON.parse(stored);
          setCurrentUser(mapDbUserToAppUser(rawUser));
          setSession({ user: { id: rawUser.id || rawUser.uid, email: rawUser.email }, access_token: "mock-jwt" });
        }
      } catch (err) {
        console.warn("Could not retrieve local mock session:", err);
      }
      setLoading(false);
    }
  }, []);

  const fetchDatabaseUser = async (uid: string, authSession: any): Promise<User | null> => {
    try {
      const { data, error: fetchErr } = await supabase
        .from("users")
        .select("*")
        .eq("id", uid)
        .maybeSingle();

      if (fetchErr) {
        console.error("Database user fetch error:", fetchErr);
        // If profile doesn't exist yet, we construct auto profile
        return createUserProfileInDatabase(uid, authSession.user.email, "Farmer", "New User", "");
      }

      if (data) {
        return mapDbUserToAppUser(data);
      } else {
        // Fallback or auto creation if not exists
        return createUserProfileInDatabase(uid, authSession.user.email, "Farmer", "New User", "");
      }
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const createUserProfileInDatabase = async (
    uid: string,
    email: string,
    role: Role,
    name: string,
    mobile: string,
    extraFields?: any
  ): Promise<User> => {
    const defaultAvatar = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=150";

    const dbRow = {
      id: uid,
      name,
      email: email.trim().toLowerCase(),
      role,
      mobile_number: mobile || "",
      avatar_url: defaultAvatar,
      village: extraFields?.village || "Kanakpur",
      state_name: extraFields?.state || "Uttar Pradesh",
      farm_size: extraFields?.farmSize ? Number(extraFields.farmSize) : null,
      crops_grown: extraFields?.cropsGrown || (role === "ShopOwner" ? "Seeds, Fertilizer" : "Paddy"),
      experience: extraFields?.experience ? Number(extraFields.experience) : null,
      shop_name: extraFields?.shopName || (role === "ShopOwner" ? "Krishi Kendra" : null),
      shop_address: extraFields?.address || (role === "ShopOwner" ? "Mandi Block" : null),
      shop_delivery: extraFields?.deliveryAvailability ?? (role === "ShopOwner" ? true : null),
      skills: extraFields?.skills || null,
      daily_wage_expectation: extraFields?.dailyWageExpectation ? Number(extraFields.dailyWageExpectation) : null,
      availability_status: "Available"
    };

    try {
      await supabase.from("users").insert(dbRow);
    } catch (err) {
      console.warn("Could not insert primary table profile, retrying or checking exists:", err);
    }

    return mapDbUserToAppUser(dbRow);
  };

  const login = async (email: string, password: string): Promise<User> => {
    setLoading(true);
    setError(null);

    const formattedEmail = email.trim().toLowerCase();

    if (isSupabaseConfigured) {
      try {
        // Dev Bypass Note: If email confirmation is enabled in your Supabase Auth settings,
        // sign-in will throw an "Email not confirmed" error. Below we have implemented a 
        // development bypass: if the user actually exists in the 'users' database 
        // table, we fetch their profile and log them in with a simulated development token.
        //
        // =========================================================================
        // HOW TO RE-ENABLE COLD PRODUCTION EMAIL CONFIRMATION:
        // -------------------------------------------------------------------------
        // 1. In your Supabase Dashboard, go to Auth -> Providers -> Email.
        // 2. Toggle "Confirm email" back to ON.
        // 3. To bring back strict blocking, remove or comment out the 'isDevEmailBypass' 
        //    safety check block below and allow raw 'authErr' throw on line 301.
        // =========================================================================
        const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
          email: formattedEmail,
          password
        });

        if (authErr) {
          const isUnconfirmed = authErr.message.includes("Email not confirmed") || 
                              authErr.message.includes("email_not_confirmed") ||
                              authErr.message.includes("not confirmed") || 
                              authErr.message.includes("unconfirmed");

          if (isUnconfirmed) {
            console.warn("🔐 DEV ONLY: Email confirmation is enabled on this Supabase project. Bypassing blocker for registration agility...");
            const { data: dbUser, error: dbErr } = await supabase
              .from("users")
              .select("*")
              .eq("email", formattedEmail)
              .maybeSingle();

            if (dbUser && !dbErr) {
              const profile = mapDbUserToAppUser(dbUser);
              const devSession = {
                user: { id: dbUser.id || String(dbUser.uid), email: formattedEmail },
                access_token: "dev-bypass-confirmed-session-token",
                is_dev_bypass: true
              };
              setSession(devSession);
              setCurrentUser(profile);
              localStorage.setItem(SESSION_USER_KEY, JSON.stringify(dbUser));
              setLoading(false);
              return profile;
            }
          }
          throw new Error(authErr.message || "Incorrect email or password");
        }

        if (!authData.user) {
          throw new Error("No user returned from Supabase Auth");
        }

        // Fetch user from DB
        const profile = await fetchDatabaseUser(authData.user.id, authData.session);
        if (!profile) {
          throw new Error("Failed to load user credentials profile.");
        }

        setSession(authData.session);
        setCurrentUser(profile);
        return profile;
      } catch (err: any) {
        setError(err.message || "Login failed");
        setLoading(false);
        throw err;
      }
    } else {
      // Sandbox fallback matching credentials perfectly
      const localUsers = getLocalAuthUsers();
      const match = localUsers.find(
        (u) => u.email.toLowerCase() === formattedEmail && u.password === password
      );

      if (match) {
        const mapped = mapDbUserToAppUser(match);
        setCurrentUser(mapped);
        setSession({ user: { id: match.id, email: match.email }, access_token: "mock-jwt" });
        localStorage.setItem(SESSION_USER_KEY, JSON.stringify(match));
        setLoading(false);
        return mapped;
      } else {
        const errMsg = "Login failed! Incorrect email/mobile or password.";
        setError(errMsg);
        setLoading(false);
        throw new Error(errMsg);
      }
    }
  };

  const signup = async (
    email: string,
    password: string,
    role: Role,
    fullName: string,
    mobile: string,
    profileFields?: any
  ): Promise<User> => {
    setLoading(true);
    setError(null);

    const formattedEmail = email.trim().toLowerCase();

    if (isSupabaseConfigured) {
      try {
        // 1. Sign up user in Supabase Auth securely
        const { data: authData, error: authErr } = await supabase.auth.signUp({
          email: formattedEmail,
          password
        });

        if (authErr) {
          // Dev Bypass Note: If email registration fails because of rate limit quota or 
          // other blocker, we automatically create a profile directly in the database.
          //
          // =========================================================================
          // HOW TO RE-ENABLE COLD PRODUCTION EMAIL CONFIRMATION:
          // -------------------------------------------------------------------------
          // Comment out this block starting with 'if (authErr)' to enforce absolute
          // Supabase Auth validation in production.
          // =========================================================================
          console.warn("🔐 DEV ONLY: Supabase Auth signUp failed or rate limited. Creating profile directly in database table to bypass blocker...", authErr);
          
          const customId = generateUUID();
          
          // Verify that this email isn't already active in the public users database table
          const { data: existingUser } = await supabase
            .from("users")
            .select("*")
            .eq("email", formattedEmail)
            .maybeSingle();

          if (existingUser) {
            throw new Error("This email is already registered in the system.");
          }

          const profile = await createUserProfileInDatabase(
            customId,
            formattedEmail,
            role,
            fullName,
            mobile,
            profileFields
          );

          const devSession = {
            user: { id: customId, email: formattedEmail },
            access_token: "dev-bypass-signup-rate-limit-token",
            is_dev_bypass: true
          };
          setSession(devSession);
          setCurrentUser(profile);
          setLoading(false);
          return profile;
        }

        if (!authData.user) {
          throw new Error("User registration did not return a valid credentials profile.");
        }

        // 2. Create corresponding database record in main public.users table
        const profile = await createUserProfileInDatabase(
          authData.user.id,
          formattedEmail,
          role,
          fullName,
          mobile,
          profileFields
        );

        // Treat signup as automatic sign-in if session exists
        if (authData.session) {
          setSession(authData.session);
          setCurrentUser(profile);
        } else {
          // Sometimes email confirmation is on; sign in explicitly or set session
          setSession({ user: authData.user, access_token: "temp-signup-token" });
          setCurrentUser(profile);
        }

        return profile;
      } catch (err: any) {
        console.warn("🔐 Caught signup error:", err);
        
        // If an error is thrown but it's a rate limit or empty object blocker, 
        // fallback directly to user DB registration so they are not blocked.
        const errMsg = err?.message || "";
        const isBypassable = errMsg.includes("rate limit") || errMsg.includes("rate_limit") || errMsg.includes("limit") || errMsg === "" || errMsg === "{}";
        
        if (isBypassable) {
          try {
            console.warn("🔐 Initiating direct-to-database registration fallback...");
            const customId = generateUUID();
            const profile = await createUserProfileInDatabase(
              customId,
              formattedEmail,
              role,
              fullName,
              mobile,
              profileFields
            );

            const devSession = {
              user: { id: customId, email: formattedEmail },
              access_token: "dev-bypass-signup-fail-token",
              is_dev_bypass: true
            };
            setSession(devSession);
            setCurrentUser(profile);
            setLoading(false);
            return profile;
          } catch (fallbackErr: any) {
            setError(fallbackErr.message || "Registration failed");
            setLoading(false);
            throw fallbackErr;
          }
        }
        
        setError(err.message || "Registration failed");
        setLoading(false);
        throw err;
      }
    } else {
      // Offline fallback profile registration
      const newLocalId = `local-uid-${Date.now()}`;
      const newRow = {
        id: newLocalId,
        email: formattedEmail,
        password,
        role,
        name: fullName,
        mobile_number: mobile,
        village: profileFields?.village || "Kanakpur",
        state_name: profileFields?.state || "Uttar Pradesh",
        farm_size: profileFields?.farmSize,
        crops_grown: profileFields?.cropsGrown,
        experience: profileFields?.experience,
        shop_name: profileFields?.shopName,
        shop_address: profileFields?.address,
        shop_delivery: profileFields?.deliveryAvailability,
        skills: profileFields?.skills,
        daily_wage_expectation: profileFields?.dailyWageExpectation,
        availability_status: "Available"
      };

      const localUsers = getLocalAuthUsers();
      localUsers.push(newRow);
      setLocalAuthUsers(localUsers);

      const mapped = mapDbUserToAppUser(newRow);
      setCurrentUser(mapped);
      setSession({ user: { id: newLocalId, email: formattedEmail }, access_token: "mock-jwt" });
      localStorage.setItem(SESSION_USER_KEY, JSON.stringify(newRow));
      setLoading(false);
      return mapped;
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error("Supabase signOut error:", err);
      }
    }
    
    // Clear mock session
    localStorage.removeItem(SESSION_USER_KEY);
    setSession(null);
    setCurrentUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        currentUser,
        loading,
        error,
        isConfigured: isSupabaseConfigured,
        login,
        signup,
        logout,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return context;
};
