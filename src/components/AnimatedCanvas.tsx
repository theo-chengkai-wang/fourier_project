import React, { useRef, useEffect} from 'react';
import './Canvas.css';

// TODO: adapt for high pixel values. cf https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258
// TODO: maybe add preDraw/postDraw func support.

/**
 * @field draw: function that is called recursively in the render function ran by the window.requestAnimationFrame(render) function. (Don't forget to 
 * clear the canvas before starting)
 * @field backgroundDraw: function called once to draw the background
 * @field animate: flag: true if we want an animated canvas, false otherwise
 * @field options: HTML props for the Canvas
 */
export type AnimatedCanvasProps = {
    // points: Array<Point>;
    draw: (ctx: CanvasRenderingContext2D, canvas:HTMLCanvasElement, progress: number, frameLength: number) => void;  
    backgroundDraw: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void;
    animate: boolean;
    options: React.HTMLProps<HTMLCanvasElement>
};

/**
 * Animated Canvas component
 * @param props AnimatedCanvasProps  
 * @returns 
 */
export default function AnimatedCanvas({ draw, backgroundDraw, animate, options }: AnimatedCanvasProps) {
    // Ref to canvas
    const ref = useRef<HTMLCanvasElement>(null);

    // Background effect
    useEffect(() => {
        let canvas = ref.current;
        if (canvas) {
            let ctx = canvas.getContext("2d");
            if (ctx) {
                backgroundDraw(ctx, canvas);
            }
        }
    }, [backgroundDraw]);

    // Animation effect 
    useEffect(() => {
        if (animate) {
            let animationFrameId:number | null;
            let canvas = ref.current;
            if (canvas) {
                let startTime:number|null = null;
                let previousProgress:number = 0;
                let ctx = canvas.getContext('2d');
                if (ctx) {
                    // Render function that calls the draw function and sets up the animation
                    let render = (timestamp: DOMHighResTimeStamp) => {
                        if (startTime==null) startTime = timestamp;
                        let progress = timestamp - startTime;
                        let frameLength = progress - previousProgress;
                        if (ctx && canvas) {
                            draw(ctx, canvas, progress, frameLength);
                            animationFrameId = window.requestAnimationFrame(render);
                        }
                        previousProgress = progress;
                    }
                   animationFrameId = window.requestAnimationFrame(render);
                }    
            }
            return () => {
                if (animationFrameId) {
                    window.cancelAnimationFrame(animationFrameId);
                }
            }
        }
    }, [animate, draw]);

    return (
        <canvas ref={ref} {...options}/>
    );
} 