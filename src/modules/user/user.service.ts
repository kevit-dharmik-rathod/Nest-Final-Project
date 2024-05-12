import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as mongoose from 'mongoose';
import { User } from './Schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import { UserObject } from '../../interfaces/user-secret.interface';
import { UpdateUserAdminDto } from './dto/update-useradmin.dto';
const jwt = require('jsonwebtoken');
const scrypt = promisify(_scrypt);

@Injectable()
export class UserService {
  private userObj: object;
  setUserObj(userObj: object) {
    this.userObj = userObj;
  }
  getUserObj() {
    return this.userObj;
  }
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectModel(User.name) private userModel: mongoose.Model<User>,
  ) {}

  /**
   *
   * @param email of user
   * @param password of user
   * @returns user object
   */
  async loginUser(email: string, password: string): Promise<User> {
    try {
      if (!email || !password) {
        throw new BadRequestException('Email or password is missing');
      }
      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw new BadRequestException("User doesn't exist");
      }
      const [salt, storedHash] = user.password.split('.');
      const hash = (await scrypt(password, salt, 32)) as Buffer;
      if (storedHash !== hash.toString('hex')) {
        throw new BadRequestException('password is incorrect');
      }
      // const filePath = join(__dirname, '../../../keys/Private.key');
      // if (!fs.existsSync(filePath)) {
      //   throw new Error(`File not found: ${filePath}`);
      // }
      // const fileData = fs.readFileSync(filePath, 'utf-8');

      // Display or process the file data
      const token = jwt.sign(
        { id: user.id.toString(), role: user.role },
        process.env.JWT_AUTH_SECRET,
      );
      user.authToken = token;
      await user.save();
      return user;
    } catch (err) {
      this.logger.error(`error in login: ${err}`);
      throw err;
    }
  }

  /**
   *
   * @returns logout message
   */
  async logOut(): Promise<String> {
    try {
      //_id instead of id for time of controller testing
      // const { _id } = this.userObj as UserObject;
      // const user = await this.userModel.findById(_id);

      //for testing purpose
      const { id } = this.userObj as UserObject;
      const user = await this.userModel.findById(id);
      if (!user) {
        throw new BadRequestException('user not found');
      }
      user.authToken = undefined;
      await user.save();
      return 'Successfully log out user';
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * @param user user dto with body
   * @returns user object
   */
  async create(user: CreateUserDto): Promise<User> {
    try {
      const newUser = await this.userModel.create(user);
      const tempPassword = newUser.password;
      const salt = randomBytes(8).toString('hex');
      const hash = (await scrypt(tempPassword, salt, 32)) as Buffer;
      const result = salt + '.' + hash.toString('hex');
      newUser.password = result;
      await newUser.save();
      return newUser;
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * @returns users array
   */
  async findAll(): Promise<User[]> {
    try {
      const result = await this.userModel.find({});
      return result;
    } catch (err) {
      throw err;
    }
  }

  /**
   *
   * @returns login user profile
   */
  async whoAmI(): Promise<User> {
    try {
      //_id instead of id for time of controller testing
      // const { _id } = this.userObj as UserObject;
      // const user = await this.userModel.findById(_id);

      //for testing purpose
      const { id } = this.userObj as UserObject;
      const user = await this.userModel.findById(id);
      if (!user) {
        throw new BadRequestException('User not found');
      }
      return user;
    } catch (err) {
      throw err;
    }
  }

  /**
   *
   * @param id of user
   * @returns user object
   */
  async findOne(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  /**
   *
   * @param email of user
   * @returns user find by it's email
   */
  async findUserByEmail(email: string) {
    try {
      return await this.userModel.findOne({ email });
    } catch (err) {
      throw err;
    }
  }

  /**
   *
   * @param updateUser body of properties which admin want to change
   * @returns user object
   */
  async updateOwnAdminProfile(
    updateUser: Partial<UpdateUserAdminDto>,
  ): Promise<User> {
    try {
      //_id instead of id for time of controller testing
      // const { _id } = this.userObj as UserObject;
      // const user = await this.userModel.findById(_id);

      const { id } = this.userObj as UserObject;
      const user = await this.userModel.findById(id);
      if (!user) {
        throw new BadRequestException('User not found');
      }
      Object.assign(user, updateUser);
      if (updateUser.hasOwnProperty('password')) {
        const salt = randomBytes(8).toString('hex');
        const hash = (await scrypt(updateUser['password'], salt, 32)) as Buffer;
        const result = salt + '.' + hash.toString('hex');
        user.password = result;
      }
      await user.save();
      return user;
    } catch (err) {
      throw err;
    }
  }

  /**
   *
   * @param body of only password property
   * @returns user object
   */
  async updateOther(body: object): Promise<User> {
    try {
      const { id } = this.userObj as UserObject;
      const user = await this.userModel.findById(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const salt = randomBytes(8).toString('hex');
      const hash = (await scrypt(body['password'], salt, 32)) as Buffer;
      const result = salt + '.' + hash.toString('hex');
      user.password = result;
      await user.save();
      return user;
    } catch (err) {
      throw err;
    }
  }

  /**
   *
   * @param id user id
   * @returns delete acknowledgement
   */
  async remove(id: string) {
    try {
      return await this.userModel.findByIdAndDelete(id);
    } catch (err) {
      throw err;
    }
  }

  /**
   *
   * @returns delete all users and return delete acknowledgement
   */
  async clearUser() {
    try {
      const result = await this.userModel.deleteMany({
        role: { $ne: 'ADMIN' },
      });
      return result;
    } catch (err) {
      throw err;
    }
  }
}
