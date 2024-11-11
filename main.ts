import { Canvas } from "./src/Canvas/Canvas";
import Lifesim from "./src/Lifesim";

const canvas = new Canvas(".canvas", "#app");
let game = new Lifesim(canvas);

document.querySelector("#restart")?.addEventListener("click", () => {
  game = new Lifesim(canvas);
  game.start();
});

game.start();
