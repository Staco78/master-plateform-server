import Client from "../connection/client";
import { Players } from "../data/players";
import Player from "../types/player";
import Vector2D from "../types/vector2D";
import World from "./world/world";

export default function login(client: Client, data: LoginData) {
    if (!data.username) {
        return client.error("Invalid data");
    }

    const player = createPlayer(client, data);

    Players.addPlayer(player);

    const worldData = World.getDataForPlayer(player);
    client.send("login", { success: true, chunks: worldData });
}

function createPlayer(client: Client, data: LoginData): Player {
    return new Player(data.username, new Vector2D(0, 0), client);
}
