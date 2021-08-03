import WebSocket from "ws";
import { generateUuid } from "../common/utils";
import ConnectionServer from "./connectionServer";

export default class Client {
    private wsClient: WebSocket;
    private connectionServer: ConnectionServer;
    constructor(wsClient: WebSocket, connectionServer: ConnectionServer) {
        this.wsClient = wsClient;
        this.connectionServer = connectionServer;
    }

    send(action: actionSend, data: any) {
        return new Promise<any>((resolve, reject) => {
            const id = generateUuid();
            this.sendRaw({ action, data, type: 1, id }, e => {
                if (e) reject(e);
            });

            this.connectionServer.onResponse(id, data => {
                resolve(data);
            });

            this.connectionServer.onError(id, reject);
        });
    }

    sendRaw(data: wsMessageData, cb?: (err?: Error) => void) {
        this.wsClient.send(JSON.stringify(data), cb);
    }

    error(message: string, fatal = false) {
        if (fatal) this.wsClient.close(3001, `Fatal error: ${message}`);
        else this.wsClient.send("Error: " + message);
    }
}
