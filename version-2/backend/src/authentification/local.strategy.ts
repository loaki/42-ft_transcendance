import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthentificationService } from './authentification.service';
import { User } from '../user/user.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
 
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authenticationService: AuthentificationService) {
    super({
      usernameField: 'caca'
    });
  }
  async validate(login42: string): Promise<User> {
    // throw new HttpException('Wrong credentials provided password 2 email', HttpStatus.BAD_REQUEST);
    console.log('dans validate de localstrategy');
    return this.authenticationService.getAuthentificationUser(login42);
  }
  // async validate(firstName: string, password: string): Promise<User> {
  //   console.log('dans validate de localstrategy');
  //   return this.authenticationService.getAuthentificationUser(firstName, password);
  // }
}