import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Flame,
  Music,
  Activity,
  Gamepad2,
  Cpu,
  Shirt,
  Globe,
  ArrowUpRight,
} from "lucide-react";
import ActiveScrollReveal from "../common/ActiveScrollReveal";
import PleasantCard from "../common/PleasantCard";
import ModernButton from "../common/ModernButton";

const EVENT_CATEGORIES = [
  {
    id: "ethnic",
    title: "Ethnic Day",
    icon: <Flame />,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    description: "Desi vibes, traditional food, and pure culture.",
    events: [
      { name: "Sanskritic Sangam", meta: "Flagship" },
      { name: "Khao Gali", meta: "Food" },
    ],
  },
  {
    id: "music",
    title: "Music",
    icon: <Music />,
    color: "text-pink-500",
    bg: "bg-pink-500/10",
    description: "Battle of the bands, solo vocals, and beatboxing.",
    events: [
      { name: "Melody Hues", meta: "Solo" },
      { name: "Bandish Bandits", meta: "Group" },
    ],
  },
  {
    id: "dance",
    title: "Dance",
    icon: <Activity />,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    description: "Solo classical to group hip-hop battles.",
    events: [
      { name: "Nrityamrit", meta: "Folk" },
      { name: "Soul Synergy", meta: "Solo" },
    ],
  },
  {
    id: "esports",
    title: "E-Sports",
    icon: <Gamepad2 />,
    color: "text-green-500",
    bg: "bg-green-500/10",
    description: "Digital battlefields for the ultimate gamers.",
    events: [
      { name: "BGMI", meta: "Battle Royale" },
      { name: "Free Fire", meta: "Battle Royale" },
    ],
  },
  {
    id: "tech",
    title: "Technical",
    icon: <Cpu />,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
    description: "Innovation meets execution in robotics and code.",
    events: [
      { name: "Circuit Rush", meta: "Robo" },
      { name: "Hackathon", meta: "Code" },
    ],
  },
  {
    id: "fashion",
    title: "Fashion",
    icon: <Shirt />,
    color: "text-fuchsia-500",
    bg: "bg-fuchsia-500/10",
    description: "Ramp walks, style showcases, and sustainability.",
    events: [
      { name: "Runway Rapture", meta: "Ramp" },
      { name: "Reborn Fashion", meta: "Eco" },
    ],
  },
];

const Domains = () => {
  const navigate = useNavigate();
  return (
    <section
      id="domains"
      className="relative z-10 py-32 px-6 max-w-7xl mx-auto"
    >
      <ActiveScrollReveal direction="left">
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-[2px] bg-pink-500" />
            <span className="text-pink-500 text-xs font-bold uppercase tracking-widest">
              Explore Categories
            </span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white">
            Choose Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
              Arena
            </span>
          </h2>
        </div>
      </ActiveScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {EVENT_CATEGORIES.map((category, idx) => (
          <div
            key={category.id}
            className={`col-span-1 ${
              idx === 0 || idx === 3 ? "lg:col-span-2" : ""
            }`}
          >
            <ActiveScrollReveal delay={idx * 0.1} direction="up">
              <PleasantCard className="h-full flex flex-col justify-between cursor-pointer">
                <div className="flex justify-between items-start mb-8">
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl border ${category.color.replace(
                      "text-",
                      "border-"
                    )} bg-white/5`}
                  >
                    {React.cloneElement(category.icon, {
                      className: category.color,
                    })}
                  </div>
                  <ArrowUpRight className="text-neutral-600 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold uppercase text-white mb-3">
                    {category.title}
                  </h3>
                  <p className="text-sm text-neutral-400 mb-6">
                    {category.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {category.events.map((ev, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-medium text-neutral-300 uppercase"
                      >
                        {ev.name}
                      </span>
                    ))}
                  </div>
                </div>
              </PleasantCard>
            </ActiveScrollReveal>
          </div>
        ))}
      </div>
      <ActiveScrollReveal delay={0.3}>
        <div className="mt-16 text-center">
          <ModernButton
            onClick={() => navigate("/events")}
            variant="secondary"
          >
            <Globe size={20} /> View Full Roster
          </ModernButton>
        </div>
      </ActiveScrollReveal>
    </section>
  );
};

export default Domains;
