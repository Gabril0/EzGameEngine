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

            // Store references to the engine and context menu
            this.engine = null;
            // Get the context menu BEFORE using it
            this.contextMenu = document.getElementById("contextMenu");
            
            // Now that this.contextMenu is initialized, we can call this method
            this.LeftPanelButtonEvent();
        }
        return Editor.instance;
    }

    LeftPanelButtonEvent() {
        // Make sure contextMenu exists before using it
        if (!this.contextMenu) {
            console.error("Context menu element not found. Make sure there's an element with id 'contextMenu' in your HTML.");
            return;
        }
        
        this.contextMenu.style.display = "none"; // Preventing it from appearing at the start
        
        this.leftPanel.oncontextmenu = (e) => {
            e.preventDefault();
            
            this.ClearList(this.contextMenu.childNodes);

            this.contextMenu.style.left = `${e.pageX}px`;
            this.contextMenu.style.top = `${e.pageY}px`;
            this.contextMenu.style.display = "block";

            let createObjectButton = document.createElement("button");
            createObjectButton.id = "opButton";
            createObjectButton.textContent = "Create new Game Object";
            createObjectButton.onclick = () => {
                let newGameObject = new GameObject("newGameObject", [0, 0, 0], [0, 0, 0], [1, 1, 1]);
                this.UpdateObjectList(newGameObject);
                this.engine.AddObjectToHierarchy(newGameObject);
            }

            this.contextMenu.appendChild(createObjectButton);
        
            document.addEventListener("click", () => {
                this.contextMenu.style.display = "none";
            }, { once: true });
        }
    }

    // Create Field and datatype behaviours
    CreateField(target_panel, exposed_variable) { 
        // An exposed variable is like ["Size", [1,2,3], FieldType.FLOAT]
        let fieldName = exposed_variable[0];
        let contentArray = exposed_variable[1];
        let contentType = exposed_variable[2];
        
        switch(contentType) {
            case FieldType.FLOAT:
                this.CreateFieldNumber(target_panel, fieldName, contentArray, false);
                break;
            case FieldType.VECTOR2:
                this.CreateFieldVector(target_panel, fieldName, contentArray, 2);
                break;
            case FieldType.VECTOR3:
                this.CreateFieldVector(target_panel, fieldName, contentArray, 3);
                break;
            case FieldType.INT:
                this.CreateFieldNumber(target_panel, fieldName, contentArray, true);
                break;
            case FieldType.STRING:
                this.CreateFieldString(target_panel, fieldName, contentArray);
                break;
            case FieldType.BOOL:
                this.CreateFieldCheckBox(target_panel, fieldName, contentArray);
                break;
            case FieldType.FILE:
                this.CreateFieldFile(target_panel, fieldName, contentArray);
                break;
            case FieldType.LIST:
                this.CreateFieldList(target_panel, fieldName, contentArray);
                break;
        }
    }

    CreateFieldCheckBox(target_panel, field_name, bool) {
        let field_div = document.createElement("div");
        field_div.className = "d-flex flex-wrap gap-2";
    
        let p = document.createElement("p");
        p.textContent = field_name;
        field_div.appendChild(p);

        // Create proper checkbox input
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "propertiesInput";
        checkbox.checked = bool;

        // Add event listener for checkbox change
        checkbox.addEventListener('change', function() {
            bool = this.checked;
        });

        field_div.appendChild(checkbox);
        target_panel.appendChild(field_div);
    }

    CreateFieldNumber(target_panel, field_name, value, isInt) {
        let field_div = document.createElement("div");
        field_div.className = "d-flex flex-wrap gap-2";
    
        let p = document.createElement("p");
        p.textContent = field_name;
        field_div.appendChild(p);

        let input = document.createElement("input");
        input.type = "text";
        input.value = value;
        input.className = "propertiesInput";

        if(isInt) {
            input.addEventListener('input', function() {
                // Remove non-numeric characters
                this.value = this.value.replace(/[^-0-9]/g, '');
            });
            
            input.addEventListener('change', function() {
                // Convert to integer
                value = parseInt(this.value);
                this.value = value;
            });
        } else {
            input.addEventListener('input', function() {
                // Allow decimal points
                this.value = this.value.replace(/[^-0-9.]/g, '');
            });
            
            input.addEventListener('change', function() {
                value = parseFloat(this.value);
                this.value = value;
            });
        }

        this.NumberBehavior(input, value);
        field_div.appendChild(input);
        target_panel.appendChild(field_div);
    }

    CreateFieldString(target_panel, field_name, string) {
        let field_div = document.createElement("div");
        field_div.className = "d-flex flex-wrap gap-2";
    
        let p = document.createElement("p");
        p.textContent = field_name;
        field_div.appendChild(p);

        let input = document.createElement("input");
        input.type = "text";
        input.value = string;
        input.className = "propertiesInput";
        
        // Update the value when input changes
        input.addEventListener('input', function() {
            string = this.value;
        });
        
        field_div.appendChild(input);
        target_panel.appendChild(field_div);
    }

    CreateFieldVector(target_panel, field_name, parameter_list, dimensions) {
        let field_div = document.createElement("div");
        field_div.className = "d-flex flex-wrap gap-2";
    
        let p = document.createElement("p");
        p.textContent = field_name;
        field_div.appendChild(p);
    
        while (parameter_list.length < dimensions) {
            parameter_list.push(0);
        }
        
        for (let i = 0; i < dimensions; i++) {
            let input = document.createElement("input");
            input.type = "text";
            input.value = parameter_list[i];
            input.className = "propertiesInput";
            input.style.width = `${100 / (dimensions * 1.75)}%`;
            
            this.NumberBehavior(input, parameter_list[i], (newValue) => {
                parameter_list[i] = newValue;
            });
    
            field_div.appendChild(input);
        }
    
        target_panel.appendChild(field_div);
    }

    CreateFieldFile(target_panel, field_name, file_path) {
        let field_div = document.createElement("div");
        field_div.className = "d-flex flex-wrap gap-2";
    
        let p = document.createElement("p");
        p.textContent = field_name;
        field_div.appendChild(p);

        let fileDisplay = document.createElement("span");
        fileDisplay.textContent = file_path || "No file selected";
        fileDisplay.className = "file-display";
        field_div.appendChild(fileDisplay);

        let fileButton = document.createElement("button");
        fileButton.textContent = "Select File";
        fileButton.className = "file-button";
        fileButton.onclick = () => {
            let fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.style.display = "none";
            
            fileInput.onchange = (e) => {
                if (e.target.files && e.target.files[0]) {
                    let fileName = e.target.files[0].name;
                    fileDisplay.textContent = fileName;
                    file_path = fileName;
                }
                document.body.removeChild(fileInput); 
            };
            
            document.body.appendChild(fileInput);
            fileInput.click();
        };
        
        field_div.appendChild(fileButton);
        target_panel.appendChild(field_div);
    }

    CreateFieldList(target_panel, field_name, list_items) {
        let field_div = document.createElement("div");
        field_div.className = "d-flex flex-wrap gap-2";
    
        let p = document.createElement("p");
        p.textContent = field_name;
        field_div.appendChild(p);

        // Create a container for the list items
        let listContainer = document.createElement("div");
        listContainer.className = "list-container";
        
        // Function to render list items
        const renderList = () => {
            // Clear current items
            while (listContainer.firstChild) {
                listContainer.removeChild(listContainer.firstChild);
            }
            
            // Add each item with remove button
            list_items.forEach((item, index) => {
                let itemDiv = document.createElement("div");
                itemDiv.className = "list-item";
                
                let itemText = document.createElement("span");
                itemText.textContent = item;
                itemDiv.appendChild(itemText);
                
                let removeBtn = document.createElement("button");
                removeBtn.textContent = "X";
                removeBtn.className = "remove-item";
                removeBtn.onclick = () => {
                    list_items.splice(index, 1);
                    renderList();
                };
                
                itemDiv.appendChild(removeBtn);
                listContainer.appendChild(itemDiv);
            });
        };
        
        // Add new item button
        let addButton = document.createElement("button");
        addButton.textContent = "Add Item";
        addButton.className = "add-item-button";
        addButton.onclick = () => {
            list_items.push("New Item");
            renderList();
        };
        
        field_div.appendChild(listContainer);
        field_div.appendChild(addButton);
        
        // Initial render
        renderList();
        
        target_panel.appendChild(field_div);
    }

    NumberBehavior(input, initialValue, updateCallback = null) {
        let lastValue = initialValue;
    
        input.onchange = (e) => {
            if (e.target.value === "") {
                e.target.value = lastValue;
            } else {
                let newValue = isNaN(+e.target.value) ? lastValue : +e.target.value;
                if (updateCallback) {
                    updateCallback(newValue);
                } else {
                    lastValue = newValue;
                }
                e.target.value = newValue;
            }
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
            newValue = parseFloat(newValue.toFixed(2)); // Round to 2 decimal places
            
            input.value = newValue;
            
            if (updateCallback) {
                updateCallback(newValue);
            } else {
                lastValue = newValue;
            }
        });

        window.addEventListener("mouseup", () => {
            isDragging = false;
        });
    }

    // END Create Field

    UpdateObjectList(added_object) {
        let new_child = document.createElement("button");
        new_child.id = "opButton";
        new_child.textContent = added_object.name;
        this.leftPanelList.appendChild(new_child);

        new_child.onclick = () => {
            this.ClearList(this.rightPanelList.childNodes);
            
            // Object name header
            let object_name = document.createElement("p");
            object_name.textContent = `${added_object.name}`;
            object_name.className = "object-header";
            this.rightPanelList.appendChild(object_name);
            
            // Transform section header
            let transformHeader = document.createElement("h3");
            transformHeader.textContent = "Transform";
            transformHeader.className = "component-header";
            this.rightPanelList.appendChild(transformHeader);
            
            // Dealing with position
            this.CreateField(this.rightPanelList, [
                "Position",
                added_object.position,
                FieldType.VECTOR3
            ]);
            
            // Dealing with rotation
            this.CreateField(this.rightPanelList, [
                "Rotation",
                added_object.rotation,
                FieldType.VECTOR3
            ]);
            
            // Dealing with scale
            this.CreateField(this.rightPanelList, [
                "Scale",
                added_object.scale,
                FieldType.VECTOR3
            ]);
            
            // Dealing with enabled state
            this.CreateField(this.rightPanelList, [
                "Enabled",
                added_object.isEnabled,
                FieldType.BOOL
            ]);
            
            // Components section header
            let componentsHeader = document.createElement("h3");
            componentsHeader.textContent = "Components";
            componentsHeader.className = "component-header";
            this.rightPanelList.appendChild(componentsHeader);
            
            // Process all components
            const components = added_object.GetComponents();
            if (components && components.length > 0) {
                components.forEach(component => {
                    // Handle each component
                    if (component instanceof PIXI.Sprite || component instanceof PIXI.Container) {
                        // Add PIXI component header
                        let pixiHeader = document.createElement("h4");
                        pixiHeader.textContent = "PIXI Sprite";
                        pixiHeader.className = "subcomponent-header";
                        this.rightPanelList.appendChild(pixiHeader);
                        
                        // Expose PIXI component properties
                        this.ExposePixiComponent(component);
                    }
                    
                    if (component.constructor.name === "GameComponent" || 
                        (component.componentName && component.componentExpose)) {
                        // Add custom component header
                        let componentHeader = document.createElement("h4");
                        componentHeader.textContent = component.componentName || "Game Component";
                        componentHeader.className = "subcomponent-header";
                        this.rightPanelList.appendChild(componentHeader);
                        
                        // Process component's exposed variables
                        if (component.componentExpose && component.componentExpose.length > 0) {
                            component.componentExpose.forEach(exposedVar => {
                                this.CreateField(this.rightPanelList, exposedVar);
                            });
                        }
                        
                        // Call component's custom expose method if it exists
                        if (typeof component.Expose === 'function') {
                            component.Expose();
                        }
                    }
                });
            } else {
                // No components message
                let noComponents = document.createElement("p");
                noComponents.textContent = "No components attached";
                noComponents.className = "no-components";
                this.rightPanelList.appendChild(noComponents);
            }
            
            // Add component button
            let addComponentButton = document.createElement("button");
            addComponentButton.textContent = "Add Component";
            addComponentButton.className = "add-component-button";
            addComponentButton.onclick = () => {
                this.ShowAddComponentMenu(added_object);
            };
            this.rightPanelList.appendChild(addComponentButton);
        };

        this.CheckForDuplicatesAndRename(this.leftPanelList.childNodes);
        added_object.name = new_child.textContent; // To assign a new name if needed for duplicates

        // Add to engine hierarchy if engine exists
        if (this.engine) {
            this.engine.AddObjectToHierarchy(added_object);
        }
    }

    ExposePixiComponent(component) {
        if (component instanceof PIXI.Sprite) {
            if (component.texture && component.texture.baseTexture) {
                let texturePath = "Unknown Texture";
                
                if (component.texture.baseTexture.resource && 
                    component.texture.baseTexture.resource.source) {
                    if (typeof component.texture.baseTexture.resource.source === 'string') {
                        texturePath = component.texture.baseTexture.resource.source;
                    } else if (component.texture.baseTexture.resource.source.src) {
                        texturePath = component.texture.baseTexture.resource.source.src;
                    }
                }
                
                let field_div = document.createElement("div");
                field_div.className = "d-flex flex-wrap gap-2";
            
                let p = document.createElement("p");
                p.textContent = "Texture";
                field_div.appendChild(p);
    
                let fileDisplay = document.createElement("span");
                fileDisplay.className = "file-display";
                field_div.appendChild(fileDisplay);
    
                let fileButton = document.createElement("button");
                fileButton.textContent = "Select File";
                fileButton.className = "file-button";
                

                let parentGameObject = null;
                
                if (this.engine) {
                    let allObjects = this.engine.GetAllObjects();
                    for (let obj of allObjects) {
                        let components = obj.GetComponents();
                        if (components.includes(component)) {
                            parentGameObject = obj;
                            break;
                        }
                    }
                }
                
                fileButton.onclick = () => {
                    let fileInput = document.createElement("input");
                    fileInput.type = "file";
                    fileInput.accept = "image/*";
                    fileInput.style.display = "none";
                    
                    fileInput.onchange = (e) => {
                        if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            const reader = new FileReader();
                            
                            reader.onload = (event) => {
                                const img = new Image();
                                img.src = event.target.result;
                                
                                img.onload = () => {
                                    // Update the file display
                                    fileDisplay.textContent = file.name;
                                    
                                    // Update the sprite's texture
                                    const texture = PIXI.Texture.from(img);
                                    component.texture = texture;
                                    console.log("Sprite texture updated:", component);
                                    
                                    // Refresh the component view if needed
                                    if (parentGameObject) {
                                        let button = Array.from(this.leftPanelList.childNodes)
                                            .find(node => node.textContent === parentGameObject.name);
                                        if (button) {
                                            // Force refresh by clicking the button
                                            setTimeout(() => button.click(), 100);
                                        }
                                    }
                                };
                            };
                            
                            reader.readAsDataURL(file);
                        }
                        document.body.removeChild(fileInput);
                    };
                    
                    document.body.appendChild(fileInput);
                    fileInput.click();
                };
                
                field_div.appendChild(fileButton);
                this.rightPanelList.appendChild(field_div);
            }
            
            // Handle visibility
            this.CreateField(this.rightPanelList, [
                "Visible",
                component.visible,
                FieldType.BOOL
            ]);
            
            // Handle alpha
            this.CreateField(this.rightPanelList, [
                "Alpha",
                component.alpha,
                FieldType.FLOAT
            ]);
            
            // Handle tint
            this.CreateField(this.rightPanelList, [
                "Tint",
                component.tint.toString(16),
                FieldType.STRING
            ]);
        }
    }

    ShowAddComponentMenu(gameObject) {
        // Create a popup menu for adding components
        let menu = document.createElement("div");
        menu.className = "component-menu";
        
        const componentTypes = [
            "Sprite",
            "Text",
            "Sound",
            "Collider",
            "Script"
        ];
        
        componentTypes.forEach(type => {
            let option = document.createElement("button");
            option.textContent = type;
            option.onclick = () => {
                // Handle component creation based on type
                this.CreateComponent(gameObject, type);
                document.body.removeChild(menu);
            };
            menu.appendChild(option);
        });
        
        // Close button
        let closeBtn = document.createElement("button");
        closeBtn.textContent = "Cancel";
        closeBtn.onclick = () => {
            document.body.removeChild(menu);
        };
        menu.appendChild(closeBtn);
        
        document.body.appendChild(menu);
        
        // Center the menu
        menu.style.left = `${window.innerWidth/2 - menu.offsetWidth/2}px`;
        menu.style.top = `${window.innerHeight/2 - menu.offsetHeight/2}px`;
    }

    CreateComponent(gameObject, componentType) {
        switch(componentType) {
            case "Sprite":
                let fileInput = document.createElement("input");
                fileInput.type = "file";
                fileInput.accept = "image/*";
                fileInput.style.display = "none";

                fileInput.onchange = (e) => {
                    if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        const reader = new FileReader();

                        reader.onload = (event) => {
                            const img = new Image();
                            img.src = event.target.result;

                            img.onload = () => {
                                const texture = PIXI.Texture.from(img);

                                // Check if the game object already has a sprite component
                                let existingSprite = null;
                                const components = gameObject.GetComponents();
                                if (components) {
                                    existingSprite = components.find(comp => comp instanceof PIXI.Sprite);
                                }

                                if (existingSprite) {
                                    // Update the existing sprite with the new texture
                                    existingSprite.texture = texture;
                                    console.log("Sprite updated with new texture:", existingSprite);
                                } else {
                                    // Create new sprite if none exists
                                    const sprite = new PIXI.Sprite(texture);

                                    // Add sprite to game object
                                    gameObject.AddComponent(sprite);

                                    // Add sprite to the PIXI stage
                                    if (this.engine && this.engine.app) {
                                        this.engine.app.stage.addChild(sprite);
                                    } else if (window.app) {
                                        window.app.stage.addChild(sprite);
                                    }

                                    // IMPORTANT: Set position based on game object position
                                    sprite.x = gameObject.position[0];
                                    sprite.y = gameObject.position[1];

                                    // Add a direct synchronization between game object and sprite
                                    const originalUpdate = gameObject.Update;
                                    gameObject.Update = function(delta) {
                                        // Call the original update if it exists
                                        if (originalUpdate) {
                                            originalUpdate.call(gameObject, delta);
                                        }

                                        // Synchronize sprite position with game object position
                                        sprite.x = this.position[0];
                                        sprite.y = this.position[1];

                                        // Synchronize rotation and scale if needed
                                        sprite.rotation = this.rotation[2] * (Math.PI/180); // Convert degrees to radians
                                        sprite.scale.x = this.scale[0];
                                        sprite.scale.y = this.scale[1];
                                    };

                                    console.log("New sprite added:", sprite);
                                }

                                // Refresh the component view
                                let button = Array.from(this.leftPanelList.childNodes)
                                    .find(node => node.textContent === gameObject.name);
                                if (button) button.click();
                            };
                        };

                        reader.readAsDataURL(file);
                    }
                    document.body.removeChild(fileInput);
                };

                document.body.appendChild(fileInput);
                fileInput.click();
                break;

            // Rest of the method remains the same
        }
    }

    // List Aux
    CheckForDuplicatesAndRename(list) {
        let nameCount = {};

        Array.from(list).forEach(element => {
            let originalName = element.textContent.trim();
    
            let match = originalName.match(/^(.*?)(?: \((\d+)\))?$/);
            let baseName = match[1].trim();
            let existingCount = match[2] ? parseInt(match[2]) : 0;
    
            let count = nameCount[baseName] ? nameCount[baseName] + 1 : (existingCount + 1);
            nameCount[baseName] = count;
    
            element.textContent = count > 1 ? `${baseName} (${count - 1})` : baseName;
        });
    }

    ClearList(list) {
        Array.from(list).forEach(element => {
            element.remove();
        });
    }

    SetEngine(engine) {
        this.engine = engine;
    }

    static GetInstance() {
        return Editor.instance;
    }
}

export { Editor };

window.onload = function () {
    // Make sure all DOM elements exist before initializing
    const container = document.getElementById('gameViewContainer');
    
    // Create a context menu element if it doesn't exist
    if (!document.getElementById('contextMenu')) {
        const contextMenu = document.createElement('div');
        contextMenu.id = 'contextMenu';
        contextMenu.style.position = 'absolute';
        contextMenu.style.display = 'none';
        contextMenu.style.zIndex = '1000';
        contextMenu.style.backgroundColor = '#f9f9f9';
        contextMenu.style.border = '1px solid #ccc';
        contextMenu.style.borderRadius = '4px';
        contextMenu.style.padding = '5px';
        contextMenu.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        document.body.appendChild(contextMenu);
    }
    
    const editor = new Editor();

    let engine = new Engine();  
    editor.SetEngine(engine);
    
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
        if(keys.w) {
            gameObject.position[1] += -speed * delta;
        }
        if(keys.s) {
            gameObject.position[1] += speed * delta;
        }
        if(keys.a) {
            gameObject.position[0] += -speed * delta;
        }
        if(keys.d) {
            gameObject.position[0] += speed * delta;
        }
        engine.GetAllObjects().forEach(object => {
            object.Update(delta);

        });
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