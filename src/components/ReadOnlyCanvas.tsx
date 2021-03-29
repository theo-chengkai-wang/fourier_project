import React, { useCallback } from 'react';
import {useRef, useState, useEffect} from 'react';
import {Point} from '../utils/Geometry';
import Fourier from '../utils/Fourier';
import AnimatedCanvas from './AnimatedCanvas';

export type ReadOnlyCanvasProps = {
    fourierCoefs: Array<{real: number, imag: number}>;
    width: number; 
    height: number;
};

type CanvasPoint = {u:number, v:number};

const POINT_HISTORY_MAX_DISPLAY = 500;

const pointHistoryInitializer = () => {
    let ph = new Array<CanvasPoint>(POINT_HISTORY_MAX_DISPLAY);
    for (let i = 0; i < ph.length; i++) {
        ph[i] = {u: 0, v: 0};
    }
    return ph;
}

export default function ReadOnlyCanvas({fourierCoefs, width, height}: ReadOnlyCanvasProps) {
    let fourier = useRef(new Fourier(fourierCoefs, 50, 1 / 5));
    const pointHistoryRef = useRef<CanvasPoint[]>(pointHistoryInitializer());
    let draw = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, progress: number, frameLength: number) => {
        // Frame length is in milliseconds so let's do the conversion first.
        fourier.current.nextFrame(frameLength/1000);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let points = fourier.current.currentCanvasState();
        // Draw history
        let lastPoint = points[points.length - 1].getCanvasCoordinates(canvas.width, canvas.height);
        pointHistoryRef.current.shift();
        pointHistoryRef.current.push(lastPoint);
        ctx.fillStyle = "white";
        for (let { u, v } of pointHistoryRef.current) {
            ctx.fillRect(u, v, 2, 2);
        }
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
            <AnimatedCanvas width={500} height={500} draw={draw} animate={true} backgroundDraw={(ctx, canvas) => {}}/>
        </div>
    );
}