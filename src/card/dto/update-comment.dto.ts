import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCommentDto } from './create-card.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
    @ApiProperty({ example: 'Some comment' })
    @IsString()
    @IsOptional()
    content?: string;
}
