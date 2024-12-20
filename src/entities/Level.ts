import { LevelType } from "../constants/game-const";
import Level0 from "../play/Level0";
import Level1 from "../play/Level1";
import Floor from "./Floor";
import Game from "./Game";

export default class Level {
  game: Game;
  levelEngine: Level0 | Level1;

  levelNumber: number;
  data: LevelType;
  floors: Floor[] = [];

  constructor(game: Game, levelNumber: number, levelData: LevelType) {
    this.game = game;
    this.data = levelData;
    this.levelNumber = levelNumber;

    this.createFloors();

    if (levelNumber === 1) {
        this.levelEngine = new Level1(this.game, this);
    } else {
        this.levelEngine = new Level0(this.game, this);
    }
  }

  createFloors() {
    const numOfFloors = this.data.numOfFloors;
    for (let i = 0; i < numOfFloors; i++) {
      this.createFloor(i);
    }
  }

  createFloor(i: number) {
    const floor = new Floor(this.game, this, i);
    this.floors.push(floor);
  }

  start() {
    console.info("Starting level", this.data.name);
    this.levelEngine.start();
  }

  stop() {
    this.levelEngine.stop();
  }
}
