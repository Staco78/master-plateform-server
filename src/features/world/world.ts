import Vector2D from "../../types/vector2D";
import { negativeModulo } from "../../common/utils";
import Block from "./blocks/block";
import ChunksManager from "./chunksManager";
import Player from "../players/player";
import Generation from "./generation/generation";
import { renderDistance } from "../../common/constants";

export default class World {
    static readonly chunks = new ChunksManager();

    static generator: Generation = new Generation("seed");

    static getDataForPlayer(player: Player): { data: string; pos: number }[] {
        const chunks = this.getVisiblesChunk(player.pos.x);

        return chunks.map(chunk => {
            return { data: chunk.getData(), pos: chunk.pos };
        });
    }

    static getVisiblesChunk(playerX: number) {
        const playerChunk = Math.floor(playerX / 16);

        const chunks = [];

        for (let i = playerChunk - renderDistance; i <= playerChunk + renderDistance; i++) {
            chunks.push(this.chunks.get(i));
        }

        return chunks;
    }

    static setBlock(pos: Vector2D, block: typeof Block) {
        let chunkPos = Math.floor(pos.x / 16);

        let blockPos = new Vector2D(negativeModulo(pos.x), pos.y);

        this.chunks.get(chunkPos).setBlock(blockPos, block);
    }

    static getBlock(pos: Vector2D): Block | undefined {
        let chunkPos = Math.floor(pos.x / 16);

        let blockPos = new Vector2D(negativeModulo(pos.x), pos.y);

        let chunk = this.chunks.get(chunkPos);
        if (!chunk) return undefined;

        return chunk.blocks.get(blockPos);
    }

    static deleteBlock(pos: Vector2D) {
        let chunkPos = Math.floor(pos.x / 16);

        let blockPos = new Vector2D(negativeModulo(pos.x), pos.y);

        let chunk = this.chunks.get(chunkPos);

        if (!chunk) throw new Error(`Block not found (${pos.x}:${pos.y})`);

        if (!chunk.blocks.has(blockPos)) throw new Error(`Block not found (${pos.x}:${pos.y})`);

        chunk.deleteBlock(blockPos);
    }
}
