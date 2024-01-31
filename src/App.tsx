import { useObservable, useObservableState } from "observable-hooks";
import { concatMap, delay, endWith, interval, map, of, take } from "rxjs";
import { Bg } from "./components/Bg";
import { Card } from "./components/Card";
import { PoweredBy } from "./components/PoweredBy";
import { SpinButton } from "./components/SpinButton";

function App() {
  const blink$ = useObservable(() => {
    return interval(10).pipe(
      take(20),
      concatMap((i) => {
        return of(i).pipe(delay(Math.sqrt(i) * 50));
      }),
      map(() => Math.round(Math.random() * 30)),
      endWith(undefined)
    );
  });

  const blink = useObservableState(blink$);

  return (
    <>
      <Bg>
        <SpinButton />
        <div className="grid items-center justify-center justify-items-center content-center grid-cols-6 gap-4">
          {Array(30)
            .fill(0)
            .map((_, i) => (
              <Card
                blink={i == blink}
                key={i}
                label={(i + 1).toString().padStart(2, "0")}
              />
            ))}
        </div>
        <PoweredBy />
      </Bg>
    </>
  );
}

export default App;
