import EventEmitter from "events";
import RequestInterpreter from "./connection/requestInterpreter";
import { Players } from "./features/players/players";

export namespace Server {
    const events = new EventEmitter();

    export let requestInterpreter: RequestInterpreter;

    export function init() {
        requestInterpreter = new RequestInterpreter();

        setInterval(() => {
            Players.forEach(player => {
                player.tick();
            });
        }, 1000 / 60);
    }

    export const name = "server 1";

    export function emit(event: serverEvents, ...args: any[]) {
        events.emit(event, args);
    }

    export function on(event: serverEvents, listener: (...args: any[]) => void) {
        events.on(event, listener);
    }
}
