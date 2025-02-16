import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';
import { Card } from './card.entity';
import { CardStatus } from 'src/common/card-status.enum';

@Entity('card_histories')
export class CardHistory {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column()
    topic: string;

    @Column()
    description: string;

    @Column({
        type: 'enum',
        enum: CardStatus,
        default: CardStatus.TO_DO,
    })
    cardStatus: CardStatus;

    @Column()
    createdBy: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    createdAt: Date;

    @ManyToOne(() => Card, (card) => card.histories, { onDelete: 'CASCADE' })
    card: Card;
}
