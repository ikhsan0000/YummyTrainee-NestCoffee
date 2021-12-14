import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { WrapResponseInterceptor } from './common/interceptors/wrap-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe(
    {
      whitelist: true,        //strip out all unneccessary payload outside the dto fromat from POSTed body 
      transform: true,        //transform returned payload to the correct instance from their own respective dto
      forbidNonWhitelisted: true,    //if detected any unneccessary payload field inside body, will throws an error
      transformOptions:
      {
        enableImplicitConversion: true,   //quesry parameter changed automatically their own respective type
      },
    }
  ));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(
    new WrapResponseInterceptor(),
    new TimeoutInterceptor);

  const swaggerOptions = new DocumentBuilder()
  .setTitle('NestCoffee')
  .setDescription('A Coffee App totally not sponsored by ne*cafe')
  .setVersion('1.0')
  .build()
  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('api', app, document)
  
  await app.listen(3000);
}
bootstrap();
