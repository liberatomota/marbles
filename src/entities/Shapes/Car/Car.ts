import { World, Bodies, Body, Composite, Constraint } from "matter-js";
import Game from "../../Game";
import { degreesToRadians } from "../../../utils/trignometry-utils";
import { ElementLabel } from "../../../types/elements";

export type CarOptionsType = {
  wheelBase: number;
  wheelAOffset: number;
  wheelBOffset: number;
  wheelYOffset: number;
  wheelSize: number;
};

const scale = 0.9;

const CAR_OPTIONS_DEFAULT = {
  wheelBase: 4,
  wheelAOffset: -20 * 0.5 + 20,
  wheelBOffset: 20 * 0.5 - 20,
  wheelYOffset: 0,
  wheelSize: 5 * scale,
};

export default class Car {
  game: Game;
  car: Matter.Composite;
  x: number;
  y: number;
  width: number = 25 * scale;
  height: number = 3 * scale;
  options: CarOptionsType = CAR_OPTIONS_DEFAULT;
  constructor(game: Game, x: number, y: number) {
    this.game = game;

    this.x = x;
    this.y = y;
    const wheelBase = this.options.wheelBase;

    this.options = {
      ...this.options,
      wheelAOffset: -this.width * 0.5 + wheelBase,
      wheelBOffset: this.width * 0.5 - wheelBase,
    };

    this.car = this.create();
    World.add(this.game.engine.world, this.car);
  }

  create() {
    const group = Body.nextGroup(true);

    const car = Composite.create({ label: ElementLabel.CAR });

    const bucketParts = this.createBucket(group);

    const chassis = Bodies.rectangle(this.x, this.y, this.width, this.height, {
      collisionFilter: {
        group: group,
      },
      chamfer: {
        radius: this.height * 0.5,
      },
      density: 0.002,
    });

    const body = Body.create({
      parts: [
        chassis, // Main car body
        ...bucketParts,
      ],
      collisionFilter: {
        group: group,
      },
      friction: 0.8,
      density: 0.0001,
    });

    // Add the compound body to the composite
    // Composite.add(car, body);

    const wheelA = Bodies.circle(
      this.x + this.options.wheelAOffset,
      this.y + this.options.wheelYOffset,
      this.options.wheelSize,
      {
        collisionFilter: {
          group: group,
        },
        friction: 0.8,
      }
    );

    const wheelB = Bodies.circle(
      this.x + this.options.wheelBOffset,
      this.y + this.options.wheelYOffset,
      this.options.wheelSize,
      {
        collisionFilter: {
          group: group,
        },
        friction: 0.8,
      }
    );

    const axelA = Constraint.create({
      bodyB: body,
      pointB: { x: this.options.wheelAOffset, y: this.options.wheelYOffset },
      bodyA: wheelA,
      stiffness: 1,
      length: 0,
    });

    const axelB = Constraint.create({
      bodyB: body,
      pointB: { x: this.options.wheelBOffset, y: this.options.wheelYOffset },
      bodyA: wheelB,
      stiffness: 1,
      length: 0,
    });

    Composite.add(car, body);
    Composite.add(car, wheelA);
    Composite.add(car, wheelB);
    Composite.add(car, axelA);
    Composite.add(car, axelB);

    Body.setVelocity(body, { x: 0, y: 0 });
    Body.setAngularVelocity(body, 0);
    bucketParts.forEach((bucket) => {
      Body.setVelocity(bucket, { x: 0, y: 0 });
      Body.setAngularVelocity(bucket, 0);
    });

    return car;
  }

  createBucket(group: number) {
    const bucketWidth = 12;
    const bucketHeight = 5;
    const wallThickness = 2;
    const bucketYOffset = 3; // Offset above chassis center

    const options = {
      friction: 0.1,
      frictionAir: 0.02,
      isStatic: false,
      density: 0.0001,
      collisionFilter: {
        group: group,
      },
    };

    // Base of the bucket
    const bucketsBase = Bodies.rectangle(
      this.x,
      this.y - bucketYOffset,
      bucketWidth,
      2,
      options
    );
    bucketsBase.label = `bucket-base`;

    // Left wall of the bucket
    const bucketsLeft = Bodies.rectangle(
      this.x - bucketWidth / 2,
      this.y - bucketYOffset - 5 / 2,
      2,
      5,
      options
    );

    // Right wall of the bucket
    const bucketsRight = Bodies.rectangle(
      this.x + bucketWidth / 2,
      this.y - bucketYOffset - 5 / 2,
      2,
      5,
      options
    );

    return [bucketsBase, bucketsLeft, bucketsRight];
  }
}
