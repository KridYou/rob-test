import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { CreateCardDto, CreateCommentDto } from './dto/create-card.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CardService } from './card.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthenticatedRequest } from './interface/authenticate-request.interface';
import { UpdateCardDto } from './dto/update-card.dto';
import { Card } from './entities/card.entity';
import { PostOwnerGuard } from './post-owner.guard';
import { CommentOwnerGuard } from './comment-owner.guard';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { SuccessResponse } from './interface/success-response.interface';

@ApiTags('Card')
@Controller('cards')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new card' })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 201, description: 'Create post successfully' })
  createCard(
    @Req() req: AuthenticatedRequest,
    @Body() createPostDto: CreateCardDto,
  ) {
    const userData = req.user;
    const userId = userData.userId;
    return this.cardService.createCard(createPostDto, userId);
  }

  @Post(':id/comments')
  @ApiOperation({ summary: 'Create a new comment' })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 201, description: 'Create comment successfully' })
  createComment(
    @Param('id') cardId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.userId;
    return this.cardService.addCommentToPost(cardId, createCommentDto, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a card' })
  @UseGuards(JwtAuthGuard, PostOwnerGuard)
  @ApiResponse({ status: 200, description: 'Update card successfully' })
  updatePost(
    @Param('id') cardId: string,
    @Body() updateCardDto: UpdateCardDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.userId;

    return this.cardService.updateCard(cardId, updateCardDto, userId);
  }

  @Patch('comments/:id')
  @ApiOperation({ summary: 'Update a comment' })
  @UseGuards(JwtAuthGuard, CommentOwnerGuard)
  @ApiResponse({ status: 200, description: 'Update card successfully' })
  updateComment(
    @Param('id') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.cardService.updateComment(commentId, updateCommentDto);
  }

  @Get(':id')
  async getCardById(@Param('id') id: string): Promise<Card> {
    return await this.cardService.findCardById(id);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Get cards successfully' })
  async findAll():Promise<SuccessResponse<any>> {
    const result = await this.cardService.findAll();
    return {
      statusCode: 200,
      message: 'Data fetched successfully',
      data: result,
    };
  }

  @Delete(':id')
  softDelete(@Param('id') id: string) {
    return this.cardService.softDelete(id);
  }
}
