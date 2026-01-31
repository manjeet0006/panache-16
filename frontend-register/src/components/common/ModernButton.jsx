import React from "react";
import { ArrowRight } from "lucide-react";

const ModernButton = ({ children, onClick, variant = "primary" }) => {
  const isPrimary = variant === "primary";
  return (
    <button
      onClick={onClick}
      className={`
                relative px-9 py-4 rounded-full font-black uppercase tracking-[0.2em] text-xs transition-all duration-300 group overflow-hidden
                ${
                  isPrimary
                    ? "text-white shadow-[0_4px_30px_rgba(236,72,153,0.4)] hover:shadow-[0_4px_50px_rgba(236,72,153,0.7)] hover:-translate-y-1"
                    : "text-white border border-white/20 hover:border-white/50 hover:bg-white/5"
                }
            `}
    >
      {isPrimary && (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-pink-600  to-purple-600 group-hover:scale-110 transition-transform duration-500 ease-out" />
      )}
      {isPrimary && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-in-out" />
      )}
      <span className="relative z-10 flex items-center justify-center gap-3">
        {React.Children.map(children, (child) => {
          if (typeof child === "string") return child;
          return React.cloneElement(child, {
            className: `transition-transform duration-300 group-hover:translate-x-1 ${
              child.props.className || ""
            }`,
          });
        })}
      </span>
    </button>
  );
};

export default ModernButton;
