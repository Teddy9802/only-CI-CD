import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/')
  getHello(): string {
    //aaaa∂
    return '두번째';
  }
}
