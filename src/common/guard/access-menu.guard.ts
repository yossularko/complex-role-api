import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { AccessMenu, User } from '@prisma/client';
import { adminAccess } from 'src/utils/constant';

@Injectable()
export class AccessMenuGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  matchUser(
    slugs: string[],
    userAccessMenu: AccessMenu[],
    userId: number,
  ): boolean {
    if (adminAccess.some((id) => id === userId)) {
      return true;
    }

    const accessMenuSlugs = userAccessMenu.map((item) => item.menuSlug);

    const isMatch = slugs.some((slug) =>
      accessMenuSlugs.some((access) => access === slug),
    );

    return isMatch;
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const slugs = this.reflector.get<string[]>('slugs', context.getHandler());

    if (!slugs) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as User & { accessMenus: AccessMenu[] };
    return this.matchUser(slugs, user.accessMenus, user.id);
  }
}
