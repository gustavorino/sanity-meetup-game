import { extend } from "@react-three/fiber";
import * as THREE from "three";

//taken from https://codesandbox.io/p/sandbox/cards-with-border-radius-9s2wd9?file=%2Fsrc%2Futil.js%3A1%2C1-55%2C1

// Paul West @prisoner849 https://discourse.threejs.org/u/prisoner849
// https://discourse.threejs.org/t/simple-curved-plane/26647/10
class BentPlaneGeometry extends THREE.PlaneGeometry {
  constructor(radius: any, ...args: any) {
    console.log({ radius });
    super(...args);
    const p = this.parameters;
    const hw = p.width * 0.5;
    const a = new THREE.Vector2(-hw, 0);
    const b = new THREE.Vector2(0, radius);
    const c = new THREE.Vector2(hw, 0);
    const ab = new THREE.Vector2().subVectors(a, b);
    const bc = new THREE.Vector2().subVectors(b, c);
    const ac = new THREE.Vector2().subVectors(a, c);
    const r =
      (ab.length() * bc.length() * ac.length()) / (2 * Math.abs(ab.cross(ac)));
    const center = new THREE.Vector2(0, radius - r);
    const baseV = new THREE.Vector2().subVectors(a, center);
    const baseAngle = baseV.angle() - Math.PI * 0.5;
    const arc = baseAngle * 2;
    const uv = this.attributes.uv;
    const pos = this.attributes.position;
    const mainV = new THREE.Vector2();
    for (let i = 0; i < uv.count; i++) {
      const uvRatio = 1 - uv.getX(i);
      const y = pos.getY(i);
      mainV.copy(c).rotateAround(center, arc * uvRatio);
      pos.setXYZ(i, mainV.x, y, -mainV.y);
    }
    pos.needsUpdate = true;
  }
}

extend({ BentPlaneGeometry });
