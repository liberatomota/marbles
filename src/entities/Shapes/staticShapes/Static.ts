import Matter from 'matter-js';
import Konva from 'konva';
import Game from "../../Game";
import Piramid from './Piramid';
import Color from '../../Color';
import { degreesToRadians } from '../../../utils/trignometry-utils';
import { copyAndMirrorBody, copyAndMirrorCompositeAxisX, mirrorBodyAxisX, offsetMatterBodyPosition, topLeftToCenter } from '../../../utils/position-utils';
import { earth as earthOptions } from '../../../constants/world';

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
        // slope 1
        // this.addObject(-200, 100, this.width - 100, 10, 2, 'random');
        // this.makeFrame();
        this.makeGround();
        // this.makePiramid();

        new Piramid(this.game);

    }

    makeFrame() {
        const angle = 0;
        const color = 'black';
        this.addObject(0, 0, 3, this.height, angle, color);
        this.addObject(0, 0, this.width, 3, angle, color);
        this.addObject(this.width - 3, 0, 3, this.height, angle, color);
        this.addObject(0, this.height - 3, this.width, 200, angle, color);
    }

    makeGround() {
        const x = this.game.width / 2 + 50;
        const y = 148.5;
        const polygon = Bodies.rectangle(0, 0, this.game.width / 2 - 50, 5, earthOptions);
        const { offsetX, offsetY } = offsetMatterBodyPosition(polygon, x, y);
        Body.setPosition(polygon, {x: offsetX, y: offsetY });
        polygon.label = 'ground';
        World.add(this.game.engine.world, polygon);

        
        // const mirrored = copyAndMirrorBody(polygon, this.game.width / 2);
        // Composite.add(this.game.engine.world, [polygon, mirrored]);
    }

    makePiramid() {
        const vertices = [
            { x: this.game.width / 2 + 75, y: 125 },
            { x: this.game.width / 2, y: 25 },
            { x: this.game.width / 2 - 75, y: 125 },
        ];

        const mPiramid = Bodies.fromVertices(0, 0, [vertices], earthOptions);
        mPiramid.label = 'piramid';
        mPiramid.render.fillStyle = 'red';

        World.add(this.game.engine.world, [mPiramid]);
        this.bodies.push(mPiramid);
    }

    addObject(x: number, y: number, width: number, height: number, angle: number = 0, color: string = 'black') {

        const { x: mX, y: mY } = topLeftToCenter(x, y, width, height);

        const mRect = Bodies.rectangle(mX, mY, width, height, earthOptions);
        mRect.label = 'ground';
        Body.setAngle(mRect, degreesToRadians(angle));
        this.bodies.push(mRect);
        World.add(this.game.engine.world, [mRect]);
    }
}