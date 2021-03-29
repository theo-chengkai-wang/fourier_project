import React, { useCallback } from 'react';
import {useRef, useState, useEffect} from 'react';
import {Point} from '../utils/Geometry';
import './Canvas.css';

type CanvasPoint = {u:number, v:number};

export type AnimatedCanvasProps = {
    // points: Array<Point>;
    draw: (ctx: CanvasRenderingContext2D) => any;
    width: number; 
    height: number;
};

export default function AnimatedCanvas({ /*points, */draw, width, height }: AnimatedCanvasProps) {
    const ref = useRef<HTMLCanvasElement>(null);
    

    return (
        <canvas ref={ref} width={`${width}px`} height={`${height}px`}/>
    );
} 