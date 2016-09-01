import {IAttribute} from "../Attribute/package";

interface IComponent {
    id: string;

    update(attribute: { [name: string]: IAttribute }): void;
}

export {IComponent};