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
import { ElementLabel } from "../../../types/elements";
import Color from "../../Color";

const { Body, World, Bodies, Composite } = Matter;

export enum RotateToEnum {
  RIGHT = "right",
  LEFT = "left",
}

type elevatorOptionsType = {
  rotateDirection: RotateToEnum;
  angleOffset: number;
  upDownSpeed: number;
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
  upDownSpeed: 1,
  bucketShouldRotate: true,
  bucketShouldBounce: false,
  bucketReleaseAcelaration: 0.2,
  bucketMaxAngle: degreesToRadians(100),
  bucketBaseHeight: 4,
  pathRadius: 13,
  numElevators: 3,
  bodyOption: {
    friction: 0.01,
    frictionAir: 0.02,
    isStatic: true,
    render: { fillStyle: new Color("saddlebrown", 1).rgb },
  },
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
    const interval = setInterval(this.moveBuckets, 1000 / 60);
    this.game.registerTimer(interval);
  }
  createPivots(p1: PointType, p2: PointType) {
    const pivot1 = Bodies.circle(p1.x, p1.y, 3, { isStatic: true });
    const pivot2 = Bodies.circle(p2.x, p2.y, 3, { isStatic: true });
    World.add(this.game.engine.world, [pivot1, pivot2]);
    return [pivot1, pivot2];
  }

  createBuckets(pivot1: Matter.Body, pivot2: Matter.Body) {
    const {
      rotateDirection,
      bucketBaseHeight,
      bodyOption,
      angleOffset,
      pathRadius,
      numElevators,
    } = this.options;

    const factor = 1 / (numElevators - 1); 

    // Create buckets
    for (let i = 0; i < numElevators; i++) {
      let x: number;
      let y: number;

      y = linearInterpolation(this.p1, this.p2, factor * i).y;

      if (i % 2 === 0) {
        x = pivot1.position.x - pathRadius; 
      } else {
        x = pivot2.position.x + pathRadius; 
      }

      // Adjust offset (optional, left as 0 for now)
      const offset = rotateDirection === RotateToEnum.LEFT ? 2 : -2;

      const bucketsBase = Bodies.rectangle(x, y, 16, 4, bodyOption);
      const bucketsLeft = Bodies.rectangle(
        x - 8 + offset,
        y - 2,
        4,
        8,
        bodyOption
      );
      const bucketsRight = Bodies.rectangle(
        x + 8 + offset,
        y - 2,
        4,
        8,
        bodyOption
      );

      const bucket = Body.create({
        parts: [bucketsBase, bucketsLeft, bucketsRight],
        friction: 0.1,
        frictionAir: 0.02,
        isStatic: true,
        label: ElementLabel.ELEVATOR_BUCKET,
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
      upDownSpeed,
    } = this.options;

    const insideRelaseInterval = y < this.deployPoint.y;
    let angle = 0;
    let newY = 0;

    if (!bucketShouldRotate) {
      return { newY: y, angle };
    }

    if (x < pv1X) {
      if (rotateDirection === RotateToEnum.RIGHT) {
        newY = y - upDownSpeed;
      } else {
        angle = insideRelaseInterval ? -aceleration : aceleration;
        newY = y + upDownSpeed;
        if (Math.floor(y) === Math.floor(this.deployPointMiddle.y)) {
          if (bucketShouldBounce) {
            this.overarchingBucketBase(bucket);
          }
        }
      }
    } else {
      if (rotateDirection === RotateToEnum.RIGHT) {
        angle = insideRelaseInterval ? aceleration : -aceleration;
        newY = y + upDownSpeed;
      } else {
        newY = y - upDownSpeed;
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
        this.game.clearTimer(intervalDown!);
        intervalDown = null;
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
        clearInterval(intervalUp!);
        intervalUp = null;
        intervalDown = setInterval(retract, 20);
        this.game.registerTimer(intervalDown);
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
    this.game.registerTimer(intervalUp);
  }
}
