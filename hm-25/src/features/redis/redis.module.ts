import { Module } from '@nestjs/common';
import { RedisService } from './application/redis.service';

@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
