import { Body, Controller, Get, HttpCode, HttpStatus, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';
import { RefreshTokenDto } from './dtos/refresh-tokens.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }

    @MessagePattern({ cmd: 'user-signup' })
    async signUp(@Payload() signupData: SignupDto) {
        return this.authService.signup(signupData);
    }

    @MessagePattern({ cmd: 'user-login' })
    async login(@Payload() credentials: LoginDto) {
        return this.authService.login(credentials);
    }
    @MessagePattern({ cmd: 'validate-authToken' })
    async authToken(@Payload() token: string) {
        return this.authService.validateToken(token);
    }
    @MessagePattern({ cmd: 'getUserLogin' })
    async getUserLogin(@Payload() token: string) {
        return this.authService.validateUser(token);
    }


    @MessagePattern({ cmd: 'user-token-refresh' })
    async refreshTokens(@Payload() refreshTokenDto: RefreshTokenDto) {
        return this.authService.refreshTokens(refreshTokenDto.refreshToken);
    }

    @MessagePattern({ cmd: 'change-password' })
    async changePassword(
        @Payload() changePasswordDto: ChangePasswordDto,
    ) {
        // req.user.id,
        return this.authService.changePassword('dsfsdf',
            changePasswordDto.oldPassword,
            changePasswordDto.newPassword,
        );
    }


    @MessagePattern({ cmd: 'forgot-password' })
    async forgotPassword(@Payload() forgotPasswordDto: ForgotPasswordDto) {
        return this.authService.forgotPassword(forgotPasswordDto.email);
    }

    @MessagePattern({ cmd: 'reset-password' })
    async resetPassword(
        @Payload() resetPasswordDto: ResetPasswordDto,
    ) {
        return this.authService.resetPassword(
            resetPasswordDto.newPassword,
            resetPasswordDto.resetToken,
        );
    }

}
