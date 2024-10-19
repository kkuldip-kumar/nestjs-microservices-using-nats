import { BadRequestException, ForbiddenException, HttpException, HttpStatus, Inject, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'
import { SignupDto } from './dtos/signup.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dtos/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { DataSource, EntityManager, MoreThanOrEqual, Repository } from 'typeorm';
import { ResetToken } from './entities/reset-token.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { createHash, randomBytes } from 'crypto';
import { UserLogin } from './entities/user-logIn.entity';
import { ClientProxy } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
    private readonly jwtSecret: string;
    constructor(
        @InjectRepository(UserLogin)
        private userLoginRepo: Repository<UserLogin>,
        @InjectRepository(ResetToken)
        private resetTokenRepo: Repository<ResetToken>,
        @InjectRepository(RefreshToken)
        private refreshTokenRepo: Repository<RefreshToken>,
        private jwtService: JwtService,
        private dataSource: DataSource,
        @Inject('NATS_SERVICE') private natsClient: ClientProxy,
        private configService: ConfigService
    ) {
        this.jwtSecret = this.configService.get<string>('JWT_SECRET');
        console.log('AuthService constructor - JWT_SECRET:', this.jwtSecret);
        console.log('JwtService options:', this.jwtService['options']);

        // Attempt to set the secret if it's not already set
        if (!this.jwtService['options'].secret) {
            console.log('Setting JwtService secret in constructor');
            this.jwtService['options'].secret = this.jwtSecret;
        }
    }

    generateResetToken(): string {
        const randomToken = randomBytes(32).toString('hex');
        const token = createHash('sha256').update(randomToken).digest('hex');
        return token;
    }

    async generateJwt(user: any): Promise<string> {
        return this.jwtService.signAsync({ user });
    }

    async hashPassword(password: string): Promise<string> {
        const result = await bcrypt.hash(password, 12);
        return result;
    }

    async comparePasswords(password: string, storedPasswordHash: string): Promise<any> {
        const result = await bcrypt.compare(password, storedPasswordHash);
        return result;
    }

    async validateToken(token: string) {
        try {
            const value = await this.jwtService.verifyAsync(token, {
                secret: this.jwtSecret,
            });

            return value; // Token is valid
        } catch (error) {
            // Handle invalid or expired token
            if (error.name === 'TokenExpiredError') {
                throw new UnauthorizedException('Token has expired');
            } else if (error.name === 'JsonWebTokenError') {
                throw new UnauthorizedException('Invalid token');
            } else {
                throw new UnauthorizedException('Unable to authenticate token');
            }
        }
    }

    async validateUser(id): Promise<any> {
        const user = await this.userLoginRepo.findOneBy({ id: id });
        // if (user && user.password === pass) {
        //     const { password, ...result } = user;
        //     return user;
        // }
        if (user) {
            return user;
        }
        return null;
    }
    async signup(signupData: SignupDto) {
        const { email, password, name } = signupData;

        try {
            return this.dataSource.transaction(async (transactionalEntityManager: EntityManager) => {

                // Check if email is in use
                const emailInUse = await this.userLoginRepo.findOneBy({ email });
                if (emailInUse) {
                    throw new BadRequestException('Email already in use');
                }

                // Hash password
                const hashedPassword = await bcrypt.hash(password, 10);

                // Create a new user object to send to the microservice
                const newUser = {
                    username: name,
                    displayName: name,
                    email: email,
                };

                // Send user data to the NATS microservice to create a user
                let user;
                try {
                    user = await lastValueFrom(
                        this.natsClient.send({ cmd: 'createUser' }, newUser).pipe(
                            retry(3), // Retry up to 3 times
                            catchError((error) => {
                                console.error('Microservice failed after retries:', error);
                                throw new InternalServerErrorException('Microservice is unavailable');
                            }),
                        ),
                    );
                } catch (error) {
                    console.error('Error from NATS microservice:', error);

                    // Handle NATS error response here
                    if (error && error.status === 'error') {
                        throw new BadRequestException(error.message || 'Signup failed');
                    }

                    throw new InternalServerErrorException('Failed to communicate with microservice');
                }

                // Prepare the user login details to save in the local database
                const newUserLogin = this.userLoginRepo.create({
                    name,
                    email,
                    password: hashedPassword,
                    user,  // Relate UserLogin with User
                });

                // Save the new user login in the database
                return transactionalEntityManager.save(newUserLogin);
            });
        } catch (error) {
            // Handle known error (like BadRequestException) gracefully
            if (error instanceof BadRequestException) {
                return {
                    status: 'error',
                    message: error.message,
                };
            }

            // Log unexpected errors and throw an InternalServerError
            console.error('Unexpected error during signup:', error);
            throw new InternalServerErrorException('Signup failed due to an unexpected error');
        }
    }


    async login(credentials: LoginDto) {
        const { email, password } = credentials;
        //Find if user exists by email
        const secret = this.configService.get<string>('JWT_SECRET');
        console.log('AuthService login - JWT_SECRET:', secret);
        try {
            const user = await this.userLoginRepo.findOneBy({ email });
            const userLogin = await this.userLoginRepo.findOne({
                where: { email },
                relations: ['user'],
            });
            if (!userLogin) {
                throw new UnauthorizedException('Wrong credentials');
            }

            //Compare entered password with existing password
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                throw new UnauthorizedException('Wrong credentials');
            }
            console.log(user)
            //Generate JWT tokens
            const { password: savedPassword, ...rest } = user
            const tokens = this.generateUserTokens(rest);
            return {
                ...tokens,
                userId: user.id,
            };
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    }



    async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
        // Find the user by ID
        try {

            const user = await this.userLoginRepo.findOne({ where: { id: userId } });
            if (!user) {
                throw new NotFoundException('User not found...');
            }

            // Compare the old password with the password in DB
            const passwordMatch = await bcrypt.compare(oldPassword, user.password);
            if (!passwordMatch) {
                throw new UnauthorizedException('Wrong credentials');
            }

            // Hash the new password
            const newHashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = newHashedPassword;

            // Save the updated user
            await this.userLoginRepo.save(user);
        } catch (error) {
            console.error('Error during Change password:', error);
            throw error;
        }
    }

    async forgotPassword(email: string) {
        try {

            const user = await this.userLoginRepo.findOneBy({ email });

            if (user) {
                //If user exists, generate password reset link
                const expiryDate = new Date();
                expiryDate.setHours(expiryDate.getHours() + 1);

                const token = this.generateResetToken()

                // const resetToken = nanoid(64);
                const resetTokenEntity = this.resetTokenRepo.create({
                    token: token,
                    user,
                    expiryDate,
                });

                await this.resetTokenRepo.save(resetTokenEntity);
                //Send the link to the user by email
                const emailData = {
                    user: { email: 'kkuldip836@gmail.com', name: 'Kuldip Kumar' },
                    token: token
                }
                // this.eventEmitter.emit(
                //     'reset.password',
                //     new EmailEvent(emailData),
                // );
            }

            return { message: 'If this user exists, they will receive an email' };
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.FORBIDDEN,
                error: 'Error during forgot password',
            }, HttpStatus.FORBIDDEN, {
                cause: error
            });
        }

    }

    async resetPassword(newPassword: string, token: string) {

        try {
            const foundToken = await this.resetTokenRepo.findOne({ where: { token: token }, relations: ['user'], });
            if (!foundToken || new Date() > foundToken.expiryDate) {
                throw new UnauthorizedException('Invalid or expired reset token');
            }

            await this.resetTokenRepo.delete(foundToken.id);


            const user = await this.userLoginRepo.findOneBy({ id: foundToken.user.id });

            if (!user) {
                throw new InternalServerErrorException('User not found');
            }


            user.password = await bcrypt.hash(newPassword, 10);
            await this.userLoginRepo.save(user);

            return { message: 'Password has been successfully reset' };

        } catch (error) {
            console.error('reset password:', error);
            throw error;
        }
    }



    async refreshTokens(refreshTokenValue: string) {
        try {

            const token = await this.refreshTokenRepo.findOne({
                where: { token: refreshTokenValue, expiryDate: MoreThanOrEqual(new Date()) },
                relations: ['user'],
            });

            if (!token) {
                throw new UnauthorizedException('Refresh token is invalid or expired');
            }

            const {
                accessToken,
                refreshToken,
            } = this.generateUserTokens(token.user);
            // Save the new refresh token
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 7); // Set expiry to 7 days

            const newRefreshToken = this.refreshTokenRepo.create({
                token: refreshToken,
                user: { id: token.user.id },
                expiryDate,
            });

            return this.refreshTokenRepo.save(newRefreshToken);
        } catch (error) {
            console.error('Error refresh token:', error);
            throw error;
        }
    }

    private generateUserTokens(userId: any) {
        const payload = { sub: userId };
        const accessToken = this.jwtService.sign(payload, { expiresIn: '1d' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
        return {
            accessToken,
            refreshToken,
        };
    }
}
