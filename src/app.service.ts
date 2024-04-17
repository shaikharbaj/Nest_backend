import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { userSendResetLinkEvent } from './module/email/events/user.sendresetlink.event';
import { usersendresetlinkListener } from './module/email/listener/user.sendresetlink.listener';
@Injectable()
export class AppService {
  private readonly logger = new Logger();
  constructor(private readonly eventEmitter: EventEmitter2) { }
  async getHello(): Promise<any> {
    return 'Hello World!';
  }

  async createuser(body: any) {
    // this.logger.log("creating user....!")
    // const id = 1;
    // const name = 'arbaj'
    // this.eventEmitter.emit('user.create', new userSendResetLinkEvent(id, name))
    return 'hii'
  }

  // @OnEvent('user.create')
  // async welcome(data: userSendResetLinkEvent) {
  //   console.log(data.id)
  //   console.log(data.name)
  // }
}
