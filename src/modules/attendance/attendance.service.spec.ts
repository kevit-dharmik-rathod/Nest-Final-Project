import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { StudentService } from '../student/student.service';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dtos/create-attendance.dto';
import { Attendance } from './Schemas/attendance.schema';

describe('AttendanceService', () => {
  let service: AttendanceService;
  let studentService: StudentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttendanceService,
        {
          provide: getModelToken(Attendance.name),
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            findById: jest.fn(),
            deleteMany: jest.fn(),
          },
        },
        {
          provide: StudentService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AttendanceService>(AttendanceService);
    studentService = module.get<StudentService>(StudentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create attendance', async () => {
      const id = new mongoose.Types.ObjectId();
      const createAttendanceDto = {
        studentId: id,
        date: '12 - 12 - 2022',
        isPresent: true,
      };

      const findOneSpy = jest.spyOn(studentService, 'findOne');
      findOneSpy.mockResolvedValueOnce({});

      await service.create(createAttendanceDto);

      expect(findOneSpy).toHaveBeenCalledWith(createAttendanceDto.studentId);
      expect(findOneSpy).toHaveBeenCalledTimes(1);

      // Add more assertions based on your specific implementation
    });

    it('should throw NotFoundException when student is not found', async () => {
      const id = new mongoose.Types.ObjectId();
      const createAttendanceDto = {
        studentId: id,
        date: '12 - 12 - 2022',
        isPresent: true,
      };

      const findOneSpy = jest.spyOn(studentService, 'findOne');
      findOneSpy.mockResolvedValueOnce(null);

      await expect(service.create(createAttendanceDto)).rejects.toThrowError(
        NotFoundException,
      );

      expect(findOneSpy).toHaveBeenCalledWith(createAttendanceDto.studentId);
      expect(findOneSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('studentAttendance', () => {
    it('should get attendance for a student', async () => {
      const studentId = 'some-student-id';
      await service.studentAttendance(studentId);
    });
  });

  describe('getOneAttendance', () => {
    it('should get one attendance by id', async () => {
      const attendanceId = 'some-attendance-id';
      await service.getOneAttendance(attendanceId);
    });

    it('should return null if attendance is not found by id', async () => {
      const nonExistingAttendanceId = 'non-existing-attendance-id';

      // Mock findById to return null
      jest
        .spyOn(service['attendanceModel'], 'findById')
        .mockResolvedValueOnce(null);

      const result = await service.getOneAttendance(nonExistingAttendanceId);

      expect(result).toBeNull();
    });
  });

  describe('deleteManyAttendance', () => {
    it('should delete many attendance records for a student', async () => {
      const studentId = 'some-student-id';
      await service.deleteManyAttendance(studentId);
    });
  });
});
