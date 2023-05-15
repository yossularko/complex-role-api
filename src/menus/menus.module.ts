import { Module } from '@nestjs/common';
import { MenusService } from './menus.service';
import { MenusController } from './menus.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtStrategy } from 'src/common/jwt.strategy';
import { ConfigModule } from 'src/config/config.module';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [MenusController],
  providers: [MenusService, JwtStrategy],
})
export class MenusModule {}
