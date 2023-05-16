import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAccessMenuDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  userId: number;

  @ApiProperty()
  @IsNotEmpty()
  menuSlug: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  actions: string[];
}
