import { IsNotEmpty } from 'class-validator';
export class LoginDTO {
  @IsNotEmpty()
  email!: string;

  @IsNotEmpty()
  password!: string;
}

export class LoginResponseDTO {
  id!: string;
  displayName?: string;
  activeAccount?: string;
}

export class LoginJWTResponseDTO extends LoginResponseDTO {
  accessToken!: string;
  refreshToken!: string;
}