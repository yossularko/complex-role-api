import { Module } from '@nestjs/common';
import { AccessMenusService } from './access-menus.service';
import { AccessMenusController } from './access-menus.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtStrategy } from 'src/common/jwt.strategy';

@Module({
  imports: [PrismaModule],
  controllers: [AccessMenusController],
  providers: [AccessMenusService, JwtStrategy],
})
export class AccessMenusModule {}
