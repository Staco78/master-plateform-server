import login from "../features/login";
import { Players } from "../features/players/players";
import { Server } from "../server";
import blockBreak from "../features/world/blockBreak";

import { Server as SocketServer } from "reply-ws";

export default class Connection {
    readonly server = new SocketServer(3497);

    constructor() {
        this.server.on("connection", () => console.log("Client connected"));

        this.server.onAction("ping", (client, message) => {
            message.reply({ name: Server.name });
        });

        this.server.onAction("login", (client, message) => {
            login(client, message);
        });

        this.server.onAction("move", (client, message) => {
            Players.getFromClient(client)?.handleMove(message.data);
        });

        this.server.onAction("jump", (client, data) => {
            Players.getFromClient(client)?.jump();
        });

        this.server.onAction("blockBreak", (client, data) => {
            const player = Players.getFromClient(client);
            if (player) blockBreak(player, data.data);
        });
    }
}
