import React from 'react';
import { ArrowLeft, Send, User, School, Phone, Mail, Sparkles } from 'lucide-react';

const InquiryForm = ({ inquiryData, setInquiryData, onSubmit, onBack, loading }) => {
  // Helper to render aesthetic inputs
  const RenderField = ({ icon: Icon, label, placeholder, name, type = "text" }) => (
    <div className="space-y-1.5 group">
      <label className="text-[9px] font-bold uppercase text-gray-500 ml-1 tracking-widest flex items-center gap-1 group-focus-within:text-pink-500 transition-colors">
        <Icon size={10} /> {label}
      </label>
      <input
        type={type}
        className="w-full bg-black/40 border border-white/5 p-4 rounded-2xl text-sm outline-none transition-all
                   focus:border-pink-500/50 focus:bg-pink-500/5 focus:ring-4 focus:ring-pink-500/10 placeholder:text-gray-700"
        placeholder={placeholder}
        value={inquiryData[name]}
        onChange={e => setInquiryData({ ...inquiryData, [name]: e.target.value })}
        required
      />
    </div>
  );

  return (
    <div className="relative">
      {/* Decorative Glow Background */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-pink-500/10 blur-[100px] pointer-events-none" />
      
      <form 
        onSubmit={onSubmit} 
        className="relative bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
      >
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <button 
              type="button" 
              onClick={onBack} 
              className="text-gray-500 hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mb-4 transition-colors"
            >
              <ArrowLeft size={14} /> Back to Gateway
            </button>
            <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
              Request <span className="text-pink-500">Access</span>
            </h2>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-2">
              Outside Student Verification
            </p>
          </div>
          <Sparkles className="text-pink-500/20" size={32} />
        </div>

        {/* Input Section */}
        <div className="space-y-4">
          <RenderField 
            icon={User} 
            label="Full Name" 
            placeholder="Enter your name" 
            name="name" 
          />
          <RenderField 
            icon={School} 
            label="College Name" 
            placeholder="Your University" 
            name="collegeName" 
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RenderField 
              icon={Phone} 
              label="WhatsApp No" 
              placeholder="+91..." 
              name="phone" 
            />
            <RenderField 
              icon={Mail} 
              label="Email Address" 
              placeholder="name@college.com" 
              name="email" 
              type="email" 
            />
          </div>
        </div>

        {/* Info Note */}
        <div className="p-4 bg-pink-500/5 border border-pink-500/10 rounded-2xl">
          <p className="text-[10px] text-pink-400/80 leading-relaxed text-center font-medium">
            Our team will verify your details and send a unique Invite Code to your WhatsApp number within 24 hours.
          </p>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 py-5 rounded-2xl font-black uppercase italic tracking-tighter text-2xl shadow-[0_0_30px_rgba(236,72,153,0.3)] hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3 group"
        >
          {loading ? (
            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Send Request 
              <Send size={22} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default InquiryForm;