import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { UsersRepository } from './users.repository';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(request: CreateUserRequestDto) {
    await this.validateCreateUserRequest(request);
    const user = await this.usersRepository.create({
      ...request,
      password: await bcrypt.hash(request.password, 10),
    });
    return user;
  }

  private async validateCreateUserRequest(request: CreateUserRequestDto) {
    let user: User;
    try {
      user = await this.usersRepository.findOne({
        email: request.email,
      });
    } catch (error) {
      if (user) {
        throw new UnprocessableEntityException('Email already exists');
      }
    }
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credential are not valid');
    }
    return user;
  }

  async getUser(getUserArgs: Partial<User>) {
    return await this.usersRepository.findOne(getUserArgs);
  }
}
