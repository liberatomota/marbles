import Matter from 'matter-js';
import Konva from 'konva';
import Game from "../Game";
import Marble from './Marble';
import { translatePosition } from '../../utils/position-utils';

const { Composite } = Matter;

export default class Dinamic {
    game: Game;
    marbleFactory: Marble;
    bodies: Matter.Body[] = [];
    elements: Map<number, Konva.Node> = new Map();
    constructor(game: Game) {
        this.game = game;
        this.marbleFactory = new Marble();
    }

    addObjects() {

    }

    addMarble(x: number, y: number, radius: number) {

        const mMarble = this.marbleFactory.createMarble(x, y, radius, 'random', 'marble');
        this.bodies.push(mMarble);
        Composite.add(this.game.engine.world, [mMarble]);


        const kMarble = new Konva.Circle({ id: mMarble.id.toString(), x: mMarble.position.x, y: mMarble.position.y, radius, fill: mMarble.render.fillStyle });
        this.elements.set(mMarble.id, kMarble);
        this.game.layer.add(kMarble);
        this.game.layer.draw();
    }
}