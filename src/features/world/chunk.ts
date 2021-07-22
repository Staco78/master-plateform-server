import { getBlockClassFromName } from "../../common/utils";
import Vector2D from "../../types/vector2D";
import Block from "./blocks/block";
import World from "./world";

export default class Chunk {
    readonly blocks = new BlockMap();

    pos: number;

    constructor(pos: number) {
        this.pos = pos;
    }

    fromSaveString(data: string) {
        const blocksData = data.split(";");

        blocksData.forEach(blockData => {
            if (blockData) {
                const splitedData = blockData.split(",");

                this.setBlock(
                    new Vector2D(parseInt(splitedData[1]), parseInt(splitedData[2])),
                    getBlockClassFromName(splitedData[0] as BlockName)
                );
            }
        });
    }

    setBlock(pos: Vector2D, block: typeof Block) {
        if (pos.x < 0 || pos.x > 15 || pos.y < 0) throw new Error("Block out of chunk range");
        if (Math.trunc(pos.x) !== pos.x || Math.trunc(pos.y) !== pos.y)
            throw new Error("Block position must be an integer");

        if (block.name === "Block") throw new Error("Cannot directly instantiate Block");

        // @ts-ignore
        let _block = new block(this, pos);

        if (this.blocks.has(pos)) {
            this.blocks.delete(pos);
        }

        this.blocks.set(pos, _block);
    }

    deleteBlock(pos: Vector2D) {
        if (!this.blocks.has(pos)) throw new Error("Block not found");

        this.blocks.delete(pos);
    }

    generate() {
        World.generator.generateChunk(this);
    }

    getData(): string {
        let result = "";

        this.blocks.forEach(block => {
            result += `${block.name},${block.pos.x},${block.pos.y};`;
        });

        return result;
    }
}

class BlockMap {
    private data = new Map<String, Block>();

    private hash(key: Vector2D) {
        return `${key.x} ${key.y}`;
    }

    set(key: Vector2D, block: Block) {
        if (this.data.has(this.hash(key))) throw new Error("Block already exist");

        this.data.set(this.hash(key), block);
    }

    has(key: Vector2D): boolean {
        return this.data.has(this.hash(key));
    }

    get(key: Vector2D) {
        return this.data.get(this.hash(key));
    }

    forEach(callback: (block: Block) => void, thisArg?: any) {
        this.data.forEach(callback, thisArg);
    }

    delete(pos: Vector2D) {
        let block = this.get(pos);
        if (!block) throw new Error("Block not found");

        this.data.delete(this.hash(pos));
    }
}
