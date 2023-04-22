import { randInt } from "../../utils/math";

export class Vector2 {
  x: number;
  y: number;

  constructor(x: number = 1, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  setX(x: number): void {
    this.x = x;
  }

  getX(): number {
    return this.x;
  }

  setY(y: number): void {
    this.y = y;
  }

  getY(): number {
    return this.y;
  }

  setAngle(angle: number): void {
    let length = this.getLength();
    this.x = Math.cos(angle) * length;
    this.y = Math.sin(angle) * length;
  }

  getAngle(): number {
    return Math.atan2(this.y, this.x);
  }

  setLength(length: number): void {
    let angle = this.getAngle();
    this.x = Math.cos(angle) * length;
    this.y = Math.sin(angle) * length;
  }

  getLength(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  add(vector: Vector2): Vector2 {
    return new Vector2(this.x + vector.x, this.y + vector.y);
  }

  subtract(vector: Vector2): Vector2 {
    return new Vector2(this.x - vector.x, this.y - vector.y);
  }

  multiply(val: number): Vector2 {
    return new Vector2(this.x * val, this.y * val);
  }

  divide(val: number): Vector2 {
    return new Vector2(this.x / val, this.y / val);
  }

  toString(): string {
    return `X: ${this.getX()}\nY: ${this.getY()}\nAngle: ${this.getAngle()}\nLength: ${this.getLength()}`;
  }

  static vector(x: number, y: number): Vector2 {
    return new Vector2(x, y);
  }

  static copy(vector: Vector2) {
    return new Vector2(vector.x, vector.y);
  }

  static random(min: number, max: number): Vector2 {
    return new Vector2(randInt(min, max), randInt(min, max));
  }

  static distance(vector1: Vector2, vector2: Vector2) {
    return Math.hypot(vector1.x - vector2.x, vector1.y - vector2.y);
  }

  static zero: Vector2 = new Vector2(0, 0);
  static one: Vector2 = new Vector2(1, 1);
  static up: Vector2 = new Vector2(0, -1);
  static down: Vector2 = new Vector2(0, 1);
  static left: Vector2 = new Vector2(-1, 0);
  static right: Vector2 = new Vector2(1, 0);
  static minusOne: Vector2 = new Vector2(-1, -1);
}
