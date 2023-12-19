import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dtos/create-attendance.dto';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../user/decorators/user.decorator';
import { NotFoundException } from '@nestjs/common';
import mongoose from 'mongoose';

describe('AttendanceController', () => {
  let controller: AttendanceController;
  let attendanceService: AttendanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttendanceController],
      providers: [AttendanceService],
    }).compile();

    controller = module.get<AttendanceController>(AttendanceController);
    attendanceService = module.get<AttendanceService>(AttendanceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createNew', () => {
    it('should create a new attendance', async () => {
      const id = new mongoose.Types.ObjectId();
      const createAttendanceDto: CreateAttendanceDto = {
        studentId: id,
        date: '2023-01-01',
        isPresent: true,
      };

      jest.spyOn(attendanceService, 'create').mockResolvedValueOnce();

      const result = await controller.createNew(createAttendanceDto);

      expect(attendanceService.create).toHaveBeenCalledWith(
        createAttendanceDto,
      );
      expect(result).toEqual();
    });

    it('should throw NotFoundException when student is not found', async () => {
      const createAttendanceDto: CreateAttendanceDto = {
        studentId: 'non-existing-student-id',
        date: '2023-01-01',
        isPresent: true,
      };

      jest
        .spyOn(attendanceService, 'create')
        .mockRejectedValueOnce(new NotFoundException());

      await expect(
        controller.createNew(createAttendanceDto),
      ).rejects.toThrowError(NotFoundException);

      expect(attendanceService.create).toHaveBeenCalledWith(
        createAttendanceDto,
      );
    });
  });

  describe('getAttendanceByStudentId', () => {
    it('should get attendance by student id', async () => {
      const studentId = 'some-student-id';

      jest
        .spyOn(attendanceService, 'studentAttendance')
        .mockResolvedValueOnce();

      const result = await controller.getAttendanceByStudentId(studentId);

      expect(attendanceService.studentAttendance).toHaveBeenCalledWith(
        studentId,
      );
      expect(result).toEqual();
    });
  });

  describe('getSingleAttendance', () => {
    it('should get single attendance by attendance id', async () => {
      const attendanceId = 'some-attendance-id';

      jest.spyOn(attendanceService, 'getOneAttendance').mockResolvedValueOnce();

      const result = await controller.getSingleAttendance(attendanceId);

      expect(attendanceService.getOneAttendance).toHaveBeenCalledWith(
        attendanceId,
      );
      expect(result).toEqual();
    });

    it('should throw NotFoundException when attendance is not found', async () => {
      const nonExistingAttendanceId = 'non-existing-attendance-id';

      jest
        .spyOn(attendanceService, 'getOneAttendance')
        .mockRejectedValueOnce(new NotFoundException());

      await expect(
        controller.getSingleAttendance(nonExistingAttendanceId),
      ).rejects.toThrowError(NotFoundException);

      expect(attendanceService.getOneAttendance).toHaveBeenCalledWith(
        nonExistingAttendanceId,
      );
    });
  });
});
