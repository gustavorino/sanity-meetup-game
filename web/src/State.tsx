import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

type ContextType = {
  mode: "home" | "cards";
  beginPresentation(): void;
  currentCard?: string;
  openedMap: Record<string, boolean>;
  openCard(name: string): void;
  closeCard(): void;
};

const StateContext = createContext<ContextType>({
  openCard() {},
  beginPresentation() {},
  closeCard() {},
  openedMap: {},
  mode: "home",
});

export function StateProvider({ children }: PropsWithChildren) {
  const [mode, setMode] = useState<ContextType["mode"]>("home");
  const [currentCard, setCurrentCard] = useState<string>();
  const [openedMap, setOpenedMap] = useState<Record<string, boolean>>({});

  const beginPresentation = useCallback(() => {
    setMode("cards");
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
      value={{
        beginPresentation,
        mode,
        openCard,
        closeCard,
        openedMap,
        currentCard,
      }}
    >
      {children}
    </StateContext.Provider>
  );
}

export function useGlobalState() {
  return useContext(StateContext);
}
