import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();

    let errorCode = 'UNKNOWN_ERROR';

    if (exception instanceof BadRequestException) {
      errorCode = 'INVALID_PAYLOAD';
    }

    if (exception instanceof InternalServerErrorException) {
      errorCode = 'INTERNAL_SERVER_ERROR';
    }

    return response.status(status).json({
      successful: false,
      error_code: errorCode,
      data: null,
    });
  }
}
