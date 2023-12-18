import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { Roles } from '../user/decorators/user.decorator';
import { RolesGuard } from '../../guards/roles.guard';
import { CreateAttendanceDto } from './dtos/create-attendance.dto';

@Controller('attendance')
export class AttendanceController {
  private readonly logger = new Logger(AttendanceController.name);
  constructor(private readonly attendanceService: AttendanceService) {}

  // create a new attendance
  @Post('/add')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'STAFF')
  async createNew(@Body() attendanceDto: CreateAttendanceDto) {
    return await this.attendanceService.create(attendanceDto);
  }

  //Get attendance by student id
  @Get('/student/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'STAFF')
  async getAttendanceByStudentId(@Param('id') studentId: string) {
    return await this.attendanceService.studentAttendance(studentId);
  }

  //Get single attendance by attendance id
  @Get('/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'STAFF')
  async getSingleAttendance(@Param('id') id: string) {
    return await this.attendanceService.getOneAttendance(id);
  }
}
