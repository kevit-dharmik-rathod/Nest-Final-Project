import { Module } from '@nestjs/common';
import { AllExceptionsFilterService } from './exception-filter.service';

@Module({
  providers: [AllExceptionsFilterService],
  exports: [AllExceptionsFilterService],
})
export class ExceptionFilterModule {}
