import Settings from "../Settings";
import Terrain from "../Terrain/Terrain";
import TerraintType from "../Terrain/TerrainType";
import Tile from "../Terrain/Tile";
import Food from "./Food";

class ResourceController {
  terrainController: Terrain;
  food: Food[] = [];

  constructor(terrainController: Terrain) {
    this.terrainController = terrainController;
  }

  init() {
    const terrain = this.terrainController.terrain;

    // Put resources onto some of the tiles in the terrain tiles array
    for (let i = 0; i < terrain.length; i++) {
      if (terrain[i].type === TerraintType.GRASS) {
        const chanceToSpawn = Math.random();
        if (chanceToSpawn < Settings.settings.world.foodDensity) {
          const newFood = new Food(terrain[i]);
          this.food.push(newFood);
        }
      }
    }
  }

  addResource(parentTile: Tile) {
    const newResource = new Food(parentTile);
    this.food.push(newResource);
    return newResource;
  }

  removeResource(food: Food) {
    let index = this.food.indexOf(food);
    if (index >= 0) {
      this.food.splice(index, 1);
      return food;
    }
    return null;
  }
}

export default ResourceController;
