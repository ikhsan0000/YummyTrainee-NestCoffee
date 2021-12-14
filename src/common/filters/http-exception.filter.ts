import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter<T extends HttpException> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) 
  {
    const context = host.switchToHttp();
    const ctxRespond = context.getResponse<Response>();
    
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let error
    if(typeof ctxRespond === 'string')
    {
      error = { message : exceptionResponse }
    }
    else
    {
      error = exceptionResponse as Object
    }

    ctxRespond.status(status).json({
      ...error,
      timestamp: new Date().toISOString()
    });
  }
}
