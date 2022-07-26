import { Logger } from '@nestjs/common';
import { OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, ConnectedSocket, MessageBody } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

import { Injectable } from '@nestjs/common';
import { ChatCommands } from './chat.commandFn';

export class Room {
  constructor(roomName: string, owner: string) {
    this.roomName = roomName;
    this.owner = owner;
    this.admins.push(owner);
    this.users.push(owner);
  };

  private logger = new Logger('Room');

  
  roomName: string;
  owner: string;
  admins: string[] = [];
  users: string[] = [];
  banned: string[] = [];

  addUser(user: string) {
    this.logger.log(user);
    this.users.push(user);
  }

  logUsers() {
    this.logger.log(this.users);
  }

}


@Injectable()
export class ChatService {

  constructor(private chatCommands: ChatCommands) {}

	async execute(room: string, message: string, client: Socket) {
    const commands = {
      "/create": this.chatCommands.create

    }

    // client.leave(room)
    // client.emit('leftRoom', room)
    // let mes = 'hello'
    // client.emit('test', {client, room, mes})
    // client.to(room).emit('test', 'hello im server');
    const msg = message.split(' ')
    if (msg[0] in commands) {
      // console.log(commands[msg[0]])
      // if (msg.length > 2) {
      //   console.log('too many args')
        return commands[msg[0]];
      // }
    }
 
  }
}

let chans: Array<Room> = [];

function getRoom(roomName: string) {
  return chans.find(room => room.roomName === roomName);
}

// function ft_create(sender: string, room:string, newRoom: string) {

// }

// function handleCommand(client: Socket, sender: string, room:string, newRoom: string) : boolean {
//   const commands {
//     "/create": ft_create(sender, room, newRoom),
//   }


//   return 1;
// }

@WebSocketGateway(8888, { cors: true})
export class ChatGateway implements OnGatewayInit {

  @WebSocketServer() server: Server;

  constructor(private chatService: ChatService, private chatCommands: ChatCommands) {}

  private logger: Logger = new Logger('ChatGateway');

  afterInit(server: any) {
    this.logger.log('Initialized');
  }

  @SubscribeMessage('chatToServer')
  handleMessage(@ConnectedSocket() client: Socket, @MessageBody() message: {sender: string, room: string, message: string}) {
    if (message.message.startsWith('/')) {
      let fn = this.chatService.execute(message.room, message.message, client);
      this.server.to(message.room).emit('commandResponse', message);
      // let msg = message.message.split(' ');
      // if (msg.length > 2) {
      //   this.server.emit('chatToClient', { sender: 'Server', room: message.room, message: 'Wrong number of arguments' });
      // } else {
      //   // HANDLE COMMAND
      //   if (handleCommand(client, message.sender, message.room, msg[1])) {
      //     this.server.emit('chatToClient', { sender: 'Server', room: message.room, message: msg[1] + ' room created' });
      //   } else
      //     this.server.emit('chatToClient', { sender: 'Server', room: message.room, message: 'Error creating room' });
      // }
      // }
    } else {
      this.server.to(message.room).emit('chatToClient', message);
    }
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, info: {room: string, user: string}) {
    // console.log('salut pierre');
    this.logger.log('salut pierre');
    if (!(getRoom(info.room))) {
      const chan = new Room(info.room, info.user);
      chans.push(chan);
      console.log(getRoom(info.room));
    } else {
      getRoom(info.room).addUser(info.user);
      console.log(getRoom(info.room));
    }
    client.join(info.room);
    client.emit('joinedRoom', info.room); // this is a message communicating to the specific client
  }


  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, info: {room: string, user: string}) {
    client.leave(info.room);
    client.emit('leftRoom', info.room); // this is a message communicating to the specific client
  }

}
