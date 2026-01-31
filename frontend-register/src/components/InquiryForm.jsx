import React, { useState, useEffect, useRef } from 'react';
import { 
    ArrowLeft, User, Globe, Phone, Mail, 
    ShieldCheck, Check, ArrowRight, Edit3 
} from 'lucide-react';
// Ensure this path is correct for your project structure
import universityData from '../assets/world_universities_and_domains.json'; 

// --- 🛠️ CONSOLIDATED JAIPUR REGISTRY (Merged List) ---
const JAIPUR_EXTENSIONS = [
  { name: "Vivekananda Global University (VGU), Jaipur" },
  { name: "Malaviya National Institute of Technology (MNIT), Jaipur" },
  { name: "JECRC University, Jaipur" },
  { name: "JECRC Foundation (JECRC College), Jaipur" },
  { name: "Swami Keshvanand Institute of Technology (SKIT), Jaipur" },
  { name: "Manipal University Jaipur (MUJ)" },
  { name: "Poornima University, Jaipur" },
  { name: "Poornima College of Engineering, Jaipur" },
  { name: "Rajasthan University (RU), Jaipur" },
  { name: "The LNM Institute of Information Technology (LNMIIT), Jaipur" },
  { name: "Jaipur National University (JNU)" },
  { name: "Amity University, Jaipur" },
  { name: "JK Lakshmipat University (JKLU), Jaipur" },
  { name: "Arya College of Engineering and IT (ACEIT), Jaipur" },
  { name: "Arya Institute of Engineering Technology & Management, Jaipur" },
  { name: "Jaipur Institute of Engineering and Technology (JIET), Jaipur" },
  { name: "Rajasthan College of Engineering for Women (RCEW), Jaipur" },
  { name: "Apex Institute of Engineering and Technology, Jaipur" },
  { name: "S.S. Jain Subodh P.G. College, Jaipur" },
  { name: "S.S. Jain Subodh Mahila Mahavidyalaya, Rambagh" },
  { name: "St. Wilfred’s College for Girls, Jaipur" },
  { name: "Kanoria PG Mahila Mahavidyalaya, Jaipur" },
  { name: "Lal Bahadur Shastri PG College, Jaipur" },
  { name: "St. Xavier's College, Jaipur" },
  { name: "Biyani Girls College, Jaipur" },
  { name: "Poddar International College, Jaipur" },
  { name: "Deepshikha College of Technical Education, Jaipur" },
  { name: "SMS Medical College, Jaipur" },
  { name: "Mahatma Gandhi Medical College & Hospital, Jaipur" }
];

// --- 🛠️ CONSOLIDATED ACRONYM MAP ---
const ACRONYMS = {
  "VGU": "Vivekananda Global University (VGU), Jaipur",
  "MNIT": "Malaviya National Institute of Technology (MNIT), Jaipur",
  "SKIT": "Swami Keshvanand Institute of Technology (SKIT), Jaipur",
  "JECRC": "JECRC University, Jaipur",
  "MUJ": "Manipal University Jaipur (MUJ)",
  "RU": "University of Rajasthan (RU), Jaipur",
  "PCE": "Poornima College of Engineering, Jaipur",
  "PIET": "Poornima Institute of Engineering & Technology, Jaipur",
  "GIT": "Global Institute of Technology (GIT), Jaipur",
  "RIET": "Rajasthan Institute of Engineering and Technology (RIET), Jaipur",
  "AIET": "Arya Institute of Engineering & Technology, Jaipur",
  "UFYLC": "University Five Year Law College (UFYLC), Jaipur",
  "SMS": "SMS Medical College, Jaipur",
  "RUHS": "Rajasthan University of Health Sciences, Jaipur"
};

const InquiryForm = ({ inquiryData, setInquiryData, onSubmit, onBack, loading }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isOther, setIsOther] = useState(false);
  const dropdownRef = useRef(null);

  // --- SEARCH LOGIC WITH DEBOUNCE ---
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // Check if user is searching
      if (searchTerm.length > 1 && searchTerm !== inquiryData.collegeName) {
        const query = searchTerm.toUpperCase();
        
        // 1. Match Acronyms
        const acronymMatches = Object.keys(ACRONYMS)
          .filter(key => key.includes(query))
          .map(key => ({ name: ACRONYMS[key] }));

        // 2. Match local Jaipur list
        const localMatches = JAIPUR_EXTENSIONS.filter(u => 
          u.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // 3. Match global JSON
        const globalMatches = universityData.filter(u => 
          u.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !localMatches.some(lm => lm.name === u.name)
        ).slice(0, 10);

        // Combine all results
        const allMatches = [...acronymMatches, ...localMatches, ...globalMatches];
        
        // Remove duplicates if any
        const uniqueMatches = Array.from(new Set(allMatches.map(a => a.name)))
          .map(name => ({ name }));

        setSuggestions(uniqueMatches);
        setShowDropdown(true);
      } else {
        setShowDropdown(false);
      }
    }, 200);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, inquiryData.collegeName]);

  const handleSelect = (name) => {
    if (name === "OTHER") {
      setIsOther(true);
      setInquiryData(prev => ({ ...prev, collegeName: "OTHER" }));
      setSearchTerm("");
    } else {
      setIsOther(false);
      setInquiryData(prev => ({ ...prev, collegeName: name, manualCollege: '' }));
      setSearchTerm(name);
    }
    setShowDropdown(false);
  };

  const handleInputChange = (name, value) => {
    setInquiryData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-full max-w-xl mt-24 mx-auto space-y-4 select-none animate-in fade-in duration-700">
       
      {/* NAVIGATION */}
      <div className="flex items-center justify-between mb-8 px-2">
        <button type="button" onClick={onBack} className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-colors">
          <ArrowLeft size={12} /> Return
        </button>
        <div className="flex items-center gap-3">
          <span className=" text-[8px] font-bold uppercase tracking-[0.3em] text-gray-700">Registry // Local_Cache</span>
          <div className="h-1 w-1 rounded-full bg-pink-500 shadow-[0_0_8px_#ec4899]" />
        </div>
      </div>

      <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-[3rem] p-8 md:p-14 relative shadow-2xl overflow-visible">
        <header className="mb-12">
          <h2 className="text-5xl font-black uppercase italic tracking-tighter text-white leading-none">
            Request <span className="text-pink-500">Access</span>
          </h2>
        </header>

        <form onSubmit={onSubmit} className="space-y-7">
          <div className="grid grid-cols-1 gap-6">
            
            <RegistryField icon={User} label="Person Name" placeholder="Full Name" name="name" value={inquiryData.name} onChange={handleInputChange} />
            
            {/* SEARCHABLE COLLEGE INPUT */}
            <div className="relative group/field z-50" ref={dropdownRef}>
              <div className="flex items-center justify-between mb-2.5 px-1">
                <div className="flex items-center gap-2">
                    <Globe size={12} className={inquiryData.collegeName && !isOther ? 'text-green-500' : 'text-pink-500/40'} />
                    <label className="text-[12px] font-bold uppercase tracking-[0.2em] text-gray-500">Institute Name</label>
                </div>
                {inquiryData.collegeName && !isOther && (
                    <span className="text-[7px] font-black text-green-500 uppercase tracking-widest flex items-center gap-1 animate-in fade-in">
                        <Check size={8} /> Verified_Entry
                    </span>
                )}
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Jaipur or Global Colleges..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setIsOther(false); 
                    if (inquiryData.collegeName) handleInputChange('collegeName', '');
                  }}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                  // Added 'pr-10' to prevent text overlapping with verification icon
                  className={`w-full bg-white/[0.02] border p-4 pr-10 rounded-xl text-[12px] font-semibold tracking-wide text-white outline-none transition-all placeholder:text-gray-800 
                    ${inquiryData.collegeName && !isOther ? 'border-green-500/20' : 'border-white/5 focus:border-pink-500/30'}`}
                />
                
                {/* FIXED DROPDOWN UI:
                   1. Added 'max-h-[250px]' to limit height
                   2. Added 'overflow-y-auto' for scrolling
                   3. Added 'scrollbar-hide' (optional) or standard scrolling
                */}
                {showDropdown && (
                  <div className="absolute top-full left-0 w-full mt-2 bg-[#0F0F0F] border border-white/10 rounded-2xl z-[100] shadow-2xl max-h-[250px] overflow-y-auto custom-scrollbar">
                    {suggestions.map((univ, i) => (
                      <div
                        key={i}
                        onMouseDown={() => handleSelect(univ.name)}
                        className="w-full px-5 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:bg-pink-500 hover:text-white border-b border-white/5 last:border-0 flex items-center justify-between cursor-pointer group transition-colors duration-150"
                      >
                        <span className="truncate pr-4">{univ.name}</span>
                        <ArrowRight size={12} className="opacity-20 group-hover:opacity-100" />
                      </div>
                    ))}
                    <div
                      onMouseDown={() => handleSelect("OTHER")}
                      className="w-full px-5 py-4 text-left text-[10px] font-black uppercase tracking-widest text-pink-500 bg-pink-500/5 hover:bg-pink-500 hover:text-white cursor-pointer flex items-center justify-between sticky bottom-0 backdrop-blur-md"
                    >
                      <span>Institution Not Listed</span>
                      <Edit3 size={12} />
                    </div>
                  </div>
                )}
              </div>

              {/* MANUAL INPUT (Shown only if OTHER is selected) */}
              {isOther && (
                <div className="mt-4 animate-in slide-in-from-top-2 duration-300">
                    <label className="text-[7px] font-bold uppercase tracking-[0.2em] text-pink-500 mb-2 block px-1">Manual Institution Entry</label>
                    <input 
                        type="text"
                        placeholder="Type full college name here..."
                        value={inquiryData.manualCollege || ""}
                        onChange={(e) => handleInputChange('manualCollege', e.target.value.toUpperCase())}
                        required
                        className="w-full bg-white/[0.02] border border-pink-500/30 p-4 rounded-xl text-[12px] font-semibold text-white outline-none focus:border-pink-500"
                    />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <RegistryField icon={Phone} label="Phone No." placeholder="+91 9881342..." name="phone" value={inquiryData.phone} onChange={handleInputChange} />
              <RegistryField icon={Mail} label="Email Id." placeholder="Email Address" name="email" type="email" value={inquiryData.email} onChange={handleInputChange} />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading || !inquiryData.collegeName || (isOther && !inquiryData.manualCollege)} 
            className="w-full bg-white text-black py-5 mt-4 rounded-2xl font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-pink-500 hover:text-white transition-all shadow-xl disabled:opacity-20 disabled:grayscale"
          >
            {loading ? "Transmitting..." : "Confirm Registry Request"}
          </button>
        </form>
      </div>
    </div>
  );
};

// Helper component outside to prevent focus bugs
const RegistryField = ({ icon: Icon, label, placeholder, name, value, onChange, type = "text" }) => (
  <div className="relative group/field">
    <div className="flex items-center gap-2 mb-2.5 px-1">
      <Icon size={12} className="text-pink-500/40 group-focus-within/field:text-pink-500 transition-colors" />
      <label className="text-[12px] font-bold uppercase tracking-[0.2em] text-gray-500">{label}</label>
    </div>
    <input
      type={type} placeholder={placeholder} value={value || ''}
      onChange={e => onChange(name, e.target.value)} required
      className="w-full bg-white/[0.02] border border-white/5 p-4 rounded-xl text-[14px] font-semibold tracking-wide text-white outline-none focus:border-pink-500/30 transition-all placeholder:text-gray-800"
    />
  </div>
);

export default InquiryForm;