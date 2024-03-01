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

  /**
   *
   * @param credentials email and password of user
   * @returns user
   */
  @Post('/login')
  @HttpCode(200)
  async userLogin(@Body() credentials: LoginUserDto) {
    const user = await this.userService.loginUser(
      credentials.email,
      credentials.password,
    );
    return user;
  }

  /**
   *
   * @param body user body with properties
   * @returns user object
   */
  @Post('/add')
  // @UseGuards(RolesGuard)
  // @Roles('ADMIN')
  async create(@Body() body: CreateUserDto): Promise<User> {
    return await this.userService.create(body);
  }

  /**
   *
   * @returns all users array
   */
  @Get('/getAll')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async getAll() {
    return await this.userService.findAll();
  }

  /**
   *
   * @returns string message of logout
   */
  @Post('/logout')
  @HttpCode(200)
  async userLogout() {
    return await this.userService.logOut();
  }

  /**
   *
   * @returns user object
   */
  @Get('/whoami')
  getMyProfile() {
    return this.userService.whoAmI();
  }

  /**
   *
   * @param body update own profile
   * @returns user object
   */
  @Patch('/updateOwn')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async updateOwn(@Body() body: Partial<UpdateUserAdminDto>) {
    return await this.userService.updateOwnAdminProfile(body);
  }

  /**
   *
   * @param body update other user their profile only change password body of only password
   * @returns user object
   */
  @Patch('/updateStaffItsProfile')
  @UseGuards(RolesGuard)
  @Roles('STAFF')
  async updateOthers(@Body() body: UpdateOtherUserDto) {
    return await this.userService.updateOther(body);
  }

  /**
   *
   * @param id user id
   * @returns user object
   */
  @Get('/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  /**
   *
   * @param id user id
   * @returns user object
   */
  @Delete('/delete/:id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
