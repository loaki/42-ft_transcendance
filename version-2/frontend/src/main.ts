import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import io from 'socket.io-client'
import * as io from 'socket.io-client'
// import VueSocketIO from 'vue-socket.io'

const app = createApp(App)

// app.config.globalProperties.$socketio = io.connect('http://localhost:8085');
// console.log(app.config.globalProperties.$socketio)
app.use(store).use(router).mount('#app')