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
        if(entity.attribute["Game"].val["type"] === "Player")
            this.player = entity;
        console.log("Create: " + entity.index + ' : ' + entity.attribute['Game'].val['type']);        
    }

    public getEntity = (index: number): IEntity => {
        return this.entity[index];
    }

    public getPlayer = (): IEntity => {
        return this.player;
    }

    public removeEntity = (index: number): void => {        
        console.log("Destroy: " + this.entity[index] + ' : ' + this.entity[index].attribute['Game'].val['type']);
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
    private maxTimer: number = 25;
    
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
            new Attribute("Game", {'type': 'Player', 'active': true}),
            new Attribute("Weapon", {'rate': 5, 'power': 20})
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
            new Attribute("Physics", {'dx': 0, 'dy': 0, 'acceleration': 2, 'drag': 1, 'terminalVelocity': 20 }),
            new Attribute("Game", {'type': 'Enemy', 'active': true})
        ]

        let enemy = new Entity(enemyComponents, enemyAttributes);

        entities.addEntity(enemy);
    }

    spawnBullet = (x: number, y: number, dx: number, dy: number): void => {
        let bulletComponents = [
            new EntityGraphics(),
            new EntityPhysics(),
            new BulletAI()
        ];

        let bulletAttributes = [
            new Attribute("Transform", { 'x': x, 'y': y, 'w': 5, 'h': 5}),
            new Attribute("Sprite", {'color': "black"}),
            new Attribute("Physics", {'dx': dx, 'dy': dy, 'acceleration': 0, 'drag': 1, 'terminalVelocity': 100}),
            new Attribute("Game", {'type': 'Bullet', 'active': true})        
        ]

        let bullet = new Entity(bulletComponents, bulletAttributes);

        entities.addEntity(bullet);
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
    private transform: IAttribute;
    private weapon: IAttribute;
    private cooldown: number;
    private lastDx: number = 1;
    private lastDy: number = 0;

    constructor() {
        this.id = "Input";
        this.cooldown = 0;

        let inputSystem = <InputSystem>systems.system["Input"];

        inputSystem.addKeycodeCallback(65, this.left);
        inputSystem.addKeycodeCallback(87, this.up);
        inputSystem.addKeycodeCallback(83, this.down);
        inputSystem.addKeycodeCallback(68, this.right);
        inputSystem.addKeycodeCallback(32, this.fire);
    }

    public update = (attribute: { [name: string]: IAttribute }): void => {
        this.physics = attribute["Physics"];
        this.transform = attribute["Transform"];
        this.weapon = attribute["Weapon"];
        this.cooldown++;
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
        if(this.cooldown >= this.weapon.val['rate']){
            let dx = this.physics.val['dx'];
            let dy = this.physics.val['dy'];
            
            if(dx == 0 && dy == 0){
                dx = this.lastDx;
                dy = this.lastDy;
            }

            dx = -sign(<number>dx) * this.weapon.val['power'];
            dy = -sign(<number>dy) * this.weapon.val['power'];

            this.lastDx = dx;
            this.lastDy = dy;
        
            (<GameSystem>systems.system["Game"]).spawnBullet(this.transform.val['x'], this.transform.val['y'], dx, dy);
            this.cooldown = 0;
        }
    }
}

class EnemyAI {
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

class BulletAI {
    public id: string = "";

    constructor() {
        this.id = "AI";
    }

    public update = (attribute: {[name: string]: IAttribute}): void => {
        if(attribute["Physics"].val['dx'] == 0 && attribute["Physics"].val['dy'] == 0)
            attribute["Game"].val['active'] = false;
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
    index: number;

    component: { [name: string]: IComponent };
    attribute: { [name: string]: IAttribute };

    init(index: number): void;
    update(): void;
    finit(): void;
}

class Entity implements IEntity {
    public index: number;

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

    init = (index: number): void => {
        this.index = index;
    }

    update = (): void => {
        if(!this.attribute["Game"].val['active'])
        {
            this.finit();
            return;
        }

        for (let key in this.component) {
            this.component[key].update(this.attribute);
        }
    }

    finit = (): void => {
        entities.removeEntity(this.index);
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