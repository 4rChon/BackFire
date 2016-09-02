import {IEntity} from "../Entity/package";

class EntityContext {
    entity: { [index: number]: IEntity };
    private index: number;
    private player: IEntity;

    constructor() {
        this.entity = {};
        this.index = 0;
    }

    addEntity = (entity: IEntity): void => {
        this.entity[this.index] = (entity);
        entity.init(this.index++);
        if (entity.attribute["Game"].val["type"] === "Player")
            this.player = entity;
    }

    getEntity = (index: number): IEntity => {
        return this.entity[index];
    }

    getEntitiesWithComponent = (componentId: string): IEntity[] => {
        let entityList: IEntity[] = [];

        for (let key in this.entity) {
            if (this.entity[key].component.hasOwnProperty(componentId))
                entityList.push(this.entity[key]);
        }

        return entityList;
    }

    getPlayer = (): IEntity => {
        return this.player;
    }

    removeEntity = (index: number): void => {
        delete this.entity[index];
    }

    updateEntities = (): void => {
        for (let key in this.entity) {
            this.entity[key].update();
        }
    }
}

export {EntityContext};