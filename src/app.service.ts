import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    console.log(process.env.MONGO_SECRET)
    return process.env.MONGO_SECRET;
  }
}
