import { Profile, User } from '@prisma/client';
import { MenuRes } from 'src/config/interface/config.interface';

export interface LoginRes {
  token: {
    access_token: string;
    refresh_token: string;
  };
  user: User & { profile: Profile };
  accessMenus: MenuRes[];
}
