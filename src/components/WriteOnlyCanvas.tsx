import React, { useRef } from 'react';

export type WriteOnlyCanvasProps = {
    width: number;
    height: number
};

export default function WriteOnlyCanvasProps({width, height}: WriteOnlyCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    return (
        <canvas ref={canvasRef} width={`${width}px`} height={`${height}px`}/>
    );
}