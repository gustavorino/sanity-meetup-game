import { Euler } from "three";

export function Floor() {
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
