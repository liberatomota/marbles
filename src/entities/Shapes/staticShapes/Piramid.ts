import Matter, { Composite } from "matter-js";
import Game from "../../Game";
import { degreesToRadians } from "../../../utils/trignometry-utils";

const { Bodies, Body, World } = Matter;

export default class Piramid {
  game: Game;
  constructor(game: Game) {
    this.game = game;
  }

  createPiramid() {
    const options = { friction: 0.1, frictionAir: 0.02, isStatic: true };
    const pX = this.game.width / 2;
    const pY = 125;

    const v1 = [
      { x: 0, y: 60 },
      { x: 20, y: 60 },
      { x:60, y: 12 },
      { x: 50, y: 0 },
    ];
    const topL = Bodies.fromVertices(-20, 0, [v1], options);

    const v2 = [
        { x: 30, y: 60 },
        { x: 70, y: 60 },
        { x:50, y: 37 },
      ];
      const middleB = Bodies.fromVertices(0, 20, [v2], options);

      const v3 = [
        { x: 55, y: 30 },
        { x: 80, y: 60 },
        { x: 100, y: 60 },
        { x: 65, y: 18 },
      ];
      const middleL = Bodies.fromVertices(24, 10, [v3], options);


    const piramid = Body.create({
      parts: [topL, middleB, middleL],
      friction: 0.1,
      frictionAir: 0.02,
      isStatic: true,
      label: "piramid",
    });

    Body.setPosition(piramid, {
        x: pX,
        y: pY,
    });

    Body.scale(piramid, 1.5, 1.5);
    World.add(this.game.engine.world, [piramid]);
    // Composite.add(this.game.engine.world, [piramid]);

    
    
    
}
}
