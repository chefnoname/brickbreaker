//collision detection
function detectcollision(ball, gameObject) {

    // collision with paddle
    let bottomofBall = ball.position.y + ball.size;

    let topOfBall = ball.position.y;

    let topOfObject = gameObject.position.y;

    let leftSideOfObject = gameObject.position.x;

    let rightSideOfObject = gameObject.position.x + gameObject.width;

    let bottomOfObject = gameObject.position.y + gameObject.height;

    if (bottomofBall >= topOfObject &&
        topOfBall <= bottomOfObject &&
        ball.position.x >= leftSideOfObject &&
        ball.position.x + ball.size <= rightSideOfObject

    ) {
        return true;
    } else {
        return false;
    }
}

// diffuclt levels

function buildLevel(game, level) {
    let bricks = [];

    level.forEach((row, rowIndex) => {
        row.forEach((brick, brickIndex) => {
            if (brick === 1) {

                let position = {

                    x: 80 * brickIndex,

                    y: 75 + 24 * rowIndex
                };

                bricks.push(new Brick(game, position));
            }
        });
    });

    return bricks;
}

const level1 = [
   [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],

   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],

    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],

    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
     

]

const level2 = [ 
    
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],

   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],

    [1, 1, 1, 1, 1, 1, 1],

    [1, 1, 0, 1, 1, 0, 1, 1, 1, 1]


]

//BRICK SQUAAAAD lol i meant class
class Brick {
    constructor(game, position) {
        this.image = document.getElementById('brick');

        this.game = game;

        this.position = position;

        this.width = 80;
        this.height = 24;

        this.markedForDeletion = false;
    }


    update() {
        if (detectcollision(this.game.ball, this)) {
            this.game.ball.speed.y = -this.game.ball.speed.y;

            this.markedForDeletion = true;
        }
    }

    draw(ctx) {

        ctx.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )

    }
}



//Game JS File

const GAMESTATE = {

    PAUSED: 0,

    RUNNING: 1,

    MENU: 2,

    GAMEOVER: 3,

    NEWLEVEL: 4,
}

class Game {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;

        this.gameState = GAMESTATE.MENU;
        this.paddle = new Paddle(this);
        this.ball = new Ball(this);

        this.gameObjects = [];

        this.lives = 3;

        this.bricks = [];

        this.levels = [level1, level2];

        this.currentLevel = 0;

        new InputHandler(this.paddle, this);
    }

    start() {

        if (
            
            this.gameState !== GAMESTATE.MENU && 
            
            this.gameState !== GAMESTATE.NEWLEVEL
            
            ) 
            
            return;


       this.bricks = buildLevel(this, this.levels[this.currentLevel]);

      this.ball.reset();

        this.gameObjects = [this.ball, this.paddle];

        this.gameState = GAMESTATE.RUNNING;


    }




    update(deltaTime) {

        if (this.lives === 0) this.gameState = GAMESTATE.GAMEOVER;


        if (
            this.gameState === GAMESTATE.PAUSED ||

            this.gameState === GAMESTATE.MENU ||

            this.gameState === GAMESTATE.GAMEOVER

        )

            return;


        if(this.bricks.length === 0) {

        this.currentLevel++;

        this.gameState = GAMESTATE.NEWLEVEL;

        this.start();

        }


        [...this.gameObjects, ...this.bricks].forEach((object) => object.update(deltaTime));

        this.bricks = this.bricks.filter(brick => !brick.markedForDeletion);
    }

    draw(ctx) {

        [...this.gameObjects, ...this.bricks].forEach((object) => object.draw(ctx));

        if (this.gameState === GAMESTATE.PAUSED) {
            ctx.rect(0, 0, this.gameWidth, this.gameHeight);
            ctx.fillStyle = "rgba(0,0,0,0.5)";

            ctx.fill();

            ctx.font = "30px Arial";
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.fillText("Paused", this.gameWidth / 2, this.gameHeight / 2);
        }

        if (this.gameState === GAMESTATE.MENU) {
            ctx.rect(0, 0, this.gameWidth, this.gameHeight);
            ctx.fillStyle = "rgba(0, 0, 0, 1)";

            ctx.fill();

            ctx.font = "30px Arial";
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.fillText("Press SPACEBAR To Start", this.gameWidth / 2, this.gameHeight / 2);
        }

        if (this.gameState === GAMESTATE.GAMEOVER) {
            ctx.rect(0, 0, this.gameWidth, this.gameHeight);
            ctx.fillStyle = "rgba(0,0,0,1)";

            ctx.fill();

            ctx.font = "30px Arial";
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.fillText("GAMEOVER MATE", this.gameWidth / 2, this.gameHeight / 2);
        }
    }

    togglePause() {
        // game states

        if (this.gameState == GAMESTATE.PAUSED) {
            this.gameState = GAMESTATE.RUNNING;
        } else {
            this.gameState = GAMESTATE.PAUSED;
        }
    }
}




// ball JS file
class Ball {
    constructor(game) {
        this.image = document.getElementById('ball');

        this.gameWidth = game.gameWidth;
        this.gameHeight = game.gameHeight;

        this.game = game;
        this.size = 20;
        this.reset();

    }

    reset() {

        
        this.position = { x: 10, y: 400 };

        this.speed = { x: 3, y: -2 };


    }



    draw(ctx) {

        ctx.drawImage(

            this.image,
            this.position.x,
            this.position.y,
            this.size,
            this.size

        );

    }

    update(deltaTime) {

        this.position.x += this.speed.x;
        this.position.y += this.speed.y;


        // wall on left or right of screen
        if (this.position.x + this.size > this.gameWidth || this.position.x < 0) {
            this.speed.x = -this.speed.x;
        }

        // wall on top of screen
        if (this.position.y < 0) {
            this.speed.y = -this.speed.y;
        }

        // bottom of screen
        if(this.position.y + this.size > this.gameHeight){
            this.game.lives--;
            this.reset()
        }


        if (detectcollision(this, this.game.paddle)) {
            this.speed.y = -this.speed.y;

            this.position.y = this.game.paddle.position.y - this.size;
        }
    }
}




// should be input.js need to learn how to import!!!
class InputHandler {
    constructor(paddle, game) {
        document.addEventListener('keydown', (event) => {

            switch (event.keyCode) {
                case 37:

                    paddle.moveLeft();

                    break;

                case 39:

                    paddle.moveRight();

                    break;

                case 27:

                    game.togglePause();

                    break;

                case 32:

                    game.start();

                    break;
            }
        });

        document.addEventListener('keyup', (event) => {

            switch (event.keyCode) {
                case 37:

                    if (paddle.speed < 0) paddle.stop();


                    break;

                case 39:
                    if (paddle.speed > 0) paddle.stop();

                    break;
            }
        });
    }
}









//meant to be paddle.js 
//don't know how to import :(

class Paddle {
    constructor(game) {
        this.gameWidth = game.gameWidth;

        this.width = 150;
        this.height = 20;

        this.maxSpeed = 6;
        this.speed = 0;

        this.position = {
            x: game.gameWidth / 2 - this.width / 2,
            y: game.gameHeight - this.height - 10

        }

    }

    moveLeft() {
        this.speed = -this.maxSpeed;
    }

    moveRight() {
        this.speed = this.maxSpeed;
    }

    stop() {
        this.speed = 0;
    }

    draw(ctx) {

        ctx.fillStyle = '#0ff';

        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)



    }


    update(deltaTime) {


        this.position.x += 5 / deltaTime;

        this.position.x += this.speed;

        if (this.position.x < 0)
            this.position.x = 0;

        if (this.position.x + this.width > this.gameWidth)
            this.position.x = this.gameWidth - this.width;

    }
};


// index code 
let canvas = document.getElementById('gameScreen');
let ctx = canvas.getContext('2d');



const GAME_WIDTH = 800;
const GAME_HEIGHT = 500;

ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

let game = new Game(GAME_WIDTH, GAME_HEIGHT);




let lastTime = 0;



function gameLoop(timestamp) {

    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    ctx.clearRect(0, 0, 800, 600);

    game.update(deltaTime);
    game.draw(ctx);

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);