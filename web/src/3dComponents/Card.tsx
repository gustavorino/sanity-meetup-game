/* eslint-disable @typescript-eslint/no-namespace */
import { Image } from "@react-three/drei";
import { GroupProps, ReactThreeFiber, extend } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import { drand } from "../utils.tsx";

//taken from https://codesandbox.io/p/sandbox/cards-with-border-radius-9s2wd9?file=%2Fsrc%2Futil.js%3A1%2C1-55%2C1

// Paul West @prisoner849 https://discourse.threejs.org/u/prisoner849
// https://discourse.threejs.org/t/simple-curved-plane/26647/10

class CardGeometry extends THREE.PlaneGeometry {
  private _curveZ = 0.1;
  private _curveY = 0.1;

  public get curveZ() {
    return this._curveZ;
  }
  public set curveZ(value) {
    if (value === this._curveZ) {
      return;
    }
    this._curveZ = value;
    this.recreate();
  }

  public get curveY() {
    return this._curveY;
  }
  public set curveY(value) {
    if (value === this._curveY) {
      return;
    }
    this._curveY = value;
    this.recreate();
  }

  constructor() {
    super(2.5, 3.5, 25, 35);

    this.recreate();
  }

  recreate() {
    const pos = this.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      let z = 0;

      const distanceY = (y / this.parameters.height) * 2;
      const distanceX = (x / this.parameters.width) * 2;

      const offset = Math.PI / 2;

      const freqZ = 2;

      const freqY = 2;

      const curveZ =
        Math.sin(distanceY * freqZ + offset) * this.curveZ - this.curveZ;

      const curveY =
        Math.sin(distanceX * freqY + offset) * this.curveY - this.curveY;

      z += curveZ;
      z -= curveY;

      pos.setXYZ(i, x, y, z);
    }
    pos.needsUpdate = true;
  }
}

extend({ CardGeometry });

export function Card(props: GroupProps) {
  const params = useMemo(() => {
    return { curveZ: drand(0, 0.1), curveY: drand(-0.1, 0) };
  }, []);

  return (
    <>
      <group {...props}>
        <Image
          castShadow
          receiveShadow
          radius={0.222}
          side={THREE.BackSide}
          transparent
          url="/back.png"
        >
          <cardGeometry {...params}></cardGeometry>
        </Image>

        <Image
          castShadow
          radius={0.222}
          side={THREE.FrontSide}
          transparent
          url="http://localhost:3000/screenshot"
        >
          <cardGeometry {...params}></cardGeometry>
        </Image>
      </group>
    </>
  );
}

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
