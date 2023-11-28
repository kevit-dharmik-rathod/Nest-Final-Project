import { Injectable, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(private userService: UserService) { }
    async addUser(user: CreateUserDto) {
        const checkUsers = await this.userService.findUserByEmail(user.email);
        if (checkUsers) {
            throw new BadRequestException('Email already in use');
        }
        const { password } = user; 
        // Hash the users password
        // Generate a salt
        const salt = randomBytes(8).toString('hex');

        // Hash the salt and the password together
        const hash = (await scrypt(password, salt, 32)) as Buffer;

        // Join the hashed result and the salt together
        const result = salt + '.' + hash.toString('hex');

        // Create a new user and save it
        user.password = result;
        const createUser = await this.userService.create(user);
        // return the user
        return user;
    }
}
