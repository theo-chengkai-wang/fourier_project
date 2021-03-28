import {Vector, Point} from "./Geometry";

export const THRESHOLD = 1e-7;

/**
 * Wrapper class for Fourier vectors
 * @property vectors: array of current Fourier vectors
 * @property maxN: max N for the Fourier series expansion
 * @property baseFrequency: number of cycles per second for the first rotating arrow. 
 * @property frameLength: length of each frame (each timeout set) before next render. 
 */

export default class Fourier {
    vectors: Array<Vector>;
    maxN: number; 
    baseFrequency: number; // Number of cycles per second.
    frameLength: number;

    constructor(fourier_coefs: Array<{real:number, imag: number}>, maxN:number, baseFrequency:number, frameLength: number) {
        // assert(maxN*2+1 === fourier_coefs.length);
        this.maxN = maxN;
        this.baseFrequency = baseFrequency;
        this.frameLength = frameLength;
        this.vectors = new Array<Vector>();
        // c_0
        this.vectors.push(new Vector(fourier_coefs[0].real, fourier_coefs[0].imag, 0));
        for (let i = 1; i <= maxN; i++) {
            if (Math.abs(fourier_coefs[2*i-1].real) > THRESHOLD || Math.abs(fourier_coefs[2*i-1].imag) > THRESHOLD) {
                // c_n 
                this.vectors.push(new Vector(
                    fourier_coefs[2*i-1].real,
                    fourier_coefs[2*i-1].imag,
                    i*baseFrequency*Math.PI));
            }
            
            if (Math.abs(fourier_coefs[2*i].real) > THRESHOLD || Math.abs(fourier_coefs[2*i].imag) > THRESHOLD) {
                // c_-n
                this.vectors.push(new Vector(
                    fourier_coefs[2*i].real,
                    fourier_coefs[2*i].imag,
                    -i*baseFrequency*Math.PI));
            }
        }
    }

    // returns an array of objects {}
    currentCanvasState() {
        const points = new Array<Point>(this.vectors.length+1);
        points[0] = new Point(0, 0);
        // Vector 0 between 0, 1; vector 1 between 1, 2; vector i-1 between i-1, i.
        for (let i = 1; i < points.length; i++) {
            points[i] = points[i-1].translated(this.vectors[i-1]);
        }
        return points;
    }

    nextFrame() {
        for (let i = 0; i < this.vectors.length; i++) {
            this.vectors[i].rotate(this.frameLength);
        }
    }

}