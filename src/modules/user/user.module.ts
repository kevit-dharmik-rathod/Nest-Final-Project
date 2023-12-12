import { MiddlewareConsumer, Module, NestModule, RequestMethod, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from './Schemas/user.schema';
import { RolesGuard } from '../../guards/roles.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: userSchema
      },
    ])],
  controllers: [UserController],
  providers: [UserService, RolesGuard],
  exports: [UserService]
})
export class UserModule { }
