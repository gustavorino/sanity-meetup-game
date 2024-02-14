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
  const [lock, setLock] = useState(false);

  const [cards, setCards] = useState<SanityCard[]>([]);

  useEffect(() => {
    loadCards().then(setCards);
  }, []);

  const cards$ = useObservable(() =>
    listenCards().pipe(
      tap((event) => {
        setCards((cards) => mergeCards(event.result!, cards));
      })
    )
  );

  useSubscription(cards$);

  const beginPresentation = useCallback(() => {
    setLock(true);
    setMode("cards");
    setTimeout(() => {
      // just a ugly lock to prevent someone clicking while it's still animating
      setLock(false);
    }, 6000);
  }, []);

  const openCard = useCallback(
    (position: number) => {
      if (currentCard != undefined || lock) {
        return;
      }
      setOpenedMap((v) => ({ ...v, [position]: true }));
      setCurrentCard(position);
    },
    [currentCard, lock]
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

// handle realtime updates on the studio (community questions)
function mergeCards(newCard: SanityCard, state: SanityCard[]) {
  if (!newCard) {
    return state;
  }
  if (!state.find((card) => card._id == newCard._id)) {
    return [...state, newCard];
  }

  return state.reduce((acc, next) => {
    if (next._id == newCard._id) {
      // body has references so we can't rely on the realtime data
      acc.push({ ...newCard, body: next.body });
    } else {
      acc.push(next);
    }
    return acc;
  }, [] as SanityCard[]);
}
