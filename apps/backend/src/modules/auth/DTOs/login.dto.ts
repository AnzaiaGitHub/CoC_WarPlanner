import { IsNotEmpty } from 'class-validator';
export class LoginDTO {
  @IsNotEmpty()
  email!: string;

  @IsNotEmpty()
  password!: string;
}

export class LoginResponseDTO {
  id!: string;
  email!: string;
}