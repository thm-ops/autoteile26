import {
    Controller,
    Post,
    Body,
    UnauthorizedException,
    ForbiddenException,
    Headers,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    @Post('login')
    async login(
        @Body() body: {
            email: string;
            password: string;
        },
    ) {
        const user = await this.userService.validateUser(body.email, body.password,);



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
    async register(
        @Body()
        body: {
            email: string;
            password: string;
        },
    ) {
        const user = await this.userService.createUser(body.email, body.password,);

        return {
            id: user.id,
            email: user.email,
        };
    }

    @Post('unlock')
    async unlock(
        @Headers('authorization') authorization: string,
        @Body() body: { email: string },
    ) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            throw new UnauthorizedException('Missing token');
        }

        const token = authorization.replace('Bearer ', '');

        let payload: { sub: string; email: string };

        try {
            payload = await this.jwtService.verifyAsync(token);
        } catch {
            throw new UnauthorizedException('Invalid token');
        }

        const adminUser = await this.userService.findById(payload.sub);

        if (!adminUser || adminUser.role !== 'admin') {
            throw new ForbiddenException('Only admins can unlock accounts');
        }

        return this.userService.unlockUser(body.email);
    }
}