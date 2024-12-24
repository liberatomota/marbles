import { Body, World } from "matter-js";
import { ElementLabel } from "../../../types/elements";
import { calculateTriangle } from "../../../utils/trignometry-utils";
import Game from "../../Game";
import DestroyerRect from "../Destroyer/DestroyerRect";
import RectFactory from "../Factories/RectFactory";
import TrapDoorSlider from "../TrapDoor/TrapDoorSlider";

type SliderType = {
  destroyer: boolean;
  destroyerData?: any;
};

export default class Ramp {
  game: Game;
  body: Body | null = null;
  x: number;
  y: number;
  width: number;
  numberOfRamps: number;
  sliders: SliderType[];
  angle: number;
  rampThickeness: number;

  rectFactory: RectFactory;
  constructor(
    game: Game,
    x: number,
    y: number,
    width: number,
    numberOfRamps: number,
    sliders: SliderType[],
    angle: number = 0,
    rampThickeness: number = 5
  ) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.width = width;
    this.numberOfRamps = numberOfRamps;
    this.sliders = sliders;
    this.angle = angle;
    this.rampThickeness = rampThickeness;

    this.rectFactory = new RectFactory(this.game);

    this.create();
  }

  create() {
    const label = ElementLabel.GROUND;

    let rampX = 0;
    let rampY = 0;

    const rampInterval = 70;
    const groundWidth = this.width - rampInterval * (this.numberOfRamps - 1);
    const rampWidth = groundWidth / this.numberOfRamps;

    const { verticalLeg: tdvl } = calculateTriangle(rampInterval, this.angle);
    let trapdoorVerticalLeg = tdvl;
    let trapdoorX = 0;
    let trapdoorY = 0;

    for (let i = 0; i < this.numberOfRamps; i++) {
      rampX = this.x + rampWidth * i + rampInterval * i;
      const { verticalLeg } = calculateTriangle(rampX, this.angle);
      rampY = this.y + verticalLeg;

      this.rectFactory.create(
        rampX,
        rampY,
        rampWidth,
        this.rampThickeness,
        this.angle
      );

      if (i > 0 && i < this.numberOfRamps) {
        // ------------------------------------------------------ TrapDoors 2

        const trapdoor = new TrapDoorSlider(this.game);
        trapdoor.create(
          trapdoorX,
          trapdoorY,
          rampInterval / 2,
          this.rampThickeness,
          this.angle,
          {
            openTime: 1500,
          }
        );
        trapdoor.startOpenTrapDoor(5000);

        const slider = this.sliders[i - 1];

        if (slider.destroyer === true) {
          // ------------------------------------------- Destroyers 2
          new DestroyerRect(
            this.game,
            trapdoorX,
            trapdoorY + 30,
            rampInterval,
            this.rampThickeness,
            0,
            slider.destroyerData
          );
        }
      }

      trapdoorX = rampX + rampWidth + rampInterval / 2;
      if (this.angle < 0) {
        trapdoorY = rampY + trapdoorVerticalLeg;
      } else {
        trapdoorY = rampY + trapdoorVerticalLeg;
      }
    }
  }
}
