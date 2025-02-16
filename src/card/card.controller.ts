import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CardService } from './card.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthenticatedRequest } from './interface/authenticate-request.interface';

@ApiTags('Card')
@Controller('cards')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new card' })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 201, description: 'Create post successfully' })
  create(@Req() req: AuthenticatedRequest, @Body() createPostDto: CreateCardDto) {
    const userData = req.user
    const userId = userData.userId
    console.log('userData', userData)
    console.log('userId', userId);
    return this.cardService.create(createPostDto);
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
