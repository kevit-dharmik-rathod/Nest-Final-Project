import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserAdminDto } from './dto/update-useradmin.dto';
import { RolesGuard } from '../../guards/roles.guard';
import { NotFoundException } from '@nestjs/common';
import { Admin } from '../../../testStubs/testing.stubs';
import { User, userSchema } from './Schemas/user.schema';

describe('userService', () => {
  let service: UserService;
  let user: User;

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
        MongooseModule.forFeature([{ name: 'User', schema: userSchema }])
      ],
      providers: [UserService],
    }).compile();
    service = module.get<UserService>(UserService);
    await service.clearUser();
    user = await service.create(Admin);
  });
  it('should be defined ', () => {
    expect(service).toBeDefined();
  });

})
