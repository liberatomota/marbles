import Game from "./Game";
import Level from "./Level";

export default class Floor {
  game: Game;
  level: Level;

  floorNumber: number = 0;

  maxY: number = 0;
  minY: number = 0;

  constructor(
    game: Game,
    level: Level,
    floorNumber: number
  ) {
    this.game = game;
    this.level = level;

    this.floorNumber = floorNumber;

    const gameHeight = this.game.height;
    const numOfFloors = this.level.data.numOfFloors;
    const floorHeight = gameHeight / numOfFloors;

    this.maxY = floorHeight * this.floorNumber;
    this.minY = this.maxY + floorHeight;
  }
}