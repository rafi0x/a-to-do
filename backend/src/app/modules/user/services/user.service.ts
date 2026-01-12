import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SuccessResponse } from "src/app/types";
import { Repository } from "typeorm";
import { BcryptHelper, JWTHelper } from "../../../helpers";
import { LoginDTO, RegisterDTO } from "../dtos";
import { User } from "../entities/user.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly bcrypt: BcryptHelper,
    private readonly jwt: JWTHelper,
  ) { }

  async register(payload: RegisterDTO): Promise<SuccessResponse> {
    const existingUser = await this.userRepository.findOne({
      where: { email: payload.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const user = this.userRepository.create(payload);

    await this.userRepository.save(user);

    const token = this.jwt.sign(
      { id: user.id, email: user.email }
    );

    return new SuccessResponse('User registered successfully', token);
  }

  async login(payload: LoginDTO): Promise<SuccessResponse> {
    const user = await this.userRepository.findOne({
      where: { email: payload.email }
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.bcrypt.compareHash(
      payload.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwt.sign(
      { id: user.id, email: user.email }
    );

    return new SuccessResponse('User logged in successfully', token);
  }
}
