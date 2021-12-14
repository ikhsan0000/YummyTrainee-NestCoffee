import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    
    console.time('res-time');
    console.log("im middleware");
    res.on('finish', () => console.timeEnd('res-time'));
    next();
  }
}
