/// <reference path="../../typings/index.d.ts" />

import WebSocket from "ws";
import EventEmitter from "events";
import Client from "./client";

class ConnectionServer extends EventEmitter {
    readonly ws = new WebSocket.Server({ port: 3497 });

    constructor() {
        super();
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
        });
    }

    on(event: actionReceive, callback: (client: Client, data: Object) => void): this {
        return super.on(event, callback);
    }
}

export default ConnectionServer;
