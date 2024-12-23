export const options = {
    gravity: 1,
    gravitySF: 0.0018,
    timeScale: 1,
}

export const earth = {
    friction: 0, // Low sliding friction
    frictionStatic: 0, // Low static friction
    restitution: 0.8, // Optional: add some bouncinessI
    isStatic: true
}

export const marble = {
    // restitution: 0.6,
    // friction: 0.05,
    // frictionAir: 0.06,
    // frictionStatic: 0,
    // slop: 0,
    // gravity: 1,
    // gravitySF: 0.0018,
    // timeScale: 1,
    radius: 7,
    restitution: 0.6, // Some bounciness
    friction: 0, // Low sliding friction
    frictionAir: 0.009, // Minimal air resistance
    frictionStatic: 0, // No stickiness
}