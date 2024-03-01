import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserService } from './user.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Admin, staffOne } from '../../../testStubs/testing.stubs';
import { User, userSchema } from './Schemas/user.schema';
import { Model, model } from 'mongoose';

//successfully running all the test case first we have to drop test database one time first create admin and then comment that line and run again all test cases
type updateAdmin = {
  mobileNumber?: number;
  name?: string;
  email?: string;
  password?: string;
  designation?: string;
  department?: string;
  roles?: string;
};
type updateOthers = {
  password?: string;
};
describe('userService', () => {
  let service: UserService;
  let user: User;
  let userModel: Model<User>;
  let token: string;

  beforeAll(async () => {
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
    }).compile();
    service = module.get<UserService>(UserService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
    await service.clearUser();
    // user = await service.create(Admin);
    user = await userModel.findById('6583d37b443d66ed0f42bf06');
    token = user.authToken;
    // console.log(user);
    // console.log(user.authToken);
  });
  it('should be defined ', () => {
    expect(service).toBeDefined();
  });
  describe('create a new user', () => {
    it('should create a new staff member', async () => {
      const user: User = await service.create(staffOne);
      expect(user).not.toBe(null);
    });
  });

  describe('user login ', () => {
    it('should be login and saved authToken in logged user', async () => {
      const { email, id, role } = await userModel.findOne({
        email: 'staff1@gmail.com',
      });
      service.setUserObj({ id, role });
      const user: User = await service.loginUser(email, '123');
      expect(user).toBeDefined();
      expect(user.authToken).toBeDefined();
      expect(user.authToken).not.toBeNull();
    });
  });

  describe('user login with incorrect credentials', () => {
    it('should be throw BadRequestException that password is incorrect', async () => {
      const { email, id, role } = await userModel.findOne({
        email: 'staff1@gmail.com',
      });
      service.setUserObj({ id, role });
      await expect(service.loginUser(email, '1234')).rejects.toThrowError(
        BadRequestException,
      );
    });
  });

  describe('should return all the user', () => {
    it('show all users ', async () => {
      const users: User[] = await service.findAll();
      expect(users.length).toBeGreaterThan(1);
      expect(Array.isArray(users)).toBe(true);
    });
  });

  describe('read my profile', () => {
    it('should return my profile object ', async () => {
      const user = await service.whoAmI();
      expect(user).not.toBeNull();
    });
  });

  describe('user logout ', () => {
    it('should user be logged out and authToken being undefined ', async () => {
      const data = service.getUserObj();
      const result: String = await service.logOut();
      service.setUserObj({});
      expect(result).toBe('Successfully log out user');
      expect(result['authToken']).toBeUndefined();
    });
  });

  describe('read my profile after logout', () => {
    it('should not return user profile ', async () => {
      await expect(service.whoAmI()).rejects.toThrowError('User not found');
    });
  });

  describe('user login ', () => {
    it('should be login and saved authToken in logged user', async () => {
      const { email, id, role } = await userModel.findOne({
        email: 'brook@gmail.com',
      });
      service.setUserObj({ id, role });
      const user: User = await service.loginUser(email, '123');
      expect(user).toBeDefined();
      expect(user.authToken).toBeDefined();
      expect(user.authToken).not.toBeNull();
    });
  });

  describe('admin update it profile', () => {
    it('should be update given properties', async () => {
      const updateData: updateAdmin = {
        mobileNumber: 123456789,
        name: 'updateBrook',
      };
      const tempUser: User = await service.updateOwnAdminProfile(updateData);
      expect(tempUser).not.toBeNull();
      expect(tempUser.mobileNumber).toEqual(123456789);
    });
  });

  describe('update only password if user is other then admin', () => {
    it('should change only password', async () => {
      const updateData: updateOthers = {
        password: '1234',
      };
      const tempUser = await service.findUserByEmail('staff1@gmail.com');
      expect(tempUser).not.toBeNull();
      const newUser = await service.updateOther(updateData);
      expect(newUser).not.toBeNull();
    });
  });

  describe('user logout ', () => {
    it('should user be logged out and authToken being undefined ', async () => {
      const result: String = await service.logOut();
      service.setUserObj({});
      expect(result).toBe('Successfully log out user');
      expect(result['authToken']).toBeUndefined();
    });
  });

  describe('login with old credentials', () => {
    it('should not be able to login because password is changed', async () => {
      const { email } = await userModel.findOne({
        email: 'staff1@gmail.com',
      });
      await expect(service.loginUser(email, '123')).rejects.toThrowError(
        'password is incorrect',
      );
      expect(user.authToken).not.toBeDefined();
      expect(user.authToken).toBeUndefined();
    });
  });

  describe('delete the user', () => {
    it('should be removed user', async () => {
      if (service.getUserObj()['role'] === 'ADMIN') {
        const temp = await userModel.findOne({ email: 'staff1@gmail.com' });
        expect(await service.remove(temp.id));
      }
    });
  });
});
