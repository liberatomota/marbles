import Matter, { Composite } from "matter-js";
import Game from "../../Game";
import { degreesToRadians } from "../../../utils/trignometry-utils";
import TrapDoor, { TrapDoorOptionsType } from "../TrapDoor/TrapDoor";
import TrapDoorSlider from "../TrapDoor/TrapDoorSlider";

const { Bodies, Body, World } = Matter;

export default class Piramid {
  game: Game;
  x: number;
  y: number;
  bodyOptions = { friction: 0.1, frictionAir: 0.02, isStatic: true };
  constructor(game: Game, x: number, y: number) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.createPiramid();
    this.addTrapDoors();
    this.addPlanks();
  }

  createPiramid() {
    const v1 = [
      { x: 0, y: 60 },
      { x: 20, y: 60 },
      { x: 60, y: 12 },
      { x: 50, y: 0 },
    ];
    const topL = Bodies.fromVertices(-20, 0, [v1], this.bodyOptions);

    const v2 = [
      { x: 30, y: 60 },
      { x: 70, y: 60 },
      { x: 50, y: 37 },
    ];
    const middleB = Bodies.fromVertices(-2, 20, [v2], this.bodyOptions);

    const v3 = [
      { x: 55, y: 30 },
      { x: 80, y: 60 },
      { x: 100, y: 60 },
      { x: 65, y: 18 },
    ];
    const middleL = Bodies.fromVertices(24, 10, [v3], this.bodyOptions);

    const piramid = Body.create({
      parts: [topL, middleB, middleL],
      friction: 0.1,
      frictionAir: 0.02,
      isStatic: true,
      label: "piramid",
    });

    Body.setPosition(piramid, {
      x: this.x,
      y: this.y,
    });

    Body.scale(piramid, 2, 2);
    World.add(this.game.engine.world, [piramid]);
    // World.addConstraint(this.game.engine.world, constraint);
  }

  addTrapDoors() {
    // inside the piramid
    const td1 = new TrapDoor(this.game);
    td1.create(this.x -6, this.y  - 10, 15, 4, -48);
    td1.startOpenTrapDoor(2240);

    // piramid entry
    const td2 = new TrapDoor(this.game);
    td2.create(this.x + 13, this.y - 61, 20, 4, 50, {
      openTime: 1000,
      maxAngle: 110
    });
    td2.startOpenTrapDoor(4320);

    
  }
  addPlanks() {
    const p1W = 53;
    const plank1 = Bodies.rectangle(
      this.x + p1W / 2 + 40,
      this.y - 70,
      p1W,
      5 ,
      this.bodyOptions
    );
    Body.rotate(plank1, degreesToRadians(-10));
    World.add(this.game.engine.world, [plank1]);
  }
}
