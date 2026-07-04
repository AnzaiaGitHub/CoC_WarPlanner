import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { validate } from 'class-validator';
import { RegisterDTO, RegisterResponseDTO } from './DTOs/register.dto';
import { UsersService } from '../users/users.service';
import { PasswordService } from './password.service';
import { LoginDTO, LoginResponseDTO } from './DTOs/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly passwordService: PasswordService) {}

  async register(dto: RegisterDTO): Promise<RegisterResponseDTO> {
    const registerDto = Object.assign(new RegisterDTO(), dto);
    const errors = await validate(registerDto);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const hashedPassword = await this.passwordService.hashPassword(dto.password);
    return this.usersService.create({ email: dto.email, passwordHash: hashedPassword });
  }

  async login(dto: LoginDTO): Promise<LoginResponseDTO> {
    const user = this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const isPasswordValid = await this.passwordService.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    return { id: user.id, email: user.email };
  }
}
