export class Vector {
    x: number;
    y: number;
    defaultRotateRadians: number; // Rotation rad per second

    constructor(x: number, y:number, defaultRotateRadians: number) {
        this.x = x;
        this.y = y;
        this.defaultRotateRadians = defaultRotateRadians;
    }

    rotate(frameLength: number = 1) {
        let rotateRad = this.defaultRotateRadians * frameLength;
        let nX = Math.cos(rotateRad)*this.x - Math.sin(rotateRad)*this.y;
        let nY = Math.sin(rotateRad)*this.x + Math.cos(rotateRad)*this.y;
        this.x = nX;
        this.y = nY;
    }

}

export class Point {
    x: number;
    y: number; 

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    getCanvasCoordinates(canvasWidth:number, canvasHeight:number) : CanvasPoint {
        return {
            u: canvasWidth/2+this.x,
            v: canvasHeight/2-this.y
        };
    }

    translated(v: Vector) {
        return new Point(this.x+v.x, this.y + v.y);
    }

}

export type CanvasPoint = {u:number, v:number};

export function getPointFromCanvasPoint(cp: CanvasPoint, canvasWidth: number, canvasHeight: number) {
    return new Point(cp.u-canvasWidth/2, canvasHeight/2 - cp.v);
}