import { Injectable } from '@nestjs/common';
import { Menu, MenuRes } from './interface/config.interface';

@Injectable()
export class ConfigService {
  createMenuTree(data: Menu[]): MenuRes[] {
    const menuRange = this.getMenuRange(data);
    if (menuRange.length === 0) {
      return [];
    }

    if (menuRange.length < 2) {
      return menuRange[0];
    }

    return this.recursiveMenu(menuRange)[0];
  }

  getMenuRange(data: Menu[]): Menu[][] {
    const parentLengths = data.map((item) => item.parent.length);
    const maxParent = Math.max(...parentLengths) + 1;
    const range = [];
    for (let i = 0; i < maxParent; i++) {
      range.push(i);
    }

    const menuRange = range.map((val) => {
      return data.filter((menu) => menu.parent.length === val);
    });
    return menuRange;
  }

  recursiveMenu(menuRange: Menu[][]): MenuRes[][] {
    const startData = menuRange.slice(0, menuRange.length - 2);
    const parent = menuRange[menuRange.length - 2];
    const child = menuRange[menuRange.length - 1];

    const endData = parent.map((item) => {
      const children = this.findChild(item.slug, child);
      if (children.length > 0) {
        return { ...item, children };
      }
      return item;
    });

    const finalData = [...startData, endData];

    if (finalData.length > 1) {
      return this.recursiveMenu(finalData);
    }

    return finalData;
  }

  findChild(slug: string, child: Menu[]) {
    const finded = child.filter((item) =>
      item.parent.some((val) => val === slug),
    );
    return finded;
  }
}
