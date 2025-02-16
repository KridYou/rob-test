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

@ApiTags('Card')
@Controller('cards')
export class CardController {
  constructor(private readonly cardService: CardService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new card' })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 201, description: 'Create post successfully' })
  createCard(@Req() req: AuthenticatedRequest, @Body() createPostDto: CreateCardDto) {
    const userData = req.user
    const userId = userData.userId
    console.log('userData', userData)
    console.log('userId', userId);
    return this.cardService.createCard(createPostDto, userId);
  }

  @Post(':id/comments')
  @ApiOperation({ summary: 'Create a new comment' })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 201, description: 'Create comment successfully' })
  createComment(
    @Param('id') cardId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: AuthenticatedRequest
  ) {
    const userId = req.user.userId
    return this.cardService.addCommentToPost(cardId, createCommentDto, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a card' })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Update card successfully' })
  updatePost(@Param('id') postId: string, @Body() updateCardDto: UpdateCardDto,
    @Req() req: AuthenticatedRequest
  ) {
    const userId = req.user.userId

    return this.cardService.updatePost(postId, updateCardDto, userId);
  }

  @Get()
  findAll() {
    return this.cardService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.postsService.findOne(id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
  //   return this.postsService.update(id, updatePostDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cardService.remove(id);
  }
}
