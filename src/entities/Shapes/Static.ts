import Matter from 'matter-js';
import Konva from 'konva';
import Game from "../Game";
import Elevator from './Elevator';
import Color from '../Color';
import { degreesToRadians } from '../../utils/trignometry-utils';
import { topLeftToCenter } from '../../utils/position-utils';
import { earth as earthOptions } from '../../constants/world';

const { Body, Bodies, Composite } = Matter;

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
        // this.makeGround();
        // this.makePiramid();

        const p1 = { x: 100, y: 100 };
        const p2 = { x: 100, y: 300 };

        const elevator = new Elevator(this.game, p1, p2);

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
        const vertices = [
            { x: this.game.width, y: 100 },
            { x: 100, y: 130 },
            { x: 100, y: 140 },
            { x: this.game.width, y: 140 },
            { x: this.game.width, y: 100 },
        ];

        const mPolygon = Bodies.fromVertices(0, 0, [vertices], earthOptions);
        mPolygon.label = 'ground';

        const bounds = mPolygon.bounds;
        const offsetX = mPolygon.position.x - bounds.min.x;
        const offsetY = mPolygon.position.y - bounds.min.y;

        // Desired top-left position
        const topLeftX = 100;
        const topLeftY = 100;
        
        Body.setPosition(mPolygon, {
            x: topLeftX + offsetX,
            y: topLeftY + offsetY,
        });
        Composite.add(this.game.engine.world, [mPolygon]);
        this.bodies.push(mPolygon);
        
        const points = mPolygon.vertices.flatMap((v) => [v.x , v.y]);

        const kPolygon = new Konva.Line({
            id: mPolygon.id.toString(),
            points: points,
            fill: 'black',
            // stroke: 'black',
            strokeWidth: 2,
            closed: true,
            offsetX: topLeftX + offsetX,
            offsetY: topLeftY + offsetY,
            // x: topLeftX,
            // y: topLeftY
        });

        this.elements.set(mPolygon.id, kPolygon);
        this.game.layer.add(kPolygon);
        this.game.layer.draw();

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

        const bounds = mPiramid.bounds;
        const offsetX = mPiramid.position.x - bounds.min.x;
        const offsetY = mPiramid.position.y - bounds.min.y;

        // Desired top-left position
        const topLeftX = this.game.width / 2 - 75;
        const topLeftY = 25;
        
        Body.setPosition(mPiramid, {
            x: topLeftX + offsetX,
            y: topLeftY + offsetY,
        });
        Composite.add(this.game.engine.world, [mPiramid]);
        this.bodies.push(mPiramid);
        
        const points = mPiramid.vertices.flatMap((v) => [v.x , v.y]);

        const kPiramid = new Konva.Line({
            id: mPiramid.id.toString(),
            points: points,
            fill: 'black',
            strokeWidth: 2,
            closed: true,
            offsetX: topLeftX + offsetX,
            offsetY: topLeftY + offsetY,
        });

        this.elements.set(mPiramid.id, kPiramid);
        this.game.layer.add(kPiramid);
        this.game.layer.draw();

    }

    addObject(x: number, y: number, width: number, height: number, angle: number = 0, color: string = 'black') {

        const { x: mX, y: mY } = topLeftToCenter(x, y, width, height);

        const mRect = Bodies.rectangle(mX, mY, width, height, earthOptions);
        mRect.label = 'ground';
        Body.setAngle(mRect, degreesToRadians(angle));
        this.bodies.push(mRect);
        Composite.add(this.game.engine.world, [mRect]);

        const kRect = new Konva.Rect({ id: mRect.id.toString(), x, offsetX: width / 2, y, offsetY: height / 2, width, height, fill: new Color(color, 1).rgb });
        kRect.rotation(angle);
        this.elements.set(mRect.id, kRect);
        this.game.layer.add(kRect);
        this.game.layer.draw();
    }
}