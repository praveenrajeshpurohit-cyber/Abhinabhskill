import React, { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from "lucide-react";
import { PortalConfig } from "../types";

interface ContactProps {
  config: PortalConfig;
  onSubmitInquiry: (name: string, email: string, phone: string, course: string, msg: string) => void;
}

export default function Contact({ config, onSubmitInquiry }: ContactProps) {
  const { contact, courses, theme } = config;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    course: courses[0]?.name || "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Please fill in all required fields.");
      return;
    }
    onSubmitInquiry(formData.name, formData.email, formData.phone, formData.course, formData.message);
    setSubmitted(true);
    setFormData({
      name: "",
      email: "",
      phone: "",
      course: courses[0]?.name || "",
      message: ""
    });
    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  return (
    <section 
      id="contact" 
      className="py-20"
      style={{ backgroundColor: theme.secondaryColor || `${theme.primaryColor}05` }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div 
            className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
            style={{ color: theme.primaryColor, backgroundColor: `${theme.primaryColor}10` }}
          >
            <Mail className="h-3.5 w-3.5" />
            <span>Support Coordinates</span>
          </div>
          <h2 
            className="text-3xl sm:text-4xl font-extrabold tracking-tight"
            style={{ fontFamily: theme.fontDisplay, color: theme.textColor }}
          >
            {contact.title || "Contact Our Placement Coordinator"}
          </h2>
          <p 
            className="text-base"
            style={{ color: theme.textMutedColor, fontFamily: theme.fontSans }}
          >
            Have questions about fees, training dates, or career counseling? Send us a message or visit our campus. We are here to help!
          </p>
        </div>

        {/* Action Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left Panel: Contact info */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8 bg-white p-8 md:p-10 rounded-3xl border shadow-lg"
            style={{ borderColor: `${theme.textColor}10` }}
          >
            <div className="space-y-6">
              <h3 className="text-lg font-bold" style={{ color: theme.textColor, fontFamily: theme.fontDisplay }}>
                Campus Office
              </h3>
              
              <div className="space-y-5">
                {/* Address */}
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-xl bg-blue-50 text-blue-600 flex-shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 capitalize">Campus address</h4>
                    <p className="text-sm mt-0.5 text-gray-700 leading-relaxed" style={{ fontFamily: theme.fontSans }}>
                      {contact.address}
                    </p>
                  </div>
                </div>

                {/* Telephone */}
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-xl bg-green-50 text-green-600 flex-shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 capitalize">Contact numbers</h4>
                    <p className="text-sm mt-0.5 font-bold text-gray-800" style={{ fontFamily: theme.fontSans }}>
                      {contact.phone}
                    </p>
                  </div>
                </div>

                {/* Mail Box */}
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-xl bg-purple-50 text-purple-600 flex-shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 capitalize">Inquiry email</h4>
                    <p className="text-sm mt-0.5 font-medium text-gray-700 hover:underline" style={{ fontFamily: theme.fontSans }}>
                      <a href={`mailto:${contact.email}`}>{contact.email}</a>
                    </p>
                  </div>
                </div>

                {/* Office Clock timings */}
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-xl bg-amber-50 text-amber-600 flex-shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 capitalize">Operating hours</h4>
                    <p className="text-sm mt-0.5 text-gray-600" style={{ fontFamily: theme.fontSans }}>
                      {contact.timing}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated Live Google Maps Embed / Visual Card */}
            <div className="rounded-xl overflow-hidden border aspect-[2/1] relative bg-slate-900 flex items-center justify-center p-4">
              <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=600')] opacity-40 bg-cover bg-center" />
              <div className="relative z-10 text-center space-y-1 bg-white/95 backdrop-blur p-4 rounded-xl shadow border border-white/20">
                <MapPin className="h-6 w-6 text-red-500 mx-auto animate-bounce" />
                <h4 className="text-xs font-bold text-gray-800">Abhinabh Central Building</h4>
                <p className="text-[10px] text-gray-500">Royal Landmark Complex, Patna, India</p>
              </div>
            </div>
          </div>

          {/* Right Panel: Interactive Inquiry registration form */}
          <div className="lg:col-span-7 bg-white p-8 md:p-10 rounded-3xl border shadow-lg flex flex-col justify-between"
            style={{ borderColor: `${theme.textColor}10` }}
          >
            <div>
              <h3 className="text-lg font-bold mb-6" style={{ color: theme.textColor, fontFamily: theme.fontDisplay }}>
                Write an Inquiry Message
              </h3>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-green-50 border border-green-200 text-center space-y-3 my-auto">
                  <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto" />
                  <h4 className="text-base font-bold text-green-800">Inquiry Sent Successfully</h4>
                  <p className="text-xs text-green-600 max-w-sm mx-auto">
                    Thank you! Your coaching registration is recorded. Our program coordinator will call you back in 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 text-sm border rounded-lg focus:ring-1 outline-none"
                        style={{ borderColor: `${theme.textColor}26`, fontFamily: theme.fontSans }}
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 99999 99999"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2 text-sm border rounded-lg focus:ring-1 outline-none"
                        style={{ borderColor: `${theme.textColor}26`, fontFamily: theme.fontSans }}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 text-sm border rounded-lg focus:ring-1 outline-none"
                      style={{ borderColor: `${theme.textColor}26`, fontFamily: theme.fontSans }}
                    />
                  </div>

                  {/* Target course select */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Select Program of Interest</label>
                    <select
                      value={formData.course}
                      onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm border rounded-lg bg-white outline-none"
                      style={{ borderColor: `${theme.textColor}26`, fontFamily: theme.fontSans }}
                    >
                      {courses.map((course) => (
                        <option key={course.id} value={course.name}>
                          {course.name} ({course.category})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message body */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Your queries (Optional)</label>
                    <textarea
                      rows={4}
                      placeholder="Hi, I would like to know if there is an upcoming weekend batch starting this calendar month..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-2 text-sm border rounded-lg focus:ring-1 outline-none"
                      style={{ borderColor: `${theme.textColor}26`, fontFamily: theme.fontSans }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center space-x-2 py-3 px-4 text-sm font-bold text-white rounded-lg shadow cursor-pointer hover:opacity-90 active:scale-95 transition"
                    style={{ backgroundColor: theme.primaryColor, fontFamily: theme.fontSans }}
                  >
                    <span>Submit Inquiry Form</span>
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
export { Contact };
