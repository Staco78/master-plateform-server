import RequestInterpreter from "./connection/requestInterpreter";
import { Players } from "./features/players/players";

new RequestInterpreter();

setInterval(() => {
    Players.forEach(player => {
        player.tick();
    });
}, 1000 / 60);
