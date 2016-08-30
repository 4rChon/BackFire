const WIDTH = 1024;
const HEIGHT = 1024;

function sign(x: number) {
    return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
}

class SystemContext {
    public system: { [name: string]: ISystem };

    constructor() {
        this.system = {};
    }

    public addSystem = (system: ISystem): void => {
        system.init();
        this.system[system.id] = system;
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
            this.system[key].update();
        }
    }
}

class EntityContext {
    public entity: { [index: number]: IEntity };
    private index: number;
    private player: IEntity;

    constructor() {
        this.index = 0;
        this.entity = {};
    }    

    public addEntity = (entity: IEntity): void => {
        entity.init();
        if(entity.attribute["Game"].val["Type"] === "Player")
            this.player = entity;
        this.entity[this.index++] = entity;
    }

    public getEntity = (index: number): IEntity => {
        return this.entity[index];
    }

    public getPlayer = (): IEntity => {
        return this.player;
    }

    public removeEntity = (index: number): void => {
        this.entity[index].finit();
        delete this.entity[index];
    }

    public updateEntities = (): void => {
        for (let key in this.entity) {
            this.entity[key].update();
        }
    }
}

interface ISystem {
    id: string;
    
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

class PhysicsSystem implements ISystem {
    public id: string = "";

    init = (): void => {

    }

    update = (): void => {

    }

    finit = (): void => {

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

class GameSystem implements ISystem {
    public id: string = "";

    private spawnTimer: number = 0;
    private maxTimer: number = 10;
    
    constructor() {
        this.id = "Game";
        this.spawnTimer = 0;
    }

    public init = (): void => {
        this.spawnPlayer(WIDTH/2, HEIGHT/2);
    }

    public update = (): void => {
        this.spawnTimer++;
        if(this.spawnTimer == this.maxTimer)
        {
            let x: number = Math.floor((Math.random() * WIDTH) + 1);
            let y: number = Math.floor((Math.random() * HEIGHT) + 1);
            this.spawnEnemy(x, y);
            this.spawnTimer = 0;
        }
    }

    public finit = (): void => {

    }

    spawnPlayer = (x: number, y: number): void => {
        let playerComponents = [
            new EntityGraphics(),
            new EntityPhysics(),
            new PlayerInput()
        ];
        
        let playerAttributes = [
            new Attribute("Transform", { 'x': x, 'y': y, 'w': 10, 'h': 10 }),
            new Attribute("Sprite", { 'color': "black" }),
            new Attribute("Physics", {'dx': 0, 'dy': 0, 'acceleration': 3, 'drag': 1, 'terminalVelocity': 15 }),
            new Attribute("Game", {'Type': 'Player'})
        ];    
        
        let player = new Entity(playerComponents, playerAttributes);
        
        entities.addEntity(player);
    }

    spawnEnemy = (x: number, y: number): void => {
        let enemyComponents = [
            new EntityGraphics(),
            new EntityPhysics(),
            new EnemyAI()
        ];

        let enemyAttributes = [
            new Attribute("Transform", { 'x': x, 'y': y, 'w': 15, 'h': 15}),
            new Attribute("Sprite", { 'color': "red" }),
            new Attribute("Physics", {'dx': 0, 'dy': 0, 'acceleration': 2, 'drag': 1, 'terminalVelocity': 25 }),
            new Attribute("Game", {'Type': 'Enemy'})
        ]

        let enemy = new Entity(enemyComponents, enemyAttributes);

        entities.addEntity(enemy);

    }
}

interface IComponent {
    id: string;

    update(attribute: { [name: string]: IAttribute }): void;
}

class EntityGraphics implements IComponent {
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

class EntityPhysics implements IComponent {
    public id: string = "";

    constructor() {
        this.id = "Physics";
    }

    update = (attribute: { [name: string]: IAttribute }): void => {
        let transform = attribute["Transform"];
        let physics = attribute["Physics"];

        if(Math.abs(<number>physics.val['dx']) > physics.val['terminalVelocity'])
            physics.val['dx'] = physics.val['terminalVelocity'] * sign(<number>physics.val['dx']);
        if(Math.abs(<number>physics.val['dy']) > physics.val['terminalVelocity'])
            physics.val['dy'] = physics.val['terminalVelocity'] * sign(<number>physics.val['dy']);

        transform.val['x'] += physics.val['dx'];
        transform.val['y'] += physics.val['dy'];

        if(Math.abs(<number>physics.val['dx']) > 0)
            physics.val['dx'] -= physics.val['drag'] * sign(<number>physics.val['dx']);
        if(Math.abs(<number>physics.val['dy']) > 0)
            physics.val['dy'] -= physics.val['drag'] * sign(<number>physics.val['dy']);
    }
}

class PlayerInput implements IComponent {
    public id: string = "";

    private physics: IAttribute;

    constructor() {
        this.id = "Input";

        let inputSystem = <InputSystem>systems.system["Input"];

        inputSystem.addKeycodeCallback(65, this.left);
        inputSystem.addKeycodeCallback(87, this.up);
        inputSystem.addKeycodeCallback(83, this.down);
        inputSystem.addKeycodeCallback(68, this.right);
        inputSystem.addKeycodeCallback(32, this.fire);
    }

    public update = (attribute: { [name: string]: IAttribute }): void => {
        this.physics = attribute["Physics"]; 
    }

    public left = (): void => {
        if(this.physics.val['dx'] > 0)
            this.physics.val['dx'] = 0;
        this.physics.val['dx'] -= this.physics.val['acceleration'];
    }

    public up = (): void => {
        if(this.physics.val['dy'] > 0)
            this.physics.val['dy'] = 0;
        this.physics.val['dy'] -= this.physics.val['acceleration'];
    }

    public down = (): void => {
        if(this.physics.val['dy'] < 0)
            this.physics.val['dy'] = 0;
        this.physics.val['dy'] += this.physics.val['acceleration'];
    }

    public right = (): void => {
        if(this.physics.val['dx'] < 0)
            this.physics.val['dx'] = 0;
        this.physics.val['dx'] += this.physics.val['acceleration'];
    }

    public fire = (): void => {
        console.log("fire");
    }
}

class EnemyAI{
    public id: string = "";

    constructor() {
        this.id = "AI";
    }

    public update = (attribute: {[name: string]: IAttribute}): void => {
        let player = entities.getPlayer();
        let playerTransform = player.attribute["Transform"].val;
        let enemyPhysics = attribute["Physics"].val;

        if(playerTransform['x'] < attribute["Transform"].val['x'])
            enemyPhysics['dx'] -= enemyPhysics['acceleration'];
        if(playerTransform['x'] > attribute["Transform"].val['x'])
            enemyPhysics['dx'] += enemyPhysics['acceleration'];
        if(playerTransform['y'] < attribute["Transform"].val['y'])
            enemyPhysics['dy'] -= enemyPhysics['acceleration'];
        if(playerTransform['y'] > attribute["Transform"].val['y'])
            enemyPhysics['dy'] += enemyPhysics['acceleration'];            
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
    systems.addSystem(new PhysicsSystem());
    systems.addSystem(new InputSystem());
    systems.addSystem(new GameSystem());    

    gameLoop();
}