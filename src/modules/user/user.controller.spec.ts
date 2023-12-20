import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UpdateOtherUserDto } from './dto/update-otheruser.dto';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from './Schemas/user.schema';
import { Admin, staffOne, staffTwo } from '../../../testStubs/testing.stubs';

describe('UserController', () => {
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
    });
  });
  describe('should returned all the users', () => {
    it('should return all the users', async () => {
      const users: User[] = await controller.getAll();
      console.log(users);
    });
  });
});
