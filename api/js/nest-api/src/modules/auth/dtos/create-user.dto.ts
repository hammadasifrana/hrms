import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  IsIn
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsIn(['user', 'admin'], { each: true })
  roleNames?: string[];
}