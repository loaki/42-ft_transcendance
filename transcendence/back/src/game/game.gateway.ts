import { Logger } from '@nestjs/common';
import { OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: '/game' })
export class GameGateway implements OnGatewayInit {

  player1_id = '';
  player2_id = '';
  score_p1 = 0;
  score_p2 = 0;
  pad1_y = 0;
  pad2_y = 0;
  ball_x = 0;
  ball_y = 0;
  ball_dx = 0;
  ball_dy = 0;

  @WebSocketServer() wss: Server;

  private logger: Logger = new Logger('GameGateway');

  afterInit(server: any) {
    this.logger.log('Initialized');
  }

  @SubscribeMessage('gameToServer')
  handleMessage(client: Socket, message: { sender: string, room: string, message: string }) {
    this.wss.to(message.room).emit('gameToClient', message);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string) {
    client.join(room);
    client.emit('joinedRoom', room);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, room: string) {
    client.leave(room);
    client.emit('leftRoom', room);
  }

  @SubscribeMessage('moveToServer')
  handleMove(client: Socket, message: { sender: string, message: string }) {
    if (this.player1_id == client.id) {
      this.wss.emit('movePad', message, 'player1');
    }
    if (this.player2_id == client.id) {
      this.wss.emit('movePad', message, 'player2');
    }
  }

  @SubscribeMessage('syncData')
  syncData(client: Socket, data: {
    score_p1 : number,
    score_p2 : number,
    pad1_y : number,
    pad2_y : number,
    pad_s: number,
    pad_d: number,
    ball_x : number,
    ball_y : number,
    ball_dx : number,
    ball_dy : number,
    ball_r : number }) {
    if (this.player1_id == client.id) {
      this.score_p1 = data.score_p1;
      this.score_p2 = data.score_p2;
      this.pad1_y = data.pad1_y;
      this.pad2_y = data.pad2_y;
      this.ball_x = data.ball_x;
      this.ball_y = data.ball_y;
      this.ball_dx = data.ball_dx;
      this.ball_dy = data.ball_dy;
      console.log(this.pad1_y, 
        this.pad2_y, 
        this.ball_x, 
        this.ball_y, 
        this.ball_dx, 
        this.ball_dy );
    }
  }

  @SubscribeMessage('initData')
  initData(client: Socket) {
    if (this.player1_id == '') {
      this.player1_id = client.id;
    }
    if (this.player1_id != client.id) {
      client.emit('updateData',
        this.score_p1,
        this.score_p2,
        this.pad1_y,
        this.pad2_y,
        this.ball_x,
        this.ball_y,
        this.ball_dx,
        this.ball_dy);
        if (this.player2_id == '') {
          this.player2_id = client.id;
          this.wss.emit('start');
        }
        if (this.player1_id != client.id && this.player2_id != client.id) {
          client.emit('start');
        }
    }
  }
}
