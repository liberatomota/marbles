import Matter from "matter-js";
import Game from "../../Game";
import {
  degreesToRadians,
  radiansToDegrees,
} from "../../../utils/trignometry-utils";
import { ElementLabel } from "../../../types/elements";

const { Bodies, Body, World } = Matter;

export type TrapDoorOptionsType = {
  openTime: number; // in ms
};

const TRAPDOOR_DEFAULT_OPTIONS = {
  openTime: 0,
};

export default class TrapDoorSlider {
  game: Game;
  trapDoorSliderBody: Matter.Body | null = null;
  trapdoors: Matter.Body[] = [];
  x = 0;
  y = 0;
  width = 0;
  height = 0;
  angle = 0;
  options: TrapDoorOptionsType = TRAPDOOR_DEFAULT_OPTIONS;
  bodyOptions = { friction: 0.1, frictionAir: 0.02, isStatic: true };
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

    const trapdoor1 = Bodies.rectangle(
      this.width / 2,
      0,
      this.width,
      this.height,
      this.bodyOptions
    );
    const trapdoor2 = Bodies.rectangle(
      -(this.width / 2),
      0,
      this.width,
      this.height,
      this.bodyOptions
    );
    this.trapdoors = [trapdoor1, trapdoor2];
    const pivot = Bodies.circle(0, 0, 2, this.bodyOptions);
    // const lever = Bodies.circle(-this.width / 2, 0, 1, this.bodyOptions);
    this.trapDoorSliderBody = Body.create({
      parts: [...this.trapdoors],
      ...this.bodyOptions,
      label: ElementLabel.TRAPDOOR_SLIDER,
    });
    Body.setPosition(this.trapDoorSliderBody, {
      x: this.x,
      y: this.y,
    });
    Matter.Body.setAngle(this.trapDoorSliderBody, degreesToRadians(this.angle));

    World.add(this.game.engine.world, [this.trapDoorSliderBody]);
  }

  startOpenTrapDoor(interval: number) {
    setInterval(() => this.openTrapDoor(), interval);
  }

  openTrapDoor() {
    const body = this.trapDoorSliderBody;
    // console.log("open trapdoor", body);
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
      this.trapdoors.forEach((trapdoor, i) => {
        const slideDistance = i === 0 ? -1 : 1;
        const displacement = this.getTranslationValues(slideDistance);
        Matter.Body.setPosition(trapdoor, {
          x: trapdoor.position.x + displacement.x,
          y: trapdoor.position.y + displacement.y,
        });
      });
    };

    const open = () => {
      if (index >= this.width / 2) {
        clearInterval(intervalOpen!);
        intervalOpen = null;
        // wait before stat closing it
        setTimeout(() => {
          intervalClose = setInterval(close, 30);
        }, openTime);
        return;
      }
      index++;

      this.trapdoors.forEach((trapdoor, i) => {
        const slideDistance = i === 0 ? 1 : -1;
        const displacement = this.getTranslationValues(slideDistance);
        Matter.Body.setPosition(trapdoor, {
          x: trapdoor.position.x + displacement.x,
          y: trapdoor.position.y + displacement.y,
        });
      });
    };

    // Start expanding
    intervalOpen = setInterval(open, 30);
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
