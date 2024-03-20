import { randChoice } from "../../utils/math";
import ResourceController from "../Resources/ResourceController";
import Terrain from "../Terrain/Terrain";
import { Time } from "../Time";
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

    document.querySelector("#random-male")?.addEventListener("click", () => {
      this.addRandomMale();
    });

    document.querySelector("#random-female")?.addEventListener("click", () => {
      this.addRandomFemale();
    });

    document.querySelector("#clear-all")?.addEventListener("click", () => {
      this.population = [];
      this.UIController.resetPopulation();
    });
  }

  init(males: number = 2, females: number = 2) {
    for (let i = 0; i < males; i++) {
      this.addRandomMale();
    }

    for (let i = 0; i < females; i++) {
      this.addRandomFemale();
    }
  }

  addRandomMale() {
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

    return man;
  }

  addRandomFemale() {
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

  update() {
    const populationSize = this.population.length;

    if (populationSize > 0) {
      for (let i = 0; i < populationSize; i++) {
        if (this.population[i]) {
          this.population[i].update(Time.deltaTime);
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
