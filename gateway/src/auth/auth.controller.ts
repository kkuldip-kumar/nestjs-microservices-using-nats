import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Post, Put, Req, UseGuards } from '@nestjs/common';
// import { AuthService } from './auth.service';
import { SignupDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';
import { RefreshTokenDto } from './dtos/refresh-tokens.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { RequestModel } from '@/middleware/auth.middleware';
import { AuthGuard } from '@/gaurds/auth.guard';
import { ClientProxy } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
    // constructor(
    //     private readonly authService: AuthService,
    // ) { }
    constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) { }

    @Post('signup')
    async signUp(@Body() signupData: SignupDto) {
        return this.natsClient.send({ cmd: 'user-signup' }, signupData)
        // return this.authService.signup(signupData);
    }

    @Post('login')
    async login(@Body() credentials: LoginDto) {
        return this.natsClient.send({ cmd: 'user-login' }, credentials)
    }

    @Get('verify')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    getCurrentUser(@Req() req: RequestModel) {
        const user = req.user;
        return { user };
    }

    @Post('refresh-token')
    async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
        return this.natsClient.send({ cmd: 'refresh-token' }, refreshTokenDto.refreshToken)
        // return this.authService.refreshTokens(refreshTokenDto.refreshToken);
    }

    @Post('change-password')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    async changePassword(
        @Body() changePasswordDto: ChangePasswordDto,
        @Req() req: RequestModel
    ) {
        return this.natsClient.send({ cmd: 'change-password' }, changePasswordDto)
        // return this.authService.changePassword(
        //     req.user.id,
        //     changePasswordDto.oldPassword,
        //     changePasswordDto.newPassword,
        // );
    }

    @Post('forgot-password')
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        return this.natsClient.send({ cmd: 'forgot-password' }, forgotPasswordDto);
        // return this.authService.forgotPassword(forgotPasswordDto.email);
    }

    @Post('reset-password')
    // @UseGuards(JwtAuthGuard)
    async resetPassword(
        @Body() resetPasswordDto: ResetPasswordDto,
    ) {
        return this.natsClient.send({ cmd: 'reset-password' }, resetPasswordDto)
        // return this.authService.resetPassword(
        //     resetPasswordDto.newPassword,
        //     resetPasswordDto.resetToken,
        // );
    }

}
