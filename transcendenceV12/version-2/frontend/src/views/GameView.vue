<template>
    <main id="v-app">
        <section class="canvas">
            <h1>Pong !</h1>
            <p>
                <!-- {{ start == 1 ? 'Score : ' + score_p1 + ' - ' + score_p2 : 'Waiting for opponent...'}} -->
            </p>
            <canvas class="canvas-pong" id="pong" width="600" height="600"></canvas>
        </section>
    </main>
</template>


<script>
    import io from 'socket.io-client'
    import { defineComponent } from 'vue'
    

    export default defineComponent ({
        data() {
            return {
                socket : io('http://localhost:8082/game'),
                id: this.$route.query.id,
            }
        },

        created() {
            this.socket.on('connect', () => {
                this.socket.emit('init', this.id);
            });

            this.socket.on('broadcast', (data) => {
                this.draw(data);
            });

            document.addEventListener('keydown', (e) => {
                if (e.key == "ArrowUp" || e.key == "ArrowDown") {
                    this.keyDown(e.key);
                }
            });
        },

        methods: {

            draw(data) {
                var canvas = document.getElementById('pong');
                if (canvas?.getContext) {
                    var ctx = canvas.getContext('2d');
                    ctx.clearRect(0, 0, data.canvas_w, data.canvas_h);
                    ctx.fillStyle = 'rgb(200, 0, 0)';
                    ctx.fillRect(0, data.pad1_y, data.pad_w, data.pad_h);
                    ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
                    ctx.fillRect(data.canvas_w - data.pad_w , data.pad2_y, data.pad_w, data.pad_h);
                    ctx.beginPath();
                    ctx.arc(data.ball_x, data.ball_y, data.ball_r, 0, Math.PI*2);
                    ctx.fillStyle = "#0095DD";
                    ctx.fill();
                }
            },

            keyDown(e) {
                this.socket.emit('keyDown', {id: this.id, key: e});
            }
        }
    });
</script>

<!-- <script>
    import io from 'socket.io-client'
    import { defineComponent } from 'vue'

    export default defineComponent ({
        data() {
            return {
                socket: io('http://localhost:8082/game'),
                start: Number,
                score_p1: Number,
                score_p2: Number,
                pad1_y: Number,
                pad2_y: Number,
                pad_h: Number,
                pad_w: Number,
                pad_d: Number,
                ball_x: Number,
                ball_y: Number,
                ball_dx: Number,
                ball_dy: Number,
                ball_r: Number,
            }
        },

        methods: {

            draw() {
                console.log('.');
                var canvas = document.getElementById('pong');
                if (canvas.getContext) {

                    var ctx = canvas.getContext('2d');
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.fillStyle = 'rgb(200, 0, 0)';
                    ctx.fillRect(0, this.pad1_y, this.pad_w, this.pad_h);
                    ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
                    ctx.fillRect(canvas.width - this.pad_w , this.pad2_y, this.pad_w, this.pad_h);
                    if (this.start == 1) {
                        if (this.ball_x + this.ball_dx >= canvas.width - this.ball_r) {
                            this.score_p1 += 1;
                            this.ball_x = canvas.width / 2;
                            this.ball_y = canvas.height / 2;
                            this.ball_dx = -1;
                            this.ball_dy = 0;
                        }
                        if (this.ball_x + this.ball_dx <= this.ball_r) {
                            this.score_p2 += 1;
                            this.ball_x = canvas.width / 2;
                            this.ball_y = canvas.height / 2;
                            this.ball_dx = 1;
                            this.ball_dy = 0;
                        }
                        if ((this.ball_x + this.ball_dx - this.pad_w <= this.ball_r ) && (this.ball_y + this.ball_r >= this.pad1_y && this.ball_y - this.ball_r <= this.pad1_y + this.pad_h)) {
                            if (this.ball_y - this.ball_r > this.pad1_y + 2 * this.pad_h / 3) {
                                this.ball_dy -= this.ball_dy > 0 ? 1 : -1;
                            } else if (this.ball_y + this.ball_r < this.pad1_y + this.pad_h / 3){
                                this.ball_dy += this.ball_dy > 0 ? 1 : -1;
                            }
                            this.ball_dx *= -1;
                        } else if ((this.ball_x + this.ball_dx >= canvas.width - this.ball_r - this.pad_w) && (this.ball_y + this.ball_r >= this.pad2_y && this.ball_y - this.ball_r <= this.pad2_y + this.pad_h)) {
                            if (this.ball_y - this.ball_r > this.pad2_y + 2 * this.pad_h / 3) {
                                this.ball_dy -= this.ball_dy > 0 ? 1 : -1;
                            } else if (this.ball_y + this.ball_r < this.pad2_y + this.pad_h / 3){
                                this.ball_dy += this.ball_dy > 0 ? 1 : -1;
                            }
                            this.ball_dx *= -1;
                        } else if (this.ball_x + this.ball_dx >= canvas.width - this.ball_r || this.ball_x + this.ball_dx < this.ball_r) {
                            this.ball_dx *= -1;
                        } else if (this.ball_y + this.ball_dy >= canvas.height - this.ball_r || this.ball_y + this.ball_dy < this.ball_r) {
                            this.ball_dy *= -1;
                        }
                        this.ball_x += this.ball_dx;
                        this.ball_y += this.ball_dy;
                        ctx.beginPath();
                        ctx.arc(this.ball_x, this.ball_y, this.ball_r, 0, Math.PI*2);
                        ctx.fillStyle = "#0095DD";
                        ctx.fill();
                    }
                
                }
                window.requestAnimationFrame(this.draw);
            },

            handleMove(e) {
                this.socket.emit('moveToServer', { sender: this.username, message: e.key });
            }
        },

        created() {
            // this.socket = io('http://localhost:8082/game');
            this.socket.on('connect', () => {
                var canvas = document.getElementById('pong');
                this.start = 0,
                this.score_p1= 0,
                this.score_p2= 0,
                this.pad_h = 80,
                this.pad_w = 20,
                this.pad_d = 30,
                this.pad1_y = canvas.height / 2 - this.pad_h / 2,
                this.pad2_y = canvas.height / 2 - this.pad_h / 2,
                this.ball_x = canvas.width / 2,
                this.ball_y = canvas.height / 2,
                this.ball_dx = 2,
                this.ball_dy = 0,
                this.ball_r = 10,
                
                this.socket.emit('initData', {
                        score_p1 : this.score_p1,
                        score_p2 : this.score_p2,
                        pad1_y : this.pad1_y,
                        pad2_y : this.pad2_y,
                        pad_h: this.pad_h,
                        pad_w: this.pad_w,
                        pad_d: this.pad_d,
                        ball_x : this.ball_x,
                        ball_y : this.ball_y,
                        ball_dx : this.ball_dx,
                        ball_dy : this.ball_dy,
                        ball_r : this.ball_r
                    });
                this.socket.emit('syncData');
                
                this.draw();
            });

            this.socket.on('movePad', (e, player) => {
                var canvas = document.getElementById('pong');
                if (player == 'player1') {
                    if (e.message == "ArrowUp" && this.pad1_y >= this.pad_d)
                        this.pad1_y -= this.pad_d;
                    if (e.message == "ArrowDown" && this.pad1_y + this.pad_h <= canvas.height - this.pad_h)
                        this.pad1_y += this.pad_d;
                } else if (player == 'player2') {
                    if (e.message == "ArrowUp" && this.pad2_y >= this.pad_d)
                        this.pad2_y -= this.pad_d;
                    if (e.message == "ArrowDown" && this.pad2_y + this.pad_h <= canvas.height - this.pad_h)
                        this.pad2_y += this.pad_d;
                }
            });

            this.socket.on('updateData', (
                score_p1,
                score_p2,
                pad1_y,
                pad2_y,
                ball_x,
                ball_y,
                ball_dx,
                ball_dy) => {
                this.score_p1 = score_p1;
                this.score_p2 = score_p2;
                this.pad1_y = pad1_y;
                this.pad2_y = pad2_y;
                this.ball_x = ball_x;
                this.ball_y = ball_y;
                this.ball_dx = ball_dx;
                this.ball_dy = ball_dy;
            });

            this.socket.on('start', () => {
                if (this.start == 0) {
                    this.start = 1;
                }
            });

            document.addEventListener('keydown', (e) => {
                if (e.key == "ArrowUp" || e.key == "ArrowDown") {
                    this.handleMove(e);
                }
            });

        }
    });
</script> -->

<style>
.canvas-pong {
    border: 1px solid black;
}
</style>