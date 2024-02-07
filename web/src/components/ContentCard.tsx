import { animated, useSpring } from "@react-spring/web";
import { useEffect, useState } from "react";
import { twJoin } from "tailwind-merge";
import { useGlobalState } from "../State.tsx";

export function ContentCard() {
  const { currentCard } = useGlobalState();

  const [infoVisible, setInfoVisible] = useState(false);

  useEffect(() => {
    setInfoVisible(false);
  }, [currentCard]);

  const springs = useSpring({
    from: { y: "80vw" },
    to: {
      y: infoVisible && currentCard ? "0vw" : "100vw",
    },
    config: {
      mass: 1,
      friction: 26,
      damping: 1,
      tension: 120,
    },
  });

  const questionSprings = useSpring({
    from: { scale: 0.5, opacity: 0, rotateX: 90 },
    to: {
      scale: currentCard ? 1 : 0.5,
      opacity: currentCard ? 1 : 0,
      rotateX: 0,
    },
    config: currentCard
      ? { tension: 380, friction: 80 }
      : { tension: 100, friction: 10 },
  });

  return (
    <>
      <animated.button
        onClick={() => setInfoVisible((v) => !v)}
        style={{ ...questionSprings }}
        className={twJoin(
          "absolute left-[30vw] top-[10vw] flex items-center justify-center rounded-full size-[3vw] text-[1.6vw] font-extrabold bg-[#B5E5CF] border-[0.3vw] border-white shadow-question z-50",
          currentCard ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        <div className="">?</div>
      </animated.button>

      <animated.div
        style={{ ...springs }}
        className="rounded-[2vw]  absolute top-[8.25vw] h-[40vw] shadow-content left-[35vw] w-[54vw] p-[2vw]  bg-white "
      >
        Content goes here...
      </animated.div>
    </>
  );
}
