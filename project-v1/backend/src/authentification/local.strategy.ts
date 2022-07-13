import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthentificationService } from './authentification.service';
import { User } from '../user/user.entity';
 
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authenticationService: AuthentificationService) {
    super({
      usernameField: 'firstName'
    });
  }
  async validate(firstName: string, password: string): Promise<User> {
    console.log('dans validate de localstrategy');
    return this.authenticationService.getAuthentificationUser(firstName, password);
  }
}