import Matter from "matter-js";
import Game from "./Game";
import { ElementLabel } from "../types/elements";

const { Events, World, Body } = Matter;
const { DESTROYER, MARBLE, WEIGHT } = ElementLabel;

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
        (bodyA.label === DESTROYER && [MARBLE, WEIGHT].includes(bodyB.label)) ||
        ([MARBLE, WEIGHT].includes(bodyA.label) && bodyB.label === DESTROYER)
      ) {


        if (bodyA.label === WEIGHT || bodyB.label === WEIGHT) {
          const weight = bodyA.label === WEIGHT ? bodyA : bodyB;
          Matter.World.remove(this.game.engine.world, weight);
          console.log("Removed:", weight.label);
        } else {

          
          const marble = bodyA.label === MARBLE ? bodyA : bodyB;
          const destroyer = bodyA.label === DESTROYER ? bodyA : bodyB;
          
          console.log("marble", marble);
          console.log("destroyer", destroyer);
          
          if (destroyer.plugin.nextPosition) {
            const { nextPosition } = destroyer.plugin;
            console.log("nextPosition", nextPosition);
            Body.setPosition(marble, nextPosition);
          } else {
            Matter.World.remove(this.game.engine.world, marble);
            console.log("Removed:", marble.label);
          }
        }
      }
    });
  };
}
