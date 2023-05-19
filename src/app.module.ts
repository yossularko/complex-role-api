import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { MenusModule } from './menus/menus.module';
import { AccessMenusModule } from './access-menus/access-menus.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    MenusModule,
    AccessMenusModule,
    ConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('users', 'access-menus', 'menus');
  }
}
