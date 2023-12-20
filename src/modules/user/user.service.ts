import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  Scope,
} from '@nestjs/common';
import { } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as mongoose from 'mongoose';
import { User } from './Schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import * as fs from 'fs';
import { join } from 'path';
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
  ) { }
  async loginUser(email: string, password: string) {
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
      const privatekey = fs.readFileSync(
        join(__dirname, '../../../keys/Private.key'),
      );
      const token = jwt.sign(
        { id: user.id.toString(), role: user.role },
        privatekey,
        { algorithm: 'RS256' },
      );
      user.authToken = token;
      await user.save();
      return user;
    } catch (err) {
      throw err;
    }
  }

  async logOut(): Promise<String> {
    try {
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

  async create(user: CreateUserDto) {
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

  async findAll(): Promise<User[]> {
    try {
      return await this.userModel.find({});
    } catch (err) {
      throw err;
    }
  }

  async whoAmI(): Promise<User> {
    try {
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

  async findOne(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findUserByEmail(email: string) {
    try {
      return await this.userModel.findOne({ email });
    } catch (err) {
      throw err;
    }
  }

  async updateOwnAdminProfile(updateUser: UpdateUserAdminDto) {
    try {
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

  async updateOther(id: string, body: object): Promise<User> {
    try {
      const user = await this.userModel.findById(id);
      if (!user) {
        throw new BadRequestException('User not found');
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

  async remove(id: string) {
    try {
      return await this.userModel.findByIdAndDelete(id);
    } catch (err) {
      throw err;
    }
  }

  async clearUser() {
    try {
      return await this.userModel.deleteMany({ role: { $ne: 'ADMIN' } });
    } catch (err) {
      throw err;
    }
  }
}
