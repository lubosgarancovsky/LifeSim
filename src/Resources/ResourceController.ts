import { randChoice } from "../../utils/math";
import Settings from "../Settings";
import Terrain from "../Terrain/Terrain";
import TerraintType from "../Terrain/TerrainType";
import Tile from "../Terrain/Tile";
import Resource from "./Resource";
import ResourceType from "./ResourceType";

class ResourceController {
  terrainController: Terrain;
  resources: Resource[] = [];
  meshes: any[] = [];

  constructor(terrainController: Terrain) {
    this.terrainController = terrainController;
  }

  init() {
    const terrain = this.terrainController.terrain;
    // Put resources onto some of the tiles in the terrain tiles array
    for (let i = 0; i < terrain.length; i++) {
      if (terrain[i].type === TerraintType.GRASS) {
        const resourceType = randChoice([
          ResourceType.STONE,
          ResourceType.WOOD,
          ResourceType.FOOD,
        ]);
        const chanceToSpawn = Math.random();

        if (resourceType === ResourceType.STONE) {
          if (chanceToSpawn < Settings.STONE_DENSITY) {
            const newResource = new Resource(terrain[i], resourceType);
            this.resources.push(newResource);
            const resourceMeshes = newResource.getMesh().flat();
            this.meshes = this.meshes.concat(resourceMeshes);
          }
        }

        if (resourceType === ResourceType.FOOD) {
          if (chanceToSpawn < Settings.FOOD_DENSITY) {
            const newResource = new Resource(terrain[i], resourceType);
            this.resources.push(newResource);
            const resourceMeshes = newResource.getMesh().flat();
            this.meshes = this.meshes.concat(resourceMeshes);
          }
        }

        if (resourceType === ResourceType.WOOD) {
          if (chanceToSpawn < Settings.WOOD_DENSITY) {
            const newResource = new Resource(terrain[i], resourceType);
            this.resources.push(newResource);
            const resourceMeshes = newResource.getMesh().flat();
            this.meshes = this.meshes.concat(resourceMeshes);
          }
        }
      }
    }
  }

  addResource(type: ResourceType, parentTile: Tile) {
    const newResource = new Resource(parentTile, type);
    this.resources.push(newResource);
    this.reloadMeshes();
    return newResource;
  }

  removeResource(resource: Resource) {
    let index = this.resources.indexOf(resource);
    if (index >= 0) {
      this.resources.splice(index, 1);
      this.reloadMeshes();
      return resource;
    }
    return null;
  }

  reloadMeshes() {
    this.meshes = [];
    for (let i = 0; i < this.resources.length; i++) {
      this.meshes = this.meshes.concat(this.resources[i].getMesh().flat());
    }
  }
}

export default ResourceController;
