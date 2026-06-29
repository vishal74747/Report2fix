import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MapPin, User, Home, ClipboardList, Award, ArrowLeft, 
  Check, CheckCircle2, TrendingUp, Activity, Camera, Bell, 
  Share2, Settings, HelpCircle, LogOut, ChevronRight, Menu, 
  Clock, Sparkles, AlertTriangle, Trash2, Lightbulb, RefreshCw, Info, ThumbsUp, ChevronDown, ChevronUp, Plus, Search, Map, Phone, PhoneCall, MessageSquare, AlertCircle
} from "lucide-react";

// ==============================================================
// LOGO (embedded base64 SVG)
// ==============================================================
const LOGO_IMG = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMUI0MzMyIi8+PHN0b3Agb2Zmc2V0PSI1MCUiIHN0b3AtY29sb3I9IiM1MkI3ODgiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMyNTYzRUIiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgcng9IjQwIiBmaWxsPSJ1cmwoI2cpIi8+PHBhdGggZD0iTTEwMCAzNSBDNzAgMzUsIDU1IDYwLCA1NSA4NSBDNTUgMTE1LCAxMDAgMTY1LCAxMDAgMTY1IEMxMDAgMTY1LCAxNDUgMTE1LCAxNDUgODUgQzE0NSA2MCwgMTMwIDM1LCAxMDAgMzUgWiIgZmlsbD0iI0ZGRkZGRiIgb3BhY2l0eT0iMC45Ii8+PGNpcmNsZSBjeD0iMTAwIiBjeT0iODUiIHI9IjI1IiBmaWxsPSIjMUI0MzMyIi8+PHBhdGggZD0iTTkwIDg1IEw5NyA5MiBMMTEyIDc2IiBzdHJva2U9IiM1MkI3ODgiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBmaWxsPSJub25lIi8+PC9zdmc+";

// ==============================================================
// TYPES
// ==============================================================
type Screen = "splash" | "onboarding" | "login" | "register" | "home" | "report" | "map" | "profile" | "myreports" | "news" | "faq" | "leaderboard" | "contacts";

interface LocationState {
  lat: number;
  lng: number;
  address: string;
  loading: boolean;
  error: string;
}

interface Report {
  id: string;
  type: "Pothole" | "Garbage";
  lat: number;
  lng: number;
  address: string;
  status: "Reported" | "In Progress" | "Resolved";
  date: string;
  confidence?: number;
  description?: string;
  image?: string;
}

interface UserState {
  username: string;
  email: string;
  xp: number;
  reports: number;
  badges: string[];
  rank: number;
}

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface NewsItem {
  id: string;
  tag: string;
  tagBg: string;
  tagText: string;
  title: string;
  summary: string;
  date: string;
  image: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

// ==============================================================
// STATIC DATA SEEDS
// ==============================================================
const SEED_REPORTS: Report[] = [
  {
    id: "REP-101",
    type: "Pothole",
    lat: 17.4859,
    lng: 78.3995,
    address: "KPHB Phase 1, Near Metro Station, Kukatpally, Hyderabad, 500072",
    status: "In Progress",
    date: "2026-06-28",
    confidence: 94,
    description: "Huge crater-like pothole on the left lane of the main road. Causing traffic buildup and unsafe swerving by motorbikes.",
  },
  {
    id: "REP-102",
    type: "Garbage",
    lat: 17.4812,
    lng: 78.4021,
    address: "JNTU Junction, Behind Bus Stop, Kukatpally, Hyderabad, 500085",
    status: "Reported",
    date: "2026-06-29",
    confidence: 88,
    description: "Overflowing plastic garbage bin and pile of waste bags left open on the pavement. Emitting strong foul odor and attracting flies.",
  },
  {
    id: "REP-103",
    type: "Pothole",
    lat: 17.4910,
    lng: 78.3912,
    address: "Pragathi Nagar Rd, Opposite Kakatiya Hills, Hyderabad, 500090",
    status: "Resolved",
    date: "2026-06-25",
    confidence: 96,
    description: "Deep trench crossing pothole that was previously reported has now been filled and leveled by GHMC road repairs team. Excellent job!",
  }
];

const NEWS_DATA: NewsItem[] = [
  {
    id: "news-1",
    tag: "Road Repair",
    tagBg: "#E0F2FE",
    tagText: "#0369A1",
    title: "GHMC Launches Rapid Pothole Repair Drive in Kukatpally",
    summary: "The Greater Hyderabad Municipal Corporation (GHMC) has deployed 'Pothole Squads' using advanced cold-mix polymer asphalt to patch critical roads near JNTU and KPHB Phase 1 within 12 hours of reporting.",
    date: "June 29, 2026",
    image: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "news-2",
    tag: "Waste Mgmt",
    tagBg: "#D1FAE5",
    tagText: "#065F46",
    title: "GHMC Swachh Auto Tipper Cleanup Drive in Pragathi Nagar",
    summary: "As part of the Swachh Bharat Hyderabad initiative, GHMC has intensified daily garbage collection drives with household waste segregation enforcement and modern waste handling across Kukatpally sectors.",
    date: "June 28, 2026",
    image: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "news-3",
    tag: "Road Repair",
    tagBg: "#FEE2E2",
    tagText: "#991B1B",
    title: "Major Arterial Road Leveling Finished at Kukatpally Y-Junction",
    summary: "GHMC engineering teams completed overnight road-fixing and laying of high-durability bituminous layers on the heavily congested Y-Junction stretches, ensuring smooth flow for morning commuters.",
    date: "June 26, 2026",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "news-4",
    tag: "Campaign",
    tagBg: "#FEF3C7",
    tagText: "#92400E",
    title: "Citizen Swachh Bharat Cleanup Campaign Gains Massive Support",
    summary: "Over 2,000 residents teamed up with GHMC sanitation officers in a major public cleanliness campaign to clear open dumping spots and beautify walls near JNTU metro station.",
    date: "June 24, 2026",
    image: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=800"
  }
];

const FAQ_DATA: FAQItem[] = [
  {
    question: "How does AI detection work?",
    answer: "Our AI computer vision model is trained to analyze images of road surfaces and public spaces. When you upload a picture, it automatically detects features indicating Potholes or Garbage, outlining them with bounding boxes and calculating a confidence score."
  },
  {
    question: "Can I change my location manually?",
    answer: "Yes, absolutely! In the reporting screen (Sub-step 1 & 3), you can tap the 'Edit Address' toggle and type any manual address. This is helpful if you are reporting an issue you saw earlier, or if GPS reception is temporarily weak."
  },
  {
    question: "Why is Continue with Google not working?",
    answer: "The Google OAuth workflow requires custom server domain registration and SSL configurations. For the sake of this hackathon, please use the 'Quick Demo Login' button, which is fully functional and unlocks the complete app experience instantly!"
  },
  {
    question: "What happens after I report?",
    answer: "Once submitted, the report is securely registered in our system and displayed on the interactive municipal map. It receives a 'Reported' status. Local municipal bodies (like GHMC) are notified to review, assign, and update the status as they resolve it."
  },
  {
    question: "Who fixes the reported issues?",
    answer: "The reports are routed directly to the respective ward officers of local municipal corporations (such as the GHMC). They deploy field squads to patch potholes or collect waste."
  },
  {
    question: "How are my XP points calculated?",
    answer: "You earn 50 XP immediately for each new issue reported with photos and geocoded location. In the future, you will earn an additional 10 XP once another citizen verifies your report in person."
  },
  {
    question: "Is my private data secure?",
    answer: "Yes, your privacy is our highest priority. Your location coordinates are only used to pin civic issues on the map. Your profile email and passwords are never shared with third parties."
  }
];

// Helper to reverse geocode using Nominatim
async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: { "Accept-Language": "en", "User-Agent": "Report2FixApp/1.0" } }
    );
    if (!res.ok) throw new Error("Reverse geocoding request failed");
    const data = await res.json();
    return data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  } catch (err) {
    console.error("Nominatim reverse geocode failed:", err);
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  }
}

export default function App() {
  // Screen and user navigation
  const [screen, setScreen] = useState<Screen>("splash");
  const [user, setUser] = useState<UserState | null>(null);

  // GPS coordinates
  const [location, setLocation] = useState<LocationState>({
    lat: 17.4849,
    lng: 78.3990,
    address: "Loading GPS position...",
    loading: true,
    error: ""
  });

  // Global list of reports
  const [reports, setReports] = useState<Report[]>(SEED_REPORTS);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Form states for login / signup
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  // Reporting Flow Substates
  const [reportStep, setReportStep] = useState<1 | 2 | 3>(1);
  const [selectedType, setSelectedType] = useState<"Pothole" | "Garbage">("Pothole");
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiConfidence, setAiConfidence] = useState<number>(0);
  const [aiDetectedType, setAiDetectedType] = useState<"Pothole" | "Garbage">("Pothole");
  const [manualAddress, setManualAddress] = useState("");
  const [isAddressEditable, setIsAddressEditable] = useState(false);
  const [description, setDescription] = useState("");

  // Map & FAQ refs & states
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [faqOpen, setFaqOpen] = useState<{ [key: number]: boolean }>({});

  const toggleFaq = (index: number) => {
    setFaqOpen(prev => ({ ...prev, [index]: !prev[index] }));
  };

  // Chatbot states
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      sender: "bot",
      text: "Namaste! I am your Report2Fix AI Assistant. I can help you with reporting guidelines, status checks, municipal contact numbers, and badge details. How can I assist you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const handleSendChat = (textToSend?: string) => {
    const text = (textToSend || chatInput).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    if (!textToSend) {
      setChatInput("");
    }

    // Trigger bot reply with a slight delay
    setTimeout(() => {
      let botText = "";
      const lower = text.toLowerCase();

      if (lower.includes("how to report") || lower.includes("how do i report") || lower.includes("guidelines") || lower.includes("step")) {
        botText = "To report a civic issue like a pothole or garbage pile:\n\n1. Tap the central 📷 **Camera** button in the bottom navigation bar.\n2. Select your category (Pothole or Garbage).\n3. Take a photo or upload an image. Real-time GPS coordinates are automatically tagged!\n4. Click **Run AI Detection** to analyze the photo contour.\n5. Audit the address details, add comments, and click **Submit Report**!\n\nYou'll instantly earn **+50 XP**!";
      } else if (lower.includes("status") || lower.includes("progress") || lower.includes("track")) {
        botText = "All reports are tracked in real-time under three status phases:\n\n• 🔵 **Reported**: Received by our platform and pinned on the live map.\n• 🟡 **In Progress**: Ward sanitation or engineering officers are addressing it.\n• 🟢 **Resolved**: The pothole is patched or garbage cleared!\n\nYou can track your own submitted reports directly under the 📋 **My Reports** tab.";
      } else if (lower.includes("contact") || lower.includes("ghmc") || lower.includes("phone") || lower.includes("helpline") || lower.includes("call") || lower.includes("municipal")) {
        botText = "You can view and call real municipal offices directly from the new 📞 **Contacts** tab in the navigation bar! Key numbers:\n\n• **GHMC Helpline**: 040-21111111\n• **Roads & Potholes**: 040-23220160\n• **Water Board (HMWSSB)**: 155313\n• **Police Control**: 100\n\nTap the **Contacts** screen to call them instantly with one tap.";
      } else if (lower.includes("xp") || lower.includes("badge") || lower.includes("points") || lower.includes("level") || lower.includes("rank") || lower.includes("medal")) {
        botText = "Every valid report awards you **50 XP** to level up! You can unlock 4 tiers of custom badges:\n\n• 🥇 **First Reporter** (1st report)\n• ⭐ **Top Contributor** (Reaching 200 XP)\n• 🦸 **Community Hero** (5 reports filed)\n• 🌍 **Impact Maker** (10 reports filed)\n\nKeep reporting to climb the active Kukatpally Leaderboard!";
      } else if (lower.includes("issue") || lower.includes("what can i report") || lower.includes("category") || lower.includes("pothole") || lower.includes("garbage")) {
        botText = "Currently, Report2Fix supports AI-assisted reporting for:\n\n• ⚠️ **Potholes**: Surface craters, cracks, asphalt breaches, and road wear.\n• 🗑️ **Garbage**: Open waste accumulation, overflowing public bins, and littering.\n\nMore features like broken streetlights and water leaks are currently in development!";
      } else if (lower.includes("hyderabad") || lower.includes("kukatpally") || lower.includes("place") || lower.includes("area") || lower.includes("city")) {
        botText = "Report2Fix is specialized for the Kukatpally area and Greater Hyderabad municipal limits. When you submit an issue, its exact coordinates are flagged directly to ward-specific GHMC field teams, skipping general bureaucracy!";
      } else if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey") || lower.includes("namaste") || lower.includes("good morning") || lower.includes("good afternoon")) {
        botText = "Namaste! I'm your Report2Fix AI assistant. I can answer questions about how to report issues, status meanings, emergency contact numbers, and how to earn XP! How can I help you today?";
      } else {
        botText = "I see! To help you best, you can ask about:\n\n• *How to report an issue*\n• *Status of your reports*\n• *Real GHMC contact helplines*\n• *XP & Badge awards*\n\nOr click one of the quick reply bubbles below for an instant breakdown!";
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: botText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages(prev => [...prev, botMsg]);
    }, 600);
  };

  // Show Toast Toast Helper
  const showToast = useCallback((message: string, type: "success" | "error" | "info" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  // 1. WATCH POSITION & REVERSE GEOCODE (NEVER HARDCODE)
  useEffect(() => {
    let watchId: number;
    if ("geolocation" in navigator) {
      watchId = navigator.geolocation.watchPosition(
        async (pos) => {
          const { latitude: lat, longitude: lng } = pos.coords;
          const address = await reverseGeocode(lat, lng);
          setLocation({ lat, lng, address, loading: false, error: "" });
        },
        (err) => {
          console.error("Geolocation watch error:", err);
          setLocation(prev => ({ 
            ...prev, 
            loading: false, 
            error: err.message, 
            address: "KPHB Phase 1, Kukatpally, Hyderabad, 500072 (Fallback)" 
          }));
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 }
      );
    } else {
      setLocation(prev => ({ 
        ...prev, 
        loading: false, 
        error: "Geolocation not supported",
        address: "KPHB Phase 1, Kukatpally, Hyderabad, 500072 (Fallback)" 
      }));
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  // Fetch initial report list from server if reachable to show up-to-date reports
  useEffect(() => {
    const syncReports = async () => {
      try {
        const res = await fetch("https://report2fix-backend-production.up.railway.app/reports");
        if (res.ok) {
          const data = await res.json();
          const serverReports: Report[] = data.map((item: any) => ({
            id: item.id || `REP-${Math.random().toString(36).substr(2, 5)}`,
            type: (item.type?.toLowerCase() === "pothole" || item.issue_type?.toLowerCase() === "pothole") ? "Pothole" : "Garbage",
            lat: Number(item.lat) || 17.4849,
            lng: Number(item.lng) || 78.3990,
            address: item.address || "Hyderabad, India",
            status: item.status || "Reported",
            date: item.date ? item.date.substring(0, 10) : new Date().toISOString().substring(0, 10),
            confidence: item.confidence ? Math.round(item.confidence * 100) : 90,
            description: item.description || "",
          }));

          // Merge server reports with local seeds, unique by ID
          setReports(prev => {
            const combined = [...prev, ...serverReports];
            const uniqueMap = new Map();
            combined.forEach(rep => uniqueMap.set(rep.id, rep));
            return Array.from(uniqueMap.values());
          });
        }
      } catch (err) {
        console.warn("Backend server reports fetch failed, using default seed reports:", err);
      }
    };
    syncReports();
  }, []);

  // Splash screen timeout
  useEffect(() => {
    if (screen === "splash") {
      const timer = setTimeout(() => {
        setScreen("onboarding");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  // Sync report manual address to live position address when it is loaded
  useEffect(() => {
    if (!isAddressEditable && location.address && !location.loading) {
      setManualAddress(location.address);
    }
  }, [location.address, location.loading, isAddressEditable]);

  // Leaflet map initializer
  const initMap = useCallback(() => {
    const L = (window as any).L;
    if (!L || !mapDivRef.current) return;

    if (leafletMapRef.current) {
      leafletMapRef.current.remove();
    }

    const centerLat = location.lat || 17.4849;
    const centerLng = location.lng || 78.3990;

    const map = L.map(mapDivRef.current, {
      zoomControl: false,
    }).setView([centerLat, centerLng], 14);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Blue user pin
    const userIcon = L.divIcon({
      html: `
        <div style="position: relative; width: 18px; height: 18px; background-color: #2563EB; border: 3.2px solid white; border-radius: 50%; box-shadow: 0 0 10px rgba(37,99,235,0.8); display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 34px; height: 34px; background-color: #2563EB; border-radius: 50%; opacity: 0.35; animation: pulse 2s infinite;"></div>
        </div>
      `,
      className: "custom-user-icon",
      iconSize: [18, 18],
      iconAnchor: [9, 9]
    });
    L.marker([centerLat, centerLng], { icon: userIcon }).addTo(map)
      .bindPopup("<strong style='color:#2563EB; font-family:sans-serif;'>My Live Location</strong>");

    // Report pins
    reports.forEach((rep) => {
      const isPothole = rep.type === "Pothole";
      const pillColor = isPothole ? "#D97706" : "#059669";
      const emoji = isPothole ? "⚠️" : "🗑️";

      const markerIcon = L.divIcon({
        html: `
          <div style="
            background-color: ${pillColor}; 
            color: white; 
            padding: 4px 10px; 
            border-radius: 99px; 
            font-weight: bold; 
            font-size: 11px; 
            border: 2px solid white; 
            box-shadow: 0 3px 6px rgba(0,0,0,0.25); 
            display: flex; 
            align-items: center; 
            justify-content: center;
            white-space: nowrap;
            gap: 4px;
          ">
            <span>${emoji}</span>
            <span>${rep.type}</span>
          </div>
        `,
        className: `custom-rep-${rep.id}`,
        iconSize: [95, 26],
        iconAnchor: [47, 13]
      });

      const popupContent = `
        <div style="font-family: system-ui, -apple-system, sans-serif; min-width: 170px; padding: 2px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
            <span style="font-weight: bold; font-size: 13px; color: ${pillColor};">${emoji} ${rep.type}</span>
            <span style="font-size: 9px; font-weight: bold; background-color: #F3F4F6; color: #1F2937; padding: 1px 6px; border-radius: 99px;">${rep.status}</span>
          </div>
          <p style="margin: 0 0 6px 0; font-size: 11px; color: #374151; font-weight: 500; line-height: 1.35;">${rep.address}</p>
          <div style="font-size: 9px; color: #6B7280; border-t: 1px solid #E5E7EB; padding-top: 4px; display: flex; justify-content: space-between;">
            <span>ID: ${rep.id}</span>
            <span>${rep.date}</span>
          </div>
        </div>
      `;

      L.marker([rep.lat, rep.lng], { icon: markerIcon })
        .addTo(map)
        .bindPopup(popupContent);
    });

    setTimeout(() => {
      map.invalidateSize();
    }, 350);

    leafletMapRef.current = map;
  }, [location.lat, location.lng, reports]);

  // Map Screen effect loader
  useEffect(() => {
    if (screen !== "map") return;
    if (!(window as any).L) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }
  }, [screen, initMap]);

  // Canvas details rendering for Sub-step 3 of camera report
  useEffect(() => {
    if (screen === "report" && reportStep === 3 && canvasRef.current && capturedImage) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = new Image();
      img.onload = () => {
        canvas.width = 400;
        canvas.height = 300;
        ctx.drawImage(img, 0, 0, 400, 300);

        // Calculate bounding box center 40% x 35% of canvas area
        const boxW = 400 * 0.40;
        const boxH = 300 * 0.35;
        const boxX = (400 - boxW) / 2;
        const boxY = (300 - boxH) / 2;

        const themeColor = aiDetectedType === "Pothole" ? "#D97706" : "#059669";

        // Draw Rect
        ctx.strokeStyle = themeColor;
        ctx.lineWidth = 4;
        ctx.strokeRect(boxX, boxY, boxW, boxH);

        // Fill Label Bg
        ctx.fillStyle = themeColor;
        ctx.fillRect(boxX, boxY - 26, boxW, 26);

        // Draw Text inside label
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 11px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`${aiDetectedType.toUpperCase()} ${aiConfidence}%`, boxX + (boxW / 2), boxY - 9);
      };
      img.src = capturedImage;
    }
  }, [screen, reportStep, capturedImage, aiDetectedType, aiConfidence]);

  // Authentication Handlers
  const handleQuickDemo = () => {
    const demoUser: UserState = {
      username: "DemoCitizen",
      email: "demo@report2fix.in",
      xp: 150,
      reports: 3,
      badges: ["first_reporter", "top_contributor"],
      rank: 4
    };
    setUser(demoUser);
    setScreen("home");
    showToast("Quick Demo logged in! Welcome back.", "success");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      showToast("Please enter email and password.", "error");
      return;
    }
    const loggedUser: UserState = {
      username: loginEmail.split("@")[0] || "Citizen",
      email: loginEmail,
      xp: 150,
      reports: 3,
      badges: ["first_reporter", "top_contributor"],
      rank: 4
    };
    setUser(loggedUser);
    setScreen("home");
    showToast("Signed in successfully!", "success");
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regUsername || !regEmail || !regPassword) {
      showToast("Please fill all signup fields.", "error");
      return;
    }
    const newUser: UserState = {
      username: regUsername,
      email: regEmail,
      xp: 50,
      reports: 0,
      badges: [],
      rank: 6
    };
    setUser(newUser);
    setScreen("home");
    showToast("Account created successfully! Welcome.", "success");
  };

  const handleLogout = () => {
    setUser(null);
    setScreen("login");
    showToast("Logged out successfully.", "info");
  };

  // Capture file handler
  const triggerCaptureInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCapturedFile(file);
      setCapturedImage(URL.createObjectURL(file));
      setReportStep(2); // Automatically advance to Sub-step 2: Analyze
    }
  };

  // Run AI Detection POST /analyze
  const handleRunAI = async () => {
    if (!capturedFile) {
      showToast("Please select/take an image first.", "error");
      return;
    }
    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append("file", capturedFile);
      formData.append("lat", location.lat.toString());
      formData.append("lng", location.lng.toString());

      const res = await fetch("https://report2fix-backend-production.up.railway.app/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Analysis endpoint returned non-OK status");
      }

      const data = await res.json();

if (!data.detections || data.detections.length === 0) {
  showToast("No pothole or garbage detected.", "error");
  return;
}

// Select the highest confidence detection
const bestDetection = data.detections.reduce(
  (best: any, current: any) =>
    current.confidence > best.confidence ? current : best
);

const formattedType =
  bestDetection.category === "Pothole"
    ? "Pothole"
    : "Garbage";

const confidence = Math.round(bestDetection.confidence * 100);

setAiDetectedType(formattedType);
setSelectedType(formattedType);
setAiConfidence(confidence);
setReportStep(3);

showToast(
  `AI Detection finished: ${formattedType} (${confidence}%)`,
  "success"
); catch (err) {
      console.error("AI analyzing request failed:", err);
      // Offline fallback
      showToast("AI offline — using manual selection", "error");
      setAiDetectedType(selectedType);
      setAiConfidence(85);
      setReportStep(3); // Advance to Sub-step 3: Details
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Submit Report POST /report
  const handleSubmitReport = async () => {
    setIsAnalyzing(true);
    const dateStr = new Date().toISOString().substring(0, 10);
    const reportAddress = manualAddress || location.address || `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}`;
    
    try {
      const formData = new FormData();
      if (capturedFile) {
        formData.append("file", capturedFile);
      }
      formData.append("issue_type", aiDetectedType.toLowerCase());
      formData.append("lat", location.lat.toString());
      formData.append("lng", location.lng.toString());
      formData.append("address", reportAddress);
      formData.append("description", description);
      formData.append("username", user?.username || "Anonymous");

      const res = await fetch("https://report2fix-backend-production.up.railway.app/report", {
        method: "POST",
        body: formData,
      });

      const newId = res.ok ? (await res.json()).id : `REP-L-${Date.now()}`;

      const newReport: Report = {
        id: newId,
        type: aiDetectedType,
        lat: location.lat,
        lng: location.lng,
        address: reportAddress,
        status: "Reported",
        date: dateStr,
        confidence: aiConfidence,
        description: description,
        image: capturedImage || undefined
      };

      // Add to local reports
      setReports(prev => [newReport, ...prev]);

      // Award XP Points (+50 XP)
      if (user) {
        const updatedXP = user.xp + 50;
        const updatedReportsCount = user.reports + 1;
        const newBadges = [...user.badges];

        if (updatedReportsCount >= 1 && !newBadges.includes("first_reporter")) {
          newBadges.push("first_reporter");
          showToast("🏆 Unlocked Medal: First Reporter!", "success");
        }
        if (updatedXP >= 200 && !newBadges.includes("top_contributor")) {
          newBadges.push("top_contributor");
          showToast("🏆 Unlocked Medal: Top Contributor!", "success");
        }
        if (updatedReportsCount >= 5 && !newBadges.includes("community_hero")) {
          newBadges.push("community_hero");
          showToast("🏆 Unlocked Medal: Community Hero!", "success");
        }
        if (updatedReportsCount >= 10 && !newBadges.includes("impact_maker")) {
          newBadges.push("impact_maker");
          showToast("🏆 Unlocked Medal: Impact Maker!", "success");
        }

        setUser({
          ...user,
          xp: updatedXP,
          reports: updatedReportsCount,
          badges: newBadges
        });
      }

      showToast("Report submitted (+50 XP)!", "success");
      
      // Reset Reporting flow states
      setReportStep(1);
      setCapturedFile(null);
      setCapturedImage(null);
      setDescription("");
      
      setScreen("myreports");
    } catch (err) {
      console.error("Submission failed:", err);
      showToast("Report submission failed", "error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Helper stats
  const getLeaderboardData = () => {
    const defaultUsers = [
      { username: "Rohan Sharma", xp: 450, isMe: false, badgeCount: 3 },
      { username: "Priyah Patel", xp: 380, isMe: false, badgeCount: 2 },
      { username: "Amit Verma", xp: 320, isMe: false, badgeCount: 2 },
      { username: user?.username || "DemoCitizen", xp: user?.xp || 150, isMe: true, badgeCount: user?.badges.length || 2 },
      { username: "Vikram Rao", xp: 180, isMe: false, badgeCount: 1 },
      { username: "Sneha Reddy", xp: 120, isMe: false, badgeCount: 0 }
    ];

    const sorted = [...defaultUsers].sort((a, b) => b.xp - a.xp);
    return sorted.map((u, i) => ({
      ...u,
      rank: i + 1,
      medal: i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : ""
    }));
  };

  const getRecentReports = () => {
    return reports.slice(0, 3);
  };

  // Badges status checkers
  const isBadgeUnlocked = (badgeId: string) => {
    return user?.badges.includes(badgeId) || false;
  };

  return (
    <div className="min-h-screen bg-slate-900 py-0 md:py-8 flex justify-center items-center">
      
      {/* Dynamic Toast Container */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 w-full max-w-[360px] pointer-events-none px-4">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className={`p-3.5 rounded-xl shadow-lg border text-sm font-semibold flex items-center gap-3 text-white pointer-events-auto ${
                toast.type === "success" ? "bg-emerald-600 border-emerald-500" :
                toast.type === "error" ? "bg-rose-600 border-rose-500" : "bg-blue-600 border-blue-500"
              }`}
            >
              <span className="text-lg">
                {toast.type === "success" ? "✅" : toast.type === "error" ? "⚠️" : "ℹ️"}
              </span>
              <span className="flex-1 leading-tight">{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Main framed viewport container mimicking premium mobile device width */}
      <div className="relative w-full max-w-[430px] min-h-[100vh] md:min-h-[840px] md:max-h-[900px] bg-[#F9FAFB] md:rounded-[36px] shadow-2xl overflow-hidden flex flex-col border border-neutral-200">
        
        {/* ==============================================================
            SCREEN 1: SPLASH
            ============================================================== */}
        {screen === "splash" && (
          <div 
            style={{ background: "linear-gradient(135deg, #0f2027, #1B4332, #2563EB)" }} 
            className="absolute inset-0 flex flex-col justify-center items-center z-50 text-white p-6"
          >
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              className="mb-6 flex justify-center items-center"
            >
              <img src={LOGO_IMG} width={220} height={220} alt="Report2Fix Logo" className="drop-shadow-xl" />
            </motion.div>
            
            <h1 className="text-3xl font-black tracking-wider mb-2">Report<span className="text-[#52B788]">2</span>Fix</h1>
            <p className="text-sm opacity-85 font-semibold mb-12 text-center max-w-[280px]">Civic Intelligence and AI-powered Infrastructure Restoration</p>
            
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin mb-3"></div>
              <span className="text-xs font-mono uppercase tracking-widest opacity-75">Loading System...</span>
            </div>
          </div>
        )}

        {/* ==============================================================
            SCREEN 2: ONBOARDING
            ============================================================== */}
        {screen === "onboarding" && (
          <div className="absolute inset-0 bg-white flex flex-col justify-between p-6 z-40">
            <div className="flex flex-col items-center pt-8 text-center">
              <img src={LOGO_IMG} width={180} height={180} alt="Report2Fix Logo" className="mb-4 shadow-md rounded-3xl" />
              <h1 className="text-3xl font-extrabold text-neutral-800 tracking-tight mb-2">
                Report <span className="text-[#52B788]">2</span> <span className="text-[#2563EB]">Fix</span>
              </h1>
              <p className="text-sm font-semibold text-[#6B7280] max-w-[280px] leading-relaxed mb-6">
                You Report. We Fix. Together We Improve.
              </p>

              {/* 4 grid features */}
              <div className="grid grid-cols-2 gap-3.5 w-full max-w-[340px] mb-6">
                <div className="flex items-center gap-2.5 p-3.5 bg-neutral-50 rounded-xl border border-neutral-100 shadow-xs">
                  <span className="text-xl">🤖</span>
                  <div className="text-left">
                    <h4 className="font-extrabold text-xs text-neutral-800">AI Detection</h4>
                    <p className="text-[10px] text-neutral-500 leading-tight">Instant computer vision</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3.5 bg-neutral-50 rounded-xl border border-neutral-100 shadow-xs">
                  <span className="text-xl">📍</span>
                  <div className="text-left">
                    <h4 className="font-extrabold text-xs text-neutral-800">Real-time GPS</h4>
                    <p className="text-[10px] text-neutral-500 leading-tight">Accurate location pinning</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3.5 bg-neutral-50 rounded-xl border border-neutral-100 shadow-xs">
                  <span className="text-xl">👥</span>
                  <div className="text-left">
                    <h4 className="font-extrabold text-xs text-neutral-800">Community</h4>
                    <p className="text-[10px] text-neutral-500 leading-tight">Collab with authorities</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3.5 bg-neutral-50 rounded-xl border border-neutral-100 shadow-xs">
                  <span className="text-xl">✅</span>
                  <div className="text-left">
                    <h4 className="font-extrabold text-xs text-neutral-800">Transparent</h4>
                    <p className="text-[10px] text-neutral-500 leading-tight">Verifiable fix tracking</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-3 pb-4">
              <button
                onClick={() => setScreen("register")}
                className="w-full py-3.5 bg-[#1B4332] text-white font-bold rounded-xl shadow-lg hover:bg-[#153527] transition-all flex items-center justify-center gap-2"
              >
                Get Started
              </button>
              <button
                onClick={() => setScreen("login")}
                className="w-full py-3.5 border-2 border-[#1B4332] text-[#1B4332] font-bold rounded-xl hover:bg-neutral-50 transition-all text-center"
              >
                Login / Sign In
              </button>
            </div>
          </div>
        )}

        {/* ==============================================================
            SCREEN 3: LOGIN
            ============================================================== */}
        {screen === "login" && (
          <div className="absolute inset-0 bg-white flex flex-col justify-between p-6 z-40 overflow-y-auto">
            <div className="flex flex-col items-center pt-6">
              <img src={LOGO_IMG} width={90} height={90} alt="Logo" className="mb-4 shadow-sm rounded-2xl" />
              <h2 className="text-2xl font-black text-neutral-800 mb-1">Welcome Citizen!</h2>
              <p className="text-xs text-[#6B7280] font-semibold mb-6">Log in to make report filings and earn points</p>

              <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="Enter email e.g. citizen@gmail.com"
                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1.5">Password</label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#1B4332] text-white font-bold rounded-xl shadow-md hover:bg-[#133225] transition-all text-sm mt-2"
                >
                  Sign In
                </button>
              </form>

              <div className="relative flex py-5 items-center w-full">
                <div className="flex-grow border-t border-neutral-200"></div>
                <span className="flex-shrink mx-4 text-xs font-bold text-neutral-400">OR DEMO ACCESS</span>
                <div className="flex-grow border-t border-neutral-200"></div>
              </div>

              {/* Demo Action Buttons */}
              <div className="w-full flex flex-col gap-3">
                <button
                  onClick={handleQuickDemo}
                  className="w-full py-3 bg-[#52B788] text-white font-extrabold rounded-xl shadow-md hover:bg-[#439c73] transition-all flex items-center justify-center gap-2 text-sm"
                >
                  ⚡ Quick Demo Login
                </button>

                <button
                  onClick={() => showToast("Google OAuth requires domain setup. Use Quick Demo Login for hackathon.", "info")}
                  className="w-full py-3 border border-neutral-300 text-neutral-700 font-bold rounded-xl hover:bg-neutral-50 transition-all flex items-center justify-center gap-2 text-sm bg-white"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5.04c1.65 0 3.13.57 4.3 1.69l3.22-3.22C17.56 1.62 14.98 1 12 1 7.35 1 3.4 3.65 1.5 7.5l3.86 3C6.3 7.57 8.94 5.04 12 5.04z"/>
                    <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.47h6.44c-.28 1.47-1.11 2.71-2.36 3.56l3.65 2.83c2.14-1.97 3.36-4.88 3.36-8.5z"/>
                    <path fill="#FBBC05" d="M5.36 14.5c-.24-.72-.38-1.49-.38-2.3c0-.81.14-1.58.38-2.3L1.5 6.9C.54 8.84 0 11.02 0 13.3c0 2.28.54 4.46 1.5 6.4l3.86-3.2z"/>
                    <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.65-2.83c-1.11.75-2.52 1.19-4.31 1.19-3.06 0-5.7-2.53-6.64-5.46L1.5 16.2C3.4 20.05 7.35 23 12 23z"/>
                  </svg>
                  Continue with Google
                </button>
              </div>
            </div>

            <div className="text-center pt-4">
              <p className="text-xs text-neutral-600">
                Don't have an account?{" "}
                <button onClick={() => setScreen("register")} className="font-bold text-[#2563EB] hover:underline">
                  Register here
                </button>
              </p>
            </div>
          </div>
        )}

        {/* ==============================================================
            SCREEN 4: REGISTER
            ============================================================== */}
        {screen === "register" && (
          <div className="absolute inset-0 bg-white flex flex-col justify-between p-6 z-40 overflow-y-auto">
            <div className="flex flex-col items-center pt-6">
              <img src={LOGO_IMG} width={90} height={90} alt="Logo" className="mb-4 shadow-sm rounded-2xl" />
              <h2 className="text-2xl font-black text-neutral-800 mb-1">Create Account</h2>
              <p className="text-xs text-[#6B7280] font-semibold mb-6">Join your neighborhood improvement project</p>

              <form onSubmit={handleRegister} className="w-full flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1.5">Username</label>
                  <input
                    type="text"
                    required
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="Choose username"
                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1.5">Password</label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Create safe password"
                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#1B4332] text-white font-bold rounded-xl shadow-md hover:bg-[#133225] transition-all text-sm mt-2"
                >
                  Create Account
                </button>
              </form>
            </div>

            <div className="text-center pt-4">
              <p className="text-xs text-neutral-600">
                Already registered?{" "}
                <button onClick={() => setScreen("login")} className="font-bold text-[#2563EB] hover:underline">
                  Log In instead
                </button>
              </p>
            </div>
          </div>
        )}

        {/* ==============================================================
            SCREEN 5: HOME (DASHBOARD)
            ============================================================== */}
        {screen === "home" && (
          <div className="flex flex-col flex-1 pb-20 overflow-y-auto bg-gradient-to-b from-neutral-50 to-neutral-100/50 relative">
            
            {/* Dark curved header section with premium gradients and wave effects */}
            <div className="relative bg-gradient-to-br from-[#0B251A] via-[#123624] to-[#1E40AF] text-white pb-8 overflow-hidden rounded-b-[2.5rem] shadow-xl">
              {/* Light beam styling effects */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl"></div>
              
              <div className="px-5 pt-7 relative z-10">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <img src={LOGO_IMG} width={38} height={38} alt="Mini Logo" className="rounded-xl bg-white/10 p-0.5 border border-white/20 shadow-inner" />
                    <span className="font-black text-xl tracking-wider">Report<span className="text-[#52B788]">2</span>Fix</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => showToast("No new announcements.", "info")} className="p-2.5 bg-white/10 hover:bg-white/15 rounded-full transition-all relative">
                      <Bell className="w-5 h-5" />
                      <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#EA4335] rounded-full border-2 border-[#123624]"></span>
                    </button>
                  </div>
                </div>

                {/* Live geocoded GPS address display (never hardcoded) */}
                <div className="flex items-start gap-2.5 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 text-xs shadow-sm">
                  <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5 animate-pulse" />
                  <div className="flex-1">
                    <span className="block font-black text-emerald-400 text-[9px] tracking-widest mb-0.5">📍 CURRENT GPS LOCATION</span>
                    <p className="font-bold text-white/95 line-clamp-1 leading-tight">
                      {location.loading ? "Locating dynamic position..." : location.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main scrollable layout content */}
            <div className="p-4 flex flex-col gap-4.5 relative z-10 -mt-4">
              
              {/* Welcome card */}
              <div className="bg-white/80 backdrop-blur-xs border border-neutral-100 rounded-3xl p-5 shadow-sm flex justify-between items-center hover:shadow-md transition-all">
                <div>
                  <h3 className="font-extrabold text-base text-neutral-800">Hi {user?.username || "Citizen"}! 👋</h3>
                  <p className="text-xs text-neutral-500 mt-1">Let's make Hyderabad clean and safe.</p>
                </div>
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-black px-4 py-2 rounded-full flex items-center gap-1.5 shadow-md">
                  ⭐ <span>{user?.xp || 150} XP</span>
                </div>
              </div>

              {/* 2x2 Quick Action Grid */}
              <div>
                <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2.5 pl-1">⚡ Quick Operations</h4>
                <div className="grid grid-cols-2 gap-3.5">
                  
                  {/* Camera action */}
                  <button 
                    onClick={() => { setReportStep(1); setScreen("report"); }}
                    className="p-4.5 bg-gradient-to-br from-emerald-700 to-teal-800 text-white rounded-3xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all text-left flex flex-col justify-between h-[115px] group border border-white/10"
                  >
                    <div className="w-9 h-9 rounded-2xl bg-white/15 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-all">📷</div>
                    <div>
                      <h5 className="font-black text-sm leading-tight">Report Issue</h5>
                      <span className="text-[10px] text-emerald-200 mt-1 block">Record & AI analyze</span>
                    </div>
                  </button>

                  {/* Map action */}
                  <button 
                    onClick={() => setScreen("map")}
                    className="p-4.5 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all text-left flex flex-col justify-between h-[115px] group border border-white/10"
                  >
                    <div className="w-9 h-9 rounded-2xl bg-white/15 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-all">📍</div>
                    <div>
                      <h5 className="font-black text-sm leading-tight">Nearby Map</h5>
                      <span className="text-[10px] text-blue-100 mt-1 block">Interactive Markers</span>
                    </div>
                  </button>

                  {/* My Reports */}
                  <button 
                    onClick={() => setScreen("myreports")}
                    className="p-4.5 bg-gradient-to-br from-purple-600 to-pink-700 text-white rounded-3xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all text-left flex flex-col justify-between h-[115px] group border border-white/10"
                  >
                    <div className="w-9 h-9 rounded-2xl bg-white/15 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-all">📋</div>
                    <div>
                      <h5 className="font-black text-sm leading-tight">My Reports</h5>
                      <span className="text-[10px] text-purple-100 mt-1 block">Filings ({reports.length})</span>
                    </div>
                  </button>

                  {/* Community Score */}
                  <button 
                    onClick={() => setScreen("profile")}
                    className="p-4.5 bg-gradient-to-br from-orange-500 to-rose-600 text-white rounded-3xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all text-left flex flex-col justify-between h-[115px] group border border-white/10"
                  >
                    <div className="w-9 h-9 rounded-2xl bg-white/15 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-all">🏆</div>
                    <div>
                      <h5 className="font-black text-sm leading-tight">Civic Level</h5>
                      <span className="text-[10px] text-orange-100 mt-1 block">XP & Badges</span>
                    </div>
                  </button>

                </div>
              </div>

              {/* AI Registered Hotspots stats */}
              <div className="bg-white rounded-3xl border border-neutral-100 p-4.5 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">🤖 AI Registered Hotspots</h4>
                  <span className="text-[9px] bg-red-50 text-red-600 font-extrabold px-2.5 py-1 rounded-full animate-pulse flex items-center gap-1 border border-red-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> ACTIVE HOTSPOTS
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-amber-50/50 rounded-2xl p-3 border border-amber-100 hover:scale-[1.02] transition-all">
                    <span className="text-2xl">⚠️</span>
                    <span className="block font-black text-neutral-800 text-lg mt-1">
                      {reports.filter(r => r.type === "Pothole").length}
                    </span>
                    <span className="text-[9px] text-amber-800 font-bold uppercase tracking-wider block mt-0.5">Potholes</span>
                  </div>
                  
                  <div className="bg-emerald-50/50 rounded-2xl p-3 border border-emerald-100 hover:scale-[1.02] transition-all">
                    <span className="text-2xl">🗑️</span>
                    <span className="block font-black text-neutral-800 text-lg mt-1">
                      {reports.filter(r => r.type === "Garbage").length}
                    </span>
                    <span className="text-[9px] text-emerald-800 font-bold uppercase tracking-wider block mt-0.5">Garbage</span>
                  </div>

                  <div className="bg-sky-50/50 rounded-2xl p-3 border border-sky-100 hover:scale-[1.02] transition-all">
                    <span className="text-2xl">💡</span>
                    <span className="block font-black text-neutral-800 text-lg mt-1">0</span>
                    <span className="text-[9px] text-sky-800 font-bold uppercase tracking-wider block mt-0.5">Streetlights</span>
                  </div>
                </div>
              </div>

              {/* Recent Activity List (last 3) with colorful status badges and icons */}
              <div className="bg-white rounded-3xl border border-neutral-100 p-4.5 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">🕒 Recent Activity</h4>
                  <button onClick={() => setScreen("myreports")} className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-0.5">
                    View All <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  {getRecentReports().map((rep) => (
                    <div 
                      key={rep.id} 
                      onClick={() => setScreen("myreports")}
                      className="p-3 bg-neutral-50/50 rounded-2xl border border-neutral-100/50 hover:border-neutral-200 hover:scale-[1.01] transition-all cursor-pointer flex gap-3"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-neutral-100 flex items-center justify-center text-xl flex-shrink-0">
                        {rep.type === "Pothole" ? "⚠️" : "🗑️"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h5 className="font-extrabold text-xs text-neutral-800">{rep.type}</h5>
                          <span className={`text-[9px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                            rep.status === "Resolved" ? "bg-emerald-100 text-emerald-800 border border-emerald-200" :
                            rep.status === "In Progress" ? "bg-amber-100 text-amber-800 border border-amber-200" : "bg-blue-100 text-blue-800 border border-blue-200"
                          }`}>
                            <span>{rep.status === "Resolved" ? "🟢" : rep.status === "In Progress" ? "⏳" : "📢"}</span>
                            {rep.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-neutral-500 line-clamp-1 mt-1 leading-normal font-semibold">{rep.address}</p>
                        <span className="text-[9px] text-neutral-400 font-bold mt-1 block">{rep.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Civic News Preview */}
              <div className="bg-white rounded-3xl border border-neutral-100 p-4.5 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">📰 Civic News Updates</h4>
                  <button onClick={() => setScreen("news")} className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-0.5">
                    See All <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  {NEWS_DATA.slice(0, 2).map((news) => (
                    <div 
                      key={news.id} 
                      onClick={() => setScreen("news")}
                      className="p-3 bg-neutral-50/50 border border-neutral-100/50 rounded-2xl hover:border-neutral-200 cursor-pointer transition-all flex flex-col justify-between hover:scale-[1.02]"
                    >
                      <div>
                        <span 
                          style={{ backgroundColor: news.tagBg, color: news.tagText }} 
                          className="text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider block w-max"
                        >
                          {news.tag}
                        </span>
                        <h5 className="font-extrabold text-[11px] text-neutral-800 line-clamp-2 leading-snug mt-2">{news.title}</h5>
                      </div>
                      <span className="text-[9px] text-neutral-400 font-bold mt-2.5 block">{news.date}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Floating Chatbot button with ring animation and speech bubble styling */}
            <button
              onClick={() => setIsChatOpen(true)}
              className="fixed md:absolute bottom-24 right-5 w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-[0_4px_14px_rgba(37,99,235,0.4)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.6)] hover:scale-110 active:scale-95 transition-all z-30 border border-white/10"
              title="Chat with Civic AI"
            >
              <MessageSquare className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 text-[8px] font-black text-white items-center justify-center">AI</span>
              </span>
            </button>

          </div>
        )}

        {/* ==============================================================
            SCREEN 6: REPORT (CAMERA WORKFLOW)
            ============================================================== */}
        {screen === "report" && (
          <div className="flex flex-col flex-1 pb-20 overflow-y-auto">
            
            {/* Common Header */}
            <div className="bg-white border-b border-neutral-100 p-4 flex items-center gap-3 relative">
              <button 
                onClick={() => {
                  if (reportStep === 1) {
                    setScreen("home");
                  } else {
                    setReportStep((prev) => (prev - 1) as 1 | 2);
                  }
                }} 
                className="p-2 hover:bg-neutral-50 rounded-full transition-all"
              >
                <ArrowLeft className="w-5 h-5 text-neutral-800" />
              </button>
              <div>
                <h3 className="font-black text-neutral-800 text-sm">Report Infrastructure Issue</h3>
                <span className="text-[10px] text-neutral-500 font-semibold">Sub-step {reportStep} of 3</span>
              </div>

              {/* Linear step guide indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-100 flex">
                <div className={`h-full bg-emerald-600 transition-all duration-300 ${
                  reportStep === 1 ? "w-1/3" : reportStep === 2 ? "w-2/3" : "w-full"
                }`}></div>
              </div>
            </div>

            {/* ==================== SUB-STEP 1: CAPTURE ==================== */}
            {reportStep === 1 && (
              <div className="p-4 flex flex-col gap-4">
                
                {/* Issue Selector */}
                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
                    1. Select Issue Category
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    
                    {/* Pothole Button */}
                    <button
                      onClick={() => setSelectedType("Pothole")}
                      className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${
                        selectedType === "Pothole" 
                          ? "border-[#D97706] bg-amber-50 text-amber-900 shadow-md" 
                          : "border-neutral-200 bg-white hover:bg-neutral-50"
                      }`}
                    >
                      <span className="text-3xl">⚠️</span>
                      <span className="font-extrabold text-xs">Pothole</span>
                    </button>

                    {/* Garbage Button */}
                    <button
                      onClick={() => setSelectedType("Garbage")}
                      className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${
                        selectedType === "Garbage" 
                          ? "border-[#059669] bg-emerald-50 text-emerald-900 shadow-md" 
                          : "border-neutral-200 bg-white hover:bg-neutral-50"
                      }`}
                    >
                      <span className="text-3xl">🗑️</span>
                      <span className="font-extrabold text-xs">Garbage</span>
                    </button>

                  </div>
                </div>

                {/* GPS Location details card */}
                <div className="bg-white border border-neutral-100 shadow-xs rounded-2xl p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-center border-b border-neutral-100 pb-2.5">
                    <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Location Diagnostics</span>
                    <span className="text-[10px] bg-blue-50 text-blue-800 font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
                      </span>
                      GPS ACTIVE
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="block font-bold text-neutral-400 text-[10px] mb-0.5">LATITUDE</span>
                      <span className="font-mono text-neutral-800 font-bold">{location.lat.toFixed(5)}° N</span>
                    </div>
                    <div>
                      <span className="block font-bold text-neutral-400 text-[10px] mb-0.5">LONGITUDE</span>
                      <span className="font-mono text-neutral-800 font-bold">{location.lng.toFixed(5)}° E</span>
                    </div>
                  </div>

                  <div className="mt-1">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="block font-bold text-neutral-400 text-[10px]">VERIFIED CIVIC ADDRESS</span>
                      <button 
                        onClick={() => setIsAddressEditable(!isAddressEditable)}
                        className="text-xs font-extrabold text-[#2563EB] hover:underline flex items-center gap-1"
                      >
                        {isAddressEditable ? "💾 Lock" : "✏️ Edit Address"}
                      </button>
                    </div>

                    {isAddressEditable ? (
                      <textarea
                        value={manualAddress}
                        onChange={(e) => setManualAddress(e.target.value)}
                        className="w-full text-xs p-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-400 bg-white leading-normal"
                        rows={2}
                      />
                    ) : (
                      <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 text-xs font-semibold text-neutral-700 leading-normal">
                        {location.loading ? "Querying geocoder..." : manualAddress}
                      </div>
                    )}
                  </div>
                </div>

                {/* Upload action area */}
                <div className="flex flex-col gap-3 pt-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                  />
                  
                  <button
                    onClick={triggerCaptureInput}
                    className="w-full py-7 border-2 border-dashed border-[#1B4332] bg-emerald-50/20 hover:bg-emerald-50/50 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#1B4332] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-all">
                      <Camera className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                      <span className="font-extrabold text-sm text-[#1B4332]">Take Photo / Upload Image</span>
                      <p className="text-[10px] text-neutral-500 mt-1">Camera activates automatically with geolocation tagging</p>
                    </div>
                  </button>
                </div>

                {/* Info block note */}
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex gap-2.5 items-start mt-1">
                  <span className="text-base mt-0.5">🤖</span>
                  <p className="text-[10px] text-blue-800 font-semibold leading-relaxed">
                    <strong>AI Smart Note:</strong> Real-time neural network detection validates photos during upload. Please ensure your image is clear and focused on the selected pothole or waste hazard.
                  </p>
                </div>

              </div>
            )}

            {/* ==================== SUB-STEP 2: ANALYZE ==================== */}
            {reportStep === 2 && (
              <div className="p-4 flex flex-col gap-4">
                
                <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  2. Image Captured - Run AI Detector
                </h4>

                {/* Image preview */}
                {capturedImage && (
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-md border border-neutral-200 bg-black flex items-center justify-center">
                    <img src={capturedImage} alt="Captured preview" className="max-h-full object-contain" />
                  </div>
                )}

                {/* Analyzing Loader State */}
                {isAnalyzing ? (
                  <div className="py-8 flex flex-col items-center justify-center gap-3 text-center">
                    <div className="w-10 h-10 rounded-full border-4 border-[#1B4332] border-t-transparent animate-spin mb-1"></div>
                    <span className="font-black text-neutral-800 text-sm">🤖 AI Analyzing Image...</span>
                    <p className="text-xs text-[#6B7280] max-w-[240px]">Processing edge geocoordinates & surface-level contours...</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 pt-2">
                    <button
                      onClick={handleRunAI}
                      className="w-full py-3.5 bg-[#1B4332] text-white font-black rounded-xl shadow-md hover:bg-[#133125] transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      🔍 Run AI Detection
                    </button>
                    
                    <button
                      onClick={() => setReportStep(1)}
                      className="w-full py-3 border border-neutral-300 text-neutral-600 font-bold rounded-xl hover:bg-neutral-50 transition-all text-sm text-center"
                    >
                      Re-take Photo
                    </button>
                  </div>
                )}

              </div>
            )}

            {/* ==================== SUB-STEP 3: DETAILS ==================== */}
            {reportStep === 3 && (
              <div className="p-4 flex flex-col gap-4">
                
                <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  3. Audit & Submit Details
                </h4>

                {/* Canvas preview */}
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-sm border border-neutral-200 bg-neutral-900 flex justify-center items-center">
                  <canvas ref={canvasRef} className="w-full h-full object-contain" />
                </div>

                {/* AI Result indicator banner */}
                <div className={`p-4 rounded-xl border flex justify-between items-center ${
                  aiDetectedType === "Pothole" 
                    ? "bg-amber-50/50 border-amber-200 text-amber-900" 
                    : "bg-emerald-50/50 border-emerald-200 text-emerald-900"
                }`}>
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{aiDetectedType === "Pothole" ? "⚠️" : "🗑️"}</span>
                    <div>
                      <h5 className="font-black text-xs uppercase tracking-wide">AI PREDICTED CATEGORY</h5>
                      <p className="font-extrabold text-sm text-neutral-800">{aiDetectedType}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block font-bold text-[9px] text-neutral-400">CONFIDENCE</span>
                    <span className="font-black text-base text-neutral-800">{aiConfidence}%</span>
                  </div>
                </div>

                {/* Overwrite Selector */}
                <div>
                  <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                    Change Category Override (If AI geolocator erred)
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={() => { setAiDetectedType("Pothole"); }}
                      className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                        aiDetectedType === "Pothole" 
                          ? "bg-amber-600 border-amber-600 text-white shadow-xs" 
                          : "bg-white border-neutral-200 text-neutral-600"
                      }`}
                    >
                      ⚠️ Pothole
                    </button>
                    <button
                      onClick={() => { setAiDetectedType("Garbage"); }}
                      className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                        aiDetectedType === "Garbage" 
                          ? "bg-emerald-600 border-emerald-600 text-white shadow-xs" 
                          : "bg-white border-neutral-200 text-neutral-600"
                      }`}
                    >
                      🗑️ Garbage
                    </button>
                  </div>
                </div>

                {/* Address Confirm text */}
                <div>
                  <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">
                    Audited Location Address
                  </label>
                  <input
                    type="text"
                    value={manualAddress}
                    onChange={(e) => setManualAddress(e.target.value)}
                    className="w-full text-xs px-3.5 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-400 bg-white"
                  />
                </div>

                {/* Optional description */}
                <div>
                  <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">
                    Description Notes (Optional)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="E.g. Near secondary lane boundary, causing immediate bike hazards..."
                    rows={2.5}
                    className="w-full text-xs p-3.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-400 bg-white leading-normal"
                  />
                </div>

                {/* Submit Trigger Button */}
                <div className="pt-2 flex flex-col gap-3">
                  <button
                    onClick={handleSubmitReport}
                    disabled={isAnalyzing}
                    className="w-full py-3.5 bg-emerald-800 text-white font-extrabold rounded-xl shadow-lg hover:bg-emerald-900 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                  >
                    🚀 Submit Report (+50 XP)
                  </button>

                  <button
                    onClick={() => setReportStep(2)}
                    className="w-full py-2.5 border border-neutral-300 text-neutral-600 font-bold rounded-lg hover:bg-neutral-50 transition-all text-xs text-center"
                  >
                    Back to Analyze
                  </button>
                </div>

              </div>
            )}

          </div>
        )}

        {/* ==============================================================
            SCREEN 7: INTERACTIVE MAP
            ============================================================== */}
        {screen === "map" && (
          <div className="flex flex-col flex-1 pb-20 relative">
            
            {/* Header with Title & Refresh button */}
            <div className="bg-white border-b border-neutral-100 p-4 flex justify-between items-center shadow-xs z-20">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#2563EB]" />
                <h2 className="text-sm font-black text-neutral-800 uppercase tracking-wide">Live Infrastructure Map</h2>
              </div>
              <button 
                onClick={() => {
                  initMap();
                  showToast("Map layers synced successfully!", "success");
                }} 
                className="p-2 hover:bg-neutral-50 rounded-full transition-all text-neutral-600"
                title="Refresh Map Layers"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* Leaflet Mount viewport container */}
            <div className="flex-1 w-full bg-neutral-100 relative min-h-[360px] md:min-h-[460px]" id="leaflet-map-container">
              <div ref={mapDivRef} className="absolute inset-0 h-full w-full z-10" />
            </div>

            {/* Bottom Floating Map legend */}
            <div className="bg-white border-t border-neutral-100 p-4 shadow-lg z-20">
              <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2.5">Map Markers Index</h4>
              <div className="grid grid-cols-3 gap-2.5 text-xs text-neutral-700 font-bold">
                
                <div className="flex items-center gap-1.5 p-2 bg-amber-50 rounded-lg border border-amber-100">
                  <span className="text-sm">⚠️</span>
                  <div>
                    <span className="block text-[10px] text-amber-800 leading-none">Pothole</span>
                    <span className="text-[8px] text-amber-600/70 font-semibold leading-none block mt-0.5">
                      {reports.filter(r => r.type === "Pothole").length} reported
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 p-2 bg-emerald-50 rounded-lg border border-emerald-100">
                  <span className="text-sm">🗑️</span>
                  <div>
                    <span className="block text-[10px] text-emerald-800 leading-none">Garbage</span>
                    <span className="text-[8px] text-emerald-600/70 font-semibold leading-none block mt-0.5">
                      {reports.filter(r => r.type === "Garbage").length} reported
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 p-2 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="w-3.5 h-3.5 rounded-full bg-blue-600 border border-white flex-shrink-0"></div>
                  <div>
                    <span className="block text-[10px] text-blue-800 leading-none">Me</span>
                    <span className="text-[8px] text-blue-600/70 font-semibold leading-none block mt-0.5">Current GPS</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* ==============================================================
            SCREEN 8: NEWS SCREEN
            ============================================================== */}
        {screen === "news" && (
          <div className="flex flex-col flex-1 pb-20 overflow-y-auto bg-neutral-50/50">
            
            {/* News Header */}
            <div className="bg-white border-b border-neutral-100 p-4.5 shadow-xs sticky top-0 z-20">
              <h2 className="text-sm font-black text-neutral-800 uppercase tracking-widest">📰 Civic News</h2>
              <span className="text-[10px] text-neutral-500 font-bold">Latest cleanup and road restoration updates across Kukatpally</span>
            </div>

            {/* List of 4 cards with beautiful photos, tags, dates */}
            <div className="p-4 flex flex-col gap-4.5">
              {NEWS_DATA.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white rounded-3xl border border-neutral-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
                >
                  {/* Photo container */}
                  <div className="relative aspect-video w-full overflow-hidden bg-neutral-100">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span 
                        style={{ backgroundColor: item.tagBg, color: item.tagText }} 
                        className="text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm border border-white/20 backdrop-blur-md"
                      >
                        {item.tag}
                      </span>
                    </div>
                  </div>

                  {/* Body details */}
                  <div className="p-4 flex flex-col gap-2">
                    <div className="flex justify-between items-center text-[9px] font-black text-neutral-400">
                      <span>REPORT2FIX UPDATE</span>
                      <span>{item.date}</span>
                    </div>
                    <h3 className="font-extrabold text-sm text-neutral-800 leading-snug group-hover:text-[#2563EB] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-neutral-500 leading-relaxed font-medium">
                      {item.summary}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ==============================================================
            SCREEN 9: PROFILE (XP & BADGES)
            ============================================================== */}
        {screen === "profile" && (
          <div className="flex flex-col flex-1 pb-20 overflow-y-auto bg-[#F9FAFB]">
            
            {/* Header section with gradient profile card */}
            <div className="bg-gradient-to-br from-[#1B4332] to-[#2563EB] text-white p-5 pt-8 pb-12 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-white text-emerald-800 font-black text-xl flex items-center justify-center shadow-lg border-2 border-white/20 mb-3">
                {user?.username ? user.username.substring(0, 2).toUpperCase() : "CI"}
              </div>
              <h3 className="font-black text-base tracking-wide">{user?.username || "Citizen"}</h3>
              <p className="text-xs text-white/80 font-mono mt-0.5">{user?.email || "citizen@report2fix.in"}</p>
            </div>

            {/* Stats audit block overlay bar */}
            <div className="bg-white rounded-xl shadow-xs border border-neutral-100 p-4 grid grid-cols-3 gap-2 text-center -mt-8 mx-4 relative z-10">
              <div>
                <div className="text-xl font-black text-neutral-800">{reports.length}</div>
                <div className="text-[9px] text-neutral-400 font-extrabold uppercase tracking-wider mt-0.5">Reports</div>
              </div>
              <div className="border-l border-neutral-100">
                <div className="text-xl font-black text-[#1B4332]">{user?.xp || 150}</div>
                <div className="text-[9px] text-neutral-400 font-extrabold uppercase tracking-wider mt-0.5">XP Points</div>
              </div>
              <div className="border-l border-neutral-100">
                <div className="text-xl font-black text-[#2563EB]">#{user?.rank || 4}</div>
                <div className="text-[9px] text-neutral-400 font-extrabold uppercase tracking-wider mt-0.5">City Rank</div>
              </div>
            </div>

            {/* XP progress slider indicator */}
            <div className="mx-4 mt-5 bg-white border border-neutral-100 rounded-2xl p-4 shadow-xs">
              <div className="flex justify-between text-xs font-bold text-neutral-700 mb-1.5">
                <span>XP Level Progress</span>
                <span className="text-[#1B4332]">{user?.xp || 150} / 500 XP</span>
              </div>
              <div className="w-full bg-neutral-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  style={{ width: `${Math.min(((user?.xp || 150) / 500) * 100, 100)}%` }} 
                  className="h-full bg-[#52B788] rounded-full transition-all duration-500"
                />
              </div>
              <span className="text-[9px] text-neutral-400 font-semibold mt-2 block text-right">350 XP remaining for Tier 3 Badge</span>
            </div>

            {/* Badges index block */}
            <div className="mx-4 mt-4">
              <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2.5">Earned Badges ({user?.badges.length || 0}/4)</h4>
              <div className="grid grid-cols-2 gap-3">
                
                {/* Badge 1: First Reporter */}
                <div className={`p-3 rounded-2xl border transition-all bg-white flex flex-col items-center text-center ${
                  isBadgeUnlocked("first_reporter") 
                    ? "border-emerald-500/50" 
                    : "border-neutral-200/60 opacity-55"
                }`}>
                  <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-xl shadow-xs border border-amber-100">🥇</div>
                  <h5 className="font-extrabold text-[11px] text-neutral-800 mt-2">First Reporter</h5>
                  <p className="text-[9px] text-neutral-400 mt-0.5">Submit your first report filing</p>
                  <div className="mt-2.5 flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${isBadgeUnlocked("first_reporter") ? "bg-emerald-500" : "bg-neutral-300"}`}></div>
                    <span className="text-[9px] font-black text-neutral-600 uppercase tracking-wider">
                      {isBadgeUnlocked("first_reporter") ? "Unlocked" : "Locked"}
                    </span>
                  </div>
                </div>

                {/* Badge 2: Top Contributor */}
                <div className={`p-3 rounded-2xl border transition-all bg-white flex flex-col items-center text-center ${
                  isBadgeUnlocked("top_contributor") 
                    ? "border-emerald-500/50" 
                    : "border-neutral-200/60 opacity-55"
                }`}>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-xl shadow-xs border border-blue-100">⭐</div>
                  <h5 className="font-extrabold text-[11px] text-neutral-800 mt-2">Top Contributor</h5>
                  <p className="text-[9px] text-neutral-400 mt-0.5">Reach 200 XP points scale</p>
                  <div className="mt-2.5 flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${isBadgeUnlocked("top_contributor") ? "bg-emerald-500" : "bg-neutral-300"}`}></div>
                    <span className="text-[9px] font-black text-neutral-600 uppercase tracking-wider">
                      {isBadgeUnlocked("top_contributor") ? "Unlocked" : "Locked"}
                    </span>
                  </div>
                </div>

                {/* Badge 3: Community Hero */}
                <div className={`p-3 rounded-2xl border transition-all bg-white flex flex-col items-center text-center ${
                  isBadgeUnlocked("community_hero") 
                    ? "border-emerald-500/50" 
                    : "border-neutral-200/60 opacity-55"
                }`}>
                  <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-xl shadow-xs border border-purple-100">🦸</div>
                  <h5 className="font-extrabold text-[11px] text-neutral-800 mt-2">Community Hero</h5>
                  <p className="text-[9px] text-neutral-400 mt-0.5">Submit 5 issue report filings</p>
                  <div className="mt-2.5 flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${isBadgeUnlocked("community_hero") ? "bg-emerald-500" : "bg-neutral-300"}`}></div>
                    <span className="text-[9px] font-black text-neutral-600 uppercase tracking-wider">
                      {isBadgeUnlocked("community_hero") ? "Unlocked" : "Locked"}
                    </span>
                  </div>
                </div>

                {/* Badge 4: Impact Maker */}
                <div className={`p-3 rounded-2xl border transition-all bg-white flex flex-col items-center text-center ${
                  isBadgeUnlocked("impact_maker") 
                    ? "border-emerald-500/50" 
                    : "border-neutral-200/60 opacity-55"
                }`}>
                  <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center text-xl shadow-xs border border-sky-100">🌍</div>
                  <h5 className="font-extrabold text-[11px] text-neutral-800 mt-2">Impact Maker</h5>
                  <p className="text-[9px] text-neutral-400 mt-0.5">Submit 10 issue report filings</p>
                  <div className="mt-2.5 flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${isBadgeUnlocked("impact_maker") ? "bg-emerald-500" : "bg-neutral-300"}`}></div>
                    <span className="text-[9px] font-black text-neutral-600 uppercase tracking-wider">
                      {isBadgeUnlocked("impact_maker") ? "Unlocked" : "Locked"}
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Menu List */}
            <div className="mx-4 mt-5 mb-5 bg-white border border-neutral-100 rounded-2xl overflow-hidden shadow-xs">
              
              <button 
                onClick={() => setScreen("myreports")}
                className="w-full px-4 py-3.5 hover:bg-neutral-50 transition-all flex justify-between items-center border-b border-neutral-100 text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">📋</span>
                  <span className="text-xs font-extrabold text-neutral-800">My Reports Filings</span>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </button>

              <button 
                onClick={() => setScreen("leaderboard")}
                className="w-full px-4 py-3.5 hover:bg-neutral-50 transition-all flex justify-between items-center border-b border-neutral-100 text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">🥇</span>
                  <span className="text-xs font-extrabold text-neutral-800">Leaderboard & Standings</span>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </button>

              <button 
                onClick={() => setScreen("faq")}
                className="w-full px-4 py-3.5 hover:bg-neutral-50 transition-all flex justify-between items-center border-b border-neutral-100 text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">❓</span>
                  <span className="text-xs font-extrabold text-neutral-800">FAQ & Support Help</span>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </button>

              <button 
                onClick={handleLogout}
                className="w-full px-4 py-3.5 hover:bg-red-50/50 transition-all flex justify-between items-center text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">🚪</span>
                  <span className="text-xs font-extrabold text-red-700">Logout Profile Account</span>
                </div>
                <ChevronRight className="w-4 h-4 text-red-300" />
              </button>

            </div>

          </div>
        )}

        {/* ==============================================================
            SCREEN 10: MY REPORTS SCREEN
            ============================================================== */}
        {screen === "myreports" && (
          <div className="flex flex-col flex-1 pb-20 overflow-y-auto">
            
            {/* Header */}
            <div className="bg-white border-b border-neutral-100 p-4 flex justify-between items-center shadow-xs">
              <div>
                <h2 className="text-sm font-black text-neutral-800 uppercase tracking-wide">📋 My Submitted Reports</h2>
                <span className="text-[10px] text-neutral-500 font-semibold">Total submissions: {reports.length}</span>
              </div>
              <button 
                onClick={() => { setReportStep(1); setScreen("report"); }}
                className="px-3.5 py-1.5 bg-[#1B4332] text-white rounded-lg text-xs font-bold hover:bg-[#133125] transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Report
              </button>
            </div>

            {/* List of filings */}
            <div className="p-4 flex flex-col gap-3.5">
              {reports.length === 0 ? (
                <div className="py-16 text-center flex flex-col items-center justify-center gap-3.5">
                  <div className="w-16 h-16 rounded-full bg-neutral-100 text-3xl flex items-center justify-center">📭</div>
                  <div>
                    <h4 className="font-extrabold text-sm text-neutral-800">No Filings Recorded</h4>
                    <p className="text-xs text-neutral-400 mt-1 max-w-[220px] mx-auto leading-relaxed">
                      You haven't reported any civic issues yet. Click the camera button below to file your first report.
                    </p>
                  </div>
                  <button 
                    onClick={() => { setReportStep(1); setScreen("report"); }}
                    className="mt-2.5 px-4 py-2.5 bg-emerald-800 text-white rounded-xl text-xs font-black shadow-sm"
                  >
                    File New Report
                  </button>
                </div>
              ) : (
                reports.map((rep) => (
                  <div 
                    key={rep.id} 
                    className="bg-white rounded-2xl border border-neutral-100 p-4 shadow-xs flex flex-col gap-3"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{rep.type === "Pothole" ? "⚠️" : "🗑️"}</span>
                        <div>
                          <h4 className="font-black text-sm text-neutral-800">{rep.type}</h4>
                          <span className="text-[9px] text-neutral-400 font-bold block">ID: {rep.id}</span>
                        </div>
                      </div>

                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        rep.status === "Resolved" ? "bg-emerald-100 text-emerald-800 border border-emerald-200" :
                        rep.status === "In Progress" ? "bg-amber-100 text-amber-800 border border-amber-200" : 
                        "bg-blue-100 text-blue-800 border border-blue-200"
                      }`}>
                        {rep.status}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-700 leading-normal font-semibold bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
                      {rep.address}
                    </p>

                    {rep.description && (
                      <p className="text-xs text-neutral-500 leading-relaxed italic pl-1 border-l-2 border-neutral-200">
                        "{rep.description}"
                      </p>
                    )}

                    <div className="flex justify-between items-center text-[10px] text-neutral-400 font-semibold border-t border-neutral-100 pt-3">
                      <span>Submitted: {rep.date}</span>
                      {rep.confidence && (
                        <span className="text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full font-bold">
                          AI Confidence: {rep.confidence}%
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        )}

        {/* ==============================================================
            SCREEN 11: FAQ / HELP
            ============================================================== */}
        {screen === "faq" && (
          <div className="flex flex-col flex-1 pb-20 overflow-y-auto bg-[#F9FAFB]">
            
            {/* Header */}
            <div className="bg-white border-b border-neutral-100 p-4 shadow-xs">
              <h2 className="text-sm font-black text-neutral-800 uppercase tracking-wide">❓ FAQ & Help Center</h2>
              <span className="text-[10px] text-neutral-500 font-semibold">Learn how AI and crowdsourcing power Report2Fix</span>
            </div>

            {/* Accordion Questions */}
            <div className="p-4 flex flex-col gap-3">
              {FAQ_DATA.map((faq, index) => {
                const isOpen = faqOpen[index] || false;
                return (
                  <div 
                    key={index}
                    className="bg-white border border-neutral-100 rounded-xl overflow-hidden shadow-xs"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full p-4 flex justify-between items-center text-left hover:bg-neutral-50 transition-all gap-4"
                    >
                      <span className="text-xs font-black text-neutral-800 leading-snug">{faq.question}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                      )}
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="border-t border-neutral-50"
                        >
                          <p className="p-4 text-xs text-neutral-500 leading-relaxed bg-neutral-50/50">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Support bottom email box */}
            <div className="mx-4 mt-3 mb-5 p-4.5 bg-neutral-900 text-white rounded-2xl flex flex-col items-center text-center gap-2">
              <span className="text-xl">📧</span>
              <h4 className="font-extrabold text-xs">Need Direct Assistance?</h4>
              <p className="text-[10px] text-neutral-400 max-w-[240px] leading-relaxed">
                Our support desk reviews any manual override corrections or system issues. Email us directly at:
              </p>
              <a href="mailto:support@report2fix.in" className="text-xs font-mono font-bold text-[#52B788] hover:underline">
                support@report2fix.in
              </a>
            </div>

          </div>
        )}

        {/* ==============================================================
            SCREEN 12: LEADERBOARD SCREEN
            ============================================================== */}
        {screen === "leaderboard" && (
          <div className="flex flex-col flex-1 pb-20 overflow-y-auto">
            
            {/* Header */}
            <div className="bg-[#1B4332] text-white p-5 pt-7 rounded-b-[24px] shadow-md flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg">🏆</div>
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider">City Standings</h2>
                <span className="text-[10px] text-emerald-200/90 font-semibold">Top active contributors in Kukatpally</span>
              </div>
            </div>

            {/* Leaderboard lists */}
            <div className="p-4 flex flex-col gap-3">
              {getLeaderboardData().map((u) => (
                <div 
                  key={u.username}
                  className={`p-3.5 bg-white rounded-2xl border transition-all flex items-center justify-between shadow-xs ${
                    u.isMe 
                      ? "border-emerald-500 ring-2 ring-emerald-500/20" 
                      : "border-neutral-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    
                    {/* Rank indicator */}
                    <div className="w-7 h-7 rounded-full bg-neutral-50 border border-neutral-100 flex items-center justify-center font-black text-xs text-neutral-600">
                      {u.medal ? u.medal : u.rank}
                    </div>

                    <div>
                      <h4 className="text-xs font-black text-neutral-800 flex items-center gap-1.5">
                        {u.username}
                        {u.isMe && (
                          <span className="bg-emerald-100 text-emerald-800 font-black text-[8px] px-1.5 py-0.5 rounded-full tracking-wider">
                            YOU
                          </span>
                        )}
                      </h4>
                      <p className="text-[9px] text-neutral-400 font-semibold">Earned {u.badgeCount} badges</p>
                    </div>

                  </div>

                  {/* XP indicator pill */}
                  <div className="px-3 py-1.5 bg-neutral-100 text-neutral-800 rounded-xl text-xs font-black flex items-center gap-1">
                    🌟 <span className="text-neutral-900">{u.xp} XP</span>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* ==============================================================
            SCREEN 13: EMERGENCY & CONTACTS SCREEN
            ============================================================== */}
        {screen === "contacts" && (
          <div className="flex flex-col flex-1 pb-20 overflow-y-auto bg-gradient-to-b from-neutral-50 to-neutral-100">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-red-800 to-amber-700 text-white p-5 pt-7 rounded-b-[24px] shadow-md flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg">📞</div>
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider">Civic Helplines & Contacts</h2>
                <span className="text-[10px] text-amber-100/90 font-semibold">Real Hyderabad municipal, emergency, and complaint lines</span>
              </div>
            </div>

            <div className="p-4 flex flex-col gap-4">
              
              <div className="bg-white rounded-3xl border border-neutral-100 p-4 shadow-sm">
                <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span> Emergency Rescue Lines
                </h3>
                
                <div className="flex flex-col gap-3">
                  <div className="p-3.5 bg-red-50/40 rounded-2xl border border-red-100/60 flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-xs text-red-900">National Emergency Number</h4>
                      <p className="text-[10px] text-red-700/80 font-medium mt-0.5">All-in-one immediate rescue response</p>
                    </div>
                    <a 
                      href="tel:112" 
                      className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-black shadow-sm flex items-center gap-1.5 hover:bg-red-700 transition-all active:scale-95"
                    >
                      <PhoneCall className="w-3.5 h-3.5" /> Call 112
                    </a>
                  </div>

                  <div className="p-3.5 bg-red-50/40 rounded-2xl border border-red-100/60 flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-xs text-red-900">Police Control Room</h4>
                      <p className="text-[10px] text-red-700/80 font-medium mt-0.5">Hyderabad Police Station desk line</p>
                    </div>
                    <a 
                      href="tel:100" 
                      className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-black shadow-sm flex items-center gap-1.5 hover:bg-red-700 transition-all active:scale-95"
                    >
                      <PhoneCall className="w-3.5 h-3.5" /> Call 100
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-neutral-100 p-4 shadow-sm">
                <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-3">🏢 Greater Hyderabad Municipal (GHMC)</h3>
                
                <div className="flex flex-col gap-3">
                  <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-100 flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-xs text-neutral-800">GHMC Call Center Helpline</h4>
                      <p className="text-[10px] text-neutral-500 font-semibold mt-0.5">General civic complaints & registry</p>
                    </div>
                    <a 
                      href="tel:040-21111111" 
                      className="px-3.5 py-2 bg-[#1B4332] text-white rounded-xl text-xs font-black shadow-xs flex items-center gap-1.5 hover:bg-[#133125] transition-all active:scale-95"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call
                    </a>
                  </div>

                  <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-100 flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-xs text-neutral-800">GHMC Road Maintenance Desk</h4>
                      <p className="text-[10px] text-neutral-500 font-semibold mt-0.5">Direct reporting for potholes and layout defects</p>
                    </div>
                    <a 
                      href="tel:040-23220160" 
                      className="px-3.5 py-2 bg-[#1B4332] text-white rounded-xl text-xs font-black shadow-xs flex items-center gap-1.5 hover:bg-[#133125] transition-all active:scale-95"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call
                    </a>
                  </div>

                  <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-100 flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-xs text-neutral-800">GHMC Kukatpally Zonal Office</h4>
                      <p className="text-[10px] text-neutral-500 font-semibold mt-0.5">Local ward officer coordination helpdesk</p>
                    </div>
                    <a 
                      href="tel:040-23055457" 
                      className="px-3.5 py-2 bg-[#1B4332] text-white rounded-xl text-xs font-black shadow-xs flex items-center gap-1.5 hover:bg-[#133125] transition-all active:scale-95"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-neutral-100 p-4 shadow-sm">
                <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-3">💧 Water Supply & Drainage (HMWSSB)</h3>
                
                <div className="flex flex-col gap-3">
                  <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-100 flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-xs text-neutral-800">Water Board (HMWSSB) Helpline</h4>
                      <p className="text-[10px] text-neutral-500 font-semibold mt-0.5">Drainage blockages and sewage overflow logs</p>
                    </div>
                    <a 
                      href="tel:155313" 
                      className="px-3.5 py-2 bg-blue-600 text-white rounded-xl text-xs font-black shadow-xs flex items-center gap-1.5 hover:bg-blue-700 transition-all active:scale-95"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call 155313
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 border border-neutral-100 p-4.5 rounded-3xl shadow-sm text-center flex flex-col items-center gap-2">
                <Info className="w-5 h-5 text-neutral-400" />
                <h4 className="font-extrabold text-xs text-neutral-800">Automatic Geolocation Dispatch</h4>
                <p className="text-[10px] text-neutral-500 leading-relaxed max-w-[260px] mx-auto">
                  When you submit a photo via **Report2Fix**, our systems automatically map, reverse-geocode, and dispatch reports to field officers, meaning you don't even need to call!
                </p>
              </div>

            </div>
          </div>
        )}

        {/* =/* ==============================================================
            BOTTOM NAVIGATION SYSTEM
            ============================================================== */}
        {user && screen !== "splash" && screen !== "onboarding" && screen !== "login" && screen !== "register" && (
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-white border-t border-neutral-200 flex justify-between items-center px-4 z-40 select-none shadow-xl rounded-t-[20px]">
            
            {/* Home Tab */}
            <button 
              onClick={() => setScreen("home")} 
              className={`flex flex-col items-center flex-1 py-1 transition-all ${
                screen === "home" ? "text-[#1B4332]" : "text-[#6B7280] hover:text-[#1B4332]"
              }`}
            >
              <Home className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-bold">Home</span>
            </button>

            {/* Map Tab */}
            <button 
              onClick={() => setScreen("map")} 
              className={`flex flex-col items-center flex-1 py-1 transition-all ${
                screen === "map" ? "text-[#1B4332]" : "text-[#6B7280] hover:text-[#1B4332]"
              }`}
            >
              <Map className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-bold">Map</span>
            </button>

            {/* Central Raised Floating Camera tab */}
            <div className="relative flex-1 flex justify-center -top-4">
              <button
                onClick={() => { setReportStep(1); setScreen("report"); }}
                className="w-14 h-14 rounded-full bg-gradient-to-r from-emerald-700 to-teal-800 text-white flex items-center justify-center shadow-lg hover:from-emerald-800 hover:to-teal-900 transition-all transform active:scale-95 border-[4px] border-white"
                title="File a New Report"
              >
                <Camera className="w-6 h-6" />
              </button>
            </div>

            {/* Contacts Tab */}
            <button 
              onClick={() => setScreen("contacts")} 
              className={`flex flex-col items-center flex-1 py-1 transition-all ${
                screen === "contacts" ? "text-[#1B4332]" : "text-[#6B7280] hover:text-[#1B4332]"
              }`}
            >
              <Phone className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-bold">Contacts</span>
            </button>

            {/* Profile Tab */}
            <button 
              onClick={() => setScreen("profile")} 
              className={`flex flex-col items-center flex-1 py-1 transition-all ${
                screen === "profile" ? "text-[#1B4332]" : "text-[#6B7280] hover:text-[#1B4332]"
              }`}
            >
              <User className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-bold">Profile</span>
            </button>

          </div>
        )}

      </div>

      {/* ==============================================================
          WHATSAPP-STYLE CHATBOT MODAL OVERLAY
          ============================================================== */}
      <AnimatePresence>
        {isChatOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex justify-center items-end sm:items-center z-50 p-0 sm:p-4">
            
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="w-full max-w-[430px] h-[85vh] sm:h-[600px] bg-[#ECE5DD] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Chatbot WhatsApp Header */}
              <div className="bg-[#075E54] text-white px-4 py-3.5 flex items-center justify-between shadow-md">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-teal-800 border-2 border-teal-600 flex items-center justify-center text-lg">🤖</div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#075E54]"></span>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-xs leading-none">Report2Fix Civic AI</h3>
                    <span className="text-[10px] text-emerald-100 font-bold mt-1 block">Online | Ask me anything!</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/15 flex items-center justify-center text-white/90 text-sm font-black transition-all"
                >
                  ✕
                </button>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col max-w-[85%] ${
                      msg.sender === "user" ? "self-end items-end" : "self-start items-start"
                    }`}
                  >
                    <div
                      className={`p-3 rounded-2xl shadow-xs text-xs whitespace-pre-line leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-[#DCF8C6] text-neutral-800 rounded-tr-none"
                          : "bg-white text-neutral-800 rounded-tl-none border border-neutral-200/50"
                      }`}
                    >
                      {msg.text}
                      <span className="block text-[8px] text-neutral-400 font-semibold mt-1 text-right">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Reply Bubbles */}
              <div className="px-4 py-2.5 bg-neutral-100/80 border-t border-neutral-200 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none z-10">
                <button
                  onClick={() => handleSendChat("How to report a pothole?")}
                  className="px-3 py-1.5 bg-white border border-neutral-300 rounded-full text-[10px] font-black text-[#075E54] hover:bg-neutral-50 shadow-xs transition-all"
                >
                  📝 How to Report
                </button>
                <button
                  onClick={() => handleSendChat("How do I track my report status?")}
                  className="px-3 py-1.5 bg-white border border-neutral-300 rounded-full text-[10px] font-black text-[#075E54] hover:bg-neutral-50 shadow-xs transition-all"
                >
                  ⏳ Track Status
                </button>
                <button
                  onClick={() => handleSendChat("Show GHMC contacts")}
                  className="px-3 py-1.5 bg-white border border-neutral-300 rounded-full text-[10px] font-black text-[#075E54] hover:bg-neutral-50 shadow-xs transition-all"
                >
                  📞 GHMC Contacts
                </button>
                <button
                  onClick={() => handleSendChat("How to earn XP & badges?")}
                  className="px-3 py-1.5 bg-white border border-neutral-300 rounded-full text-[10px] font-black text-[#075E54] hover:bg-neutral-50 shadow-xs transition-all"
                >
                  🏆 Earn XP & Badges
                </button>
              </div>

              {/* Chat input box */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendChat();
                }}
                className="bg-white px-3 py-2.5 flex items-center gap-2 border-t border-neutral-200"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-neutral-100 px-4 py-2.5 rounded-full text-xs text-neutral-800 focus:outline-none focus:ring-1 focus:ring-[#075E54]"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="w-9 h-9 rounded-full bg-[#075E54] text-white flex items-center justify-center shadow-xs hover:bg-[#054c43] transition-all disabled:opacity-50 disabled:scale-100 transform active:scale-95 flex-shrink-0"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
              </form>

            </motion.div>

          </div>
        )}
      </AnimatePresence>

      {/* Embedded keyframe styles for smooth ripple animation on leaflet user dot */}
      <style>{`
        @keyframes pulse {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.7);
          }
          70% {
            transform: scale(1);
            box-shadow: 0 0 0 10px rgba(37, 99, 235, 0);
          }
          100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(37, 99, 235, 0);
          }
        }
      `}</style>

    </div>
  );
}
