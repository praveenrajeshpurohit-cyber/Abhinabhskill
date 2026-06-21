import React, { useState } from "react";
import * as LucideIcons from "lucide-react";
import { PortalConfig, CourseConfig, StatConfig, TestimonialConfig, NavItem } from "../types";

interface AdminPanelProps {
  config: PortalConfig;
  adminToken: string;
  onSaveConfig: (newConfig: PortalConfig) => Promise<boolean>;
  onLogout: () => void;
  onClose: () => void;
  inquiries: Array<{
    id: string;
    name: string;
    email: string;
    phone: string;
    course: string;
    message: string;
    date: string;
  }>;
  onClearInquiries: () => void;
}

type TabType = "branding" | "hero_about" | "courses" | "stats" | "reviews" | "inbox";

export default function AdminPanel({
  config,
  adminToken,
  onSaveConfig,
  onLogout,
  onClose,
  inquiries,
  onClearInquiries
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>("branding");
  
  // Local Config copy to modify incrementally before globally saving
  const [localConfig, setLocalConfig] = useState<PortalConfig>(JSON.parse(JSON.stringify(config)));
  const [saving, setSaving] = useState(false);
  const [alertInfo, setAlertInfo] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Upload helpers
  const [uploadProgress, setUploadProgress] = useState<Record<string, string>>({});

  // Dynamic Syllabus icon library selections
  const availableIcons = ["Code", "Calculator", "Megaphone", "MessageSquare", "GraduationCap", "Settings", "Award", "BookOpen", "TrendingUp", "Search", "Users"];

  // Handle generic input changes for nested properties safely
  const updateConfigField = (section: string, field: string, value: any) => {
    setLocalConfig((prev: any) => {
      const copy = { ...prev };
      copy[section] = { ...copy[section], [field]: value };
      return copy;
    });
  };

  const updateNavItem = (id: string, field: "label" | "url", value: string) => {
    setLocalConfig((prev) => {
      const copy = { ...prev };
      copy.navItems = copy.navItems.map((item) => 
        item.id === id ? { ...item, [field]: value } : item
      );
      return copy;
    });
  };

  // Base64 file upload uploader to server static `/uploads`
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, section: string, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB clientside limit)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit. Please upload a smaller image.");
      return;
    }

    setUploadProgress(prev => ({ ...prev, [field]: "Uploading..." }));

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result as string;
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${adminToken}`
          },
          body: JSON.stringify({
            filename: file.name,
            base64Data
          })
        });

        const data = await res.json();
        if (res.ok && data.url) {
          updateConfigField(section, field, data.url);
          setUploadProgress(prev => ({ ...prev, [field]: "Success!" }));
          setTimeout(() => {
            setUploadProgress(prev => ({ ...prev, [field]: "" }));
          }, 3000);
        } else {
          alert(data.error || "File upload failed.");
          setUploadProgress(prev => ({ ...prev, [field]: "Failed" }));
        }
      } catch (err) {
        alert("Upload error.");
        setUploadProgress(prev => ({ ...prev, [field]: "Failed" }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Global Sync/Submit save handler
  const saveAllConfigurations = async () => {
    setSaving(true);
    setAlertInfo(null);
    try {
      const success = await onSaveConfig(localConfig);
      setSaving(false);
      if (success) {
        setAlertInfo({ type: "success", text: "Global system configurations saved & sync'd with live frontend!" });
        // Auto remove alert soon
        setTimeout(() => setAlertInfo(null), 5000);
      } else {
        setAlertInfo({ type: "error", text: "Failed to update configurations. Express server error." });
      }
    } catch (err) {
      setSaving(false);
      setAlertInfo({ type: "error", text: "Network connection error syncing dynamic database." });
    }
  };

  // CRUD FOR SYSTEMS
  // Course CRUD states and handlers
  const [courseForm, setCourseForm] = useState<Partial<CourseConfig>>({
    id: "", name: "", description: "", category: "", duration: "", price: "", iconName: "Code"
  });
  const [courseEditMode, setCourseEditMode] = useState(false);

  const handleSaveCourse = () => {
    if (!courseForm.name || !courseForm.price) {
      alert("Please provide Course Name and Price.");
      return;
    }

    setLocalConfig((prev) => {
      const copy = { ...prev };
      if (courseEditMode) {
        // Edit existing
        copy.courses = copy.courses.map(c => c.id === courseForm.id ? (courseForm as CourseConfig) : c);
      } else {
        // Create new
        const newCourse: CourseConfig = {
          id: Date.now().toString(),
          name: courseForm.name || "",
          description: courseForm.description || "",
          category: courseForm.category || "Tech & IT",
          duration: courseForm.duration || "3 Months",
          price: courseForm.price || "₹5,000",
          iconName: courseForm.iconName || "GraduationCap"
        };
        copy.courses = [...copy.courses, newCourse];
      }
      return copy;
    });

    // Reset Form
    setCourseForm({ id: "", name: "", description: "", category: "", duration: "", price: "", iconName: "Code" });
    setCourseEditMode(false);
  };

  const handleEditCourse = (course: CourseConfig) => {
    setCourseForm(course);
    setCourseEditMode(true);
  };

  const handleDeleteCourse = (id: string) => {
    if (confirm("Are you sure you want to delete this course program? This resets local layout.")) {
      setLocalConfig(prev => {
        const copy = { ...prev };
        copy.courses = copy.courses.filter(c => c.id !== id);
        return copy;
      });
    }
  };

  // Stat CRUD states and handlers
  const [statForm, setStatForm] = useState<Partial<StatConfig>>({ id: "", count: "", label: "" });
  const [statEditMode, setStatEditMode] = useState(false);

  const handleSaveStat = () => {
    if (!statForm.count || !statForm.label) {
      alert("Please fill in stat digit count and dynamic label.");
      return;
    }

    setLocalConfig(prev => {
      const copy = { ...prev };
      if (statEditMode) {
        copy.stats = copy.stats.map(s => s.id === statForm.id ? (statForm as StatConfig) : s);
      } else {
        const newStat: StatConfig = {
          id: Date.now().toString(),
          count: statForm.count || "",
          label: statForm.label || ""
        };
        copy.stats = [...copy.stats, newStat];
      }
      return copy;
    });
    setStatForm({ id: "", count: "", label: "" });
    setStatEditMode(false);
  };

  // Testimonial CRUD states
  const [reviewForm, setReviewForm] = useState<Partial<TestimonialConfig>>({ id: "", name: "", role: "", text: "", rating: 5 });
  const [reviewEditMode, setReviewEditMode] = useState(false);

  const handleSaveReview = () => {
    if (!reviewForm.name || !reviewForm.text) {
      alert("Please fill in student name and review comment text.");
      return;
    }

    setLocalConfig(prev => {
      const copy = { ...prev };
      if (reviewEditMode) {
        copy.testimonials = copy.testimonials.map(t => t.id === reviewForm.id ? (reviewForm as TestimonialConfig) : t);
      } else {
        const newReview: TestimonialConfig = {
          id: Date.now().toString(),
          name: reviewForm.name || "",
          role: reviewForm.role || "Graduate Student",
          text: reviewForm.text || "",
          rating: Number(reviewForm.rating) || 5
        };
        copy.testimonials = [...copy.testimonials, newReview];
      }
      return copy;
    });
    setReviewForm({ id: "", name: "", role: "", text: "", rating: 5 });
    setReviewEditMode(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      
      {/* Top dashboard header bar */}
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 z-20 shadow">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-700 flex items-center justify-center font-black text-white text-lg tracking-wider">
            A
          </div>
          <div>
            <h1 className="text-md sm:text-lg font-extrabold font-display">Administrator Dashboard</h1>
            <p className="text-[10px] text-slate-400 font-mono">Abhinabh Central Database Synchronization Node v1.1.0</p>
          </div>
        </div>

        {/* Global Action items */}
        <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
          <button
            onClick={onClose}
            className="flex items-center space-x-1.5 px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 font-semibold cursor-pointer text-xs uppercase tracking-wider transition"
          >
            <LucideIcons.ArrowLeft className="h-4 w-4" />
            <span>View Live Site</span>
          </button>

          <button
            onClick={saveAllConfigurations}
            disabled={saving}
            className="flex items-center space-x-1.5 px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-700 font-bold cursor-pointer text-xs uppercase tracking-wider transition shadow"
          >
            {saving ? (
              <LucideIcons.Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LucideIcons.Save className="h-4 w-4" />
            )}
            <span>{saving ? "Syncing..." : "Sync Database Changes"}</span>
          </button>

          <button 
            onClick={onLogout}
            className="p-2 rounded text-red-400 hover:bg-red-950 hover:text-red-300 transition cursor-pointer"
            title="Sovereign Log out"
          >
            <LucideIcons.LogOut className="h-4.5 w-4.5" />
          </button>
        </div>
      </header>

      {/* Main administrative layout */}
      <main className="flex-1 flex flex-col md:flex-row">
        
        {/* Left Side Tab Navigation */}
        <aside className="w-full md:w-64 bg-slate-950/50 border-r border-slate-800 p-4 md:py-8 space-y-2">
          <div className="hidden md:block px-4 pb-4 mb-4 border-b border-slate-800">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">Configure Nodes</span>
          </div>

          <button
            onClick={() => setActiveTab("branding")}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 text-sm font-semibold select-none cursor-pointer transition ${activeTab === "branding" ? "bg-sky-600 text-white" : "hover:bg-slate-800 text-slate-300"}`}
          >
            <LucideIcons.Palette className="h-4 w-4" />
            <span>Colours & Branding</span>
          </button>

          <button
            onClick={() => setActiveTab("hero_about")}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 text-sm font-semibold select-none cursor-pointer transition ${activeTab === "hero_about" ? "bg-sky-600 text-white" : "hover:bg-slate-800 text-slate-300"}`}
          >
            <LucideIcons.LayoutTemplate className="h-4 w-4" />
            <span>Hero & About Content</span>
          </button>

          <button
            onClick={() => setActiveTab("courses")}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 text-sm font-semibold select-none cursor-pointer transition ${activeTab === "courses" ? "bg-sky-600 text-white" : "hover:bg-slate-800 text-slate-300"}`}
          >
            <LucideIcons.BookOpen className="h-4 w-4" />
            <span>Programs Catalog ({localConfig.courses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("stats")}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 text-sm font-semibold select-none cursor-pointer transition ${activeTab === "stats" ? "bg-sky-600 text-white" : "hover:bg-slate-800 text-slate-300"}`}
          >
            <LucideIcons.TrendingUp className="h-4 w-4" />
            <span>Statistics Elements ({localConfig.stats.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("reviews")}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 text-sm font-semibold select-none cursor-pointer transition ${activeTab === "reviews" ? "bg-sky-600 text-white" : "hover:bg-slate-800 text-slate-300"}`}
          >
            <LucideIcons.MessageSquare className="h-4 w-4" />
            <span>Student Testimonials ({localConfig.testimonials.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("inbox")}
            className={`w-full text-left px-4 py-3 rounded-lg flex justify-between items-center select-none cursor-pointer transition ${activeTab === "inbox" ? "bg-sky-600 text-white" : "hover:bg-slate-800 text-slate-300"}`}
          >
            <div className="flex items-center space-x-3 text-sm font-semibold">
              <LucideIcons.Inbox className="h-4 w-4" />
              <span>Inquiry Inbox</span>
            </div>
            {inquiries.length > 0 && (
              <span className="bg-red-500 font-bold text-white text-[10px] px-2 py-0.5 rounded-full animate-pulse">
                {inquiries.length}
              </span>
            )}
          </button>
        </aside>

        {/* Content Node Container */}
        <section className="flex-1 bg-slate-900 border-l border-slate-800 p-6 sm:p-8 overflow-y-auto max-h-[85vh]">
          
          {/* Synchronized alert notification bar */}
          {alertInfo && (
            <div className={`mb-6 p-4 rounded-xl border flex items-center space-x-3 ${alertInfo.type === "success" ? "bg-emerald-950 border-emerald-800 text-emerald-300" : "bg-red-950 border-red-800 text-red-300"}`}>
              {alertInfo.type === "success" ? <LucideIcons.Check className="h-5 w-5 flex-shrink-0" /> : <LucideIcons.AlertCircle className="h-5 w-5 flex-shrink-0" />}
              <span className="text-sm font-semibold">{alertInfo.text}</span>
            </div>
          )}

          {/* TAB 1: BRANDING & PALETTE */}
          {activeTab === "branding" && (
            <div className="space-y-8 animate-fadeIn">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-xl font-bold font-display flex items-center gap-2">
                  <LucideIcons.Palette className="text-sky-500" />
                  <span>Visual Branding & Theme Palette</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">Replicate colors, logos and headers from the abhinabhskill layout.</p>
              </div>

              {/* Logo section configuration */}
              <fieldset className="p-5 rounded-xl border border-slate-800 bg-slate-950/20 space-y-4">
                <legend className="text-xs font-extrabold uppercase px-2 text-sky-400 tracking-wider">Logo configuration</legend>
                
                <div className="flex gap-4 items-center">
                  <label className="flex items-center space-x-2 text-sm">
                    <input 
                      type="radio" 
                      name="logoType" 
                      checked={localConfig.logo.type === "text"}
                      onChange={() => updateConfigField("logo", "type", "text")}
                      className="accent-sky-600"
                    />
                    <span>Text Heading</span>
                  </label>
                  <label className="flex items-center space-x-2 text-sm">
                    <input 
                      type="radio" 
                      name="logoType" 
                      checked={localConfig.logo.type === "image"}
                      onChange={() => updateConfigField("logo", "type", "image")}
                      className="accent-sky-600"
                    />
                    <span>Brand Image Upload</span>
                  </label>
                </div>

                {localConfig.logo.type === "text" ? (
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Navbar Brand Text</label>
                    <input 
                      type="text"
                      value={localConfig.logo.text}
                      onChange={(e) => updateConfigField("logo", "text", e.target.value)}
                      className="w-full max-w-md px-3 py-2 bg-slate-950 border border-slate-800 rounded text-sm text-white"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">Upload Brand Logo</label>
                      <input 
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, "logo", "imageUrl")}
                        className="text-xs cursor-pointer bg-slate-950 p-2 rounded w-full border border-slate-800"
                      />
                      {uploadProgress["imageUrl"] && <p className="text-xs mt-1 text-slate-400">{uploadProgress["imageUrl"]}</p>}
                    </div>
                    {localConfig.logo.imageUrl && (
                      <div className="p-2 border border-slate-800 rounded bg-slate-950 w-28 text-center">
                        <span className="text-[9px] text-slate-500 font-bold block mb-1">Preview</span>
                        <img src={localConfig.logo.imageUrl} alt="Logo preview" className="h-10 mx-auto object-contain" referrerPolicy="no-referrer" />
                      </div>
                    )}
                  </div>
                )}
              </fieldset>

              {/* Theme colors palette */}
              <fieldset className="p-5 rounded-xl border border-slate-800 bg-slate-950/20 space-y-4">
                <legend className="text-xs font-extrabold uppercase px-2 text-sky-400 tracking-wider">Dynamic Color scheme</legend>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {/* Primary Color */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5 flex justify-between">
                      <span>Primary Accent (CTAs)</span>
                      <span className="font-mono">{localConfig.theme.primaryColor}</span>
                    </label>
                    <div className="flex space-x-2">
                      <input 
                        type="color"
                        value={localConfig.theme.primaryColor}
                        onChange={(e) => updateConfigField("theme", "primaryColor", e.target.value)}
                        className="h-10 w-10 bg-transparent rounded border cursor-pointer"
                      />
                      <input 
                        type="text"
                        value={localConfig.theme.primaryColor}
                        onChange={(e) => updateConfigField("theme", "primaryColor", e.target.value)}
                        className="flex-1 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs font-mono"
                      />
                    </div>
                  </div>

                  {/* Secondary Color */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5 flex justify-between">
                      <span>Secondary Background</span>
                      <span className="font-mono">{localConfig.theme.secondaryColor}</span>
                    </label>
                    <div className="flex space-x-2">
                      <input 
                        type="color"
                        value={localConfig.theme.secondaryColor}
                        onChange={(e) => updateConfigField("theme", "secondaryColor", e.target.value)}
                        className="h-10 w-10 bg-transparent rounded border cursor-pointer"
                      />
                      <input 
                        type="text"
                        value={localConfig.theme.secondaryColor}
                        onChange={(e) => updateConfigField("theme", "secondaryColor", e.target.value)}
                        className="flex-1 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs font-mono"
                      />
                    </div>
                  </div>

                  {/* Micro Accent Color */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5 flex justify-between">
                      <span>Interactive Accents</span>
                      <span className="font-mono">{localConfig.theme.accentColor}</span>
                    </label>
                    <div className="flex space-x-2">
                      <input 
                        type="color"
                        value={localConfig.theme.accentColor}
                        onChange={(e) => updateConfigField("theme", "accentColor", e.target.value)}
                        className="h-10 w-10 bg-transparent rounded border cursor-pointer"
                      />
                      <input 
                        type="text"
                        value={localConfig.theme.accentColor}
                        onChange={(e) => updateConfigField("theme", "accentColor", e.target.value)}
                        className="flex-1 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs font-mono"
                      />
                    </div>
                  </div>

                  {/* Body Background Color */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5 flex justify-between">
                      <span>Body Canvas color</span>
                      <span className="font-mono">{localConfig.theme.backgroundColor}</span>
                    </label>
                    <div className="flex space-x-2">
                      <input 
                        type="color"
                        value={localConfig.theme.backgroundColor}
                        onChange={(e) => updateConfigField("theme", "backgroundColor", e.target.value)}
                        className="h-10 w-10 bg-transparent rounded border cursor-pointer"
                      />
                      <input 
                        type="text"
                        value={localConfig.theme.backgroundColor}
                        onChange={(e) => updateConfigField("theme", "backgroundColor", e.target.value)}
                        className="flex-1 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs font-mono"
                      />
                    </div>
                  </div>

                  {/* Body Text Color */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5 flex justify-between">
                      <span>Typography Text color</span>
                      <span className="font-mono">{localConfig.theme.textColor}</span>
                    </label>
                    <div className="flex space-x-2">
                      <input 
                        type="color"
                        value={localConfig.theme.textColor}
                        onChange={(e) => updateConfigField("theme", "textColor", e.target.value)}
                        className="h-10 w-10 bg-transparent rounded border cursor-pointer"
                      />
                      <input 
                        type="text"
                        value={localConfig.theme.textColor}
                        onChange={(e) => updateConfigField("theme", "textColor", e.target.value)}
                        className="flex-1 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              </fieldset>

              {/* Fonts and Typography Settings */}
              <fieldset className="p-5 rounded-xl border border-slate-800 bg-slate-950/20 space-y-4">
                <legend className="text-xs font-extrabold uppercase px-2 text-sky-400 tracking-wider">Typography & Layout Patterns</legend>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {/* Font Display Headings */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Display headings Font</label>
                    <select
                      value={localConfig.theme.fontDisplay}
                      onChange={(e) => updateConfigField("theme", "fontDisplay", e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-sm text-white"
                    >
                      <option value="Space Grotesk">Space Grotesk (Tech-modern)</option>
                      <option value="Inter">Inter (Sleek generic)</option>
                      <option value="Outfit">Outfit (Product soft-facing)</option>
                      <option value="Playfair Display">Playfair Display (Serif-classic)</option>
                      <option value="JetBrains Mono">JetBrains Mono (Console)</option>
                    </select>
                  </div>

                  {/* Font Body Sans */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Body Text Font</label>
                    <select
                      value={localConfig.theme.fontSans}
                      onChange={(e) => updateConfigField("theme", "fontSans", e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-sm text-white"
                    >
                      <option value="Inter">Inter (Perfect reading density)</option>
                      <option value="Space Grotesk">Space Grotesk</option>
                      <option value="Outfit">Outfit</option>
                      <option value="JetBrains Mono">JetBrains Mono</option>
                    </select>
                  </div>

                  {/* Background graphic pattern overlay */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Backdrop Abstract Overlay</label>
                    <select
                      value={localConfig.theme.bgPattern}
                      onChange={(e) => updateConfigField("theme", "bgPattern", e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-sm text-white"
                    >
                      <option value="grid">Tactical Grid Overlay</option>
                      <option value="dots">Subtle Dot Matrix</option>
                      <option value="none">Pristine flat background</option>
                    </select>
                  </div>
                </div>
              </fieldset>

              {/* Navigation Menu Link Editors */}
              <fieldset className="p-5 rounded-xl border border-slate-800 bg-slate-950/20 space-y-4">
                <legend className="text-xs font-extrabold uppercase px-2 text-sky-400 tracking-wider">Dynamic navigation menu links</legend>
                <div className="space-y-3">
                  {localConfig.navItems.map((item, index) => (
                    <div key={item.id} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-center">
                      <span className="text-[11px] font-mono font-bold text-slate-500">Navigation Button {index + 1}</span>
                      <input 
                        type="text"
                        placeholder="Label value"
                        value={item.label}
                        onChange={(e) => updateNavItem(item.id, "label", e.target.value)}
                        className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-white"
                      />
                      <input 
                        type="text"
                        placeholder="Target Anchor target"
                        value={item.url}
                        onChange={(e) => updateNavItem(item.id, "url", e.target.value)}
                        className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-white"
                      />
                    </div>
                  ))}
                </div>
              </fieldset>
            </div>
          )}

          {/* TAB 2: HERO & ABOUT SECTION EDITORS */}
          {activeTab === "hero_about" && (
            <div className="space-y-8 animate-fadeIn">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-xl font-bold font-display flex items-center gap-2">
                  <LucideIcons.LayoutTemplate className="text-sky-500" />
                  <span>Poster & Section Content Editors</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">Configure titles, description paragraphs, and background graphics.</p>
              </div>

              {/* HERO SEGMENT */}
              <fieldset className="p-5 rounded-xl border border-slate-800 bg-slate-950/20 space-y-4">
                <legend className="text-xs font-extrabold uppercase px-2 text-sky-400 tracking-wider">Hero banner copy & action links</legend>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Central Hero Heading</label>
                    <input 
                      type="text"
                      value={localConfig.hero.title}
                      onChange={(e) => updateConfigField("hero", "title", e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Hero Subtitle Text (Description)</label>
                    <textarea 
                      rows={2}
                      value={localConfig.hero.subtitle}
                      onChange={(e) => updateConfigField("hero", "subtitle", e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-sm text-white resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Primary Button Label and Link */}
                    <div className="p-3 border rounded border-slate-800 bg-slate-950/50 grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Primary Button label</label>
                        <input 
                          type="text"
                          value={localConfig.hero.primaryCtaText}
                          onChange={(e) => updateConfigField("hero", "primaryCtaText", e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Button link path</label>
                        <input 
                          type="text"
                          value={localConfig.hero.primaryCtaUrl}
                          onChange={(e) => updateConfigField("hero", "primaryCtaUrl", e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-white"
                        />
                      </div>
                    </div>

                    {/* Secondary Button Label and Link */}
                    <div className="p-3 border rounded border-slate-800 bg-slate-950/50 grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Secondary Button label</label>
                        <input 
                          type="text"
                          value={localConfig.hero.secondaryCtaText}
                          onChange={(e) => updateConfigField("hero", "secondaryCtaText", e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Button link path</label>
                        <input 
                          type="text"
                          value={localConfig.hero.secondaryCtaUrl}
                          onChange={(e) => updateConfigField("hero", "secondaryCtaUrl", e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">Upload Hero Banner Right-Graphic</label>
                      <input 
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, "hero", "bgImageUrl")}
                        className="text-xs cursor-pointer p-2 bg-slate-950 rounded w-full border border-slate-800"
                      />
                      {uploadProgress["bgImageUrl"] && <p className="text-xs mt-1 text-slate-400">{uploadProgress["bgImageUrl"]}</p>}
                    </div>

                    {localConfig.hero.bgImageUrl && (
                      <div className="p-2 border border-slate-800 rounded bg-slate-950 flex space-x-2 items-center">
                        <img src={localConfig.hero.bgImageUrl} alt="Hero banner item" className="h-14 w-20 object-cover rounded" referrerPolicy="no-referrer" />
                        <span className="text-[10px] text-slate-400">Successfully loaded graphic</span>
                      </div>
                    )}
                  </div>
                </div>
              </fieldset>

              {/* ABOUT SECTION DATA CONFIG */}
              <fieldset className="p-5 rounded-xl border border-slate-800 bg-slate-950/20 space-y-4">
                <legend className="text-xs font-extrabold uppercase px-2 text-sky-400 tracking-wider">About section biography & checklist</legend>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">About Section Title</label>
                      <input 
                        type="text"
                        value={localConfig.about.title}
                        onChange={(e) => updateConfigField("about", "title", e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">About Section Subtitle Tagline</label>
                      <input 
                        type="text"
                        value={localConfig.about.subtitle}
                        onChange={(e) => updateConfigField("about", "subtitle", e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-sm text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Core Description Text</label>
                    <textarea 
                      rows={4}
                      value={localConfig.about.description}
                      onChange={(e) => updateConfigField("about", "description", e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-sm text-white"
                    />
                  </div>

                  {/* Bullet points modify */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wide">Dynamic bullet highlights checklist</label>
                    <div className="space-y-2">
                      {localConfig.about.points.map((point, index) => (
                        <div key={index} className="flex space-x-2 items-center">
                          <span className="text-xs font-mono font-bold text-sky-500">#{index+1}</span>
                          <input 
                            type="text"
                            value={point}
                            onChange={(e) => {
                              const pointsCopy = [...localConfig.about.points];
                              pointsCopy[index] = e.target.value;
                              updateConfigField("about", "points", pointsCopy);
                            }}
                            className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-white"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">About Showcase Graphic Image</label>
                      <input 
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, "about", "image")}
                        className="text-xs cursor-pointer p-2 bg-slate-950 rounded w-full border border-slate-800"
                      />
                      {uploadProgress["image"] && <p className="text-xs mt-1 text-slate-400">{uploadProgress["image"]}</p>}
                    </div>

                    {localConfig.about.image && (
                      <div className="p-2 border border-slate-800 rounded bg-slate-950 flex space-x-2 items-center">
                        <img src={localConfig.about.image} alt="About section image" className="h-14 w-20 object-cover rounded" referrerPolicy="no-referrer" />
                        <span className="text-[10px] text-slate-400 font-mono">Image load confirmed</span>
                      </div>
                    )}
                  </div>
                </div>
              </fieldset>
            </div>
          )}

          {/* TAB 3: PROGRAMS CATALOG CRUD */}
          {activeTab === "courses" && (
            <div className="space-y-8 animate-fadeIn">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-xl font-bold font-display flex items-center gap-2">
                  <LucideIcons.BookOpen className="text-sky-500" />
                  <span>Programs Catalog & Course Modules</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">Formulate, update, or remove training programs on the front-end catalog card carousel.</p>
              </div>

              {/* Course form editor panel */}
              <fieldset className="p-5 rounded-2xl border border-sky-900 bg-sky-950/10 space-y-4">
                <legend className="text-xs font-extrabold uppercase px-3 text-sky-400 tracking-widest bg-slate-900 border border-sky-800 py-0.5 rounded-full">
                  {courseEditMode ? "Edit course configuration" : "Publish new course schedule"}
                </legend>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Name */}
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-400 mb-1">Course Program Title *</label>
                    <input 
                      type="text"
                      placeholder="e.g. Graphic Designing Mastery with Canva"
                      value={courseForm.name}
                      onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-white"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Topic Category</label>
                    <input 
                      type="text"
                      placeholder="e.g. Design, Tech, Soft Skills"
                      value={courseForm.category}
                      onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-white"
                    />
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Syllabus Duration</label>
                    <input 
                      type="text"
                      placeholder="e.g. 3 Months"
                      value={courseForm.duration}
                      onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-white"
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Coaching Fee *</label>
                    <input 
                      type="text"
                      placeholder="e.g. ₹6,500"
                      value={courseForm.price}
                      onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-white"
                    />
                  </div>

                  {/* Iconic graphics */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Visual Symbol (Icon)</label>
                    <select
                      value={courseForm.iconName}
                      onChange={(e) => setCourseForm({ ...courseForm, iconName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-xs text-white bg-slate-900"
                    >
                      {availableIcons.map((i) => (
                        <option key={i} value={i}>{i}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Prospectus / Curriculum description</label>
                  <textarea 
                    rows={3}
                    placeholder="Short summary detailing syllabus highlights..."
                    value={courseForm.description}
                    onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-xs text-white"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                  {courseEditMode && (
                    <button
                      type="button"
                      onClick={() => {
                        setCourseForm({ id: "", name: "", description: "", category: "", duration: "", price: "", iconName: "Code" });
                        setCourseEditMode(false);
                      }}
                      className="px-3 py-1.5 rounded bg-slate-800 text-xs text-slate-300"
                    >
                      Cancel edit
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleSaveCourse}
                    className="px-4 py-1.5 rounded bg-sky-600 text-white font-semibold text-xs transition hover:bg-sky-700"
                  >
                    {courseEditMode ? "Apply Updates" : "Publish Program"}
                  </button>
                </div>
              </fieldset>

              {/* Existing course cards dashboard reviews listing */}
              <div className="space-y-4">
                <h3 className="text-sm font-extrabold uppercase text-slate-400">Current Program Catalog Schedules ({localConfig.courses.length})</h3>
                <div className="space-y-2">
                  {localConfig.courses.map((course) => (
                    <div 
                      key={course.id}
                      className="p-4 border border-slate-800 bg-slate-950/20 rounded-xl flex items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded uppercase">{course.category}</span>
                          <span className="text-xs font-mono font-bold text-sky-500">{course.price}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white mt-1">{course.name}</h4>
                        <p className="text-xs text-slate-500 mt-0.5 font-sans leading-relaxed line-clamp-1">{course.description}</p>
                      </div>

                      <div className="flex-shrink-0 flex items-center space-x-1.5">
                        <button
                          onClick={() => handleEditCourse(course)}
                          className="p-1.5 rounded hover:bg-sky-950 text-sky-400 transition"
                          title="Edit Details"
                        >
                          <LucideIcons.Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course.id)}
                          className="p-1.5 rounded hover:bg-red-950 text-red-400 transition"
                          title="Delete Program"
                        >
                          <LucideIcons.Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: STATISTICS NODES */}
          {activeTab === "stats" && (
            <div className="space-y-8 animate-fadeIn">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-xl font-bold font-display flex items-center gap-2">
                  <LucideIcons.TrendingUp className="text-sky-500" />
                  <span>Academy statistics & Key Metrics</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">Configure live counts, placement milestones, or certified students lists.</p>
              </div>

              {/* stat metric editor block */}
              <fieldset className="p-4 rounded-xl border border-slate-800 bg-slate-950/10 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Metric Number Count ID *</label>
                  <input 
                    type="text"
                    placeholder="e.g. 1500+"
                    value={statForm.count}
                    onChange={(e) => setStatForm({ ...statForm, count: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Descriptive Label *</label>
                  <input 
                    type="text"
                    placeholder="e.g. Certified Students"
                    value={statForm.label}
                    onChange={(e) => setStatForm({ ...statForm, label: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-white"
                  />
                </div>
                <div>
                  <button
                    type="button"
                    onClick={handleSaveStat}
                    className="w-full py-2 rounded bg-sky-600 text-white font-bold text-xs"
                  >
                    {statEditMode ? "Update Metric" : "Add/Save Metric"}
                  </button>
                </div>
              </fieldset>

              {/* listings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {localConfig.stats.map((stat) => (
                  <div key={stat.id} className="p-4 rounded-lg border border-slate-800 bg-slate-950/30 flex justify-between items-center">
                    <div>
                      <span className="text-lg font-bold text-sky-400">{stat.count}</span>
                      <p className="text-xs text-slate-400 font-medium">{stat.label}</p>
                    </div>
                    <div className="flex space-x-1">
                      <button 
                        onClick={() => { setStatForm(stat); setStatEditMode(true); }}
                        className="p-1 rounded text-sky-400 hover:bg-slate-800"
                      >
                        <LucideIcons.Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button 
                        onClick={() => {
                          if(confirm("Delete stat?")) {
                            setLocalConfig(p => ({ ...p, stats: p.stats.filter(s => s.id !== stat.id) }));
                          }
                        }}
                        className="p-1 rounded text-red-400 hover:bg-slate-800"
                      >
                        <LucideIcons.Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: TESTIMONIAL SUITES */}
          {activeTab === "reviews" && (
            <div className="space-y-8 animate-fadeIn">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-xl font-bold font-display flex items-center gap-2">
                  <LucideIcons.MessageSquare className="text-sky-500" />
                  <span>Student Success Stories & Testimonials</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">Review feedback, rating scores, and student post-graduation records.</p>
              </div>

              {/* Review creator form */}
              <fieldset className="p-5 rounded-2xl border border-slate-800 bg-slate-950/10 space-y-4">
                <legend className="text-xs font-bold uppercase px-2 text-sky-400 tracking-wider">Publish / Edit review</legend>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Student / Reviewer Name *</label>
                    <input 
                      type="text"
                      placeholder="Aniket Das"
                      value={reviewForm.name}
                      onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Outcome Role / Title</label>
                    <input 
                      type="text"
                      placeholder="Placed at TATA as Tally Associate"
                      value={reviewForm.role}
                      onChange={(e) => setReviewForm({ ...reviewForm, role: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Star rating limit (1-5)</label>
                    <input 
                      type="number"
                      min={1}
                      max={5}
                      value={reviewForm.rating}
                      onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Review testimonial feedback</label>
                  <textarea 
                    rows={2}
                    placeholder="Short quote detailing course experience..."
                    value={reviewForm.text}
                    onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-white"
                  />
                </div>

                <div className="flex justify-end pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={handleSaveReview}
                    className="px-4 py-1.5 rounded bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs"
                  >
                    Save Story
                  </button>
                </div>
              </fieldset>

              {/* listings */}
              <div className="space-y-4">
                {localConfig.testimonials.map((t) => (
                  <div key={t.id} className="p-4 rounded-xl border border-slate-800 bg-slate-950/20 flex gap-4 justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-white">{t.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">({t.role})</span>
                      </div>
                      <p className="text-xs text-slate-400 italic mt-1 leading-relaxed">"{t.text}"</p>
                      <div className="flex mt-1.5 space-x-1">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <LucideIcons.Star key={i} className="h-3 w-3 text-amber-500 fill-amber-500" />
                        ))}
                      </div>
                    </div>
                    <div className="flex space-x-1 flex-shrink-0">
                      <button 
                        onClick={() => { setReviewForm(t); setReviewEditMode(true); }}
                        className="p-1 rounded text-sky-400 hover:bg-slate-800"
                      >
                        <LucideIcons.Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button 
                        onClick={() => {
                          if(confirm("Confirm action?")) {
                            setLocalConfig(p => ({ ...p, testimonials: p.testimonials.filter(x => x.id !== t.id) }));
                          }
                        }}
                        className="p-1 rounded text-red-400 hover:bg-slate-800"
                      >
                        <LucideIcons.Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: REGISTRATION INBOX MESSAGES */}
          {activeTab === "inbox" && (
            <div className="space-y-8 animate-fadeIn">
              <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold font-display flex items-center gap-2">
                    <LucideIcons.Inbox className="text-sky-500" />
                    <span>Inquiry Inbox Registration Log</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">Real-time student batch inquiries submitted via the Contact coordinates form on the live application.</p>
                </div>

                {inquiries.length > 0 && (
                  <button
                    onClick={() => {
                      if(confirm("Reset entire Inbox message buffer? This cannot be undone.")) {
                        onClearInquiries();
                      }
                    }}
                    className="px-3 py-1 rounded border border-dashed border-red-800 text-red-400 hover:bg-red-950 hover:text-white font-bold text-[10px] uppercase transition cursor-pointer"
                  >
                    Clear Inbox Log
                  </button>
                )}
              </div>

              {inquiries.length > 0 ? (
                <div className="space-y-4">
                  {inquiries.map((inq) => (
                    <div 
                      key={inq.id}
                      className="p-6 border rounded-2xl bg-slate-950/40 border-slate-800 space-y-4 shadow"
                    >
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-800/60 pb-3 gap-2">
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-slate-500 font-bold block">{inq.date}</span>
                          <h3 className="text-sm font-extrabold text-[#14b8a6]">{inq.name}</h3>
                        </div>
                        <span className="text-xs font-bold text-white bg-sky-950 px-2.5 py-1 rounded-full border border-sky-800/40 text-center">
                          Program: {inq.course}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                        <div className="flex items-center space-x-2">
                          <LucideIcons.Mail className="h-3.5 w-3.5 text-blue-400" />
                          <a href={`mailto:${inq.email}`} className="text-slate-300 hover:underline">{inq.email}</a>
                        </div>
                        <div className="flex items-center space-x-2">
                          <LucideIcons.Phone className="h-3.5 w-3.5 text-green-400" />
                          <a href={`tel:${inq.phone}`} className="text-slate-300 hover:underline">{inq.phone}</a>
                        </div>
                      </div>

                      {inq.message && (
                        <div className="p-3 bg-slate-950/60 border border-slate-800/40 rounded-xl text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-line">
                          {inq.message}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 border border-dashed border-slate-800 rounded-3xl">
                  <LucideIcons.Inbox className="h-10 w-10 text-slate-600 mx-auto mb-2" />
                  <h3 className="text-sm font-bold text-slate-400">Inquiry Log is Clear</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    When prospective students write queries on the live contact form, their registrations will populate here in real-time.
                  </p>
                </div>
              )}
            </div>
          )}

        </section>
      </main>
    </div>
  );
}
export { AdminPanel };
