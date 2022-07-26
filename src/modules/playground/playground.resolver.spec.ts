import { Test, TestingModule } from '@nestjs/testing';
import { PlaygroundResolver } from './playground.resolver';
import { PlaygroundService } from './playground.service';

describe('PlaygroundResolver', () => {
  let resolver: PlaygroundResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlaygroundResolver, PlaygroundService],
    }).compile();

    resolver = module.get<PlaygroundResolver>(PlaygroundResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
