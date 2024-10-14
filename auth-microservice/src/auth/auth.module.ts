import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { RefreshToken } from './entities/refresh-token.entity';
import { ResetToken } from './entities/reset-token.entity';
import { UserLogin } from './entities/user-logIn.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { NatsClientModule } from 'src/nats-client/nats-client.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserLogin, RefreshToken, ResetToken]),
    JwtModule.register({
      secret: 'KEY_JWT_SECRET',
      signOptions: { expiresIn: '1d' },
    }),
    NatsClientModule
  ],
  providers: [AuthService, JwtService],
  controllers: [AuthController],
})
export class AuthModule { }

