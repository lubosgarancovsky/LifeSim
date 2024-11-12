import Tile from "./TerrainTile";
import { Vector2 } from "../Vector/Vector2";
import perlinNoise3d from "perlin-noise-3d";
import TerraintType from "./TerrainType";
import Settings from "../Settings";

class Terrain {
  terrain: Tile[] = [];
  ground: Tile[] = [];
  WIDTH: number;
  HEIGHT: number;
  TILE_SIZE: number;

  constructor(width: number, height: number, tileSize: number) {
    this.WIDTH = width;
    this.HEIGHT = height;
    this.TILE_SIZE = tileSize;
  }

  init() {
    const perlin = new perlinNoise3d();

    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        let noise = perlin.get(x / 16, y / 16);

        const tile = new Tile(x, y, this.TILE_SIZE);
        tile.setSize(new Vector2(this.TILE_SIZE, this.TILE_SIZE));

        if (noise > Settings.settings.world.waterDensity) {
          tile.setTerrainType(TerraintType.GRASS);
          this.ground.push(tile);
        } else {
          tile.setTerrainType(TerraintType.WATER);
        }
        this.terrain.push(tile);
      }
    }

    // find neighbours for pathfinder
    for (let i = 0; i < this.terrain.length; i++) {
      this.terrain[i].updateNeighbours(this.terrain, this.WIDTH, this.HEIGHT);
    }
  }

  getIndexOfTile(tile: Tile) {
    return this.terrain.indexOf(tile);
  }

  getTileByIndex(index: number) {
    if (index > this.terrain.length) {
      return null;
    }

    return this.terrain[index];
  }

  getTileByGridCoordinates(x: number, y: number) {
    if (x > this.WIDTH || y > this.HEIGHT) {
      return null;
    }
    const index = y * this.WIDTH + x;
    return this.terrain[index];
  }

  getTileByPosition(posX: number, posY: number) {
    const xIndex = Math.floor(posX / this.TILE_SIZE);
    const yIndex = Math.floor(posY / this.TILE_SIZE);

    if (xIndex > this.WIDTH || yIndex > this.HEIGHT) {
      return null;
    }

    return this.getTileByGridCoordinates(xIndex, yIndex);
  }

  getSubGrid(positionX: number, positionY: number, viewrange: number) {
    const subgrid: Tile[] = [];

    const playerStandingOnTile = this.getTileByPosition(positionX, positionY);
    if (!playerStandingOnTile) {
      return subgrid;
    }

    // Calculate the bounding box of the view range
    const minCol = Math.max(
      0,
      Math.floor((positionX - viewrange) / this.TILE_SIZE)
    );
    const maxCol = Math.min(
      this.WIDTH - 1,
      Math.floor((positionX + viewrange) / this.TILE_SIZE)
    );
    const minRow = Math.max(
      0,
      Math.floor((positionY - viewrange) / this.TILE_SIZE)
    );
    const maxRow = Math.min(
      Math.floor(this.terrain.length / this.WIDTH) - 1,
      Math.floor((positionY + viewrange) / this.TILE_SIZE)
    );

    // Loop over the bounding box range in terms of rows and columns
    for (let row = minRow; row <= maxRow; row++) {
      for (let col = minCol; col <= maxCol; col++) {
        // Calculate the 1D index from the 2D coordinates
        const index = row * this.WIDTH + col;

        const rect = {
          x: col * this.TILE_SIZE,
          y: row * this.TILE_SIZE,
          width: this.TILE_SIZE,
          height: this.TILE_SIZE,
        };

        // Check if this tile is within the view range
        if (
          this.isCircleRectColliding(
            { x: positionX, y: positionY },
            viewrange,
            rect
          )
        ) {
          subgrid.push(this.terrain[index]);
        }
      }
    }

    // subgrid using rectangle viewrange
    // const subgrid: Tile[] = [];

    // const playerStandingOnTile = this.getTileByPosition(positionX, positionY);

    // if (!playerStandingOnTile) {
    //   return null;
    // }

    // const tileIndex = this.getIndexOfTile(playerStandingOnTile);

    // if (tileIndex < 0) {
    //   return null;
    // }

    // let startIndex = tileIndex - viewrange * this.WIDTH - viewrange;

    // for (let y = 0; y < viewrange * 2 + 1; y++) {
    //   for (let x = 0; x < viewrange * 2 + 1; x++) {
    //     const tempX = this.getTileByIndex(startIndex + x);

    //     // Check if tempX is within the boundaries of the grid
    //     if (
    //       tempX &&
    //       Math.abs(
    //         ((startIndex + x) % this.WIDTH) - (tileIndex % this.WIDTH)
    //       ) <= viewrange
    //     ) {
    //       subgrid.push(tempX);
    //     }
    //   }
    //   startIndex += this.WIDTH;
    // }

    return subgrid;
  }

  private isCircleRectColliding(circle, radius, rect) {
    const circleX = circle.x;
    const circleY = circle.y;

    const rectX = rect.x;
    const rectY = rect.y;
    const rectWidth = rect.width;
    const rectHeight = rect.height;

    const closestX = Math.max(rectX, Math.min(circleX, rectX + rectWidth));
    const closestY = Math.max(rectY, Math.min(circleY, rectY + rectHeight));

    const distanceX = circleX - closestX;
    const distanceY = circleY - closestY;
    const distanceSquared = distanceX * distanceX + distanceY * distanceY;

    return distanceSquared <= radius * radius;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const len = this.terrain.length;
    for (let i = 0; i < len; i++) {
      this.terrain[i].draw(ctx);
    }
  }
}

export default Terrain;
