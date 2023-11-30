import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/user.decorator';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,private readonly authService: AuthService) {}

  @Post('/login')
  async userLogin(@Body() credentials: LoginUserDto) {
    const user = await this.userService.loginUser(credentials.email, credentials.password);
    return user;
  }

  @Post('/add')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'STAFF')
  async create(@Body() body: CreateUserDto) {
    return await this.authService.addUser(body);
  }


  @Post('/logout')
  async userLogout() {
    return await this.userService.logOut();
  } 
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
