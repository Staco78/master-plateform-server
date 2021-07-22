import fs from "fs";
import { join as pathJoin } from "path";
import Chunk from "../features/world/chunk";
import World from "../features/world/world";

export default class SaveManager {
    private static worldFolder: string;

    static init() {
        this.worldFolder = pathJoin(__dirname + "/../save/world/");
    }

    static loadChunk(chunkPos: number): string | null {
        // let chunkPath = this.worldFolder + chunkPos.toString();
        // if (!fs.existsSync(chunkPath)) return null;
        // return fs.readFileSync(chunkPath, { encoding: "ascii" }).toString();
        return null;
    }
}

function saveWorld(gameFolder: string) {
    let worldFolder = gameFolder + "\\world";

    createFolder(worldFolder);

    World.chunks.forEach(chunk => {
        saveChunk(chunk, worldFolder);
    });
}

function saveChunk(chunk: Chunk, worldFolder: string) {
    let chunkPath = worldFolder + "\\" + chunk.pos.toString();

    fs.writeFileSync(chunkPath, chunk.getData(), { encoding: "ascii" });
}

function createFolder(path: string) {
    if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });
}
