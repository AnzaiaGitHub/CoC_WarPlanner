import { Post, Body, Controller } from '@nestjs/common';
import { RegisterDTO, RegisterResponseDTO } from './DTOs/register.dto';
import { LoginDTO, LoginJWTResponseDTO } from './DTOs/login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDTO): Promise<RegisterResponseDTO> {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDTO): Promise<LoginJWTResponseDTO> {
    return this.authService.login(dto);
  }
}
