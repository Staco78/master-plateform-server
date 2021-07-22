import WebSocket from "ws";

export default class Client {
    private wsClient: WebSocket;
    constructor(wsClient: WebSocket) {
        this.wsClient = wsClient;
    }

    send(action: actionSend, data: object, cb?: (err?: Error) => void) {
        this.wsClient.send(
            JSON.stringify({
                action,
                data,
            }),
            cb
        );
    }

    error(message: string, fatal = false) {
        if (fatal) this.wsClient.close(-1, `Fatal error: ${message}`);
        else this.wsClient.send("Error: " + message);
    }
}
