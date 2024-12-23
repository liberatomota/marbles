import Game from "./entities/Game";
import { LEVELS } from "./constants/game-const";
import "./styles/main.css";

let game: Game | null = null;

window.onload = async () => {
  console.log("Window Loaded!");
  const stage = document.getElementById("stage");
  if (stage) {
    game = new Game(
      stage as HTMLDivElement,
      stage.clientWidth,
      stage.clientHeight
    );
    createLevel(0);
  }
};

function checkIfGameExists() {
  if (!game) {
    throw new Error("Game does not exist");
  }
}

function createLevel(levelNumber: number = 0) {
  try {
    checkIfGameExists();
    if (!game) return;

    const level = LEVELS[levelNumber];

    game.reset();
    game.createLevel(levelNumber, level);
    game.level!.start();
  } catch (error) {
    console.error(error);
  }
}
