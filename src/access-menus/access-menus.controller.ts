import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdministratorGuard } from 'src/common/guard/administrator.guard';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { AccessMenusService } from './access-menus.service';
import { CreateAccessMenuListDto } from './dto/create-access-menu-list.dto';
import { CreateAccessMenuDto } from './dto/create-access-menu.dto';
import { QueryAccessMenuDto } from './dto/query-access-menu.dto';
import { UpdateAccessMenuDto } from './dto/update-access-menu.dto';

@ApiTags('Access Menu')
@Controller('access-menus')
@UseGuards(JwtGuard, AdministratorGuard)
export class AccessMenusController {
  constructor(private readonly accessMenusService: AccessMenusService) {}

  @Post()
  create(@Body() createAccessMenuDto: CreateAccessMenuDto) {
    return this.accessMenusService.create(createAccessMenuDto);
  }

  @Post('replace')
  createMenus(@Body() createAccessMenuListDto: CreateAccessMenuListDto) {
    return this.accessMenusService.createMenus(createAccessMenuListDto);
  }

  @Get()
  findAll(@Query() query: QueryAccessMenuDto) {
    return this.accessMenusService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.accessMenusService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAccessMenuDto: UpdateAccessMenuDto,
  ) {
    return this.accessMenusService.update(id, updateAccessMenuDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.accessMenusService.remove(id);
  }
}
