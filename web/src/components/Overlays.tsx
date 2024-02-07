import { animated, useSpring } from "@react-spring/web";
import { PropsWithChildren } from "react";
import { useGlobalState } from "../State.tsx";
import { BaseLogo } from "../icons/BaseLogo.tsx";
import { ContentCard } from "./ContentCard.tsx";

export function Overlays() {
  const state = useGlobalState();

  const springs = useSpring({
    from: { y: 0, opacity: 1 },
    to: {
      y: state.mode == "cards" ? -0 : 0,
      opacity: state.mode == "cards" ? 0 : 1,
    },
  });

  return (
    <FullWrap>
      <ContentCard />

      <FullWrap className="flex items-center justify-center flex-col text-5xl ">
        <animated.div
          style={{ ...springs }}
          className="space-y-2 text-center p-8 rounded-xl w-full px-20 "
        >
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <img
                src="/gustavo.png"
                className="size-80 rounded-full object-cover"
              />
              <div className="h-40 space-y-4">
                <div className="text-lg font-light">
                  Head of Software Engineering
                </div>

                <BaseLogo className="text-[4rem] mx-auto" />
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div className="font-bold">Developer Deep Dive</div>
              <div className="font-extralight text-3xl">
                How Sanity Unifies Developer Benefits With Client Needs
              </div>

              <div className="h-20"></div>
              <button
                onClick={state.beginPresentation}
                className="font-black text-lg  pointer-events-auto  rounded-lg   px-4 py-2 border-4 border-black"
              >
                LET'S BEGIN
              </button>
            </div>
            <div className=" flex flex-col items-center justify-center space-y-4">
              <img
                src="/ryan.jpg"
                className="size-80 rounded-full object-cover"
              />
              <div className="h-40 space-y-4">
                <div className="text-lg font-light">Founder</div>
                <div className="font-bold text-4xl">3200.pro</div>
              </div>
            </div>
          </div>
        </animated.div>
      </FullWrap>
    </FullWrap>
  );
}

function FullWrap({
  children,
  className = "",
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={
        "w-full h-full z-20 left-0 top-0 absolute pointer-events-none " +
        className
      }
    >
      {children}
    </div>
  );
}
