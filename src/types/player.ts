import Client from "../connection/client";
import Vector2D from "./vector2D";

export default class Player {
    readonly name: string;
    pos: Vector2D;
    private client: Client;

    constructor(name: string, position: Vector2D, client: Client) {
        this.name = name;
        this.pos = position;
        this.client = client;
    }
}
