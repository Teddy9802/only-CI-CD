import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/')
  getHello(): string {
    //aaaa∂12å
    return '두번째';
  }
}
