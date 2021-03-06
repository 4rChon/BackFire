﻿import {SystemState, ISystem, GameSystem, PhysicsSystem} from "./package";

import {WIDTH, HEIGHT, systems, entities} from "../Globals";

class GraphicsSystem implements ISystem {
    id: string;
    state: SystemState;
    canvasContext: CanvasRenderingContext2D;

    private physicsSystem: PhysicsSystem;
    private gameSystem: GameSystem;

    constructor() {
        this.id = "Graphics";
        this.state = SystemState.None;
    }

    init = (): void => {
        this.state = SystemState.Init;
        let canvas = document.createElement("canvas");
        canvas.width = WIDTH;
        canvas.height = HEIGHT;
        document.getElementById("canvasContainer").appendChild(canvas);
        this.canvasContext = canvas.getContext("2d");
        this.physicsSystem = systems.getSystem("Physics") as PhysicsSystem;
        this.gameSystem = systems.getSystem("Game") as GameSystem;
    }

    update = (): void => {
        this.state = SystemState.Update;
        this.clear();
        this.renderScore();
        this.renderCooldown();
        this.renderPower();
        this.renderSpawnRate();
        this.renderSpawnAmount();
        this.renderFPS();
        this.renderUPS();
    }

    finit = (): void => {
        this.state = SystemState.Finit;
    }

    private clear = (): void => {
        this.canvasContext.fillStyle = "white";
        this.canvasContext.fillRect(0, 0, WIDTH, HEIGHT);
    }

    private renderScore = (): void => {
        this.canvasContext.fillStyle = "#eee";
        this.canvasContext.font = "400px Arial";
        this.canvasContext.textAlign = "center";
        this.canvasContext.fillText(`${this.gameSystem.getCurrentScore()}`, WIDTH / 2, HEIGHT / 2);
    }

    private renderCooldown = (): void => {
        this.canvasContext.fillStyle = "#999";
        this.canvasContext.font = "15px Arial";
        this.canvasContext.fillText("y", 50, 50);
        this.canvasContext.fillText("+", 70, 50);
        this.canvasContext.fillText(`-${entities.getPlayer().attribute["Weapon"].val["cooldown"]}`, 90, 50);
        this.canvasContext.fillText(`(${this.gameSystem.weaponRateCost})`, 130, 50);
    }

    private renderPower = (): void => {
        this.canvasContext.fillStyle = "#999";
        this.canvasContext.font = "15px Arial";
        this.canvasContext.fillText("u", 50, 100);
        this.canvasContext.fillText("+", 70, 100);
        this.canvasContext.fillText(`*${entities.getPlayer().attribute["Weapon"].val["power"]}`, 90, 100);
        this.canvasContext.fillText(`(${this.gameSystem.weaponPowerCost})`, 130, 100);
    }

    private renderSpawnRate = (): void => {
        this.canvasContext.fillStyle = "#999";
        this.canvasContext.font = "15px Arial";
        this.canvasContext.fillText("i", 50, 150);
        this.canvasContext.fillText("+", 70, 150);
        this.canvasContext.fillText(`/${this.gameSystem.spawnTimerMax}`, 90, 150);
        this.canvasContext.fillText(`(${this.gameSystem.spawnTimerCost})`, 130, 150);
    }

    private renderSpawnAmount = (): void => {
        this.canvasContext.fillStyle = "#999";
        this.canvasContext.font = "15px Arial";
        this.canvasContext.fillText("o", 50, 200);
        this.canvasContext.fillText("+", 70, 200);
        this.canvasContext.fillText(`x${this.gameSystem.spawnAmount}`, 90, 200);
        this.canvasContext.fillText(`(${this.gameSystem.spawnAmountCost})`, 130, 200);
    }

    private renderFPS = (): void => {
        this.canvasContext.fillStyle = "#0F0";
        this.canvasContext.font = "15px Arial";
        this.canvasContext.fillText(`FPS ${Math.round(this.physicsSystem.fps)}`, WIDTH/2, 50);
    }

    private renderUPS = (): void => {
        this.canvasContext.fillStyle = "#0F0";
        this.canvasContext.font = "15px Arial";
        this.canvasContext.fillText(`UPS ${Math.round(this.physicsSystem.fps * this.physicsSystem.updateCount * 100)/100}`, WIDTH/ 2, 100);
    }
}

export {GraphicsSystem};