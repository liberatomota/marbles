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
          this.rectFactory.create(this.game.width - 3, 0, 3, this.game.height, angle, label);
          this.rectFactory.create(0, this.game.height - 3, this.game.width, 3, angle, label);
      }

  startFloorOne() {
    const floorOne = this.level.floors[0];

    const td1 = new TrapDoor(this.game);
    const td1W = 20;
    td1.create(
      this.game.width / 2 - td1W / 2,
      floorOne.maxY + 30,
      td1W,
      td1.height,
      td1.angle,
      {
        maxAngle: 90,
        openTime: 1000,
      }
    );
    td1.startOpenTrapDoor(5000);

    const tds1 = new TrapDoorSlider(this.game);
    const tds1W = 20;
    tds1.create(
      this.game.width / 2 - tds1W / 2,
      floorOne.maxY + 50,
      tds1W,
      tds1.height,
      tds1.angle,
      {
        openTime: 1000,
      }
    );
    tds1.startOpenTrapDoor(5000);

    const d2 = new DestroyerCircles(this.game, 400, 400, 20);
    const d1 = new DestroyerRect(this.game, 400, 400, 20, 20);

    const c1 = new Car(this.game, 200, 140);

    const pi1 = new Piramid(this.game);


  }

  stop() {
    this.level.floors = [];
  }
}
