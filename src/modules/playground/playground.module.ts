import { Module } from '@nestjs/common';
import { PlaygroundService } from './playground.service';
import { PlaygroundResolver } from './playground.resolver';

@Module({
  providers: [PlaygroundResolver, PlaygroundService]
})
export class PlaygroundModule {}
