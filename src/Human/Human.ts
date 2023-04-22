import { heuristic, randChoice } from "../../utils/math";
import { randomFemale, randomId, randomMale } from "../../utils/population";
import Circle from "../Geometry/Circle";
import ResourceController from "../Resources/ResourceController";
import Settings from "../Settings";
import Terrain from "../Terrain/Terrain";
import Tile from "../Terrain/Tile";
import Color from "../UI/Color";
import UI from "../UI/UI";
import { Vector2 } from "../Vector/Vector2";
import Gender from "./Gender";
import Inventory from "./Inventory/Inventory";
import Resource from "../Resources/Resource";
import { HumanDecisionTree } from "./DecisionTree/DecisionTree";
import ResourceType from "../Resources/ResourceType";

class Human extends Circle {
  name: string;
  id: string;
  gender: Gender;
  UIController: UI;
  terrainController: Terrain;
  resourceController: ResourceController;

  viewrange: number = 4;
  inViewSubgrid: Tile[] | null = null;
  path: Tile[] = [];
  destination: Vector2 | null;
  speed: number = 50;
  deltaTime: number;
  inventory: Inventory;
  progressBar: number = 0;

  // STATE
  state: string;
  decisionTree: HumanDecisionTree;

  // Needs
  hunger: number;
  foundResource: Resource | null = null;
  //visibleResoures: Resource[] = [];

  // Actions
  isEating: boolean = false;
  isDrinking: boolean = false;
  isMating: boolean = false;
  isCollecting: boolean = false;

  constructor(
    gender: Gender,
    UIController: UI,
    terrainController: Terrain,
    resourceController: ResourceController
  ) {
    super();

    this.decisionTree = new HumanDecisionTree();

    this.UIController = UIController;
    this.terrainController = terrainController;
    this.resourceController = resourceController;

    this.gender = gender;
    this.position = new Vector2(250, 250);
    this.radius = Settings.TILE_SIZE * 0.25;
    this.fillStyle = Color.HUMAN;
    this.inventory = new Inventory();

    this.id = randomId();

    if (gender === Gender.MALE) {
      this.strokeStyle = "#0062ff";
      this.name = randomMale();
    } else {
      this.strokeStyle = "#ff05e6";
      this.name = randomFemale();
    }

    this.hunger = 0;

    this.notifyUI(1);
    this.state = "Wandering";
  }

  update(deltaTime: number) {
    this.getSubgridInView();

    this.deltaTime = deltaTime;

    //this.move();

    this.decisionTree.evaluate(this);

    this.hunger += 0.05;

    //this.visibleResoures = this.getVisibleResources();

    //this.state.update();
    //this.drawpath();
  }

  move() {
    if (!!this.destination) {
      const distance = Math.hypot(
        this.position.x - this.destination.x,
        this.position.y - this.destination.y
      );

      const radians = Math.atan2(
        this.destination.y - this.position.y,
        this.destination.x - this.position.x
      );

      const dx = Math.cos(radians) * this.speed * this.deltaTime;
      const dy = Math.sin(radians) * this.speed * this.deltaTime;

      // keep returning until destination is reached
      if (distance > 1) {
        this.position.x += dx;
        this.position.y += dy;
        return;
      }

      // Human came to the end of a path iteration, if there is another tile in path, it finds a destination inside the tile
      if (this.path.length > 1) {
        this.path.splice(0, 1);
        this.destination = this.path[0].getRandomPositionInside();
        return;
      }

      // if there is no path, there is no destination
      this.destination = null;
      this.path = [];
    } else {
      // I dont have a destination, so i have to find something to do
      this.findRandomDestination();
    }
  }

  findRandomDestination() {
    if (this.inViewSubgrid) {
      const randomTile = randChoice(this.inViewSubgrid);
      this.findPath(randomTile);
    }
  }

  drawpath() {
    for (let i = 0; i < this.path.length; i++) {
      this.path[i].fillStyle = "rgba(255, 0, 0, 1)";
    }
  }

  findPath(endTile: Tile) {
    const start = this.terrainController.getTileByPosition(
      this.position.x,
      this.position.y
    );
    const end = endTile;

    let openSet: Tile[] = [];
    let closedSet: Tile[] = [];
    let path: Tile[] = [];

    if (!start || !end) {
      this.path = [];
      this.destination = null;
      return;
    }

    openSet.push(start);

    while (openSet.length > 0) {
      let lowestIndex = 0;

      for (let i = 0; i < openSet.length; i++) {
        if (openSet[i].f < openSet[lowestIndex].f) {
          lowestIndex = i;
        }
      }

      let current = openSet[lowestIndex];

      if (current === end) {
        let temp = current;
        path.push(temp);

        while (temp.parent) {
          let child = temp;
          temp = temp.parent;
          path.push(temp);
          child.parent = undefined;
        }

        let finalPath = path.reverse();

        this.path = finalPath;
        this.destination = finalPath[0].getRandomPositionInside();
        return;
      }

      openSet.splice(lowestIndex, 1);
      closedSet.push(current);

      let neighbours = current.neighbours;

      for (let i = 0; i < neighbours.length; i++) {
        let neighbour = neighbours[i];

        if (!closedSet.includes(neighbour)) {
          let possibleG = current.g + 1;

          if (!openSet.includes(neighbour)) {
            openSet.push(neighbour);
          } else if (possibleG >= neighbour.g) {
            continue;
          }

          neighbour.g = possibleG;
          neighbour.h = heuristic(neighbour, end);
          neighbour.f = neighbour.g + neighbour.h;
          neighbour.parent = current;
        }
      }
    }

    this.path = [];
    this.destination = null;
  }

  getSubgridInView() {
    this.inViewSubgrid = this.terrainController.getSubGrid(
      this.position.x,
      this.position.y,
      this.viewrange
    );
  }

  getVisibleResources() {
    if (!this.inViewSubgrid?.length) {
      return [];
    }

    const resourceArray: Resource[] = [];

    for (let i = 0; i < this.inViewSubgrid.length; i++) {
      if (!!this.inViewSubgrid[i].resource) {
        resourceArray.push(this.inViewSubgrid[i].resource!);
      }
    }

    return resourceArray;
  }

  highlightResource() {
    const visibleResources = this.getVisibleResources();
    for (let i = 0; i < visibleResources.length; i++) {
      const tile = this.terrainController.getTileByPosition(
        visibleResources[i].getPatentTile().position.x,
        visibleResources[i].getPatentTile().position.y
      );
      if (!!tile) {
        tile.fillStyle = "rgb(100,100, 240)";
      }
    }
  }

  notifyUI(val: number) {
    this.UIController.humanChange(this.gender, val);
  }

  setDestination(destination: Vector2) {
    this.destination = destination;
  }

  findFoodResource() {
    const visibleResources = this.getVisibleResources().filter(
      (resource) =>
        resource.getType() === ResourceType.FOOD && resource.getAmount() > 0
    );

    if (visibleResources.length) {
      let minDistance = Vector2.distance(
        visibleResources[0].getParent().position,
        this.position
      );
      let closestFood = visibleResources[0];

      for (let i = 0; i < visibleResources.length; i++) {
        const distance = Vector2.distance(
          visibleResources[i].getParent().position,
          this.position
        );

        if (distance < minDistance) {
          closestFood = visibleResources[i];
        }
      }

      this.foundResource = closestFood;
      this.findPath(closestFood.getParent());
      return closestFood;
    }

    return null;
  }

  handleEating() {
    const stopEating = () => {
      if (this.foundResource) {
        this.foundResource.isBeingGathered = false;
      }
      this.hunger = 0;
      this.isEating = false;
      this.state = "Wandering";
      this.foundResource = null;
      this.progressBar = 0;
    };

    const amountToEat = 50 * this.deltaTime;

    if (this.inventory.food > 0) {
      this.hunger -= amountToEat;
      this.inventory.removeFood(amountToEat);
      this.progressBar = 100 - this.hunger;
    }

    if (
      this.foundResource &&
      this.foundResource.getType() === ResourceType.FOOD
    ) {
      this.hunger -= this.foundResource.gather(amountToEat);
      this.progressBar = 100 - this.hunger;
      this.foundResource.isBeingGathered = true;

      if (this.foundResource.getAmount() <= 0) {
        stopEating();
      }
    } else {
      stopEating();
    }

    if (this.inventory.food < 0) {
      this.inventory.food = 0;
      stopEating();
    }

    if (this.progressBar >= 100) {
      stopEating();
    }
  }
}

export default Human;
