import { SpringValue, animated, useSpringValue } from "@react-spring/web";
import { ReactNode, useEffect } from "react";
import { twJoin } from "tailwind-merge";
import { useGlobalState } from "../State.tsx";
import { BaseLogo } from "../icons/BaseLogo.tsx";
import { Pro3200Logo } from "../icons/Pro3200Logo.tsx";
import { FullWrap } from "./FullWrap.tsx";
import { GithubIcon, YoutubeIcon } from "./Icons.tsx";

export function Intro() {
  const { mode } = useGlobalState();

  const spring = useSpringValue(0, { config: { friction: 40 } });

  useEffect(() => {
    spring.start(mode === "home" ? 0 : 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const avatarTop = spring.to([0, 1], ["12vw", "4vw"]);
  const avatarLeft = spring.to([0, 1], ["8vw", "0vw"]);

  return (
    <FullWrap>
      <animated.div
        style={{ left: avatarLeft, top: avatarTop }}
        className="absolute"
      >
        <Avatar
          spring={spring}
          name="Gustavo Bremm"
          title="Head of Software Engineering"
          photo="/gustavo.png"
          brand={<BaseLogo className="text-[4vw] mx-auto" />}
        />
      </animated.div>
      <animated.div
        style={{ right: avatarLeft, top: avatarTop }}
        className="absolute"
      >
        <Avatar
          spring={spring}
          name="Ryan Murray"
          title="Founder"
          photo="/ryan.jpg"
          brand={<Pro3200Logo className="text-[2.4rem] mx-auto" />}
        />
      </animated.div>
      <animated.div
        style={{
          scale: spring.to([0, 1], [1, 0]),
          opacity: spring.to([0, 1], [1, 0]),
        }}
      >
        <DevDeepDive />
      </animated.div>
    </FullWrap>
  );
}

function DevDeepDive() {
  const state = useGlobalState();

  return (
    <div className="absolute w-[50vw] left-[25vw] top-[18vw] text-[3vw] text-center">
      <div className="font-bold">Developer Deep Dive</div>
      <div className="font-extralight text-[0.8em] max-w-[40vw] mx-auto">
        How Sanity Unifies Developer Benefits With Client Needs
      </div>

      <div className="h-[5vw]"></div>
      <button
        onClick={state.beginPresentation}
        className={twJoin(
          "font-black text-[1vw] bg-white p-[0.25vw] rounded-[1vw]  ",
          state.mode === "home" && "pointer-events-auto"
        )}
      >
        <div className="px-[1vw] py-[0.5vw] border-[0.25vw] bg-mint border-dark rounded-[1vw]">
          LET'S BEGIN
        </div>
      </button>
      <div className="text-xs  mt-4 flex gap-4 items-center justify-center">
        <a
          className="pointer-events-auto inline-flex gap-1 items-center justify-center "
          href="https://github.com/gustavorino/sanity-meetup-game"
          target="_blank"
        >
          <span>Source Code</span> <GithubIcon />
        </a>

        <a
          className="pointer-events-auto inline-flex gap-1 items-center justify-center "
          href="https://www.youtube.com/watch?v=KYXkk4HIvzE"
          target="_blank"
        >
          <span>Presentation</span> <YoutubeIcon />
        </a>
      </div>
    </div>
  );
}

function Avatar({
  name,
  title,
  photo,
  brand,
  spring,
}: {
  name: string;
  title: string;
  photo: string;
  brand: ReactNode;
  spring: SpringValue<number>;
}) {
  return (
    <div className="items-center justify-center flex">
      <animated.div
        style={{ width: spring.to([0, 1], ["15vw", "10vw"]) }}
        className="flex-col  items-center justify-center flex"
      >
        <animated.img
          style={{ width: spring.to([0, 1], ["15vw", "4vw"]) }}
          src={photo}
          className="aspect-square rounded-full object-cover border-[0.25vw]"
        />
        <div className=" text-center">
          <animated.div
            className="py-[0.1em]"
            style={{ fontSize: spring.to([0, 1], ["1.25vw", "1vw"]) }}
          >
            {name}
          </animated.div>
          <animated.div
            style={{
              height: spring.to([0, 1], ["8vw", "0vw"]),
            }}
            className="overflow-hidden"
          >
            <div className="py-[0.1em] text-[1vw] font-light text-dark/80">
              {title}
            </div>

            <div className="pt-[1vw]">{brand}</div>
          </animated.div>
        </div>
      </animated.div>
    </div>
  );
}
