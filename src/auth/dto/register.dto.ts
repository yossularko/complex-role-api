import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { LoginDto } from './login.dto';

export class RegisterDto extends LoginDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(3)
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  bio: string;

  @ApiProperty({ required: false })
  @IsOptional()
  avaImage: string;

  @ApiProperty({ required: false })
  @IsOptional()
  bgImage: string;
}
