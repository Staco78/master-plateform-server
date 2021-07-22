import Random from "../../../common/random";
import Vector2D from "../../../types/vector2D";
import Dirt from "../blocks/dirt";
import Grass from "../blocks/grass";
import Leaves from "../blocks/leaves";
import Stone from "../blocks/stone";
import Wood from "../blocks/wood";
import Chunk from "../chunk";
import World from "../world";

export default class Generation {
    private heightMapNoise: Simple1DNoise;
    private decorationMapNoise: Simple1DNoise;

    seed: string;

    constructor(seed: string) {
        this.seed = seed;

        this.heightMapNoise = new Simple1DNoise(this.seed);
        this.decorationMapNoise = new Simple1DNoise(this.seed + "tree");
    }

    generateChunk(chunk: Chunk) {
        console.log("chunk generated");

        for (let x = 0; x < 16; x++) {
            let calcBlockPos = (chunk.pos * 16 + x) / 50;

            let positiveBlockPos = 1000000 - calcBlockPos;

            let height = this.heightMapNoise.getVal(positiveBlockPos);

            let y = Math.round((height + 1) * 40);
            let maxY = y;

            chunk.setBlock(new Vector2D(x, y), Grass);
            y--;

            chunk.setBlock(new Vector2D(x, y), Dirt);
            y--;

            chunk.setBlock(new Vector2D(x, y), Dirt);
            y--;

            chunk.setBlock(new Vector2D(x, y), Dirt);
            y--;

            for (; y >= 0; y--) {
                chunk.setBlock(new Vector2D(x, y), Stone);
            }

            // result in interval [0; 1]
            let decorationNoise = this.decorationMapNoise.getVal(1000000 - (chunk.pos * 16 + x) * 10);

            const treeRange = { min: 0.3, max: 0.4 };

            if (decorationNoise > treeRange.min && decorationNoise < treeRange.max) this.spawnTree(chunk, x, maxY + 1);
        }
    }

    private spawnTree(chunk: Chunk, x: number, y: number) {
        chunk.setBlock(new Vector2D(x, y), Wood);
        chunk.setBlock(new Vector2D(x, y + 1), Wood);
        chunk.setBlock(new Vector2D(x, y + 2), Wood);

        for (let _x = x - 1; _x < x + 2; _x++) {
            for (let _y = y + 1; _y < y + 4; _y++)
                if (_x !== x || _y === y + 3)
                    if (_x >= 0 && _x < 16) chunk.setBlock(new Vector2D(_x, _y), Leaves);
                    else World.setBlock(new Vector2D(chunk.pos * 16 + _x, _y), Leaves);
        }
    }
}

class Simple1DNoise {
    private readonly MAX_VERTICES = 256;
    private readonly MAX_VERTICES_MASK = this.MAX_VERTICES - 1;
    private amplitude = 1;
    private scale = 1;

    private readonly r: number[] = [];

    private randomGenerator;

    constructor(seed: string) {
        this.randomGenerator = new Random(seed);

        for (var i = 0; i < this.MAX_VERTICES; ++i) {
            this.r.push(this.randomGenerator.random());
        }
    }

    getVal(x: number) {
        var scaledX = x * this.scale;
        var xFloor = Math.floor(scaledX);
        var t = scaledX - xFloor;
        var tRemapSmoothstep = t * t * (3 - 2 * t);

        var xMin = xFloor % this.MAX_VERTICES_MASK;
        var xMax = (xMin + 1) % this.MAX_VERTICES_MASK;

        var y = this.lerp(this.r[xMin], this.r[xMax], tRemapSmoothstep);

        return y * this.amplitude;
    }

    setAmplitude(newAmplitude: number) {
        this.amplitude = newAmplitude;
    }
    setScale(newScale: number) {
        this.scale = newScale;
    }

    getSeed() {
        return this.randomGenerator.getSeed() as string;
    }

    /**
     * Linear interpolation function.
     * @param a The lower integer value
     * @param b The upper integer value
     * @param t The value between the two
     * @returns {number}
     */
    private lerp(a: number, b: number, t: number): number {
        return a * (1 - t) + b * t;
    }
}
