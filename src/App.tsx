import React, { useCallback, useEffect, useRef, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { CanvasPoint, Point, getPointFromCanvasPoint } from "./utils/Geometry";
import ReadOnlyCanvas from "./components/ReadOnlyCanvas";
import Fourier, {Complex} from "./utils/Fourier";
import AnimatedCanvas from "./components/AnimatedCanvas";
import WriteOnlyCanvas from "./components/WriteOnlyCanvas";
import axios, { AxiosResponse } from "axios";

const CANVAS_HEIGHT = 500;
const CANVAS_WIDTH = 500;
type APIResponseType = {
    fourier_coefs: Complex[]
}

function App() {
    const [writeEnable, setWriteEnable] = useState(true);
    const [requestSuccess, setRequestSuccess] = useState(false);
    const [pointsOfPath, setPointsOfPath] = useState(new Array<Complex>());
    const [fourierCoefs, setFourierCoefs] = useState(new Array<Complex>());
    
    const handleSubmitClick = () => {
        setRequestSuccess(false);
        setWriteEnable(false);
    }

    const handleDrawAgainClick = () => {
        setWriteEnable(true);
    }

    const convertPointList = (canvasPointList: CanvasPoint[]) => {
        let convertedPoints = new Array<Complex>();
        for (let i = 0; i < canvasPointList.length; i++) {
            let point = getPointFromCanvasPoint(canvasPointList[i], CANVAS_WIDTH, CANVAS_HEIGHT);
            convertedPoints.push({real: point.x, imag: point.y});
        }
        setPointsOfPath(convertedPoints);
    }

    useEffect(() => {
        if (writeEnable === true) {
            setRequestSuccess(false);
            // Only do when writeEnable has been restored
            // Axios request
            const getFourierCoefs = async () => {
                try {
                    const res: AxiosResponse<APIResponseType> = await axios({
                        url: "/api/fourier", 
                        method: "POST", 
                        data: {
                            path: pointsOfPath
                        }
                    });
                    console.log(res)
                    const data = res.data;
                    if (data) {
                        setFourierCoefs(data.fourier_coefs);
                        console.log(data)
                    }
                } catch (err) {
                    console.log(err.response);
                }
            }
            getFourierCoefs().then(() => setRequestSuccess(true));
        }
    }, [writeEnable, pointsOfPath]);

    return (
        <div className="App">
            {writeEnable ? 
            <div>
                <div>
                    <WriteOnlyCanvas convertPointList={convertPointList} width={CANVAS_WIDTH} height={CANVAS_HEIGHT}/>
                </div>
                {requestSuccess && <button onClick={() => handleSubmitClick()}>Submit</button>}
            </div>
            :
            <div>
                {fourierCoefs.length > 0 &&                 
                <ReadOnlyCanvas fourierCoefs={fourierCoefs} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />}
                <button onClick={() => handleDrawAgainClick()}>Draw again</button>
            </div>}
        </div>
    );
}

export default App;
