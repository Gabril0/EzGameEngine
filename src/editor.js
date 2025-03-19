import { Button } from '/src/EditorTools/button.js';
import { Panel } from '/src/EditorTools/panel.js';

window.onload = function () {
    if (typeof PIXI === "undefined") {
        console.error("Pixi.js did not load!");
        return;
    }

    // Base resolution for scaling
    const BASE_WIDTH = 1920;
    const BASE_HEIGHT = 1080;

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

    let game_button, image_button, sound_button, code_button, play_button, pause_button;
    let topRightPanel, bottomRightPanel, bottomPanel, mainPanel;

    createUI();

    window.onresize = function () {
        app.renderer.resize(window.innerWidth, window.innerHeight);
        updateUI();
    };

    function scaleX(value) {
        return (value / BASE_WIDTH) * window.innerWidth;
    }

    function scaleY(value) {
        return (value / BASE_HEIGHT) * window.innerHeight;
    }

    function createHeaderButtons() {
        const button_width = scaleX(200);
        const button_height = scaleY(50);

        game_button = new Button(app, button_width, button_height, scaleX(0), scaleY(0), "Game");
        image_button = new Button(app, button_width, button_height, scaleX(200), scaleY(0), "Image");
        sound_button = new Button(app, button_width, button_height, scaleX(400), scaleY(0), "Sound");
        code_button = new Button(app, button_width, button_height, scaleX(600), scaleY(0), "Code");
        play_button = new Button(app, button_width / 2, button_height, scaleX(1200), scaleY(0), ">");
        pause_button = new Button(app, button_width / 2, button_height, scaleX(1300), scaleY(0), "||");

        game_button.onClick = () => alert("CLICKED!!!!!!!!!!!!!!!");
    }

    function createPanels() {
        topRightPanel = new Panel(app, scaleX(384), scaleY(540), scaleX(1536), scaleY(270), PANEL_COLOR);
        bottomRightPanel = new Panel(app, scaleX(384), scaleY(530), scaleX(1536), scaleY(550), PANEL_COLOR);
        bottomPanel = new Panel(app, scaleX(1530), scaleY(324), scaleX(0), scaleY(756), PANEL_COLOR);
        mainPanel = new Panel(app, scaleX(1530), scaleY(680), scaleX(0), scaleY(76), 0xFFFFFF);
    }

    function createUI() {
        app.stage.removeChildren();
        createHeaderButtons();
        createPanels();
    }

    function updateUI() {
        const button_width = scaleX(200);
        const button_height = scaleY(50);

        game_button.updateSize(button_width, button_height);
        image_button.updateSize(button_width, button_height);
        sound_button.updateSize(button_width, button_height);
        code_button.updateSize(button_width, button_height);
        play_button.updateSize(button_width / 2, button_height);
        pause_button.updateSize(button_width / 2, button_height);

        game_button.updatePosition(scaleX(0), scaleY(0));
        image_button.updatePosition(scaleX(200), scaleY(0));
        sound_button.updatePosition(scaleX(400), scaleY(0));
        code_button.updatePosition(scaleX(600), scaleY(0));
        play_button.updatePosition(scaleX(1200), scaleY(0));
        pause_button.updatePosition(scaleX(1300), scaleY(0));

        topRightPanel.updateSize(scaleX(384), scaleY(540));
        topRightPanel.updatePosition(scaleX(1536), scaleY(270));

        bottomRightPanel.updateSize(scaleX(384), scaleY(530));
        bottomRightPanel.updatePosition(scaleX(1536), scaleY(550));

        bottomPanel.updateSize(scaleX(1530), scaleY(324));
        bottomPanel.updatePosition(scaleX(0), scaleY(756));

        mainPanel.updateSize(scaleX(1530), scaleY(680));
        mainPanel.updatePosition(scaleX(0), scaleY(76));
    }
};
