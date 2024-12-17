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

export const offsetMatterBodyPosition = (body: Matter.Body, top: number, left: number) => {
  const bounds = body.bounds;
  const offsetX = body.position.x - bounds.min.x;
  const offsetY = body.position.y - bounds.min.y;

  // Desired top-left position
  const topLeftX = top;
  const topLeftY = left;

  Body.setPosition(body, {
    x: topLeftX + offsetX,
    y: topLeftY + offsetY,
  });

  return { offsetX: topLeftX + offsetX, offsetY: topLeftY + offsetY };
};
