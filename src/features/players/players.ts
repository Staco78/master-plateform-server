import Client from "../../connection/client";
import Player from "./player";

export namespace Players {
    const players: Player[] = [];

    export function addPlayer(player: Player) {
        players.push(player);
    }

    export function getFromClient(client: Client) {
        const player = players.find(player => player.client === client);
        if (player) return player;
        client.error("Who are you ?", true);
    }

    export function forEach(cb: (player: Player, index: number, array: Player[]) => void): void {
        players.forEach(cb);
    }

    export function deleteFromClient(client: Client) {
        const player = players.findIndex(player => player.client === client);
        if (player === -1) throw "Player not found";

        players.splice(player);
    }
}
