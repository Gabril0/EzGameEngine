// Primeiro, limpa o estágio e recria a aplicação PIXI
window.app.stage.removeChildren();
console.log(window.app);

const container = document.getElementById('gameViewContainer');
const canvas = document.getElementById('gameCanvas');

window.app = new PIXI.Application({
	view: canvas,
	width: container.offsetWidth,
	height: container.offsetHeight,
	backgroundColor: 0x222222
});

window.initGame = async function() {
	// Configurações do jogo
	window.game = {
    	playerSpeed: 3,
    	bulletSpeed: 7,
    	isPlaying: true,
    	score: 0,
    	lastShot: 0,
    	shotDelay: 300,
    	enemySpawnTimer: 0,
    	enemyTypes: ['shooter', 'swarm', 'coordinator']
	};

	// Cria o jogador (personagem)
	window.player = new PIXI.Graphics();
	player.beginFill(0x3498db);
	player.drawCircle(0, 0, 15);
	player.endFill();
	player.beginFill(0xFFFFFF);
	player.drawCircle(-5, -5, 3);
	player.drawCircle(5, -5, 3);
	player.endFill();
	player.x = app.screen.width / 2;
	player.y = app.screen.height / 2;
	app.stage.addChild(player);

	// Containers
	window.bullets = new PIXI.Container();
	window.enemies = new PIXI.Container();
	window.enemyBullets = new PIXI.Container();
	app.stage.addChild(bullets);
	app.stage.addChild(enemies);
	app.stage.addChild(enemyBullets);

	// Texto
	const scoreText = new PIXI.Text(`Score: ${game.score}`, {
    	fill: 0xFFFFFF,
    	fontSize: 20
	});
	scoreText.position.set(20, 20);
	app.stage.addChild(scoreText);

	// Controles
	const keys = {};
	window.addEventListener('keydown', (e) => keys[e.key] = true);
	window.addEventListener('keyup', (e) => keys[e.key] = false);

	// Tipos de inimigos
	function createShooterEnemy() {
    	const enemy = new PIXI.Graphics();
    	enemy.beginFill(0xE74C3C); // Vermelho
    	enemy.drawRect(-10, -10, 20, 20);
    	enemy.endFill();
    	enemy.type = 'shooter';
    	enemy.shootCooldown = 0;
    	enemy.health = 2;
    	return enemy;
	}

	function createSwarmEnemy() {
    	const enemy = new PIXI.Graphics();
    	enemy.beginFill(0x2ECC71); // Verde
    	enemy.drawCircle(0, 0, 8);
    	enemy.endFill();
    	enemy.type = 'swarm';
    	enemy.health = 1;
    	return enemy;
	}

	function createCoordinatorEnemy() {
    	const enemy = new PIXI.Graphics();
    	enemy.beginFill(0x9B59B6); // Roxo
    	enemy.drawPolygon([-10, 0, 0, -15, 10, 0, 0, 15]);
    	enemy.endFill();
    	enemy.type = 'coordinator';
    	enemy.health = 3;
    	return enemy;
	}

	// Spawn de inimigos
	function spawnEnemy() {
    	const type = game.enemyTypes[Math.floor(Math.random() * game.enemyTypes.length)];
    	let enemy;

    	switch(type) {
        	case 'shooter':
            	enemy = createShooterEnemy();
            	placeAtEdge(enemy);
            	break;
           	 
        	case 'swarm':
            	const swarmSize = 4 + Math.floor(Math.random() * 7);
            	for (let i = 0; i < swarmSize; i++) {
                	setTimeout(() => {
                    	const swarmEnemy = createSwarmEnemy();
                    	placeAtEdge(swarmEnemy);
                    	enemies.addChild(swarmEnemy);
                	}, i * 200);
            	}
            	return;
           	 
        	case 'coordinator':
            	const teamSize = 2 + Math.floor(Math.random() * 4);
            	for (let i = 0; i < teamSize; i++) {
                	setTimeout(() => {
                    	const coordEnemy = createCoordinatorEnemy();
                    	placeAtEdge(coordEnemy);
                    	enemies.addChild(coordEnemy);
                	}, i * 300);
            	}
            	return;
    	}

    	enemies.addChild(enemy);
	}

	function placeAtEdge(enemy) {
    	if (Math.random() > 0.5) {
        	enemy.x = Math.random() > 0.5 ? 0 : app.screen.width;
        	enemy.y = Math.random() * app.screen.height;
    	} else {
        	enemy.x = Math.random() * app.screen.width;
        	enemy.y = Math.random() > 0.5 ? 0 : app.screen.height;
    	}
	}

	// Game loop
	app.ticker.add((delta) => {
    	if (!game.isPlaying) return;

    	// Movimento do jogador
    	if (keys['w'] || keys['W']) player.y -= game.playerSpeed;
    	if (keys['s'] || keys['S']) player.y += game.playerSpeed;
    	if (keys['a'] || keys['A']) player.x -= game.playerSpeed;
    	if (keys['d'] || keys['D']) player.x += game.playerSpeed;

    	// Limites
    	player.x = Math.max(15, Math.min(app.screen.width - 15, player.x));
    	player.y = Math.max(15, Math.min(app.screen.height - 15, player.y));

    	// Tiro do jogador
    	const now = Date.now();
    	if (now - game.lastShot > game.shotDelay) {
        	let dx = 0, dy = 0;
        	if (keys['ArrowUp']) dy = -1;
        	else if (keys['ArrowDown']) dy = 1;
        	else if (keys['ArrowLeft']) dx = -1;
        	else if (keys['ArrowRight']) dx = 1;
       	 
        	if (dx !== 0 || dy !== 0) {
            	shootBullet(player.x, player.y, dx, dy, bullets, 0xF1C40F);
            	game.lastShot = now;
        	}
    	}

    	// Movimento das balas
    	moveBullets(bullets);
    	moveBullets(enemyBullets);

    	// Comportamento dos inimigos
    	game.enemySpawnTimer++;
    	if (game.enemySpawnTimer % 200 === 0 && enemies.children.length < 15) {
        	spawnEnemy();
    	}

    	enemies.children.forEach(enemy => {
        	// Comportamento específico por tipo
        	switch(enemy.type) {
            	case 'shooter':
                	// Inimigo atirador: move-se lentamente e atira
                	const angleToPlayer = Math.atan2(player.y - enemy.y, player.x - enemy.x);
                	enemy.x += Math.cos(angleToPlayer) * 0.8;
                	enemy.y += Math.sin(angleToPlayer) * 0.8;
               	 
                	enemy.shootCooldown--;
                	if (enemy.shootCooldown <= 0) {
                    	shootBullet(enemy.x, enemy.y, Math.cos(angleToPlayer), Math.sin(angleToPlayer), enemyBullets, 0xE74C3C);
                    	enemy.shootCooldown = 120;
                	}
                	break;
               	 
            	case 'swarm':
                	// Enxame: movimento errático em grupo
                	const swarmAngle = Math.atan2(player.y - enemy.y, player.x - enemy.x) + (Math.random() - 0.5) * 1.5;
                	enemy.x += Math.cos(swarmAngle) * 2;
                	enemy.y += Math.sin(swarmAngle) * 2;
                	break;
               	 
            	case 'coordinator':
                	// Coordenador: flanqueia o jogador
                	const coordAngle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
                	const distance = Math.hypot(player.x - enemy.x, player.y - enemy.y);
               	 
                	if (distance > 150) {
                    	// Aproxima-se
                    	enemy.x += Math.cos(coordAngle) * 1.2;
                    	enemy.y += Math.sin(coordAngle) * 1.2;
                	} else {
                    	// Mantém distância e flanqueia
                    	enemy.x += Math.cos(coordAngle + Math.PI/2) * 1.5;
                    	enemy.y += Math.sin(coordAngle + Math.PI/2) * 1.5;
                	}
                	break;
        	}

        	// Colisão com jogador
        	if (Math.hypot(player.x - enemy.x, player.y - enemy.y) < 20) {
            	gameOver();
        	}
    	});

    	// Colisão balas-inimigos
    	checkCollisions();
	});

	function shootBullet(x, y, dx, dy, container, color) {
    	const bullet = new PIXI.Graphics();
    	bullet.beginFill(color);
    	bullet.drawCircle(0, 0, 5);
    	bullet.endFill();
    	bullet.x = x;
    	bullet.y = y;
    	bullet.dx = dx;
    	bullet.dy = dy;
    	container.addChild(bullet);
	}

	function moveBullets(container) {
    	container.children.forEach(bullet => {
        	bullet.x += bullet.dx * game.bulletSpeed;
        	bullet.y += bullet.dy * game.bulletSpeed;
       	 
        	if (bullet.x < 0 || bullet.x > app.screen.width ||
            	bullet.y < 0 || bullet.y > app.screen.height) {
            	container.removeChild(bullet);
        	}
    	});
	}

	function checkCollisions() {
    	// Balas do jogador contra inimigos
    	bullets.children.forEach(bullet => {
        	enemies.children.forEach(enemy => {
            	if (Math.hypot(bullet.x - enemy.x, bullet.y - enemy.y) < 15) {
                	enemy.health--;
                	bullets.removeChild(bullet);
               	 
                	if (enemy.health <= 0) {
                    	enemies.removeChild(enemy);
                    	game.score += enemy.type === 'shooter' ? 20 :
                                 	enemy.type === 'coordinator' ? 30 : 10;
                    	scoreText.text = `Score: ${game.score}`;
                	}
            	}
        	});
    	});
   	 
    	// Balas inimigas contra jogador
    	enemyBullets.children.forEach(bullet => {
        	if (Math.hypot(bullet.x - player.x, bullet.y - player.y) < 15) {
            	gameOver();
        	}
    	});
	}

	function gameOver() {
    	game.isPlaying = false;
   	 
    	const gameOverText = new PIXI.Text(`Game Over\nScore: ${game.score}\nClick to restart`, {
        	fill: 0xFF0000,
        	fontSize: 36,
        	align: 'center'
    	});
    	gameOverText.anchor.set(0.5);
    	gameOverText.position.set(app.screen.width / 2, app.screen.height / 2);
    	app.stage.addChild(gameOverText);
   	 
    	canvas.addEventListener('click', () => {
        	app.stage.removeChildren();
        	initGame();
    	}, { once: true });
	}
    
	// Inicia com alguns inimigos
	setTimeout(() => {
    	spawnEnemy();
    	spawnEnemy();
	}, 1000);
};

// Inicia o jogo
window.initGame();


