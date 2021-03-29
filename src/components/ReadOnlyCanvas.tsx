import React, { useCallback } from 'react';
import {useRef, useState, useEffect} from 'react';
import {Point} from '../utils/Geometry';
import './Canvas.css';

type CanvasPoint = {u:number, v:number};

const POINT_HISTORY_MAX_DISPLAY = 200;

const pointHistoryInitializer = () => {
    let ph = new Array<CanvasPoint>(POINT_HISTORY_MAX_DISPLAY);
    for (let i = 0; i < ph.length; i++) {
        ph[i] = {u: 0, v: 0};
    }
    return ph;
}

export type ReadOnlyCanvasProps = {
    points: Array<Point>;
    width: number; 
    height: number;
};

export default function ReadOnlyCanvas({ points, width, height }: ReadOnlyCanvasProps) {
    const ref = useRef<HTMLCanvasElement>(null);
    const pointHistoryRef = useRef<CanvasPoint[]>(pointHistoryInitializer());

    const draw = useCallback(
        (ctx:CanvasRenderingContext2D, width: number, height: number) => {
            
        }, []
    )

    useEffect(() => {
        let canvas = ref.current;
        if (canvas) {
            let ctx = canvas.getContext('2d');
            if (ctx) {
                // Draw history
                let lastPoint = points[points.length-1].getCanvasCoordinates(canvas.width, canvas.height); 
                pointHistoryRef.current.shift();
                pointHistoryRef.current.push(lastPoint);
                ctx.fillStyle = "white";
                for (let {u, v} of pointHistoryRef.current) {
                    ctx.fillRect(u, v, 2, 2);
                }
                // Draw vectors
                for (let i = 1; i < points.length; i++) {
                    ctx.beginPath();
                    let sourcePoint = points[i-1].getCanvasCoordinates(canvas.width, canvas.height);
                    let destinationPoint = points[i].getCanvasCoordinates(canvas.width, canvas.height);
                    ctx.strokeStyle = "white";
                    ctx.moveTo(sourcePoint.u, sourcePoint.v);
                    ctx.lineTo(destinationPoint.u, destinationPoint.v);  
                    ctx.stroke();
                }
            }
        }
        return () => {
            if (canvas) {
                let ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }
            }
        }
    }, [points])

    return (
        <canvas ref={ref} width={`${width}px`} height={`${height}px`}/>
    );
} 