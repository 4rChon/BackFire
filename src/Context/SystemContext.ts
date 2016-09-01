import {ISystem, SystemState} from "../System/package";

class SystemContext {
    private system: { [name: string]: ISystem };

    constructor() {
        this.system = {};
    }

    public addSystem = (system: ISystem): void => {
        this.system[system.id] = system;
        console.log("Register System: " + system.id);
    }

    public getSystem = (name: string): ISystem => {
        return this.system[name];
    }

    public removeSystem = (name: string): void => {
        this.system[name].finit();
        delete this.system[name];
    }

    public updateSystems = (): void => {
        for (let key in this.system) {
            if (this.system[key].state == SystemState.None)
                this.system[key].init();
            this.system[key].update();
        }
    }
}

export {SystemContext};