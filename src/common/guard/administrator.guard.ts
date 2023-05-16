import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AccessMenu, User } from '@prisma/client';
import { adminAccess } from 'src/utils/constant';

@Injectable()
export class AdministratorGuard implements CanActivate {
  matchUser(userId: number): boolean {
    return adminAccess.some((id) => id === userId);
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as User & { accessMenus: AccessMenu[] };
    return this.matchUser(user.id);
  }
}
