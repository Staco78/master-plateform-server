export default class Vector2D {
    private _x: number;
    private _y: number;

    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    get x() {
        return this._x;
    }

    set x(x: number) {
        this._x = x;
    }

    get y() {
        return this._y;
    }

    set y(y: number) {
        this._y = y;
    }

    equals(compareTo: { x: number; y: number }) {
        return this.x === compareTo.x && this.y === compareTo.y;
    }

    clone(): Vector2D {
        return new Vector2D(this.x, this.y);
    }
}
