import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class AccessMenuList {
  @IsNotEmpty()
  menuSlug: string;

  @IsNotEmpty()
  @IsArray()
  actions: string[];
}

export class CreateAccessMenuListDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  userId: number;

  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => AccessMenuList)
  menus: AccessMenuList[];
}
