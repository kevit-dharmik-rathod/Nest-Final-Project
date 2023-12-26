import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UpdateOtherUserDto } from './dto/update-otheruser.dto';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { User, userSchema } from './Schemas/user.schema';
import { Admin, staffOne, staffTwo } from '../../../testStubs/testing.stubs';
import { LoginUserDto } from './dto/login-user.dto';
import { Model } from 'mongoose';

describe('UserController', () => {
  let userModel: Model<User>;
  let controller: UserController;
  let service: UserService;
  let user: User;
  beforeAll(async () => {
    process.env.NEST_ENV = 'test';
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env',
          isGlobal: true,
        }),
        MongooseModule.forRoot(process.env.TEST_MONGODB_URL, {
          dbName: process.env.TEST_MONGODB_DB_NAME,
        }),
        MongooseModule.forFeature([{ name: 'User', schema: userSchema }]),
      ],
      providers: [UserService],
      controllers: [UserController],
    }).compile();
    userModel = module.get<Model<User>>(getModelToken(User.name));
    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
    await service.create(staffOne);
    await service.clearUser();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('create new user', () => {
    it('should be create new user', async () => {
      const user = await controller.create(staffTwo);
      expect(user).not.toBeNull();
    });
  });
  describe('should returned all the users', () => {
    it('should return all the users', async () => {
      const users: User[] = await controller.getAll();
      expect(users).toBeInstanceOf(Array);
    });
  });

  describe('login user', () => {
    it('should be able to login', async () => {
      const data: LoginUserDto = {
        email: 'staff2@gmail.com',
        password: '123',
      };
      const user = await controller.userLogin(data);
      const { _id, role } = await userModel.findOne({
        email: 'staff2@gmail.com',
      });
      service.setUserObj({ _id, role });
      expect(user.authToken).not.toBeNull();
      expect(user.authToken).toBeDefined();
    });
  });

  describe('Read profile', () => {
    it('should be return user profile', async () => {
      const user: User = await controller.getMyProfile();
      expect(user).not.toBeNull();
    });
  });

  describe('update own', () => {
    it('should be updateOwn profile', async () => {
      const data = { name: 'newstaff2', mobileNumber: 1234 };
      const newUser: User = await controller.updateOwn(data);
      expect(newUser).not.toBeNull();
    });
  });

  describe('update other their profile', () => {
    it('should be updateOther their profile', async () => {
      const data = { password: 'staff1' };
      const user = await userModel.findOne({
        email: 'staff2@gmail.com',
      });
      const newUser: User = await controller.updateOthers(data);
      expect(newUser).not.toBeNull();
    });
  });

  describe('logout user', () => {
    it('should log out user and authToken should be undefined', async () => {
      const result: String = await controller.userLogout();
      expect(result).toBe('Successfully log out user');
      service.setUserObj({});
      expect(service.getUserObj()).toStrictEqual({});
    });
  });

  describe('remove the user', () => {
    it('should be deleted the user', async () => {
      const user = await userModel.findOne({
        email: 'staff2@gmail.com',
      });
      const temp: User = await controller.remove(user.id);
      expect(await userModel.findOne({ email: 'staff2@gmail.com' })).toBeNull();
    });
  });
});
