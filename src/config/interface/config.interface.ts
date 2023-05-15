export interface Menu {
  id: number;
  slug: string;
  name: string;
  alias: string;
  parent: string[];
  actions?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuRes {
  id: number;
  slug: string;
  name: string;
  alias: string;
  parent: string[];
  actions?: string[];
  createdAt: Date;
  updatedAt: Date;
  children?: Menu[];
}
