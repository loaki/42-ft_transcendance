export class GameManager {
    games: GameData[] = [];

    newGame(id: string): GameData {
        if (this.getGame(id)) {
            console.log('exist');
            return this.getGame(id);
        }
        console.log('new');
        const gameData = new GameData(id,
            600,600,'','',0,0,300,300,50,20,10,300,300,1,0,10);
        this.games.push(gameData);
        return gameData;
    }

    getGame(id: string): GameData {
        return this.games.find(gameData => gameData.id == id);
    }

    getAllGames(): GameData[] {
        return this.games;
    }

    constructor () {}
}

export class GameData {
    id: string;
    sockets_id: string[] = [];
    canvas_w: number;
    canvas_h: number;
    p1_id: string;
    p2_id: string;
    score_p1: number;
    score_p2: number;
    pad1_y: number;
    pad2_y: number;
    pad_h: number;
    pad_w: number;
    pad_d: number;
    ball_x: number;
    ball_y: number;
    ball_dx: number;
    ball_dy: number;
    ball_r: number;

    constructor (id: string,
        canvas_w: number,
        canvas_h: number,
        p1_id: string,
        p2_id: string,
        score_p1: number,
        score_p2: number,
        pad1_y: number,
        pad2_y: number,
        pad_h: number,
        pad_w: number,
        pad_d: number,
        ball_x: number,
        ball_y: number,
        ball_dx: number,
        ball_dy: number,
        ball_r: number) {
        this.id = id;
        this.canvas_w = canvas_w;
        this.canvas_h = canvas_h;
        this.p1_id = p1_id;
        this.p2_id = p2_id;
        this.score_p1 = score_p1;
        this.score_p2 = score_p2;
        this.pad1_y = pad1_y;
        this.pad2_y = pad2_y;
        this.pad_h = pad_h;
        this.pad_w = pad_w;
        this.pad_d = pad_d;
        this.ball_x = ball_x;
        this.ball_y = ball_y;
        this.ball_dx = ball_dx;
        this.ball_dy = ball_dy;
        this.ball_r = ball_r;
    }

    movePad(player_id: string, key: string) {
        if (player_id == this.p1_id) {
            if (key == "ArrowUp" && this.pad1_y > 0)
                this.pad1_y -= this.pad_d;
            if (key == "ArrowDown" && this.pad1_y + this.pad_h < this.canvas_h)
                this.pad1_y += this.pad_d;
        } else if (player_id == this.p2_id) {
            if (key == "ArrowUp" && this.pad2_y > 0)
                this.pad2_y -= this.pad_d;
            if (key == "ArrowDown" && this.pad2_y + this.pad_h < this.canvas_h)
                this.pad2_y += this.pad_d;
        }
    }

    moveBall() {
        if (this.ball_x + this.ball_dx >= this.canvas_w - this.ball_r) {
            this.score_p1 += 1;
            this.ball_x = this.canvas_w / 2;
            this.ball_y = this.canvas_w / 2;
            this.ball_dx = -1;
            this.ball_dy = 0;
        }
        if (this.ball_x + this.ball_dx <= this.ball_r) {
            this.score_p2 += 1;
            this.ball_x = this.canvas_w / 2;
            this.ball_y = this.canvas_h / 2;
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
        } else if ((this.ball_x + this.ball_dx >= this.canvas_w - this.ball_r - this.pad_w) && (this.ball_y + this.ball_r >= this.pad2_y && this.ball_y - this.ball_r <= this.pad2_y + this.pad_h)) {
            if (this.ball_y - this.ball_r > this.pad2_y + 2 * this.pad_h / 3) {
                this.ball_dy -= this.ball_dy > 0 ? 1 : -1;
            } else if (this.ball_y + this.ball_r < this.pad2_y + this.pad_h / 3){
                this.ball_dy += this.ball_dy > 0 ? 1 : -1;
            }
            this.ball_dx *= -1;
        } else if (this.ball_x + this.ball_dx >= this.canvas_w - this.ball_r || this.ball_x + this.ball_dx < this.ball_r) {
            this.ball_dx *= -1;
        } else if (this.ball_y + this.ball_dy >= this.canvas_h - this.ball_r || this.ball_y + this.ball_dy < this.ball_r) {
            this.ball_dy *= -1;
        }
        this.ball_x += this.ball_dx;
        this.ball_y += this.ball_dy;
    }
}