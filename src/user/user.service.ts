import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as mongoose from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './Schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import * as fs from 'fs';
import { join } from 'path';
const jwt = require('jsonwebtoken');

const scrypt = promisify(_scrypt);
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: mongoose.Model<User>) { }
  async create(user) {
    return await this.userModel.create(user);
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findUserByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

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
      if(storedHash !== hash.toString('hex')) {
        throw new BadRequestException('password is incorrect');
      }
      const privatekey = fs.readFileSync(join(__dirname,'../../keys/Private.key'));
      const token = jwt.sign({id: user.id, role: user.role}, privatekey, { algorithm : 'RS256'});
      user.authToken = token;
      await user.save();
      return user;
    } catch (err) {
      throw new Error(err);
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

}
