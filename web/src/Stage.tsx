/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { OrbitControls, OrbitControlsProps } from "@react-three/drei";
import { Canvas, GroupProps, useFrame, useThree } from "@react-three/fiber";
import TWEEN from "@tweenjs/tween.js";
import { useEffect, useMemo, useRef } from "react";
import { Euler, Group } from "three";
import "./3dComponents/Card.tsx";
import { Card } from "./3dComponents/Card.tsx";
import { useGlobalState } from "./State.tsx";
import { custom } from "./easings.ts";
import "./utils.tsx";
import { drand, fit } from "./utils.tsx";

const CARD_COUNT = 18;
const INITIAL_Y = 30;
const INITIAL_H_AREA = 12;
const SLOW_MO = 1.1;
const COLS = 7;

const cardIds = Array(CARD_COUNT)
  .fill(0)
  .map((_, i) => `card${i}`);

export function Stage() {
  const orbitControls = useRef<OrbitControlsProps>(null);
  const { mode } = useGlobalState();
  useEffect(() => {
    if (mode === "stack" && orbitControls.current) {
      new TWEEN.Tween(orbitControls.current.target || {})
        .to({ x: 0, y: 0, z: 2 }, 1500)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start();
      new TWEEN.Tween(orbitControls.current.object!.position)
        .to({ x: 0, y: 12, z: 12 }, 2000)
        .easing(TWEEN.Easing.Cubic.InOut)
        .start();
    }
  });
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{
        fov: 50,
        position: [0, INITIAL_Y, 6],
        rotation: [0, 0, 0],
      }}
      shadows
    >
      <Scene />
      <OrbitControls ref={orbitControls as any} target={[0, INITIAL_Y, 0]} />
      <Cards />
    </Canvas>
  );
}

function FallingCard(props: GroupProps) {
  const { mode } = useGlobalState();
  const consts = useMemo(() => {
    return {
      x: drand(-1, 1),
      y: drand(-1, 1),
      z: drand(-1, 1),
    };
  }, []);
  const ref = useRef<Group>(null);

  useFrame((_, delta) => {
    if (ref.current && mode == "home") {
      if (ref.current.position.y < INITIAL_Y - INITIAL_H_AREA) {
        ref.current.position.y += INITIAL_H_AREA * 2;
      }

      ref.current.position.y -= delta * 10 * SLOW_MO;
      ref.current.rotation.x += consts.x * delta * SLOW_MO;
      ref.current.rotation.y += consts.y * delta * SLOW_MO;
      ref.current.rotation.z += consts.z * delta * SLOW_MO;
    }
  });

  // useEffect(() => {
  //   if (mode == "cards") {
  //   }
  // }, [mode]);

  return (
    <group {...props} ref={ref}>
      <Card />
    </group>
  );
}

function Cards() {
  const { mode } = useGlobalState();
  const { scene, camera } = useThree();

  useEffect(() => {
    if (mode === "stack") {
      const xOffset = 3 * ((COLS - 2) / 2);
      const zOffset = 4;

      cardIds.forEach((id, i) => {
        const card = scene.getObjectByName(id)!;
        const row = Math.floor(i / (COLS - 1));
        const col = i % (COLS - 1);

        card.rotation.x = card.rotation.x % (Math.PI * 2);
        card.rotation.y = card.rotation.y % (Math.PI * 2);
        card.rotation.z = card.rotation.z % (Math.PI * 2);

        const time = 1700 + i * 100;
        new TWEEN.Tween(card.position)
          .to(
            {
              y: 0.05,
              z: row * 4 - zOffset,
              x: col * 3 - xOffset,
            },
            time
          )
          .easing(TWEEN.Easing.Cubic.Out)

          .start();

        new TWEEN.Tween(card.rotation)
          .to(
            {
              y: Math.PI, //Math.PI / 2,
              x: -Math.PI / 2,
              z: 0,
            },
            time * 1.2
          )
          .easing(custom.ElasticOut)
          .start();
      });
    }
  }, [mode, scene]);

  const initialProps = useMemo(() => {
    return Array(CARD_COUNT)
      .fill(0)
      .map((_, i) => {
        const distance = fit(i, 4, 20);
        const angle = -Math.PI / 2 + fit(i * 10.95, -1.5, 1.5);

        return {
          rotation: [drand() * 3, drand() * 3, drand() * 3] as any,
          position: [
            Math.cos(angle) * distance,
            INITIAL_Y + fit(i, -INITIAL_H_AREA, INITIAL_H_AREA),
            Math.sin(angle) * distance,
          ] as any,
        };
      });
  }, []);

  return (
    <>
      {initialProps.map((props, i) => {
        return <FallingCard name={"card" + i} key={i} {...props} />;
      })}
    </>
  );
}
export function Scene() {
  useFrame((_, delta) => {
    TWEEN.update();
  });
  const spotLight = useRef<any>();

  return (
    <>
      <ambientLight color={"#FFF"} castShadow={false} intensity={Math.PI / 2} />
      <spotLight
        ref={spotLight}
        castShadow={true}
        position={[0, 40, 0]}
        angle={0.3}
        penumbra={1}
        decay={0}
        color={"#FFFFFF"}
        intensity={4}
      />

      <Floor />
    </>
  );
}

function Floor() {
  return (
    <mesh
      castShadow={false}
      rotation={new Euler(-Math.PI / 2, 0, 0)}
      receiveShadow
    >
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color={"#FFF"} />
    </mesh>
  );
}

// function Box(
//   props: ThreeElements["mesh"] & { rotate: boolean; scale: number }
// ) {
//   const ref = useRef<THREE.Mesh>(null!);
//   const [hovered, hover] = useState(false);
//   useFrame((_, delta) => {
//     if (props.rotate) {
//       ref.current.rotation.z += delta;
//     }
//   });
//   return (
//     <mesh
//       castShadow
//       receiveShadow
//       {...props}
//       ref={ref}
//       scale={props.scale}
//       onPointerOver={(_) => hover(true)}
//       onPointerOut={(_) => hover(false)}
//     >
//       <boxGeometry args={[2.5, 0.03, 3.5]} />
//       <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
//     </mesh>
//   );
// }
