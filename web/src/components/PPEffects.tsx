import { DepthOfField, EffectComposer } from "@react-three/postprocessing";
import { Tween } from "@tweenjs/tween.js";
import { useEffect, useRef } from "react";
import { useGlobalState } from "../State.tsx";

export function PPEffecs() {
  const { currentCard } = useGlobalState();
  const dofRef = useRef<any>(null);

  useEffect(() => {
    new Tween(dofRef.current)
      .to({ bokehScale: currentCard ? 5 : 0.5 }, 500)
      .start();
  }, [currentCard]);

  return (
    <EffectComposer enabled>
      <DepthOfField
        ref={dofRef}
        focusDistance={0} // where to focus
        focalLength={0.03} // focal length
        bokehScale={2}
        blur={20}
      />
    </EffectComposer>
  );
}
