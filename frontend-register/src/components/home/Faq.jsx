import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Fingerprint,
  Ticket,
} from "lucide-react";
import ActiveScrollReveal from "../common/ActiveScrollReveal";
import ModernButton from "../common/ModernButton";

const Faq = () => {
    const navigate = useNavigate();
    return (
        <section className="py-24 px-6 max-w-5xl mx-auto border-t border-white/5">
        <ActiveScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h3 className="text-4xl font-black uppercase italic tracking-tighter mb-6">
                Protocol <br />{" "}
                <span className="text-pink-500">Overview</span>
              </h3>
              <p className="text-gray-400 leading-relaxed mb-8">
                Before entering the arena, ensure you are equipped with the
                mandatory credentials. The VGU Campus operates on strict
                digital & physical verification protocols.
              </p>
              <ModernButton
                onClick={() => navigate("/terms-and-conditions")}
                variant="secondary"
              >
                Read Full Rulebook
              </ModernButton>
            </div>
            <div className="space-y-4">
              {[
                {
                  icon: ShieldCheck,
                  title: "Zero Tolerance",
                  desc: "Disqualification for any misconduct.",
                },
                {
                  icon: Fingerprint,
                  title: "Zolo Access",
                  desc: "App mandatory for entry.",
                },
                {
                  icon: Ticket,
                  title: "One Event Rule",
                  desc: "Single participation limit applied.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02]"
                >
                  <item.icon className="text-pink-500 shrink-0" />
                  <div>
                    <h4 className="font-bold uppercase tracking-wider text-sm">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ActiveScrollReveal>
      </section>
    )
}

export default Faq;