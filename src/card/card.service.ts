import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card, Comment } from './entities/card.entity';
import { CreateCardDto, CreateCommentDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { CardHistory } from './entities/card-histories.entity';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(CardHistory)
    private readonly cardHistoryRepository: Repository<CardHistory>,
  ) { }

  async createCard(createCardtDto: CreateCardDto, userId: string): Promise<Card> {
    const createdCard: Card = this.cardRepository.create(createCardtDto);
    createdCard.createdBy = userId
    console.log('createdCard', createdCard)
    return await this.cardRepository.save(createdCard);
  }

  async addCommentToPost(cardId: string, createCommentDto: CreateCommentDto, userId: string): Promise<Comment> {
    const existingCard = await this.cardRepository.findOne({ where: { id: cardId } })
    if (!existingCard) {
      throw new NotFoundException(`Card with ID ${cardId} not found`);
    }
    const createdComment: Comment = this.commentRepository.create(createCommentDto);
    createdComment.createdBy = userId
    createdComment.card = existingCard
    console.log('createdComment', createdComment)
    return await this.commentRepository.save(createdComment);
  }

  async updatePost(cardId: string, updateCommentDto: UpdateCardDto, userId: string): Promise<{ message: string }> {
    const existingCard: Card = await this.cardRepository.findOne({ where: { id: cardId } })
    if (!existingCard) {
      throw new NotFoundException(`Card with ID ${cardId} not found`);
    }

    const createdCardHis: CardHistory = new CardHistory()
    createdCardHis.topic = existingCard.topic
    createdCardHis.description = existingCard.description
    createdCardHis.cardStatus = existingCard.cardStatus
    createdCardHis.card = existingCard
    createdCardHis.createdBy = userId

    await this.cardHistoryRepository.insert(createdCardHis)

    existingCard.topic = updateCommentDto.topic
    existingCard.description = updateCommentDto.description
    existingCard.cardStatus = updateCommentDto.cardStatus
    existingCard.updatedBy = userId

    await this.cardRepository.update({ id: cardId }, { ...existingCard })

    return { message: 'Card updated successfully' }
  }

  findAll(): Promise<Card[]> {
    return this.cardRepository.find({ relations: ['comments'] });
  }

  // findOne(id: string): Promise<Post> {
  //   return this.postsRepository.findOne(id, { relations: ['comments'] });
  // }

  // async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
  //   await this.postsRepository.update(id, updatePostDto);
  //   return this.postsRepository.findOne(id);
  // }

  async remove(id: string): Promise<void> {
    await this.cardRepository.delete(id);
  }
}
