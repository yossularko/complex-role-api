import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { MenusService } from './menus.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { Slugs } from 'src/common/decorator/slugs.decorator';
import { AccessMenuGuard } from 'src/common/guard/access-menu.guard';
import { Actions } from 'src/common/decorator/actions.decorator';
import { MenuAction } from 'src/types/index.type';

@Controller('menus')
@UseGuards(JwtGuard, AccessMenuGuard)
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Post()
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menusService.create(createMenuDto);
  }

  @Slugs('change-project-codes')
  @Actions(MenuAction.read)
  @Get()
  findAll(@Query('type') type: string) {
    return this.menusService.findAll(type);
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
