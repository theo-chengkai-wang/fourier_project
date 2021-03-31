/**
 * @deprecated
 * THOUGHT WAS USEFUL, ACTUALLY NOT USEFUL AT ALL
 * Works only with 3*3 matrices
 * Initialize with a 3*3 array of arrays of numbers.
 */

// ONLY 3x3 matrices.
export default class Matrix {
    matrix: Array<Array<number>>;

    constructor(matrix: Array<Array<number>>) {
        // assert(matrix.length === 3);
        // assert(matrix.length === matrix[0].length);
        this.matrix = matrix;
    }

    preMultiply(mat: Matrix) {
        let nMat = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        for (let i = 0; i < mat.matrix.length; i++) {
            for (let j = 0; j < this.matrix[0].length; j++) {
                let sum = 0;
                for (let k = 0; k < this.matrix.length; k++) {
                    sum += mat.matrix[i][k]*this.matrix[k][j];
                }
                nMat[i][j] = sum;
            }
        }
        this.matrix = nMat;
    }

    postMultiply(mat: Matrix) {
        let nMat = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        for (let i = 0; i < this.matrix.length; i++) {
            for (let j = 0; j < mat.matrix[0].length; j++) {
                let sum = 0;
                for (let k = 0; k < mat.matrix.length; k++) {
                    sum += this.matrix[i][k]*mat.matrix[k][j];
                }
                nMat[i][j] = sum;
            }
        }
        this.matrix = nMat;
    }

    static identity() {
        return new Matrix([[1, 0, 0],[0, 1, 0],[0, 0, 1]]);
    }

    static rotationMatrix(radians: number) {
        return new Matrix(
            [[Math.cos(radians), -Math.sin(radians), 0], 
            [Math.sin(radians), Math.cos(radians), 0], 
            [0, 0, 1]]);
    }

    static translationMatrix(dx:number, dy:number) {
        return new Matrix([[1, 0, dx],[0, 1, dy],[0, 0, 1]]);
    }
}