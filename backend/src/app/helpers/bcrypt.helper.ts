import { Injectable } from "@nestjs/common";
import { compare, hash } from "bcryptjs";
import { ENV } from "src/ENV";

@Injectable()
export class BcryptHelper {
  public hash(plainText: string, saltRounds: number = ENV.jwt.saltRound) {
    return hash(plainText, saltRounds);
  }

  public compareHash(plainText: string, hashString: string) {
    return compare(plainText, hashString);
  }
}
