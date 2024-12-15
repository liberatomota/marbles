export const randomPosNeg = () => {
    let random = Math.sin(2 * Math.PI * Math.random());
    // Add some skey for better bell curve
    return Math.pow(random, 3);
  };
  export const vx = () => {
    return 0.3 * randomPosNeg();
  };