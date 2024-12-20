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

export default class Level1 {
  game: Game;
  level: Level;
  rectFactory: RectFactory;
  constructor(game: Game, level: Level) {
    this.game = game;
    this.level = level;
    this.rectFactory = new RectFactory(this.game);
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
      this.game.height - 3,
      this.game.width,
      3,
      angle,
      label
    );
  }

  startFloorOne() {
    const floorOne = this.level.floors[0];
    const g = this.game;
    const maxY = floorOne.maxY;
    const minY = floorOne.minY;
    const width = g.width;
    const height = g.height;

    // ------------------------------------------- Elevators

    const e1 = new Elevator(g);
    e1.create(
      { x: width / 2 + 105, y: maxY + 45 },
      { x: width / 2 + 105, y: maxY + 152 },
      { pathRadius: 25 }
    );

    // ------------------------------------------- TrapDoors

    const tds1 = new TrapDoorSlider(g);
    const tds1W = 15;
    tds1.create(
      width / 2 - tds1W / 2 + 138,
      maxY + 150,
      tds1W,
      tds1.height,
      tds1.angle,
      {
        openTime: 1000,
      }
    );
    tds1.startOpenTrapDoor(5000);

    // ------------------------------------------- Destroyers

    const d2 = new DestroyerCircles(g, 400, 400, 20); 
    const d1 = new DestroyerRect(g, 400, 400, 20, 20);

    // ------------------------------------------- Cars

    const c1 = new Car(g, 200, 140);

    // ------------------------------------------- Static Objects

    const pi1 = new Piramid(g);

    const angle = 0;
    const label = ElementLabel.GROUND;

    const g1W = width / 2 - 145;
    this.rectFactory.create(width / 2 + 145, 148, g1W, 5, angle, label);
    const g2W = 15;
    this.rectFactory.create(width / 2 + 102, 148, g2W, 5, angle, label);
  }

  stop() {
    this.level.floors = [];
  }
}
