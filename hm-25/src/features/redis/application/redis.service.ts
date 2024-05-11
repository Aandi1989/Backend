import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly client: Redis;

  constructor() {
    this.client = new Redis({
      host: 'localhost', // Укажите ваш host
      port: 6379        // Укажите ваш port
    });
  }

  onModuleInit() {
    this.client.on('connect', () => console.log('Connected to Redis'));
    this.client.on('error', (err) => console.error('Redis error', err));
  }

  onModuleDestroy() {
    this.client.quit();
  }

  getClient(): Redis {
    return this.client;
  }
}

/*
docker run -d -p 80:80 docker/getting-started  —> команда в командную строку для запуска Docker
docker exec -it redis-stack redis-cli запуск Redis
*/ 
