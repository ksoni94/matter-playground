import { Bodies, Composite, Engine, Render, Runner } from "matter-js";

import { useEffect, useRef } from "react";

export const BouncingBalls = () => {
  const scene = useRef<HTMLDivElement>();
  const engine = useRef(Engine.create());
  const isPressed = useRef(false);

  useEffect(() => {
    const clientWidth = document.body.clientWidth;
    const clientHeight = document.body.clientHeight;

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

    // boundaries
    Composite.add(engine.current.world, [
      Bodies.rectangle(clientWidth / 2, -10, clientWidth, 20, {
        isStatic: true,
      }),
      Bodies.rectangle(-10, clientHeight / 2, 20, clientHeight, {
        isStatic: true,
      }),
      Bodies.rectangle(clientWidth / 2, clientHeight + 10, clientWidth, 20, {
        isStatic: true,
      }),
      Bodies.rectangle(clientWidth + 10, clientHeight / 2, 20, clientHeight, {
        isStatic: true,
      }),
    ]);

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

  const handleDown = () => {
    isPressed.current = true;
  };

  const handleUp = () => {
    isPressed.current = false;
  };

  const handleAddCircle = (e: MouseEvent) => {
    if (isPressed.current) {
      const ball = Bodies.circle(
        e.clientX,
        e.clientY,
        10 + Math.random() * 30,
        {
          mass: 10,
          restitution: 0.9,
          friction: 0.0005,
          render: {
            fillStyle: "#32a838",
          },
        }
      );
      Composite.add(engine.current.world, [ball]);
    }
  };

  return (
    <div
      className="h-full w-full flex justify-center items-center"
      onMouseDown={handleDown}
      onMouseUp={handleUp}
      //@ts-ignore
      onMouseMove={handleAddCircle}
    >
      <div
        // @ts-ignore
        ref={scene}
        onMouseDown={handleDown}
        onMouseUp={handleUp}
        //@ts-ignore
        onMouseMove={handleAddCircle}
        className=""
      ></div>
    </div>
  );
};
