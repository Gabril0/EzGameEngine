import { Engine } from "./Engine.js";
import { GameObject } from "./EditorTools/GameObject.js";

class Editor {
    constructor() {
        if (!Editor.instance) {
            Editor.instance = this;

            // Getting the panels
            this.leftPanel = document.getElementById("leftPanel");
            this.rightPanel = document.getElementById("rightPanel");
            this.canvas = document.getElementById('gameCanvas');
            this.bottomPanel = document.getElementById("bottomPanel");

            // Getting the main buttons
            this.playButton = document.getElementById("playButton");
            this.stopButton = document.getElementById("stopButton");

            this.gameButton = document.getElementById("gameButton");
            this.imageButton = document.getElementById("imageButton");
            this.audioButton = document.getElementById("audioButton");
            this.codeButton = document.getElementById("codeButton");

            this.engine = new Engine();

            // Making object list and component list
            this.leftPanelList = document.createElement("div");
            this.leftPanel.appendChild(this.leftPanelList);
        }
        return Editor.instance;
    }

    UpdateObjectList(added_object){

    let new_child = document.createElement("button");
    new_child.textContent = added_object.name;

    let component = document.createElement("div");
    component.textContent = added_object.position;
    this.rightPanel.appendChild(component);
    this.leftPanelList.appendChild(new_child);
  }

    static GetInstance() {
        return Editor.instance;
    }
}


window.onload = function () {
    const container = document.getElementById('gameViewContainer');
    new Editor();

    let editor = Editor.GetInstance();

    const app = new PIXI.Application({
        view: editor.canvas,
        width: container.offsetWidth,
        height: container.offsetHeight,
        backgroundColor: 0x2f333f
    });

    // Adding a Game Object

    let gameObject = new GameObject("GameObject 1", [2, 2, 0], [0, 0, 0], [0, 0, 0]);
    editor.UpdateObjectList(gameObject);

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

