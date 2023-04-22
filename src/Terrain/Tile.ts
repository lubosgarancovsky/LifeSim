import { randRange } from "../../utils/math";
import Rect from "../Geometry/Rect";
import Resource from "../Resources/Resource";
import Color from "../UI/Color";
import { Vector2 } from "../Vector/Vector2";
import TerraintType from "./TerrainType";

class Tile extends Rect {
  type: TerraintType;
  neighbours: Tile[] = [];
  coordinates: Vector2;
  f: number = 0;
  h: number = 0;
  g: number = 0;
  parent: Tile | undefined = undefined;
  resource: Resource | null = null;

  constructor(x_coord: number, y_coord: number, size: number) {
    super();
    this.coordinates = new Vector2(x_coord, y_coord);
    this.position = new Vector2(x_coord * size, y_coord * size);
    this.size = new Vector2(size, size);
  }

  setTerrainType(type: TerraintType): Tile {
    this.type = type;
    this.fillStyle = type === TerraintType.GRASS ? Color.GRASS : Color.WATER;
    this.strokeStyle =
      type === TerraintType.GRASS
        ? "rgba(45, 176, 16, 0.5)"
        : "rgba(7, 61, 240, 0.4)";
    return this;
  }

  getRandomPositionInside() {
    let x = randRange(this.position.x, this.position.x + this.size.x);
    let y = randRange(this.position.y, this.position.y + this.size.y);
    return new Vector2(x, y);
  }

  getCenter() {
    let centerX = Math.ceil(this.position.x + (this.size.x / 2));
    let centerY = Math.ceil(this.position.x + (this.size.x / 2));

    return new Vector2(centerX, centerY);
  }

  addResource(resource: Resource) {
    this.resource = resource;
  }

  updateNeighbours(grid: Tile[], rows: number, cols: number) {
    let index = this.coordinates.y * rows + this.coordinates.x;

    // Bottom check
    if (this.coordinates.y < cols - 1) {
      if (grid[index + rows].type != TerraintType.WATER) {
        this.neighbours.push(grid[index + rows]);
      }
    }

    // top check
    if (this.coordinates.y > 0) {
      if (grid[index - rows].type != TerraintType.WATER) {
        this.neighbours.push(grid[index - rows]);
      }
    }

    // right check
    if (this.coordinates.x < rows - 1) {
      if (grid[index + 1].type != TerraintType.WATER) {
        this.neighbours.push(grid[index + 1]);
      }
    }

    //left check
    if (this.coordinates.x > 0) {
      if (grid[index - 1].type != TerraintType.WATER) {
        this.neighbours.push(grid[index - 1]);
      }
    }

    // Diagonals (OPTIONAL)

    if (this.coordinates.y < cols - 1 && this.coordinates.x < rows - 1) {
      if (grid[index + rows + 1].type != TerraintType.WATER) {
        this.neighbours.push(grid[index + rows + 1]);
      }
    }

    if (this.coordinates.y < cols - 1 && this.coordinates.x > 0) {
      if (grid[index + rows - 1].type != TerraintType.WATER) {
        this.neighbours.push(grid[index + rows - 1]);
      }
    }

    if (this.coordinates.y > 0 && this.coordinates.x > 0) {
      if (grid[index - rows - 1].type != TerraintType.WATER) {
        this.neighbours.push(grid[index - rows - 1]);
      }
    }

    if (this.coordinates.y > 0 && this.coordinates.x < rows - 1) {
      if (grid[index - rows + 1].type != TerraintType.WATER) {
        this.neighbours.push(grid[index - rows + 1]);
      }
    }
  }
}

export default Tile;
