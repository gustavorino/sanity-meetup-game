import html2canvas from "html2canvas";
import { useState } from "react";
import ReactDOM from "react-dom/client";
import { twJoin } from "tailwind-merge";
import { SanityCard } from "../sanity.ts";

export function CardBackface(props: SanityCard) {
  return (
    <div className="fixed bottom-full right-full ">
      <InnerCardBackface {...props} />
    </div>
  );
}

export function InnerCardBackface({
  userName,
  realTimeQuestion,
  topic,
}: SanityCard) {
  return (
    <div
      className={twJoin(
        "target h-[1400px] w-[1000px]    ",
        !realTimeQuestion ? "bg-mint" : "bg-salmon"
      )}
    >
      <div className="p-[60px] h-full  ">
        <div
          className={
            " flex flex-col overflow-hidden  leading-normal border-black border-[20px] bg-white border-solid rounded-[94px]  font-black h-full  py-[40px] px-[60px] space-y-8"
          }
        >
          <div
            className={twJoin(
              " text-black flex-1",
              topic.length > 100 ? "text-[72px]" : "text-[90px]"
            )}
          >
            {topic}
          </div>

          {userName && (
            <div className="text-[50px] text-[#555] text-right">{userName}</div>
          )}
        </div>
      </div>
    </div>
  );
}
export async function generateBackcard(props: SanityCard) {
  const div = document.createElement("div");
  document.body.append(div);
  const root = ReactDOM.createRoot(div);
  root.render(<CardBackface {...props} />);
  await wait(150); // we need give some time so the browser can finish rendering
  return html2canvas(div.childNodes.item(0) as HTMLElement, {
    width: 1000,
    height: 1400,
    scale: 1,
    scrollX: 0,
    scrollY: 0,
  })
    .finally(() => {
      div.remove();
      root.unmount();
    })
    .then((v) => v.toDataURL());
}

export function wait(time: number = 1000) {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(time);
    }, time)
  );
}

const dummyBackcard = {
  _id: "foobar",

  body: [],
  realTimeQuestion: false,
  userName: "Gustavo Bremm",
  topic: "Lorem ipsum dolor sit amet, consectetur adipiscing elit?",
};

export function CardTester() {
  const [state, setState] = useState("");
  return (
    <div className="relative inline-block">
      <InnerCardBackface {...dummyBackcard} />
      {!state && (
        <button
          onClick={() =>
            generateBackcard(dummyBackcard).then((data) => {
              setState(data);
            })
          }
        >
          Generate image
        </button>
      )}
      {state && (
        <img src={state} className="absolute left-0 top-0 w-full opacity-50" />
      )}
    </div>
  );
}
