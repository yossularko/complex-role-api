import { Test, TestingModule } from '@nestjs/testing';
import { AccessMenusController } from './access-menus.controller';
import { AccessMenusService } from './access-menus.service';

describe('AccessMenusController', () => {
  let controller: AccessMenusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccessMenusController],
      providers: [AccessMenusService],
    }).compile();

    controller = module.get<AccessMenusController>(AccessMenusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
