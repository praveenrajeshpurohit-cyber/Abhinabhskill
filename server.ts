import express from "express";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

// For ES modules path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Maximum request body size to handle base64 image uploads comfortably
app.use(express.json({ limit: "20mb" }));

// DB and Upload Paths
const DB_PATH = path.join(process.cwd(), "data", "server_db.json");
const UPLOAD_DIR = path.join(process.cwd(), "uploads");

// Standard Auth Token
const ADMIN_TOKEN = "abhinabh_secret_admin_token_2026";
const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASS = process.env.ADMIN_PASS || "admin123";

// Ensure data folder and uploads folder exist
async function initFolders() {
  try {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  } catch (err) {
    console.error("Error creating system folders:", err);
  }
}

// Default layout configurations
const defaultPortalConfig = {
  theme: {
    primaryColor: "#0284c7",
    secondaryColor: "#f0fbfd",
    accentColor: "#14b8a6",
    backgroundColor: "#ffffff",
    cardColor: "#ffffff",
    textColor: "#0f172a",
    textMutedColor: "#64748b",
    fontSans: "Inter",
    fontDisplay: "Space Grotesk",
    bgPattern: "grid"
  },
  logo: {
    type: "text",
    text: "Abhinabh Skill Development",
    imageUrl: ""
  },
  hero: {
    title: "Empower Your Path to Success",
    subtitle: "Discover vocational excellence, technical skill mastery, and placement-driven careers. We train you for top certifications and real-world employment.",
    bgImageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1600",
    primaryCtaText: "Explore Courses",
    primaryCtaUrl: "#courses",
    secondaryCtaText: "Get Free Consultation",
    secondaryCtaUrl: "#contact"
  },
  about: {
    title: "Welcome to Abhinabh Skill Development",
    subtitle: "The Ultimate Destination for Practical Skill Acquisition and Professional Growth.",
    description: "At Abhinabh Skill Development, we are committed to bridging the gap between classroom education and industry demands. Registered as a premier Skill Training development program, we deliver practical coding courses, accounting mastery, technical expertise, and career coaching to lift aspirations and unlock real employment prospects.",
    image: "https://images.unsplash.com/photo-1531535934027-667f6dbb28c1?auto=format&fit=crop&q=80&w=1000",
    points: [
      "Industry Certified Trainers with years of sector experience",
      "Comprehensive Placement Support & mock interview drills",
      "Affordable specialized fees and flexible weekday/weekend batches",
      "Hands-on labs, real projects, and modern terminal environments"
    ]
  },
  courses: [
    {
      id: "1",
      name: "Full-Stack Web Development",
      description: "Build modern responsive web applications using React, Express, Node.js, and databases. Learn semantic coding, APIs, and micro-animations.",
      category: "Tech & IT",
      duration: "4 Months",
      price: "₹12,499",
      iconName: "Code"
    },
    {
      id: "2",
      name: "Tally Prime & Financial Accounting",
      description: "Master banking transactions, ledger balance sheet management, GST calculations, and comprehensive financial reports using modern Tally Prime.",
      category: "Finance",
      duration: "3 Months",
      price: "₹6,999",
      iconName: "Calculator"
    },
    {
      id: "3",
      name: "Digital Marketing & Brand Building",
      description: "Drive organic leads and custom ad strategies. Deep-dive into Search Engine Optimization (SEO), Paid Social, conversion tracking, and canvas graphics.",
      category: "Marketing",
      duration: "2.5 Months",
      price: "₹7,499",
      iconName: "Megaphone"
    },
    {
      id: "4",
      name: "Vocational English & Soft Skills",
      description: "Overcome stage fright, polish workplace communication, presentation styles, and body language to crush corporate interviews.",
      category: "Soft Skills",
      duration: "1.5 Months",
      price: "₹4,500",
      iconName: "MessageSquare"
    }
  ],
  stats: [
    { id: "1", count: "1500+", label: "Students Certified" },
    { id: "2", count: "94%", label: "Placement Success" },
    { id: "3", count: "12+", label: "Specialized Courses" },
    { id: "4", count: "15+", "label": "Industry Partners" }
  ],
  testimonials: [
    { id: "1", name: "Rajesh Kumar", role: "Junior Frontend Engineer", text: "The full-stack training here completely changed my trajectory. I gained the specific practical coding experience companies actively look for, and standard interview prep was stellar.", rating: 5 },
    { id: "2", name: "Kumod Sen", role: "Finance Associate", text: "The Tally Prime curriculum covers GST inside out. Our instructor led us through real commercial journals, which landed me my first accounting agency role.", rating: 5 },
    { id: "3", name: "Ananya Sharma", role: "Social Media Coordinator", text: "I loved the flexible batch schedules and the hands-on project design. I had a full portfolio of client ad creatives and SEO campaigns before even graduating!", rating: 4 }
  ],
  contact: {
    title: "Connect with Our Placement Coordinator",
    address: "2nd Floor, Royal Landmark, B.P. Marg, Landmark Block, Opp. Circle Tower, Patna, BH-800001, India",
    phone: "+91 98765 43210",
    email: "coordinator@abhinabhskill.com",
    timing: "Monday - Saturday: 9:00 AM - 7:00 PM"
  },
  navItems: [
    { id: "home", label: "Home", url: "#home" },
    { id: "about", label: "About Us", url: "#about" },
    { id: "courses", label: "Courses", url: "#courses" },
    { id: "reviews", label: "Student Success", url: "#reviews" },
    { id: "contact", label: "Contact Us", url: "#contact" }
  ],
  footer: {
    copyright: "© 2026 Abhinabh Skill Development. All Rights Reserved.",
    facebook: "https://facebook.com/abhinabhskill",
    twitter: "https://twitter.com/abhinabhskill",
    instagram: "https://instagram.com/abhinabhskill",
    linkedin: "https://linkedin.com/company/abhinabhskill"
  }
};

// Read database
async function getDbConfig() {
  try {
    const data = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    // If not exists, save and return default config
    await fs.writeFile(DB_PATH, JSON.stringify(defaultPortalConfig, null, 2), "utf-8");
    return defaultPortalConfig;
  }
}

// Write database
async function writeDbConfig(config: any) {
  await fs.writeFile(DB_PATH, JSON.stringify(config, null, 2), "utf-8");
}

// Admin Token Authentication check
const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${ADMIN_TOKEN}`) {
    res.status(401).json({ error: "Unauthorized access to admin APIs" });
    return;
  }
  next();
};

async function startServer() {
  await initFolders();

  // Express static serving of local uploads directory
  app.use("/uploads", express.static(UPLOAD_DIR));

  // AUTH API
  app.post("/api/auth/login", (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      res.json({ token: ADMIN_TOKEN, user: { username: ADMIN_USER } });
    } else {
      res.status(400).json({ error: "Invalid admin username or password" });
    }
  });

  // GET PORTAL CONFIG
  app.get("/api/config", async (req, res) => {
    try {
      const config = await getDbConfig();
      res.json(config);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // UPDATE PORTAL CONFIG (Protected)
  app.post("/api/config", requireAdmin, async (req, res) => {
    try {
      const newConfig = req.body;
      await writeDbConfig(newConfig);
      res.json({ success: true, message: "Portal configurations updated successfully" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // FILE UPLOAD API (Protected, receives base64 string and writes file)
  app.post("/api/upload", requireAdmin, async (req, res) => {
    try {
      const { filename, base64Data } = req.body;
      if (!filename || !base64Data) {
        res.status(400).json({ error: "Missing filename or base64Data content" });
        return;
      }

      // Check format
      const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        res.status(400).json({ error: "Invalid base64 image data payload" });
        return;
      }

      const mimeType = matches[1];
      const dataBuffer = Buffer.from(matches[2], "base64");

      // Simple file validation
      const allowedMimeTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/svg+xml"];
      if (!allowedMimeTypes.includes(mimeType)) {
        res.status(400).json({ error: "File pattern not allowed. Select PNG, JPEG, GIF or SVG." });
        return;
      }

      const cleanFilename = Date.now() + "_" + filename.replace(/[^a-zA-Z0-9.\-_]/g, "");
      const writeFilePath = path.join(UPLOAD_DIR, cleanFilename);

      await fs.writeFile(writeFilePath, dataBuffer);

      // Return fully qualified local URL pathway
      res.json({ url: `/uploads/${cleanFilename}` });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Integration with Vite
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite development middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving static production assets from dist/...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Abhinabh Skill Development Portal running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
