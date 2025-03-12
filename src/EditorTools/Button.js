function Button(app, width, height, pos_x, pos_y, text) {
    this.app = app;
    this.width = width;
    this.height = height;
    this.pos_x = pos_x;
    this.pos_y = pos_y;
    this.text = text;
    this.font_size = 24;
    this.font_color = 0x000000;
    this.alignment = 'center';
    this.anchor = 0.5;
    this.button_color = 0xffffff;

    this.update = function() {
        const button = new PIXI.Graphics();
        button.beginFill(this.button_color);
        button.drawRect(0, 0, this.width, this.height);
        button.endFill();

        button.x = this.pos_x;
        button.y = this.pos_y;
        
        button.interactive = true;
        button.buttonMode = true;

        const buttonText = new PIXI.Text(this.text, {
            fontSize: this.font_size * (app.view.width / 1920 + app.view.height / 1080) * 0.5,
            fill: this.font_color,
            align: this.alignment,
        });
        buttonText.anchor.set(this.anchor);
        buttonText.x = button.x + button.width / 2;
        buttonText.y = button.y + button.height / 2;

        this.app.stage.addChild(button);
        this.app.stage.addChild(buttonText);

        button.on('pointerdown', () => {
            console.log('Button clicked!');
        });

        button.on('pointerover', () => {
            button.tint = 0x99CCFF;
        });

        button.on('pointerout', () => {
            button.tint = 0xFFFFFF;
        });
    }
}

export { Button };
