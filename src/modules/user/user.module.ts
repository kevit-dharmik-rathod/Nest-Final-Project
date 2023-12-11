import { MiddlewareConsumer, Module, NestModule, RequestMethod, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from './Schemas/user.schema';
import { UserAuthenticationMiddleware } from '../../middlewares/user-authentication.middleware';
import { RolesGuard } from '../../guards/roles.guard';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = userSchema;
          schema.pre('save', () => { });
          return schema;
        },
      },
    ])],
  controllers: [UserController],
  providers: [UserService, RolesGuard],
  exports: [UserService]
})
export class UserModule { }
