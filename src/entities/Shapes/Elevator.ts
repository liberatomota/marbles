import Matter from 'matter-js';
import Game from "../Game";
import { degreesToRadians, radiansToDegrees } from '../../utils/trignometry-utils';
import { PointType } from "../../types/line-type";
import { linearInterpolation, offsetMatterBodyPosition } from '../../utils/position-utils';
import Konva from 'konva';

const { Engine, Render, Runner, Body, World, Bodies, Constraint } = Matter;


export default class Elevator {
    game: Game;
    pivot1: Matter.Body;
    pivot2: Matter.Body;
    elevators: Matter.Body[] = [];
    angleOffset = 0.02;
    elevatorAngles: number[] = [];
    pathRadius = 25;
    numElevators = 1;
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

        const kPivot1 = new Konva.Circle({ id: pivot1.id.toString(), x: pivot1.position.x, y: pivot1.position.y, radius: 5, fill: 'black' });
        const kPivot2 = new Konva.Circle({ id: pivot2.id.toString(), x: pivot2.position.x, y: pivot2.position.y, radius: 5, fill: 'black' });
        this.game.layer.add(kPivot1);
        this.game.layer.add(kPivot2);
        this.game.layer.draw();

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
            Body.setAngle(elevatorLeft, degreesToRadians(90));
            const elevatorRight = Bodies.rectangle(x + 10, y - 7.5, 20, 5, { friction: 0.1, frictionAir: 0.02, isStatic: true });
            Body.setAngle(elevatorRight, degreesToRadians(90));
            

            const elevator = Body.create({
                parts: [elevatorBase, elevatorLeft, elevatorRight],
                friction: 0.1,
                frictionAir: 0.02,
                isStatic: true,
                label: `elevator-${i}`,
            });

            elevators.push(elevator);
            this.game.dinamic.bodies.push(elevator);
            World.add(this.game.engine.world, elevator);

            const { offsetX: offsetX1, offsetY: offsetY1 } = offsetMatterBodyPosition(elevator, elevator.position.x, elevator.position.y); 
            const kElevatorbase = new Konva.Line({
                x: offsetX1,
                y: offsetY1,
                points: elevatorBase.vertices.flatMap((v: any) => [v.x , v.y]),
                stroke: 'red',
                strokeWidth: 1,
                closed: true,
            });

            const { offsetX: offsetX2, offsetY: offsetY2 } = offsetMatterBodyPosition(elevator, elevator.position.x, elevator.position.y); 
            const kElevatorLeft = new Konva.Line({
                x: offsetX2,
                y: offsetY2,
                points: elevatorLeft.vertices.flatMap((v: any) => [v.x , v.y]),
                stroke: 'red',
                strokeWidth: 1,
                closed: true,
            });

            const { offsetX: offsetX3, offsetY: offsetY3 } = offsetMatterBodyPosition(elevator, elevator.position.x, elevator.position.y); 
            const kElevatorRight = new Konva.Line({
                x: offsetX3,
                y: offsetY3,
                points: elevatorRight.vertices.flatMap((v: any) => [v.x , v.y]),
                stroke: 'red',
                strokeWidth: 1,
                closed: true,
            });


            const { offsetX, offsetY } = offsetMatterBodyPosition(elevator, elevator.position.x, elevator.position.y);           
            const kElevatorGroup = new Konva.Group({
                x: elevator.position.x,
                y: elevator.position.y,
                // angle: radiansToDegrees(elevator.angle),
                // offsetX,
                // offsetY
            });

            

            kElevatorGroup.add(kElevatorbase, kElevatorLeft, kElevatorRight);

            const rect = new Konva.Rect({
                x: kElevatorGroup.getClientRect().x,
                y: kElevatorGroup.getClientRect().y,
                width: kElevatorGroup.getClientRect().width,
                height: kElevatorGroup.getClientRect().height,
                stroke: 'blue',
                strokeWidth: 1
            });
            console.log("rect", rect);

            this.game.dinamic.elements.set(elevator.id, kElevatorGroup);
            this.game.layer.add(kElevatorGroup);
            this.game.layer.add(rect);



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