import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';

@Module({
    imports: [
        UserModule,
        ConfigModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                const secret = config.get('JWT_SECRET');

                if (!secret) {
                    throw new Error('JWT_SECRET is missing');
                }

                return {
                    secret,
                    signOptions: { expiresIn: '1d' },
                };
            },
        }),
    ],
    controllers: [AuthController],
})
export class AuthModule { }