import React from 'react';
import {useRef, useState, useEffect} from 'react';
import {Point} from '../utils/Geometry';
import './Canvas.css';


export type ReadOnlyCanvasType = {
    points: Array<Point>;
    width: number; 
    height: number;
}

export default function ReadOnlyCanvas({ points, width, height }: ReadOnlyCanvasType) {
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        let canvas = ref.current;
        if (canvas) {
            let ctx = canvas.getContext('2d');
            if (ctx) {
                for (let i = 1; i < points.length; i++) {
                    ctx.beginPath();
                    let sourcePoint = points[i-1].getCanvasCoordinates(canvas.width, canvas.height);
                    let destinationPoint = points[i].getCanvasCoordinates(canvas.width, canvas.height);
                    ctx.strokeStyle = "white";
                    ctx.moveTo(sourcePoint.u, sourcePoint.v);
                    ctx.lineTo(destinationPoint.u, destinationPoint.v);  
                    ctx.stroke();
                }
                // TODO: Maintain a history of visited points. 
                let lastPoint = points[points.length-1].getCanvasCoordinates(canvas.width, canvas.height); 
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