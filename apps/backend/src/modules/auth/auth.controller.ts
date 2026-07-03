import { Injectable, Post, Body, Controller } from '@nestjs/common';
import { RegisterDto, RegisterResponseDTO } from './DTOs/register.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<RegisterResponseDTO> {
    return this.authService.register(dto);
  }
}
