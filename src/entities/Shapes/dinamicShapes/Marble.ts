import { Bodies, Body } from "matter-js";
import { marble as marbleOptions } from "../../../constants/world";
import { randomPosNeg, vx } from "../../../utils/physics-utils";
import Color from "../../Color";

export default class Marble {

    constructor() { }

    createMarble(x: number, y: number, radius: number, color: string, label: string, isStatic = false) {

        const _color = new Color(color, 1).rgb;

        const marble = Bodies.circle(x, y, radius, {
            ...marbleOptions,
            isStatic: isStatic,
            label: label,
            render: { fillStyle: _color }
        });
        // Body.setVelocity(marble, { x: vx(), y: 0 });
        // Body.setAngularVelocity(marble, randomPosNeg() / 8);
        return marble;
    };

};