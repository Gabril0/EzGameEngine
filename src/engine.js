class Engine{
    constructor(){
        if(!Engine.instance){
            this.isRunning = false;
            this.hierarchy = [];
            this.instance = this;

        }

        return Engine.instance
    }
    // Create Game Object, with name, position, rotation, size, isEnabled, components

    AddObjectToHierarchy(object){
        object.isEnabled = true;

        hierarchy.push(object);
        return object // Return the object reference inside the hierarchy
    }
    LoadTexture(path) {
        return PIXI.Assets.load(path).then(texture => {
            return new PIXI.Sprite(texture);
        });
    }

    RefreshCurrentSprite(){
        

    }

    RemoveObjectFromHierarchy(target_object){
        let index = hierarchy.indexOf(target_object);

        if (index !== -1) {
            hierarchy.splice(index, 1);
        }

        target_object = null

    }

    StartGame(){}

    StopGame(){}

    static GetInstance(){
        return Engine.instance;

    }


}
export {Engine};



