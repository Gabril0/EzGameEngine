import { Button } from '/src/EditorTools/button.js';


window.onload = function () {
    if (typeof PIXI === "undefined") {
        console.error("Pixi.js did not load!");
        return;
    }
    const gameCanvas = document.getElementById("gameCanvas");
    const app = new PIXI.Application({
        view: gameCanvas,
        width: window.innerWidth ,
        height: window.innerHeight * 0.95,
        backgroundColor: 0x404040
    });
    document.body.appendChild(app.view);


    // Header Buttons
    const button_header_width = app.view.width * 0.1;
    const button_header_height = app.view.height * 0.05;
    const game_button = new Button(app, button_header_width, button_header_height, 0, 0, "Game");
    const image_button = new Button(app, button_header_width, button_header_height, button_header_width, 0, "Image");
    const sound_button = new Button(app, button_header_width, button_header_height, button_header_width * 2, 0, "Sound");
    const code_button = new Button(app, button_header_width, button_header_height, button_header_width * 3, 0, "Code");



    // Play and Pause buttons
    const play_button = new Button(app, button_header_width / 2, button_header_height, button_header_width * 5, 0, ">");
    const pause_button = new Button(app, button_header_width / 2, button_header_height,
         button_header_width * 5 + button_header_width / 2,
         0
         , "||");
         
    // Top Right Section
    const tr_section_width = app.view.width * 0.3;
    const tr_section_height = app.view.height * 0.5;
    const square = new PIXI.Graphics();
    square.beginFill(0xB9BAFF);
    square.drawRect( app.view.width - tr_section_height,  app.view.height - tr_section_width, tr_section_width, tr_section_height);
    square.endFill();
    
    app.stage.addChild(square);

    // Button Updating

    const buttons = [game_button, image_button, sound_button, code_button, play_button, pause_button];

    buttons.forEach(function(button, index) {
        button.update();
    });

    // Graphic refresher function
    let counter = 0;
    app.ticker.add((delta) => {
        //game_button.height += counter;

        // game_button.update();
        // counter += 0.2 * delta;
    });
};
