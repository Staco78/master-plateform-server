import Block from "./block";

import Chunk from "../chunk";
import Vector2D from "../../../types/vector2D";

export default class Leaves extends Block {
	constructor(chunk: Chunk, pos: Vector2D) {
		super(chunk, pos, "leaves");
	}
}
