import Circle from "../Geometry/Circle";
import Rect from "../Geometry/Rect";
import Settings from "../Settings";
import Tile from "../Terrain/Tile";
import Color from "../UI/Color";
import { Vector2 } from "../Vector/Vector2";
import ResourceType from "./ResourceType";

class Resource {
  private parentTile: Tile;
  private maxAmount: number = 0;
  private amount: number = 0;
  private type: ResourceType;
  private mesh: any[] = [];
  isBeingGathered = false;

  constructor(parent: Tile, type: ResourceType) {
    if (type === ResourceType.FOOD) {
      this.amount = 250;
      this.maxAmount = 250;
    }

    if (type === ResourceType.WOOD) {
      this.amount = 100;
      this.maxAmount = 100;
    }

    if (type === ResourceType.STONE) {
      this.amount = 1000;
      this.maxAmount = 1000;
    }

    this.parentTile = parent;
    this.type = type;
    this.parentTile.addResource(this);

    this.createMesh(type);
  }

  getParent() {
    return this.parentTile;
  }

  update() {
    if (this.type === ResourceType.FOOD && this.amount < this.maxAmount) {
      this.amount += 0.015;
    }

    if (this.type === ResourceType.WOOD && this.amount < this.maxAmount) {
      this.amount += 0.01;
    }
  }

  createMesh(type: ResourceType) {
    const tileSize = Settings.TILE_SIZE;

    if (type === ResourceType.STONE) {
      this.mesh.push({
        type: "rect",
        mesh: new Rect()
          .setPosition(
            this.parentTile.position.add(
              new Vector2(tileSize / 4, tileSize / 4)
            )
          )
          .setSize(this.parentTile.size.divide(2))
          .setFillStyle(Color.STONE_BG),
      });
      this.mesh.push({
        type: "rect",
        mesh: new Rect()
          .setPosition(
            this.parentTile.position.add(
              new Vector2(tileSize / 6, tileSize / 6)
            )
          )
          .setSize(this.parentTile.size.divide(3))
          .setFillStyle(Color.STONE_FG),
      });
    }

    if (type === ResourceType.FOOD) {
      this.mesh.push({
        type: "circle",
        mesh: new Circle()
          .setPosition(
            this.parentTile.position.add(
              new Vector2(tileSize / 2, tileSize / 2)
            )
          )
          .setSize(tileSize / 4)
          .setFillStyle(Color.FOOD),
      });
    }

    if (type === ResourceType.WOOD) {
      const treeBaseX = tileSize / 8;
      const treeBaseY = tileSize / 2;

      this.mesh.push({
        type: "rect",
        mesh: new Rect()
          .setPosition(
            this.parentTile.position.add(
              new Vector2(tileSize / 2 - treeBaseX / 2, treeBaseY)
            )
          )
          .setSize(new Vector2(treeBaseX, treeBaseY))
          .setFillStyle(Color.TREE_BOTTOM),
      });
      this.mesh.push({
        type: "circle",
        mesh: new Circle()
          .setPosition(
            this.parentTile.position.add(
              new Vector2(tileSize / 2, tileSize / 2.5)
            )
          )
          .setSize(tileSize / 4)
          .setFillStyle(Color.TREE_TOP),
      });
    }
  }

  getMesh() {
    return this.mesh;
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

  getType() {
    return this.type;
  }
}

export default Resource;
