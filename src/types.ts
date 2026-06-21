export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  cardColor: string;
  textColor: string;
  textMutedColor: string;
  fontSans: "Inter" | "Outfit" | "Space Grotesk" | "Playfair Display" | "JetBrains Mono";
  fontDisplay: "Inter" | "Outfit" | "Space Grotesk" | "Playfair Display" | "JetBrains Mono";
  bgPattern: "none" | "dots" | "grid";
}

export interface LogoConfig {
  type: "text" | "image";
  text: string;
  imageUrl: string;
}

export interface HeroConfig {
  title: string;
  subtitle: string;
  bgImageUrl: string;
  primaryCtaText: string;
  primaryCtaUrl: string;
  secondaryCtaText: string;
  secondaryCtaUrl: string;
}

export interface AboutConfig {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  points: string[];
}

export interface CourseConfig {
  id: string;
  name: string;
  description: string;
  category: string;
  duration: string;
  price: string;
  iconName: string; // lucide icon identifier
}

export interface StatConfig {
  id: string;
  count: string;
  label: string;
}

export interface TestimonialConfig {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
}

export interface ContactConfig {
  title: string;
  address: string;
  phone: string;
  email: string;
  timing: string;
}

export interface NavItem {
  id: string;
  label: string;
  url: string;
}

export interface FooterConfig {
  copyright: string;
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
}

export interface PortalConfig {
  theme: ThemeConfig;
  logo: LogoConfig;
  hero: HeroConfig;
  about: AboutConfig;
  courses: CourseConfig[];
  stats: StatConfig[];
  testimonials: TestimonialConfig[];
  contact: ContactConfig;
  navItems: NavItem[];
  footer: FooterConfig;
}
