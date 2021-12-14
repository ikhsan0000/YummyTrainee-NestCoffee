import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CoffeesModule,
    MongooseModule.forRoot(`mongodb+srv://NestCoffeeAdmin:${process.env.MONGO_SECRET}@cluster0.euqp6.mongodb.net/cluster0?retryWrites=true&w=majority`)
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
