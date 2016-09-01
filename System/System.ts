enum SystemState {
    None,
    Init,
    Update,
    Finit
}

interface ISystem {
    id: string;
    state: SystemState;

    init(): void;
    update(): void;
    finit(): void;
}

export {SystemState, ISystem};