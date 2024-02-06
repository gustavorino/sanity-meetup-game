import { PropsWithChildren, createContext, useContext, useState } from "react";

type ContextType = { mode: "home" | "stack" | "cards" };

const StateContext = createContext<ContextType>({
  mode: "home",
});

export function StateProvider({ children }: PropsWithChildren) {
  const [mode, setMode] = useState<ContextType["mode"]>("home");

  return (
    <StateContext.Provider value={{ mode }}>
      <button
        onClick={() => {
          setMode("stack");
        }}
      >
        Go to Stack
      </button>
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
