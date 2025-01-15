import Terrain from "./Terrain/Terrain";
import Settings from "./Settings";
import { Resources } from "./Resources/Resources";
import { Population } from "./Human/Population";
import UI from "./UI/UI";
import { Time } from "./Time";
import { Canvas } from "./Canvas/Canvas";

class Lifesim {
  private isRunning: boolean;
  private terrain: Terrain;
  private resources: Resources;
  private population: Population;
  private ui: UI;

  private canvas: Canvas;
  private canvasBg: Canvas;

  constructor(canvas: Canvas, canvasBg: Canvas) {
    this.canvas = canvas;
    this.canvasBg = canvasBg;
    this.isRunning = false;
    this.loop = this.loop.bind(this);

    this.ui = new UI();

    const tileSize = Settings.settings.world.tileSize;
    const width = Math.ceil(this.canvas.width / tileSize);
    const height = Math.ceil(this.canvas.height / tileSize);

    this.terrain = new Terrain(width, height, tileSize);
    this.terrain.init();

    this.resources = new Resources(this.terrain);
    this.resources.init();

    this.population = new Population(this.terrain, this.resources, this.ui);
    this.population.init(
      Settings.settings.game.males,
      Settings.settings.game.females
    );

    document.addEventListener("focus", () => {
      if (!this.isRunning) {
        this.start();
      }
    });

    document.addEventListener("blur", () => {
      if (this.isRunning) {
        this.stop();
      }
    });

    this.terrain.draw(this.canvasBg.context);
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      Time.lastTime = performance.now();
      requestAnimationFrame(this.loop);
    }
  }

  stop() {
    this.isRunning = false;
  }

  private loop(currentTime: number) {
    if (!this.isRunning) return;

    const elapsedTime = currentTime - Time.lastTime;
    Time.lastTime = currentTime;

    Time.deltaTime = Math.min(elapsedTime, 100) / 1000;

    this.update();
    this.render();
    requestAnimationFrame(this.loop);
  }

  private update() {
    this.updateResources();
    this.population.update();
  }

  private render() {
    this.canvas.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.resources.draw(this.canvas.context);
    this.population.draw(this.canvas.context);
  }

  private updateResources() {
    const resources = this.resources.food;
    const size = this.resources.food.length;

    for (let i = 0; i < size; i++) {
      resources[i].update();
    }
  }
}

export default Lifesim;
