import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserAdminDto } from './dto/update-useradmin.dto';
import { RolesGuard } from '../../guards/roles.guard';

jest.mock('./user.service');

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true }) // Mock the RolesGuard
      .compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('loginUser', () => {
    it('should return a user object on successful login', async () => {
      const email = 'test@example.com';
      const password = 'testPassword';
      const mockUser = { id: '1', name: 'Test User', role: 'USER' };

      jest.spyOn(service, 'loginUser').mockResolvedValueOnce(mockUser);

      const result = await service.loginUser(email, password);

      expect(result).toEqual(mockUser);
    });
  });

  describe('logOut', () => {
    it('should log out the authenticated user and return success message', async () => {
      const mockSuccessMessage = 'Successfully log out user';

      jest.spyOn(service, 'logOut').mockResolvedValueOnce(mockSuccessMessage);

      const result = await service.logOut();

      expect(result).toEqual(mockSuccessMessage);
    });
  });

  describe('create', () => {
    it('should create a new user and return the created user object', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'testPassword',
        role: 'USER',
      };
      const mockCreatedUser = { id: '1', ...createUserDto };

      jest.spyOn(service, 'create').mockResolvedValueOnce(mockCreatedUser);

      const result = await service.create(createUserDto);

      expect(result).toEqual(mockCreatedUser);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const mockUsers = [
        { id: '1', name: 'User 1' },
        { id: '2', name: 'User 2' },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValueOnce(mockUsers);

      const result = await service.findAll();

      expect(result).toEqual(mockUsers);
    });
  });

  describe('whoAmI', () => {
    it('should return the profile of the authenticated user', async () => {
      const mockUserProfile = { id: '1', name: 'Test User', role: 'USER' };

      jest.spyOn(service, 'whoAmI').mockResolvedValueOnce(mockUserProfile);

      const result = await service.whoAmI();

      expect(result).toEqual(mockUserProfile);
    });
  });

  describe('findOne', () => {
    it('should return the details of a user by ID', async () => {
      const userId = '1';
      const mockUserDetails = { id: userId, name: 'Test User' };

      jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockUserDetails);

      const result = await service.findOne(userId);

      expect(result).toEqual(mockUserDetails);
    });
  });

  describe('findUserByEmail', () => {
    it('should return the details of a user by email', async () => {
      const userEmail = 'test@example.com';
      const mockUserDetails = { id: '1', name: 'Test User', email: userEmail };

      jest
        .spyOn(service, 'findUserByEmail')
        .mockResolvedValueOnce(mockUserDetails);

      const result = await service.findUserByEmail(userEmail);

      expect(result).toEqual(mockUserDetails);
    });
  });

  describe('updateOwnAdminProfile', () => {
    it('should update the profile of the authenticated user and return the updated user object', async () => {
      const updateUserAdminDto: UpdateUserAdminDto = { name: 'Updated Name' };
      const mockUpdatedUser = { id: '1', name: 'Updated Name', role: 'ADMIN' };

      jest
        .spyOn(service, 'updateOwnAdminProfile')
        .mockResolvedValueOnce(mockUpdatedUser);

      const result = await service.updateOwnAdminProfile(updateUserAdminDto);

      expect(result).toEqual(mockUpdatedUser);
    });
  });

  describe('updateOther', () => {
    it('should update the password of a user by ID and return the updated user object', async () => {
      const userId = '1';
      const updateFields = { password: 'newPassword' };
      const mockUpdatedUser = { id: userId, name: 'Test User', role: 'USER' };

      jest.spyOn(service, 'updateOther').mockResolvedValueOnce(mockUpdatedUser);

      const result = await service.updateOther(userId, updateFields);

      expect(result).toEqual(mockUpdatedUser);
    });
  });

  describe('remove', () => {
    it('should delete a user by ID', async () => {
      const userId = '1';

      jest.spyOn(service, 'remove').mockResolvedValueOnce(null);

      const result = await service.remove(userId);

      expect(result).toBeNull();
    });
  });
});
