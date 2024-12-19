import Matter from "matter-js";
import Game from "./Game";

const { Events, World, Body } = Matter;

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
        console.log(bodyA.label, bodyB.label);
      // Check if either body has the 'target' label and the other is 'X'
      if (
        (bodyA.label === "destroyer" && bodyB.label === "marble") ||
        (bodyA.label === "marble" && bodyB.label === "destroyer")
      ) {
        // Remove the element with label 'X'
        const bodyToRemove = bodyA.label === "marble" ? bodyA : bodyB;

        Matter.World.remove(this.game.engine.world, bodyToRemove);
        console.log("Removed:", bodyToRemove.label);
      }
    });
  };
}
