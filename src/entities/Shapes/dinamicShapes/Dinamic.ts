import Matter, { World } from "matter-js";
import Konva from "konva";
import Game from "../../Game";
import Marble from "./Marble";
import Elevator from "./Elevator";
import { translatePosition } from "../../../utils/position-utils";
import TrapDoorSlider from "./TrapDoorSlider";

const { Composite } = Matter;

export default class Dinamic {
  game: Game;
  marble: Marble;
  bodies: Matter.Body[] = [];
  elements: Map<number, Konva.Node> = new Map();
  constructor(game: Game) {
    this.game = game;
    this.marble = new Marble();
  }

  addObjects() {
    const e1 = new Elevator(this.game);
    e1.create(
      { x: this.game.width / 2 + 100, y: 45 },
      { x: this.game.width / 2 + 100, y: 150 },
      { bucketShouldBounce: false }
    );

    const e2 = new Elevator(this.game);
    e2.create(
        { x: this.game.width - 100, y: 45 },
        { x: this.game.width - 100, y: 150 },
        { bucketShouldBounce: false }
      );

    // this.game.width / 2 + 100
    // const td3 = new TrapDoorSlider(this.game);
    // td3.create(this.game.width / 2 + 82, 150, 20, 4, 5, {
    //   openTime: 1000,
    // });
    // td3.startOpenTrapDoor(5000);
  }

  addMarble(x: number, y: number, radius: number) {
    const mMarble = this.marble.create(x, y, radius, "random", "marble");
    this.bodies.push(mMarble);
    World.add(this.game.engine.world, [mMarble]);

    const kMarble = new Konva.Circle({
      id: mMarble.id.toString(),
      x: mMarble.position.x,
      y: mMarble.position.y,
      radius,
      fill: mMarble.render.fillStyle,
    });
    this.elements.set(mMarble.id, kMarble);
    this.game.layer.add(kMarble);
    this.game.layer.draw();
  }
}
