import SaveManager from "../../common/saveManager";
import Chunk from "./chunk";

export default class ChunksManager {
    private readonly chunks = new Map<number, Chunk>();

    get(pos: number): Chunk {
        if (this.chunks.has(pos)) return this.chunks.get(pos) as Chunk;

        let saveChunk = SaveManager.loadChunk(pos);
        if (saveChunk) {
            let chunk = new Chunk(pos);
            this.chunks.set(pos, chunk);
            chunk.fromSaveString(saveChunk);
            return chunk;
        }

        let chunk = new Chunk(pos);
        this.chunks.set(pos, chunk);
        chunk.generate();

        return this.chunks.get(pos) as Chunk;
    }

    forEach(callback: (chunk: Chunk, pos: number) => void, thisArg?: any) {
        this.chunks.forEach(callback, thisArg);
    }
}
