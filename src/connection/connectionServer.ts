import WebSocket from "ws";
import EventEmitter from "events";
import Client from "./client";
import { Players } from "../features/players/players";
import { Server } from "../server";
import WsError from "../types/wsError";
import WsMessage from "../types/wsMessage";
import wsResponsableMessage from "../types/wsResponsableMessage";

class ConnectionServer extends EventEmitter {
    readonly ws = new WebSocket.Server({ port: 3497 });

    private responseEventEmitter = new EventEmitter();

    constructor() {
        super();

        console.log("Server started");

        this.ws.on("connection", wss => {
            console.log(`Client connected`);

            const client = new Client(wss, this);

            wss.on("message", data => {
                try {
                    this.parseMessage(data, client);
                } catch (e) {
                    if (e instanceof WsError) client.error(e.message, e.fatal);
                    else client.error("Unkown server error", true);
                }
            });

            wss.on("error", err => {
                console.log(err.message);
            });

            wss.on("close", (code, reason) => {
                if (Players.find(player => player.client === client)) {
                    const player = Players.deleteFromClient(client);

                    Server.emit("playerDisconnected", player);
                    console.log(`${player.name} left the game`);
                }

                console.log("Client disconnected", code, reason);
            });
        });
    }

    private parseMessage(data: WebSocket.Data, client: Client) {
        let json: wsMessageData;

        try {
            json = JSON.parse(data.toString());
        } catch (error) {
            throw new WsError("Invalid json");
        }

        if (json.type === undefined) throw new WsError("Invalid json: missing type");
        if (json.type !== 0 && json.type !== 1 && json.type !== 2) throw new WsError("Invalid json: unkown type");

        if (!json.data) throw new WsError("Invalid json: missing data");
        if (typeof json.data !== "object") throw new WsError("Invalid json");

        if (json.type === 0) {
            if (!json.action) throw new WsError("Invalid json: missing action");
            if (typeof json.action !== "string") throw new WsError("Invalid json");

            console.log(json.action);

            this.emit(json.action, client, new WsMessage(json, client));
        } else if (json.type === 1) {
            if (!json.action) throw new WsError("Invalid json: missing action");
            if (typeof json.action !== "string") throw new WsError("Invalid json");

            console.log(json.action);

            if (!json.id) throw new WsError("Invalid json: missing id");

            this.emit(json.action, client, new wsResponsableMessage(json, client));
        } else this.parseResponse(json);
    }

    private parseResponse(json: wsMessageData) {
        if (!json.id || typeof json.id !== "string") throw new WsError("Invalid json: missing id");

        this.responseEventEmitter.emit(json.id, json.data);
    }

    on(event: actionReceive, callback: (client: Client, data: WsMessage) => void): this {
        return super.on(event, callback);
    }

    onResponse(id: string, callback: (data: any) => void) {
        this.responseEventEmitter.on(id, callback);
    }
}

export default ConnectionServer;
