import React, { useState, useEffect } from "react";
import { PortalConfig } from "./types";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Courses from "./components/Courses";
import Stats from "./components/Stats";
import Reviews from "./components/Reviews";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Login from "./components/Login";
import AdminPanel from "./components/AdminPanel";

export default function App() {
  const [config, setConfig] = useState<PortalConfig | null>(null);
  const [adminToken, setAdminToken] = useState<string | null>(
    localStorage.getItem("abhinabh_admin_token")
  );
  const [viewAdminControl, setViewAdminControl] = useState(false);
  const [currentSection, setCurrentSection] = useState("home");
  const [loading, setLoading] = useState(true);

  // Inquiry message queue (initialized from localStorage so entries persist)
  const [inquiries, setInquiries] = useState<Array<{
    id: string;
    name: string;
    email: string;
    phone: string;
    course: string;
    message: string;
    date: string;
  }>>(() => {
    try {
      const saved = localStorage.getItem("abhinabh_inquiries");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Preserve messages
  useEffect(() => {
    localStorage.setItem("abhinabh_inquiries", JSON.stringify(inquiries));
  }, [inquiries]);

  // Fetch configs from database on bootup
  const fetchPortalConfig = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/config");
      if (res.ok) {
        const data = await res.json();
        setConfig(data);
      }
    } catch (err) {
      console.error("Connection error loading express configurations.", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortalConfig();
  }, []);

  // Inject Google Fonts dynamically on Font configuration change
  useEffect(() => {
    if (!config) return;
    const sansFont = config.theme.fontSans || "Inter";
    const displayFont = config.theme.fontDisplay || "Space Grotesk";

    const linkId = "dynamic-google-fonts";
    let linkElement = document.getElementById(linkId) as HTMLLinkElement;
    if (!linkElement) {
      linkElement = document.createElement("link");
      linkElement.id = linkId;
      linkElement.rel = "stylesheet";
      document.head.appendChild(linkElement);
    }

    const fontQuery = `family=${sansFont.replace(/ /g, "+")}:wght@300;400;500;600;700;800&family=${displayFont.replace(/ /g, "+")}:wght@500;700;800;900&display=swap`;
    linkElement.href = `https://fonts.googleapis.com/css2?${fontQuery}`;
  }, [config?.theme?.fontSans, config?.theme?.fontDisplay]);

  // Handle section tracking for navbar active links highlighting
  useEffect(() => {
    const handleScroll = () => {
      if (viewAdminControl) return;
      const sections = ["home", "about", "courses", "reviews", "contact"];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setCurrentSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [viewAdminControl]);

  // Handle Login session
  const handleLoginSuccess = (token: string) => {
    setAdminToken(token);
    localStorage.setItem("abhinabh_admin_token", token);
    setViewAdminControl(true);
  };

  const handleLogout = () => {
    setAdminToken(null);
    localStorage.removeItem("abhinabh_admin_token");
    setViewAdminControl(false);
  };

  // Submit inqhury message callback
  const handleAddInquiry = (name: string, email: string, phone: string, course: string, message: string) => {
    const newInq = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      course,
      message,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    };
    setInquiries(prev => [newInq, ...prev]);
  };

  const handleClearInquiries = () => {
    setInquiries([]);
  };

  // Update configuration from Admin Panel and sync back to Postgres/File DB
  const handleSaveConfig = async (newConfig: PortalConfig): Promise<boolean> => {
    try {
      const res = await fetch("/api/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${adminToken}`
        },
        body: JSON.stringify(newConfig)
      });

      if (res.ok) {
        setConfig(newConfig);
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // Render loader spinner on first loading configs
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-4 border-t-sky-500 border-slate-700 rounded-full animate-spin mx-auto mr-auto" />
          <p className="text-xs text-slate-400 font-mono">Synchronizing portal database nodes...</p>
        </div>
      </div>
    );
  }

  const activeTheme = config?.theme;

  // Custom Inline Font-family and typography selectors
  const rootStyle: React.CSSProperties = activeTheme ? {
    fontFamily: `"${activeTheme.fontSans}", sans-serif`,
    color: activeTheme.textColor,
    backgroundColor: activeTheme.backgroundColor
  } : {};

  // Reroute to active workspace
  if (viewAdminControl) {
    if (!adminToken) {
      return (
        <Login 
          config={config!} 
          onLogin={handleLoginSuccess}
          onCancel={() => setViewAdminControl(false)}
        />
      );
    }
    return (
      <AdminPanel 
        config={config!}
        adminToken={adminToken}
        onSaveConfig={handleSaveConfig}
        onLogout={handleLogout}
        onClose={() => setViewAdminControl(false)}
        inquiries={inquiries}
        onClearInquiries={handleClearInquiries}
      />
    );
  }

  // Triggering focus click smooth scrolls
  const handleInquireRedirect = (courseName: string) => {
    const contactEl = document.getElementById("contact");
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: "smooth" });
      // Pre-fill selection if possible by dispatching custom input events
      const selectEl = document.querySelector("#contact select") as HTMLSelectElement;
      if (selectEl) {
        selectEl.value = courseName;
        selectEl.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }
  };

  return (
    <div style={rootStyle} className="min-h-screen">
      
      {/* Dynamic logo and items navbar */}
      <Navbar 
        config={config!}
        isAdmin={!!adminToken}
        onLogout={handleLogout}
        onGoToDashboard={() => setViewAdminControl(true)}
        currentSection={currentSection}
      />

      {/* Hero display section */}
      <Hero config={config!} />

      {/* Core legacy section */}
      <About config={config!} />

      {/* Course curriculum catalog cards */}
      <Courses 
        config={config!} 
        onInquire={handleInquireRedirect}
      />

      {/* Metrics layout grids */}
      <Stats config={config!} />

      {/* Student testimonials stories */}
      <Reviews config={config!} />

      {/* Campus Map coordinates & message inquiries form */}
      <Contact 
        config={config!} 
        onSubmitInquiry={handleAddInquiry}
      />

      {/* Footnote copyright handles */}
      <Footer config={config!} />

    </div>
  );
}
