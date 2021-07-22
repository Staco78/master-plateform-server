import Vector2D from "../../../types/vector2D";
import Chunk from "../chunk";

export default class Block {
    pos: Vector2D;

    private chunk: Chunk;

    name: string;

    constructor(chunk: Chunk, pos: Vector2D, name: BlockName) {
        this.chunk = chunk;

        this.name = name;

        this.pos = pos;
    }

    delete() {
        this.chunk.deleteBlock(this.pos);
    }
}
