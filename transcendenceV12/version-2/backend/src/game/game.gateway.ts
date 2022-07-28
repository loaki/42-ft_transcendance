import { Injectable, Logger } from '@nestjs/common';
import { OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameData, GameManager } from './game.model'
import { Interval } from '@nestjs/schedule'

@WebSocketGateway(8082, { cors: true, namespace: '/game'})
export class GameGateway implements OnGatewayInit {

  gameManager = new GameManager()
  public static clients: Socket[] = [];

  @WebSocketServer() wss: Server;

  private logger: Logger = new Logger('GameGateway');

  async handleConnection(client: Socket) {
    GameGateway.clients.push(client);
  }

  afterInit(server: any) {
    this.logger.log('Initialized');
  }

  @SubscribeMessage('init')
  init(client: Socket, id: string) {
    let game = this.gameManager.newGame(id);
    game.sockets_id.push(client.id);
    if (game.p1_id == '') {
      game.p1_id = client.id;
    } else if (game.p2_id == '') {
      game.p2_id = client.id;
    }
  }

  @Interval(10)
  sendGameData() {
    this.gameManager.getAllGames().forEach(game => {
      game.moveBall();
      game.sockets_id.forEach(socket_id => {
        GameGateway.clients.find(client => client.id === socket_id)?.emit('broadcast', game );
      })
    });
  }

  @SubscribeMessage('keyDown')
  keyDown(client: Socket, message: { id:string, key: string }) {
    // let game = this.gameManager.getGame(id);
    let game = this.gameManager.getGame(message.id);
    if (message.key == "ArrowUp" || message.key == "ArrowDown")
    game.movePad(client.id, message.key);
  }

  // @SubscribeMessage('gameToServer')
  // handleMessage(client: Socket, message: { sender: string, room: string, message: string }) {
  //   this.wss.to(message.room).emit('gameToClient', message);
  // }

  // @SubscribeMessage('moveToServer')
  // handleMove(client: Socket, message: { sender: string, message: string }) {
  //   if (this.player1_id == client.id) {
  //     this.wss.emit('movePad', message, 'player1');
  //   }
  //   if (this.player2_id == client.id) {
  //     this.wss.emit('movePad', message, 'player2');
  //   }
  // }

  // @SubscribeMessage('initData')
  // initData(client: Socket, data: {
  //   score_p1 : number,
  //   score_p2 : number,
  //   pad1_y : number,
  //   pad2_y : number,
  //   pad_h: number,
  //   pad_d: number,
  //   ball_x : number,
  //   ball_y : number,
  //   ball_dx : number,
  //   ball_dy : number,
  //   ball_r : number }) {
  //   if (this.player1_id == client.id) {
  //     this.score_p1 = data.score_p1;
  //     this.score_p2 = data.score_p2;
  //     this.pad1_y = data.pad1_y;
  //     this.pad2_y = data.pad2_y;
  //     this.ball_x = data.ball_x;
  //     this.ball_y = data.ball_y;
  //     this.ball_dx = data.ball_dx;
  //     this.ball_dy = data.ball_dy;
  //   }
  // }

  // @SubscribeMessage('syncData')
  // syncData(client: Socket) {
  //   if (this.player1_id == '') {
  //     this.player1_id = client.id;
  //   }
  //   if (this.player1_id != client.id) {
  //     client.emit('updateData',
  //       this.score_p1,
  //       this.score_p2,
  //       this.pad1_y,
  //       this.pad2_y,
  //       this.ball_x,
  //       this.ball_y,
  //       this.ball_dx,
  //       this.ball_dy);
  //       if (this.player2_id == '') {
  //         this.player2_id = client.id;
  //       }
  //       this.wss.emit('start');
  //   }
  // }
}
