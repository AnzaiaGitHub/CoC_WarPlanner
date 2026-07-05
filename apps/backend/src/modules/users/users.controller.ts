import { Controller, Injectable, Post, UseGuards, Body, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import { UserUpdateDTO } from './DTOs/UserUpdate.dto';

@Controller('users')
export class UsersController {
  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(): string {
    return 'This is the user profile.';
  }
}
