import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type ContextType = {
  mode: "home" | "cards";
  currentCard?: string;
  openedMap: Record<string, boolean>;
  openCard(name: string): void;
  closeCard(): void;
};

const StateContext = createContext<ContextType>({
  openCard() {},
  closeCard() {},
  openedMap: {},
  mode: "home",
});

export function StateProvider({ children }: PropsWithChildren) {
  const [mode, setMode] = useState<ContextType["mode"]>("home");
  const [currentCard, setCurrentCard] = useState<string>();
  const [openedMap, setOpenedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setTimeout(() => {
      setMode("cards");
    }, 400);
  }, []);

  const openCard = useCallback(
    (name: string) => {
      if (currentCard) {
        return;
      }
      setOpenedMap((v) => ({ ...v, [name]: true }));
      setCurrentCard(name);
    },
    [currentCard]
  );

  const closeCard = useCallback(() => {
    setCurrentCard(undefined);
  }, []);

  return (
    <StateContext.Provider
      value={{ mode, openCard, closeCard, openedMap, currentCard }}
    >
      {JSON.stringify({ mode, currentCard })}
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
