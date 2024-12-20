import Matter from 'matter-js';
import Konva from 'konva';
import Game from "../../Game";
import { topLeftToCenter } from '../../../utils/position-utils';
import { earth as earthOptions } from '../../../constants/world';
import { degreesToRadians } from '../../../utils/trignometry-utils';

const { Body, Bodies, Composite, World } = Matter;

export default class RectFactory {
    game: Game;
    constructor(game: Game) {
        this.game = game;
    }

    create(x: number, y: number, width: number, height: number, angle: number = 0, label = 'ground') {
        const { x: mX, y: mY } = topLeftToCenter(x, y, width, height);
        const mRect = Bodies.rectangle(mX, mY, width, height, earthOptions);
        mRect.label = label;
        Body.setAngle(mRect, degreesToRadians(angle));
        World.add(this.game.engine.world, [mRect]);
    }
}