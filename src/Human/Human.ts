import { heuristic, randChoice } from "../../utils/math";
import { randomFemale, randomId, randomMale } from "../../utils/population";
import Circle from "../Geometry/Circle";
import ResourceController from "../Resources/ResourceController";
import Settings from "../Settings";
import Terrain from "../Terrain/Terrain";
import Tile from "../Terrain/Tile";
import UI from "../UI/UI";
import { Vector2 } from "../Vector/Vector2";
import Gender from "./Gender";
import Inventory from "./Inventory/Inventory";
import Resource from "../Resources/Food";
import { HumanDecisionTree } from "./DecisionTree/DecisionTree";
import Food from "../Resources/Food";
import TerraintType from "../Terrain/TerrainType";
import PopulationController from "./PopulationController";
import { Genetics } from "./Genetics";

class Human extends Circle {
  name: string;
  id: string;
  gender: Gender;
  UIController: UI;
  terrainController: Terrain;
  resourceController: ResourceController;
  populationController: PopulationController;

  inViewSubgrid: Tile[] | null = null;
  path: Tile[] = [];
  destination: Vector2 | null;
  deltaTime: number;
  inventory: Inventory;
  progressBar: number = 0;

  // STATE
  state: string;
  decisionTree: HumanDecisionTree;

  // Needs
  hunger: number = 0;
  foundFoodObject: Food | null = null;

  thirst: number = 0;
  foundWaterObject: Tile | null = null;

  matingUrge: number = 0;
  foundMate: Human | null = null;

  // Actions
  isEating: boolean = false;
  isDrinking: boolean = false;
  isMating: boolean = false;
  isCollecting: boolean = false;

  isPregnant: boolean = false;
  awaitedChildren: Human[] = [];
  pregnancyMeter: number = 0;

  genes: Genetics;

  age: number = 0;
  lastAge: number = 0;
  isChild: boolean = true;

  constructor(
    gender: Gender,
    UIController: UI,
    terrainController: Terrain,
    resourceController: ResourceController,
    populationController: PopulationController
  ) {
    super();

    this.decisionTree = new HumanDecisionTree();

    this.UIController = UIController;
    this.terrainController = terrainController;
    this.resourceController = resourceController;
    this.populationController = populationController;

    this.gender = gender;
    this.position = new Vector2(250, 250);
    this.radius = Settings.settings.world.tileSize * 0.15;
    this.fillStyle = Settings.settings.colors.human;
    this.inventory = new Inventory();

    this.id = randomId();

    if (gender === Gender.MALE) {
      this.strokeStyle = Settings.settings.colors.maleStroke;
      this.name = randomMale();
    } else {
      this.strokeStyle = Settings.settings.colors.femaleStroke;
      this.name = randomFemale();
    }

    this.state = "Wandering";
  }

  update(deltaTime: number) {
    this.getSubgridInView();

    this.deltaTime = deltaTime;

    this.decisionTree.evaluate(this);

    this.handleNeedsIncrement(deltaTime);

    this.handleAging(deltaTime);

    if (this.isPregnant) {
      this.handlePregnancy(deltaTime);
    }
  }

  setGenes(gen: Genetics) {
    this.genes = gen;
  }

  handleNeedsIncrement(deltaTime) {
    this.hunger += this.genes.hungerModificator * deltaTime;
    this.thirst += this.genes.thirstModificator * deltaTime;

    if (!this.isChild) {
      if (this.age <= 34) {
        this.matingUrge += this.genes.matingModificator * deltaTime * 1.5;
      } else {
        this.matingUrge +=
          this.genes.matingModificator * (1 - this.age / 200) * deltaTime;
      }
    }

    if (this.hunger < 0) {
      this.hunger = 0;
    }

    if (this.thirst < 0) {
      this.thirst = 0;
    }

    if (this.matingUrge < 0) {
      this.matingUrge = 0;
    }

    if (this.hunger > 100) {
      this.hunger = 100;
      this.populationController.removeHuman(this);
      this.notifyUI(-1);
    }

    if (this.thirst > 100) {
      this.thirst = 100;
      this.populationController.removeHuman(this);
      this.notifyUI(-1);
    }

    if (this.matingUrge > 100) {
      this.matingUrge = 100;
    }
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

      const dx = Math.cos(radians) * this.genes.speed * this.deltaTime;
      const dy = Math.sin(radians) * this.genes.speed * this.deltaTime;

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
      this.genes.viewRange
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
      (resource) => resource.getAmount() > 0
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

      this.foundFoodObject = closestFood;
      this.findPath(closestFood.getParent());
      return closestFood;
    }

    return null;
  }

  handleEating() {
    const stopEating = () => {
      if (this.foundFoodObject) {
        this.foundFoodObject.isBeingGathered = false;
      }

      this.isEating = false;
      this.state = "Wandering";
      this.foundFoodObject = null;
      this.progressBar = 0;
    };

    const amountToEat = 50 * this.deltaTime;

    if (this.inventory.food > 0) {
      this.hunger -= amountToEat;
      this.inventory.removeFood(amountToEat);
      this.progressBar = 100 - this.hunger;
    }

    if (this.foundFoodObject) {
      this.hunger -= this.foundFoodObject.gather(amountToEat);
      this.progressBar = 100 - this.hunger;
      this.foundFoodObject.isBeingGathered = true;

      if (this.foundFoodObject.getAmount() <= 0) {
        stopEating();
      }
    }

    if (this.inventory.food < 0) {
      this.inventory.food = 0;
      stopEating();
    }

    if (this.progressBar >= 100) {
      stopEating();
    }
  }

  findWaterResource() {
    if (!!this.inViewSubgrid?.length) {
      const grid = this.inViewSubgrid;
      const water: Tile[] = [];

      for (let i = 0; i < grid.length; i++) {
        if (grid[i].type === TerraintType.WATER) {
          water.push(grid[i]);
        }
      }

      if (!!water.length) {
        let minDistance = Vector2.distance(this.position, water[0].getCenter());
        let closestWater = water[0];

        for (let i = 0; i < water.length; i++) {
          const distance = Vector2.distance(
            this.position,
            water[i].getCenter()
          );

          if (distance < minDistance) {
            minDistance = distance;
            closestWater = water[i];
          }
        }

        // finds path to the closest grass tile

        const firstWalkableNeighbour = closestWater.getFirstWalkableNeighbour(
          this.terrainController.terrain,
          this.terrainController.WIDTH,
          this.terrainController.HEIGHT
        );

        if (!!firstWalkableNeighbour) {
          this.foundWaterObject = closestWater;
          this.findPath(firstWalkableNeighbour);
          return closestWater;
        }

        return null;
      }

      return null;
    }

    return null;
  }

  handleDrinking() {
    const stopDrinking = () => {
      this.isDrinking = false;
      this.state = "Wandering";
      this.foundWaterObject = null;
      this.progressBar = 0;
    };

    const amountToDrink = 50 * this.deltaTime;

    if (this.inventory.water > 0) {
      this.thirst -= amountToDrink;
      this.inventory.removeWater(amountToDrink);
      this.progressBar = 100 - this.thirst;
    }

    if (this.foundWaterObject) {
      this.thirst -= amountToDrink;
      this.progressBar = 100 - this.thirst;
    }

    if (this.inventory.water < 0) {
      this.inventory.water = 0;
      stopDrinking();
    }

    if (this.progressBar >= 100) {
      stopDrinking();
    }
  }

  collectFood() {
    const stopCollecting = () => {
      this.isCollecting = false;
      this.state = "Wandering";
      this.foundFoodObject = null;
      this.progressBar = 0;
      this.move();
    };

    const amountToCollect = 20 * this.deltaTime;

    if (this.foundFoodObject) {
      this.inventory.addFood(this.foundFoodObject.gather(amountToCollect));
      this.progressBar =
        (this.inventory.food / Settings.settings.game.foodInventoryLimit) * 100;
    } else {
      stopCollecting();
    }

    if (
      this.progressBar >= 100 ||
      this.inventory.food >= Settings.settings.game.foodInventoryLimit ||
      !this.foundFoodObject ||
      this.foundFoodObject.getAmount() === 0
    ) {
      stopCollecting();
    }
  }

  collectWater() {
    const stopCollecting = () => {
      this.isCollecting = false;
      this.state = "Wandering";
      this.foundWaterObject = null;
      this.progressBar = 0;
      this.move();
    };

    const amountToCollect = 20 * this.deltaTime;

    if (this.foundWaterObject) {
      this.inventory.addWater(amountToCollect);
      this.progressBar =
        (this.inventory.water / Settings.settings.game.waterInventoryLimit) *
        100;
    } else {
      stopCollecting();
    }

    if (
      this.progressBar >= 100 ||
      this.inventory.water >= Settings.settings.game.waterInventoryLimit ||
      !this.foundWaterObject
    ) {
      stopCollecting();
    }
  }

  findMate() {
    if (!!this.inViewSubgrid && !this.foundMate) {
      const population = this.populationController.population;
      const size = population.length;

      for (let i = 0; i < size; i++) {
        const potentialMate = population[i];
        if (
          potentialMate.matingUrge > 90 &&
          potentialMate.gender != this.gender &&
          potentialMate.foundMate === null &&
          potentialMate != this
        ) {
          if (this.humanCollidesWithViewrange(potentialMate)) {
            const randomPoint = randChoice(this.inViewSubgrid);

            this.findPath(randomPoint);
            potentialMate.findPath(randomPoint);

            if (this.path.length && potentialMate.path.length) {
              this.foundMate = potentialMate;
              potentialMate.foundMate = this;

              this.move();
              potentialMate.move();

              return potentialMate;
            }
          }
        }
      }
    }

    this.move();
    return null;
  }

  stopMating() {
    if (this.foundMate) {
      if (this.gender === Gender.FEMALE) {
        this.getPregnant(this.foundMate);
      }
    }
    this.isMating = false;
    this.state = "Wandering";
    this.foundMate = null;
    this.progressBar = 0;
    this.matingUrge = 0;
    this.move();
  }

  handleMating() {
    if (!!this.foundMate) {
      if (this.foundMate.isMating && this.isMating) {
        this.progressBar += 30 * this.deltaTime;
        this.foundMate.progressBar += 30 * this.foundMate.deltaTime;
      }

      if (this.foundMate.progressBar >= 100 && this.progressBar >= 100) {
        this.foundMate.stopMating();
        this.stopMating();
        return;
      }

      if (this.foundMate.foundMate !== this) {
        this.stopMating();
        return;
      }

      return;
    }

    this.stopMating();
  }

  humanCollidesWithViewrange(human: Human) {
    if (!!this.inViewSubgrid) {
      const viewRangeStartPosition = this.inViewSubgrid[0].position;
      const viewRangeSize =
        (this.genes.viewRange * 2 + 1) * Settings.settings.world.tileSize;

      // Calculate the center of the square
      const squareCenter = {
        x: viewRangeStartPosition.x + viewRangeSize / 2,
        y: viewRangeStartPosition.y + viewRangeSize / 2,
      };

      // Calculate the distance between the center of the circle and the center of the square
      const distanceX = Math.abs(human.position.x - squareCenter.x);
      const distanceY = Math.abs(human.position.y - squareCenter.y);

      // If the distance is greater than half the diagonal of the square plus the radius of the circle, there is no collision
      const diagonal = Math.sqrt(viewRangeSize ** 2 + viewRangeSize ** 2);
      if (
        distanceX > diagonal / 2 + human.radius ||
        distanceY > diagonal / 2 + human.radius
      ) {
        return false;
      }

      // If the distance is less than half the diagonal of the square, there is definitely a collision
      if (distanceX <= viewRangeSize / 2 || distanceY <= viewRangeSize / 2) {
        return true;
      }

      // If the distance is between these two values, there is a collision if the distance from the center of the circle to
      // the closest point on the square is less than or equal to the radius of the circle
      const cornerDistanceSquared =
        (distanceX - viewRangeSize / 2) ** 2 +
        (distanceY - viewRangeSize / 2) ** 2;
      return cornerDistanceSquared <= human.radius ** 2;
    }
    return false;
  }

  getPregnant(father: Human) {
    const motherFertility = this.genes.fertility - (this.age ^ 2) / 250;
    const fatherFertility = father.genes.fertility - (father.age ^ 2) / 600;

    const minFertility =
      fatherFertility < motherFertility ? fatherFertility : motherFertility;

    const combinedFertility = fatherFertility + motherFertility;

    if (
      minFertility > 0 &&
      combinedFertility >= 10 - Settings.settings.game.pregnancyChance &&
      !this.isPregnant
    ) {
      this.isPregnant = true;
      this.fillStyle = Settings.settings.colors.pregnantHuman;

      const chance = Math.random();
      let numberOfChildren = 1;

      if (chance > 0.75) {
        numberOfChildren = 2;
      }

      if (chance > 0.9) {
        numberOfChildren = 3;
      }

      const children: Human[] = [];

      for (let i = 0; i < numberOfChildren; i++) {
        const child = new Human(
          randChoice([Gender.MALE, Gender.FEMALE]),
          this.UIController,
          this.terrainController,
          this.resourceController,
          this.populationController
        );

        child.setGenes(Genetics.getGenesFromParents(father, this));
        children.push(child);
      }

      this.awaitedChildren = children;
    }
  }

  handlePregnancy(deltaTime: number) {
    this.pregnancyMeter +=
      Settings.settings.game.pregnancyMeterSpeed * deltaTime;

    if (this.pregnancyMeter >= 100) {
      this.pregnancyMeter = 0;
      this.isPregnant = false;
      this.fillStyle = Settings.settings.colors.human;

      for (let i = 0; i < this.awaitedChildren.length; i++) {
        const child = this.awaitedChildren[i];
        child.setPosition(Vector2.copy(this.position));
        this.populationController.population.push(child);
        child.notifyUI(1);
      }
    }
  }

  handleAging(deltaTime: number) {
    this.age += Settings.settings.game.agingSpeed * deltaTime;

    if (this.age < 0) {
      this.age = 0;
    }

    if (Math.floor(this.age) > this.lastAge) {
      this.lastAge = this.age;

      const chanceToDie = Math.random() * 10;

      if (chanceToDie < (this.age ^ 2) / 3000) {
        this.populationController.removeHuman(this);
      }
    }

    if (this.age >= 120) {
      this.populationController.removeHuman(this);
    }

    if (this.age >= Settings.settings.game.adultAge && this.isChild) {
      this.isChild = false;
      this.radius = Settings.settings.world.tileSize * 0.25;
    }
  }
}

export default Human;
