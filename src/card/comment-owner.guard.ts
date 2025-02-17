import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { CardService } from './card.service';

@Injectable()
export class CommentOwnerGuard implements CanActivate {
  constructor(private readonly cardService: CardService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.userId;
    const commentId = request.params.id;

    if (!userId) {
      throw new ForbiddenException('Unauthorized');
    }

    const comment = await this.cardService.findCommentById(commentId);
    if (!comment) {
      throw new ForbiddenException('Comment not found');
    }

    if (comment.createdBy !== userId) {
      throw new ForbiddenException('You do not own this comment');
    }

    return true;
  }
}
