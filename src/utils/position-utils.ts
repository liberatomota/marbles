import Matter from "matter-js";
import { PointType } from "../types/line-type";

const { Body } = Matter;

export const translatePosition = (body: Matter.Body) => {
  // const x = body.position.x - body.bounds.min.x;
  // const y = body.position.y - body.bounds.min.y;
  const x = body.bounds.min.x;
  const y = body.bounds.min.y;

  return { x, y };
};

export const topLeftToCenter = (x: number, y: number, w: number, h: number) => {
  return { x: x + w / 2, y: y + h / 2 };
};

export const linearInterpolation = (
  p1: PointType,
  p2: PointType,
  t: number
) => {
  const x = p1.x + (p2.x - p1.x) * t;
  const y = p1.y + (p2.y - p1.y) * t;
  return { x, y };
};

export const offsetMatterBodyPosition = (
  body: Matter.Body,
  top: number,
  left: number,
  setPosition = false
) => {
  const bounds = body.bounds;
  console.log("bounds", bounds);
  const offsetX = body.position.x - bounds.min.x;
  const offsetY = body.position.y - bounds.min.y;

  // Desired top-left position
  const topLeftX = top;
  const topLeftY = left;

  if (setPosition) {
    Body.setPosition(body, {
      x: topLeftX + offsetX,
      y: topLeftY + offsetY,
    });
  }

  return { offsetX: topLeftX + offsetX, offsetY: topLeftY + offsetY };
};


export const mirrorBodyAxisX = (body: Matter.Body, axisX = 0) => {
  const mirrored = {...body}; // Copy properties
  mirrored.position.x = axisX * 2 - body.position.x;
  mirrored.position.y = body.position.y;
  mirrored.angle = -body.angle;
  return mirrored;
}


export const copyAndMirrorBody = (original: Matter.Body, axisX = 0) => {
  const newPosition = {
      x: axisX * 2 - original.position.x, // Reflect across axisX
      y: original.position.y // Keep the same y-coordinate
  };

  return Matter.Bodies.fromVertices(
      newPosition.x,
      newPosition.y,
      [original.vertices.reverse()],
      {
          angle: -original.angle, // Mirror the angle
          isStatic: original.isStatic, // Preserve static property
          render: { ...original.render } // Copy rendering options
      }
  );
}

export const  copyAndMirrorCompositeAxisX = (originalComposite: Matter.Composite, axisX = 0) => {
  const newParts = originalComposite.bodies.map(body =>
      copyAndMirrorBody(body, axisX)
  );

  return Matter.Composite.create({
      label: `Mirrored-${originalComposite.label}`,
      bodies: newParts
  });
}

export const rotateAroundPivot = (body: Matter.Body, pivot: PointType, angle: number) => {
  const sin = Math.sin(angle);
  const cos = Math.cos(angle);

  // Offset vector from pivot to the body's center
  const offsetX = body.position.x - pivot.x;
  const offsetY = body.position.y - pivot.y;

  // New position after rotation
  const newX = pivot.x + (offsetX * cos - offsetY * sin);
  const newY = pivot.y + (offsetX * sin + offsetY * cos);

  return { newX, newY };
}