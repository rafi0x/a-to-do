import {
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { sign, verify as verifyToken } from "jsonwebtoken";
import { ENV } from "src/ENV";
export type GenericObject = { [key: string]: any };
@Injectable()
export class JWTHelper {
  public sign(payload: GenericObject) {
    return sign(payload, ENV.jwt.secret, { expiresIn: ENV.jwt.tokenExpireIn });
  }

  public verify(token: string) {
    try {
      return verifyToken(token, ENV.jwt.secret);
    } catch (error) {
      throw new UnauthorizedException("Unauthorized Access Detected");
    }
  }

  public extractToken(headers: GenericObject) {
    let token: string =
      headers && headers.authorization ? headers.authorization : "";
    token = token.replace(/Bearer\s+/gm, "");
    return token;
  }

}
