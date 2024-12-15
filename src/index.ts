import Game from './entities/Game';
import './styles/main.css';

window.onload = async () => {
    console.log("Window Loaded!");
    const stage = document.getElementById("stage");
    if (stage) {
        const game = new Game(stage as HTMLDivElement);
    }
}