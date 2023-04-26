import Circle from "../Geometry/Circle";
import Settings from "../Settings";
import Tile from "../Terrain/Tile";
import { Vector2 } from "../Vector/Vector2";

class Food extends Circle {
  private parentTile: Tile;
  private maxAmount: number = 0;
  private amount: number = 0;
  isBeingGathered = false;

  constructor(parent: Tile) {
    super();

    this.amount = Settings.settings.world.foodMaxAmount;
    this.maxAmount = Settings.settings.world.foodMaxAmount;

    this.parentTile = parent;
    this.parentTile.addResource(this);

    this.position = new Vector2(
      this.parentTile.position.x + this.parentTile.size.x / 2,
      this.parentTile.position.y + this.parentTile.size.y / 2
    );

    this.fillStyle = Settings.settings.colors.food;

    this.radius = this.parentTile.size.x * 0.3;
  }

  getParent() {
    return this.parentTile;
  }

  update(deltaTime) {
    if (this.amount < this.maxAmount) {
      this.amount += Settings.settings.world.foodGrowingSpeed * deltaTime;
      this.radius = ((this.amount / this.maxAmount) * 100) * (this.parentTile.size.x * 0.3) / 100;
    }
  }

  gather(gatheredAmount: number) {
    if (this.amount - gatheredAmount < 0) {
      this.amount = 0;
      return this.amount;
    } else {
      this.amount = this.amount - gatheredAmount;
      return gatheredAmount;
    }
  }

  getAmount() {
    return this.amount;
  }

  getPatentTile() {
    return this.parentTile;
  }

  getMaxAmount() {
    return this.maxAmount;
  }
}

export default Food;
