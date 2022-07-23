import { Module } from '@nestjs/common';
// import { AppGateway } from './app.gateway';
import { GameGateway } from './game/game.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [GameGateway],
})
export class AppModule {}
