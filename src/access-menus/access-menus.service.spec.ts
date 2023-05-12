import { Test, TestingModule } from '@nestjs/testing';
import { AccessMenusService } from './access-menus.service';

describe('AccessMenusService', () => {
  let service: AccessMenusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccessMenusService],
    }).compile();

    service = module.get<AccessMenusService>(AccessMenusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
