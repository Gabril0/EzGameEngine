class Button extends PIXI.Container {
    constructor(app, width, height, pos_x, pos_y, text) {
        super();
        this.app = app;
        this.originalWidth = width;
        this.originalHeight = height;
        this.originalPosX = pos_x;
        this.originalPosY = pos_y;
        this.text = text;
        this.onClick = () => console.log('Button clicked!');

        this.button_color = 0xffffff;
        this.over_color = 0x99CCFF;
        this.out_color = 0xFFFFFF;

        this.createGraphics();
        this.app.stage.addChild(this);

        window.addEventListener("resize", () => this.update());
    }

    createGraphics() {
        this.removeChildren();

        const scaleFactorX = this.app.view.width / 1920;
        const scaleFactorY = this.app.view.height / 1080;

        const newWidth = this.originalWidth * scaleFactorX;
        const newHeight = this.originalHeight * scaleFactorY;
        const newPosX = this.originalPosX * scaleFactorX;
        const newPosY = this.originalPosY * scaleFactorY;

        this.position.set(newPosX, newPosY);

        this.buttonGraphic = new PIXI.Graphics();
        this.buttonGraphic.beginFill(this.button_color);
        this.buttonGraphic.drawRect(0, 0, newWidth, newHeight);
        this.buttonGraphic.endFill();

        this.buttonGraphic.interactive = true;
        this.buttonGraphic.buttonMode = true;

        this.buttonText = new PIXI.Text(this.text, {
            fontSize: 24 * (scaleFactorX + scaleFactorY) * 0.5,
            fill: 0x000000,
            align: 'center',
        });
        this.buttonText.anchor.set(0.5);
        this.buttonText.position.set(newWidth / 2, newHeight / 2);

        this.addChild(this.buttonGraphic);
        this.addChild(this.buttonText);

        this.buttonGraphic.on('pointerdown', this.onClick);
        this.buttonGraphic.on('pointerover', () => {
            this.buttonGraphic.tint = this.over_color;
        });
        this.buttonGraphic.on('pointerout', () => {
            this.buttonGraphic.tint = this.out_color;
        });
    }

    update() {
        this.createGraphics();
    }
}

export { Button };
