import { Body, Controller, Delete, Get, Patch, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './dto/user';
import { UpdateUserInput } from './dto/update-user.input';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body('input') input: CreateUserInput): Promise<User> {
    return this.userService.create(input);
  }

  @Get()
  get(@Query('id') id: string): Promise<User | null> {
    return this.userService.get(id);
  }

  @Patch()
  update(@Body('input') input: UpdateUserInput): Promise<User> {
    return this.userService.update(input);
  }

  @Delete()
  delete(@Query('id') id: string): Promise<User> {
    return this.userService.delete(id);
  }
}
