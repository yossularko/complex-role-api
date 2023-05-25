import { Module } from '@nestjs/common';
import { TemplateMenusService } from './template-menus.service';
import { TemplateMenusController } from './template-menus.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtStrategy } from 'src/common/jwt.strategy';

@Module({
  imports: [PrismaModule],
  controllers: [TemplateMenusController],
  providers: [TemplateMenusService, JwtStrategy],
})
export class TemplateMenusModule {}
