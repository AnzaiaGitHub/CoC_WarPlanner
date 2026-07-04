import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
export class RegisterDTO {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(64)
  password!: string;
}

export class RegisterResponseDTO {
  id!: string;
  email!: string;
}