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

  setFillStyle(fill: string) {
    this.fillStyle = fill
    return this;
  }

  setStrokeStyle(stroke: string) {
    this.strokeStyle = stroke;
    return this;
  }

  getCenter() {
    let centerX = Math.ceil(this.position.x + this.size.x / 2);
    let centerY = Math.ceil(this.position.y + this.size.y / 2);

    return new Vector2(centerX, centerY);
  }

  copy() {
    return new Rect()
      .setPosition(this.position)
      .setSize(this.size)
      .setFillStyle(this.fillStyle);
  }
}

export default Rect;
