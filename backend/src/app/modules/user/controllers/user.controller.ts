import { Body, Controller, Post } from "@nestjs/common";
import { SuccessResponse } from "src/app/types";
import { LoginDTO, RegisterDTO } from "../dtos";
import { UserService } from "../services/user.service";

@Controller("auth")
export class UserController {
  constructor(private readonly service: UserService) { }

  @Post("register")
  async register(
    @Body() body: RegisterDTO,
  ): Promise<SuccessResponse> {
    return this.service.register(body);
  }

  @Post("login")
  async login(
    @Body() body: LoginDTO,
  ): Promise<SuccessResponse> {
    return this.service.login(body);
  }
}
