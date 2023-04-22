import Settings from "../Settings";
import Color from "../UI/Color";
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

  setFillStyle(fill: Color) {
    this.fillStyle = fill as string;
    return this;
  }
}

export default Circle;
