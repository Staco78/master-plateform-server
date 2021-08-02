import Client from "../connection/client";
import { Players } from "./players/players";
import Player from "./players/player";
import Vector2D from "../types/vector2D";
import { Server } from "../server";
import WsError from "../types/wsError";
import WsMessage from "../types/wsMessage";

export default function login(client: Client, message: WsMessage<Receive.Login>) {
    if (!message.data.username) {
        throw new WsError("Invalid data");
    }

    if (Players.find(player => player.name === message.data.username)) throw new WsError("Player already exist", true);

    const player = createPlayer(client, message.data);

    Players.addPlayer(player);

    Server.emit("playerConnected", player);

    console.log(`${player.name} joined the game`);
}

function createPlayer(client: Client, data: Receive.Login): Player {
    return new Player(data.username, new Vector2D(0, 60), client);
}
