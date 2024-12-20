import Matter, { World } from "matter-js";
import Stage from "./Konva/Stage";
import Layer from "./Konva/Layer";
import Animation from "./Animation";
import Konva from "konva";
import Static from "./Shapes/staticShapes/Static";
import Dinamic from "./Shapes/dinamicShapes/Dinamic";
import Colision from "./Colision";
import { options as worldOptions } from "../constants/world";
import Level from "./Level";
import { LevelType } from "../constants/game-const";

const { Engine, Render, Runner, Composite } = Matter;

// numOfFloors: number = 4, floorHeight: number = 150

export default class Game {
  stageElement: HTMLDivElement;

  level: Level | null = null;
  numOfLevels: number = 3;

  width: number;
  height: number;

  stage: Konva.Stage;
  layer: Konva.Layer;
  animation: Animation;
  engine: Matter.Engine = Engine.create();
  render: Matter.Render;
  runner: Matter.Runner;
  colision: Colision;

  timers: NodeJS.Timeout[] = [];
  constructor(
    stageElement: HTMLDivElement,
    width: number = 900,
    height: number = 600,
    numOfLevels: number = 3
  ) {
    this.stageElement = stageElement;
    this.width = width;
    this.height = height;
    this.numOfLevels = numOfLevels;

    this.stageElement.setAttribute(
      "style",
      `width: ${this.width}px; height: ${this.height}px`
    );
    // Graphic library
    const stageFactory = new Stage(this, this.stageElement);
    this.stage = stageFactory.getInstance();
    const layerFactory = new Layer("main");
    this.layer = layerFactory.getInstance();
    this.stage.add(this.layer);
    this.animation = new Animation(this);

    // Physics library
    this.render = Render.create({
      element: this.stageElement,
      engine: this.engine,
      options: {
        width: this.width,
        height: this.height,
        showVelocity: true,
      },
    });
    Render.run(this.render);

    // create runner
    this.runner = Runner.create();
    Runner.run(this.runner, this.engine);
    this.colision = new Colision(this);

    this.init();

    // @ts-ignore
    window.game = this;
  }

  init = () => {
    this.setupEvents();
    this.engine.gravity.y = 0.1;
  };

  setupEvents = () => {
    // window.addEventListener('resize', this.onWindowResize);
    this.stageElement.onclick = this.onMouseClick;
  };

  onWindowResize = () => {
    this.stageElement.setAttribute(
      "style",
      `width: ${window.innerWidth - 2}px; height: ${window.innerHeight - 2}px`
    );
  };

  onMouseClick = (event: MouseEvent) => {
    console.log("event", event);
    const radius = 3;
    const x = event.offsetX;
    const y = event.offsetY;
    // this.dinamic.addMarble(x, y, radius);
  };

  createLevel = (levelNumber: number, levelData: LevelType) => {
    this.reset();
    this.level = new Level(this, levelNumber, levelData);
  };

  reset() {
    this.clearAllTimers();
    // this.animation.lastRenderTime = 0;
    if (this.level) {
      this.level.levelEngine.stop();
    }
    this.level = null;

    console.log("this.engine.world.bodies", this.engine.world.bodies);
    for (let i = 0; i < this.engine.world.bodies.length; i++) {
      const body = this.engine.world.bodies[i];
      Composite.remove(this.engine.world, body)
      i--;
    }
    // Composite.clear(this.engine.world, true);
    // Engine.clear(this.engine);
  }

  registerTimer(timer: NodeJS.Timeout) {
    this.timers.push(timer);
  }

  clearTimer(timer: NodeJS.Timeout) {
    const index = this.timers.indexOf(timer);
    if (index !== -1) {
      this.timers.splice(index, 1);
    }
    clearInterval(timer);
    clearTimeout(timer);
  }

  clearAllTimers() {
    this.timers.forEach((timer) => {
      console.log("timer", timer);
      this.clearTimer(timer);
    });
    this.timers.length = 0;
    console.log("All timers cleared!");
  }
}
