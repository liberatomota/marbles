import Konva from "konva";

export default class Layer {
    name: string;
    layer: Konva.Layer;
    constructor(name: string) {
        this.name = name;
        this.layer = new Konva.Layer({
            name: this.name});
    }
    getInstance() {
        return this.layer;
    }
}