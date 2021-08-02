import Client from "../connection/client";
import WsMessage from "./wsMessage";

export default class wsResponsableMessage<T = any, V = any> extends WsMessage<T> {
    readonly id: string;

    constructor(data: wsMessageData<T>, client: Client) {
        super(data, client);

        this.id = data.id as string;
    }

    response(data: V) {
        this.client.sendRaw({ type: 2, data: data, id: this.id });
    }
}
