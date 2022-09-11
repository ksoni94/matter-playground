import { Bodies, Body, Composite, Engine, Render, Runner } from "matter-js";
import { useEffect, useRef } from "react";
import { Button } from "../Button";

export const Canon = ({ haveGround }: { haveGround?: boolean }) => {
  const scene = useRef<HTMLDivElement>();
  const engine = useRef(Engine.create());
  const clientWidth = document.body.clientWidth;
  const clientHeight = document.body.clientHeight;

  useEffect(() => {
    const render = Render.create({
      element: scene.current,
      engine: engine.current,
      options: {
        width: clientWidth,
        height: clientHeight,
        wireframes: false,
        background: "transparent",
      },
    });

    // add a ground if needed
    if (haveGround) {
      Composite.add(engine.current.world, [
        Bodies.rectangle(clientWidth / 2, clientHeight + 10, clientWidth, 20, {
          isStatic: true,
        }),
      ]);
    }

    // run the engine
    Runner.run(engine.current);
    Render.run(render);

    // unmount
    return () => {
      Render.stop(render);
      Composite.clear(engine.current.world, true);
      Engine.clear(engine.current);
      render.canvas.remove();
      //@ts-ignore
      render.canvas = null;
      //@ts-ignore
      render.context = null;
      render.textures = {};
    };
  });

  const shapeRadiusArray = [
    [13, 13, 0, 0],
    [13, 13, 13, 13],
    [0, 0, 13, 13],
    [13, 0, 13, 0],
  ];

  const handleShootCanonBall = () => {
    const startAt = performance.now();
    const timePerFrame = 1000 / 1000;
    const duration = 150;

    let timeoutId = window.setInterval(() => {
      if (performance.now() - startAt > duration) {
        window.clearInterval(timeoutId);
        return;
      }

      const pickShape =
        shapeRadiusArray[Math.floor(Math.random() * shapeRadiusArray.length)];
      const ball = Bodies.rectangle(clientWidth, clientHeight, 26, 26, {
        chamfer: { radius: pickShape },
      });

      Body.setVelocity(ball, {
        x: -15,
        y: -20,
      });

      Body.setAngularVelocity(ball, Math.random() * -0.4);

      Composite.add(engine.current.world, [ball]);
    }, timePerFrame);
  };

  return (
    <div className="h-full w-full flex justify-center items-center relative">
      <Button onClick={handleShootCanonBall}>Shoot some Nousfetti</Button>
      <div
        //@ts-ignore
        ref={scene}
        className="absolute top-0 left-0 -z-10"
      ></div>
    </div>
  );
};
