import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MenusService } from './menus.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { JwtGuard } from 'src/common/guard/jwt.guard';

@Controller('menus')
@UseGuards(JwtGuard)
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Post()
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menusService.create(createMenuDto);
  }

  @Get()
  findAll() {
    return this.menusService.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') id: string) {
    return this.menusService.findOne(id);
  }

  @Patch(':slug')
  update(@Param('slug') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menusService.update(id, updateMenuDto);
  }

  @Delete(':slug')
  remove(@Param('slug') id: string) {
    return this.menusService.remove(id);
  }
}
