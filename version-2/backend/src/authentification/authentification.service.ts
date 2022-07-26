import { HttpException, HttpStatus, Injectable, BadGatewayException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import PostgresErrorCode from '../database/postgresErrorCode.enum';
import { RegisterDto, RegisterAsGuestDTO} from './create-register.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import TokenPayload2Auth from './tokenPayload2Auth.interface';
import TokenPayload from './tokenPayload.interface';
import { AxiosRequestConfig } from 'axios';
import { lastValueFrom, map } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { User } from 'src/user/user.entity';
import { timeStamp } from 'console';
import { Repository } from 'typeorm';



@Injectable()
export class AuthentificationService {
    constructor(
        private httpService: HttpService,
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private configService: ConfigService,

    ) {}

    // Main function to connect a user with 42's API and put hte user in the database
    async register42(code: string, state: string) {
        
        const token = await this.getToken42(code, state);
        const user: Partial<User> = await this.getUser42(token);
        return this.putUser42(user);
    }

    // Make the last Get request to get the user's info from the 42's API
    async getUser42(token: string) {
        const getInfo: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: ` Bearer ${token}`,
            },
        };
        return await lastValueFrom(
            this.httpService
              .get('https://api.intra.42.fr/v2/me', getInfo)
              .pipe(
                map((resp) => {
                  return {
                    login42: resp.data.login,
                    avatar42: resp.data.image_url,
                  };
                }),
              ),
          ).catch((err) => {
            throw new BadGatewayException(err.message);
          });
    }

    // Make the first request to trade the temporary code with the new token from 42's API
    async getToken42(code: string, state: string): Promise<string> {
        const dataPost: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            params: {
                grant_type: 'authorization_code',
                client_id: process.env.CLIEND_ID_42,
                client_secret: process.env.CLIENT_SECRET_42,
                code: code,
                redirect_uri: process.env.CLIENT_REDIRECT_42,
                state: state,
            },
        };

        return await lastValueFrom(
            this.httpService
            .post('https://api.intra.42.fr/oauth/token', null, dataPost)
            .pipe(
                map((resp) => {
                    return resp.data.access_token;
                }),
            ),
        ).catch((err) => {
            throw new BadGatewayException(err.message);
        });
    }

    // Check if the user already exist in the DB, If not, create it.
    async putUser42(user: Partial<User>) {

        const findUser = await this.userService.getLogin42(user.login42);
        if (!findUser)
        {
            console.log('user = ', user);
            const createdUser = await this.userService.create42(user);
            return createdUser;
        }
        return findUser;
    }

    public async registerAsGuest(registrationData: RegisterAsGuestDTO) {

        try {

            const user: Partial<User> = {
                login42: registrationData.login42,
                avatar42: registrationData.avatar42,
            }
            const createdUser = await this.userService.create42(user);
            return createdUser;
        } catch (error) {
            throw new HttpException('Impossible to create user\ guest', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }





    // public async register(registrationData: RegisterDto) {
    //     console.log('dans register service authentification ');
    //     const hasedPassword = await bcrypt.hash(registrationData.password, 10);
    //     try {
    //         const createdUser = await this.userService.create({
    //             ...registrationData,
    //             password: hasedPassword
    //         });
    //         createdUser.password = undefined; // lame astuce
    //         return createdUser;
    //     } catch (error) {
    //         if (error?.code === PostgresErrorCode.UniqueViolation) {
    //             throw new HttpException('User withthat email ???? already exists', HttpStatus.BAD_REQUEST);
    //         }
    //         throw new HttpException('Impossible to create user. Already in db', HttpStatus.INTERNAL_SERVER_ERROR);
    //     }
    // }

        // test with firstName
    public async getAuthentificationUser(login42: string,) {
        try {
            console.log('cherche login 42 ');
            const user = await this.userService.findUserByLogin(login42);
            // console.log('avant verifupassword ');
            // console.log('user password = ' + user.password + ' et hash = ' + hashedPassword);
            // await this.verifyPassword(hashedPassword, user.password);
            // await this.verifyPassword('password', 'password');
            console.log('apres verify password');
            // user.password = undefined;
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


    // register + login
    public getCookieWithJwtToken(userId: string) {
        const payload: TokenPayload = { userId };
        const token = this.jwtService.sign(payload);
        console.log('token = ' + token);
        return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}`;
    }


        // double auth
    public getCookieWithJwtTokenRefresh(userId: string, isSecondFactor = false ) {

        const payload: TokenPayload2Auth = { userId, isSecondFactor };
        const token = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
            expiresIn: `${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}s`
        });
        console.log('token = ' + token);
        return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}`;
    }



    // logout
    public getCookieForLogOut() {
        return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
    }
}
