import Matter from "matter-js";
import Game from "../../Game";
import {
  degreesToRadians,
  radiansToDegrees,
} from "../../../utils/trignometry-utils";
import { ElementLabel } from "../../../types/elements";

const { Body, World, Bodies, Composite } = Matter;

enum RotateToEnum {
  RIGHT = "right",
  LEFT = "left",
}

type DestroyerCirclesOptionsType = {
  rotateDirection: RotateToEnum;
  angleOffset: number;
  pathRadius: number;
  numCircles: number;
  bodyOption: Object;
};

const ELEVATOR_DEFAULT_OPTIONS: DestroyerCirclesOptionsType = {
  rotateDirection: RotateToEnum.LEFT,
  angleOffset: 1,
  pathRadius: 15,
  numCircles: 3,
  bodyOption: { friction: 0.01, frictionAir: 0.02, isStatic: true },
};

export default class Elevator {
  game: Game;
  destroyerCircles: Matter.Body | null = null;
  x: number = 0;
  y: number = 0;
  options: DestroyerCirclesOptionsType = ELEVATOR_DEFAULT_OPTIONS;
  constructor(game: Game, x: number, y: number, options?: any) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.options = {
      ...this.options,
      ...this.options,
    };

    this.create();
    setInterval(this.rotateCircles, 1000 / 10);
  }

  create() {
    // const pivot = Bodies.circle(this.x, this.y, 3, { isStatic: true });

    const circles: Matter.Body[] = [];
    const angleStep = (2 * Math.PI) / this.options.numCircles;

    for (let i = 0; i < this.options.numCircles; i++) {
      // Calculate the angle for the current circle
      const angle = i * angleStep;

      // Determine the x and y position using trigonometry
      const x = 0 + this.options.pathRadius * Math.cos(angle);
      const y = 0 + this.options.pathRadius * Math.sin(angle);

      const circle = Matter.Bodies.circle(x, y, 3, {
        label: ElementLabel.DESTROYER,
        isStatic: true,
      });

      circles.push(circle);
    }

    this.destroyerCircles = Body.create({
      parts: circles,
      isStatic: true,
    });

    Body.setPosition(this.destroyerCircles, {
      x: this.x,
      y: this.y,
    });

    World.add(this.game.engine.world, this.destroyerCircles);

    // return circles;
  }

  rotateCircles = () => {
    if (this.destroyerCircles) {
      Body.rotate(
        this.destroyerCircles,
        degreesToRadians(this.options.angleOffset)
      );
    }
  };
}
