import Matter, { World } from "matter-js";
import Stage from "./Konva/Stage";
import Layer from "./Konva/Layer";
import Animation from "./AnimationP5";
import Konva from "konva";
import Colision from "./Colision";
import Level from "./Level";
import { GAME_RESOLUTION, LevelType } from "../constants/game-const";
import MarbleFactory from "./Shapes/Factories/MarbleFactory";
import { marble } from "../constants/world";
import { ElementLabel } from "../types/elements";
import RectFactory from "./Shapes/Factories/RectFactory";

const { Engine, Render, Runner, Composite } = Matter;

type ViewType = {
  width: number;
  height: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
  viewWidth: number;
  viewHeight: number;
  middleX: number;
  middleY: number;
}

export default class Game {
  stageElement: HTMLDivElement;

  level: Level | null = null;
  numOfLevels: number = 3;

  width: number;
  height: number;
  resolution: number[] = GAME_RESOLUTION;
  view: ViewType;

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
  rectFactory: RectFactory;

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
    this.rectFactory = new RectFactory(this);

    this.view = this.calculateFrame();
    console.log("this.view", this.view)

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
    const radius = marble.radius;
    const x = event.offsetX;
    const y = event.offsetY;
    this.marbleFactory.create(x, y, radius);
  };

  calculateFrame() {
    
    const width = this.stageElement.getClientRects()[0].width;
    const height = this.stageElement.getClientRects()[0].height;
    const viewWidth = this.resolution[0];
    const viewHeight = this.resolution[1];
    const hOffset = viewWidth / 2;
    const vOffset = viewHeight / 2;
    
    const left = width / 2 - hOffset;
    const right = width / 2 + hOffset;
    const top = height / 2 - vOffset;
    const bottom = height / 2 + vOffset;

    return {
      width,
      height,
      left,
      right,
      top,
      bottom,
      viewWidth,
      viewHeight,
      middleX: width / 2,
      middleY: height / 2
    }
  }

  createFrame() {
    const angle = 0;
    const label = ElementLabel.GROUND;
    const frameThickness = 6;

    this.rectFactory.create(this.view.left, this.view.top, this.view.viewWidth, frameThickness, angle, label);
    this.rectFactory.create(this.view.left, this.view.bottom - frameThickness, this.view.viewWidth, frameThickness, angle, label);
    this.rectFactory.create(this.view.right - frameThickness, this.view.top, frameThickness, this.view.viewHeight, angle, label);
    this.rectFactory.create(this.view.left, this.view.top, frameThickness, this.view.viewHeight, angle, label);
  }

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
      Composite.remove(this.engine.world, body);
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
