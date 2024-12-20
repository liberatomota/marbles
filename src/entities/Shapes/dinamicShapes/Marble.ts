import { Bodies, Body, World } from "matter-js";
import { marble as marbleOptions } from "../../../constants/world";
import { randomPosNeg, vx } from "../../../utils/physics-utils";
import Color from "../../Color";
import { ElementLabel } from "../../../types/elements";
import Game from "../../Game";

export default class Marble {
  game: Game;
  x: number;
  y: number;
  radius: number;
  color: string;
  marble: Matter.Body;
  constructor(game: Game, x: number, y: number, radius: number, color: string) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = new Color(color, 1).rgb;

    this.marble = Bodies.circle(this.x, this.y, this.radius, {
      ...marbleOptions,
      isStatic: false,
      label: ElementLabel.MARBLE,
      render: { fillStyle: this.color },
    });
    // Body.setVelocity(marble, { x: vx(), y: 0 });
    // Body.setAngularVelocity(marble, randomPosNeg() / 8);
    World.add(this.game.engine.world, this.marble);
  }
}
