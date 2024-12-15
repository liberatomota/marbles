import Konva from "konva";
import Game from "../Game";

export default class Stage {
    game: Game;
    stage: Konva.Stage;
    container: HTMLDivElement;
    constructor( game: Game, stageElement: HTMLDivElement) {
        this.game = game;
        this.container = stageElement;
        this.stage = new Konva.Stage({
            container: this.container,
            width: this.game.width,
            height: this.game.height
        })
    }
    getInstance() {
        return this.stage;
    }
}