class GameComponent{
    constructor(){
        // Component sprite, has a title, a sprite that references a image, a bool to flip it, a checkbox, etc
        this.gameObject;
        this.componentName;
        this.componentExpose = []; // This should be like ["Size", [1,2,3], FieldType.FLOAT], always following this structure
    }
    Expose(){}

    Start(){}

    Update(delta){}

    AddParameterToExpose(parameter_name, parameters, data_type){
        this.componentExpose.push[parameter_name, parameters, data_type];

    }

}
const FieldType = Object.freeze({
    FLOAT: 'float',
    INT: 'int',
    STRING: 'string',
    BOOL: 'bool',
    FILE: 'file',
    CHECKBOX: 'checkbox',
    LIST: 'list'
});
export{GameComponent};