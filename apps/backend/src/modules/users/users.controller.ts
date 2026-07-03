import { Controller, Injectable } from '@nestjs/common';

@Injectable()
@Controller('users')
export class UsersController {
  createUser(): string {
    return 'User created successfully';
  }

  getUser(): string {
    return 'User retrieved successfully';
  }

  getMockedUser(): string {
    return 'Mocked user retrieved successfully';
  }
}
