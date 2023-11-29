import { Injectable, Logger, NotFoundException, Scope } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as mongoose from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './Schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import * as fs from 'fs';
import { ObjectId } from 'mongodb';
import { join } from 'path';
const jwt = require('jsonwebtoken');
const scrypt = promisify(_scrypt);

interface UserObject {
  id: string;
  role: string;
  // Add other properties if needed
}


@Injectable({scope: Scope.REQUEST})
export class UserService {
  private userObj: object;
  setUserObj(userObj: object) {
    this.userObj = userObj;
  }
  private readonly logger = new Logger(UserService.name);
  constructor(@InjectModel(User.name) private userModel: mongoose.Model<User>) { }
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
      const token = jwt.sign({id: user.id.toString(), role: user.role}, privatekey, { algorithm : 'RS256'});
      user.authToken = token;
      await user.save();
      return user;
    } catch (err) {
      throw new Error(err);
    }
  }

  async logOut(): Promise<String> {
   try { 
    console.log(this.userObj);
    const { id, role } = this.userObj as UserObject;
  // console.log(id);
  const user = await this.userModel.findById(id);
  // this.logger.log(user);
  if (!user) {
    throw new BadRequestException("user not found");
  }
  user.authToken = undefined;
  await user.save();
  // this.logger.log(user);
  return 'Successfully log out user';
} catch (error) {
  console.error('Error in logOut:', error);
  throw error; // rethrow the error if needed
}

  }
  async create(user: CreateUserDto) {
    return await this.userModel.create(user);
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id);
    if(!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findUserByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

 

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

}
