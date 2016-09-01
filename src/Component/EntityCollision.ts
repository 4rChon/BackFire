import {IComponent} from "./Component";

import {entities} from "../Globals";
import {Vector} from "../Util/Util";

import {IAttribute} from "../Attribute/package";

class EntityCollision implements IComponent {
    public id: string = "";

    constructor() {
        this.id = "Collision";
    }

    public update = (attribute: { [name: string]: IAttribute }): void => {
        let entityList = entities.entity;
        for (let key in entityList) {
            if (key == attribute["Game"].val['index'])
                continue;

            if (attribute["Collision"].val['collidingWith'] !== 'Nothing')
                return;

            let collideWith: { [name: string]: Vector } = {};

            collideWith['position'] = entityList[key].attribute["Transform"].val['position'];
            collideWith['dimensions'] = entityList[key].attribute["Transform"].val['dimensions'];

            let dimensions: Vector = new Vector(0, 0);

            dimensions.add(collideWith['dimensions']);
            dimensions.add(attribute["Transform"].val['dimensions']);
            dimensions.multiply(0.5);

            let difference: Vector = new Vector(0, 0);

            difference.copy(collideWith['position']);
            difference.subtract(attribute["Transform"].val['position']);
            difference.x = Math.abs(difference.x);
            difference.y = Math.abs(difference.y);

            if (difference.x < dimensions.x && difference.y < dimensions.y) {
                attribute["Collision"].val['collidingWith'] = entityList[key].attribute["Game"].val['type'];
                entityList[key].attribute["Collision"].val['collidingWith'] = attribute["Game"].val['type'];
            }
        }
    }
}

export {EntityCollision};