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
    actions: string[],
    userAccessMenu: AccessMenu[],
    userId: number,
  ): boolean {
    if (adminAccess.some((id) => id === userId)) {
      return true;
    }

    const accessMenuSlugs = userAccessMenu.map((item) => item.menuSlug);

    const isMatch = accessMenuSlugs.some((access) => access === slugs[0]);

    if (!isMatch) {
      return false;
    }

    const idx = userAccessMenu.findIndex((val) => val.menuSlug === slugs[0]);

    if (idx === -1) {
      return false;
    }

    const menuActions = userAccessMenu[idx].actions;

    return menuActions.some((action) => action === actions[0]);
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const slugs = this.reflector.get<string[]>('slugs', context.getHandler());
    const actions = this.reflector.get<string[]>(
      'actions',
      context.getHandler(),
    );

    if (!slugs || !actions) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as User & { accessMenus: AccessMenu[] };
    return this.matchUser(slugs, actions, user.accessMenus, user.id);
  }
}
