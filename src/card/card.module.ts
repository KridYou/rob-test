import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card, Comment } from './entities/card.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Card, Comment])],
  controllers: [CardController],
  providers: [CardService],
})
export class CardModule {}
