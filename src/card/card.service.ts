import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card, Comment } from './entities/card.entity';
import { CreateCardDto, CreateCommentDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { CardHistory } from './entities/card-histories.entity';
import { UpdateCommentDto } from './dto/update-comment.dto';

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

  async updateCard(cardId: string, updateCardDto: UpdateCardDto, userId: string): Promise<{ message: string }> {
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

    existingCard.topic = updateCardDto.topic
    existingCard.description = updateCardDto.description
    existingCard.cardStatus = updateCardDto.cardStatus
    existingCard.updatedBy = userId

    await this.cardRepository.update({ id: cardId }, { ...existingCard })

    return { message: 'Card updated successfully' }
  }

  async updateComment(commentId: string, updateCommentDto: UpdateCommentDto): Promise<{ message: string }> {
    const existingComment: Comment = await this.commentRepository.findOne({ where: { id: commentId } })
    if (!existingComment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }

    existingComment.content = updateCommentDto.content

    await this.commentRepository.update({ id: commentId }, { ...existingComment })

    return { message: 'Comment updated successfully' }
  }

  async findCardById(id: string): Promise<Card> {
    const card = await this.cardRepository.findOne({ where: { id } });

    if (!card) {
      throw new NotFoundException(`Card with ID ${id} not found`);
    }

    return card;
  }

  async findCommentById(id: string): Promise<Comment> {
    const comment = await this.commentRepository.findOne({ where: { id } });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    return comment;
  }

  findAll(): Promise<Card[]> {
    return this.cardRepository.find({ relations: ['comments'] });
  }

  async remove(id: string): Promise<void> {
    await this.cardRepository.delete(id);
  }
}
