import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCardDto } from './create-card.dto';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { CardStatus } from 'src/common/card-status.enum';

export class UpdateCardDto extends PartialType(CreateCardDto) {
    @ApiProperty({ example: 'Job interview appointment' })
    @IsOptional()
    @IsString()
    topic?: string;

    @ApiProperty({ example: 'Description of the interview' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ example: CardStatus.TO_DO })
    @IsOptional()
    @IsEnum(CardStatus)
    cardStatus?: CardStatus;

    @ApiProperty({ example: false })
    @IsOptional()
    @IsBoolean()
    isStored?: boolean;
}
