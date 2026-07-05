import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { validate } from 'class-validator';
import { RegisterDTO, RegisterResponseDTO } from './DTOs/register.dto';
import { UsersService } from '../users/users.service';
import { PasswordService } from './password.service';
import { LoginDTO, LoginJWTResponseDTO } from './DTOs/login.dto';
import { JwtService } from '@nestjs/jwt';
import { JWT_Payload } from './types/JWT-Payload';
import { JWT_Tokens } from './types/JWT-Tokens';
import { AppConfigService } from 'src/config/app-config.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
    private readonly appConfigService: AppConfigService
  ) {}

  async register(dto: RegisterDTO): Promise<RegisterResponseDTO> {
    const registerDto = Object.assign(new RegisterDTO(), dto);
    const errors = await validate(registerDto);

    if (errors.length > 0) {
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

    return { id: user.id, displayName: user.displayName!, accessToken, refreshToken };
  }

  private jwtSign(payload: JWT_Payload): JWT_Tokens {
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.appConfigService.accessTokenExpiration,
      secret: this.appConfigService.accessTokenSecret,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.appConfigService.refreshTokenExpiration,
      secret: this.appConfigService.refreshTokenSecret,
    });

    return { accessToken, refreshToken };
  }
}
