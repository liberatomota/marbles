import { Body } from "matter-js";
import { ElementLabel } from "../types/elements";
import Game from "../entities/Game";
import Level from "../entities/Level";
import Car from "../entities/Shapes/Car/Car";
import TrapDoorSlider from "../entities/Shapes/TrapDoor/TrapDoorSlider";
import TrapDoor from "../entities/Shapes/TrapDoor/TrapDoor";
import MarbleFactory from "../entities/Shapes/Factories/MarbleFactory";
import DestroyerCircles from "../entities/Shapes/Destroyer/DestroyerCircles";
import DestroyerRect from "../entities/Shapes/Destroyer/DestroyerRect";
import Piramid from "../entities/Shapes/Piramid/Piramid";
import RectFactory from "../entities/Shapes/Factories/RectFactory";
import Elevator, { RotateToEnum } from "../entities/Shapes/Elevator/Elevator";
import Lift from "../entities/Shapes/Elevator/Lift";
import { marble } from "../constants/world";
import { calculateTriangle } from "../utils/trignometry-utils";
import Ramp from "../entities/Shapes/Composite/Ramp";

export default class Level1 {
  game: Game;
  level: Level;
  rectFactory: RectFactory;
  marbleFactory: MarbleFactory;

  middleView: {
    x: number;
    y: number;
  };
  constructor(game: Game, level: Level) {
    this.game = game;
    this.level = level;
    this.rectFactory = new RectFactory(this.game);
    this.marbleFactory = new MarbleFactory(this.game);

    this.middleView = {
      x: this.game.width / 2,
      y: this.game.height / 2,
    };
  }

  start() {
    this.game.createFrame();
    // FLOOR ONE
    this.startFloorOne();
    this.startFloorTwo();
  }

  startFloorOne() {
    const floorOne = this.level.floors[0];
    const g = this.game;

    const top = floorOne.maxY;
    const bottom = floorOne.minY;

    const middleX = g.view.middleX;
    const middleY = bottom - top;

    const width = g.view.viewWidth;
    const height = g.view.viewHeight;

    const newX = g.view.right - 50;
    const newY = top + 50;
    const nextPosition = { x: newX, y: newY };

    const numberOfMarbles = 100;

    // ------------------------------------------- Elevators 1

    const e1 = new Elevator(g);
    e1.create(
      { x: middleX + 125, y: top + 55 },
      { x: middleX + 125, y: bottom + 2 },
      { pathRadius: 25, numElevators: 6 }
    );

    // ------------------------------------------- TrapDoors 1

    const tds1 = new TrapDoorSlider(g);
    const tds1W = 15;
    tds1.create(middleX - tds1W / 2 + 158, bottom + 4, tds1W, 5, tds1.angle, {
      openTime: 1000,
    });
    tds1.startOpenTrapDoor(5000);

    // ------------------------------------------- Destroyers 1

    const d2Opts = {
      pathRadius: 40,
    };
    const d2Data = { nextPosition };

    // const d2 = new DestroyerCircles(g, 400, 400, d2Opts, d2Data);
    const d1 = new DestroyerRect(
      g,
      middleX + 115,
      bottom + 100,
      140,
      5,
      0,
      d2Data
    );

    // ------------------------------------------- Cars 1

    // const c1 = new Car(g, 200, 100);

    // ------------------------------------------- Static Objects 1

    const pi1 = new Piramid(g, middleX - 5, bottom - 32);

    // ground left
    const g0W = middleX - g.view.left - 100;
    this.rectFactory.create(g.view.left, bottom, g0W, 5);
    // ground right
    const g1X = middleX + 165;
    const rampWidth = g.view.right - g1X;
    const g1Angle = -5;
    const { verticalLeg, hypotenuse } = calculateTriangle(rampWidth, g1Angle);
    this.rectFactory.create(g1X, bottom + verticalLeg / 2, hypotenuse, 5, -5);
    // small wall between hole and trapdoor
    const g3X = middleX + 128;
    this.rectFactory.create(g3X, bottom - 5, 5, 10);
    // ground between hole and trapdoor
    const g2W = 15;
    this.rectFactory.create(middleX + 123, bottom, g2W, 5);

    this.rectFactory.create(middleX - 20, bottom + 75, 80, 5, 60);
    this.rectFactory.create(middleX + 180, bottom, 5, 100);

    // ------------------------------------------- Marbles

    let index = 0;
    let interval: NodeJS.Timeout | null = null;
    const radius = marble.radius;

    interval = setInterval(() => {
      if (index <= numberOfMarbles) {
        this.marbleFactory.create(nextPosition.x, nextPosition.y, radius);
        index++;
      } else {
        this.game.clearTimer(interval!);
      }
    }, (0.5 + Math.random() * 0.5) * 1000);
    this.game.registerTimer(interval);
  }

  startFloorTwo() {
    const floorTwo = this.level.floors[1];
    const g = this.game;

    const top = floorTwo.maxY;
    const bottom = floorTwo.minY;

    const middleX = floorTwo.middleX;
    const middleY = floorTwo.middleY;
    
    const newX = middleX - 50;
    const newY = top + 20;
    const nextPosition = { x: newX, y: newY };
    const destroyerData = { nextPosition };


    const label = ElementLabel.GROUND;
    const gThickeness = 5;

    // ------------------------------------------- Lifts 2

    let liftX = middleX - 140;
    const numOfLifts = 20;
    const liftWidth = 30;

    const lOpts = {
      rideLength: 5,
      rideSpeed: 30,
      openTime: 1000,
    };

    for (let i = 0; i < numOfLifts; i++) {
      const lift1 = new Lift(g);
      const x = liftX - i * liftWidth;
      lift1.create(x, bottom + 10, liftWidth, 30, 110, lOpts);
      // if even, open trapdoor
      if (i % 2 === 0) {
        setTimeout(() => {
          lift1.startShoot(2000);
        }, 1000);
      } else {
        lift1.startShoot(2000);
      }
    }

    // ------------------------------------------- Elevators 2

    const e1 = new Elevator(g);
    const e1X = middleX - 90;
    e1.create(
      { x: e1X, y: bottom - 120 },
      { x: e1X, y: bottom + 2 },
      {
        pathRadius: 20,
        rotateDirection: RotateToEnum.RIGHT,
        numElevators: 4,
      }
    );
    // elevator wall
    this.rectFactory.create(e1X - 7, bottom - 110, 15, 110, 0);
    // destroyer to the rigth
    const d1 = new DestroyerRect(
      g,
      e1X + 20 + (gThickeness / 2),
      bottom - (gThickeness / 2),
      40,
      gThickeness,
      0,
      destroyerData
    )

    // ------------------------------------------- Static Objects 2

    // top left ramp
    const rampAngle = -5;
    
    const rampY = top + 100;
    const rampWidth = middleX - g.view.left - 100;
    const rampX = middleX - rampWidth;

    const sliders = [{ destroyer: true, destroyerData }, { destroyer: false }];
    new Ramp(g, rampX, rampY, rampWidth, 3, sliders, rampAngle, gThickeness);

    // left wals
    const w1 = this.rectFactory.create(
      g.view.left,
      rampY + 50,
      rampX - g.view.left,
      gThickeness,
      20
    );
    this.rectFactory.create(
      w1.bounds.max.x - gThickeness / 2,
      w1.bounds.max.y,
      gThickeness,
      bottom - w1.bounds.max.y
    );

    // bottom left
    this.rectFactory.create(
      g.view.left,
      bottom,
      middleX - g.view.left,
      gThickeness
    );

    // elevator ramp in the middle
    const ramp2W = (g.view.right - middleX) / 2;
    const ramp2Angle = 10;
    const { verticalLeg: ramp2Vleg, hypotenuse } = calculateTriangle(
      ramp2W,
      ramp2Angle
    );
    this.rectFactory.create(
      middleX - 50,
      bottom - (ramp2Vleg / 2),
      ramp2W,
      gThickeness,
      ramp2Angle
    );
  }
  stop() {
    this.level.floors = [];
  }
}
