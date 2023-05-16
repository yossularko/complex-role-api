import { SetMetadata } from '@nestjs/common';

export const Actions = (...args: string[]) => SetMetadata('actions', args);
