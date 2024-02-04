import { PropsWithChildren, createContext, useContext, useState } from "react";

const StateContext = createContext<{ mode: "home" | "cards" }>({
  mode: "home",
});

export function StateProvider({ children }: PropsWithChildren) {
  const [mode, setMode] = useState<"home" | "cards">("home");

  return (
    <StateContext.Provider value={{ mode }}>
      <button
        onClick={() => {
          setMode("cards");
        }}
      >
        Go to Cards
      </button>
      {children}
    </StateContext.Provider>
  );
}

export function useGlobalState() {
  return useContext(StateContext);
}
