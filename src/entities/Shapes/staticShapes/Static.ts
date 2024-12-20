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
        const opt = { isStatic: true, label: ElementLabel.GROUND };
        
        const halfWidth = this.game.width / 2;
        let xx = halfWidth + 145;
        const y = 148.5;

        const gl1 = Bodies.rectangle(0, 0, 15, 5, opt);
        const offsets1 = offsetMatterBodyPosition(gl1, halfWidth + 100, y);
        Body.setPosition(gl1, {x: offsets1.offsetX, y: offsets1.offsetY });

        const gl2 = Bodies.rectangle(0, 0, halfWidth, 5, opt);
        const offsets2 = offsetMatterBodyPosition(gl2, xx, y);
        Body.setPosition(gl2, {x: offsets2.offsetX, y: offsets2.offsetY });

        World.add(this.game.engine.world, [gl1, gl2]);
        


        
        // const mirrored = copyAndMirrorBody(polygon, this.game.width / 2);
        // Body.rotate(mirrored, degreesToRadians(10));
        // Composite.add(this.game.engine.world, [polygon, mirrored]);
    }

    makePiramid() {
        const p = new Piramid(this.game);
    }

    makeDestroyers() {
        const middleW = this.game.width / 2
        const d1W = 100;
        const d1Offset = d1W / 2;
        const d1 = new DestroyerRect(this.game, middleW + 40 + d1Offset, 220, d1W, 4);
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