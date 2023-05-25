import { Test, TestingModule } from '@nestjs/testing';
import { TemplateMenusService } from './template-menus.service';

describe('TemplateMenusService', () => {
  let service: TemplateMenusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TemplateMenusService],
    }).compile();

    service = module.get<TemplateMenusService>(TemplateMenusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
