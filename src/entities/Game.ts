import Matter from 'matter-js';
import Stage from './Konva/Stage';
import Layer from './Konva/Layer';
import Animation from './Animation';
import Konva from 'konva';
import Static from './Shapes/Static';
import Dinamic from './Shapes/Dinamic';
import { options as worldOptions } from '../constants/world';

const { Engine, Render, Runner } = Matter;

export default class Game {
    stageElement: HTMLDivElement;
    stage: Konva.Stage;
    layer: Konva.Layer;
    animation: Animation;
    engine: Matter.Engine = Engine.create();
    render: Matter.Render;
    runner: Matter.Runner;

    static: Static;
    dinamic: Dinamic;

    width: number;
    height: number;
    index: number = 0;
    constructor(stageElement: HTMLDivElement) {
        this.stageElement = stageElement;
        this.width = 900;
        this.height = 600;
        this.stageElement.setAttribute('style', `width: ${this.width}px; height: ${this.height}px`);
        const stageFactory = new Stage(this, this.stageElement);
        this.stage = stageFactory.getInstance();
        const layerFactory = new Layer("main");
        this.layer = layerFactory.getInstance();
        this.stage.add(this.layer);
        this.animation = new Animation(this);

        this.static = new Static(this);
        this.dinamic = new Dinamic(this);

        this.render = Render.create({
            element: this.stageElement,
            engine: this.engine,
            options: {
                width: this.width,
                height: this.height,
                showVelocity: true
            }
        });
        Render.run(this.render);

    // create runner
    this.runner = Runner.create();
        Runner.run(this.runner, this.engine);

        this.init();
    }

    init = () => {
        this.setupEvents();
        this.engine.gravity.y = 0.7;
        // this.engine.gravity.scale = worldOptions.gravitySF;
        this.static.addObjects();
    }

    setupEvents = () => {
        // window.addEventListener('resize', this.onWindowResize);
        this.stageElement.onclick = this.onMouseClick;
    }

    onWindowResize = () => {
        this.stageElement.setAttribute('style', `width: ${window.innerWidth - 2}px; height: ${window.innerHeight - 2}px`);
    };

    onMouseClick = (event: MouseEvent) => {
        console.log("event", event);
        const radius = 3;
        const x = event.offsetX;
        const y = event.offsetY;
        this.dinamic.addMarble(x, y, radius);
    }

}