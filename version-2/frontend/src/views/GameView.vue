<template>
    <main id="v-app">
        <section class="canvas">
            <h1>Pong !</h1>
            <p>
                {{ game.start == 1 ? 'Score : ' + game.score_p1 + ' - ' + game.score_p2 : 'Waiting for opponent...'}}
            </p>
            <canvas class="canvas-pong" id="pong" width="600" height="600"></canvas>
        </section>
    </main>
</template>
<script>
    function draw() {
        var canvas = document.getElementById('pong');
        if (canvas.getContext) {
            var ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgb(200, 0, 0)';
            ctx.fillRect(0, app.game.pad1_y, app.game.pad_w, app.game.pad_h);
            ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
            ctx.fillRect(canvas.width - app.game.pad_w , app.game.pad2_y, app.game.pad_w, app.game.pad_h);

            if (app.game.start == 1) {
                if (app.game.ball_x + app.game.ball_dx >= canvas.width - app.game.ball_r) {
                    app.game.score_p1 += 1;
                    app.game.ball_x = canvas.width / 2;
                    app.game.ball_y = canvas.height / 2;
                    app.game.ball_dx = -2;
                    app.game.ball_dy = 0;
                }
                if (app.game.ball_x + app.game.ball_dx <= app.game.ball_r) {
                    app.game.score_p2 += 1;
                    app.game.ball_x = canvas.width / 2;
                    app.game.ball_y = canvas.height / 2;
                    app.game.ball_dx = 2;
                    app.game.ball_dy = 0;
                }
                if ((app.game.ball_x + app.game.ball_dx - app.game.pad_w <= app.game.ball_r ) && (app.game.ball_y + app.game.ball_r >= app.game.pad1_y && app.game.ball_y - app.game.ball_r <= app.game.pad1_y + app.game.pad_h)) {
                    if (app.game.ball_y - app.game.ball_r > app.game.pad1_y + 2 * app.game.pad_h / 3) {
                        app.game.ball_dy -= app.game.ball_dy > 0 ? 1 : -1;
                    } else if (app.game.ball_y + app.game.ball_r < app.game.pad1_y + app.game.pad_h / 3){
                        app.game.ball_dy += app.game.ball_dy > 0 ? 1 : -1;
                    } else if (app.game.ball_dx <= 3 && app.game.ball_dx >= -3) {
                        app.game.ball_dx += app.game.ball_dx > 0 ? 1 : -1;
                    }
                    app.game.ball_dx *= -1;
                } else if ((app.game.ball_x + app.game.ball_dx >= canvas.width - app.game.ball_r - app.game.pad_w) && (app.game.ball_y + app.game.ball_r >= app.game.pad2_y && app.game.ball_y - app.game.ball_r <= app.game.pad2_y + app.game.pad_h)) {
                    if (app.game.ball_y - app.game.ball_r > app.game.pad2_y + 2 * app.game.pad_h / 3) {
                        app.game.ball_dy -= app.game.ball_dy > 0 ? 1 : -1;
                    } else if (app.game.ball_y + app.game.ball_r < app.game.pad2_y + app.game.pad_h / 3){
                        app.game.ball_dy += app.game.ball_dy > 0 ? 1 : -1;
                    } else if (app.game.ball_dx <= 3 && app.game.ball_dx >= -3) {
                        app.game.ball_dx += app.game.ball_dx > 0 ? 1 : -1;
                    }
                    app.game.ball_dx *= -1;
                } else if (app.game.ball_x + app.game.ball_dx >= canvas.width - app.game.ball_r || app.game.ball_x + app.game.ball_dx < app.game.ball_r) {
                    app.game.ball_dx *= -1;
                } else if (app.game.ball_y + app.game.ball_dy >= canvas.height - app.game.ball_r || app.game.ball_y + app.game.ball_dy < app.game.ball_r) {
                    app.game.ball_dy *= -1;
                }
                app.game.ball_x += app.game.ball_dx;
                app.game.ball_y += app.game.ball_dy;
                ctx.beginPath();
                ctx.arc(app.game.ball_x, app.game.ball_y, app.game.ball_r, 0, Math.PI*2);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
            }
            app.socket.game.emit('syncData', {
                score_p1 : app.game.score_p1,
                score_p2 : app.game.score_p2,
                pad1_y : app.game.pad1_y,
                pad2_y : app.game.pad2_y,
                pad_h: app.game.pad_h,
                pad_w: app.game.pad_w,
                pad_d: app.game.pad_d,
                ball_x : app.game.ball_x,
                ball_y : app.game.ball_y,
                ball_dx : app.game.ball_dx,
                ball_dy : app.game.ball_dy,
                ball_r : app.game.ball_r
            });
            app.socket.game.emit('initData');
        }
    }
    setInterval(draw, 10);

    var app = new Vue({
        el: '#v-app',
        data: {
            username: '',
            socket: { game: null},
            game: {
                start: 0,
                score_p1: 0,
                score_p2: 0,
                pad1_y: 0,
                pad2_y: 0,
                pad_h: 0,
                pad_w: 0,
                pad_d: 0,
                ball_x: 0,
                ball_y: 0,
                ball_dx: 0,
                ball_dy: 0,
                ball_r: 0
            }
        },
        methods: {
            
            handleMove(e) {
                this.socket.game.emit('moveToServer', { sender: this.username, message: e.key });
            }

        },
        created() {

            this.socket.game = io('http://localhost:3000/game');

            this.socket.game.on('connect', () => {
                var canvas = document.getElementById('pong');
                this.game.score_p1= 0,
                this.game.score_p2= 0,
                this.game.pad_h = 80,
                this.game.pad_w = 20,
                this.game.pad_d = 30,
                this.game.pad1_y = canvas.height / 2 - this.game.pad_h / 2,
                this.game.pad2_y = canvas.height / 2 - this.game.pad_h / 2,
                this.game.ball_x = canvas.width / 2,
                this.game.ball_y = canvas.height / 2,
                this.game.ball_dx = 2,
                this.game.ball_dy = 0,
                this.game.ball_r = 10,
                this.socket.game.emit('initData');
                this.socket.game.emit('syncData');
            });

            this.socket.game.on('movePad', (e, player) => {
                var canvas = document.getElementById('pong');
                if (player == 'player1') {
                    if (e.message == "ArrowUp" && this.game.pad1_y >= this.game.pad_d)
                        this.game.pad1_y -= this.game.pad_d;
                    if (e.message == "ArrowDown" && this.game.pad1_y + this.game.pad_h <= canvas.height - this.game.pad_h)
                        this.game.pad1_y += this.game.pad_d;
                } else if (player == 'player2') {
                    if (e.message == "ArrowUp" && this.game.pad2_y >= this.game.pad_d)
                        this.game.pad2_y -= this.game.pad_d;
                    if (e.message == "ArrowDown" && this.game.pad2_y + this.game.pad_h <= canvas.height - this.game.pad_h)
                        this.game.pad2_y += this.game.pad_d;
                }
                draw();
            });

            this.socket.game.on('updateData', (
                score_p1,
                score_p2,
                pad1_y,
                pad2_y,
                ball_x,
                ball_y,
                ball_dx,
                ball_dy) => {
                this.game.score_p1 = score_p1;
                this.game.score_p2 = score_p2;
                this.game.pad1_y = pad1_y;
                this.game.pad2_y = pad2_y;
                this.game.ball_x = ball_x;
                this.game.ball_y = ball_y;
                this.game.ball_dx = ball_dx;
                this.game.ball_dy = ball_dy;
            });

            this.socket.game.on('start', () => {
                if (this.game.start == 0) {
                    console.log(this.username, 'start');
                    this.game.start = 1;
                    draw();
                }
            });

            document.addEventListener('keydown', (e) => {
                if (e.key == "ArrowUp" || e.key == "ArrowDown") {
                    this.handleMove(e);
                }
            });

        }
    });
</script>