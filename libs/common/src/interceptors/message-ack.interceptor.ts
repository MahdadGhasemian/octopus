import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RmqContext } from '@nestjs/microservices';

@Injectable()
export class MessageAckInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToRpc().getContext<RmqContext>();
    const channel = ctx.getChannelRef();
    const originalMsg = ctx.getMessage();

    return next.handle().pipe(
      tap(() => {
        channel.ack(originalMsg);
      }),
    );
  }
}
