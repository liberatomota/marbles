import { PointType } from "../types/line-type";

export const translatePosition = (body: Matter.Body) => {

    // const x = body.position.x - body.bounds.min.x;
    // const y = body.position.y - body.bounds.min.y;
    const x = body.bounds.min.x;
    const y = body.bounds.min.y;

    return { x, y }
}

export const topLeftToCenter = (x: number, y: number, w: number, h: number) => {
    return { x: x + w / 2, y: y + h / 2 }
}

export const linearInterpolation = (p1: PointType, p2: PointType, t: number) => {
    const x = p1.x + (p2.x - p1.x) * t;
    const y = p1.y + (p2.y - p1.y) * t;
    return { x, y };
}