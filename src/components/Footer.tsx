import React from "react";
import { Facebook, Twitter, Instagram, Linkedin, GraduationCap } from "lucide-react";
import { PortalConfig } from "../types";

interface FooterProps {
  config: PortalConfig;
}

export default function Footer({ config }: FooterProps) {
  const { footer, theme, logo } = config;

  return (
    <footer 
      className="py-12 border-t"
      style={{ 
        backgroundColor: theme.backgroundColor, 
        borderColor: `${theme.textColor}10` 
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          
          {/* Logo element */}
          <div className="text-center md:text-left space-y-2">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <span 
                className="text-lg font-bold tracking-tight"
                style={{ 
                  fontFamily: theme.fontDisplay,
                  color: theme.primaryColor 
                }}
              >
                {logo.text || "Abhinabh Skill"}
              </span>
            </div>
            <p className="text-xs" style={{ color: theme.textMutedColor, fontFamily: theme.fontSans }}>
              Bridging the gap between theory and industry placement.
            </p>
          </div>

          {/* Copyright content */}
          <div className="text-center text-xs" style={{ color: theme.textMutedColor, fontFamily: theme.fontSans }}>
            {footer.copyright || "© 2026 Abhinabh Skill. All Rights Reserved."}
          </div>

          {/* Social connections links */}
          <div className="flex justify-center md:justify-end space-x-4">
            {footer.facebook && (
              <a 
                href={footer.facebook} 
                target="_blank" 
                rel="noreferrer" 
                className="p-2 rounded-full border hover:scale-110 transition"
                style={{ borderColor: `${theme.textColor}1A`, color: theme.textMutedColor }}
              >
                <Facebook className="h-4.5 w-4.5" />
              </a>
            )}
            {footer.twitter && (
              <a 
                href={footer.twitter} 
                target="_blank" 
                rel="noreferrer" 
                className="p-2 rounded-full border hover:scale-110 transition"
                style={{ borderColor: `${theme.textColor}1A`, color: theme.textMutedColor }}
              >
                <Twitter className="h-4.5 w-4.5" />
              </a>
            )}
            {footer.instagram && (
              <a 
                href={footer.instagram} 
                target="_blank" 
                rel="noreferrer" 
                className="p-2 rounded-full border hover:scale-110 transition"
                style={{ borderColor: `${theme.textColor}1A`, color: theme.textMutedColor }}
              >
                <Instagram className="h-4.5 w-4.5" />
              </a>
            )}
            {footer.linkedin && (
              <a 
                href={footer.linkedin} 
                target="_blank" 
                rel="noreferrer" 
                className="p-2 rounded-full border hover:scale-110 transition"
                style={{ borderColor: `${theme.textColor}1A`, color: theme.textMutedColor }}
              >
                <Linkedin className="h-4.5 w-4.5" />
              </a>
            )}
          </div>

        </div>
      </div>
    </footer>
  );
}
