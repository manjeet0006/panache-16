import {
  Users,
  School,
  Trophy,
  Layers,
} from "lucide-react";
import ActiveScrollReveal from "../common/ActiveScrollReveal";
import CountingNumber from "../common/CountingNumber";

const STATISTICS = [
  { label: "Footfall", value: 15000, suffix: "+", icon: Users },
  { label: "Universities", value: 45, suffix: "+", icon: School },
  { label: "Prize Pool", value: 5, suffix: "L+", icon: Trophy },
  { label: "Events", value: 50, suffix: "+", icon: Layers },
];

const Statistics = () => {
  return (
    <section className="relative z-10 py-15 bg-white/[0.02] border-y border-white/5 backdrop-blur-sm">
      <ActiveScrollReveal>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {STATISTICS.map((stat, idx) => (
            <div key={idx}>
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <stat.icon size={25} className="text-pink-500" />
                </div>
              </div>
              <div className="flex items-baseline justify-center gap-1 text-4xl md:text-6xl font-black text-white italic tracking-tighter">
                <CountingNumber value={stat.value} />
                <span>{stat.suffix}</span>
              </div>
              <p className="text-[12px] font-extrabold text-pink-500 uppercase tracking-widest mt-2">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </ActiveScrollReveal>
    </section>
  );
};

export default Statistics;
