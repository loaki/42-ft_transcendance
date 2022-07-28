import Vue, {createApp} from 'vue'

// export default {
var app = new Vue({
	el: '#v-app',
	data: {
		title: 'Lu Chat!',
		username: '',
		text: '',
		messages: {
			general: [],
		},
		rooms: {
			general: false,
		},
		socket: { chat: null },
		activeRoom: 'general',
	}, 
	methods: {
		sendChatMessage() {
			// Check user is member of active group
			if (this.isMemberOfActiveRoom) {
				this.socket.chat.emit('chatToServer', {
					sender: this.username,
					room: this.activeRoom,
					message: this.text
				});
				this.text = '';
			} else {
				alert('You are not a member of this group');
			}
		},
		receiveChatMessage(msg) {
			// console.log(msg.room);
			this.messages[msg.room].push(msg);
		},
		toggleRoomMembership() {
			if (this.isMemberOfActiveRoom) {
				this.socket.chat.emit('leaveRoom', {
					room: this.activeRoom,
					user: this.username
				});
			} else {
				this.socket.chat.emit('joinRoom', {
					room: this.activeRoom,
					user: this.username
				});
			}
		},
		onScreen(msg) {
			console.log(msg.mes);
			// this.messages[room].push(msg);
		}
	},
	computed: {
		isMemberOfActiveRoom() {
			return this.rooms[this.activeRoom];
		}
	},
	created() {
		this.username= prompt('Enter your username');

		this.socket.chat = io("http://localhost:3000/chat");
		this.socket.chat.on('chatToClient', (msg) => {
			this.receiveChatMessage(msg);
		});

		this.socket.chat.on('connect', () => {
			this.toggleRoomMembership();
		});

		this.socket.chat.on('joinedRoom', (room) => {
			this.rooms[room] = true;
		})

		this.socket.chat.on('leftRoom', (room) => {
			this.rooms[room] = false;
		})

		this.socket.chat.on('test', (msg) => {
			this.onScreen(msg);
		})
	}
});
// }