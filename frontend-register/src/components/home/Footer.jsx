import ActiveScrollReveal from "../common/ActiveScrollReveal";
import ModernButton from "../common/ModernButton";

const Footer = ({setShowModal}) => {
    return (
        <section className="py-24 px-6 text-center border-t border-white/5 bg-gradient-to-b from-[#030303] to-pink-900/10">
        <ActiveScrollReveal direction="up">
          <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-8">
            Ready to Perform?
          </h2>
          <ModernButton onClick={() => setShowModal(true)} variant="primary">
            Join The Legacy
          </ModernButton>
        </ActiveScrollReveal>
      </section>
    )
}

export default Footer;