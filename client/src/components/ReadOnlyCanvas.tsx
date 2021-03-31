import {useRef, useEffect} from 'react';
import {CanvasPoint} from '../utils/Geometry';
import Fourier, {Complex, complexPointToCanvasPoint} from '../utils/Fourier';
import AnimatedCanvas from './AnimatedCanvas';

/**
 * @field fourierCoefs: fourierCoefficients 
 * @field width: width of canvas in px
 * @field height: height of canvas in px.
 * @field pointsOfPath: Array of points drawn by the user
 */
export type ReadOnlyCanvasProps = {
    fourierCoefs: Array<Complex>;
    width: number; 
    height: number;
    pointsOfPath: Complex[];
};

const POINT_HISTORY_MAX_DISPLAY = 1000;
const FOURIER_DEFAULT_BASE_FREQUENCY = 1/5;

export default function ReadOnlyCanvas({pointsOfPath, fourierCoefs, width, height}: ReadOnlyCanvasProps) {
    let fourier = useRef(new Fourier(fourierCoefs, (fourierCoefs.length-1)/2, FOURIER_DEFAULT_BASE_FREQUENCY));
    const pointHistoryRef = useRef<CanvasPoint[]>(new Array<CanvasPoint>(POINT_HISTORY_MAX_DISPLAY));

    // Effect: reinitialize history ref when coef change

    useEffect(() => {
        pointHistoryRef.current = new Array<CanvasPoint>(POINT_HISTORY_MAX_DISPLAY);
    }, [fourierCoefs]);

    let backgroundDraw = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
        ctx.strokeStyle="gray";
        ctx.lineWidth=2;
        ctx.beginPath()
        for (let i = 1; i < pointsOfPath.length; i++) {
            let lastPoint = complexPointToCanvasPoint(pointsOfPath[i-1], canvas.width, canvas.height);
            let currentPoint = complexPointToCanvasPoint(pointsOfPath[i], canvas.width, canvas.height);
            ctx.moveTo(lastPoint.u, lastPoint.v);
            ctx.lineTo(currentPoint.u, currentPoint.v);
        }
        ctx.stroke()
    }

    let draw = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, progress: number, frameLength: number) => {
        // Frame length is in milliseconds so let's do the conversion first.
        fourier.current.nextFrame(frameLength/1000);
        let points = fourier.current.currentCanvasState();
        // Draw history
        let lastPoint = points[points.length - 1].getCanvasCoordinates(canvas.width, canvas.height);
        pointHistoryRef.current.shift();
        pointHistoryRef.current.push(lastPoint);
        ctx.strokeStyle = "#00ccff";
        ctx.lineWidth = 3;
        ctx.beginPath()
        for (let i = 1; i < pointHistoryRef.current.length; i++) {
            let lastPoint = pointHistoryRef.current[i-1];
            let currentPoint = pointHistoryRef.current[i];
            if (lastPoint && currentPoint) {
                ctx.moveTo(lastPoint.u, lastPoint.v);
                ctx.lineTo(currentPoint.u, currentPoint.v);    
            }
        }
        ctx.stroke()
        // Draw vectors
        for (let i = 1; i < points.length; i++) {
            ctx.beginPath();
            let sourcePoint = points[i - 1].getCanvasCoordinates(canvas.width, canvas.height);
            let destinationPoint = points[i].getCanvasCoordinates(canvas.width, canvas.height);
            ctx.strokeStyle = "white";
            ctx.moveTo(sourcePoint.u, sourcePoint.v);
            ctx.lineTo(destinationPoint.u, destinationPoint.v);
            ctx.stroke();
        }        
    }
    return (
        <div className="ReadOnlyCanvas">
            <AnimatedCanvas 
            draw={draw} 
            preDraw={(ctx, canvas) => {ctx.clearRect(0, 0, canvas.width, canvas.height)}}
            animate={true} 
            backgroundDraw={backgroundDraw} 
            options={{width: `${width}px`, height: `${height}px`}}/>
        </div>
    );
}