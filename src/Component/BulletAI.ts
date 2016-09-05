import {IComponent} from "./Component";

import {IAttribute} from "../Attribute/package";

class BulletAI implements IComponent {
    id: string;

    constructor() {
        this.id = "AI";
    }

    update = (attribute: { [name: string]: IAttribute }): void => {
        if (attribute["Physics"].val["velocity"].magnitude() <= 1)
            attribute["Game"].val["active"] = false;
        let collisionList = attribute["Collision"].val["collidingWith"];
        for (let key in collisionList) {
            if (collisionList[key].attribute["type"] === "Enemy") {
                attribute["Game"].val["active"] = false;
                return;
            }
        }
    }
}

export {BulletAI}