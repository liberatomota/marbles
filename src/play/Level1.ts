import Game from "../entities/Game";
import Level from "../entities/Level";
import TrapDoor from "../entities/Shapes/TrapDoor/TrapDoor";
import TrapDoorSlider from "../entities/Shapes/TrapDoor/TrapDoorSlider";

export default class Level1 {
  game: Game;
  level: Level;
  constructor(game: Game, level: Level) {
    this.game = game;
    this.level = level;
  }

  start() {
    // FLOOR ONE

    this.startFloorOne();
  }

  startFloorOne() {
    console.log("startFloorOne of Level1", this.level.data.name);
    const floorOne = this.level.floors[0];

    const tds1 = new TrapDoorSlider(this.game);
    const tds1W = 20;
    tds1.create(
      this.game.width / 2 - tds1W / 2,
      floorOne.maxY + 50,
      tds1W,
      4,
      tds1.angle,
      {
        openTime: 1000,
      }
    );
    tds1.startOpenTrapDoor(5000);

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
    td1.startOpenTrapDoor(3000);
  }

  stop() {
    this.level.floors = [];
  }
}
