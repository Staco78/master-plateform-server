import Client from "../connection/client";

export default class WsMessage<T = any> {
    readonly data: T;
    readonly action: string;

    protected client: Client;

    constructor(data: wsMessageData<T>, client: Client) {
        this.data = data.data;
        this.action = data.action as string;

        this.client = client;
    }
}
