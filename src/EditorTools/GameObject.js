import { GameComponent } from "./GameComponent";
class GameObject{
    #components = [];
    constructor(name, position, rotation, scale){
        this.name = name;
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;
        this.isEnabled = true;
        this.parent = null;



    }
    Start(){
        this.components.forEach(component => {
            if(component instanceof GameComponent){
                component.Start();
            }
        });
    }
    Update(delta) {
        this.components.forEach(component => {
            if (component instanceof PIXI.Sprite || component instanceof PIXI.Container) {
                component.x = this.position[0];
                component.y = this.position[1];
                component.z = this.position[2];
                component.rotation = this.rotation[2];
                component.scale.set(this.scale[0], this.scale[1]);
            }
            if(component instanceof GameComponent){
                component.Update(delta);
            }
        });
    }
    Destroy() {
        for (let key in this) {
            delete this[key];
        }
        Engine.instance.RemoveObjectFromHierarchy(this);
    }
    AddComponent(component){
        this.#components.add(component);
        if(component instanceof GameComponent){
            component.gameObject = GameObject;
        }   
    }
    GetComponents(){
        return this.#components;
    }
}
export{GameObject};