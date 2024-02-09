import { Stage } from "./Stage.tsx";
import { StateProvider } from "./State.tsx";
import { Overlays } from "./components/Overlays.tsx";
import { CardBackProvider } from "./providers/CardBackProvider.tsx";

function App() {
  return (
    <>
      <CardBackProvider>
        <div className="w-screen h-screen overflow-hidden flex items-center justify-center bg-black">
          <div className="aspect-video w-screen bg-bg relative">
            <StateProvider>
              <Overlays />
              <Stage />
            </StateProvider>
          </div>
        </div>
      </CardBackProvider>
    </>
  );
}

export default App;
