import { Test, TestingModule } from '@nestjs/testing';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { LoginStudentDto } from './dto/login-student.dto';
import { UpdateStudentPasswordDto } from './dto/update-student-password.dto';
import { UpdateStudentOtherFields } from './dto/update-student-fields.dto';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../user/decorators/user.decorator';

jest.mock('./student.service');

describe('StudentController', () => {
  let controller: StudentController;
  let studentService: StudentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentController],
      providers: [StudentService],
    })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true }) // Mock the RolesGuard
      .compile();

    controller = module.get<StudentController>(StudentController);
    studentService = module.get<StudentService>(StudentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('studentLogin', () => {
    it('should return a student object on successful login', async () => {
      const loginDto: LoginStudentDto = {
        email: 'test@example.com',
        password: 'testPassword',
      };
      const mockStudent = { id: '1', name: 'Test Student', role: 'STUDENT' };

      jest.spyOn(studentService, 'login').mockResolvedValueOnce(mockStudent);

      const result = await controller.studentLogin(loginDto);

      expect(result).toEqual(mockStudent);
    });
  });

  describe('create', () => {
    it('should create a new student and return the created student object', async () => {
      const createStudentDto: CreateStudentDto = {
        name: 'Test Student',
        email: 'test@example.com',
        role: 'STUDENT',
        mobileNumber: 1234567890,
        password: 'testPassword',
        department: 'departmentId',
        sem: '1',
        authToken: 'sampleAuthToken',
      };
      const mockCreatedStudent = { id: '1', ...createStudentDto };

      jest
        .spyOn(studentService, 'create')
        .mockResolvedValueOnce(mockCreatedStudent);

      const result = await controller.create(createStudentDto);

      expect(result).toEqual(mockCreatedStudent);
    });
  });

  describe('findAll', () => {
    it('should return an array of students', async () => {
      const mockStudents = [
        { id: '1', name: 'Student 1' },
        { id: '2', name: 'Student 2' },
      ];

      jest.spyOn(studentService, 'findAll').mockResolvedValueOnce(mockStudents);

      const result = await controller.findAll();

      expect(result).toEqual(mockStudents);
    });
  });

  describe('whoami', () => {
    it('should return the profile of the authenticated student', async () => {
      const mockStudentProfile = {
        id: '1',
        name: 'Test Student',
        role: 'STUDENT',
      };

      jest
        .spyOn(studentService, 'showMyProfile')
        .mockResolvedValueOnce(mockStudentProfile);

      const result = await controller.whoami();

      expect(result).toEqual(mockStudentProfile);
    });
  });

  describe('studentLogout', () => {
    it('should log out the authenticated student and return success message', async () => {
      const mockSuccessMessage = 'Student logout successfully';

      jest
        .spyOn(studentService, 'logout')
        .mockResolvedValueOnce(mockSuccessMessage);

      const result = await controller.studentLogout();

      expect(result).toEqual(mockSuccessMessage);
    });
  });

  describe('updateMyProfile', () => {
    it('should update the password of the authenticated student and return success message', async () => {
      const updatePasswordDto: UpdateStudentPasswordDto = {
        password: 'newPassword',
      };
      const mockSuccessMessage = 'Password updated successfully';

      jest
        .spyOn(studentService, 'updateMyPassword')
        .mockResolvedValueOnce(mockSuccessMessage);

      const result = await controller.updateMyProfile(updatePasswordDto);

      expect(result).toEqual(mockSuccessMessage);
    });
  });

  describe('findOne', () => {
    it('should return the details of a student by ID', async () => {
      const studentId = '1';
      const mockStudentDetails = { id: studentId, name: 'Test Student' };

      jest
        .spyOn(studentService, 'findOne')
        .mockResolvedValueOnce(mockStudentDetails);

      const result = await controller.findOne(studentId);

      expect(result).toEqual(mockStudentDetails);
    });
  });

  describe('update', () => {
    it('should update the details of a student by ID and return success message', async () => {
      const studentId = '1';
      const updateFields: UpdateStudentOtherFields = { name: 'Updated Name' };
      const mockSuccessMessage = 'department updated successfully';

      jest
        .spyOn(studentService, 'update')
        .mockResolvedValueOnce(mockSuccessMessage);

      const result = await controller.update(studentId, updateFields);

      expect(result).toEqual(mockSuccessMessage);
    });
  });

  describe('remove', () => {
    it('should delete a student by ID and return success message', async () => {
      const studentId = '1';
      const mockSuccessMessage = 'student deleted successfully';

      jest
        .spyOn(studentService, 'remove')
        .mockResolvedValueOnce(mockSuccessMessage);

      const result = await controller.remove(studentId);

      expect(result).toEqual(mockSuccessMessage);
    });
  });
});
