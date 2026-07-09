import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { loginDto, registerDto } from '@autoteile26/shared';
import type { LoginDto, RegisterDto } from '@autoteile26/shared';
import { ZodValidationPipe } from '../validation/ZodValidationPipe';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  @UsePipes(new ZodValidationPipe(loginDto))
  async login(@Body() body: LoginDto) {
    const user = await this.userService.validateUser(body.email, body.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  @Post('register')
  @UsePipes(new ZodValidationPipe(registerDto))
  async register(@Body() body: RegisterDto) {
    const user = await this.userService.createUser(body.email, body.password);

    return {
      id: user.id,
      email: user.email,
    };
  }
}
