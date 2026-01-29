import React from "react";
import { motion } from "framer-motion";
import {
    MapPin, Mail, Phone, Send, Globe,
    MessageSquare, User, AtSign,
    Github, Instagram, Linkedin, Twitter,
    FileText // Added missing import
} from "lucide-react";
import { cn } from "../lib/utils"; // Ensure you have a cn utility or use the one defined below


const ContactInput = ({ icon: Icon, type, placeholder, rows }) => (
    <div className="group relative">
        <div className="absolute top-3 left-4 text-gray-500 group-focus-within:text-pink-500 transition-colors">
            <Icon size={18} />
        </div>
        {type === 'textarea' ? (
            <textarea
                rows={rows || 4}
                placeholder={placeholder}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-pink-500/50 focus:bg-white/10 transition-all resize-none text-sm"
            />
        ) : (
            <input
                type={type}
                placeholder={placeholder}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-pink-500/50 focus:bg-white/10 transition-all text-sm"
            />
        )}
    </div>
);

const SocialButton = ({ icon: Icon, href }) => (
    <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-pink-500 hover:text-white hover:border-pink-500 hover:scale-110 transition-all"
    >
        <Icon size={18} />
    </a>
);


//    MAIN PAGE

const Contact = () => {
    return (
        <div className="min-h-screen bg-[#030303] text-white selection:bg-pink-500/30 overflow-x-hidden pt-20">

            {/* Background FX */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-900/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12 md:py-24 relative z-10">

                {/* --- HERO HEADER --- */}
                <div className="text-center mb-16 md:mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-pink-500/30 bg-pink-500/10 text-pink-400 text-[10px] font-black uppercase tracking-widest mb-6"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
                        </span>
                        Transmission Open
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter text-white mb-6"
                    >
                        Get In <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Touch</span>
                    </motion.h1>
                    <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
                        Have questions about the fest? Need technical support?
                        Signal us on the frequencies below.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">

                    {/* --- LEFT: INFO & MAP --- */}
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div className="p-8 rounded-[2rem] bg-[#0A0A0A] border border-white/10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-bl-[100px] transition-all group-hover:bg-pink-500/10" />

                            <h3 className="text-2xl font-black uppercase italic mb-8">Coordinates</h3>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-xl bg-white/5 text-pink-500 shrink-0">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Base Location</h4>
                                        <p className="text-sm font-medium text-white leading-relaxed">
                                            Vivekananda Global University,<br />
                                            Sector 36, NRI Road, Jagatpura,<br />
                                            Jaipur, Rajasthan - 303012
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-xl bg-white/5 text-cyan-500 shrink-0">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Digital Mail</h4>
                                        <a href="mailto:panache@vgu.ac.in" className="text-sm font-medium text-white hover:text-cyan-400 transition-colors">
                                            panache@vgu.ac.in
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-xl bg-white/5 text-purple-500 shrink-0">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Hotline</h4>
                                        <p className="text-sm font-medium text-white">+91 96617 57779 (Vishal)</p>
                                        <p className="text-sm font-medium text-white">+91 78498 63839 (Tarun)</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-white/5 flex gap-4">
                                <SocialButton icon={Instagram} href="#" />
                                <SocialButton icon={Linkedin} href="#" />
                                <SocialButton icon={Twitter} href="#" />
                                <SocialButton icon={Github} href="#" />
                            </div>
                        </div>

                        {/* Fixed Map URL */}
                        <div className="h-64 w-full rounded-[2rem] overflow-hidden border border-white/10 relative transition-all duration-500">
                            <iframe
                                src="https://maps.google.com/maps?q=Vivekananda+Global+University+Jaipur&t=n&z=16&ie=UTF8&iwloc=&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                className="opacity-70"
                            ></iframe>
                            <div className="absolute inset-0 pointer-events-none border-[6px] border-black/20 rounded-[2rem]" />
                        </div>
                    </motion.div>

                    {/* --- RIGHT: FORM --- */}
                    <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <div className="p-8 md:p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/10 backdrop-blur-md">
                            <div className="mb-8">
                                <h3 className="text-2xl font-black uppercase italic text-white mb-2">Send Signal</h3>
                                <p className="text-xs text-gray-500 uppercase tracking-widest">We respond within 24 hours.</p>
                            </div>

                            <form className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <ContactInput icon={User} type="text" placeholder="Your Name" />
                                    <ContactInput icon={AtSign} type="email" placeholder="Email Address" />
                                </div>
                                <ContactInput icon={MessageSquare} type="text" placeholder="Subject / Query Type" />
                                <ContactInput icon={FileText} type="textarea" placeholder="Describe your query..." rows={6} />

                                <button type="button" className="group w-full py-4 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-pink-500 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-3 mt-4 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(236,72,153,0.4)]">
                                    Transmit Message <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Contact;