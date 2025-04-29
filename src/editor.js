import { Engine } from "./engine.js";
import { GameObject } from "./EditorTools/GameObject.js";
import { FieldType } from "./EditorTools/GameComponent.js";

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
        contextMenu.style.display = "none"; // Preventing it from appearing at the start
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

    // Create Field and datatype behaviours

    CreateField(target_panel, exposed_variable){ // An exposed variable is like ["Size", [1,2,3], FieldType.FLOAT]
        let fieldName = exposed_variable[0];
        let contentArray = exposed_variable[1];
        let contentType = exposed_variable[2];
        switch(contentType){
            case(FieldType.FLOAT):
                this.CreateFieldNumber(target_panel, fieldName, contentArray, false);
                break;
            case(FieldType.VECTOR2):
                this.CreateFieldVector3(target_panel, fieldName, contentArray);
                break;
            case(FieldType.VECTOR3):
                this.CreateFieldVector3(target_panel, fieldName, contentArray);
                break;
            case(FieldType.INT):
                this.CreateFieldNumber(target_panel, fieldName, contentArray, true);
                break;
            case(FieldType.STRING):
                this.CreateFieldString(target_panel, fieldName, contentArray);
                break;
            case(FieldType.BOOL):
                this.CreateFieldCheckBox(target_panel, fieldName, contentArray);
                break;
            case(FieldType.FILE):

                break;
            case(FieldType.LIST):

                break;

        }

    }

    CreateFieldCheckBox(target_panel, field_name, bool){
        let field_div = document.createElement("div");
        field_div.className = "d-flex flex-wrap gap-2";
    
        let p = document.createElement("p");
        p.textContent = field_name;
        field_div.appendChild(p);

        let checkbox = document.createElement("checkbox");
        checkbox.className = "propertiesInput";
        checkbox.value = bool;

        field_div.appendChild(checkbox);
    
        target_panel.appendChild(field_div);


    }
    CreateFieldNumber(target_panel, field_name, number, isInt){
        let field_div = document.createElement("div");
        field_div.className = "d-flex flex-wrap gap-2";
    
        let p = document.createElement("p");
        p.textContent = field_name;
        field_div.appendChild(p);

        let input = document.createElement("input");
        input.textContent = number;
        input.className = "propertiesInput";

        if(isInt){
            input.addEventListener('input', function(event) {
                parseInt(event);
            });
        }
        this.NumberBehavior(input);
        field_div.appendChild(input);
    
        target_panel.appendChild(field_div);
    }

    CreateFieldString(target_panel, field_name, string){
        let field_div = document.createElement("div");
        field_div.className = "d-flex flex-wrap gap-2";
    
        let p = document.createElement("p");
        p.textContent = field_name;
        field_div.appendChild(p);

        let input = document.createElement("input");
        input.textContent = string;
        input.className = "propertiesInput";
        field_div.appendChild(input);
    
        target_panel.appendChild(field_div);
    }

    CreateFieldVector3(target_panel, field_name, parameter_list) {
        let field_div = document.createElement("div");
        field_div.className = "d-flex flex-wrap gap-2";
    
        let p = document.createElement("p");
        p.textContent = field_name;
        field_div.appendChild(p);
    
        parameter_list.forEach((element, i) => {
            let input = document.createElement("input");
            input.value = element;
            input.className = "propertiesInput";
            input.style.width = parameter_list.length > 1 ? `${100 / (parameter_list.length * 1.75)}%` : "100%";
            this.NumberBehavior(input, element,parameter_list);
    
            field_div.appendChild(input);
        });
    
        target_panel.appendChild(field_div);
    }

    NumberBehavior(input, element, change_target){
        let lastValue = element;
    
        input.onchange = (e) => {
            if (e.target.value === "") {
                e.target.value = lastValue;
            }
            change_target.foreach((_, i) => {
                change_target[i] = isNaN(+e.target.value) ? e.target.value : +e.target.value;
            });
            
        };

        let isDragging = false;
        let startX = 0;
        let startValue = 0;

        input.addEventListener("mousedown", (e) => {
            if (isNaN(+input.value)) return; // Number check

            isDragging = true;
            startX = e.clientX;
            startValue = parseFloat(input.value);

        });

        window.addEventListener("mousemove", (e) => {
            if (!isDragging) return;

            const deltaX = e.clientX - startX;
            let newValue = startValue + deltaX * 0.1;

            input.value = newValue.toFixed(2);
            change_target.foreach((_, i) => {
                change_target[i] = newValue;
            });
            
        });

        window.addEventListener("mouseup", () => {
            isDragging = false;
        });
    }

    // END Create Field

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
            
            // Dealing with position
            let position_component = [
                "Position",
                [added_object.position[0], added_object.position[1], added_object.position[2]],
                FieldType.VECTOR3
            ]
            this.CreateField(this.rightPanelList, position_component);
            alert("This is what you need to do: Create a intermediary function using CreateField, and then create some other functions to deal with each of the datatypes");
            alert("also, for some reason it isnt going through this loop");
            added_object.GetComponents().foreach(component => {
                alert("running this loop");
                // Dealing with Pixi Sprite(if it exists)
                this.BasePixiComponentExposing(component);


            });
            
        }

        this.CheckForDuplicatesAndRename(this.leftPanelList.childNodes);
        added_object.name = new_child.textContent; // To assign a new name if needed for duplicates

        //this.engine.AddObjectToHierarchy(added_object);

    }

    BasePixiComponentExposing(component){
        if(component instanceof PIXI.Sprite){
            this.CreateField(
                this.rightPanelList,
                "image",
                component.texture.baseTexture.resource.source,
                component.texture.baseTexture.resource.source 


            )

        }

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
        Array.from(list).forEach(element => {
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

    let engine = new Engine();  
    let editor = Editor.GetInstance();
    
    const app = new PIXI.Application({
        view: editor.canvas,
        width: container.offsetWidth,
        height: container.offsetHeight,
        backgroundColor: 0x223344
    });

    // Adding a Game Object

    let gameObject = new GameObject("GameObject 1", [2, 2, 0], [0, 0, 0], [1, 1, 1]);
    editor.UpdateObjectList(gameObject); 

    engine.LoadTexture('https://pixijs.io/examples/examples/assets/bunny.png').then(sprite => {
        gameObject.AddComponent(sprite);
        app.stage.addChild(sprite);
    });
    
    const keys = {
        w: false,
        a: false,
        s: false,
        d: false
    };
    const speed = 5;
    app.ticker.add(function (delta) {

        if(keys.w){
            gameObject.position[1] += -speed * delta;
        }
        if(keys.s){
            gameObject.position[1] += speed * delta;
        }
        if(keys.a){
            gameObject.position[0] += -speed * delta;
        }
        if(keys.d){
            gameObject.position[0] += +speed * delta;
        }
        

        gameObject.Update();
    });
    
    window.addEventListener('keydown', (e) => {
        switch (e.key.toLowerCase()) {
            case 'w': keys.w = true; break;
            case 'a': keys.a = true; break;
            case 's': keys.s = true; break;
            case 'd': keys.d = true; break;
        }
    });
    
    window.addEventListener('keyup', (e) => {
        switch (e.key.toLowerCase()) {
            case 'w': keys.w = false; break;
            case 'a': keys.a = false; break;
            case 's': keys.s = false; break;
            case 'd': keys.d = false; break;
        }
    });

    window.addEventListener('resize', () => {
        app.renderer.resize(container.offsetWidth, container.offsetHeight);
    });
};

