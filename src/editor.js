window.onload = function () {
    const container = document.getElementById('gameViewContainer');
    const canvas = document.getElementById('gameCanvas');

    const app = new PIXI.Application({
        view: canvas,
        width: container.offsetWidth,
        height: container.offsetHeight,
        backgroundColor: 0x2f333f
    });

    const square = new PIXI.Graphics();
    square.beginFill(0xFF0000);
    square.drawRect(0, 0, 200, 200);
    square.endFill();
    square.x = app.screen.width / 2 - 100;
    square.y = app.screen.height / 2 - 100;
    app.stage.addChild(square);

    let time = 0; 

    app.ticker.add(function (delta) {
        square.y = app.screen.height / 2 - 100 + Math.sin(time) * 100;
        time += 0.05; 
    });

    window.addEventListener('resize', () => {
        app.renderer.resize(container.offsetWidth, container.offsetHeight);
    });
};