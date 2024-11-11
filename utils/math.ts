import TerrainTile from "../src/Terrain/TerrainTile";

/**
 * Random integer in interval <0, 10) or numbers passed as optional parameters
 * @param {number} min  ( optional ) minimum value -> default: 0
 * @param {number} max  ( optional ) maximum value -> default: 10
 */
export function randInt(min: number = 0, max: number = 10): number {
  if (max < min) {
    throw new Error(
      "Maximum value cannot be less than minimum value while randomizing a number"
    );
  }
  return Math.round(Math.random() * (max - min)) + min;
}

/**
 * Random floating number from interval passed as parameter
 * @param {number} min  ( optional ) minimum value -> default: 0
 * @param {number} max  ( optional ) maximum value -> default: 1
 */
export function randRange(min: number = 0, max: number = 1): number {
  if (max < min) {
    throw new Error(
      "Maximum value cannot be less than minimum value while randomizing a number"
    );
  }
  return Math.random() * (max - min) + min;
}

/**
 * Random object from passed array
 * @param {any[]} choices Array of objects or values you want to choose from
 */
export function randChoice<T>(choices: T[]): T {
  let maxIndex = choices.length - 1;
  let randomIndex = Math.round(Math.random() * (maxIndex - 0));

  return choices[randomIndex];
}

/**
 * Normalization function |
 * Converts value from range into normalized value <0, 1>
 * @param {number} value Value you want to normalize
 * @param {number} min Max value of an interval
 * @param {number} max Min value of an interval
 */
export function norm(value: number, min: number, max: number): number {
  return (value - min) / (max - min);
}

/**
 * Linear interpolation |
 * Takes normalized value and converts it into a value in a given range
 * @param {number} norm Normalized value
 * @param {number} min Max value of an interval
 * @param {number} max Min value of an interval
 */
export function lerp(norm: number, min: number, max: number): number {
  return (max - min) * norm + min;
}

/**
 * Maps value from one interval, into value from another interval
 * @param {number} value Normalized value
 * @param {number} sourceMin Min of first interval
 * @param {number} sourceMax Max of first interval
 * @param {number} destMin Min of destination interval
 * @param {number} destMax Max of destination interval
 * @returns
 */
export function map(
  value: number,
  sourceMin: number,
  sourceMax: number,
  destMin: number,
  destMax: number
): number {
  return this.lerp(this.norm(value, sourceMin, sourceMax), destMin, destMax);
}

/**
 * Clamps the number to given interval
 *
 * @param {number} value Value you want to clamp
 * @param {number} min Minimum value
 * @param {number} max Maximum valie
 * @returns
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Find the angle between two [x,y] positions
 * @param {number} sourceX
 * @param {number} sourceY
 * @param {number} destX
 * @param {number} destY
 * @returns
 */
export function angleTo(
  sourceX: number,
  sourceY: number,
  destX: number,
  destY: number
) {
  return Math.atan2(destY - sourceY, destX - sourceX);
}

/**
 * Finds the distance between two [x,y] positions
 * @param {number} sourceX
 * @param {number} sourceY
 * @param {number} destX
 * @param {number} destY
 * @returns
 */
export function distanceTo(
  sourceX: number,
  sourceY: number,
  destX: number,
  destY: number
) {
  let dx = destX - sourceX;
  let dy = destY - sourceY;

  return Math.hypot(dx, dy);
}

export function heuristic(node1: TerrainTile, node2: TerrainTile) {
  let rowDistance = Math.abs(node1.coordinates.x - node2.coordinates.x);
  let colDistance = Math.abs(node1.coordinates.y - node2.coordinates.y);

  return rowDistance + colDistance;
}
