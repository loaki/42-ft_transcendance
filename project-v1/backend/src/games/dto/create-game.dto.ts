import { IsString, IsOptional, IsInt } from 'class-validator';
// import { User } from 'src/users/entities/users.entity';
import { GameMode } from '../class/Constants';

export class CreateGameDto {
    
    //readonly players: User[];

    @IsOptional()
    @IsInt()
    readonly winnerId: string;
    
    @IsOptional()
    @IsInt()
    readonly loserId: string;
    
    @IsOptional()
    @IsInt()
    readonly winnerScore: number;

    @IsOptional()
    @IsInt()
    readonly loserScore: number;

    @IsOptional()
    @IsString()
    readonly createdAt: Date;

    @IsOptional()
    @IsString()
    readonly endedAt: Date;

    @IsOptional()
    @IsInt()
    readonly gameDuration: number;

    @IsOptional()
    @IsInt()
    readonly mode: GameMode;
}
