import Matter from 'matter-js';
import Konva from 'konva';
import Game from "../../Game";
import Marble from './Marble';
import Elevator from './Elevator';
import { translatePosition } from '../../../utils/position-utils';

const { Composite } = Matter;

export default class Dinamic {
    game: Game;
    marble: Marble;
    elevator: Elevator;
    bodies: Matter.Body[] = [];
    elements: Map<number, Konva.Node> = new Map();
    constructor(game: Game) {
        this.game = game;
        this.marble = new Marble();
        this.elevator = new Elevator(this.game);
    }

    addObjects() {
        this.elevator.create(
            { x: this.game.width / 2 + 100, y: 45 },
            { x: this.game.width / 2 + 100, y: 150 },
            { bucketShouldBounce: false },
        );
    }

    addMarble(x: number, y: number, radius: number) {

        const mMarble = this.marble.create(x, y, radius, 'random', 'marble');
        this.bodies.push(mMarble);
        Composite.add(this.game.engine.world, [mMarble]);


        const kMarble = new Konva.Circle({ id: mMarble.id.toString(), x: mMarble.position.x, y: mMarble.position.y, radius, fill: mMarble.render.fillStyle });
        this.elements.set(mMarble.id, kMarble);
        this.game.layer.add(kMarble);
        this.game.layer.draw();
    }
}