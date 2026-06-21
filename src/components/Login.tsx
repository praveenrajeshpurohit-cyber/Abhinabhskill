import React, { useState } from "react";
import { ShieldCheck, Eye, EyeOff, Lock, User, ArrowLeft } from "lucide-react";
import { PortalConfig } from "../types";

interface LoginProps {
  config: PortalConfig;
  onLogin: (token: string) => void;
  onCancel: () => void;
}

export default function Login({ config, onLogin, onCancel }: LoginProps) {
  const { theme } = config;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMsg("Please fill in all credential fields.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      setIsLoading(false);

      if (response.ok && data.token) {
        onLogin(data.token);
      } else {
        setErrorMsg(data.error || "Invalid username or password.");
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMsg("Network error connecting to Express server auth module.");
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      {/* Background visual orb decoration */}
      <div 
        className="absolute w-96 h-96 rounded-full blur-[100px] opacity-10 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${theme.primaryColor} 0%, transparent 70%)`
        }}
      />

      <div 
        className="w-full max-w-md rounded-2xl border p-8 shadow-2xl relative z-10"
        style={{ backgroundColor: theme.cardColor, borderColor: `${theme.textColor}1A` }}
      >
        {/* Cancel back trigger */}
        <button
          onClick={onCancel}
          className="absolute top-6 left-6 inline-flex items-center space-x-1 text-xs font-semibold cursor-pointer py-1 px-2 rounded hover:bg-gray-100 transition"
          style={{ color: theme.textMutedColor, fontFamily: theme.fontSans }}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Exit Gate</span>
        </button>

        <div className="text-center space-y-2 mt-8 mb-6">
          <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-sm">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold font-display" style={{ color: theme.textColor, fontFamily: theme.fontDisplay }}>
            Central Administration Access
          </h2>
          <p className="text-xs text-gray-500" style={{ color: theme.textMutedColor, fontFamily: theme.fontSans }}>
            Authorized coordinators only. Configure theme, courses and visuals.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg border border-red-200 bg-red-50 text-red-600 text-xs font-semibold text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Input */}
          <div className="relative">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Coordinator ID</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <User className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder="Manager username (e.g. admin)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border rounded-lg focus:ring-1 outline-none"
                style={{ borderColor: `${theme.textColor}26`, color: theme.textColor, fontFamily: theme.fontSans }}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="relative">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Secret Access Key</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-10 py-2 text-sm border rounded-lg focus:ring-1 outline-none"
                style={{ borderColor: `${theme.textColor}26`, color: theme.textColor, fontFamily: theme.fontSans }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 text-sm font-bold text-white rounded-lg shadow cursor-pointer transition flex items-center justify-center space-x-2"
            style={{ 
              backgroundColor: theme.primaryColor,
              opacity: isLoading ? 0.7 : 1,
              fontFamily: theme.fontSans
            }}
          >
            <span>{isLoading ? "Validating security..." : "Unlock Dashboard"}</span>
          </button>
        </form>

      </div>
    </div>
  );
}
