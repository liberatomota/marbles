import Matter from "matter-js";
import Konva from "konva";
import Game from "./Game";
import { translatePosition } from "../utils/position-utils";
import { radiansToDegrees } from "../utils/trignometry-utils";
import { ElementLabel } from "../types/elements";

const Engine = Matter.Engine;
const Composite = Matter.Composite;

export default class Animate {
  game: Game;
  // instance: Konva.Animation;

  lastRenderTime = 0;
  renderInterval = 30;
  constructor(game: Game) {
    this.game = game;
    // this.instance = new Konva.Animation(this.animate, this.game.layer);
    // this.instance.start();
  }

  animate = (frame: any) => {
    this.checkOffscreen();

    if (this.shouldWait(frame)) {
      Engine.update(this.game.engine);
      return;
    }


    const bodies = this.game.engine.world.bodies;
    // console.log("bodies", bodies)

    for (let i = 0; i < bodies.length; i++) {
      const body = bodies[i];
      if (["ground", "piramid"].includes(body.label)) {
      }

      if (body.label === ElementLabel.MARBLE) {
        // const circle = new Konva.Circle({
        //   x: body.position.x,
        //   y: body.position.y,
        //   radius: body.circleRadius,
        //   fill: "red",
        // })
        // this.game.layer.add(circle);
      }
      if (body.label.includes("elevator")) {
        console.log(body);
      }
    }

    // Engine.update(this.game.engine);
  };

  checkOffscreen = () => {
    this.game.engine.world.bodies.forEach((body) => {
      if (body.position.y > this.game.height || body.position.y < 0) {
        console.log("REMOVED", body);
        Composite.remove(this.game.engine.world, body);
      }
    });
  };

  shouldWait = (frame: any) => {
    let wait = true;
    if (frame.time - this.lastRenderTime >= this.renderInterval) {
      this.lastRenderTime = frame.time;
      wait = false;
    }
    return wait;
  };
}
