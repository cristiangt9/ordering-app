import { PassportStrategy } from '@nestjs/passport';
import { UsersService } from '../users/users.service';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    return await this.usersService.validateUser(email, password);
  }
}
