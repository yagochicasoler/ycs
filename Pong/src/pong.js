var p1; // Player 1 paddle
var p2; // Player 2 paddle
var ball; // Ball
var heightScreen = window.screen.height;
var widthScreen = window.screen.width;
var posBar1 = heightScreen / 2; // Initial position of Player 1's paddle
hitboxBar1 = posBar1; // Hitbox for Player 1's paddle
var posBar2 = heightScreen / 2; // Initial position of Player 2's paddle
hitboxBar2 = posBar2; // Hitbox for Player 2's paddle
var posBallY = heightScreen / 2; // Initial Y position of the ball
var posBallX = widthScreen / 2; // Initial X position of the ball
var ballSpeedX = 0; // Initial X speed of the ball
var ballSpeedY = 0; // Initial Y speed of the ball



// Player scores
var scoreP1 = 0; // Player 1 score
var scoreP2 = 0; // Player 2 score



// Function to start the game
function startGame() {
    gameArea.start();

    heightScreen = heightScreen - 20;



    // Create Player 1 and Player 2 paddles and the ball
    p1 = new object(12, 80, "lightcoral", widthScreen * 0.2, heightScreen / 2);
    p2 = new object(12, 80, "lightblue", widthScreen * 0.8, heightScreen / 2);
    ball = new object(15, 15, "white", widthScreen / 2, heightScreen / 2);



    // Start the ball in a random direction
    ballReset();
}



// Object representing the game area
var gameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        // Set up the canvas
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 2); // Update game area every 2ms



        // Listen for keydown and keyup events to control the paddles
        window.addEventListener("keydown", function (e) {
            e.preventDefault();
            gameArea.keys = gameArea.keys || [];
            gameArea.keys[e.keyCode] = e.type == "keydown";
        });

        window.addEventListener("keyup", function (e) {
            gameArea.keys[e.keyCode] = e.type == "keydown";
        });
    },
    stop: function () {
        clearInterval(this.interval); // Stop the game
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear the canvas
    },
};



// Object constructor for paddles and ball
function object(width, height, color, x, y, type) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.speed = 0;
    this.angle = 0;
    this.moveAngle = 0;
    this.x = x;
    this.y = y;



    // Draw the paddle or ball
    this.update = function () {
        ctx = gameArea.context;
        ctx.save();

        ctx.translate(this.x, this.y);
        ctx.fillStyle = color;
        ctx.fillRect(
            this.width / -2,
            this.height / -2,
            this.width,
            this.height
        );
        ctx.restore();
    };
    
    this.updateBall = function () {
        ctx = gameArea.context;
        ctx.save();

        ctx.translate(posBallX, posBallY);
        ctx.fillStyle = color;
        ctx.fillRect(
            this.width / -2,
            this.height / -2,
            this.width,
            this.height
        );
        ctx.restore();
    };



    // Player movement config
    this.move = function () {
        this.x += this.speed * Math.sin(this.angle);
        this.y -= this.speed * Math.cos(this.angle);
    };



    // Ball movement config
    this.ballMove = function () {


        // Check for collisions with paddles and walls
        if (
            posBallX + ballSpeedX > widthScreen * 0.8 &&
            posBallX >= window.innerWidth * 0.8 - 20 < widthScreen * 0.2 &&
            ballSpeedX < 0
        ) {
            posBallX = widthScreen * 0.2;
        } else {
            posBallX += ballSpeedX;
            posBallY += ballSpeedY;
        }
    };
}



// Function to update the game area
function updateGameArea() {
    gameArea.clear();



    // Player 1 movement
    p1.speed = 0;
    p1.moveAngle = 0;

    if (gameArea.keys && gameArea.keys[87]) {
        // W key for moving up
        p1.speed = 8;
        if (posBar1 >= window.innerHeight - 60) {
            p1.speed = 0;
        }
    }
    if (gameArea.keys && gameArea.keys[83]) {
        // S key for moving down
        p1.speed = -8;
        if (posBar1 <= 0 + 50) {
            p1.speed = 0;
        }
    }
    posBar1 = posBar1 + p1.speed;
    hitboxBar1 = hitboxBar1 - p1.speed;

    p1.move();
    p1.update();



    // Player 2 movement
    p2.speed = 0;
    p2.moveAngle = 0;

    if (gameArea.keys && gameArea.keys[38]) {
        // Up arrow key for moving up
        p2.speed = 8;
        if (posBar2 >= window.innerHeight - 60) {
            p2.speed = 0;
        }
    }
    if (gameArea.keys && gameArea.keys[40]) {
        // Down arrow key for moving down
        p2.speed = -8;
        if (posBar2 <= 0 + 50) {
            p2.speed = 0;
        }
    }
    posBar2 = posBar2 + p2.speed;
    hitboxBar2 = hitboxBar2 - p2.speed;

    p2.move();
    p2.update();



    // Ball collision with walls
    if (posBallY >= window.innerHeight - 10) {
        ballSpeedY = ballSpeedY * -1; // Reverse Y direction
    }
    if (posBallY <= 0 + 10) {
        ballSpeedY = ballSpeedY * -1; // Reverse Y direction
    }



    // Ball collision with paddles
    if (
        posBallX >= widthScreen * 0.8 - 20 &&
        posBallY >= hitboxBar2 - 60 &&
        posBallY <= hitboxBar2 + 60 &&
        ballSpeedX > 0 &&
        posBallX < widthScreen * 0.8 + 20
    ) {
        handleBallPaddleCollision(hitboxBar2, p2);
    }
    if (
        posBallX <= widthScreen * 0.2 + 20 &&
        posBallY >= hitboxBar1 - 60 &&
        posBallY <= hitboxBar1 + 60 &&
        ballSpeedX < 0 &&
        posBallX > widthScreen * 0.2 - 20
    ) {
        handleBallPaddleCollision(hitboxBar1, p1);
    }



    // Ball reset and score update
    if (posBallX <= widthScreen * 0.01) {
        scoreP2++;
        if (scoreP2 >= 10) {
            alert("Player 2 wins!");
            gameArea.stop();
        } else {
            posBallX = widthScreen / 2;
            posBallY = heightScreen / 2.5;
            ballSpeedX = 0;
            ballSpeedY = 0;
            setTimeout(ballReset, 1000, "left");
        }
    }
    if (posBallX >= widthScreen * 0.99) {
        scoreP1++;
        if (scoreP1 >= 10) {
            alert("Player 1 wins!");
            gameArea.stop();
        } else {
            posBallX = widthScreen / 2;
            posBallY = heightScreen / 2.5;
            ballSpeedX = 0;
            ballSpeedY = 0;
            setTimeout(ballReset, 1000, "right");
        }
    }

    ball.ballMove();
    ball.updateBall();



    // Display scores
    displayScore();
}



// Helper function to handle ball and paddle collision
function handleBallPaddleCollision(paddleY, paddle) {
    let relativeIntersectY = paddleY + paddle.height / 2 - posBallY;
    let normalizedRelativeIntersectionY =
        relativeIntersectY / (paddle.height / 2);
    let bounceAngle = (normalizedRelativeIntersectionY * Math.PI) / 4; // Max bounce angle of 45 degrees

    ballSpeedX = ballSpeedX * -1.02; // Increase speed and change direction
    ballSpeedY = 5 * -Math.sin(bounceAngle); // Update Y speed based on bounce angle
}



// Function to reset the ball position and speed in a random direction
function ballReset(direccio) {


    // Set the ball position to the center
    posBallX = widthScreen / 2;
    posBallY = heightScreen / 2;



    // Generate random angles for ball direction
    var angle = (Math.random() * Math.PI) / 2 - Math.PI / 4; // Angle between -45 and 45 degrees
    var speed = 5; // Ball speed



    // Set the ball speed and direction
    if (direccio == "left") {
        ballSpeedX = -speed * Math.cos(angle);
        ballSpeedY = -speed * Math.sin(angle);
    } else if (direccio == "right") {
        ballSpeedX = speed * Math.cos(angle);
        ballSpeedY = speed * Math.sin(angle);
    } else {
        // Initial direction is random
        var randomDirection = Math.random() < 0.5 ? -1 : 1;
        ballSpeedX = randomDirection * speed * Math.cos(angle);
        ballSpeedY = speed * Math.sin(angle);
    }
}



// Function to display scores
function displayScore() {
    ctx = gameArea.context;
    ctx.font = "75px monospace";
    ctx.fillStyle = "white";
    ctx.fillText("" + scoreP1, widthScreen * 0.35, 100);
    ctx.fillText("" + scoreP2, widthScreen * 0.62, 100);
}
