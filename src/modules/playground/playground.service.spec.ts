import { Test, TestingModule } from '@nestjs/testing';
import { PlaygroundService } from './playground.service';

describe('PlaygroundService', () => {
  let service: PlaygroundService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlaygroundService],
    }).compile();

    service = module.get<PlaygroundService>(PlaygroundService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
