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

  /**
   *
   * @param body attendance body
   * @returns attendance object
   */
  async create(body: CreateAttendanceDto) {
    try {
      console.log('attendance body is', body);
      const student = await this.studentService.findOne(body.studentId);
      if (!student) {
        throw new NotFoundException('Student not found with given studentId');
      }
      body.studentId = new Types.ObjectId(body.studentId);
      return await this.attendanceModel.create(body);
    } catch (error) {
      throw error;
    }
  }

  //get attendances of student by it's id
  /**
   * get all attendance of given student
   * @param studentId of student
   * @returns attendance object
   */
  async studentAttendance(studentId: string) {
    try {
      console.log('student id is ', studentId);
      const res = await this.attendanceModel.find({
        studentId: new Types.ObjectId(studentId),
      });
      console.log(res);
      return res;
    } catch (error) {
      throw error;
    }
  }

  //Get single attendance by attendance id
  /**
   *
   * @param id of attendance
   * @returns attendance object
   */
  async getOneAttendance(id: string) {
    try {
      return await this.attendanceModel.findById(id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * delete all attendance with given student id
   * @param studentId
   * @returns delete acknowledgement
   */
  async deleteManyAttendance(studentId: string) {
    try {
      const newId = new Types.ObjectId(studentId);
      return await this.attendanceModel.deleteMany({ studentId: newId });
    } catch (error) {
      throw error;
    }
  }

  /**
   * clear attendance database
   * @returns delete acknowledgement
   */
  async clearAttendance() {
    try {
      const res = await this.attendanceModel.deleteMany({});
      return res;
    } catch (error) {
      throw error;
    }
  }
}
