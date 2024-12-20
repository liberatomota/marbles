import Game from "../entities/Game";
import Level from "../entities/Level";
import Car from "../entities/Shapes/Car/Car";
import DestroyerCircles from "../entities/Shapes/Destroyer/DestroyerCircles";
import TrapDoor from "../entities/Shapes/TrapDoor/TrapDoor";
import TrapDoorSlider from "../entities/Shapes/TrapDoor/TrapDoorSlider";
import DestroyerRect from "../entities/Shapes/Destroyer/DestroyerRect";
import Piramid from "../entities/Shapes/Piramid/Piramid";
import RectFactory from "../entities/Shapes/Factories/Rect";
import { ElementLabel } from "../types/elements";
import Elevator from "../entities/Shapes/Elevator/Elevator";
import MarbleFactory from "../entities/Shapes/Factories/MarbleFactory";

export default class Level1 {
  game: Game;
  level: Level;
  rectFactory: RectFactory;
  marbleFactory: MarbleFactory;
  constructor(game: Game, level: Level) {
    this.game = game;
    this.level = level;
    this.rectFactory = new RectFactory(this.game);
    this.marbleFactory = new MarbleFactory(this.game);
  }

  start() {
    this.makeFrame();
    // FLOOR ONE
    this.startFloorOne();
  }

  makeFrame() {
    const angle = 0;
    const label = ElementLabel.GROUND;

    this.rectFactory.create(0, 0, 3, this.game.height, angle, label);
    this.rectFactory.create(0, 0, this.game.width, 3, angle, label);
    this.rectFactory.create(
      this.game.width - 3,
      0,
      3,
      this.game.height,
      angle,
      label
    );
    this.rectFactory.create(
      0,
      this.game.height - 10,
      this.game.width,
      10,
      angle,
      label
    );
  }

  startFloorOne() {
    const floorOne = this.level.floors[0];
    const g = this.game;
    const top = floorOne.maxY;
    const bottom = floorOne.minY;
    const width = g.width;
    const height = g.height;

    const newX = width - 50;
    const newY = top + 50;
    const nextPosition = { x: newX, y: newY };

    const numberOfMarbles = 25;

    // ------------------------------------------- Elevators

    const e1 = new Elevator(g);
    e1.create(
      { x: width / 2 + 125, y: top + 35 },
      { x: width / 2 + 125, y: top + 152 },
      { pathRadius: 25 }
    );

    // ------------------------------------------- TrapDoors

    const tds1 = new TrapDoorSlider(g);
    const tds1W = 15;
    tds1.create(
      width / 2 - tds1W / 2 + 158,
      bottom + 2.3,
      tds1W,
      5,
      tds1.angle,
      {
        openTime: 1000,
      }
    );
    tds1.startOpenTrapDoor(5000);

    // ------------------------------------------- Destroyers

    const d2Opts = {
      pathRadius: 40,
    };
    const d2Data = { nextPosition };

    // const d2 = new DestroyerCircles(g, 400, 400, d2Opts, d2Data);
    const d1 = new DestroyerRect(
      g,
      width / 2 + 110,
      bottom + 50,
      150,
      5,
      0,
      d2Data
    );

    // ------------------------------------------- Cars

    const c1 = new Car(g, 200, 100);

    // ------------------------------------------- Static Objects

    const pi1 = new Piramid(g, this.game.width / 2, 115);

    const angle = 0;
    const label = ElementLabel.GROUND;

    const g0W = width / 2 - 100;
    this.rectFactory.create(0, bottom, g0W, 5, 20, label);
    const g1W = width / 2 - 145;
    this.rectFactory.create(width / 2 + 165, bottom - 14, g1W, 5, -5, label);
    const g2W = 15;
    this.rectFactory.create(width / 2 + 123, bottom, g2W, 5, angle, label);
    this.rectFactory.create(
      width / 2 + 123 - 6,
      bottom - 5,
      5,
      10,
      angle,
      label
    );

    let index = 0;
    let interval: NodeJS.Timeout | null = null;

    interval = setInterval(() => {
      if (index <= numberOfMarbles) {
        this.marbleFactory.create(nextPosition.x, nextPosition.y, 5);
        index++;
      } else {
        this.game.clearTimer(interval!);
      }
    }, 500);
    this.game.registerTimer(interval);
  }

  stop() {
    this.level.floors = [];
  }
}
