import Matter from "matter-js";
import Game from "../../Game";
import {
  degreesToRadians,
  radiansToDegrees,
} from "../../../utils/trignometry-utils";
import { PointType } from "../../../types/line-type";
import {
  linearInterpolation,
  offsetMatterBodyPosition,
} from "../../../utils/position-utils";
import Konva from "konva";

const { Body, World, Bodies, Composite } = Matter;

type RotateTo = "right" | "left";

export default class Elevator {
  game: Game;
  rotateTo: RotateTo = "right";
  p1: PointType = { x: 0, y: 0 };
  p2: PointType = { x: 0, y: 0 };
  pivot1: Matter.Body | null = null;
  pivot2: Matter.Body | null = null;
  buckets: Matter.Body[] = [];
  angleOffset = 0.02;
  bucketsAngles: number[] = [];
  pathRadius = 20;
  numElevators = 2;
  deployPoint: PointType = { x: 0, y: 0 };
  options = { friction: 0.1, frictionAir: 0.02, isStatic: true };
  constructor(game: Game) {
    this.game = game;
  }

  createElevator(p1: PointType, p2: PointType, rotateTo: RotateTo = "right") {
    this.rotateTo = rotateTo;
    this.p1 = p1;
    this.p2 = p2;

    const [pivot1, pivot2] = this.createPivots(this.p1, this.p2);
    this.pivot1 = pivot1;
    this.pivot2 = pivot2;
    this.deployPoint = linearInterpolation(this.p1, this.p2, 0.15);

    this.createBuckets(pivot1, pivot2);
    setInterval(this.moveBuckets, 1000 / 60);
  }
  createPivots(p1: PointType, p2: PointType) {
    const pivot1 = Bodies.circle(p1.x, p1.y, 3, { isStatic: true });
    const pivot2 = Bodies.circle(p2.x, p2.y, 3, { isStatic: true });
    World.add(this.game.engine.world, [pivot1, pivot2]);
    return [pivot1, pivot2];
  }

  createBuckets(pivot1: Matter.Body, pivot2: Matter.Body) {
    // Criar baldes
    for (let i = 0; i < this.numElevators; i++) {
      const factor = 1 / (i + 1) - 0.1;
      const x = pivot1.position.x + this.pathRadius;
      const y = linearInterpolation(this.p1, this.p2, factor).y;

      // console.log(this.p1, this.p2)
      console.log("factor", factor);
      console.log("y", y);

      const options = { friction: 0.1, frictionAir: 0.02, isStatic: true };

      const bucketsBase = Bodies.rectangle(x, y, 12, 2, options);
      const bucketsLeft = Bodies.rectangle(x - 5, y - 4, 5, 2, options);
      Body.setAngle(bucketsLeft, degreesToRadians(90));
      const bucketsRight = Bodies.rectangle(x + 5, y - 4, 5, 2, options);
      Body.setAngle(bucketsRight, degreesToRadians(90));

      const bucket = Body.create({
        parts: [bucketsBase, bucketsLeft, bucketsRight],
        friction: 0.1,
        frictionAir: 0.02,
        isStatic: true,
        label: `buckets-${i}`,
      });

      //   Body.scale(bucket, 1.4, 1);

      this.buckets.push(bucket);
    }

    this.buckets.forEach(() => this.bucketsAngles.push(this.angleOffset));
    this.buckets.map((b) => console.log(b.position));
    World.add(this.game.engine.world, this.buckets);
    return this.buckets;
  }

  moveBuckets = () => {
    for (let index = 0; index < this.buckets.length; index++) {
      const bucket = this.buckets[index];
      let x = bucket.position.x;
      let y = bucket.position.y;
      let bucketAngle = 0;
      if (y > this.pivot1!.position.y && y < this.pivot2!.position.y) {
        // desce
        if (x < this.pivot1!.position.x) {
          y = y - 1;
          Body.setAngle(bucket, 0);
        } else {
          bucketAngle = y < this.deployPoint.y ? 0.1 : -0.1;
          y = y + 1;
        }
      } else {
        Body.setAngle(bucket, 0);
        this.bucketsAngles[index] += 0.02;
        const pivot =
          bucket.position.y <= this.pivot1!.position.y
            ? this.pivot1
            : this.pivot2;
        // roda esquerda
        const angle = this.bucketsAngles[index] + index * Math.PI;
        x = pivot!.position.x + Math.cos(angle) * this.pathRadius;
        y = pivot!.position.y + Math.sin(angle) * this.pathRadius;
      }

      // Atualiza a posição do elevador
      if (bucketAngle !== 0) {
        const previewAngle = bucket.angle;
        const newAngle = previewAngle + bucketAngle;
        Body.setAngle(bucket, newAngle < 0 ? 0 : newAngle > 2 ? 2 : newAngle);
      }
      Body.setPosition(bucket, { x, y });
    }
  };
}
