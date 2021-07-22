import Server from "./server";
import EventEmitter from "events";
import login from "../features/login";

export default class RequestInterpreter {
    readonly server = new Server();

    constructor() {
        this.server.on("ping", client => {
            client.send("pong", { name: "server 1" });
        });

        this.server.on("login", (client, data) => {
            login(client, data as LoginData);
        });
    }
}
