import { randChoice } from "../../utils/math";
import ResourceController from "../Resources/ResourceController";
import Terrain from "../Terrain/Terrain";
import UI from "../UI/UI";
import { Vector2 } from "../Vector/Vector2";
import Gender from "./Gender";
import { Genetics } from "./Genetics";
import Human from "./Human";

class PopulationController {
  population: Human[];
  terrainController: Terrain;
  resourceController: ResourceController;
  UIController: UI;

  constructor(
    terrainController: Terrain,
    resourceController: ResourceController,
    UIController: UI
  ) {
    this.population = [];
    this.terrainController = terrainController;
    this.resourceController = resourceController;
    this.UIController = UIController;
  }

  init(males: number = 2, females: number = 2) {
    for (let i = 0; i < males; i++) {
      const man = new Human(
        Gender.MALE,
        this.UIController,
        this.terrainController,
        this.resourceController,
        this
      ).setPosition(
        Vector2.copy(randChoice(this.terrainController.ground).position)
      );

      man.setGenes(Genetics.randomGenes());
      man.notifyUI(1);
      this.population.push(man);
    }

    for (let i = 0; i < females; i++) {
      const woman = new Human(
        Gender.FEMALE,
        this.UIController,
        this.terrainController,
        this.resourceController,
        this
      ).setPosition(
        Vector2.copy(randChoice(this.terrainController.ground).position)
      );

      woman.setGenes(Genetics.randomGenes());
      woman.notifyUI(1);
      this.population.push(woman);
    }
  }

  update(deltaTime: number) {
    const populationSize = this.population.length;

    if (populationSize > 0) {
      for (let i = 0; i < populationSize; i++) {
        if (this.population[i]) {
          this.population[i].update(deltaTime);
        }
      }

      this.updateUI();
    }
  }

  removeHuman(human: Human) {
    this.population = this.population.filter((i) => i != human);
  }

  updateUI() {
    this.UIController.drawPopulationList(this.population);
  }
}

export default PopulationController;
