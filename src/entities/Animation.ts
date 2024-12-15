import Matter from 'matter-js';
import Konva from "konva";
import Game from "./Game";
import { translatePosition } from '../utils/position-utils';

const Engine = Matter.Engine;
const Composite = Matter.Composite;

export default class Animate {
    game: Game;
    instance: Konva.Animation;

    lastRenderTime = 0;
    renderInterval = 30;
    constructor(game: Game) {
        this.game = game;
        this.instance = new Konva.Animation(this.animate, this.game.layer);
        this.instance.start();
    }


    animate = (frame: any) => {

        this.checkOffscreen();

        if (this.shouldWait(frame)) {
            Engine.update(this.game.engine);
            return;
        };

        // console.log(this.game.engine.world.bodies);
        const staticBodies = this.game.static.bodies;
        const staticElements = this.game.static.elements;
        const dinamicBodies = this.game.dinamic.bodies;
        const dinamicElements = this.game.dinamic.elements;
        // console.log("staticBodies", staticBodies);
        // console.log("staticElements", staticElements);
        // console.log("dinamicBodies", dinamicBodies);
        // console.log("dinamicElements", dinamicElements);

        for (let i = 0; i < staticBodies.length; i++) {
            const body = staticBodies[i];
            if (['ground', 'piramid'].includes(body.label)) {
                const element = staticElements.get(body.id) as Konva.Rect;
                if (element) {
                    const { x: kX, y: kY } = translatePosition(body);
                    // element.x(kX);
                    // element.y(kY);
                    element.x(body.position.x);
                    element.y(body.position.y);
                }
            }
        }

        for (let i = 0; i < dinamicBodies.length; i++) {
            const body = dinamicBodies[i];
            if (body.label === 'marble') {
                const element = dinamicElements.get(body.id) as Konva.Rect;
                if (element) {
                    const { x: kX, y: kY } = translatePosition(body);
                    element.x(body.position.x);
                    element.y(body.position.y);
                }
            }
        }

        this.game.layer.draw();
        Engine.update(this.game.engine);

    }

    checkOffscreen = () => {
        this.game.dinamic.bodies.forEach((body) => {
            if (body.position.y > this.game.height || body.position.y < 0) {
                console.log("REMOVED", body);
                Composite.remove(this.game.engine.world, body);
                this.game.dinamic.bodies.splice(this.game.dinamic.bodies.indexOf(body), 1);
                this.game.dinamic.elements.get(body.id)?.remove();
                this.game.dinamic.elements.delete(body.id);
            }
        });
    }

    shouldWait = (frame: any) => {
        let wait = true;
        if (frame.time - this.lastRenderTime >= this.renderInterval) {
            this.lastRenderTime = frame.time;
            wait = false;
        }
        return wait;
    }
}