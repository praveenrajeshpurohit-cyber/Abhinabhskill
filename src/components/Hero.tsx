import React from "react";
import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { PortalConfig } from "../types";

interface HeroProps {
  config: PortalConfig;
}

export default function Hero({ config }: HeroProps) {
  const { hero, theme } = config;

  // Grid/Lines/Dots pattern generator overlay
  const renderBackgroundPattern = () => {
    if (theme.bgPattern === "grid") {
      return (
        <div className="absolute inset-0 z-0 opacity-15 pointer-events-none" style={{
          backgroundImage: `linear-gradient(${theme.textColor}33 1px, transparent 1px), linear-gradient(90deg, ${theme.textColor}33 1px, transparent 1px)`,
          backgroundSize: "24px 24px"
        }} />
      );
    }
    if (theme.bgPattern === "dots") {
      return (
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{
          backgroundImage: `radial-gradient(${theme.textColor}40 1px, transparent 1px)`,
          backgroundSize: "16px 16px"
        }} />
      );
    }
    return null;
  };

  return (
    <header 
      id="home"
      className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-16"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      {/* Dynamic Background Pattern */}
      {renderBackgroundPattern()}

      {/* Decorative gradient glowing orb */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[40vh] rounded-full blur-[120px] opacity-10 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${theme.primaryColor} 0%, transparent 70%)`
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left: Text copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider shadow-sm"
              style={{ 
                color: theme.primaryColor,
                backgroundColor: `${theme.primaryColor}15`,
                fontFamily: theme.fontSans
              }}
            >
              <Sparkles className="h-3.5 w-3.5 animate-spin-slow" />
              <span>Vocational Career Acceleration</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight"
              style={{ 
                fontFamily: theme.fontDisplay, 
                color: theme.textColor,
                lineHeight: 1.15
              }}
            >
              {hero.title || "Empower Your Career"}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed"
              style={{ 
                color: theme.textMutedColor,
                fontFamily: theme.fontSans
              }}
            >
              {hero.subtitle || "Gain job-market expertise through targeted coaching modules."}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4"
            >
              {hero.primaryCtaText && (
                <a
                  href={hero.primaryCtaUrl || "#courses"}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 border border-transparent text-sm font-semibold rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                  style={{ 
                    backgroundColor: theme.primaryColor,
                    color: "#ffffff"
                  }}
                >
                  <span>{hero.primaryCtaText}</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              )}

              {hero.secondaryCtaText && (
                <a
                  href={hero.secondaryCtaUrl || "#contact"}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 border text-sm font-semibold rounded-lg hover:bg-opacity-5 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                  style={{ 
                    borderColor: `${theme.textColor}33`,
                    color: theme.textColor,
                    backgroundColor: `${theme.textColor}05`
                  }}
                >
                  {hero.secondaryCtaText}
                </a>
              )}
            </motion.div>
          </div>

          {/* Hero Right: Creative Graphic Picture Frame */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-5 relative flex justify-center items-center"
          >
            {/* Structural glowing frames */}
            <div 
              className="absolute inset-0 rounded-2xl scale-105 opacity-[0.06] -rotate-2 select-none pointer-events-none"
              style={{ backgroundColor: theme.primaryColor }}
            />
            
            <div className="relative w-full aspect-[4/3] sm:aspect-square lg:aspect-[4/5] rounded-xl overflow-hidden shadow-2xl border bg-gray-100 max-w-md"
              style={{ borderColor: `${theme.textColor}1A` }}
            >
              <img 
                src={hero.bgImageUrl || "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1600"} 
                alt="Representative Training Showcase"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              
              {/* Overlapping badge */}
              <div 
                className="absolute bottom-4 left-4 right-4 p-4 rounded-lg bg-white/95 backdrop-blur shadow-lg border border-white/20 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg text-white" style={{ backgroundColor: theme.primaryColor }}>
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Certified Programs</h4>
                    <p className="text-xs text-gray-500">Government Registered Academy</p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2 py-1 rounded-full text-green-700 bg-green-50">100% Valid</span>
              </div>
            </div>
          </motion.div>
          
        </div>
      </div>
    </header>
  );
}
