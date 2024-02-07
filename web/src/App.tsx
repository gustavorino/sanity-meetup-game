import { Stage } from "./Stage.tsx";
import { StateProvider } from "./State.tsx";
import { Overlays } from "./components/Overlays.tsx";

function App() {
  return (
    <>
      <StateProvider>
        <Overlays />
        <Stage />
      </StateProvider>
    </>
  );
}

export default App;
