import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsNotEmpty } from 'class-validator';
import { AccessMenuList } from 'src/access-menus/dto/create-access-menu-list.dto';

export class CreateTemplateMenuDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => AccessMenuList)
  menus: AccessMenuList[];
}
