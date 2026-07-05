import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class UserUpdateDTO {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsString()
  displayName?: string | null;

  @IsString()
  activeAccount?: string | null;

  @IsArray()
  @IsString({ each: true })
  claimedAccounts?: string[] | null;
}