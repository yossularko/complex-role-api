import { Test, TestingModule } from '@nestjs/testing';
import { TemplateMenusController } from './template-menus.controller';
import { TemplateMenusService } from './template-menus.service';

describe('TemplateMenusController', () => {
  let controller: TemplateMenusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TemplateMenusController],
      providers: [TemplateMenusService],
    }).compile();

    controller = module.get<TemplateMenusController>(TemplateMenusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
