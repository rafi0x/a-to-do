import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from "typeorm";
import { User } from "../entities/user.entity";
import { BcryptHelper } from "src/app/helpers";

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  constructor(
    dataSource: DataSource,
    private readonly bcryptHelper: BcryptHelper,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return User;
  }

  async beforeInsert(event: InsertEvent<User>) {
    if (event.entity?.password) {
      event.entity.password = await this.bcryptHelper.hash(
        event.entity.password,
      );
    }
  }

  async beforeUpdate(event: UpdateEvent<User>) {
    if (event.entity?.password) {
      event.entity.password = await this.bcryptHelper.hash(
        event.entity.password,
      );
    }
  }
}
