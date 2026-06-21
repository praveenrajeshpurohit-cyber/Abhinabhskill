import React from "react";
import { PortalConfig } from "../types";

interface StatsProps {
  config: PortalConfig;
}

export default function Stats({ config }: StatsProps) {
  const { stats, theme } = config;

  if (!stats || stats.length === 0) return null;

  return (
    <section 
      className="py-16 md:py-20"
      style={{ 
        backgroundColor: theme.secondaryColor || `${theme.primaryColor}0D`,
        borderColor: `${theme.textColor}10`
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl border p-8 md:p-12" style={{ borderColor: `${theme.textColor}0F` }}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 divide-y-2 divide-gray-100 lg:divide-y-0 lg:divide-x-2">
            {stats.map((stat, index) => (
              <div 
                key={stat.id} 
                className={`text-center space-y-2 ${index > 1 ? 'pt-8 lg:pt-0' : 'pt-0'} ${index % 2 === 1 ? 'border-none lg:border-solid' : ''} ${index > 0 ? 'lg:pl-6' : ''}`}
                style={{ borderLeftColor: `${theme.textColor}0D` }}
              >
                <div 
                  className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight"
                  style={{ 
                    fontFamily: theme.fontDisplay, 
                    color: theme.primaryColor 
                  }}
                >
                  {stat.count}
                </div>
                <p 
                  className="text-xs sm:text-sm font-semibold uppercase tracking-wider"
                  style={{ 
                    color: theme.textMutedColor,
                    fontFamily: theme.fontSans
                  }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
