type actionSend = "pong" | "move" | "chunk";
type actionReceive = "ping" | "login" | "move" | "jump" | "blockBreak";

type BlockName = "dirt" | "grass" | "stone" | "wood" | "leaves";

type serverEvents = "playerConnected" | "playerDisconnected";

declare const enum Direction {
    stop,
    left,
    right,
}

interface ChunkData {
    pos: number;
    data: string;
}

declare namespace Receive {
    interface Login {
        username: string;
    }

    interface PlayerStartMove {
        direction: Direction;
    }
}

declare namespace Send {
    interface Pong {
        name: string;
    }

    interface Chunk {
        pos: number;
        data: string;
    }

    interface Move {
        pos: { x: number; y: number };
    }
}
