import Lifesim from "./src/Lifesim";


const game = new Lifesim();

document.querySelector('#restart')?.addEventListener("click", () => {
    game.init();
})

game.init();
game.run();

