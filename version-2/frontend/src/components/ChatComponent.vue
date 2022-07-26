<template>
    <h1>{{ title }}</h1>
        <div class="tab-row">
            <button class="tab-btn" :class="{ active: activeRoom == 'general' }" @click="activeRoom = 'general'">General</button>				</div>
        <div class="tab-row">
            Status {{ isMemberOfActiveRoom ? 'Joined' : 'Not Joined' }} 
            <button @click="toggleRoomMembership()">{{ isMemberOfActiveRoom ? 'Leave' : 'Join' }}</button>
        </div>
        <div style="border: 1px solid black; height: 500px">
            <ul style="list-style: none;">
                <li v-for="msg of messages[activeRoom]" :key="msg">
                    <strong>{{ msg.sender }}:</strong> {{ msg.message }}
                </li>
            </ul>
        </div>
        <form>
            <input v-model="text" type="text">
            <button type="submit" @click.prevent="sendChatMessage()">Send</button>
        </form>
</template>

<script>
// import * as io from 'socket.io-client'
import io from 'socket.io-client'

export default {

    name: 'ChatComponent',
    // sockets: {
    //     connect: function () {
    //         console.log('connected to server');
    //     },
    //     disconnect: function () {
    //         console.log('disconnected from server');
    //     },
    //     message: function (message) {
    //         console.log('message received: ' + message);
    //     }
    // },
    data() {
        return {
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
        }
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
            console.log('before if')
            if (this.isMemberOfActiveRoom) {
                console.log('inside if')
                this.socket.chat.emit('leaveRoom', {
                    room: this.activeRoom,
                    user: this.username
                });
                console.log('after emit')
            } else {
                console.log('joining room');
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
        // this.socket.chat = $socketio;
        console.log('hello from chat component');
        // this.$socketio.on('chatToClient', (msg) => {
        //     console.log(msg)
        //     // this.receiveChatMessage(msg);
        // });
        // console.log('hello from chat component 2');
        this.username= 'Ecole 42' //prompt('Enter your username');

        console.log('totototo')
        // this.$socketio = io("http://localhost:8081");
        // console.log(process.env.VUE_APP_CHAT_PORT )
        this.socket.chat = io("http://localhost:8888");
        this.socket.chat.on('chatToClient', (msg) => {
            console.log(msg);
            this.receiveChatMessage(msg);
        });

        this.socket.chat.on('connect', () => {
            console.log('connecting');
            this.toggleRoomMembership();
        });

        this.socket.chat.on('joinedRoom', (room) => {
            this.rooms[room] = true;
        })

        this.socket.chat.on('leftRoom', (room) => {
            this.rooms[room] = false;
        })

        this.socket.chat.on('commandResponse', (msg) => {
            console.log(msg);
            this.receiveChatMessage(msg);
            // this.onScreen(msg);
        })
    }
}


</script>

<style>

</style>
