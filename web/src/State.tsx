import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { SanityCard, listenCards, loadCards } from "./sanity.ts";

import { useObservable, useSubscription } from "observable-hooks";
import { tap } from "rxjs";

type ContextType = {
  mode: "home" | "cards";
  beginPresentation(): void;
  currentCard?: number;
  openedMap: Record<string, boolean>;
  openCard(position: number): void;
  closeCard(): void;
  cards: SanityCard[];
};

const StateContext = createContext<ContextType>({
  openCard() {},
  beginPresentation() {},
  closeCard() {},
  openedMap: {},
  mode: "home",
  cards: [],
});

export function StateProvider({ children }: PropsWithChildren) {
  const [mode, setMode] = useState<ContextType["mode"]>("home");
  const [currentCard, setCurrentCard] = useState<number>();
  const [openedMap, setOpenedMap] = useState<Record<string, boolean>>({});

  const [cards, setCards] = useState<SanityCard[]>([]);

  useEffect(() => {
    loadCards().then(setCards);
  }, []);

  const cards$ = useObservable(() =>
    listenCards().pipe(
      tap((event) => {
        console.log(event);

        setCards((cards) => mergeCards(event.result!, cards));
      })
    )
  );

  useSubscription(cards$);

  const beginPresentation = useCallback(() => {
    setMode("cards");
  }, []);

  const openCard = useCallback(
    (position: number) => {
      if (currentCard != undefined) {
        return;
      }
      setOpenedMap((v) => ({ ...v, [position]: true }));
      setCurrentCard(position);
    },
    [currentCard]
  );

  const closeCard = useCallback(() => {
    setCurrentCard(undefined);
  }, []);

  if (cards.length == 0) {
    return <>Loading...</>;
  }

  return (
    <StateContext.Provider
      value={{
        cards,
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

function mergeCards(newCard: SanityCard, state: SanityCard[]) {
  if (!state.find((card) => card._id == newCard._id)) {
    return [...state, newCard];
  }
  console.log("reducing");
  return state.reduce((acc, next) => {
    if (next._id == newCard._id) {
      acc.push(newCard);
    } else {
      acc.push(next);
    }
    return acc;
  }, [] as SanityCard[]);
}
