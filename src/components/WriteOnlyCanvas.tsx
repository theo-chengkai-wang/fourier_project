import React, { useEffect, useRef, useState } from 'react';
import AnimatedCanvas from './AnimatedCanvas';
import {CanvasPoint} from '../utils/Geometry';

export type WriteOnlyCanvasProps = {
    convertPointList: (canvasPointList: CanvasPoint[]) => void; // Used to convert point list and send to parent
    width: number;
    height: number;
};

export default function WriteOnlyCanvas({convertPointList, width, height}: WriteOnlyCanvasProps) {
    const [drawing, setDrawing] = useState(false); // Set to true if we are drawing
    const pointListRef = useRef<CanvasPoint[]>([]); // Ref to the list of points we have currently drawn

    // Handle Canvas drawing
    const handleMouseDown:React.MouseEventHandler<HTMLCanvasElement> = (event) => {
        // Clean up previous point list
        pointListRef.current = [];
        // Set animate to true
        setDrawing(true);
        // Clear canvas
        event.currentTarget.getContext("2d")?.clearRect(0, 0, event.currentTarget.width, event.currentTarget.height);
        // Push point
        pointListRef.current.push({u: event.nativeEvent.offsetX, v: event.nativeEvent.offsetY});
    }

    const handleMouseMove:React.MouseEventHandler<HTMLCanvasElement> = (event) => {
        pointListRef.current.push({u: event.nativeEvent.offsetX, v: event.nativeEvent.offsetY});
    }

    const handleMouseUp:React.MouseEventHandler<HTMLCanvasElement> = (event) => {
        // Set animate to false
        setDrawing(false);
        // Push back the first point
        pointListRef.current.push(pointListRef.current[0]);
        // Convert point list and send to parent 
        convertPointList(pointListRef.current);
    }
    
    // Draw function for AnimatedCanvas when we ARE drawing. 
    const draw = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, progress: number, frameLength: number) => {
        ctx.strokeStyle="white";
        ctx.lineWidth=2;
        ctx.beginPath();
        for (let i = 1; i < pointListRef.current.length; i++) {
            let lastPoint = pointListRef.current[i-1];
            let currentPoint = pointListRef.current[i];
            ctx.moveTo(lastPoint.u, lastPoint.v);
            ctx.lineTo(currentPoint.u, currentPoint.v);
        }
        ctx.stroke();
    }
    // BackgroundDraw function called only if we AREN'T DRAWING anymore, so no need to update anymore. We 
    // turn the mode of the canvas to static and apply this function. 
    const backgroundDraw = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
        ctx.strokeStyle="white";
        ctx.beginPath();
        for (let i = 1; i < pointListRef.current.length; i++) {
            let lastPoint = pointListRef.current[i-1];
            let currentPoint = pointListRef.current[i];
            ctx.moveTo(lastPoint.u, lastPoint.v);
            ctx.lineTo(currentPoint.u, currentPoint.v);
        }
        ctx.stroke();
    }

    return (
        <AnimatedCanvas 
            draw={draw}
            animate={drawing} 
            backgroundDraw={drawing ? (ctx, canvas) => {}: backgroundDraw}
            preDraw={(ctx, canvas) => {ctx.clearRect(0, 0, canvas.width, canvas.height)}}
            options={{
                width: `${width}px`, 
                height: `${height}px`,
                onMouseDown: handleMouseDown,
                onMouseMove: handleMouseMove,
                onMouseUp: handleMouseUp
            }}/>
    );
}