import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserAdminDto } from './dto/update-useradmin.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from './decorators/user.decorator';
import { UpdateOtherUserDto } from './dto/update-otheruser.dto';
import { User } from './Schemas/user.schema';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/login')
  @HttpCode(200)
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
  async create(@Body() body: CreateUserDto): Promise<User> {
    return await this.userService.create(body);
  }

  @Get('/getAll')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async getAll() {
    return await this.userService.findAll();
  }

  @Post('/logout')
  @HttpCode(200)
  async userLogout() {
    return await this.userService.logOut();
  }

  @Get('/whoami')
  getMyProfile() {
    return this.userService.whoAmI();
  }
  @Patch('/updateOwn')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async updateOwn(@Body() body: Partial<UpdateUserAdminDto>) {
    return await this.userService.updateOwnAdminProfile(body);
  }

  @Patch('/updateStaffItsProfile')
  @UseGuards(RolesGuard)
  @Roles('STAFF')
  async updateOthers(@Body() body: UpdateOtherUserDto) {
    return await this.userService.updateOther(body);
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
