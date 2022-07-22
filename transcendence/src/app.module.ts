import { Module } from '@nestjs/common';
// import { AppGateway } from './app.gateway';
import { GameGateway } from './game/game.gateway';
import { AlertGateway } from './alert/alert.gateway';
import { AlertController } from './alert/alert.controller';

@Module({
  imports: [],
  controllers: [AlertController],
  providers: [GameGateway, AlertGateway],
})
export class AppModule {}
