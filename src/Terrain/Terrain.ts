import Tile from "./Tile";
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
      return null;
    }

    const tileIndex = this.getIndexOfTile(playerStandingOnTile);

    if (tileIndex < 0) {
      return null;
    }

    let startIndex = tileIndex - viewrange * this.WIDTH - viewrange;

    for (let y = 0; y < viewrange * 2 + 1; y++) {
      for (let x = 0; x < viewrange * 2 + 1; x++) {
        const tempX = this.getTileByIndex(startIndex + x);

        // Check if tempX is within the boundaries of the grid
        if (
          tempX &&
          Math.abs(
            ((startIndex + x) % this.WIDTH) - (tileIndex % this.WIDTH)
          ) <= viewrange
        ) {
          subgrid.push(tempX);
        }
      }
      startIndex += this.WIDTH;
    }

    return subgrid;
  }
}

export default Terrain;
