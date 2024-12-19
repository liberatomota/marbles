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

enum RotateToEnum {
  RIGHT = "right",
  LEFT = "left",
}

type elevatorOptionsType = {
  rotateDirection: RotateToEnum;
  angleOffset: number;
  bucketShouldRotate: boolean;
  bucketShouldBounce: boolean;
  bucketReleaseAcelaration: number;
  bucketMaxAngle: number;
  bucketBaseHeight: number;
  pathRadius: number;
  numElevators: number;
  bodyOption: Object;
};

const ELEVATOR_DEFAULT_OPTIONS: elevatorOptionsType = {
  rotateDirection: RotateToEnum.LEFT,
  angleOffset: 0.02,
  bucketShouldRotate: true,
  bucketShouldBounce: true,
  bucketReleaseAcelaration: 0.1,
  bucketMaxAngle: degreesToRadians(68),
  bucketBaseHeight: 2,
  pathRadius: 15,
  numElevators: 3,
  bodyOption: { friction: 0.01, frictionAir: 0.02, isStatic: true },
};

export default class Elevator {
  game: Game;
  p1: PointType = { x: 0, y: 0 };
  p2: PointType = { x: 0, y: 0 };
  pivot1: Matter.Body | null = null;
  pivot2: Matter.Body | null = null;
  buckets: Matter.Body[] = [];
  bucketsAngles: number[] = [];
  deployPoint: PointType = { x: 0, y: 0 };
  deployPointMiddle: PointType = { x: 0, y: 0 };
  options: elevatorOptionsType = ELEVATOR_DEFAULT_OPTIONS;
  constructor(game: Game) {
    this.game = game;
  }

  create(p1: PointType, p2: PointType, options?: any) {
    this.p1 = p1;
    this.p2 = p2;

    this.options = {
      ...this.options,
      ...options,
    };

    const [pivot1, pivot2] = this.createPivots(this.p1, this.p2);
    this.pivot1 = pivot1;
    this.pivot2 = pivot2;
    this.deployPoint = linearInterpolation(this.p1, this.p2, 0.3);
    this.deployPointMiddle = linearInterpolation(
      this.p1,
      this.deployPoint,
      1 / 3
    );

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
    const {
      bucketBaseHeight,
      bodyOption,
      angleOffset,
      pathRadius,
      numElevators,
    } = this.options;
    // Criar baldes
    for (let i = 0; i < numElevators; i++) {
      const factor = 1 / (i + 1) - 0.1;
      const x = pivot1.position.x + pathRadius;
      const y = linearInterpolation(this.p1, this.p2, factor).y;

      // console.log(this.p1, this.p2)
      //   console.log("factor", factor);
      //   console.log("y", y);

      const bucketsBase = Bodies.rectangle(
        x,
        y,
        12,
        bucketBaseHeight * 2.5,
        bodyOption
      );
      bucketsBase.label = `bucket-base-${i}`;
      const bucketsLeft = Bodies.rectangle(
        x - 5,
        y - 4,
        5,
        bucketBaseHeight,
        bodyOption
      );
      Body.setAngle(bucketsLeft, degreesToRadians(90));
      const bucketsRight = Bodies.rectangle(
        x + 5,
        y - 4,
        5,
        bucketBaseHeight,
        bodyOption
      );
      Body.setAngle(bucketsRight, degreesToRadians(90));

      const bucket = Body.create({
        parts: [bucketsBase, bucketsLeft, bucketsRight],
        friction: 0.1,
        frictionAir: 0.02,
        isStatic: true,
        label: `buckets-${i}`,
      });

      this.buckets.push(bucket);
    }

    this.buckets.forEach(() => this.bucketsAngles.push(angleOffset));

    World.add(this.game.engine.world, this.buckets);
    return this.buckets;
  }

  moveBuckets = () => {
    for (let index = 0; index < this.buckets.length; index++) {
      const bucket = this.buckets[index];
      let x = bucket.position.x;
      let y = bucket.position.y;
      const pv1X = this.pivot1!.position.x;
      const pv1Y = this.pivot1!.position.y;
      //   const pv2X = this.pivot2!.position.x;
      const pv2Y = this.pivot2!.position.y;
      let bucketReleaseAngle = 0;

      if (y > pv1Y && y < pv2Y) {
        // VERTICAL MOVE
        const { newY, angle } = this.verticalMove(bucket, x, y, pv1X, pv1Y);
        y = newY;
        bucketReleaseAngle = angle;
      } else {
        // AROUND PIVOT
        Body.setAngle(bucket, 0);
        this.bucketsAngles[index] += 0.02;
        const { newX, newY } = this.rotateAroundPivot(x, y, index, pv1Y);
        x = newX;
        y = newY;
      }

      // Atualiza a posição do elevador
      if (bucketReleaseAngle !== 0) {
        const newAngle = this.getFinalBucketAngle(bucket, bucketReleaseAngle);
        Body.setAngle(bucket, newAngle);
      }
      Body.setPosition(bucket, { x, y });
    }
  };

  verticalMove = (
    bucket: Matter.Body,
    x: number,
    y: number,
    pv1X: number,
    pv1Y: number
  ) => {
    const {
      rotateDirection,
      bucketShouldRotate,
      bucketShouldBounce,
      bucketReleaseAcelaration: aceleration,
    } = this.options;

    const insideRelaseInterval = y < this.deployPoint.y;
    let angle = 0;
    let newY = 0;

    if (!bucketShouldRotate) {
      return { newY: y, angle };
    }

    if (x < pv1X) {
      if (rotateDirection === RotateToEnum.RIGHT) {
        newY = y - 1;
      } else {
        angle = insideRelaseInterval ? -aceleration : aceleration;
        newY = y + 1;
        if (Math.floor(y) === Math.floor(this.deployPointMiddle.y)) {
          if (bucketShouldBounce) {
            this.overarchingBucketBase(bucket);
          }
        }
      }
    } else {
      if (rotateDirection === RotateToEnum.RIGHT) {
        angle = insideRelaseInterval ? aceleration : -aceleration;
        newY = y + 1;
      } else {
        newY = y - 1;
      }
    }

    return { newY, angle };
  };

  rotateAroundPivot(x: number, y: number, index: number, pv1Y: number) {
    const { rotateDirection, pathRadius } = this.options;
    const pivot = y <= pv1Y ? this.pivot1 : this.pivot2;
    const angle = this.bucketsAngles[index] + index * Math.PI;
    let newX = 0;
    let newY = 0;

    if (rotateDirection === RotateToEnum.RIGHT) {
      newX = pivot!.position.x + Math.cos(angle) * pathRadius;
      newY = pivot!.position.y + Math.sin(angle) * pathRadius;
    } else {
      newX = pivot!.position.x - Math.cos(angle) * pathRadius; // Inverted cosine for counterclockwise
      newY = pivot!.position.y + Math.sin(angle) * pathRadius;
    }

    return { newX, newY };
  }

  getFinalBucketAngle(bucket: Matter.Body, bucketReleaseAngle: number) {
    const { rotateDirection, bucketMaxAngle } = this.options;
    const previewAngle = bucket.angle;
    const maxAngle = bucketMaxAngle;
    let newAngle = previewAngle + bucketReleaseAngle;
    if (rotateDirection === RotateToEnum.RIGHT) {
      newAngle = newAngle < 0 ? 0 : newAngle > maxAngle ? maxAngle : newAngle;
    } else {
      newAngle = newAngle > 0 ? 0 : newAngle < -maxAngle ? -maxAngle : newAngle;
    }

    return newAngle;
  }

  overarchingBucketBase(bucket: Matter.Body) {
    const pixel = 1;
    const maxIndex = 8;
    let index = 0;
    let intervalUp: NodeJS.Timeout | null = null;
    let intervalDown: NodeJS.Timeout | null = null;

    const retract = () => {
      if (index <= 0) {
        clearInterval(intervalDown!); // Clear interval when fully retracted
        intervalDown = null; // Ensure intervalDown is reset
        return;
      }
      index--;
      Body.setPosition(bucket, {
        x: bucket.position.x + pixel + pixel / 1,
        y: bucket.position.y + pixel, // Move up
      });
    };

    const expand = () => {
      if (index >= maxIndex) {
        clearInterval(intervalUp!); // Stop upward movement
        intervalUp = null; // Ensure intervalUp is reset
        intervalDown = setInterval(retract, 20); // Start retracting
        return;
      }
      index++;
      Body.setPosition(bucket, {
        x: bucket.position.x - pixel - pixel / 1,
        y: bucket.position.y - pixel, // Move down
      });
    };

    // Start expanding
    intervalUp = setInterval(expand, 20);
  }
}
