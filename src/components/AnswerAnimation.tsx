import { Center } from "@mantine/core";
import { motion, AnimatePresence } from "framer-motion";
import ConfettiExplosion from "react-confetti-explosion";

interface AnswerAnimationProps {
  status: "correct" | "incorrect" | null;
}

export function AnswerAnimation({ status }: AnswerAnimationProps) {
  const bigExplodeProps = {
    force: 0.6,
    duration: 5000,
    particleCount: 200,
    floorHeight: 1600,
    floorWidth: 1600,
  };

  return (
    <Center
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
        pointerEvents: "none",
      }}
    >
      {status === "correct" && <ConfettiExplosion {...bigExplodeProps} />}
      <AnimatePresence>
        {status === "incorrect" && (
          <motion.svg
            key="incorrect-cross"
            width="150"
            height="150"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1, transform: "translateY(-100px)" }}
            exit={{ opacity: 0, scale: 2, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <motion.path
              d="M18 6L6 18M6 6l12 12"
              stroke="#FF6B6B"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        )}
      </AnimatePresence>
    </Center>
  );
}
