import { Vector2 } from "../Vector/Vector2";

class Circle {
  position: Vector2;
  radius: number;
  fillStyle: string;
  strokeStyle: string;

  constructor() {
    this.strokeStyle = "";
  }

  setPosition(position: Vector2) {
    this.position = position;
    return this;
  }

  setSize(radius: number): Circle {
    this.radius = radius;
    return this;
  }

  setFillStyle(color: string) {
    this.fillStyle = color;
    return this;
  }
}

export default Circle;
