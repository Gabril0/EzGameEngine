import { Button } from '/src/EditorTools/button.js';

window.onload = function () {
    if (typeof PIXI === "undefined") {
        console.error("Pixi.js did not load!");
        return;
    }

    // Color definitions
    const BG_COLOR = 0x404040;
    const PANEL_COLOR = 0xB9BAFF;

    const gameCanvas = document.getElementById("gameCanvas");
    const app = new PIXI.Application({
        view: gameCanvas,
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: BG_COLOR
    });
    document.body.appendChild(app.view);

    // Create buttons (will be updated on resize)
    let game_button, image_button, sound_button, code_button, play_button, pause_button;

    function createUI() {
        app.stage.removeChildren(); // Remove old elements

        // Header Buttons
        const button_header_width = app.view.width * 0.1;
        const button_header_height = app.view.height * 0.05;
        game_button = new Button(app, button_header_width, button_header_height, 0, 0, "Game");
        image_button = new Button(app, button_header_width, button_header_height, button_header_width, 0, "Image");
        sound_button = new Button(app, button_header_width, button_header_height, button_header_width * 2, 0, "Sound");
        code_button = new Button(app, button_header_width, button_header_height, button_header_width * 3, 0, "Code");

        // Play and Pause buttons
        play_button = new Button(app, button_header_width / 2, button_header_height, button_header_width * 6, 0, ">");
        pause_button = new Button(app, button_header_width / 2, button_header_height,
            button_header_width * 6 + button_header_width / 2, 0, "||");

        // Top Right Section
        const tr_section_width = app.view.width * 0.2;
        const tr_section_height = app.view.height * 0.5;
        const tr_section = new PIXI.Graphics();
        tr_section.beginFill(PANEL_COLOR);
        tr_section.drawRect(app.view.width - tr_section_width, app.view.height / 2 - tr_section_height,
            tr_section_width, tr_section_height);
        tr_section.endFill();
        app.stage.addChild(tr_section);

        // Bottom Right Section
        const br_section_width = app.view.width * 0.2;
        const br_section_height = app.view.height * 0.49;
        const br_section = new PIXI.Graphics();
        br_section.beginFill(PANEL_COLOR);
        br_section.drawRect(app.view.width - br_section_width, app.view.height - br_section_height,
            br_section_width, br_section_height);
        br_section.endFill();
        app.stage.addChild(br_section);

        // Bottom Section
        const bottom_section_width = app.view.width * 0.795;
        const bottom_section_height = app.view.height * 0.3;
        const bottom_section = new PIXI.Graphics();
        bottom_section.beginFill(PANEL_COLOR);
        bottom_section.drawRect(0, app.view.height - bottom_section_height,
            bottom_section_width, bottom_section_height);
        bottom_section.endFill();
        app.stage.addChild(bottom_section);

        // Main Screen
        const main_section_width = app.view.width * 0.795;
        const main_section_height = app.view.height * 0.63;
        const main_section = new PIXI.Graphics();
        main_section.beginFill(0xFFFFFF);
        main_section.drawRect(0, app.view.height - main_section_height - bottom_section_height - app.view.height * 0.01,
            main_section_width, main_section_height);
        main_section.endFill();
        app.stage.addChild(main_section);

        // Update buttons
        const buttons = [game_button, image_button, sound_button, code_button, play_button, pause_button];
        buttons.forEach(button => button.update());
    }

    createUI();

    // Resize event
    window.onresize = function () {
        app.renderer.resize(window.innerWidth, window.innerHeight);
        createUI(); // Recreate UI elements with new sizes
    };
};