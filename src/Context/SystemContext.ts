import {ISystem, SystemState} from "../System/package";

class SystemContext {
    private system: { [name: string]: ISystem };

    constructor() {
        this.system = {};
    }

    addSystem = (system: ISystem): void => {
        this.system[system.id] = system;
        console.log(`Register System: ${system.id}`);
    }

    getSystem = (name: string): ISystem => {
        return this.system[name];
    }

    removeSystem = (name: string): void => {
        this.system[name].finit();
        delete this.system[name];
    }

    updateSystems = (): void => {
        for (let key in this.system) {
            if (this.system[key].state === SystemState.None)
                this.system[key].init();
            this.system[key].update();
        }
    }
}

export {SystemContext};