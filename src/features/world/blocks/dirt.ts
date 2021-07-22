import Vector2D from "../../../types/vector2D";
import Chunk from "../chunk";
import Block from "./block";

export default class Dirt extends Block {
    constructor(chunk: Chunk, pos: Vector2D) {
        super(chunk, pos, "dirt");
    }
}
