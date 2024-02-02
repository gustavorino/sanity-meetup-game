/* eslint-disable @typescript-eslint/no-namespace */
import { Image } from "@react-three/drei";
import { ReactThreeFiber, extend } from "@react-three/fiber";
import * as THREE from "three";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      cardGeometry: ReactThreeFiber.Object3DNode<
        CardGeometry,
        typeof CardGeometry
      >;
    }
  }
}

//taken from https://codesandbox.io/p/sandbox/cards-with-border-radius-9s2wd9?file=%2Fsrc%2Futil.js%3A1%2C1-55%2C1

// Paul West @prisoner849 https://discourse.threejs.org/u/prisoner849
// https://discourse.threejs.org/t/simple-curved-plane/26647/10
class CardGeometry extends THREE.PlaneGeometry {
  constructor() {
    super(2.5, 3.5, 10, 2020);

    const pos = this.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      let z = pos.getZ(i);

      const distanceY = (y / this.parameters.height) * 2;
      const distanceX = (x / this.parameters.width) * 2;

      const offset = Math.PI / 2;
      const freqZ = 2;
      const scaleZ = 0.1;

      const freqY = 1;
      const scaleY = 0.5;

      const curveZ = Math.sin(distanceY * freqZ + offset) * scaleZ - scaleZ;
      const curveY = Math.cos(distanceX * freqY + offset) * scaleY - scaleY;

      if (distanceY === 0) {
        console.log({ curveY, curveZ });
      }
      z += curveZ;
      z -= curveY;

      pos.setXYZ(i, x, y, z);
    }
    pos.needsUpdate = true;
  }
}

extend({ CardGeometry });

export function Card() {
  return (
    <>
      <group position={[0, 5, 0]}>
        <Image
          castShadow
          radius={0.222}
          side={THREE.BackSide}
          transparent
          url="/card-red.png"
        >
          <cardGeometry></cardGeometry>
        </Image>

        <Image
          castShadow
          radius={0.222}
          side={THREE.FrontSide}
          transparent
          url="/card-front.png"
        >
          <cardGeometry></cardGeometry>
        </Image>
      </group>
    </>
  );
}
