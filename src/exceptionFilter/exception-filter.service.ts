import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  ExceptionFilter,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilterService implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let errorMessage: string | undefined;

    if (exception instanceof HttpException) {
      errorMessage = exception.message || 'Internal Server Error';
    } else {
      errorMessage = 'Internal Server Error';
    }

    const responseBody = {
      statusCode: httpStatus,
      message: errorMessage, // Include the custom message field
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url,
    };

    response.status(httpStatus).json(responseBody);
  }
}
