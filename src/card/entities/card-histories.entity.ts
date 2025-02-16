import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';
import { Card } from './card.entity';

@Entity('card_histories')
export class CardHistory {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @ManyToOne(() => Card, (card) => card.histories, { onDelete: 'CASCADE' })
    card: Card;

    @Column()
    previousContent: string;

    @Column()
    previousTitle: string;

    @CreateDateColumn()
    editedAt: Date;
}
