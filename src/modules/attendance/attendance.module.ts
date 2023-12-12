import { Module, forwardRef } from '@nestjs/common';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { StudentModule } from '../student/student.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Attendance, attendanceSchema } from './Schemas/attendance.schema';
import { RolesGuard } from 'src/guards/roles.guard';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Attendance.name,
        schema: attendanceSchema,
      },
    ]),
    UserModule,
    forwardRef(() => StudentModule),
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService, RolesGuard],
  exports: [AttendanceService],
})
export class AttendanceModule {}
