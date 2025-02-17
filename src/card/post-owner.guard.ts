import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { CardService } from './card.service';

@Injectable()
export class PostOwnerGuard implements CanActivate {
  constructor(private readonly cardService: CardService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.userId;
    const postId = request.params.id;

    if (!userId) {
      throw new ForbiddenException('Unauthorized');
    }

    const card = await this.cardService.findCardById(postId);
    if (!card) {
      throw new ForbiddenException('Card not found');
    }

    if (card.createdBy !== userId) {
      throw new ForbiddenException('You do not own this card');
    }

    return true;
  }
}
