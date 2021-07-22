import RequestInterpreter from "./connection/requestInterpreter";
import { Players } from "./features/players/players";

new RequestInterpreter();

let lastFrame = Date.now();

setInterval(() => {
    let frameTime = Date.now() - lastFrame;
    Players.forEach(player => {
        player.tick(1);
    });

    lastFrame = Date.now();
}, 1000 / 60);
