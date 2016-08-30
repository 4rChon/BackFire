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
    public id: string = "";
    public canvasContext: CanvasRenderingContext2D;

    constructor() {
        this.id = "Graphics";
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

class InputSystem implements ISystem {
    public id: string = "";

    public keyCallback: { [keycode: number]: () => void; } = {};
    public keyDown: { [keycode: number]: boolean; } = {};

    constructor() {
        this.id = "Input";
    }

    public init = (): void => {
        document.addEventListener('keydown', this.keyboardDown);
        document.addEventListener('keyup', this.keyboardUp);
    }

    public keyboardDown = (event: KeyboardEvent): void => {
        event.preventDefault();
        this.keyDown[event.keyCode] = true;
    }

    public keyboardUp = (event: KeyboardEvent): void => {
        this.keyDown[event.keyCode] = false;
    }

    public addKeycodeCallback = (keycode: number, f: () => void): void => {
        this.keyCallback[keycode] = f;
        this.keyDown[keycode] = false;
    }

    public update = (): void => {
        for (var key in this.keyDown) {
            var is_down: boolean = this.keyDown[key];
            if (is_down) {
                var callback: () => void = this.keyCallback[key];
                if (callback != null) {
                    callback();
                }
            }
        }
    }

    public finit = (): void => {
    }
}

interface IComponent {
    id: string;

    update(attribute: { [name: string]: IAttribute }): void;
}

class PlayerGraphics implements IComponent {
    public id: string = "";

    constructor() {
        this.id = "Graphics";
    }

    update = (attribute: { [name: string]: IAttribute }): void => {
        let transform = attribute["Transform"];
        let sprite = attribute["Sprite"];

        let ctxt: CanvasRenderingContext2D = (<GraphicsSystem>systems.system["Graphics"]).canvasContext;

        ctxt.fillStyle = sprite.val['color'];
        ctxt.fillRect(transform.val['x'], transform.val['y'], transform.val['w'], transform.val['h']);
    }
}

class PlayerInput implements IComponent {
    public id: string = "";

    constructor() {
        this.id = "Input";

        let inputSystem = <InputSystem>systems.system["Input"];

        inputSystem.addKeycodeCallback(65, this.left);
        inputSystem.addKeycodeCallback(87, this.up);
        inputSystem.addKeycodeCallback(83, this.down);
        inputSystem.addKeycodeCallback(68, this.right);
        inputSystem.addKeycodeCallback(32, this.fire);
    }

    update = (attribute: { [name: string]: IAttribute }): void => {
    }

    left = (): void => {
        console.log("left");
    }

    up = (): void => {
        console.log("up");
    }

    down = (): void => {
        console.log("down");
    }

    right = (): void => {
        console.log("right");
    }

    fire = (): void => {
        console.log("fire");
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
    systems.addSystem(new GraphicsSystem());
    systems.addSystem(new InputSystem());

    let playerComponents = [
        new PlayerGraphics(),
        new PlayerInput()
    ];
    let playerAttributes = [
        new Attribute("Transform", { 'x': 50, 'y': 50, 'w': 10, 'h': 10 }),
        new Attribute("Sprite", { 'color': "black" })];    
    let player = new Entity(playerComponents, playerAttributes);
    entities.addEntity(player);


    gameLoop();
}