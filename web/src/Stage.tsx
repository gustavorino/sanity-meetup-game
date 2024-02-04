/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { OrbitControls, useHelper } from "@react-three/drei";
import { Canvas, GroupProps, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Euler, Group, PointLightHelper, SpotLightHelper } from "three";
import "./3dComponents/Card.tsx";
import { Card } from "./3dComponents/Card.tsx";
import { useGlobalState } from "./State.tsx";
import "./utils.tsx";
import { drand, fit } from "./utils.tsx";

const INITIAL_Y = 30;
const INITIAL_H_AREA = 12;
const SLOW_MO = 1.1;

export function Stage() {
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
      <OrbitControls target={[0, INITIAL_Y, 0]} />
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

  useFrame((state, delta) => {
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
  const initialProps = useMemo(() => {
    return Array(20)
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
        return <FallingCard key={i} {...props} />;
      })}
    </>
  );
}

export function Scene() {
  const spotLight = useRef<any>();
  const pointLight = useRef<any>();

  useHelper(spotLight, SpotLightHelper, "red");
  useHelper(pointLight, PointLightHelper, 2, "blue");
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

      <group rotation={[0, Math.PI / 2 + 0.05, 0]}>
        <Card />
      </group>

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
