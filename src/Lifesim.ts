import Terrain from "./Terrain/Terrain";
import Settings from "./Settings";
import ResourceController from "./Resources/ResourceController";
import PopulationController from "./Human/PopulationController";
import UI from "./UI/UI";
import { Time } from "./Time";
import { Canvas } from "./Canvas/Canvas";

class Lifesim {
  private isRunning: boolean;
  private lastTime: number;
  private tileSize: number;

  // Game objects
  private terrainController: Terrain;
  private resourceController: ResourceController;
  private populationController: PopulationController;
  private UIController: UI;

  private canvas: Canvas;

  constructor(canvas: Canvas) {
    this.canvas = canvas;
    this.tileSize = 0;
    this.isRunning = false;
    this.lastTime = 0;
    this.update = this.update.bind(this);
  }

  init() {
    // init terrain
    this.tileSize = Settings.settings.world.tileSize;
    const width = Math.ceil(this.canvas.width / this.tileSize);
    const height = Math.ceil(this.canvas.height / this.tileSize);

    this.UIController = new UI();

    this.terrainController = new Terrain(width, height, this.tileSize);
    this.terrainController.init();

    this.resourceController = new ResourceController(this.terrainController);
    this.resourceController.init();

    this.populationController = new PopulationController(
      this.terrainController,
      this.resourceController,
      this.UIController
    );
    this.populationController.init(
      Settings.settings.game.males,
      Settings.settings.game.females
    );
  }

  run() {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    this.lastTime = Date.now();

    requestAnimationFrame(this.update);
  }

  update(currentTime: number) {
    Time.deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    this.canvas.repaint(
      this.populationController.population,
      this.terrainController,
      this.resourceController
    );

    this.updateResources();

    this.populationController.update();

    requestAnimationFrame(this.update);
  }

  updateResources() {
    const resources = this.resourceController.food;
    const size = this.resourceController.food.length;

    for (let i = 0; i < size; i++) {
      resources[i].update(Time.deltaTime);
    }
  }
}

export default Lifesim;
