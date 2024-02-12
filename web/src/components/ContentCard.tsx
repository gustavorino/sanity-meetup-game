import { PortableText } from "@portabletext/react";
import { animated, useSpring } from "@react-spring/web";
import { useEffect, useState } from "react";
import { twJoin } from "tailwind-merge";
import { useGlobalState } from "../State.tsx";
import { imageBuilder } from "../sanity.ts";

export function ContentCard() {
  const { currentCard, cards } = useGlobalState();

  const [infoVisible, setInfoVisible] = useState(false);

  const content =
    currentCard != undefined && !cards[currentCard].realTimeQuestion
      ? cards[currentCard].body
      : null;

  useEffect(() => {
    setInfoVisible(false);
  }, [content]);

  const springs = useSpring({
    from: { y: "80vw" },
    to: {
      y: infoVisible && content ? "0vw" : "100vw",
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
      scale: content ? 1 : 0.5,
      opacity: content ? 1 : 0,
      rotateX: 0,
    },
    config: content
      ? { tension: 380, friction: 80 }
      : { tension: 100, friction: 10 },
  });

  return (
    <>
      <animated.button
        onClick={() => setInfoVisible((v) => !v)}
        style={{ ...questionSprings }}
        className={twJoin(
          "absolute left-[30vw] top-[10vw] flex items-center justify-center rounded-full size-[3vw] text-[1.6vw] font-extrabold bg-dark text-white border-[0.3vw] border-white shadow-question z-50",
          content ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        <div className="">?</div>
      </animated.button>

      <animated.div
        style={{ ...springs }}
        className="portable-text overflow-auto rounded-[2vw] pointer-events-auto  absolute top-[8.25vw] h-[40vw] shadow-content left-[35vw] w-[54vw] p-[2vw]  bg-white "
      >
        <PortableText
          components={{
            types: {
              figure: Figure,
              video: Video,
            },
          }}
          value={content}
        />
      </animated.div>
    </>
  );
}

function Video({ value }: { value: { asset: { url: string } } }) {
  return (
    <div className="my-[1vw]">
      <video controls src={value.asset.url} />
    </div>
  );
}

function Figure({
  value: {
    img: { asset },
  },
}: {
  value: { img: { asset: { assetId: string; mimeType: string } } };
}) {
  return (
    <div className="my-[1vw]">
      <img
        className="w-full h-auto"
        src={imageBuilder
          .image(asset)
          .width(1920)
          .fit("max")
          .format(asset.mimeType === "image/gif" ? (undefined as any) : "webp")
          .url()}
      />
    </div>
  );
}
