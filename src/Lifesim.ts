import Rect from "./Geometry/Rect";
import Circle from "./Geometry/Circle";
import Terrain from "./Terrain/Terrain";
import Settings from "./Settings";
import ResourceController from "./Resources/ResourceController";
import PopulationController from "./Human/PopulationController";
import UI from "./UI/UI";
import TerraintType from "./Terrain/TerrainType";
import Color from "./UI/Color";
import Human from "./Human/Human";

class Lifesim {
  private isRunning: boolean;
  private lastTime: number;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private app: DOMRect;
  private tileSize: number;

  // Game objects
  private terrainController: Terrain;
  private resourceController: ResourceController;
  private populationController: PopulationController;
  private UIController: UI;

  // settings
  private debug = {
    viewRange: false,
    path: false,
    resources: false,
  };

  constructor() {
    this.tileSize = Settings.TILE_SIZE;
    this.isRunning = false;
    this.lastTime = 0;
    this.update = this.update.bind(this);
    this.canvas = document.querySelector(".canvas") as HTMLCanvasElement;
    this.ctx = this.canvas?.getContext("2d") as CanvasRenderingContext2D;
    this.app = document
      .querySelector("#app")
      ?.getBoundingClientRect() as DOMRect;
  }

  init() {
    // init canvas size
    if (!!this.canvas) {
      this.canvas.width = this.app.width as number;
      this.canvas.height = this.app.height as number;
    }

    // init terrain
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
    this.populationController.init(1, 1);
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
    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    // Update game state here...
    this.drawTerrain();
    this.drawResources();
    this.drawHumans();
    this.updateResources();

    this.populationController.update(deltaTime);

    requestAnimationFrame(this.update);
  }

  updateResources() {
    const resources = this.resourceController.resources;
    const size = this.resourceController.resources.length;

    for (let i = 0; i < size; i++) {
      resources[i].update();
    }
  }

  drawRect(rect: Rect) {
    this.ctx.lineWidth = 0.5;
    this.ctx.fillStyle = rect.fillStyle;
    this.ctx.fillRect(
      rect.position.x,
      rect.position.y,
      rect.size.x,
      rect.size.y
    );

    if (!!rect.strokeStyle) {
      this.ctx.strokeStyle = rect.strokeStyle;
      this.ctx.strokeRect(
        rect.position.x,
        rect.position.y,
        rect.size.x,
        rect.size.y
      );
    }
  }

  drawCircle(circle: Circle) {
    this.ctx.beginPath();
    this.ctx.lineWidth = 0.5;
    this.ctx.fillStyle = circle.fillStyle;
    this.ctx.arc(
      circle.position.x,
      circle.position.y,
      circle.radius,
      0,
      2 * Math.PI
    );
    this.ctx.fill();

    if (!!circle.strokeStyle) {
      this.ctx.strokeStyle = circle.strokeStyle;
      this.ctx.arc(
        circle.position.x,
        circle.position.y,
        circle.radius,
        0,
        2 * Math.PI
      );
      this.ctx.stroke();
    }
    this.ctx.closePath();
  }

  drawTerrain() {
    const size = this.terrainController.terrain.length;
    for (let i = 0; i < size; i++) {
      const rect = this.terrainController.getTileByIndex(i);

      if (!!rect) {
        this.drawRect(rect);
      }
    }
  }

  drawResources() {
    const meshes = this.resourceController.meshes;
    const size = this.resourceController.meshes.length;
    const resources = this.resourceController.resources;

    for (let i = 0; i < resources.length; i++) {
      if (resources[i].isBeingGathered) {
        this.ctx.fillStyle = "rgb(0,0,0)";
        this.ctx.fillText(
          resources[i].getAmount().toFixed(0).toString(),
          resources[i].getParent().position.x,
          resources[i].getParent().position.y
        );
      }
    }

    for (let i = 0; i < size; i++) {
      const mesh = meshes[i];
      if (mesh.type === "rect") {
        this.drawRect(mesh.mesh);
      }

      if (mesh.type === "circle") {
        this.drawCircle(mesh.mesh);
      }
    }
  }

  drawHumans() {
    const size = this.populationController.population.length;
    const humans = this.populationController.population;

    for (let i = 0; i < size; i++) {
      // Debug mode drawing

      // ViewRange
      if (this.debug.viewRange) {
        const subgrid = humans[i].inViewSubgrid;

        if (!!subgrid) {
          for (let i = 0; i < subgrid.length; i++) {
            this.drawRect(
              subgrid[i].copy().setFillStyle("rgba(255,255,255, 0.5)")
            );
          }
        }
      }

      // Current path
      if (this.debug.path) {
        const path = humans[i].path;
        if (!!path) {
          for (let i = 0; i < path.length; i++) {
            this.drawRect(path[i].copy().setFillStyle("rgba(255, 50, 50)"));
          }
        }
      }

      // Visible resources
      if (this.debug.resources) {
        const resources = humans[i].getVisibleResources();
        if (!!resources) {
          for (let i = 0; i < resources.length; i++) {
            this.drawRect(
              resources[i]
                .getParent()
                .copy()
                .setFillStyle("rgba(0, 50, 255, 0.5)")
            );
          }
        }
      }

      this.drawProgressBar(humans[i]);
      this.drawCircle(humans[i]);
    }
  }

  drawProgressBar(human: Human) {
    if (human.progressBar > 0) {
      this.ctx.beginPath();
      this.ctx.fillStyle = "rgb(0, 0, 0, 0.4)";
      this.ctx.fillRect(
        human.position.x - human.radius * 1.5,
        human.position.y - human.radius * 2,
        human.radius * 3,
        3
      );

      this.ctx.beginPath();
      this.ctx.fillStyle = "rgb(0, 0, 0)";
      this.ctx.fillRect(
        human.position.x - human.radius * 1.5,
        human.position.y - human.radius * 2,
        ((human.radius * 3) / 100) * human.progressBar,
        3
      );
    }
  }
}
export default Lifesim;
