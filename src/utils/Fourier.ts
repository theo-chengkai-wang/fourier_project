import {Vector, Point} from "./Geometry";

export const THRESHOLD = 1e-7;

export type Complex = {real:number, imag: number};

export function complexPointToCanvasPoint(c: Complex, canvasWidth:number, canvasHeight:number) {
    return {
        u: canvasWidth/2+c.real,
        v: canvasHeight/2-c.imag
    };
}

/**
 * Wrapper class for Fourier vectors
 * @property vectors: array of current Fourier vectors
 * @property maxN: max N for the Fourier series expansion
 * @property baseFrequency: number of cycles per second for the first rotating arrow. 
 */

export default class Fourier {
    vectors: Array<Vector>;
    maxN: number; 
    baseFrequency: number; // Number of cycles per second.

    constructor(fourier_coefs: Array<Complex>, maxN:number, baseFrequency:number) {
        console.log(fourier_coefs.length)
        // assert(maxN*2+1 === fourier_coefs.length);
        this.maxN = maxN;
        this.baseFrequency = baseFrequency;
        this.vectors = new Array<Vector>();
        // c_0
        this.vectors.push(new Vector(fourier_coefs[0].real, fourier_coefs[0].imag, 0));
        for (let i = 1; i <= maxN; i++) {
            let c_n_real = (Math.abs(fourier_coefs[2*i-1].real) > THRESHOLD) ? fourier_coefs[2*i-1].real:0;
            let c_n_imag =  (Math.abs(fourier_coefs[2*i-1].imag) > THRESHOLD) ? fourier_coefs[2*i-1].imag:0;
            if (c_n_real !== 0 || c_n_imag !== 0) {
                // c_n 
                this.vectors.push(new Vector(
                    fourier_coefs[2*i-1].real,
                    fourier_coefs[2*i-1].imag,
                    i*baseFrequency*Math.PI));
            }
            
            let c_neg_real = (Math.abs(fourier_coefs[2*i].real) > THRESHOLD) ? fourier_coefs[2*i].real:0;
            let c_neg_imag =  (Math.abs(fourier_coefs[2*i].imag) > THRESHOLD) ? fourier_coefs[2*i].imag:0;

            if (c_neg_real !== 0 || c_neg_imag !== 0) {
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

    /**
     * Computes next frame after [frameLength] seconds and updates the Fourier object
     */
    nextFrame(frameLength: number) {
        for (let i = 0; i < this.vectors.length; i++) {
            this.vectors[i].rotate(frameLength);
        }
    }

}