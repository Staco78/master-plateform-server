import ConnectionServer from "./connectionServer"; 
import login from "../features/login";
import { Players } from "../features/players/players";
import { Server } from "../server";

export default class RequestInterpreter {
    readonly connectionServer = new ConnectionServer();

    constructor() {
        this.connectionServer.on("ping", client => {
            client.send("pong", { name: Server.name });
        });

        this.connectionServer.on("login", (client, data) => {
            login(client, data as Receive.Login);
        });

        this.connectionServer.on("move", (client, data) => {
            Players.getFromClient(client)?.handleMove(data);
        });

        this.connectionServer.on("jump", (client, data) => {
            Players.getFromClient(client)?.jump();
        })
    }
}
