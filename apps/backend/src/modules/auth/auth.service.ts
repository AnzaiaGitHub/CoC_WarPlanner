import { Injectable } from '@nestjs/common';
import { RegisterDto, RegisterResponseDTO } from './DTOs/register.dto';
import { UsersService } from '../users/users.service';
import { PasswordService } from './password.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly passwordService: PasswordService) {}
  
  async register(dto: RegisterDto): Promise<RegisterResponseDTO> {
    console.log("register endpoint reached");
    const hashedPassword = await this.passwordService.hashPassword(dto.password);
    console.log("hashed password:", hashedPassword);
    return this.usersService.create(dto.email, hashedPassword);
  }
}
