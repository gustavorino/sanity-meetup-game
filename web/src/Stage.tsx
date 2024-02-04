/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { OrbitControls, useHelper } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import { Euler, PointLightHelper, SpotLightHelper } from "three";

import "./3dComponents/Card.tsx";
import { Card } from "./3dComponents/Card.tsx";
import "./utils.tsx";

export function Stage() {
  return (
    <Canvas
      camera={{
        position: [0, 0, 6],
      }}
      shadows
    >
      <Scene />
      <OrbitControls />
    </Canvas>
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
