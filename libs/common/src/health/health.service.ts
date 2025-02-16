import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom, map, of, timeout } from 'rxjs';

@Injectable()
export class HealthService {
  constructor(@Inject('health') private readonly healthClient: ClientProxy) {}

  async checkRabbit(): Promise<{ status: boolean; responseTime: number }> {
    const startTime = Date.now();

    try {
      const rabbitStatus = await firstValueFrom(
        this.healthClient.send('rabbitmq.ping', '').pipe(
          timeout(3000),
          map(() => true),
          catchError(() => of(false)),
        ),
      );

      const responseTime = Date.now() - startTime;
      return { status: rabbitStatus, responseTime };
    } catch {
      const responseTime = Date.now() - startTime;
      return { status: false, responseTime };
    }
  }
}
