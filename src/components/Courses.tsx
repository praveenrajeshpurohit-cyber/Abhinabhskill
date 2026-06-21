import React, { useState } from "react";
import * as LucideIcons from "lucide-react";
import { PortalConfig, CourseConfig } from "../types";

interface CoursesProps {
  config: PortalConfig;
  onInquire: (courseName: string) => void;
}

export default function Courses({ config, onInquire }: CoursesProps) {
  const { courses, theme } = config;
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeCourseModal, setActiveCourseModal] = useState<CourseConfig | null>(null);

  // Dynamic Icon Renderer
  const renderLucideIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    if (IconComponent) {
      return <IconComponent className="h-6 w-6" />;
    }
    // Fallback icon
    return <LucideIcons.GraduationCap className="h-6 w-6" />;
  };

  // Get distinct categories
  const categories = ["All", ...Array.from(new Set(courses.map(c => c.category)))].filter(Boolean);

  // Filter courses
  const filteredCourses = courses.filter((course) => {
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section 
      id="courses" 
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
            <LucideIcons.BookOpen className="h-3.5 w-3.5" />
            <span>Curriculum Showcase</span>
          </div>
          <h2 
            className="text-3xl sm:text-4xl font-extrabold tracking-tight"
            style={{ fontFamily: theme.fontDisplay, color: theme.textColor }}
          >
            Professional Job-Placement Courses
          </h2>
          <p 
            className="text-base"
            style={{ color: theme.textMutedColor, fontFamily: theme.fontSans }}
          >
            Enhance your career readiness with our highly specialized curriculum designed by experienced practitioners who know what companies look for.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b" style={{ borderColor: `${theme.textColor}10` }}>
          {/* Categories select tabs */}
          <div className="flex flex-wrap gap-2 order-last md:order-first">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg border cursor-pointer select-none transition-all duration-150"
                style={{
                  backgroundColor: selectedCategory === category ? theme.primaryColor : "transparent",
                  color: selectedCategory === category ? "#ffffff" : theme.textColor,
                  borderColor: selectedCategory === category ? theme.primaryColor : `${theme.textColor}1C`,
                  fontFamily: theme.fontSans
                }}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Inline search bar */}
          <div className="relative w-full md:max-w-xs">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <LucideIcons.Search className="h-4 w-4" style={{ color: theme.textMutedColor }} />
            </span>
            <input
              type="text"
              placeholder="Search training modules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm transition outline-none"
              style={{
                borderColor: `${theme.textColor}26`,
                color: theme.textColor,
                fontFamily: theme.fontSans
              }}
            />
          </div>
        </div>

        {/* Courses Cards Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <article 
                key={course.id}
                className="group rounded-2xl border p-6 flex flex-col justify-between hover:shadow-xl transition-all duration-200"
                style={{ 
                  backgroundColor: theme.cardColor, 
                  borderColor: `${theme.textColor}12`
                }}
              >
                <div>
                  {/* Category and Icon */}
                  <div className="flex justify-between items-center mb-5">
                    <span 
                      className="text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"
                      style={{ 
                        color: theme.primaryColor, 
                        backgroundColor: `${theme.primaryColor}0E` 
                      }}
                    >
                      {course.category}
                    </span>
                    <div 
                      className="p-2.5 rounded-xl text-white group-hover:scale-110 transition duration-200"
                      style={{ backgroundColor: theme.primaryColor }}
                    >
                      {renderLucideIcon(course.iconName)}
                    </div>
                  </div>

                  {/* Course Name */}
                  <h3 
                    className="text-xl font-bold mb-2 group-hover:text-blue-600 transition"
                    style={{ fontFamily: theme.fontDisplay, color: theme.textColor }}
                  >
                    {course.name}
                  </h3>

                  {/* Course Description */}
                  <p 
                    className="text-sm line-clamp-3 mb-6 leading-relaxed"
                    style={{ color: theme.textMutedColor, fontFamily: theme.fontSans }}
                  >
                    {course.description}
                  </p>
                </div>

                {/* Course Details Footer Panel */}
                <div className="pt-4 border-t border-dashed space-y-4" style={{ borderColor: `${theme.textColor}1A` }}>
                  <div className="flex justify-between text-xs">
                    <span className="flex items-center space-x-1" style={{ color: theme.textMutedColor }}>
                      <LucideIcons.Clock className="h-3.5 w-3.5" />
                      <span>{course.duration}</span>
                    </span>
                    <span className="font-bold flex items-center space-x-1" style={{ color: theme.accentColor }}>
                      <LucideIcons.Tag className="h-3.5 w-3.5" />
                      <span>{course.price}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setActiveCourseModal(course)}
                      className="w-full text-center py-2.5 rounded-lg border text-xs font-bold hover:bg-opacity-5 transition cursor-pointer"
                      style={{ 
                        borderColor: `${theme.textColor}33`, 
                        color: theme.textColor,
                        fontFamily: theme.fontSans 
                      }}
                    >
                      Syllabus
                    </button>
                    <button
                      onClick={() => onInquire(course.name)}
                      className="w-full text-center py-2.5 rounded-lg text-xs font-bold text-white shadow-sm hover:opacity-90 active:scale-95 transition cursor-pointer"
                      style={{ 
                        backgroundColor: theme.primaryColor,
                        fontFamily: theme.fontSans 
                      }}
                    >
                      Inquire
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border rounded-2xl border-dashed" style={{ borderColor: `${theme.textColor}1F` }}>
            <LucideIcons.Compass className="h-10 w-10 mx-auto text-gray-400 mb-2 animate-bounce" />
            <h3 className="text-sm font-bold text-gray-900">No training modules match search</h3>
            <p className="text-xs text-gray-500 mt-1">Try resetting the category filter or searching different terms.</p>
          </div>
        )}

      </div>

      {/* Dynamic Detail Modal */}
      {activeCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div 
            className="w-full max-w-lg rounded-2xl border shadow-2xl p-6 relative overflow-hidden"
            style={{ backgroundColor: theme.cardColor, borderColor: `${theme.textColor}26` }}
          >
            <button
              onClick={() => setActiveCourseModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 transition cursor-pointer"
            >
              <LucideIcons.X className="h-5 w-5" style={{ color: theme.textColor }} />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div 
                className="p-3 rounded-xl text-white"
                style={{ backgroundColor: theme.primaryColor }}
              >
                {renderLucideIcon(activeCourseModal.iconName)}
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.primaryColor }}>
                  {activeCourseModal.category}
                </span>
                <h3 className="text-xl font-extrabold" style={{ fontFamily: theme.fontDisplay, color: theme.textColor }}>
                  {activeCourseModal.name}
                </h3>
              </div>
            </div>

            <div className="space-y-4 my-6 text-sm overflow-y-auto max-h-[300px] pr-2">
              <div>
                <h4 className="font-bold mb-1" style={{ color: theme.textColor }}>Program Description</h4>
                <p style={{ color: theme.textMutedColor }}>{activeCourseModal.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 p-3 rounded-lg bg-gray-50 border">
                <div>
                  <h5 className="text-xs font-bold text-gray-400 capitalize">Syllabus duration</h5>
                  <p className="text-sm font-bold text-gray-800 flex items-center gap-1.5 mt-0.5">
                    <LucideIcons.Clock className="h-4 w-4 text-blue-500" />
                    <span>{activeCourseModal.duration}</span>
                  </p>
                </div>
                <div>
                  <h5 className="text-xs font-bold text-gray-400 capitalize">Special coaching fee</h5>
                  <p className="text-sm font-extrabold text-[#14b8a6] flex items-center gap-1.5 mt-0.5">
                    <LucideIcons.Coins className="h-4 w-4" />
                    <span>{activeCourseModal.price}</span>
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-bold mb-2" style={{ color: theme.textColor }}>Core Learnings & Modules</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2.5">
                    <LucideIcons.CheckSquare className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
                    <span>Live lab practice exercises and case implementations</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <LucideIcons.CheckSquare className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
                    <span>Structured theoretical foundation with industry benchmarks</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <LucideIcons.CheckSquare className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
                    <span>Project assignment reviews guided by certified coordinators</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <LucideIcons.CheckSquare className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
                    <span>Completing certification examination & interview mock-up</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 border-t">
              <button
                onClick={() => setActiveCourseModal(null)}
                className="w-full py-2.5 text-center text-sm font-bold border rounded-lg hover:bg-gray-50 cursor-pointer"
                style={{ color: theme.textColor }}
              >
                Close
              </button>
              <button
                onClick={() => {
                  const name = activeCourseModal.name;
                  setActiveCourseModal(null);
                  onInquire(name);
                }}
                className="w-full py-2.5 text-center text-sm font-bold text-white rounded-lg shadow cursor-pointer hover:opacity-90 transition"
                style={{ backgroundColor: theme.primaryColor }}
              >
                Apply Admission
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
