import ConnectionServer from "./connectionServer";
import login from "../features/login";
import { Players } from "../features/players/players";
import { Server } from "../server";
import blockBreak from "../features/world/blockBreak";
import wsResponsableMessage from "../types/wsResponsableMessage";

export default class RequestInterpreter {
    readonly connectionServer = new ConnectionServer();

    constructor() {
        this.connectionServer.on("ping", (client, data) => {
            (data as wsResponsableMessage).response({ name: Server.name });
        });

        this.connectionServer.on("login", (client, data) => {
            login(client, data);
        });

        this.connectionServer.on("move", (client, data) => {
            Players.getFromClient(client)?.handleMove(data.data);
        });

        this.connectionServer.on("jump", (client, data) => {
            Players.getFromClient(client)?.jump();
        });

        this.connectionServer.on("blockBreak", (client, data) => {
            const player = Players.getFromClient(client);
            if (player) blockBreak(player, data.data);
        });
    }
}
