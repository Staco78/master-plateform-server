import Vector2D from "../../types/vector2D";
import Player from "../players/player";
import World from "./world";

export default function blockBreak(player: Player, data: Receive.BlockBreak) {
    const blockPos = new Vector2D(data.block.x, data.block.y);
    if (calcDistance(player.pos, blockPos) < 5) World.deleteBlock(blockPos);
}

function calcDistance(a: Vector2D, b: Vector2D): number {
    return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
}
