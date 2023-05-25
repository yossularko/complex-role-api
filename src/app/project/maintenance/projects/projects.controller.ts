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
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { AccessMenuGuard } from 'src/common/guard/access-menu.guard';
import { Slugs } from 'src/common/decorator/slugs.decorator';
import { Actions } from 'src/common/decorator/actions.decorator';
import { MenuAction } from 'src/types/index.type';

@ApiTags('App/Project/Maintenance/Projects')
@Controller('projects')
@UseGuards(JwtGuard, AccessMenuGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Slugs('projects-2')
  @Actions(MenuAction.create)
  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Slugs('projects-2')
  @Actions(MenuAction.read)
  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Slugs('projects-2')
  @Actions(MenuAction.read)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(+id);
  }

  @Slugs('projects-2')
  @Actions(MenuAction.update)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(+id, updateProjectDto);
  }

  @Slugs('projects-2')
  @Actions(MenuAction.delete)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(+id);
  }
}
