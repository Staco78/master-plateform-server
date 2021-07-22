import * as randomSeed from "random-seed";

export default class Random {
	private generator: randomSeed.RandomSeed;
	private seed: string | undefined;

	constructor(seed?: string) {
		this.seed = seed;
		this.generator = randomSeed.create(this.seed);
	}

	random() {
		return this.generator.random();
	}

	getSeed(){
		return this.seed;
	}
}
