import Matter, { World } from "matter-js";
import Stage from "./Konva/Stage";
import Layer from "./Konva/Layer";
import Animation from "./AnimationP5";
import Konva from "konva";
import Colision from "./Colision";
import Level from "./Level";
import { LevelType } from "../constants/game-const";
import MarbleFactory from "./Shapes/Factories/MarbleFactory";

const { Engine, Render, Runner, Composite } = Matter;

// numOfFloors: number = 4, floorHeight: number = 150

export default class Game {
  stageElement: HTMLDivElement;

  level: Level | null = null;
  numOfLevels: number = 3;

  width: number;
  height: number;

  // konva
  // stage: Konva.Stage;
  // layer: Konva.Layer;
  // animation: Animation;
  
  // p5
  // animation: Animation

  engine: Matter.Engine = Engine.create();
  render: Matter.Render;
  runner: Matter.Runner;
  colision: Colision;

  marbleFactory: MarbleFactory;

  timers: NodeJS.Timeout[] = [];
  constructor(
    stageElement: HTMLDivElement,
    width: number = 0,
    height: number = 0,
    numOfLevels: number = 3
  ) {
    this.stageElement = stageElement;
    this.width = width;
    this.height = height;
    this.numOfLevels = numOfLevels;

  
    /*
    // Graphic library Konva
    const stageFactory = new Stage(this, this.stageElement);
    this.stage = stageFactory.getInstance();
    const layerFactory = new Layer("main");
    this.layer = layerFactory.getInstance();
    this.stage.add(this.layer);
    this.animation = new Animation(this);
    */

    // Graphic library P5
    // this.animation = new Animation(this, this.stageElement);

    // Physics library
    this.render = Render.create({
      element: this.stageElement,
      engine: this.engine,
      options: {
        width: this.width,
        height: this.height,
        showVelocity: true,
        wireframes: false,
        // wireframeBackground: "#ffffff",
      },
    });
    Render.run(this.render);

    // create runner
    this.runner = Runner.create();
    Runner.run(this.runner, this.engine);
    this.colision = new Colision(this);

    // Factories
    this.marbleFactory = new MarbleFactory(this);

    this.init();

    // @ts-ignore
    window.game = this;
  }

  init = () => {
    this.setupEvents();
    this.engine.gravity.y = 0.4;
    // this.render.canvas.style.position = "absolute";
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
    const radius = 5;
    const x = event.offsetX;
    const y = event.offsetY;
    this.marbleFactory.create(x, y, radius);
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
