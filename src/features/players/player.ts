import { collisionDetectionDistance, gravity, jumpStrenght, maxFallSpeed, playerSize, playerSpeed } from "../../common/constants";
import Client from "../../connection/client";
import World from "../world/world";
import Rectangle from "../../types/rectangle";
import Vector2D from "../../types/vector2D";
import Chunk from "../world/chunk";

export default class Player {
    readonly name: string;
    private speed: Vector2D;
    pos: Vector2D;
    readonly client: Client;
    private move = Direction.stop;

    private visibleChunks: Chunk[] = [];

    constructor(name: string, position: Vector2D, client: Client) {
        this.name = name;
        this.pos = position;
        this.client = client;
        this.speed = new Vector2D(0, 0);
    }

    handleMove(data: Receive.PlayerStartMove) {
        this.move = data.direction;
    }

    tick() {
        if (this.move === Direction.right) this.speed.x += playerSpeed;
        else if (this.move === Direction.left) this.speed.x -= playerSpeed;

        const lastSendMove = { x: this.pos.x, y: this.pos.y };

        //gravity
        this.speed.y += -gravity;
        this.speed.y = Math.max(this.speed.y, -maxFallSpeed);

        if (!this.speed.equals({ x: 0, y: 0 })) {
            this.calcCollision();

            if (lastSendMove.x !== this.pos.x || lastSendMove.y !== this.pos.y) this.client.send("move", { pos: { x: this.pos.x, y: this.pos.y } });
        }

        let visibleChunks = World.getVisiblesChunk(this.pos.x);

        visibleChunks.forEach(chunk => {
            let foundChunk = this.visibleChunks.some(c => c === chunk);

            if (!foundChunk) this.sendChunkData(chunk);
        });

        this.visibleChunks = visibleChunks;
    }

    private sendChunkData(chunk: Chunk) {
        console.log("chunk data send", chunk.pos);

        this.client.send("chunk", { pos: chunk.pos, data: chunk.getData() });
    }

    private calcCollision() {
        let testPos = this.pos.clone();
        testPos.x += this.speed.x;
        testPos.y += this.speed.y;

        for (let x = Math.round(this.pos.x) - collisionDetectionDistance; x <= Math.round(this.pos.x) + collisionDetectionDistance; x++) {
            for (let y = Math.round(this.pos.y) - collisionDetectionDistance; y <= Math.round(this.pos.y) + collisionDetectionDistance; y++) {
                let block = World.getBlock(new Vector2D(x, y));

                if (block) {
                    // console.log(block);

                    // if (x < 0) alert(block)
                    // block.filters = [new PIXI.filters.BlurFilter(100)];

                    let blockRect = new Rectangle(x, y, 1, 1);

                    // colision X
                    if (testCollisionAABB(new Rectangle(testPos.x, this.pos.y, playerSize.width, playerSize.height), blockRect)) {
                        let rightToLeft = Math.abs(this.pos.x + playerSize.width - blockRect.x);
                        let leftToRight = blockRect.x + blockRect.width - this.pos.x;

                        this.speed.x = Math.min(rightToLeft, leftToRight);

                        // this.speed.x = 0;
                    }

                    // colision Y
                    if (testCollisionAABB(new Rectangle(this.pos.x, testPos.y, playerSize.width, playerSize.height), blockRect)) {
                        let topToBottom = Math.abs(this.pos.y + playerSize.height - blockRect.y);
                        let bottomToTop = blockRect.y + blockRect.height - this.pos.y;

                        this.speed.y = Math.min(topToBottom, bottomToTop);

                        // this.speed.y = 0;
                    }
                }
            }
        }

        if (!isFinite(this.speed.x)) this.speed.x = 0;
        if (!isFinite(this.speed.y)) this.speed.y = 0;

        this.pos.x += this.speed.x;
        this.pos.y += this.speed.y;

        this.speed.x = 0;
    }

    jump() {
        if (this.speed.y === 0) this.speed.y = jumpStrenght;
    }

    // private move() {
    //     // let chunk = this.world.chunks.get(this.actualChunk) as Chunk;

    //     this.pos.x += this.speed.x;
    //     this.pos.y += this.speed.y;

    //     console.log(this.pos);

    //     this.speed.x = 0;
    //     // this.speed.set(0, 0);
    // }
}

function testCollisionAABB(rect1: Rectangle, rect2: Rectangle) {
    let result = rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x && rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y;

    // console.log(result);

    return result;
}
