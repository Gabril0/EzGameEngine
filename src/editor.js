import { Engine } from "./Engine.js";
import { GameObject } from "./EditorTools/GameObject.js";

class Editor {
    constructor() {
        if (!Editor.instance) {
            Editor.instance = this;

            this.engine = new Engine();

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

            this.rightPanelList = document.createElement("div");
            this.rightPanel.appendChild(this.rightPanelList);

            this.LeftPanelButtonEvent();
            
        }
        return Editor.instance;
    }
    LeftPanelButtonEvent(){
        this.leftPanel.oncontextmenu = (e) => {
            e.preventDefault();
            
            let contextMenu = document.getElementById("contextMenu");
            this.ClearList(contextMenu.childNodes);

            

            contextMenu.style.left = `${e.pageX}px`;
            contextMenu.style.top = `${e.pageY}px`;
            contextMenu.style.display = "block";

            let createObjectButton = document.createElement("button");
            createObjectButton.id = "opButton";
            createObjectButton.textContent = "Create new Game Object";
            createObjectButton.onclick = () => {
                let newGameObject = new GameObject("newGameObject", [0, 0, 0], [0, 0, 0], [0, 0, 0]);
                this.UpdateObjectList(newGameObject);
            }

            contextMenu.appendChild(createObjectButton);
        
            document.addEventListener("click", () => {
                contextMenu.style.display = "none";
            }, { once: true });

        }
    }

    UpdateObjectList(added_object){

        let new_child = document.createElement("button");
        new_child.id = "opButton";
        new_child.textContent = added_object.name;
        this.leftPanelList.appendChild(new_child);

        new_child.onclick = () => {
            this.ClearList(this.rightPanelList.childNodes);

            let object_name = document.createElement("p");
            object_name.textContent = `${added_object.name}`;
            this.rightPanelList.appendChild(object_name);

            let field_name = document.createElement("p");
            field_name.textContent = `Position X:${added_object.position[0]} Y:${added_object.position[1]} Z:${added_object.position[2]}`;
            this.rightPanelList.appendChild(field_name);
            
        }

        this.CheckForDuplicatesAndRename(this.leftPanelList.childNodes);
        added_object.name = new_child.textContent; // To assign a new name if needed

        this.engine.AddObjectToHierarchy(added_object);

    }

    // List Aux
    CheckForDuplicatesAndRename(list){
        let nameCount = {};

        list.forEach(element => {
            let originalName = element.textContent.trim();
    
            let match = originalName.match(/^(.*?)(?: \((\d+)\))?$/);
            let baseName = match[1].trim();
            let existingCount = match[2] ? parseInt(match[2]) : 0;
    
            let count = nameCount[baseName] ? nameCount[baseName] + 1 : (existingCount + 1);
            nameCount[baseName] = count;
    
            element.textContent = count > 1 ? `${baseName} (${count - 1})` : baseName;
        });

    }

    ClearList(list){
        list.forEach(element => {
            element.remove();
        });
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
        backgroundColor: 0x223344
    });

    // Adding a Game Object

    let gameObject = new GameObject("GameObject 1", [2, 2, 0], [0, 0, 0], [0, 0, 0]);
    editor.UpdateObjectList(gameObject);

    app.ticker.add(function (delta) {
    });

    window.addEventListener('resize', () => {
        app.renderer.resize(container.offsetWidth, container.offsetHeight);
    });
};

