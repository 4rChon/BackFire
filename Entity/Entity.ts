import {entities} from "./Globals";

import {IAttribute} from "../Attribute/package";
import {IComponent} from "../Component/package";

interface IEntity {
    component: { [name: string]: IComponent };
    attribute: { [name: string]: IAttribute };

    init(index: number): void;
    update(): void;
    finit(): void;
}

class Entity implements IEntity {
    public component: { [name: string]: IComponent };
    public attribute: { [name: string]: IAttribute };

    constructor(components: IComponent[], attributes: IAttribute[]) {
        this.component = {};
        for (let key in components) {
            this.component[components[key].id] = components[key];
        }
        this.attribute = {};
        for (let key in attributes) {
            this.attribute[attributes[key].id] = attributes[key];
        }
    }

    init = (index: number): void => {
        this.attribute["Game"].val['index'] = index;
    }

    update = (): void => {
        if (!this.attribute["Game"].val['active']) {
            this.finit();
            return;
        }

        for (let key in this.component) {
            this.component[key].update(this.attribute);
        }
    }

    finit = (): void => {
        entities.removeEntity(this.attribute["Game"].val['index']);
    }
}

export {IEntity, Entity};