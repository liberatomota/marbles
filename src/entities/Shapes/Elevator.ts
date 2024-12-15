import Matter from 'matter-js';
import Game from "../Game";
import { degreesToRadians, radiansToDegrees } from '../../utils/trignometry-utils';
import { PointType } from "../../types/line-type";
import { linearInterpolation } from '../../utils/position-utils';

const { Engine, Render, Runner, Body, World, Bodies, Constraint } = Matter;


export default class Elevator {
    game: Game;
    pivot1: Matter.Body;
    pivot2: Matter.Body;
    elevators: Matter.Body[] = [];
    angleOffset = 0.02;
    elevatorAngles: number[] = [];
    pathRadius = 25;
    numElevators = 2;
    deployPoint: PointType;
    constructor(game: Game, p1: PointType, p2: PointType) {
        this.game = game;
        const [pivot1, pivot2] = this.createPivots(p1, p2);
        this.pivot1 = pivot1;
        this.pivot2 = pivot2;

        this.elevators = this.createElevators();
        this.elevators.forEach(() => this.elevatorAngles.push(this.angleOffset));

        this.deployPoint = linearInterpolation(p1, p2, 0.2);


        setInterval(this.moveElevators, 1000 / 60);
    }

    createPivots(p1: PointType, p2: PointType) {
        const pivot1 = Bodies.circle(p1.x, p1.y, 5, { isStatic: true });
        const pivot2 = Bodies.circle(p2.x, p2.y, 5, { isStatic: true });
        World.add(this.game.engine.world, [pivot1, pivot2]);
        return [pivot1, pivot2];
    }

    createElevators() {
        const elevators = [];

        // Criar os elevadores
        for (let i = 0; i < this.numElevators; i++) {
            const angle = (i / this.numElevators) * Math.PI * 4; // Distribuir os elevadores
            const x = this.pivot1.position.x + Math.cos(angle) * this.pathRadius;
            const y = this.pivot1.position.y + Math.sin(angle) * this.pathRadius;

            const elevatorBase = Bodies.rectangle(x, y, 20, 5, { friction: 0.1, frictionAir: 0.02, isStatic: true });
            const elevatorLeft = Bodies.rectangle(x - 10, y - 7.5, 20, 5, { friction: 0.1, frictionAir: 0.02, isStatic: true });
            const elevatorRight = Bodies.rectangle(x + 10, y - 7.5, 20, 5, { friction: 0.1, frictionAir: 0.02, isStatic: true });
            Body.setAngle(elevatorLeft, degreesToRadians(90));
            Body.setAngle(elevatorRight, degreesToRadians(90));

            const elevator = Body.create({
                parts: [elevatorBase, elevatorLeft, elevatorRight],
                friction: 0.1,
                frictionAir: 0.02,
                isStatic: true
            });
            
            elevators.push(elevator);
            World.add(this.game.engine.world, elevator);
        }

        return elevators;
    }

    moveElevators = () => {



        this.elevators.forEach((elevator: any, index: number) => {

            let x = elevator.position.x;
            let y = elevator.position.y;
            let bucketAngle = 0;
            // console.log("x", x);
            // console.log("y", y);
            if (y > this.pivot1.position.y && y < this.pivot2.position.y) {
                // desce
                if (x < this.pivot1.position.x) {
                    y = y - 1;
                    Body.setAngle(elevator, 0);
                } else {
                    bucketAngle = y < this.deployPoint.y ? 0.1 : -0.05;
                    y = y + 1;
                }
            } else {
                Body.setAngle(elevator, 0);
                this.elevatorAngles[index] += 0.02;
                const pivot = elevator.position.y <= this.pivot1.position.y ? this.pivot1 : this.pivot2;
                // roda esquerda
                const angle = this.elevatorAngles[index] + (index * Math.PI);
                x = pivot.position.x + Math.cos(angle) * this.pathRadius;
                y = pivot.position.y + Math.sin(angle) * this.pathRadius;
            }


            // Atualiza a posição do elevador
            if (bucketAngle !== 0) {
                const previewAngle = elevator.angle;
                const newAngle = previewAngle + bucketAngle;
                Body.setAngle(elevator, newAngle < 0 ? 0 : newAngle > 2 ? 2 : newAngle);
            }
            Body.setPosition(elevator, { x, y });
        });
    };
}