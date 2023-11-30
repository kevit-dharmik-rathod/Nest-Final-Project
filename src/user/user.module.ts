import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User ,userSchema } from './Schemas/user.schema';
import { AuthenticationMiddleware } from 'src/middlewares/authentication.middleware';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = userSchema;
          schema.pre('save', () => {});
          return schema;
        },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService,RolesGuard],
})
export class UserModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).exclude(
      { path: '/user/login', method: RequestMethod.POST },
    ).forRoutes(UserController);
  }
}
