// import { Module, forwardRef } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { AuthController } from './auth.controller';
// import { RefreshToken } from './entities/refresh-token.entity';
// import { ResetToken } from './entities/reset-token.entity';
// import { UserLogin } from './entities/user-logIn.entity';
// import { JwtModule, JwtService } from '@nestjs/jwt';
// import { NatsClientModule } from 'src/nats-client/nats-client.module';
// import { ConfigModule, ConfigService } from '@nestjs/config';

// @Module({
//   imports: [
//     ConfigModule.forRoot({ isGlobal: true }),
//     TypeOrmModule.forFeature([UserLogin, RefreshToken, ResetToken]),
//     JwtModule.registerAsync({
//       imports: [ConfigModule],
//       useFactory: async (configService: ConfigService) => {
//         const secret = configService.get<string>('JWT_SECRET');
//         console.log('JwtModule useFactory - JWT_SECRET:', secret);
//         if (!secret) {
//           throw new Error('JWT_SECRET is not defined in the environment variables');
//         }
//         return {
//           secret: secret,
//           signOptions: { expiresIn: '1d' },
//         };
//       },
//       inject: [ConfigService],
//     }),
//     NatsClientModule,
//   ],
//   providers: [
//     AuthService,
//     JwtService,
//     {
//       provide: 'TEST_TOKEN',
//       useFactory: (jwtService: JwtService, configService: ConfigService) => {
//         console.log('Attempting to create test token');
//         const secret = configService.get<string>('JWT_SECRET');
//         console.log('TEST_TOKEN useFactory - JWT_SECRET:', secret);
//         try {
//           const token = jwtService.sign({ test: 'payload' }, { secret: secret });
//           console.log('Test token created successfully');
//           return token;
//         } catch (error) {
//           console.error('Error creating test token:', error);
//           throw error;
//         }
//       },
//       inject: [JwtService, ConfigService],
//     },
//   ],
//   controllers: [AuthController],
// })
// export class AuthModule {}
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { RefreshToken } from './entities/refresh-token.entity';
import { ResetToken } from './entities/reset-token.entity';
import { UserLogin } from './entities/user-logIn.entity';
import { JwtModule } from '@nestjs/jwt';
import { NatsClientModule } from 'src/nats-client/nats-client.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forFeature([UserLogin, RefreshToken, ResetToken]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        console.log('JwtModule useFactory - JWT_SECRET:', secret);
        if (!secret) {
          throw new Error('JWT_SECRET is not defined in the environment variables');
        }
        return {
          secret: secret,
          signOptions: { expiresIn: '1d' },
        };
      },
      inject: [ConfigService],
    }),
    NatsClientModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule { }