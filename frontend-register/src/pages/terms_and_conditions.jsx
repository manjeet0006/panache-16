import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
    motion,
    useScroll,
    useSpring
} from "framer-motion";
import { 
    ArrowLeft, ArrowUpRight, Music, Palette, 
    Trophy, Gamepad2, Smartphone, Scale, 
    Zap, Activity, 
    Hash, Star
} from 'lucide-react';

/* ==========================================================================
   HELPER COMPONENTS
   ========================================================================== */

const ActiveScrollReveal = ({ children, delay = 0, width = "100%", direction = "up" }) => {
    const directions = {
        up: { y: 50 },
        down: { y: -50 },
        left: { x: 50 },
        right: { x: -50 },
    };

    return (
        <motion.div
            initial={{ opacity: 0, ...directions[direction], scale: 0.95, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, ...directions[direction], scale: 0.95, filter: "blur(8px)" }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8, delay: delay, ease: [0.16, 1, 0.3, 1] }}
            style={{ width }}
        >
            {children}
        </motion.div>
    );
};

const NoiseOverlay = () => (
    <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.035] mix-blend-overlay">
        <svg className="w-full h-full">
            <filter id="noiseFilter">
                <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
    </div>
);

const PleasantCard = ({ children, className = "" }) => {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`relative p-8 rounded-3xl bg-[#080808] border border-white/5 group transition-colors duration-500 hover:border-white/15 ${className}`}
        >
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative h-full z-10">{children}</div>
        </motion.div>
    );
};

/* ==========================================================================
   NEW COMPONENT: HOLOGRAPHIC DEPARTMENT GRID
   ========================================================================== */

const DepartmentGrid = () => {
    // Data migrated from original table with added styling attributes
    const departments = [
        { id: "01", name: "Physics & R&D", callsign: "Creative Titans", theme: "Sikkim", accent: "from-blue-500 to-indigo-600" },
        { id: "02", name: "Forensic Science", callsign: "Mystery Masters", theme: "Gujarat", accent: "from-amber-500 to-orange-600" },
        { id: "03", name: "Mgmt Studies", callsign: "Mgmt Marvels", theme: "Kashmir", accent: "from-emerald-400 to-cyan-500" },
        { id: "04", name: "Engineering", callsign: "Tech Titans", theme: "Assam", accent: "from-red-500 to-rose-600" },
        { id: "05", name: "Humanities", callsign: "Kaleidoscope", theme: "Telangana", accent: "from-violet-500 to-purple-600" },
        { id: "06", name: "Paramedical", callsign: "Lab Legends", theme: "Bihar", accent: "from-lime-400 to-green-500" },
        { id: "07", name: "Pharmacy", callsign: "Pharma Phrenzy", theme: "Kerala", accent: "from-teal-400 to-emerald-600" },
        { id: "08", name: "Law", callsign: "Legal Eagle", theme: "Haryana", accent: "from-slate-400 to-slate-600" },
        { id: "09", name: "Design / Arch", callsign: "CODE Zilla", theme: "Odisha", accent: "from-pink-500 to-fuchsia-600" },
        { id: "10", name: "Computer App", callsign: "Logics Warriors", theme: "Manipur", accent: "from-cyan-400 to-blue-500" },
        { id: "11", name: "Healthcare", callsign: "Physio Brigade", theme: "Himachal", accent: "from-sky-400 to-indigo-500" },
        { id: "12", name: "ABM", callsign: "AMB Next Wave", theme: "Chhattisgarh", accent: "from-orange-400 to-red-500" },
        { id: "13", name: "Agriculture", callsign: "OG! Ags", theme: "West Bengal", accent: "from-green-500 to-emerald-700" },
        { id: "14", name: "B.Tech (1st)", callsign: "Tech Phoenix", theme: "Maharashtra", accent: "from-yellow-400 to-orange-500" },
        { id: "15", name: "CSE", callsign: "405 Found", theme: "Punjab", accent: "from-rose-500 to-pink-600" },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
            {departments.map((dept, i) => (
                <motion.div
                    key={dept.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    viewport={{ once: true }}
                    className="group relative h-40 bg-[#080808] rounded-2xl border border-white/5 overflow-hidden hover:border-white/20 transition-all duration-300"
                >
                    {/* Hover Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${dept.accent} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                    
                    <div className="relative p-5 h-full flex flex-col justify-between z-10">
                        {/* Header */}
                        <div className="flex justify-between items-start">
                            <span className="font-mono text-[10px] text-white/30 tracking-widest border border-white/10 px-2 py-1 rounded-md">
                                NODE_{dept.id}
                            </span>
                            <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-white transition-colors" />
                        </div>

                        {/* Info */}
                        <div>
                            <h3 className="text-white font-display font-bold leading-tight mb-1 group-hover:translate-x-1 transition-transform duration-300">
                                {dept.name}
                            </h3>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider group-hover:text-gray-300 transition-colors">
                                {dept.callsign}
                            </p>
                        </div>

                        {/* Footer (Theme) */}
                        <div className="absolute bottom-0 right-0 p-5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                            <span className={`text-[10px] font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r ${dept.accent}`}>
                                {dept.theme}
                            </span>
                        </div>
                    </div>
                    
                    {/* Tech Line Decoration */}
                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </motion.div>
            ))}
        </div>
    );
};

/* ==========================================================================
   MAIN PAGE COMPONENT
   ========================================================================== */

const TermsAndConditions = () => {
    const scrollRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: scrollRef });
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

    return (
        <div className="relative bg-[#030303] text-white selection:bg-pink-500/30 font-sans min-h-screen">
            <NoiseOverlay />
            
            {/* Progress Bar */}
            <motion.div
                style={{ scaleX }}
                className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 origin-left z-50 shadow-[0_0_20px_rgba(236,72,153,0.5)]"
            />
            
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-900/05 rounded-full blur-[120px]" />
            </div>
            
            {/* Navigation */}
            <nav className={`fixed top-0 w-full z-40 transition-all duration-300 border-b bg-[#030303]/80 backdrop-blur-xl border-white/5 py-3`}>
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <Link to="/" className="group flex items-center gap-3">
                        <div className="p-2 bg-white/5 border border-white/10 rounded-full group-hover:bg-pink-500 group-hover:border-pink-500 transition-all">
                            <ArrowLeft size={16} className="text-gray-400 group-hover:text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold font-display text-white uppercase tracking-widest">Panache S-16</span>
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest group-hover:text-gray-300 transition-colors">Return Home</span>
                        </div>
                    </Link>
                </div>
            </nav>

            {/* Main Content */}
            <div ref={scrollRef} className="relative z-10 max-w-5xl mx-auto px-6 pt-32 lg:pt-48 pb-32">
                
                {/* Header */}
                <header className="mb-24 lg:mb-32 text-center">
                    <ActiveScrollReveal>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-pink-500/30 bg-pink-500/10 text-pink-400 text-[10px] font-black uppercase tracking-widest mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
                            </span>
                            Legal Archive v4.2
                        </div>
                        <h1 className="font-display text-6xl md:text-8xl font-bold uppercase italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 leading-[0.9] mb-8">
                            Rulebook <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">Registry</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
                            The definitive guide to conduct, participation, and competition standards for Panache S-16. Compliance is mandatory for all registered entities.
                        </p>
                    </ActiveScrollReveal>
                </header>

                <div className="space-y-32">
                    {/* SECTION 1: Philosophy */}
                    <section>
                        <ActiveScrollReveal>
                            <SectionHeader number="01" title="Philosophy" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                                <PleasantCard>
                                    <p className="font-display text-2xl text-white font-medium leading-tight">"Together We Perform, Together We Achieve"</p>
                                    <div className="h-1 w-12 bg-pink-500 mt-6 mb-6" />
                                    <p className="text-sm text-gray-400 leading-relaxed">Panache S-16 is a convergence of diverse energies. Our core ethos is rooted in unity and collective excellence.</p>
                                </PleasantCard>
                                <PleasantCard>
                                    <div className="w-12 h-12 bg-pink-500 rounded-2xl flex items-center justify-center mb-6 text-black"><Zap size={24} fill="currentColor" /></div>
                                    <h3 className="font-display text-2xl font-bold text-white mb-2">Theme: The 80's</h3>
                                    <p className="text-sm text-gray-400">Every participant acts as an ambassador of the retro era. Aesthetics, music, and conduct should reflect the vibrancy of the 1980s.</p>
                                </PleasantCard>
                            </div>
                        </ActiveScrollReveal>
                    </section>

                    {/* SECTION 2: Participation */}
                    <section>
                        <ActiveScrollReveal>
                            <SectionHeader number="02" title="Participation Framework" />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                               <GlassCard title="Event Limit" icon={Hash} content="Strict limit of ONE event per student to ensure fair opportunity distribution. Exceptions for 'March of Minds'." />
                               <GlassCard title="Exemptions" icon={Star} content="Support roles (Models, Instrument Accompanists) are exempt from the single-event cap." />
                               <GlassCard title="Trophy Criteria" icon={Trophy} content="Departments must field candidates in 42 total events (29 mandatory) to qualify for the Rolling Trophy." />
                            </div>
                        </ActiveScrollReveal>
                    </section>

                     {/* SECTION 3: Registry Grid (Redesigned) */}
                    <section>
                       <ActiveScrollReveal>
                         <SectionHeader number="03" title="Department Registry" />
                         <div className="mt-12">
                            <DepartmentGrid />
                         </div>
                       </ActiveScrollReveal>
                    </section>
                    
                    {/* SECTION 4: Events */}
                    <section>
                        <ActiveScrollReveal>
                            <SectionHeader number="04" title="Event Protocols" />
                            <div className="space-y-16 mt-12">
                                <CategoryGroup title="Cultural & Ethnic" icon={Zap}>
                                    <DetailCard title="Sanskritic Sangam" specs={["30 Students", "7+1 Mins"]} desc="Ethnic ramp walk & cultural dance representing the allocated state. Audio track required 24h prior."/>
                                    <DetailCard title="March of Minds" specs={["10 Students", "Opening Ceremony"]} desc="Disciplined march from gate to stage. Creative props (helmets/blueprints) highly encouraged." />
                                    <DetailCard title="Khao Gali" specs={["4 Students + 1 Faculty", "Sales Based"]} desc="State cuisine stalls. Currency coupons of 20/50/100 only. Winner decided by volume, not revenue." />
                                </CategoryGroup>
                                <CategoryGroup title="Music & Vocals" icon={Music}>
                                    <DetailCard title="Melody Hues (Solo)" specs={["1+1 Format", "Live Only"]} desc="Solo vocal with one instrumentalist. No backing tracks allowed." />
                                    <DetailCard title="Bandish Bandits" specs={["6 Members", "Backing Allowed"]} desc="Group singing competition. Pre-recorded backing tracks are permitted." />
                                    <DetailCard title="The Vocal Edition" specs={["Solo Beatbox", "No Instruments"]} desc="Pure vocal percussion. No background music or instruments permitted." />
                                </CategoryGroup>
                                <CategoryGroup title="Dance & Motion" icon={Activity}>
                                    <DetailCard title="Nrityamrit" specs={["10 Members", "Folk/Tribal"]} desc="Group folk dance performance. Live or recorded audio permitted." />
                                    <DetailCard title="Soul Synergy" specs={["Solo", "Classical Only"]} desc="Strictly classical or semi-classical dance forms." />
                                </CategoryGroup>
                                <CategoryGroup title="Fine Arts" icon={Palette}>
                                    <DetailCard title="Brush & Blush" specs={["3 Artists + 3 Models", "90 Mins"]} desc="Face painting competition. Theme announced on the spot." />
                                    <DetailCard title="Monochrome Marvel" specs={["3 Pairs", "B&W Only"]} desc="Charcoal/Pastel art. Immediate disqualification for using color." />
                                </CategoryGroup>
                            </div>
                        </ActiveScrollReveal>
                    </section>

                    {/* SECTION 5: Tech Ops */}
                    <section>
                        <ActiveScrollReveal>
                            <SectionHeader number="05" title="Tech Ops" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                               <PleasantCard className="border-green-500/20 hover:border-green-500/40">
                                   <div className="flex justify-between items-start mb-6">
                                       <Smartphone size={32} className="text-green-500" />
                                       <span className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-[10px] font-bold uppercase text-green-400">Mobile Only</span>
                                   </div>
                                   <h3 className="font-display text-2xl font-black text-white uppercase italic mb-2">E-Sports Arena</h3>
                                   <p className="text-sm text-gray-400 mb-6">BGMI / Free Fire / COD Mobile</p>
                                   <ul className="space-y-3">
                                        {["Squad Format (4 Players)", "Bring Your Own Device", "Anti-Cheat Active"].map((item, i) => (
                                            <li key={i} className="flex items-center gap-3 text-xs text-gray-300">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> {item}
                                            </li>
                                        ))}
                                    </ul>
                               </PleasantCard>
                               <PleasantCard className="border-cyan-500/20 hover:border-cyan-500/40">
                                    <div className="flex justify-between items-start mb-6">
                                        <Zap size={32} className="text-cyan-500" />
                                        <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-bold uppercase text-cyan-400">Robotics</span>
                                    </div>
                                    <h3 className="font-display text-2xl font-black text-white uppercase italic mb-2">Circuit Rush</h3>
                                    <p className="text-sm text-gray-400 mb-6">RC 4-Wheeler Construction</p>
                                    <ul className="space-y-3">
                                        {["Build from Scratch", "No Readymade Kits", "Wireless Remote Only"].map((item, i) => (
                                            <li key={i} className="flex items-center gap-3 text-xs text-gray-300">
                                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" /> {item}
                                            </li>
                                        ))}
                                    </ul>
                               </PleasantCard>
                            </div>
                        </ActiveScrollReveal>
                    </section>

                    {/* SECTION 6: Dispute */}
                    <section>
                        <ActiveScrollReveal>
                            <SectionHeader number="06" title="Dispute Resolution" />
                            <div className="mt-12 p-[1px] bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-3xl">
                                <div className="bg-[#050505] rounded-[23px] p-8 md:p-12 relative overflow-hidden">
                                    {/* Subtle shimmer effect inside */}
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]" />
                                    
                                    <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                                        <Scale size={48} className="text-white shrink-0" />
                                        <div>
                                            <h3 className="font-display text-2xl font-bold text-white mb-4">Binding Authority</h3>
                                            <p className="text-sm text-gray-400 leading-relaxed mb-6 max-w-2xl">All decisions made by the judging panel are final. In extreme cases of dispute, teams may approach the Dispute Resolution Committee during the designated window.</p>
                                            <div className="inline-flex items-center gap-4 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                                <span className="text-xs font-mono text-gray-300">Window: 4:00 PM - 5:00 PM @ DSW Office</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ActiveScrollReveal>
                    </section>
                    
                    {/* SECTION 7: Core Registry */}
                    <section>
                        <ActiveScrollReveal>
                             <SectionHeader number="07" title="Core Registry" />
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
                                {[
                                    {n:"Vishal Kumar", r:"Convener", p:"9661757779"},
                                    {n:"Tarun Pratap Singh", r:"Co-Convener", p:"7849863839"},
                                    {n:"Krishna Poddar", r:"Secretary", p:"8619295090"},
                                    {n:"Ananya Priya", r:"Co-Secretary", p:"6299838371"},
                                    {n:"Chetanprakash Kaushik", r:"Treasurer", p:"8488846789"},
                                    {n:"Ritesh Chanda", r:"Mgmt Head", p:"8306617515"},
                                    {n:"Umesh Gadhwal", r:"Venue Head", p:"8529115783"},
                                    {n:"Nimmalapudi Akash", r:"Discipline", p:"8018177287"},
                                ].map((c, i) => (
                                    <PleasantCard key={i}>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-pink-500 mb-1">{c.r}</p>
                                        <h4 className="font-display text-lg font-bold text-white uppercase mb-3">{c.n}</h4>
                                        <p className="text-xs font-mono text-gray-500">{c.p}</p>
                                    </PleasantCard>
                                ))}
                            </div>
                        </ActiveScrollReveal>
                    </section>

                </div>
            </div>
        </div>
    );
};

// --- SUB COMPONENTS ---

const SectionHeader = ({ number, title }) => (
    <div className="flex items-end gap-6 border-b border-white/10 pb-6">
        <span className="font-display text-7xl md:text-8xl font-medium text-white/30 leading-[0.8] select-none">{number}</span>
        <h2 className="font-stretch-100% text-xl md:text-5xl font-bold uppercase text-white tracking-tight mb-1">{title}</h2>
    </div>
);

const GlassCard = ({ title, content, icon: Icon }) => (
    <PleasantCard className="h-full">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-pink-500 group-hover:text-white transition-all duration-300 mb-6">
            <Icon size={20} />
        </div>
        <h3 className="font-display text-lg font-bold text-white uppercase tracking-wide mb-3">{title}</h3>
        <p className="text-xs text-gray-500 leading-relaxed">{content}</p>
    </PleasantCard>
);

const CategoryGroup = ({ title, icon: Icon, children }) => (
    <div className="space-y-6">
        <div className="flex items-center gap-3 mb-2">
            <Icon size={18} className="text-pink-500" />
            <h3 className="text-xs font-black uppercase tracking-widest text-white">{title}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {children}
        </div>
    </div>
);

const DetailCard = ({ title, specs, desc }) => (
    <PleasantCard className="h-full flex flex-col">
        <h4 className="font-display text-lg font-bold text-white uppercase mb-4 group-hover:text-pink-500 transition-colors">{title}</h4>
        <div className="flex flex-wrap gap-2 mb-6">
            {specs.map((s, i) => (
                <span key={i} className="px-2 py-1 rounded-md bg-white/5 text-[10px] font-bold text-gray-400 border border-white/5">{s}</span>
            ))}
        </div>
        <p className="text-[11px] text-gray-500 leading-relaxed mt-auto">{desc}</p>
    </PleasantCard>
);


export default TermsAndConditions;