// Primeiro, limpa o estágio e recria a aplicação PIXI
window.app.stage.removeChildren();
console.log(window.app);

const container = document.getElementById('gameViewContainer');
const canvas = document.getElementById('gameCanvas');

window.app = new PIXI.Application({
	view: canvas,
	width: container.offsetWidth,
	height: container.offsetHeight,
	backgroundColor: 0x2f333f
});

// Agora, defina todas as funções como propriedades do objeto window
window.initGame = function() {
	// Configurações do jogo
	const gameConfig = {
    	width: window.app.screen.width,
    	height: window.app.screen.height,
    	paddleWidth: 15,
    	paddleHeight: 100,
    	ballSize: 10,
    	paddleSpeed: 8,
    	initialBallSpeed: 5
	};

	// Elementos do jogo
	const gameElements = {
    	playerPaddle: null,
    	enemyPaddle: null,
    	ball: null,
    	playerScore: 0,
    	enemyScore: 0,
    	playerScoreText: null,
    	enemyScoreText: null
	};

	// Estado do jogo
	const gameState = {
    	playerUp: false,
    	playerDown: false,
    	ballVelocity: { x: 0, y: 0 }
	};

	// Funções internas
	function createPaddle(x, y) {
    	const paddle = new PIXI.Graphics();
    	paddle.beginFill(0xFFFFFF);
    	paddle.drawRect(0, 0, gameConfig.paddleWidth, gameConfig.paddleHeight);
    	paddle.endFill();
    	paddle.x = x;
    	paddle.y = y;
    	window.app.stage.addChild(paddle);
    	return paddle;
	}

	function createBall(x, y) {
    	const ball = new PIXI.Graphics();
    	ball.beginFill(0xFFFFFF);
    	ball.drawCircle(0, 0, gameConfig.ballSize);
    	ball.endFill();
    	ball.x = x;
    	ball.y = y;
    	window.app.stage.addChild(ball);
    	return ball;
	}

	function createScoreText(x, y, score) {
    	const text = new PIXI.Text(score.toString(), {
        	fontFamily: 'Arial',
        	fontSize: 36,
        	fill: 0xFFFFFF,
        	align: 'center'
    	});
    	text.x = x;
    	text.y = y;
    	text.anchor.set(0.5);
    	window.app.stage.addChild(text);
    	return text;
	}

	function setupControls() {
    	window.addEventListener('keydown', (e) => {
        	if (e.key === 'ArrowUp') gameState.playerUp = true;
        	if (e.key === 'ArrowDown') gameState.playerDown = true;
        	if (e.key === 'w') gameState.playerUp = true;
        	if (e.key === 's') gameState.playerDown = true;
    	});
   	 
    	window.addEventListener('keyup', (e) => {
        	if (e.key === 'ArrowUp') gameState.playerUp = false;
        	if (e.key === 'ArrowDown') gameState.playerDown = false;
        	if (e.key === 'w') gameState.playerUp = false;
        	if (e.key === 's') gameState.playerDown = false;
    	});
	}

	function resetBall() {
    	gameElements.ball.x = gameConfig.width / 2;
    	gameElements.ball.y = gameConfig.height / 2;
   	 
    	const angle = (Math.random() * Math.PI / 2) - Math.PI / 4;
    	const direction = Math.random() > 0.5 ? 1 : -1;
   	 
    	gameState.ballVelocity = {
        	x: Math.cos(angle) * gameConfig.initialBallSpeed * direction,
        	y: Math.sin(angle) * gameConfig.initialBallSpeed
    	};
	}

	function gameLoop(delta) {
    	if (gameState.playerUp && gameElements.playerPaddle.y > 0) {
        	gameElements.playerPaddle.y -= gameConfig.paddleSpeed;
    	}
    	if (gameState.playerDown && gameElements.playerPaddle.y < gameConfig.height - gameConfig.paddleHeight) {
        	gameElements.playerPaddle.y += gameConfig.paddleSpeed;
    	}
   	 
    	const enemyPaddleCenter = gameElements.enemyPaddle.y + gameConfig.paddleHeight / 2;
    	if (enemyPaddleCenter < gameElements.ball.y - 10) {
        	gameElements.enemyPaddle.y += gameConfig.paddleSpeed * 0.7;
    	} else if (enemyPaddleCenter > gameElements.ball.y + 10) {
        	gameElements.enemyPaddle.y -= gameConfig.paddleSpeed * 0.7;
    	}
   	 
    	if (gameElements.enemyPaddle.y < 0) gameElements.enemyPaddle.y = 0;
    	if (gameElements.enemyPaddle.y > gameConfig.height - gameConfig.paddleHeight) {
        	gameElements.enemyPaddle.y = gameConfig.height - gameConfig.paddleHeight;
    	}
   	 
    	gameElements.ball.x += gameState.ballVelocity.x;
    	gameElements.ball.y += gameState.ballVelocity.y;
   	 
    	if (gameElements.ball.y - gameConfig.ballSize <= 0 ||
        	gameElements.ball.y + gameConfig.ballSize >= gameConfig.height) {
        	gameState.ballVelocity.y *= -1;
    	}
   	 
    	if (gameElements.ball.x - gameConfig.ballSize <= gameElements.playerPaddle.x + gameConfig.paddleWidth &&
        	gameElements.ball.x + gameConfig.ballSize >= gameElements.playerPaddle.x &&
        	gameElements.ball.y >= gameElements.playerPaddle.y &&
        	gameElements.ball.y <= gameElements.playerPaddle.y + gameConfig.paddleHeight) {
       	 
        	const hitPosition = (gameElements.ball.y - gameElements.playerPaddle.y) / gameConfig.paddleHeight;
        	const angle = (hitPosition - 0.5) * Math.PI / 2;
        	const speed = Math.sqrt(
            	gameState.ballVelocity.x * gameState.ballVelocity.x +
            	gameState.ballVelocity.y * gameState.ballVelocity.y
        	) * 1.05;
       	 
        	gameState.ballVelocity = {
            	x: Math.cos(angle) * speed,
            	y: Math.sin(angle) * speed
        	};
       	 
        	gameElements.ball.x = gameElements.playerPaddle.x + gameConfig.paddleWidth + gameConfig.ballSize;
    	}
   	 
    	if (gameElements.ball.x + gameConfig.ballSize >= gameElements.enemyPaddle.x &&
        	gameElements.ball.x - gameConfig.ballSize <= gameElements.enemyPaddle.x + gameConfig.paddleWidth &&
        	gameElements.ball.y >= gameElements.enemyPaddle.y &&
        	gameElements.ball.y <= gameElements.enemyPaddle.y + gameConfig.paddleHeight) {
       	 
        	const hitPosition = (gameElements.ball.y - gameElements.enemyPaddle.y) / gameConfig.paddleHeight;
        	const angle = (hitPosition - 0.5) * Math.PI / 2;
        	const speed = Math.sqrt(
            	gameState.ballVelocity.x * gameState.ballVelocity.x +
            	gameState.ballVelocity.y * gameState.ballVelocity.y
        	) * 1.05;
       	 
        	gameState.ballVelocity = {
            	x: -Math.cos(angle) * speed,
            	y: Math.sin(angle) * speed
        	};
       	 
        	gameElements.ball.x = gameElements.enemyPaddle.x - gameConfig.ballSize;
    	}
   	 
    	if (gameElements.ball.x < 0) {
        	gameElements.enemyScore++;
        	gameElements.enemyScoreText.text = gameElements.enemyScore.toString();
        	resetBall();
    	} else if (gameElements.ball.x > gameConfig.width) {
        	gameElements.playerScore++;
        	gameElements.playerScoreText.text = gameElements.playerScore.toString();
        	resetBall();
    	}
	}

	// Inicialização do jogo
	gameElements.playerPaddle = createPaddle(30, gameConfig.height / 2 - gameConfig.paddleHeight / 2);
	gameElements.enemyPaddle = createPaddle(
    	gameConfig.width - 30 - gameConfig.paddleWidth,
    	gameConfig.height / 2 - gameConfig.paddleHeight / 2
	);
    
	gameElements.ball = createBall(gameConfig.width / 2, gameConfig.height / 2);
    
	gameElements.playerScoreText = createScoreText(100, 30, gameElements.playerScore);
	gameElements.enemyScoreText = createScoreText(gameConfig.width - 100, 30, gameElements.enemyScore);
    
	resetBall();
	setupControls();
	window.app.ticker.add(gameLoop);
};

// Inicia o jogo
window.initGame();
