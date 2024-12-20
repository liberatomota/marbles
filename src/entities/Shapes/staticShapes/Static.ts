import Matter from 'matter-js';
import Konva from 'konva';
import Game from "../../Game";
import Piramid from './Piramid';
import Color from '../../Color';
import { degreesToRadians } from '../../../utils/trignometry-utils';
import { copyAndMirrorBody, copyAndMirrorCompositeAxisX, mirrorBodyAxisX, offsetMatterBodyPosition, topLeftToCenter } from '../../../utils/position-utils';
import { earth as earthOptions } from '../../../constants/world';
import { ElementLabel } from '../../../types/elements';
import DestroyerRect from './DestroyerRect';

const { Body, Bodies, Composite, World } = Matter;

export default class Static {
    game: Game;
    bodies: Matter.Body[] = [];
    elements: Map<number, Konva.Node> = new Map();

    width: number;
    height: number;
    constructor(game: Game) {
        this.game = game;
        this.width = this.game.stage.getAttr('width');
        this.height = this.game.stage.getAttr('height');
    }

    addObjects() {
        // this.makeFrame();
        this.makeGround();
        this.makeDestroyers();
        this.makePiramid();
    }

    makeFrame() {
        const angle = 0;
        const label = ElementLabel.GROUND;
        this.addObject(0, 0, 3, this.height, angle, label);
        this.addObject(0, 0, this.width, 3, angle, label);
        this.addObject(this.width - 3, 0, 3, this.height, angle, label);
        this.addObject(0, this.height - 3, this.width, 200, angle, label);
    }

    makeGround() {
        const x = this.game.width / 2 + 100;
        const y = 148.5;
        const polygon = Bodies.rectangle(0, 0, this.game.width / 2 - 50, 5, { isStatic: true, label: ElementLabel.GROUND });
        const { offsetX, offsetY } = offsetMatterBodyPosition(polygon, x, y);
        Body.setPosition(polygon, {x: offsetX, y: offsetY });
        
        polygon.label = ElementLabel.GROUND;
        World.add(this.game.engine.world, polygon);

        
        const mirrored = copyAndMirrorBody(polygon, this.game.width / 2);
        Body.rotate(mirrored, degreesToRadians(10));
        Composite.add(this.game.engine.world, [polygon, mirrored]);
    }

    makePiramid() {
        const p = new Piramid(this.game);
    }

    makeDestroyers() {
        const d1 = new DestroyerRect(this.game, 550, 250, 30, 4);
    }

    addObject(x: number, y: number, width: number, height: number, angle: number = 0, label = 'ground') {
        const { x: mX, y: mY } = topLeftToCenter(x, y, width, height);
        const mRect = Bodies.rectangle(mX, mY, width, height, earthOptions);
        mRect.label = label;
        Body.setAngle(mRect, degreesToRadians(angle));
        this.bodies.push(mRect);
        World.add(this.game.engine.world, [mRect]);
    }
}