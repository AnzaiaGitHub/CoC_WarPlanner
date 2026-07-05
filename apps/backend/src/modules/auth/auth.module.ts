import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PasswordService } from './password.service';
import { JwtStrategy } from './strategies/JwtStrategy';
import { PassportModule } from '@nestjs/passport';
import { AppConfigurationModule } from 'src/config/app-configuration.module';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      signOptions: { expiresIn: '1h' },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AppConfigurationModule
  ],
  controllers: [AuthController],
  providers: [AuthService, PasswordService, JwtStrategy],
  exports: [AuthService, PassportModule],
})
export class AuthModule {}
