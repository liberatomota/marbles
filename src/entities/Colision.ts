import Matter from "matter-js";
import Game from "./Game";
import { ElementLabel } from "../types/elements";

const { Events, World, Body } = Matter;
const { DESTROYER, MARBLE } = ElementLabel;

export default class Colision {
  game: Game;
  constructor(game: Game) {
    this.game = game;

    this.init();
  }

  init() {
    Matter.Events.on(this.game.engine, "collisionStart", this.collisionStart);
  }

  collisionStart = (event: any) => {
    const pairs = event.pairs;

    pairs.forEach((pair: any) => {
      const { bodyA, bodyB } = pair;
    //   console.log(bodyA.label, bodyB.label);
      if (
        (bodyA.label === DESTROYER && bodyB.label === MARBLE) ||
        (bodyA.label === MARBLE && bodyB.label === DESTROYER)
      ) {
        const bodyToRemove = bodyA.label === MARBLE ? bodyA : bodyB;

        Matter.World.remove(this.game.engine.world, bodyToRemove);
        console.log("Removed:", bodyToRemove.label);
      }
    });
  };
}
