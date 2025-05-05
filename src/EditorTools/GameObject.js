import { GameComponent } from "./GameComponent.js";

class GameObject {
    #components = [];
    
    /**
     * Create a new game object
     * @param {string} name - Name of the game object
     * @param {Array} position - [x, y, z] position
     * @param {Array} rotation - [x, y, z] rotation in radians
     * @param {Array} scale - [x, y, z] scale
     */
    constructor(name, position, rotation, scale) {
        this.name = name;
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;
        this.isEnabled = true;
        this.parent = null;
        this.children = [];
    }

    /**
     * Called when the game object is initialized
     */
    Start() {
        // Initialize all components
        this.#components.forEach(component => {
            if (component instanceof GameComponent && component.IsEnabled()) {
                component.Start();
            }
        });
        
        // Initialize children
        this.children.forEach(child => {
            child.Start();
        });
    }
    
    /**
     * Update this game object and all its components
     * @param {number} delta - Time elapsed since last frame
     */
    Update(delta) {
        if (!this.isEnabled) return;
        
        // Update PIXI components with transform values
        this.#components.forEach(component => {
            if (component instanceof PIXI.Sprite || component instanceof PIXI.Container) {
                component.x = this.position[0];
                component.y = this.position[1];
                // z is for 3D, but we'll keep it in the array for consistency
                component.rotation = this.rotation[2]; // Use Z rotation for 2D
                component.scale.set(this.scale[0], this.scale[1]);
            }
            
            // Update game components
            if (component instanceof GameComponent && component.IsEnabled()) {
                component.Update(delta);
            }
        });
        
        // Update children
        this.children.forEach(child => {
            child.Update(delta);
        });
    }

    /**
     * Destroy this game object and all its components
     */
    Destroy() {
        // Destroy all components
        this.#components.forEach(component => {
            // Special cleanup for PIXI objects
            if (component instanceof PIXI.DisplayObject && component.parent) {
                component.parent.removeChild(component);
            }
            
            // Call destroy on components if they have a destroy method
            if (component.destroy && typeof component.destroy === 'function') {
                component.destroy();
            }
        });
        
        // Destroy all children
        this.children.forEach(child => {
            child.Destroy();
        });
        
        // Clear arrays
        this.#components = [];
        this.children = [];
        
        // Remove from parent
        if (this.parent) {
            const index = this.parent.children.indexOf(this);
            if (index !== -1) {
                this.parent.children.splice(index, 1);
            }
            this.parent = null;
        }
        
        // Remove from engine if it exists
        if (window.Engine && window.Engine.instance) {
            window.Engine.instance.RemoveObjectFromHierarchy(this);
        }
        
        // Clear properties
        for (let key in this) {
            if (this.hasOwnProperty(key)) {
                delete this[key];
            }
        }
    }

    /**
     * Add a component to this game object
     * @param {Object} component - The component to add
     * @returns {Object} The added component
     */
    AddComponent(component) {
        this.#components.push(component);
        
        // Set the game object reference if it's a GameComponent
        if (component instanceof GameComponent) {
            component.SetGameObject(this);
        }
        
        return component;
    }

    /**
     * Get all components attached to this game object
     * @returns {Array} Array of components
     */
    GetComponents() {
        return this.#components;
    }

    /**
     * Get a component by type
     * @param {Function} type - The constructor of the component type to find
     * @returns {Object|null} The first component of the specified type, or null
     */
    GetComponent(type) {
        return this.#components.find(component => component instanceof type) || null;
    }

    /**
     * Get all components of a specific type
     * @param {Function} type - The constructor of the component type to find
     * @returns {Array} Array of components of the specified type
     */
    GetComponentsOfType(type) {
        return this.#components.filter(component => component instanceof type);
    }

    /**
     * Add a child game object
     * @param {GameObject} child - The child game object to add
     */
    AddChild(child) {
        if (child instanceof GameObject) {
            // Remove from previous parent
            if (child.parent) {
                const index = child.parent.children.indexOf(child);
                if (index !== -1) {
                    child.parent.children.splice(index, 1);
                }
            }
            
            // Set new parent
            child.parent = this;
            this.children.push(child);
        }
    }

    /**
     * Remove a child game object
     * @param {GameObject} child - The child game object to remove
     */
    RemoveChild(child) {
        const index = this.children.indexOf(child);
        if (index !== -1) {
            this.children.splice(index, 1);
            child.parent = null;
        }
    }

    /**
     * Enable or disable this game object
     * @param {boolean} state - Whether to enable or disable
     */
    SetEnabled(state) {
        this.isEnabled = state;
    }

    /**
     * Clone this game object
     * @returns {GameObject} A new game object with the same properties
     */
    Clone() {
        // Create a new game object with the same transform
        const clone = new GameObject(
            this.name + " (Clone)",
            [...this.position],
            [...this.rotation],
            [...this.scale]
        );
        
        // Copy enabled state
        clone.isEnabled = this.isEnabled;
        
        // Clone components (basic copying for now)
        this.#components.forEach(component => {
            if (component instanceof GameComponent) {
                // For game components, create a new instance
                const compClone = new component.constructor();
                
                // Copy exposed parameters
                component.GetExposedParameters().forEach(param => {
                    const [name, value, type] = param;
                    // Deep copy arrays, shallow copy other values
                    let clonedValue;
                    if (Array.isArray(value)) {
                        clonedValue = [...value];
                    } else {
                        clonedValue = value;
                    }
                    compClone.AddParameterToExpose(name, clonedValue, type);
                });
                
                clone.AddComponent(compClone);
            }
            // PIXI components would need special handling depending on type
        });
        
        return clone;
    }
}

export { GameObject };