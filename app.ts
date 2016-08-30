const WIDTH = 1024;
const HEIGHT = 1024;
class SystemContext {
    public system: { [name: string]: ISystem };

    constructor() {
        this.system = {};
    }

    public addSystem(system: ISystem) {
        system.init();
        this.system[system.id] = system;
    }

    public removeSystem(name: string) {
        this.system[name].finit();
        delete this.system[name];
    }

    public updateSystems() {
        for (let key in this.system) {
            this.system[key].update();
        }
    }
}

class EntityContext {
    public entity: { [index: number]: IEntity };
    private index: number;

    constructor() {
        this.index = 0;
        this.entity = {};
    }

    public addEntity(entity: IEntity) {
        entity.init();
        this.entity[this.index++] = entity;
    }

    public removeEntity(index: number) {
        this.entity[index].finit();
        delete this.entity[index];
    }

    public updateEntities() {
        for (let key in this.entity) {
            this.entity[key].update();
        }
    }
}

interface ISystem {
    id: string

    init(): void;
    update(): void;
    finit(): void;
}

class GraphicsSystem implements ISystem {    
    public id: string;
    public canvasContext: CanvasRenderingContext2D;

    constructor(id: string) {
        this.id = id;
    }

    public init = (): void => {
        let canvas = document.createElement("canvas");
        canvas.width = WIDTH;
        canvas.height = HEIGHT;        
        document.getElementById("canvasContainer").appendChild(canvas);
        this.canvasContext = canvas.getContext("2d");
    }

    private clear = (): void => {
        this.canvasContext.fillStyle = "white";
        this.canvasContext.fillRect(0, 0, WIDTH, HEIGHT);
    }

    public update = (): void => {
        this.clear();
    }

    public finit = (): void => {
    }
}

interface IComponent {
    id: string;

    update(attribute: { [name: string]: IAttribute }): void;
}

class PlayerGraphics implements IComponent {
    public id: string;        
    public width: number;
    public height: number;
    public color: string;

    constructor(id: string, width: number, height: number, color: string) {
        this.id = id;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    update = (attribute: { [name: string]: IAttribute }): void => {
        let transform: Attribute = attribute["Transform"];
        let ctxt: CanvasRenderingContext2D = (<GraphicsSystem>systems.system["Graphics"]).canvasContext;
        ctxt.fillStyle = this.color;
        ctxt.fillRect(transform.val['x'], transform.val['y'], transform.val['w'], transform.val['h']);
    }
}

interface IAttribute {
    id: string;
    val: { [name: string]: any };
}

class Attribute implements IAttribute {
    public id: string = "";
    public val: { [name: string]: any } = {};

    constructor(id: string, val: { [name: string]: any }) {
        this.id = id;
        this.val = val;
    }
}

interface IEntity {
    component: { [name: string]: IComponent };
    attribute: { [name: string]: IAttribute };

    init(): void;
    update(): void;
    finit(): void;
}

class Entity implements IEntity {

    public x: number;
    public y: number;

    public component: { [name: string]: IComponent };
    public attribute: { [name: string]: IAttribute };

    constructor(components : IComponent[], attributes : IAttribute[]) {
        this.component = {};
        for (let key in components) {
            this.component[components[key].id] = components[key];
        }
        this.attribute = {};
        for (let key in attributes) {
            this.attribute[attributes[key].id] = attributes[key];
        }
    }

    init = (): void => {
    }

    update = (): void => {
        for (let key in this.component) {
            this.component[key].update(this.attribute);
        }
    }

    finit = (): void => {
    }
}

function gameLoop() {
    requestAnimationFrame(gameLoop);
    systems.updateSystems();
    entities.updateEntities();    
}

let systems = new SystemContext();
let entities = new EntityContext();

window.onload = () => {    
    systems.addSystem(new GraphicsSystem("Graphics"));
    let playerComponents = [new PlayerGraphics("Graphics", 50, 50, "black")];
    let playerAttributes = [new Attribute("Transform", { 'x': 50, 'y': 50, 'w': 10, 'h': 10 })];
    let player = new Entity(playerComponents, playerAttributes);
    entities.addEntity(player);


    gameLoop();
}