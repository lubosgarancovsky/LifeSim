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

  get context(): CanvasRenderingContext2D {
    return this.ctx;
  }
}
