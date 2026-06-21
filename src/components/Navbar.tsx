import React, { useState } from "react";
import { Menu, X, ShieldCheck, LogOut, Settings } from "lucide-react";
import { PortalConfig } from "../types";

interface NavbarProps {
  config: PortalConfig;
  isAdmin: boolean;
  onLogout: () => void;
  onGoToDashboard: () => void;
  currentSection: string;
}

export default function Navbar({ config, isAdmin, onLogout, onGoToDashboard, currentSection }: NavbarProps) {
  const { logo, navItems, theme } = config;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav 
      className="sticky top-0 z-50 transition-colors duration-200 border-b border-gray-200 backdrop-blur-md"
      style={{ 
        backgroundColor: `${theme.backgroundColor}E6`, // opacity 90%
        borderColor: `${theme.textColor}1A`
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <a href="#home" className="flex items-center space-x-2">
              {logo.type === "image" && logo.imageUrl ? (
                <img 
                  src={logo.imageUrl} 
                  alt={logo.text} 
                  className="h-9 w-auto object-contain rounded"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span 
                  className="text-xl font-bold tracking-tight transition-colors"
                  style={{ 
                    fontFamily: theme.fontDisplay,
                    color: theme.primaryColor 
                  }}
                >
                  {logo.text || "Skill Portal"}
                </span>
              )}
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-1 items-center">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.url}
                className="px-3 py-2 rounded-md text-sm font-medium transition-all duration-150"
                style={{
                  color: currentSection === item.id ? theme.primaryColor : theme.textColor,
                  fontFamily: theme.fontSans,
                  backgroundColor: currentSection === item.id ? `${theme.primaryColor}0D` : "transparent"
                }}
              >
                {item.label}
              </a>
            ))}

            {/* Admin status button */}
            {isAdmin ? (
              <div className="flex items-center space-x-2 border-l pl-4 ml-2" style={{ borderColor: `${theme.textColor}1A` }}>
                <button
                  onClick={onGoToDashboard}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer shadow transition"
                >
                  <Settings className="h-3.5 w-3.5" />
                  <span>Admin Panel</span>
                </button>
                <button
                  onClick={onLogout}
                  className="p-1.5 rounded hover:bg-red-50 text-red-500 cursor-pointer transition"
                  title="Logout Administrator"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onGoToDashboard}
                className="ml-4 flex items-center space-x-1 text-xs border border-dashed rounded px-2.5 py-1.5 hover:bg-gray-50 uppercase tracking-wider font-semibold cursor-pointer transition"
                style={{ 
                  borderColor: `${theme.textColor}33`, 
                  color: theme.textMutedColor,
                  fontFamily: theme.fontSans
                }}
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Admin Login</span>
              </button>
            )}
          </div>

          {/* Mobile hamburger menu toggle */}
          <div className="flex items-center md:hidden">
            {isAdmin && (
              <button
                onClick={onGoToDashboard}
                className="mr-2 p-1.5 rounded text-blue-600 hover:bg-blue-50"
                title="Admin Panel"
              >
                <Settings className="h-5 w-5" />
              </button>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md transition focus:outline-none"
              style={{ color: theme.textColor }}
            >
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu dropdown wrapper */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden border-b block"
          style={{ 
            backgroundColor: theme.backgroundColor,
            borderColor: `${theme.textColor}1A`
          }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.url}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium transition"
                style={{
                  color: currentSection === item.id ? theme.primaryColor : theme.textColor,
                  backgroundColor: currentSection === item.id ? `${theme.primaryColor}0D` : "transparent"
                }}
              >
                {item.label}
              </a>
            ))}

            <div className="border-t py-2 mt-2 px-3" style={{ borderColor: `${theme.textColor}10` }}>
              {isAdmin ? (
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onGoToDashboard();
                    }}
                    className="flex items-center space-x-1.5 text-blue-600 font-semibold"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Admin Dashboard</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="flex items-center space-x-1.5 text-red-500 font-semibold"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onGoToDashboard();
                  }}
                  className="flex items-center space-x-1.5 text-gray-500 font-semibold"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Admin Gate Access</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
