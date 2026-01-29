import { useEffect, useRef } from "react";
import { animate } from "framer-motion";

const useCounter = (from, to, duration = 2) => {
  const nodeRef = useRef();
  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;
    const controls = animate(from, to, {
      duration,
      onUpdate(value) {
        node.textContent = Math.round(value).toLocaleString();
      },
      ease: "easeOut",
    });
    return () => controls.stop();
  }, [from, to, duration]);
  return nodeRef;
};

const CountingNumber = ({ value }) => {
  const ref = useCounter(0, value);
  return <span ref={ref} />;
};

export default CountingNumber;
