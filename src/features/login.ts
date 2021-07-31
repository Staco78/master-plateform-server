import Client from "../connection/client";
import { Players } from "./players/players";
import Player from "./players/player";
import Vector2D from "../types/vector2D";
import { Server } from "../server";

export default function login(client: Client, data: Receive.Login) {
    if (!data.username) {
        return client.error("Invalid data");
    }

    if (Players.find(player => player.name === data.username)) return client.error("Player already exist", true);

    const player = createPlayer(client, data);

    Players.addPlayer(player);

    Server.emit("playerConnected", player);

    console.log(`${player.name} joined the game`);
}

function createPlayer(client: Client, data: Receive.Login): Player {
    return new Player(data.username, new Vector2D(0, 60), client);
}
