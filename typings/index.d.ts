type actionSend = "pong" | "login";
type actionReceive = "ping" | "login";

interface LoginData {
    username: string;
}

type BlockName = "dirt" | "grass" | "stone" | "wood" | "leaves";
