import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { validate } from 'class-validator';
import { RegisterDTO, RegisterResponseDTO } from './DTOs/register.dto';
import { UsersService } from '../users/users.service';
import { PasswordService } from './password.service';
import { LoginDTO, LoginJWTResponseDTO } from './DTOs/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JWT_Payload } from './types/JWT-Payload';
import { JWT_Tokens } from './types/JWT-Tokens';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async register(dto: RegisterDTO): Promise<RegisterResponseDTO> {
    const registerDto = Object.assign(new RegisterDTO(), dto);
    const errors = await validate(registerDto);

    if (errors.length > 0) {
      console.error('Validation errors:', errors);
      throw new BadRequestException(errors);
    }

    const hashedPassword = await this.passwordService.hashPassword(dto.password);
    return this.usersService.create({ email: dto.email, passwordHash: hashedPassword });
  }

  async login(dto: LoginDTO): Promise<LoginJWTResponseDTO> {
    const user = this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const isPasswordValid = await this.passwordService.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const payload = { sub: user.id };
    const {accessToken, refreshToken} = this.jwtSign(payload);

    return { id: user.id, displayName: user.displayName, accessToken, refreshToken };
  }

  private jwtSign(payload: JWT_Payload): JWT_Tokens {
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<number>('ACCESS_TOKEN_EXPIRATION_SECONDS', 3600),
      secret: this.configService.get<string>('ACCESS_TOKEN_SECRET', 'default_access_token_secret'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<number>('REFRESH_TOKEN_EXPIRATION_SECONDS', 604800),
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET', 'default_refresh_token_secret'),
    });

    return { accessToken, refreshToken };
  }
}
