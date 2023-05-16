import { SetMetadata } from '@nestjs/common';

export const Slugs = (...args: string[]) => SetMetadata('slugs', args);
