import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class CreateAccessMenuDto {
  @ApiProperty()
  @IsNotEmpty()
  menuSlug: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  actions: string[];
}
