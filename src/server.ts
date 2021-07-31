import EventEmitter from "events";

export namespace Server {
    const events = new EventEmitter();
    export const name = "server 1";

    export function emit(event: serverEvents, ...args: any[]) {
        events.emit(event, args);
    }

    export function on(event: serverEvents, listener: (...args: any[]) => void) {
        events.on(event, listener);
    }
}
