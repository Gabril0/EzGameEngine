class Panel extends PIXI.Container {
    constructor(app, width, height, pos_x, pos_y, color = 0x333333) {
        super();
        this.app = app;
        this.originalWidth = width;
        this.originalHeight = height;
        this.originalPosX = pos_x;
        this.originalPosY = pos_y;
        this.color = color;

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

        this.panelGraphic = new PIXI.Graphics();
        this.panelGraphic.beginFill(this.color);
        this.panelGraphic.drawRect(0, 0, newWidth, newHeight);
        this.panelGraphic.endFill();

        this.addChild(this.panelGraphic);
    }

    update() {
        this.createGraphics();
    }
}

export { Panel };
