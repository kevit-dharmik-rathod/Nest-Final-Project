import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Attendance } from './Schemas/attendance.schema';
import mongoose, { ObjectId, Types } from 'mongoose';
import { StudentService } from '../student/student.service';
import { CreateAttendanceDto } from './dtos/create-attendance.dto';

@Injectable()
export class AttendanceService {
  private readonly logger = new Logger(AttendanceService.name);
  constructor(
    @InjectModel(Attendance.name)
    private attendanceModel: mongoose.Model<Attendance>,
    @Inject(forwardRef(() => StudentService))
    private studentService: StudentService,
  ) {}
  async create(body: CreateAttendanceDto) {
    try {
      const student = await this.studentService.findOne(
        body.studentId.toString(),
      );
      if (!student) {
        throw new NotFoundException('Student not found with given studentId');
      }
      body.studentId = new Types.ObjectId(body.studentId);
      console.log(body.studentId);
      return await this.attendanceModel.create(body);
    } catch (error) {
      throw error;
    }
  }

  async studentAttendance(studentId: string) {
    try {
      return await this.attendanceModel.find({ studentId });
    } catch (error) {
      throw error;
    }
  }

  async getOneAttendance(id: string) {
    try {
      return await this.attendanceModel.findById(id);
    } catch (error) {}
  }

  async deleteManyAttendance(studentId: string) {
    try {
      const newId = new Types.ObjectId(studentId);
      return await this.attendanceModel.deleteMany({ studentId: newId });
    } catch (error) {
      throw error;
    }
  }
}
