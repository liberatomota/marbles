import Matter from "matter-js";
import Game from "../../Game";
import { degreesToRadians } from "../../../utils/trignometry-utils";
import { ElementLabel } from "../../../types/elements";
import Color from "../../Color";
import TrapDoor from "../TrapDoor/TrapDoor";
import DestroyerRect from "../Destroyer/DestroyerRect";

const { Bodies, Body, World, Constraint, Composites, Composite, Vector } = Matter;

export type LiftOptionsType = {
  openTime: number; // in ms
  rideSpeed: number;
  rideLength: number;
};

const CATAPULT_DEFAULT_OPTIONS = {
  openTime: 0,
  rideSpeed: 15,
  rideLength: 5,
};

export default class Catapult {
  game: Game;
  body: Matter.Body | null = null;
  x = 0;
  y = 0;
  width = 10;
  height = 4;
  angle = 0;
  options: LiftOptionsType = CATAPULT_DEFAULT_OPTIONS;
  bodyOptions = {
    riction: 0, // Low sliding friction
    frictionStatic: 0,
    isStatic: true,
    restitution: 1.5,
    render: { fillStyle: new Color("blue", 1).rgb },
  };
  constructor(game: Game) {
    this.game = game;
  }

  create(x: number, y: number, width: number, height: number, angle?: number, options?: Partial<LiftOptionsType>) {

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.angle = angle || 0;
    this.options = { ...CATAPULT_DEFAULT_OPTIONS, ...options };
    const pivotBaseY = y + height;

    // add bodies
    var group = Body.nextGroup(true);

    const catapult = Bodies.rectangle(x, y, width, height, { collisionFilter: { group: group }, render: { fillStyle: new Color("blue", 1).rgb } });

    const destroyer = new DestroyerRect(this.game, x + width / 4, y + width / 2, width, height);

    Composite.add(this.game.engine.world, [
      catapult,

      // targets base
      Bodies.rectangle(x - width / 4, y + height - width / 4, width / 2, 5, { isStatic: true, collisionFilter: { group: group }, render: { fillStyle: 'black' } }),

      // pivot base
      Bodies.rectangle(x, y, height, width / 2, { isStatic: true, collisionFilter: { group: group }, render: { fillStyle: '#060a19' } }),



      // brakes
      Bodies.rectangle(x - width / 4, y + height, width / 2, height, { isStatic: true, render: { fillStyle: 'black' } }),
      // Bodies.rectangle(x, pivotBaseY + width / 2 - 20, 10, 30, { isStatic: true, render: { fillStyle: '#060a19' } }),
      Bodies.rectangle(x + width / 2, y - height * 2, height, height * 3, { isStatic: true, render: { fillStyle: '#060a19' } }),
      Bodies.circle(x - 60, y - 60, 7),
      Constraint.create({
        bodyA: catapult,
        pointB: Vector.clone(catapult.position),
        stiffness: 1,
        length: 0
      })

    ]);
  }

  startShoot(intervalT: number) {
    const interval = setInterval(() => this.shot(), intervalT);
    this.game.registerTimer(interval);
  }

  shot() {
    console.log("Drop ball (catapult)", this.x, this.y);
    if (!this.x || !this.y) return;
    console.log("All good!")
    const weight = Bodies.circle(this.x + this.width / 3.5, this.y - this.width, 10, { density: 5, render: { fillStyle: new Color("blue", 1).rgb }, label: ElementLabel.WEIGHT });
    World.add(this.game.engine.world, weight);
  }
}
