import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { RefreshToken } from './entities/refresh-token.entity';
import { ResetToken } from './entities/reset-token.entity';
import { UserLogin } from './entities/user-logIn.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { NatsClientModule } from 'src/nats-client/nats-client.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

import * as dotenv from 'dotenv';
dotenv.config();
@Module({
  imports: [
    TypeOrmModule.forFeature([UserLogin, RefreshToken, ResetToken]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService]
    }),
    NatsClientModule
  ],
  providers: [AuthService, JwtService],
  controllers: [AuthController],
})
export class AuthModule { }

