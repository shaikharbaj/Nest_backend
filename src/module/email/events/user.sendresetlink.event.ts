import { OnEvent } from "@nestjs/event-emitter";

export class userSendResetLinkEvent {
    constructor(public readonly userid: number, public readonly token: string,public readonly to:string) {
    }
}