import { Canvas } from "./src/Canvas/Canvas";
import Lifesim from "./src/Lifesim";

const canvas = new Canvas(".canvas", "#app");
const canvasBg = new Canvas(".canvas-bg", "#app");
let game = new Lifesim(canvas, canvasBg);

document.querySelector("#restart")?.addEventListener("click", () => {
  game = new Lifesim(canvas, canvasBg);
  game.start();
});

game.start();
