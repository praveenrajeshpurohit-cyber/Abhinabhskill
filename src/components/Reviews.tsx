import React from "react";
import { Star, Quote, GraduationCap } from "lucide-react";
import { PortalConfig } from "../types";

interface ReviewsProps {
  config: PortalConfig;
}

export default function Reviews({ config }: ReviewsProps) {
  const { testimonials, theme } = config;

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section 
      id="reviews" 
      className="py-20"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div 
            className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
            style={{ color: theme.primaryColor, backgroundColor: `${theme.primaryColor}10` }}
          >
            <GraduationCap className="h-3.5 w-3.5" />
            <span>Success Stories</span>
          </div>
          <h2 
            className="text-3xl sm:text-4xl font-extrabold tracking-tight"
            style={{ fontFamily: theme.fontDisplay, color: theme.textColor }}
          >
            What Our Certified Alumni Say
          </h2>
          <p 
            className="text-base"
            style={{ color: theme.textMutedColor, fontFamily: theme.fontSans }}
          >
            Hear directly from graduates who transitioned into tech, finance, design, and retail careers after completing their specialized coaching modules.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((review) => (
            <article 
              key={review.id}
              className="p-8 rounded-2xl border flex flex-col justify-between hover:-translate-y-1 hover:shadow-lg transition duration-200 relative"
              style={{ 
                backgroundColor: theme.cardColor, 
                borderColor: `${theme.textColor}10`
              }}
            >
              {/* Decorative Quote Icon */}
              <Quote className="absolute top-6 right-8 h-8 w-8 opacity-5" style={{ color: theme.primaryColor }} />

              <div className="space-y-4">
                {/* Rating stars */}
                <div className="flex space-x-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className="h-4.5 w-4.5"
                      fill={index < review.rating ? "#f59e0b" : "none"}
                      stroke={index < review.rating ? "#f59e0b" : "#cbd5e1"}
                    />
                  ))}
                </div>

                {/* Testimonial text */}
                <p 
                  className="text-sm leading-relaxed italic"
                  style={{ color: theme.textColor, fontFamily: theme.fontSans }}
                >
                  "{review.text}"
                </p>
              </div>

              {/* Student Metadata */}
              <div className="mt-8 flex items-center space-x-3 pt-4 border-t border-dashed" style={{ borderColor: `${theme.textColor}12` }}>
                <div 
                  className="h-10 w-10 flex-shrink-0 rounded-full flex items-center justify-center font-bold text-sm"
                  style={{ 
                    backgroundColor: `${theme.primaryColor}15`, 
                    color: theme.primaryColor,
                    fontFamily: theme.fontDisplay
                  }}
                >
                  {review.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900" style={{ color: theme.textColor, fontFamily: theme.fontDisplay }}>
                    {review.name}
                  </h4>
                  <p className="text-xs text-gray-500" style={{ color: theme.textMutedColor, fontFamily: theme.fontSans }}>
                    {review.role}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
