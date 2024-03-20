import Circle from "../Geometry/Circle";
import Rect from "../Geometry/Rect";
import Human from "../Human/Human";
import ResourceController from "../Resources/ResourceController";
import Settings from "../Settings";
import Terrain from "../Terrain/Terrain";
import { Vector2 } from "../Vector/Vector2";
import { CtxOptions } from "./types";

export class Canvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private app: DOMRect;

  public width: number;
  public height: number;

  constructor(canvasSelector: string, appSelector: string) {
    this.canvas = document.querySelector(canvasSelector) as HTMLCanvasElement;

    if (!this.canvas) {
      throw new Error(
        `Could not find any canvas element by selector ${canvasSelector}.`
      );
    }

    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

    if (!this.ctx) {
      throw new Error("Could not create 2d context");
    }

    this.app = document
      .querySelector(appSelector)
      ?.getBoundingClientRect() as DOMRect;

    if (!this.app) {
      throw new Error(`Could not find ${appSelector} element in the DOM.`);
    }

    this.canvas.width = this.app.width as number;
    this.canvas.height = this.app.height as number;

    this.width = this.canvas.width;
    this.height = this.canvas.height;
  }

  repaint(humans: Human[], terrain: Terrain, resource: ResourceController) {
    this.drawTerrain(terrain);
    this.drawFood(resource);
    this.drawHumans(humans, terrain);
  }

  private drawRect(rect: Rect, options?: CtxOptions) {
    const { lineWidth = 0.5 } = options || {};
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

  private drawCircle(circle: Circle, options?: CtxOptions) {
    const { lineWidth = 0.5 } = options || {};

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

  private drawText(text: string, x: number, y: number, options?: CtxOptions) {
    const {
      textAlign = "left",
      font = "11px courier new",
      fillStyle = "rgb(0,0,0)",
    } = options || {};
    this.ctx.fillStyle = fillStyle;
    this.ctx.textAlign = textAlign;
    this.ctx.font = font;
    this.ctx.fillText(text, x, y);
  }

  private drawProgressBar(human: Human) {
    if (human.progressBar > 0) {
      const progressBarBG = new Rect()
        .setFillStyle(Settings.settings.colors.progressbarBG)
        .setSize(new Vector2(human.radius * 3, 3))
        .setPosition(
          new Vector2(
            human.position.x - human.radius * 1.5,
            human.position.y + human.radius * 2
          )
        );

      const progressBarFG = new Rect()
        .setFillStyle(Settings.settings.colors.progressbarFG)
        .setSize(new Vector2(((human.radius * 3) / 100) * human.progressBar, 3))
        .setPosition(
          new Vector2(
            human.position.x - human.radius * 1.5,
            human.position.y + human.radius * 2
          )
        );

      this.drawRect(progressBarBG);
      this.drawRect(progressBarFG);
    }
  }

  private drawHud(human: Human) {
    // Name and state
    this.drawText(
      `${human.age.toFixed(0)} ${human.name}`,
      human.position.x - human.radius,
      human.position.y - human.radius - 15,
      {
        fillStyle: "rgb(0, 0, 0)",
        font: "11px Courier New",
      }
    );

    this.drawText(
      human.state,
      human.position.x - human.radius,
      human.position.y - human.radius - 5,
      {
        fillStyle: "rgb(40, 40, 40)",
        font: "9px Courier New",
      }
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
          human.position.y - human.radius / 2 + 3
        )
      );

    const mating = new Rect()
      .setFillStyle("#f51b59")
      .setSize(new Vector2((human.matingUrge / 100) * 30, 3))
      .setPosition(
        new Vector2(
          human.position.x + human.radius + 5,
          human.position.y - human.radius / 2 + 6
        )
      );
    this.drawRect(wrapper);
    this.drawRect(hunger);
    this.drawRect(thirst);
    this.drawRect(mating);
  }

  private drawHumans(humans: Human[], terrain: Terrain) {
    const size = humans.length;

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
              { lineWidth: 1 }
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
          { lineWidth: 1 }
        );

        const neighbour = human.foundWaterObject!.getFirstWalkableNeighbour(
          terrain.terrain,
          terrain.WIDTH,
          terrain.HEIGHT
        );

        this.drawRect(
          new Rect()
            .setPosition(neighbour?.position!)
            .setSize(neighbour?.size!)
            .setFillStyle("rgba(0, 0, 0, 0)")
            .setStrokeStyle("rgba(0, 0, 0, 1)")
        );
      }

      if (Settings.settings.debug.resourceItem && humans[i].foundFoodObject) {
        this.drawRect(
          new Rect()
            .setPosition(human.foundFoodObject!.getParent().position)
            .setSize(human.foundFoodObject!.getParent().size)
            .setFillStyle("rgba(0, 0, 0, 0)")
            .setStrokeStyle("#baa820"),
          { lineWidth: 1 }
        );
      }

      if (Settings.settings.game.hud) {
        this.drawHud(human);
      }

      this.drawProgressBar(human);
      this.drawCircle(human, {
        lineWidth: 1,
      });
    }
  }

  private drawTerrain(terrainController: Terrain) {
    const size = terrainController.terrain.length;
    for (let i = 0; i < size; i++) {
      const rect = terrainController.getTileByIndex(i);

      if (!!rect) {
        this.drawRect(rect);
      }
    }
  }

  private drawFood(resourceController: ResourceController) {
    const food = resourceController.food;
    const size = resourceController.food.length;

    for (let i = 0; i < size; i++) {
      if (Settings.settings.debug.resourceAmount) {
        this.drawText(
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
}
