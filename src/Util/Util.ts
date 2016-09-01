class Vector {
    public x: number = 0;
    public y: number = 0;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public magnitude = (): number => {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    public setMagnitude = (magnitude: number): void => {
        let angle = this.getAngle();
        this.x = magnitude * Math.cos(angle);
        this.y = magnitude * Math.sin(angle);
    }

    public magSq = (): number => {
        return this.x * this.x + this.y * this.y;
    }

    public normalize = (): Vector => {
        let len: number = this.magnitude();
        this.x /= len;
        this.y /= len;
        return this;
    }

    public zero = (): void => {
        this.x = 0;
        this.y = 0;
    }

    public copy = (v: Vector): void => {
        this.x = v.x;
        this.y = v.y;
    }

    public rotate = (radians: number): void => {
        let cos: number = Math.cos(radians);
        let sin: number = Math.sin(radians);
        let x: number = (cos * this.x) + (sin * this.y);
        let y: number = (cos * this.y) - (sin * this.x);
        this.x = x;
        this.y = y;
    }

    public getAngle = (): number => {
        return Math.atan2(this.y, this.x);
    }

    public multiply = (value: number): void => {
        this.x *= value;
        this.y *= value;
    }

    public add = (v: Vector): void => {
        this.x += v.x;
        this.y += v.y;
    }

    public subtract = (v: Vector): void => {
        this.x -= v.x;
        this.y -= v.y;
    }
}

function sign(x: number) {
    return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
}

export {Vector, sign};