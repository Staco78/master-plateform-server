import Block from "../features/world/blocks/block";
import Dirt from "../features/world/blocks/dirt";
import Grass from "../features/world/blocks/grass";
import Leaves from "../features/world/blocks/leaves";
import Stone from "../features/world/blocks/stone";
import Wood from "../features/world/blocks/wood";


export function negativeModulo(x: number) {
    let result;
	if (x % 16 == 0) result = 0;
	else if (x >= 0) result = x % 16;
	else result = 16 + (x % 16);

    return result;
}


export function getBlockClassFromName(name: BlockName | string): typeof Block {
	switch (name) {
		case "dirt":
			return Dirt;

		case "grass":
			return Grass;

		case "leaves":
			return Leaves;

		case "stone":
			return Stone;

		case "wood":
			return Wood;

		default:
			throw new Error("No block exist with this name");
	}
}