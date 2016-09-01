import {ISystem, SystemState} from "./System";

class PhysicsSystem implements ISystem {
    public id: string;
    public state: SystemState;

    constructor() {
        this.id = 'Physics';
        this.state = SystemState.None;
    }

    init = (): void => {
        this.state = SystemState.Init;
    }

    update = (): void => {
        this.state = SystemState.Update;
    }

    finit = (): void => {
        this.state = SystemState.Finit;
    }
}

export {PhysicsSystem};