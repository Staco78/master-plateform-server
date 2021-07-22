import Server from "./server";
import login from "../features/login";
import { Players } from "../features/players/players";

export default class RequestInterpreter {
    readonly server = new Server();

    constructor() {
        this.server.on("ping", client => {
            client.send("pong", { name: "server 1" });
        });

        this.server.on("login", (client, data) => {
            login(client, data as Receive.Login);
        });

        this.server.on("move", (client, data) => {
            Players.getFromClient(client)?.handleMove(data);
        });

        this.server.on("jump", (client, data) => {
            Players.getFromClient(client)?.jump();
        })
    }
}
