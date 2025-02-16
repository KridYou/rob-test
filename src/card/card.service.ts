import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from './entities/card.entity';
import { CreateCardDto } from './dto/create-card.dto';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
  ) {}

  async create(createPostDto: CreateCardDto): Promise<Card> {
    const createdCard: Card = this.cardRepository.create(createPostDto);
    console.log('createdCard', createdCard)
    // return await this.cardRepository.save(createdCard);
    return createdCard
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
