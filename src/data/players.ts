import Player from "../types/player";

export namespace Players {
    const players: Player[] = [];

    export function addPlayer(player: Player) {
        players.push(player);
    }
}
