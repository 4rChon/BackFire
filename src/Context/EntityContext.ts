import {IEntity} from "../Entity/package";

class EntityContext {
    public entity: { [index: string]: IEntity };
    private index: number;
    private player: IEntity;

    constructor() {
        this.entity = {};
        this.index = 0;
    }

    public addEntity = (entity: IEntity): void => {
        this.entity[this.index] = (entity);
        entity.init(this.index++);
        if (entity.attribute["Game"].val["type"] === "Player")
            this.player = entity;
    }

    public getEntity = (index: number): IEntity => {
        return this.entity[index];
    }

    public getPlayer = (): IEntity => {
        return this.player;
    }

    public removeEntity = (index: number): void => {
        delete this.entity[index];
    }

    public updateEntities = (): void => {
        for (let key in this.entity) {
            this.entity[key].update();
        }
    }
}

export {EntityContext};