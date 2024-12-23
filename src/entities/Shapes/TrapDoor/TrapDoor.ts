import Matter from "matter-js";
import Game from "../../Game";
import {
  degreesToRadians,
  radiansToDegrees,
} from "../../../utils/trignometry-utils";
import { ElementLabel } from "../../../types/elements";
import Color from "../../Color";

const { Bodies, Body, World } = Matter;

export type TrapDoorOptionsType = {
  maxAngle: number; // in degrees
  openTime: number; // in ms
};

const TRAPDOOR_DEFAULT_OPTIONS = {
  maxAngle: 90,
  openTime: 0,
};

export default class TrapDoor {
  game: Game;
  body: Matter.Body | null = null;
  x = 0;
  y = 0;
  width = 0;
  height = 4;
  angle = 0;
  options: TrapDoorOptionsType = TRAPDOOR_DEFAULT_OPTIONS;
  bodyOptions = { friction: 0, frictionStatic: 0, isStatic: true, render: { fillStyle: new Color("orange", 1).rgb } };
  constructor(game: Game) {
    this.game = game;
  }

  create(
    x: number,
    y: number,
    width: number,
    height: number,
    angle?: number,
    options?: Partial<TrapDoorOptionsType>
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.angle = angle ?? 0;

    this.options = {
      ...this.options,
      ...options,
    };

    const trapdoor = Bodies.rectangle(
      this.width / 2,
      0,
      this.width,
      this.height,
      this.bodyOptions
    );
    const pivot = Bodies.circle(0, 0, 2, this.bodyOptions);
    const lever = Bodies.circle(-this.width / 2, 0, 1, this.bodyOptions);
    this.body = Body.create({
      parts: [lever, pivot, trapdoor],
      ...this.bodyOptions,
      label: ElementLabel.TRAPDOOR,
    });
    Body.setPosition(this.body, {
      x: this.x,
      y: this.y,
    });
    Matter.Body.setAngle(this.body, degreesToRadians(this.angle));

    World.add(this.game.engine.world, [this.body]);
  }

  startOpenTrapDoor(intervalNumber: number) {
    const interval = setInterval(() => this.openTrapDoor(), intervalNumber);
    this.game.registerTimer(interval);
  }

  openTrapDoor() {
    const body = this.body;
    // console.log("open trapdoor", body);
    if (!body) return;

    const { maxAngle, openTime } = this.options;

    let index = 0;
    let intervalOpen: NodeJS.Timeout | null = null;
    let intervalClose: NodeJS.Timeout | null = null;
    let timeout: NodeJS.Timeout | null = null;

    const close = () => {
      if (index <= 0) {
        this.game.clearTimer(intervalClose!);
        intervalClose = null;
        return;
      }
      index--;
      const cDegrees = radiansToDegrees(body.angle);
      Matter.Body.setAngle(body, degreesToRadians(cDegrees + 1));
    };

    const open = () => {
      if (index >= maxAngle) {
        this.game.clearTimer(intervalOpen!);
        // wait before stat closing it
        const timeout = setTimeout(() => {
          intervalClose = setInterval(close, 10);
          this.game.registerTimer(intervalClose);
          this.game.clearTimer(timeout!);
        }, openTime);
        this.game.registerTimer(timeout);
        return;
      }
      index++;
      const cDegrees = radiansToDegrees(body.angle);
      Matter.Body.setAngle(body, degreesToRadians(cDegrees - 1));
    };

    // Start expanding
    intervalOpen = setInterval(open, 10);
    this.game.registerTimer(intervalOpen);
  }
}
