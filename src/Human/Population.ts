import { randChoice } from "../../utils/math";
import { Resources } from "../Resources/Resources";

import Terrain from "../Terrain/Terrain";
import { Time } from "../Time";
import UI from "../UI/UI";
import { Vector2 } from "../Vector/Vector2";
import Gender from "./Gender";
import { Genetics } from "./Genetics";
import Human from "./Human";

export class Population {
  population: Human[];
  terrainController: Terrain;
  Resources: Resources;
  UIController: UI;

  constructor(
    terrainController: Terrain,
    Resources: Resources,
    UIController: UI
  ) {
    this.population = [];
    this.terrainController = terrainController;
    this.Resources = Resources;
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
      this.Resources,
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
      this.Resources,
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

  draw(ctx: CanvasRenderingContext2D) {
    const len = this.population.length;
    for (let i = 0; i < len; i++) {
      this.population[i].draw(ctx);
    }
  }
}
