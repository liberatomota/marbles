import Matter, { World } from "matter-js";
import Konva from "konva";
import Game from "../../Game";
import Marble from "../Factories/MarbleFactory";
import Elevator from "../Elevator/Elevator";
import { translatePosition } from "../../../utils/position-utils";
import TrapDoorSlider from "../TrapDoor/TrapDoorSlider";
import DestroyerRect from "../Destroyer/DestroyerRect";
import DestroyerCircles from "../Destroyer/DestroyerCircles";
import Car from "../Car/Car";

const { Composite } = Matter;

export default class Dinamic {
  game: Game;
  bodies: Matter.Body[] = [];
  elements: Map<number, Konva.Node> = new Map();
  constructor(game: Game) {
    this.game = game;
  }

  addObjects() {
    this.addElevators();
    this.addDestroyers();
    this.addTrapDoors();
    this.addCars();
  }

  addElevators() {
    const e1 = new Elevator(this.game);
    e1.create(
      { x: this.game.width / 2 + 105, y: 45 },
      { x: this.game.width / 2 + 105, y: 152 },
      { pathRadius: 25 }
    );

    const e2 = new Elevator(this.game);
    e2.create(
      { x: this.game.width - 100, y: 45 },
      { x: this.game.width - 100, y: 152 }
    );

    
  }

  addTrapDoors() {
    const td3 = new TrapDoorSlider(this.game);
    td3.create(this.game.width / 2 + 130, 151, 17, 5, 0, {
      openTime: 1000,
    });
    td3.startOpenTrapDoor(5000);
  }

  addDestroyers() {
    const d2 = new DestroyerCircles(this.game, 400, 400, 20);
  }

  addCars() {
    new Car(this.game, 200, 140);
  }
}
