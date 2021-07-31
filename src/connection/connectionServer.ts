import WebSocket from "ws";
import EventEmitter from "events";
import Client from "./client";
import { Players } from "../features/players/players";
import { Server } from "../server";

class ConnectionServer extends EventEmitter {
    readonly ws = new WebSocket.Server({ port: 3497 });

    constructor() {
        super();

        console.log("Server started");

        this.ws.on("connection", wss => {
            console.log(`Client connected`);

            const client = new Client(wss);

            wss.on("message", data => {
                let json;

                try {
                    json = JSON.parse(data.toString());
                } catch (error) {
                    return client.error("Invalid json");
                }

                if (!json.action) return client.error("Invalid json (missing action)");
                if (typeof json.action !== "string") return client.error("Invalid json");

                console.log(json.action);

                this.emit(json.action, client, json.data || {});
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

    on(event: actionReceive, callback: (client: Client, data: any) => void): this {
        return super.on(event, callback);
    }
}

export default ConnectionServer;