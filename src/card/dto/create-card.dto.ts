import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum } from 'class-validator';
import { CardStatus } from 'src/common/card-status.enum';

export class CreateCardDto {
    @ApiProperty({ example: 'Job interview appointment' })
    @IsString()
    topic: string;

    @ApiProperty({ example: 'Description of the interview' })
    @IsString()
    description: string;

    @ApiProperty({ example: CardStatus.TO_DO })
    @IsEnum(CardStatus)
    cardStatus: CardStatus;
}

export class CreateCommentDto {
    @ApiProperty({ example: 'Some comment' })
    @IsString()
    content: string;
}