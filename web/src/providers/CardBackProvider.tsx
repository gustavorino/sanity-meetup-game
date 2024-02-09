import DataLoader from "dataloader";
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { generateBackcard } from "../components/CardBackface.tsx";
import { SanityCard } from "../sanity.ts";

const CardBackContext = createContext<{
  load(key: SanityCard): Promise<string>;
}>({
  load: () => Promise.resolve(""),
});

export function CardBackProvider({ children }: PropsWithChildren) {
  const loader = useMemo(() => {
    return new DataLoader<SanityCard, string>(
      async (questions) => {
        const arr = [];
        for (const question of questions) {
          arr.push(await generateBackcard(question));
        }
        return arr;
      },
      { cache: true, batchScheduleFn: (callback) => setTimeout(callback, 50) }
    );
  }, []);

  const load = useCallback(
    (card: SanityCard) => {
      return loader.load(card);
    },
    [loader]
  );

  return (
    <CardBackContext.Provider value={{ load: load }}>
      {children}
    </CardBackContext.Provider>
  );
}

export function useCardBack() {
  return useContext(CardBackContext);
}
