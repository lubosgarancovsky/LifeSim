import { Canvas } from "./src/Canvas/Canvas";
import Lifesim from "./src/Lifesim";

const canvas = new Canvas(".canvas", "#app");
const game = new Lifesim(canvas);

document.querySelector("#restart")?.addEventListener("click", () => {
  game.init();
});

game.init();
game.run();
