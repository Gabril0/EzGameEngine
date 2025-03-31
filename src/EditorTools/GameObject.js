class GameObject{
    constructor(name, position, rotation, scale){
        this.name = name;
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;
        this.isEnabled = true;
        this.components = [];
        this.parent = null;


    }
    Destroy() {
        for (let key in this) {
            delete this[key];
        }
        Engine.instance.RemoveObjectFromHierarchy(this);
    }
}
export{GameObject};