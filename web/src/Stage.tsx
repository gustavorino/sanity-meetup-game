/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { OrbitControls, OrbitControlsProps } from "@react-three/drei";
import { Canvas, GroupProps, useFrame, useThree } from "@react-three/fiber";
import TWEEN, { Easing, Interpolation } from "@tweenjs/tween.js";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Euler, Group, Quaternion, Vector3 } from "three";
import "./3dComponents/Card.tsx";
import { Card } from "./3dComponents/Card.tsx";
import { useGlobalState } from "./State.tsx";
import { Floor } from "./components/Floor.tsx";
import { PPEffecs } from "./components/PPEffects.tsx";
import {
  CARD_COUNT,
  COLS,
  FALL_SPEED,
  INITIAL_H_AREA,
  INITIAL_Y,
} from "./consts.ts";
import { SanityCard } from "./sanity.ts";
import "./utils.tsx";
import { drand, fit } from "./utils.tsx";

const cardNames = Array(CARD_COUNT)
  .fill(0)
  .map((_, i) => `card${i}`);

const xOffset = 3 * ((COLS - 2) / 2);
const zOffset = 4;

const deckPositions = cardNames.reduce((acc, _, i) => {
  const row = Math.floor(i / (COLS - 1));
  const col = i % (COLS - 1);

  acc[i] = new Vector3(col * 3 - xOffset, 0.075, row * 4 - zOffset);
  return acc;
}, {} as Record<number, Vector3>);

const deckRotation = new Euler(-Math.PI / 2, Math.PI, 0);
const deckRotationOpened = new Euler(-Math.PI / 2, 0, 0);

export function Stage() {
  const orbitControls = useRef<OrbitControlsProps>(null);
  const { mode } = useGlobalState();
  useEffect(() => {
    if (mode === "cards" && orbitControls.current) {
      new TWEEN.Tween(orbitControls.current.target || {})
        .to({ x: 0, y: 0, z: 2 }, 2500)
        .easing(TWEEN.Easing.Sinusoidal.InOut)
        .start();
      new TWEEN.Tween(orbitControls.current.object!.position)
        .to({ x: 0, y: 12, z: 12 }, 2500)
        .easing(TWEEN.Easing.Sinusoidal.InOut)
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
      <OrbitControls
        zoomToCursor={false}
        enablePan={false}
        enableRotate={false}
        enableZoom={false}
        enableDamping={false}
        ref={orbitControls as any}
        target={[0, INITIAL_Y, 0]}
      />
      <Cards />
    </Canvas>
  );
}

function FallingCard(props: GroupProps & { id: number }) {
  const { name, id, ...rest } = props;
  const { scene } = useThree();
  const moveForward = useCardAnimationForward();
  const moveBack = useCardAnimationBack();

  const { currentCard, closeCard, openCard, mode, cards } = useGlobalState();

  const card = cards[id];

  const isCardSelected = currentCard === id;

  useEffect(() => {
    if (mode !== "cards") {
      return;
    }
    if (isCardSelected) {
      moveForward(scene.getObjectByName(name!), id);
    } else {
      moveBack(scene.getObjectByName(name!), id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCardSelected, mode]);

  const onCardClick = useCallback(() => {
    if (currentCard !== undefined) {
      closeCard();
    } else {
      card && openCard(id);
    }
  }, [currentCard, closeCard, card, openCard, id]);

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

      ref.current.position.y -= delta * 10 * FALL_SPEED;
      ref.current.rotation.x += consts.x * delta * FALL_SPEED;
      ref.current.rotation.y += consts.y * delta * FALL_SPEED;
      ref.current.rotation.z += consts.z * delta * FALL_SPEED;
    }
  });

  // useEffect(() => {
  //   if (mode == "cards") {
  //   }
  // }, [mode]);

  return (
    <group onClick={onCardClick} name={name} {...rest} ref={ref}>
      <Card card={card} />
    </group>
  );
}

function Cards() {
  const { mode } = useGlobalState();
  const { scene } = useThree();

  useEffect(() => {
    if (mode === "cards") {
      cardNames.forEach((name, id) => {
        const card = scene.getObjectByName(name)!;

        const time = 1000 + card.position.y * 50;
        const z = deckPositions[id].z;
        const x = deckPositions[id].x;
        const y = deckPositions[id].y;

        new TWEEN.Tween(card.position)
          .to(
            {
              y: y,
              z: [card.position.z, z * 5, z],
              x: [card.position.x, x * 6, x],
            },
            time
          )
          .interpolation(Interpolation.Bezier)
          .easing(Easing.Sinusoidal.Out)

          .start();

        const qFrom = new Quaternion();
        qFrom.setFromEuler(card.rotation);

        const qTo = new Quaternion();
        qTo.setFromEuler(deckRotation);

        new TWEEN.Tween({ t: 0 })
          .to(
            {
              t: 1,
            },
            time
          )
          .easing(Easing.Back.InOut)
          .onUpdate(({ t }) => {
            const qNew = new Quaternion();
            qNew.slerpQuaternions(qFrom, qTo, t);
            card.rotation.copy(new Euler().setFromQuaternion(qNew));
          })
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
            INITIAL_Y +
              fit(
                drand(-INITIAL_H_AREA, INITIAL_H_AREA),
                -INITIAL_H_AREA,
                INITIAL_H_AREA
              ),
            Math.sin(angle) * distance,
          ] as any,
        };
      });
  }, []);

  return (
    <>
      {initialProps.map((props, i) => {
        return <FallingCard id={i} name={"card" + i} key={i} {...props} />;
      })}
    </>
  );
}

export function Scene() {
  useFrame(() => {
    TWEEN.update();
  });

  return (
    <>
      <PPEffecs />
      <ambientLight color={"#FFF"} castShadow={false} intensity={Math.PI / 2} />
      <spotLight
        castShadow={true}
        position={[0, 40, 0]}
        angle={0.3}
        penumbra={1}
        decay={0}
        color={"#FFFFFF"}
        intensity={4}
      />

      <CardPlaceholder />

      <Floor />
    </>
  );
}

const placeHolderCard: SanityCard = { _id: "placeholder", body: [], topic: "" };
function CardPlaceholder() {
  const { scene, camera } = useThree();
  useFrame(() => {
    const obj = scene.getObjectByName("placeholder")!;

    const dist = 6;
    const cwd = new Vector3();

    camera.getWorldDirection(cwd);

    cwd.multiplyScalar(dist);

    cwd.add(camera.position);

    obj.position.set(cwd.x, cwd.y, cwd.z);
    obj.setRotationFromQuaternion(camera.quaternion);

    obj.lookAt(camera.position);

    const a = obj.localToWorld(new Vector3(0, 0, 0));
    const b = obj.localToWorld(new Vector3(3, 0, 0));

    obj.position.add(a.sub(b));
  });
  return (
    <Card card={placeHolderCard} visible={false} name="placeholder"></Card>
  );
}

function useCardAnimationForward() {
  const { scene } = useThree();
  return useCallback(
    (card: any, id: number) => {
      const placeholder = scene.getObjectByName("placeholder")!;

      new TWEEN.Tween(card.position)
        .to(
          {
            ...placeholder.position,
            y: [placeholder.position.y, placeholder.position.y],
          },
          500
        )
        .easing(Easing.Quadratic.InOut)
        .interpolation(Interpolation.Bezier)
        .start();

      const qFrom = new Quaternion();
      qFrom.setFromEuler(card.rotation);

      const qTo = new Quaternion();
      qTo.setFromEuler(placeholder.rotation);

      new TWEEN.Tween({ t: 0 })
        .to({ t: 1 }, 500)
        .easing(Easing.Quadratic.InOut)
        .onUpdate(({ t }) => {
          const qNew = new Quaternion();
          qNew.slerpQuaternions(qFrom, qTo, t);
          card.rotation.copy(new Euler().setFromQuaternion(qNew));
        })
        .start();
    },
    [scene]
  );
}

function useCardAnimationBack() {
  const { openedMap } = useGlobalState();

  return useCallback(
    (card: any, id: number) => {
      const wasOpened = openedMap[id];

      new TWEEN.Tween(card.position)
        .to(
          {
            ...deckPositions[id],
            y: [
              card.position.y,
              card.position.y,
              deckPositions[id].y + (wasOpened ? 0.2 : 0),
            ],
          },
          500
        )
        .interpolation(Interpolation.Bezier)
        .easing(Easing.Quadratic.InOut)
        .start();

      const qFrom = new Quaternion();
      qFrom.setFromEuler(card.rotation);

      const qTo = new Quaternion();
      qTo.setFromEuler(wasOpened ? deckRotationOpened : deckRotation);

      new TWEEN.Tween({ t: 0 })
        .to({ t: 1 }, 500)
        .easing(Easing.Quadratic.InOut)
        .onUpdate(({ t }) => {
          const qNew = new Quaternion();
          qNew.slerpQuaternions(qFrom, qTo, t);
          card.rotation.copy(new Euler().setFromQuaternion(qNew));
        })
        .start();
    },
    [openedMap]
  );
}
