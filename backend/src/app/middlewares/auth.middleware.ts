import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from "@nestjs/common";
import { DataSource } from "typeorm";
import { JWTHelper } from "../helpers";
import { User } from "../modules/user/entities/user.entity";

export interface IAuthUser {
  id?: string;
  email?: string;
  fullName?: string;
}


@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtHelper: JWTHelper,
    private readonly dataSource: DataSource
  ) { }
  async use(req: any, res: Response, next: Function) {
    const token = this.jwtHelper.extractToken(req.headers);
    const verifiedUser: any = await this.jwtHelper.verify(token);
    if (!verifiedUser) {
      throw new UnauthorizedException("Unauthorized Access Detected");
    }

    const user = await this.dataSource
      .createQueryBuilder(User, 'user')
      .leftJoinAndSelect('user.userRoles', 'userRole')
      .leftJoinAndSelect('userRole.role', 'role')
      .where('user.id = :userId', { userId: verifiedUser.user.id })
      .andWhere('user.isActive = :isActive', { isActive: true })
      .getOne();

    if (!user) {
      throw new UnauthorizedException("Unauthorized Access Detected");
    }

    let userData: IAuthUser = {};

    const { password, ...rest } = user;

    userData = {
      ...rest,
    };

    req.verifiedUser = userData;
    next();
  }
}