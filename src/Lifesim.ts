import Rect from "./Geometry/Rect";
import Circle from "./Geometry/Circle";
import Terrain from "./Terrain/Terrain";
import Settings from "./Settings";
import ResourceController from "./Resources/ResourceController";
import PopulationController from "./Human/PopulationController";
import UI from "./UI/UI";
import Human from "./Human/Human";
import { Vector2 } from "./Vector/Vector2";

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

  constructor() {
    this.tileSize = Settings.settings.world.tileSize;
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
    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    // Update game state here...
    this.drawTerrain();
    this.drawFood();
    this.drawHumans();
    this.updateResources(deltaTime);

    this.populationController.update(deltaTime);

    requestAnimationFrame(this.update);
  }

  updateResources(deltaTime) {
    const resources = this.resourceController.food;
    const size = this.resourceController.food.length;

    for (let i = 0; i < size; i++) {
      resources[i].update(deltaTime);
    }
  }

  drawRect(rect: Rect, lineWidth = 0.5) {
    this.ctx.lineWidth = lineWidth;
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

  drawCircle(circle: Circle, lineWidth = 0.5) {
    this.ctx.beginPath();
    this.ctx.lineWidth = lineWidth;
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

  drawFood() {
    const food = this.resourceController.food;
    const size = this.resourceController.food.length;

    for (let i = 0; i < size; i++) {
      if (Settings.settings.debug.resourceAmount) {
        this.ctx.fillStyle = "rgb(0,0,0)";
        this.ctx.fillText(
          food[i].getAmount().toFixed(0).toString(),
          food[i].getParent().position.x,
          food[i].getParent().position.y
        );
      }
    }

    for (let i = 0; i < size; i++) {
      this.drawCircle(food[i]);
    }
  }

  drawHumans() {
    const size = this.populationController.population.length;
    const humans = this.populationController.population;

    for (let i = 0; i < size; i++) {
      const human = humans[i];
      // Debug mode drawing

      // ViewRange
      if (Settings.settings.debug.viewRange) {
        const subgrid = human.inViewSubgrid;

        if (!!subgrid) {
          const viewRangeSize =
            Settings.settings.world.tileSize * (human.genes.viewRange * 2 + 1);
          const viewRange = new Rect()
            .setPosition(subgrid[0].position)
            .setSize(new Vector2(viewRangeSize, viewRangeSize))
            .setFillStyle("rgba(0, 0, 0, 0)")
            .setStrokeStyle("rgb(255, 255, 255)");
          this.drawRect(viewRange);
        }
      }

      // Current path
      if (Settings.settings.debug.path) {
        const path = human.path;
        if (!!path) {
          for (let i = 0; i < path.length; i++) {
            this.drawRect(
              path[i]
                .copy()
                .setStrokeStyle("rgba(255, 50, 50)")
                .setFillStyle("rgba(255,50,50,0.2)")
            );
          }
        }
      }

      // Visible resources
      if (Settings.settings.debug.resources) {
        const resources = human.getVisibleResources();
        if (!!resources) {
          for (let i = 0; i < resources.length; i++) {
            this.drawRect(
              resources[i]
                .getParent()
                .copy()
                .setStrokeStyle("rgba(252, 111, 3, 1)")
                .setFillStyle("rgba(0, 0, 0, 0)"),
              1
            );
          }
        }
      }

      if (Settings.settings.debug.resourceItem && humans[i].foundWaterObject) {
        this.drawRect(
          new Rect()
            .setPosition(human.foundWaterObject!.position)
            .setSize(human.foundWaterObject!.size)
            .setFillStyle("rgba(0, 0, 0, 0)")
            .setStrokeStyle("rgba(79, 234, 255)"),
          1
        );

        const neighbour = human.foundWaterObject!.getFirstWalkableNeighbour(
          this.terrainController.terrain,
          this.terrainController.WIDTH,
          this.terrainController.HEIGHT
        );

        this.drawRect(
          new Rect()
            .setPosition(neighbour?.position!)
            .setSize(neighbour?.size!)
            .setFillStyle("rgba(0, 0, 0, 0)")
            .setStrokeStyle("rgba(0, 0, 0, 1)")
        );
      }

      if (Settings.settings.game.hud) {
        this.drawHud(human);
      }

      this.drawProgressBar(human);
      this.drawCircle(human, 1);
    }
  }

  drawProgressBar(human: Human) {
    if (human.progressBar > 0) {
      this.ctx.beginPath();
      this.ctx.fillStyle = Settings.settings.colors.progressbarBG;
      this.ctx.fillRect(
        human.position.x - human.radius * 1.5,
        human.position.y + human.radius * 2,
        human.radius * 3,
        3
      );

      this.ctx.beginPath();
      this.ctx.fillStyle = Settings.settings.colors.progressbarFG;
      this.ctx.fillRect(
        human.position.x - human.radius * 1.5,
        human.position.y + human.radius * 2,
        ((human.radius * 3) / 100) * human.progressBar,
        3
      );
    }
  }

  drawHud(human: Human) {
    // Name and state
    this.ctx.fillStyle = "rgb(0, 0, 0)";
    this.ctx.font = "11px Courier New";
    this.ctx.textAlign = "left";
    this.ctx.fillText(
      `${human.age.toFixed(0)} ${human.name}`,
      human.position.x - human.radius,
      human.position.y - human.radius - 15
    );
    this.ctx.font = "9px Courier New";
    this.ctx.fillStyle = "rgb(40, 40, 40)";
    this.ctx.fillText(
      human.state,
      human.position.x - human.radius,
      human.position.y - human.radius - 5
    );

    // Needs
    const wrapper = new Rect()
      .setFillStyle(Settings.settings.colors.hudWrapper)
      .setSize(new Vector2(30, 9))
      .setPosition(
        new Vector2(
          human.position.x + human.radius + 5,
          human.position.y - human.radius / 2
        )
      );
    const hunger = new Rect()
      .setFillStyle("#f08a65")
      .setSize(new Vector2((human.hunger / 100) * 30, 3))
      .setPosition(
        new Vector2(
          human.position.x + human.radius + 5,
          human.position.y - human.radius / 2
        )
      );

      const thirst = new Rect()
      .setFillStyle("#00b9fc")
      .setSize(new Vector2((human.thirst / 100) * 30, 3))
      .setPosition(
        new Vector2(
          human.position.x + human.radius + 5,
          (human.position.y - human.radius / 2) + 3
        )
      );

      const mating = new Rect()
      .setFillStyle("#f51b59")
      .setSize(new Vector2((human.matingUrge / 100) * 30, 3))
      .setPosition(
        new Vector2(
          human.position.x + human.radius + 5,
          (human.position.y - human.radius / 2) + 6
        )
      );
    this.drawRect(wrapper);
    this.drawRect(hunger);
    this.drawRect(thirst);
    this.drawRect(mating);
  }
}
export default Lifesim;
