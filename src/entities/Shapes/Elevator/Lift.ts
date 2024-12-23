import Matter from "matter-js";
import Game from "../../Game";
import { degreesToRadians } from "../../../utils/trignometry-utils";
import { ElementLabel } from "../../../types/elements";
import Color from "../../Color";
import TrapDoor from "../TrapDoor/TrapDoor";

const { Bodies, Body, World } = Matter;

export type LiftOptionsType = {
  openTime: number; // in ms
  rideSpeed: number;
  rideLength: number;
};

const LIFT_DEFAULT_OPTIONS = {
  openTime: 0,
  rideSpeed: 15,
  rideLength: 5,
};

export default class Lift {
  game: Game;
  body: Matter.Body | null = null;
  cannon: Matter.Body | null = null;
  x = 0;
  y = 0;
  width = 10;
  height = 4;
  angle = 0;
  options: LiftOptionsType = LIFT_DEFAULT_OPTIONS;
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

  create(
    x: number,
    y: number,
    width: number,
    height: number,
    angle?: number,
    options?: Partial<LiftOptionsType>
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.angle = angle ?? 90;

    this.options = {
      ...this.options,
      ...options,
      rideLength: options?.rideLength ? options.rideLength : this.width,
    };

    this.cannon = Bodies.rectangle(
      0,
      0,
      this.width,
      this.height,
      this.bodyOptions
    );

    this.body = Body.create({
      parts: [this.cannon],
      ...this.bodyOptions,
      label: ElementLabel.LIFT,
    });
    Body.setPosition(this.body, {
      x: this.x,
      y: this.y,
    });
    Matter.Body.setAngle(this.body, degreesToRadians(this.angle));

    World.add(this.game.engine.world, [this.body]);
    // console.log("added to the world")
  }

  startShoot(intervalT: number) {
    const interval = setInterval(() => this.shot(), intervalT);
    this.game.registerTimer(interval);
  }

  shot() {
    const body = this.body;
    // console.log("open trapdoor (slider)", body);
    if (!body) return;

    const { openTime } = this.options;

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
      const displacement = this.getTranslationValues(2);
      Matter.Body.setPosition(body, {
        x: body.position.x + displacement.x,
        y: body.position.y + displacement.y,
      });
    };

    const open = () => {
      if (index >= this.options.rideLength) {
        this.game.clearTimer(intervalOpen!);
        // wait before stat closing it
        const timeout = setTimeout(() => {
          intervalClose = setInterval(close, this.options.rideSpeed);
          this.game.registerTimer(intervalClose);
          this.game.clearTimer(timeout!);
        }, openTime);
        this.game.registerTimer(timeout);
        return;
      }
      index++;

      const displacement = this.getTranslationValues(-2);
      Matter.Body.setPosition(body, {
        x: body.position.x + displacement.x,
        y: body.position.y + displacement.y,
      });
    };

    // Start expanding
    intervalOpen = setInterval(open, this.options.rideSpeed);
    this.game.registerTimer(intervalOpen);
  }

  getTranslationValues(slideDistance: number): {
    x: number;
    y: number;
  } {
    const angleInRadians = this.angle * (Math.PI / 180);

    const unitVector = {
      x: Math.cos(angleInRadians),
      y: Math.sin(angleInRadians),
    };
    // console.log("unitVector", unitVector);
    const displacement = {
      x: unitVector.x * slideDistance,
      y: unitVector.y * slideDistance,
    };

    return displacement;
  }
}
