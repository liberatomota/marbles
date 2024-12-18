import Matter from "matter-js";
import Game from "../../Game";
import {
  degreesToRadians,
  radiansToDegrees,
} from "../../../utils/trignometry-utils";

const { Bodies, Body, World } = Matter;

export default class TrapDoor {
  game: Game;
  trapDoorBody: Matter.Body | null = null;
  x = 0;
  y = 0;
  width = 0;
  height = 0;
  angle = 0;
  handleOptions = {
    isStatic: false,
    collisionFilter: {
      group: -1, // Negative values isolate the part from collisions
    },
  };
  bodyOptions = { friction: 0.1, frictionAir: 0.02, isStatic: true };
  constructor(game: Game) {
    this.game = game;
  }

  create(x: number, y: number, width: number, height: number, angle?: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.angle = angle ?? 0;

    const trapdoor = Bodies.rectangle(
      this.width / 2,
      0,
      this.width,
      this.height,
      this.bodyOptions
    );
    const pivot = Bodies.circle(0, 0, 2, this.bodyOptions);
    const lever = Bodies.circle(-this.width / 2, 0, 2, this.bodyOptions);
    this.trapDoorBody = Body.create({
      parts: [lever, pivot, trapdoor],
      ...this.bodyOptions,
      label: "trapdoor",
    });
    Body.setPosition(this.trapDoorBody, {
      x: this.x,
      y: this.y,
    });
    Matter.Body.setAngle(this.trapDoorBody, degreesToRadians(this.angle));

    World.add(this.game.engine.world, [this.trapDoorBody]);
  }

  startOpenTrapDoor(interval: number) {
    setInterval(() => this.openTrapDoor(), interval);
  }

  openTrapDoor() {
    console.log("open trapdoor", this.trapDoorBody);
    if (!this.trapDoorBody) return;

    const body = this.trapDoorBody;

    const maxIndex = 90;
    let index = 0;
    let intervalOpen: NodeJS.Timeout | null = null;
    let intervalClose: NodeJS.Timeout | null = null;

    const close = () => {
      if (index <= 0) {
        clearInterval(intervalClose!);
        intervalClose = null;
        return;
      }
      index--;
      const cDegrees = radiansToDegrees(body.angle);
      Matter.Body.setAngle(body, degreesToRadians(cDegrees + 1));
    };

    const open = () => {
      if (index >= maxIndex) {
        clearInterval(intervalOpen!);
        intervalOpen = null;
        intervalClose = setInterval(close, 10);
        return;
      }
      index++;
      const cDegrees = radiansToDegrees(body.angle);
      Matter.Body.setAngle(body, degreesToRadians(cDegrees - 1));
    };

    // Start expanding
    intervalOpen = setInterval(open, 20);
  }
}
