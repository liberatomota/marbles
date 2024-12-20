import { World, Bodies } from "matter-js";
import { ElementLabel } from "../../../types/elements";

export default class DestroyerRect {
  game: any;
  destroyer: any;
  x: number;
  y: number;
  width: number;
  height: number;
  angle: number;
  constructor(
    game: any,
    x: number,
    y: number,
    width: number,
    height: number,
    angle: number = 0
  ) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.angle = angle;

    this.create();
  }
  create() {
    this.destroyer = Bodies.rectangle(this.x, this.y, this.width, this.height, {
      isStatic: true,
      label: ElementLabel.DESTROYER,
    });
    World.add(this.game.engine.world, this.destroyer);
  }
}
