import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { CardHistory } from './card-histories.entity';
import { CardStatus } from 'src/common/card-status.enum';

@Entity()
export class Card {
    @PrimaryGeneratedColumn('uuid')
    id: string;

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

    @OneToMany(() => Comment, (comment) => comment.card, { cascade: true })
    comments: Comment[];

    @Column()
    createdBy: string;

    @Column({nullable: true})
    updatedBy: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    updatedAt: Date;

    @OneToMany(() => CardHistory, (history) => history.card, { cascade: true })
    histories: CardHistory[];
}

@Entity()
export class Comment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    content: string;

    @ManyToOne(() => Card, (card) => card.comments, { onDelete: 'CASCADE' })
    card: Card;

    @Column()
    createdBy: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    updatedAt: Date;
}
