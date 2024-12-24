import Game from "./Game";
import Level from "./Level";

export default class Floor {
  game: Game;
  level: Level;

  floorNumber: number = 0;

  maxY: number = 0;
  minY: number = 0;

  middleX: number = 0;
  middleY: number = 0;

  constructor(game: Game, level: Level, floorNumber: number) {
    this.game = game;
    this.level = level;

    this.floorNumber = floorNumber;

    const gameHeight = this.game.view.viewHeight;
    const numOfFloors = this.level.data.numOfFloors;
    const floorHeight = gameHeight / numOfFloors;

    this.maxY = floorHeight * this.floorNumber + this.game.view.top;
    this.minY = this.maxY + floorHeight;

    this.middleX = this.game.view.middleX;
    this.middleY = this.maxY + (this.minY - this.maxY) / 2;
    console.log(
      "Floor",
      this.floorNumber,
      "maxY",
      this.maxY,
      "minY",
      this.minY,
      "middleX",
      this.middleX,
    );
  }
}
