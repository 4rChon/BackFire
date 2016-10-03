import {IComponent} from "./Component";

import {systems} from "../Globals";

import {IAttribute} from "../Attribute/package";
import {GraphicsSystem} from "../System/package";

class EntityGraphics implements IComponent {
    id: string;

    private graphicsSystem: GraphicsSystem;

    constructor() {
        this.id = "Graphics";
        this.graphicsSystem = systems.getSystem("Graphics") as GraphicsSystem;
    }

    update = (attribute: { [name: string]: IAttribute }): void => {
        let transform = attribute["Transform"];
        let sprite = attribute["Sprite"];

        let ctxt = this.graphicsSystem.canvasContext;

        ctxt.fillStyle = sprite.val["color"];
        ctxt.fillRect(transform.val["position"].x, transform.val["position"].y, transform.val["dimensions"].x, transform.val["dimensions"].y);
    }
}

export {EntityGraphics};