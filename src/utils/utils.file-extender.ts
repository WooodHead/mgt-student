/* eslint-disable class-methods-use-this */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class FileExtender implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest();
    req.file['comment'] = req.body.comment;
    req.file['outletId'] = Number(req.body.outletId);
    return next.handle();
  }
}
