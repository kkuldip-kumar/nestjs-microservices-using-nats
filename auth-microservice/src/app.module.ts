import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserLogin } from './auth/entities/user-logIn.entity';
import { RefreshToken } from './auth/entities/refresh-token.entity';
import { ResetToken } from './auth/entities/reset-token.entity';
import { User } from './auth/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'mysql_db',
      port: 3306,
      username: 'testuser',
      password: 'testuser123',
      database: 'nestjs_db',
      entities: [UserLogin, User, RefreshToken, ResetToken],
      synchronize: true,
    }),
    JwtModule.register({
      secret: 'KEY_JWT_SECRET',
      signOptions: { expiresIn: '1d' },
    }),
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
