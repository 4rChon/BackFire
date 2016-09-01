import {IComponent} from "./Component";

import {IAttribute} from "../Attribute/package";

class BulletAI implements IComponent {
    public id: string = "";

    constructor() {
        this.id = "AI";
    }

    public update = (attribute: { [name: string]: IAttribute }): void => {
        if (attribute["Physics"].val['velocity'].magnitude() == 0)
            attribute["Game"].val['active'] = false;
        if (attribute["Collision"].val['collidingWith'] === 'Enemy')
            attribute["Game"].val['active'] = false;
    }
}

export {BulletAI}