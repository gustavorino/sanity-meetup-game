import { Stage } from "./Stage.tsx";
import { StateProvider } from "./State.tsx";

function App() {
  return (
    <>
      <StateProvider>
        <Stage />
      </StateProvider>
    </>
  );
}

export default App;
