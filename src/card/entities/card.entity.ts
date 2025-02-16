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

    @OneToMany(() => Comment, (comment) => comment.post, { cascade: true })
    comments: Comment[];

    @Column()
    created_by: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

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
    post: Card;

    @Column()
    created_by: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
