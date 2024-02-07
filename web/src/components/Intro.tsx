import { animated, useSpring } from "@react-spring/web";
import { twJoin } from "tailwind-merge";
import { useGlobalState } from "../State.tsx";
import { BaseLogo } from "../icons/BaseLogo.tsx";
import { Pro3200Logo } from "../icons/Pro3200Logo.tsx";
import { FullWrap } from "./FullWrap.tsx";

export function Intro() {
  const state = useGlobalState();

  const springs = useSpring({
    from: { y: 0, opacity: 1 },
    to: {
      y: state.mode == "cards" ? -0 : 0,
      opacity: state.mode == "cards" ? 0 : 1,
    },
  });

  return (
    <FullWrap className="flex items-center justify-center flex-col text-lg lg:text-5xl ">
      <animated.div
        style={{ ...springs }}
        className={"space-y-2 text-center p-8 rounded-xl w-full px-20 "}
      >
        <div className="items-center justify-center flex">
          <div className="flex-col items-center justify-center space-y-4 hidden lg:flex">
            <img
              src="/gustavo.png"
              className="size-40 xl:size-80 rounded-full object-cover"
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
            <div className="font-extralight text-[0.8em] max-w-[40rem] mx-auto">
              How Sanity Unifies Developer Benefits With Client Needs
            </div>

            <div className="h-5 lg:h-20"></div>
            <button
              onClick={state.beginPresentation}
              className={twJoin(
                "font-black text-lg rounded-lg   px-4 py-2 border-4 border-black",
                state.mode === "home" && "pointer-events-auto"
              )}
            >
              LET'S BEGIN
            </button>
          </div>
          <div className="flex-col items-center justify-center space-y-4 hidden lg:flex">
            <img
              src="/ryan.jpg"
              className="size-40 xl:size-80 rounded-full object-cover"
            />
            <div className="h-40 space-y-4">
              <div className="text-lg font-light">Founder</div>
              <Pro3200Logo className="text-[2.5rem] mx-auto" />
            </div>
          </div>
        </div>
      </animated.div>
    </FullWrap>
  );
}
