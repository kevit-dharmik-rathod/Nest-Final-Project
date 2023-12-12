import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserAdminDto } from './dto/update-useradmin.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from './decorators/user.decorator';
import { UpdateOtherUserDto } from './dto/update-otheruser.dto';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/login')
  async userLogin(@Body() credentials: LoginUserDto) {
    const user = await this.userService.loginUser(
      credentials.email,
      credentials.password,
    );
    return user;
  }

  @Post('/add')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async create(@Body() body: CreateUserDto) {
    return await this.userService.create(body);
  }

  @Get('/getAll')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async getAll() {
    return await this.userService.findAll();
  }

  @Post('/logout')
  async userLogout() {
    return await this.userService.logOut();
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  findAll() {
    return this.userService.findAll();
  }

  @Get('/whoami')
  getMyProfile() {
    return this.userService.whoAmI();
  }
  @Patch('/updateOwn')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async updateOwn(@Body() body: UpdateUserAdminDto) {
    return await this.userService.updateOwnAdminProfile(body);
  }

  @Patch('/updateOthers/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async updateOthers(
    @Param('id') id: string,
    @Body() body: UpdateOtherUserDto,
  ) {
    return await this.userService.updateOther(id, body);
  }

  @Get('/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Delete('/delete/:id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
