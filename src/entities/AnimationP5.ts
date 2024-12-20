import p5 from "p5";
import Game from "./Game";
import { Composite, Engine } from "matter-js";
import { ElementLabel } from "../types/elements";

export default class Animate {
  game: Game;
  stageElement: HTMLElement;
  canvas: HTMLCanvasElement | null = null;
  p5Instance: p5;

  index: number = 0;

  constructor(game: Game, stageElement: HTMLElement) {
    this.game = game;
    this.stageElement = stageElement;
    this.p5Instance = new p5(this.sketch.bind(this));
  }

  sketch(p: p5) {
    p.setup = () => {
      const rect = this.stageElement.getBoundingClientRect();
      const canvasElement = p.createCanvas(rect.width, rect.height);
      this.canvas = canvasElement.elt as HTMLCanvasElement;
      this.setCanvasSizeAndPosition();
      p.frameRate(60);
    };

    p.draw = () => {
      // this.animate(p);
    };
  }

  animate(p: p5) {
    if (this.shouldWait()) return;
    this.checkOffscreen();

    // clear the canvas transparent
    // p.background(0, 0, 0, 0);
    p.clear();

    const bodies = this.game.engine.world.bodies;
    // console.log("bodies", bodies)

    for (let i = 0; i < bodies.length; i++) {
      const body = bodies[i];

      if (body.label === ElementLabel.MARBLE) {
        // create a p5 circle sith the body properties
        const x = body.position.x;
        const y = body.position.y;
        const radius = body.circleRadius;
        p.fill("red");
        p.circle(x, y, radius ?? 2);
      }

      if (body.label === ElementLabel.ELEVATOR_BUCKET) {
        for (let j = 1; j < body.parts.length; j++) {
          const part = body.parts[j];
          const x = part.position.x;
          const y = part.position.y;
          const w = part.bounds.max.x - part.bounds.min.x;
          const h = part.bounds.max.y - part.bounds.min.y;
          const angle = part.angle;
          const vertices = part.vertices;

          p.push();
          p.translate(x, y); // Translate to the part's position
          p.rotate(angle); // Rotate around the part's position
          
          p.fill("blue");
          p.beginShape();
          // Loop through the vertices and draw the polygon
          for (let i = 0; i < vertices.length; i++) {
            const vertex = vertices[i];
            p.vertex(vertex.x, vertex.y); // Draw each vertex
          }
          p.endShape(p.CLOSE);
// 
          p.pop();

          if (this.index <= 0) {
            console.log(body);
            console.log(body.parts);
            console.log({ x, y, w, h, angle });
            this.index++;
          }

          // p.push();
          // p.translate(x, y);
          // p.rotate(angle);
          // p.rectMode(p.CENTER);
          // p.fill("blue");
          // p.rect(0, 0, w, h);
          // p.pop();
        }
      }
    }

    // Engine.update(this.game.engine);
  }

  setCanvasSizeAndPosition() {
    const rect = this.stageElement.getBoundingClientRect();
    this.canvas!.style.width = `${rect.width}px`;
    this.canvas!.style.height = `${rect.height}px`;
    console.log("rect", rect);
    console.log("this.canvas", this.canvas);
    this.canvas!.style.position = "absolute";
    this.canvas!.style.left = `${rect.left}px`;
    this.canvas!.style.top = `${rect.top}px`;
    // remove event pointers from canvas
    this.canvas!.style.pointerEvents = "none";
  }

  windowResized() {
    this.setCanvasSizeAndPosition();
  }

  shouldWait() {
    return false;
  }

  checkOffscreen = () => {
    this.game.engine.world.bodies.forEach((body) => {
      if (body.position.y > this.game.height || body.position.y < 0) {
        console.log("REMOVED", body);
        Composite.remove(this.game.engine.world, body);
      }
    });
  };
}
