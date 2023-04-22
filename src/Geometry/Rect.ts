import Color from "../UI/Color";
import { Vector2 } from "../Vector/Vector2";

class Rect {
  position: Vector2;
  size: Vector2;
  fillStyle: string;
  strokeStyle: string;

  constructor() {
    this.strokeStyle = "";
  }

  setPosition(position: Vector2) {
    this.position = position;
    return this;
  }

  setSize(size: Vector2): Rect {
    this.size = size;
    return this;
  }

  setFillStyle(fill: Color) {
    this.fillStyle = fill as string;
    return this;
  }

  copy() {
    return new Rect()
      .setPosition(this.position)
      .setSize(this.size)
      .setFillStyle(this.fillStyle);
  }
}

export default Rect;
