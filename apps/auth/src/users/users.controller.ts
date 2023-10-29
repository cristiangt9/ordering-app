import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserRequestDto } from './dto/create-user-request.dto';

@Controller('auth/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() request: CreateUserRequestDto) {
    return await this.usersService.createUser(request);
  }
}
