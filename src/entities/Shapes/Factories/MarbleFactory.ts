import { Bodies, Body, World } from "matter-js";
import { marble as marbleOptions } from "../../../constants/world";
import { randomPosNeg, vx } from "../../../utils/physics-utils";
import Color from "../../Color";
import { ElementLabel } from "../../../types/elements";
import Game from "../../Game";

export default class MarbleFactory {
  game: Game;
  constructor(game: Game) {
    this.game = game;
  }

  create(x: number, y: number, radius: number, color: string = "random") {
    const _color = new Color(color, 1).rgb;

    const marble = Bodies.circle(x, y, radius, {
      ...marbleOptions,
      isStatic: false,
      label: ElementLabel.MARBLE,
      render: { fillStyle: _color },
    });
    // Body.setVelocity(marble, { x: vx(), y: 0 });
    // Body.setAngularVelocity(marble, randomPosNeg() / 8);
    World.add(this.game.engine.world, marble);
    return marble;
  }
}
