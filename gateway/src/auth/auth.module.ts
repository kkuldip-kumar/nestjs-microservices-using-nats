import { Module, forwardRef } from '@nestjs/common';
// import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { NatsClientModule } from 'src/nats-client/nats-client.module';
@Module({
  imports: [
    forwardRef(() => UsersModule),
    NatsClientModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'KEY_JWT_SECRET',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [JwtStrategy,],
  controllers: [AuthController],
})
export class AuthModule { }

