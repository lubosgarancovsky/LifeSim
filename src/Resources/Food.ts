import Circle from "../Geometry/Circle";
import Settings from "../Settings";
import TerrainTile from "../Terrain/TerrainTile";
import { Time } from "../Time";
import { Vector2 } from "../Vector/Vector2";

class Food extends Circle {
  private parentTile: TerrainTile;
  private maxAmount: number = 0;
  private amount: number = 0;
  isBeingGathered = false;

  constructor(parent: TerrainTile) {
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

  update() {
    if (this.amount < this.maxAmount) {
      this.amount += Settings.settings.world.foodGrowingSpeed * Time.deltaTime;
      this.radius =
        ((this.amount / this.maxAmount) *
          100 *
          (this.parentTile.size.x * 0.3)) /
        100;
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

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.fillStyle = this.fillStyle;
    ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();

    if (Settings.settings.debug.resourceAmount) {
      ctx.fillStyle = "rgb(0,0,0)";
      ctx.textAlign = "left";
      ctx.font = "11px courier new";
      ctx.fillText(
        this.amount.toFixed(0).toString(),
        this.position.x,
        this.position.y
      );
    }

    ctx.closePath();
  }
}

export default Food;
