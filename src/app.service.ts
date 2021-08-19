import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '<h1>Hello This Is The root Page Of App</h1>';
  }

  getHome(): string {
    return '<h1>Home Page Of App</h1>';
  }
}
