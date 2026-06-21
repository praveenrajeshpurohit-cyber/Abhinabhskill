import React from "react";
import { CheckCircle } from "lucide-react";
import { PortalConfig } from "../types";

interface AboutProps {
  config: PortalConfig;
}

export default function About({ config }: AboutProps) {
  const { about, theme } = config;

  return (
    <section 
      id="about" 
      className="py-20 overflow-hidden"
      style={{ backgroundColor: theme.secondaryColor || `${theme.primaryColor}05` }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Block: Image frame with accents */}
          <div className="relative order-last lg:order-first">
            <div 
              className="absolute -top-4 -left-4 w-24 h-24 rounded-tl-3xl opacity-30 border-t-4 border-l-4"
              style={{ borderColor: theme.primaryColor }}
            />
            
            <div 
              className="absolute -bottom-4 -right-4 w-24 h-24 rounded-br-3xl opacity-30 border-b-4 border-r-4"
              style={{ borderColor: theme.accentColor }}
            />

            <div className="relative rounded-2xl overflow-hidden shadow-xl border"
              style={{ borderColor: `${theme.textColor}10` }}
            >
              <img 
                src={about.image || "https://images.unsplash.com/photo-1531535934027-667f6dbb28c1?auto=format&fit=crop&q=80&w=1000"} 
                alt="Direct Learning Classroom" 
                className="w-full h-[380px] sm:h-[450px] object-cover hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Right Block: Content area */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 
                className="text-xs uppercase tracking-widest font-extrabold"
                style={{ color: theme.primaryColor, fontFamily: theme.fontSans }}
              >
                Our Legacy & Mission
              </h3>
              <h2 
                className="text-3xl sm:text-4xl font-extrabold tracking-tight"
                style={{ fontFamily: theme.fontDisplay, color: theme.textColor }}
              >
                {about.title || "About Abhinabh Skill"}
              </h2>
              {about.subtitle && (
                <p 
                  className="text-sm font-semibold tracking-wide italic"
                  style={{ color: theme.accentColor, fontFamily: theme.fontSans }}
                >
                  {about.subtitle}
                </p>
              )}
            </div>

            <div className="prose max-w-none">
              <p 
                className="text-base leading-relaxed whitespace-pre-line"
                style={{ color: theme.textMutedColor, fontFamily: theme.fontSans }}
              >
                {about.description || "Training next-generation professionals."}
              </p>
            </div>

            {/* List of strength bullets */}
            {about.points && about.points.length > 0 && (
              <div className="pt-4 border-t border-dashed" style={{ borderColor: `${theme.textColor}1A` }}>
                <h4 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: theme.textColor, fontFamily: theme.fontDisplay }}>
                  Why Students Choose Us:
                </h4>
                <ul className="space-y-3.5">
                  {about.points.map((point, index) => (
                    <li key={index} className="flex items-start space-x-3 text-sm">
                      <span className="flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-4.5 w-4.5" style={{ color: theme.primaryColor }} />
                      </span>
                      <span style={{ color: theme.textColor, fontFamily: theme.fontSans }}>
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
