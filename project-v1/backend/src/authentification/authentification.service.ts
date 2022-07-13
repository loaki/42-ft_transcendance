import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import PostgresErrorCode from '../database/postgresErrorCode.enum';
import RegisterDto from './create-register.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import TokenPayload from './tokenPayload.interface';
 
@Injectable()
export class AuthentificationService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {}

    public async register(registrationData: RegisterDto) {
        console.log('dans register service authentification ');
        const hasedPassword = await bcrypt.hash(registrationData.password, 10);
        try {
            const createdUser = await this.userService.create({
                ...registrationData,
                password: hasedPassword
            });
            createdUser.password = undefined; // lame astuce
            return createdUser;
        } catch (error) {
            if (error?.code === PostgresErrorCode.UniqueViolation) {
                throw new HttpException('User withthat email ???? already exists', HttpStatus.BAD_REQUEST);
            }
            throw new HttpException('Somethign went wrong lol', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

        // test with firstName
    public async getAuthentificationUser(firstName: string, hashedPassword: string) {
        try {
            console.log('merde ');
            const user = await this.userService.findUserByfirstName(firstName);
            console.log('avant verifupassword ');
            console.log('user password = ' + user.password + ' et hash = ' + hashedPassword);
            await this.verifyPassword(hashedPassword, user.password);
            // await this.verifyPassword('password', 'password');
            console.log('apres verify password');
            user.password = undefined;
            return (user);
        } catch (error) { //don't find firstname // need email
            throw new HttpException('Wrong credentials provided password 2 email', HttpStatus.BAD_REQUEST);
        }
    }

        // function to check password
    private async verifyPassword(plainTextPassword: string, hasedPassword: string) {
        const isPasswordMatching = await bcrypt.compare(
            plainTextPassword,
            hasedPassword
        )
        console.log(' dans verify : ispasswordmatching = ' + isPasswordMatching);
        if (!isPasswordMatching) {
            throw new HttpException('Wrong credentials prividaed password', HttpStatus.BAD_REQUEST);
        }
        console.log('password good');
    }

    public getCookieWithJwtToken(userId: string) {
        const payload: TokenPayload = { userId };
        const token = this.jwtService.sign(payload);
        console.log('token = ' + token);
        return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}`;
    }
}
