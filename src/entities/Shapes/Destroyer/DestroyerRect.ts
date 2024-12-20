import { World, Bodies } from "matter-js";
import { ElementLabel } from "../../../types/elements";
import Color from "../../Color";

export default class DestroyerRect {
  game: any;
  destroyer: any;
  x: number;
  y: number;
  width: number;
  height: number;
  angle: number;
  plugin: any;
  constructor(
    game: any,
    x: number,
    y: number,
    width: number,
    height: number,
    angle: number = 0,
    plugin?: any
  ) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.angle = angle;
    this.plugin = plugin;

    this.create();
  }
  create() {
    this.destroyer = Bodies.rectangle(this.x, this.y, this.width, this.height, {
      isStatic: true,
      label: ElementLabel.DESTROYER,
      plugin: this.plugin,
      render: { fillStyle: new Color("red", 1).rgb },
    });
    const rect = World.add(this.game.engine.world, this.destroyer);
  }
}
