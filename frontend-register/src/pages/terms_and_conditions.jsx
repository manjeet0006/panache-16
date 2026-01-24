import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    ShieldAlert, FileText, Users, Gavel, AppWindow, 
    CreditCard, MapPin, ArrowLeft, Music, Palette, 
    Trophy, Gamepad2, Info, Smartphone, Scale, 
    Zap, Mic, Camera, BookOpen, Scissors, Activity, 
    Terminal, Flag, Menu, X
} from 'lucide-react';

/**
 * PANACHE S-15: MASTER LEGAL ARCHIVE & PARTICIPANT PROTOCOL
 * DATE: 19th-22nd March 2026
 * MOTTO: Together We Perform, Together We Achieve
 * VERSION: 2.4.0 (Mobile Optimized)
 */

const TermsAndConditions = () => {
    // UI State for expanding sections
    const [activeSection, setActiveSection] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // New state for mobile nav

    const toggleSection = (section) => {
        setActiveSection(activeSection === section ? null : section);
    };

    // Scroll handler for smooth navigation
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setMobileMenuOpen(false);
        }
    };

    const sections = ['Preamble', 'Framework', 'Departments', 'Events', 'E-Sports', 'Legal', 'Contact'];

    return (
        // Added overflow-x-hidden to prevent horizontal scroll from large text
        <div className="min-h-screen bg-[#050505] text-gray-400 font-sans selection:bg-pink-500/30 selection:text-white pb-32 overflow-x-hidden">
            
            {/* --- NAVIGATION HEADER --- */}
            <div className="sticky top-0 z-50 bg-[#050505]/90 backdrop-blur-xl border-b border-white/5 px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-pink-500 transition-all group">
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
                        <span className="hidden sm:inline">Return_to_Portal</span>
                        <span className="sm:hidden">Back</span>
                    </Link>
                    
                    <div className="flex items-center gap-4">
                         {/* Mobile Menu Toggle */}
                         <button 
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 text-white bg-white/5 rounded-lg border border-white/10"
                        >
                            {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
                        </button>

                        <div className="flex items-center gap-3">
                            <span className="hidden md:inline text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 italic">Sector // Cultural_Registry</span>
                            <div className="h-1.5 w-1.5 rounded-full bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,1)] animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* --- MOBILE QUICK NAV (Dropdown) --- */}
                {mobileMenuOpen && (
                    <div className="lg:hidden absolute top-full left-0 w-full bg-[#0a0a0a] border-b border-white/10 p-4 shadow-2xl animate-in slide-in-from-top-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-pink-500 mb-3 px-2">Jump to Section</p>
                        <div className="grid grid-cols-2 gap-2">
                            {sections.map((item) => (
                                <button 
                                    key={item} 
                                    onClick={() => scrollToSection(item.toLowerCase())}
                                    className="text-left px-4 py-3 bg-white/5 rounded-lg text-xs font-bold text-gray-300 active:bg-pink-500 active:text-white"
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="max-w-7xl mx-auto px-6 pt-16 md:pt-24">
                
                {/* --- HERO HEADER --- */}
                <header className="mb-16 md:mb-24 relative border-b border-white/5 pb-12">
                    {/* Fixed: Adjusted text size and position for mobile to prevent overflow */}
                    <div className="absolute -top-12 -left-4 md:-top-16 md:-left-8 text-[80px] md:text-[140px] font-black text-white/[0.02] select-none pointer-events-none uppercase italic leading-none">
                        Protocol
                    </div>
                    <h1 className="text-5xl md:text-9xl font-black uppercase italic tracking-tighter text-white leading-none relative z-10">
                        Registry <span className="text-pink-500 underline decoration-white/10 underline-offset-8">Rules</span>
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 md:gap-6 mt-8 md:mt-10">
                        <div className="px-5 py-2 border border-pink-500/20 bg-pink-500/5 rounded-full flex items-center gap-3">
                            <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-pulse" />
                            <span className="text-[9px] md:text-[10px] font-black text-white uppercase tracking-widest">Version // S-16.2026</span>
                        </div>
                        <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] md:tracking-[0.4em] text-gray-500">
                            Operational Guidelines
                        </p>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    
                    {/* --- SIDEBAR NAVIGATION (Desktop Only) --- */}
                    <div className="hidden lg:block lg:col-span-3 sticky top-32 h-fit space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-4 pl-3">Directory</p>
                        {sections.map((item) => (
                            <button 
                                key={item} 
                                onClick={() => scrollToSection(item.toLowerCase())} 
                                className="block w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                            >
                                {item}
                            </button>
                        ))}
                    </div>

                    {/* --- MAIN CONTENT AREA --- */}
                    <div className="lg:col-span-9 space-y-20 md:space-y-32">

                        {/* 1.0 PREAMBLE */}
                        <section id="preamble" className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <SectionHeader icon={ShieldAlert} title="1.0 Preamble & Philosophy" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 text-sm leading-relaxed border-t border-white/5 pt-8 text-gray-400">
                                <p>
                                    PANACHE S-16 represents the pinnacle of cultural celebration at Vivekananda Global University. 
                                    It is a platform where students from diverse backgrounds converge to exhibit skill, passion, 
                                    and excellence. The core motto governing all interactions is <span className="text-white font-bold italic">"Together We Perform, Together We Achieve"</span>.
                                </p>
                                <p>
                                    Participation is governed by the philosophy of unity. While individual accolades are awarded, 
                                    the festival emphasizes teamwork and making meaningful connections. 
                                    Every participant is an ambassador of the theme "80'S".
                                </p>
                            </div>
                        </section>

                        {/* 2.0 PARTICIPATION FRAMEWORK */}
                        <section id="framework">
                            <SectionHeader icon={Users} title="2.0 Participation Framework" />
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <RuleCard 
                                        code="2.1" 
                                        title="Event Limitation" 
                                        desc="Participation is restricted to one event per student to ensure variety. Exceptions granted for March of Minds and Sanskritic Sangam." 
                                    />
                                    <RuleCard 
                                        code="2.2" 
                                        title="Role Exemption" 
                                        desc="Models and instrumental accompanists are exempt from the one-event restriction and may participate multiple times." 
                                    />
                                    <RuleCard 
                                        code="2.3" 
                                        title="Trophy Eligibility" 
                                        desc="Departments must participate in 42 events (including 29 mandatory) to qualify for the Overall Rolling Trophy." 
                                    />
                                </div>
                                
                                <div className="p-6 md:p-8 bg-white/[0.02] border border-white/5 rounded-3xl space-y-6">
                                    <h3 className="text-xs font-black text-pink-500 uppercase tracking-widest">Digital Compliance</h3>
                                    <ul className="space-y-4 text-xs text-gray-400">
                                        <li className="flex gap-4">
                                            <div className="h-1.5 w-1.5 mt-1.5 rounded-full bg-gray-600 shrink-0" />
                                            <span>Mandatory download of <span className="text-white font-bold">Zolo Scholar App</span> for all participants.</span>
                                        </li>
                                        <li className="flex gap-4">
                                            <div className="h-1.5 w-1.5 mt-1.5 rounded-full bg-gray-600 shrink-0" />
                                            <span>Campus entry and venue access is granted ONLY through Zolo check-in.</span>
                                        </li>
                                        <li className="flex gap-4">
                                            <div className="h-1.5 w-1.5 mt-1.5 rounded-full bg-gray-600 shrink-0" />
                                            <span>College ID cards must be physically present at all times for security verification.</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* 3.0 DEPARTMENTAL REGISTRY */}
                        <section id="departments">
                            <SectionHeader icon={Info} title="3.0 Departmental Registry" />
                            <p className="text-xs text-gray-500 mb-8 uppercase tracking-widest">Verified Team Codes & Cultural Themes</p>
                            
                            {/* Fixed: Changed overflow-hidden to overflow-x-auto for mobile scrolling */}
                            <div className="overflow-x-auto border border-white/10 rounded-3xl bg-white/[0.01]">
                                <table className="w-full text-left border-collapse min-w-[600px]">
                                    <thead>
                                        <tr className="bg-white/5 border-b border-white/5 text-[9px] font-black text-pink-500 uppercase tracking-widest">
                                            <th className="px-6 py-5">#</th>
                                            <th className="px-6 py-5">Department Node</th>
                                            <th className="px-6 py-5">Team Callsign</th>
                                            <th className="px-6 py-5">State Theme</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-xs divide-y divide-white/5">
                                        <DeptRow id="01" dept="Physics / R&D / Life Science / Math / Chem" team="Creative Titans" theme="Sikkim" />
                                        <DeptRow id="02" dept="Forensic Science" team="Mystery Masters" theme="Gujarat" />
                                        <DeptRow id="03" dept="Management Studies" team="Management Marvels" theme="Kashmir" />
                                        <DeptRow id="04" dept="Mech / Elec / Civil / VIT" team="Tech Titans" theme="Assam" />
                                        <DeptRow id="05" dept="Hotel Mgmt / Humanities / Commerce" team="The Kaleidoscope" theme="Telangana" />
                                        <DeptRow id="06" dept="Paramedical" team="The Lab Legends" theme="Bihar" />
                                        <DeptRow id="07" dept="Pharmacy" team="The Pharma-Phrenzy" theme="Kerala" />
                                        <DeptRow id="08" dept="Law" team="Legal Eagle" theme="Haryana" />
                                        <DeptRow id="09" dept="Design / Architecture / BJMC" team="CODE Zilla" theme="Odisha" />
                                        <DeptRow id="10" dept="Computer Application" team="Logics Warriors" theme="Manipur" />
                                        <DeptRow id="11" dept="Allied & Healthcare" team="Physio Brigade" theme="Himachal Pradesh" />
                                        <DeptRow id="12" dept="ABM" team="AMB Next Wave" theme="Chhattisgarh" />
                                        <DeptRow id="13" dept="Agriculture" team="OG! Ags" theme="West Bengal" />
                                        <DeptRow id="14" dept="B.Tech (1st Year)" team="Tech Phoenix" theme="Maharashtra" />
                                        <DeptRow id="15" dept="Computer Science & Engineering" team="405 Found" theme="Punjab" />
                                    </tbody>
                                </table>
                            </div>
                            <p className="lg:hidden text-[9px] text-gray-600 mt-2 text-center italic">← Swipe to view table →</p>
                        </section>

                        {/* 4.0 EVENT PROTOCOLS */}
                        <section id="events">
                            <SectionHeader icon={Trophy} title="4.0 Event Protocols & Rules" />
                            <div className="space-y-16 mt-12">
                                
                                {/* 4.1 CULTURAL & ETHNIC */}
                                <CategoryBlock title="Ethnic & Cultural" icon={Flag}>
                                    <EventDetail 
                                        title="Sanskritic Sangam (Ethnic Day)" 
                                        rules={[
                                            "Team Size: 30 Students",
                                            "Duration: 7 min performance + 1 min setup",
                                            "Content: Ethnic ramp walk & Cultural Dance of allocated state",
                                            "Requirement: Audio track submitted 1 day prior"
                                        ]} 
                                    />
                                    <EventDetail 
                                        title="March of Minds (Opening)" 
                                        rules={[
                                            "Team Size: 10 Students",
                                            "Action: Disciplined march from main gate to main stage",
                                            "Prop Rule: Creative props (helmets, blueprints) allowed",
                                            "Safety: No hazardous items"
                                        ]} 
                                    />
                                    <EventDetail 
                                        title="Khao Gali (Food Stalls)" 
                                        rules={[
                                            "Team Size: 5 (4 Students + 1 Faculty)",
                                            "Theme: Cuisine of assigned state",
                                            "Currency: Coupons of 20, 50, 100 rupees only",
                                            "Winning Criteria: Based on total sales volume, not revenue"
                                        ]} 
                                    />
                                </CategoryBlock>

                                {/* 4.2 MUSIC */}
                                <CategoryBlock title="Music & Vocals" icon={Music}>
                                    <EventDetail 
                                        title="Melody Hues (Solo)" 
                                        rules={[
                                            "Format: 1 Participant + 1 Instrumentalist",
                                            "Time: 4 min performance + 1 min setup",
                                            "Restriction: No pre-recorded backing tracks. Live only"
                                        ]} 
                                    />
                                    <EventDetail 
                                        title="Bandish Bandits (Group)" 
                                        rules={[
                                            "Team Size: 6 Members",
                                            "Time: 6 min performance + 2 min setup",
                                            "Allowance: Pre-recorded backing tracks permitted"
                                        ]} 
                                    />
                                    <EventDetail 
                                        title="The Vocal Edition (Beatbox)" 
                                        rules={[
                                            "Format: Solo",
                                            "Time: Max 3 minutes",
                                            "Strict Rule: No background music or instruments. Vocal only"
                                        ]} 
                                    />
                                    <EventDetail 
                                        title="Mehfil-e-Nagma (Qawwali)" 
                                        rules={[
                                            "Team Size: 7 Members (Gender Balanced)",
                                            "Time: 8 min performance + 2 min setup",
                                            "Live Rule: No recorded tracks allowed"
                                        ]} 
                                    />
                                </CategoryBlock>

                                {/* 4.3 DANCE */}
                                <CategoryBlock title="Choreography" icon={Activity}>
                                    <EventDetail 
                                        title="Nrityamrit (Folk/Tribal)" 
                                        rules={[
                                            "Team Size: 10 Participants",
                                            "Time: 8 min performance + 2 min setup",
                                            "Audio: Live or Recorded allowed"
                                        ]} 
                                    />
                                    <EventDetail 
                                        title="Soul Synergy (Solo)" 
                                        rules={[
                                            "Style: Classical or Semi-Classical ONLY",
                                            "Time: Max 5 minutes total",
                                            "Submission: Track submitted 1 day prior"
                                        ]} 
                                    />
                                </CategoryBlock>

                                {/* 4.4 ARTISTIC */}
                                <CategoryBlock title="Fine Arts" icon={Palette}>
                                    <EventDetail 
                                        title="Brush & Blush (Face Painting)" 
                                        rules={[
                                            "Team: 6 Members (3 Artists + 3 Models)",
                                            "Duration: 90 Minutes",
                                            "Theme: Announced on spot"
                                        ]} 
                                    />
                                    <EventDetail 
                                        title="Monochrome Marvel" 
                                        rules={[
                                            "Palette: Black & White ONLY",
                                            "Tools: Charcoal, pastel, chalk allowed",
                                            "Team: 3 Pairs (2 per pair)",
                                            "Disqualification: Use of any other color"
                                        ]} 
                                    />
                                    <EventDetail 
                                        title="Quick Brush" 
                                        rules={[
                                            "Format: Solo",
                                            "Duration: 120 Minutes",
                                            "Restriction: No mobile phones or reference images"
                                        ]} 
                                    />
                                </CategoryBlock>
                            </div>
                        </section>

                        {/* 5.0 E-SPORTS & TECH */}
                        <section id="e-sports">
                            <SectionHeader icon={Gamepad2} title="5.0 E-Sports & Technical" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                                <div className="p-8 bg-pink-500/[0.03] border border-pink-500/20 rounded-3xl">
                                    <div className="flex items-center gap-3 mb-6">
                                        <Smartphone className="text-pink-500" size={20} />
                                        <h3 className="text-lg font-black uppercase text-white">Mobile E-Sports</h3>
                                    </div>
                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-300 uppercase mb-2">BGMI / Free Fire / COD</h4>
                                            <ul className="text-xs text-gray-500 space-y-2">
                                                <li>• Squad Format (4 Players)</li>
                                                <li>• Bring Your Own Device (Mobile Only)</li>
                                                <li>• <span className="text-pink-500 font-bold">Zero Tolerance:</span> Hacks/Cheats = Ban</li>
                                                <li>• Scoring: 1st (10pts), 2nd (6pts), 3rd (5pts)</li>
                                                <li>• Kill Points: 1 Point per kill</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 bg-pink-500/[0.03] border border-pink-500/20 rounded-3xl">
                                    <div className="flex items-center gap-3 mb-6">
                                        <Zap className="text-pink-500" size={20} />
                                        <h3 className="text-lg font-black uppercase text-white">Circuit Rush</h3>
                                    </div>
                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-300 uppercase mb-2">Technical Moto Race</h4>
                                            <ul className="text-xs text-gray-500 space-y-2">
                                                <li>• Team: 4 Members</li>
                                                <li>• Task: Build RC 4-wheeler from scratch</li>
                                                <li>• <span className="text-pink-500 font-bold">Prohibited:</span> Readymade kits/vehicles</li>
                                                <li>• Control: Wireless Remote Only (No Wired)</li>
                                                <li>• Check-in: 20 mins prior for inspection</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 6.0 LEGAL & CONTACT */}
                        <section id="legal">
                            <SectionHeader icon={Scale} title="6.0 Legal & Dispute Resolution" />
                            <div className="mt-8 border-l border-white/10 pl-8 space-y-6 text-sm">
                                <p>
                                    All decisions made by the judging panel are final and binding. 
                                    In the event of a dispute, teams may approach the 
                                    <span className="text-white font-bold"> Dispute Resolution Committee</span>.
                                </p>
                                <div className="p-6 bg-white/[0.02] rounded-xl border border-white/5 inline-block">
                                    <h4 className="text-[10px] font-black uppercase text-pink-500 tracking-widest mb-2">Resolution Window</h4>
                                    <p className="text-xs text-gray-400">
                                        Daily: 4:00 PM - 5:00 PM<br/>
                                        Location: DSW Office<br/>
                                        Authority: Student Council & ADSW
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* 7.0 DIRECTORY */}
                        <section id="contact" className="pb-20">
                            <SectionHeader icon={FileText} title="7.0 Core Team Registry" />
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                                <ContactCard name="Vishal Kumar" role="Convener" phone="9661757779" />
                                <ContactCard name="Tarun Pratap Singh" role="Co-Convener" phone="7849863839" />
                                <ContactCard name="Krishna Poddar" role="Secretary" phone="8619295090" />
                                <ContactCard name="Ananya Priya" role="Co-Secretary" phone="6299838371" />
                                <ContactCard name="Chetanprakash Kaushik" role="Treasurer" phone="8488846789" />
                                <ContactCard name="Ritesh Chanda" role="Management Head" phone="8306617515" />
                                <ContactCard name="Umesh Gadhwal" role="Venue Head" phone="8529115783" />
                                <ContactCard name="Lachman Das" role="Senior Advisor" phone="8690465769" />
                                <ContactCard name="Nimmalapudi Akash" role="Discipline Head" phone="8018177287" />
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    );
};

// --- SUB-COMPONENTS ---

const SectionHeader = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-4 mb-2 pb-4 border-b border-white/5">
        <div className="p-3 bg-pink-500/10 rounded-xl text-pink-500">
            <Icon size={24} />
        </div>
        {/* Adjusted size for mobile text wrapping */}
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white leading-tight">{title}</h2>
    </div>
);

const RuleCard = ({ code, title, desc }) => (
    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-pink-500/30 transition-colors group">
        <h4 className="text-pink-500 font-black text-[10px] uppercase mb-2 group-hover:text-white transition-colors">Rule {code}</h4>
        <h3 className="text-sm font-bold text-white uppercase mb-2">{title}</h3>
        <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
    </div>
);

const DeptRow = ({ id, dept, team, theme }) => (
    <tr className="hover:bg-white/[0.02] transition-colors group">
        <td className="px-6 py-5 font-mono text-gray-600 group-hover:text-pink-500">{id}</td>
        <td className="px-6 py-5 text-gray-300 font-bold uppercase text-[10px] tracking-wide whitespace-nowrap md:whitespace-normal">{dept}</td>
        <td className="px-6 py-5 text-white font-black uppercase text-[10px] tracking-widest whitespace-nowrap">{team}</td>
        <td className="px-6 py-5 text-pink-500 font-bold uppercase text-[10px] tracking-widest">{theme}</td>
    </tr>
);

const CategoryBlock = ({ title, icon: Icon, children }) => (
    <div className="space-y-6">
        <div className="flex items-center gap-3">
            <Icon size={18} className="text-pink-500" />
            <h3 className="text-lg font-black uppercase text-white tracking-widest">{title}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {children}
        </div>
    </div>
);

const EventDetail = ({ title, rules }) => (
    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
        <h4 className="text-sm font-black text-white uppercase mb-4 border-l-2 border-pink-500 pl-3">{title}</h4>
        <ul className="space-y-2">
            {rules.map((rule, idx) => (
                <li key={idx} className="text-[10px] text-gray-400 flex items-start gap-2">
                    <span className="text-pink-500 mt-0.5 shrink-0">•</span>
                    {rule}
                </li>
            ))}
        </ul>
    </div>
);

const ContactCard = ({ name, role, phone }) => (
    <div className="group p-5 bg-white/[0.01] border border-white/5 rounded-xl hover:bg-pink-500/5 hover:border-pink-500/20 transition-all cursor-default">
        <h4 className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1 group-hover:text-pink-500">{role}</h4>
        <p className="text-xs text-white font-bold mb-2 uppercase">{name}</p>
        <div className="flex items-center gap-2 text-gray-500 group-hover:text-gray-300 transition-colors">
            <Smartphone size={10} />
            <span className="text-[10px] font-mono tracking-tighter">{phone}</span>
        </div>
    </div>
);

export default TermsAndConditions;