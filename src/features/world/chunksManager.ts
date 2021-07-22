import SaveManager from "../../common/saveManager";
import Chunk from "./chunk";

export default class ChunksManager {
    private readonly chunks = new Map<number, Chunk>();
    private readonly unloadedChunks = new Map<number, Chunk>();

    get(pos: number): Chunk {
        if (this.chunks.has(pos)) return this.chunks.get(pos) as Chunk;
        if (this.unloadedChunks.has(pos)) {
            return this.loadChunk(pos);
        }

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

    private loadChunk(pos: number): Chunk {
        let chunk = this.unloadedChunks.get(pos) as Chunk;

        this.unloadedChunks.delete(pos);

        this.chunks.set(pos, chunk);

        return chunk;
    }

    unload(pos: number) {
        if (this.unloadedChunks.has(pos)) throw new Error("Chunk already unloaded");

        let chunk = this.chunks.get(pos);

        if (!chunk) throw new Error("Chunk doesn't exist");

        this.chunks.delete(pos);

        this.unloadedChunks.set(pos, chunk);

        return chunk;
    }

    forEach(callback: (chunk: Chunk, pos: number) => void, thisArg?: any) {
        this.chunks.forEach(callback, thisArg);
    }

    forEachAll(callback: (chunk: Chunk, pos: number) => void, thisArg?: any) {
        this.chunks.forEach(callback, thisArg);
        this.unloadedChunks.forEach(callback, thisArg);
    }
}
