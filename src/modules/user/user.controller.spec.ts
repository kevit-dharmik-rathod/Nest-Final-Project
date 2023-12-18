import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserAdminDto } from './dto/update-useradmin.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RolesGuard } from '../../guards/roles.guard';
import { UpdateOtherUserDto } from './dto/update-otheruser.dto';

jest.mock('./user.service');

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true }) // Mock the RolesGuard
      .compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('userLogin', () => {
    it('should return the user object on successful login', async () => {
      const loginCredentials: LoginUserDto = {
        email: 'test@example.com',
        password: 'testPassword',
      };
      const mockUser = { id: '1', name: 'Test User', role: 'USER' };

      jest.spyOn(userService, 'loginUser').mockResolvedValueOnce(mockUser);

      const result = await controller.userLogin(loginCredentials);

      expect(result).toEqual(mockUser);
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

      jest.spyOn(userService, 'create').mockResolvedValueOnce(mockCreatedUser);

      const result = await controller.create(createUserDto);

      expect(result).toEqual(mockCreatedUser);
    });
  });

  describe('getAll', () => {
    it('should return an array of users', async () => {
      const mockUsers = [
        { id: '1', name: 'User 1' },
        { id: '2', name: 'User 2' },
      ];

      jest.spyOn(userService, 'findAll').mockResolvedValueOnce(mockUsers);

      const result = await controller.getAll();

      expect(result).toEqual(mockUsers);
    });
  });

  describe('userLogout', () => {
    it('should log out the authenticated user and return success message', async () => {
      const mockSuccessMessage = 'Successfully log out user';

      jest
        .spyOn(userService, 'logOut')
        .mockResolvedValueOnce(mockSuccessMessage);

      const result = await controller.userLogout();

      expect(result).toEqual(mockSuccessMessage);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const mockUsers = [
        { id: '1', name: 'User 1' },
        { id: '2', name: 'User 2' },
      ];

      jest.spyOn(userService, 'findAll').mockResolvedValueOnce(mockUsers);

      const result = await controller.findAll();

      expect(result).toEqual(mockUsers);
    });
  });

  describe('getMyProfile', () => {
    it('should return the profile of the authenticated user', async () => {
      const mockUserProfile = { id: '1', name: 'Test User', role: 'USER' };

      jest.spyOn(userService, 'whoAmI').mockResolvedValueOnce(mockUserProfile);

      const result = await controller.getMyProfile();

      expect(result).toEqual(mockUserProfile);
    });
  });

  describe('updateOwn', () => {
    it('should update the profile of the authenticated user and return the updated user object', async () => {
      const updateUserAdminDto: UpdateUserAdminDto = { name: 'Updated Name' };
      const mockUpdatedUser = { id: '1', name: 'Updated Name', role: 'ADMIN' };

      jest
        .spyOn(userService, 'updateOwnAdminProfile')
        .mockResolvedValueOnce(mockUpdatedUser);

      const result = await controller.updateOwn(updateUserAdminDto);

      expect(result).toEqual(mockUpdatedUser);
    });
  });

  describe('updateOthers', () => {
    it('should update the profile of another user and return the updated user object', async () => {
      const userId = '2';
      const updateOtherUserDto: UpdateOtherUserDto = {
        password: 'newPassword',
      };
      const mockUpdatedUser = {
        id: userId,
        name: 'Updated User',
        role: 'USER',
      };

      jest
        .spyOn(userService, 'updateOther')
        .mockResolvedValueOnce(mockUpdatedUser);

      const result = await controller.updateOthers(userId, updateOtherUserDto);

      expect(result).toEqual(mockUpdatedUser);
    });
  });

  describe('findOne', () => {
    it('should return the details of a user by ID', async () => {
      const userId = '1';
      const mockUserDetails = { id: userId, name: 'Test User' };

      jest.spyOn(userService, 'findOne').mockResolvedValueOnce(mockUserDetails);

      const result = await controller.findOne(userId);

      expect(result).toEqual(mockUserDetails);
    });
  });

  describe('remove', () => {
    it('should delete a user by ID', async () => {
      const userId = '1';

      jest.spyOn(userService, 'remove').mockResolvedValueOnce(null);

      const result = await controller.remove(userId);

      expect(result).toBeNull();
    });
  });
});
