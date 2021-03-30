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
const DEFAULT_MAX_N = 50;

type APIResponseType = {
    fourier_coefs: Complex[]
}

function App() {
    const [writeEnable, setWriteEnable] = useState(true);
    const [pointsOfPath, setPointsOfPath] = useState(new Array<Complex>());
    const [fourierCoefs, setFourierCoefs] = useState(new Array<Complex>());
    const [maxN, setMaxN] = useState(DEFAULT_MAX_N+'');

    const handleInputChange: React.ChangeEventHandler<HTMLInputElement>= (event: React.ChangeEvent<HTMLInputElement>) => {
        let valInt = parseInt(event.target.value);
        if ((!Number.isNaN(valInt) && (valInt | 0) === valInt && valInt > 0 && valInt <= 500) || event.target.value==='') {
            setMaxN(event.target.value)
        } else {
            alert("Max N has to be a positive integer smaller or equal to 500");
        }
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

    const getFourierCoefs = useCallback(async () => {
        try {
            const res: AxiosResponse<APIResponseType> = await axios({
                url: "/api/fourier", 
                method: "POST", 
                data: {
                    path: pointsOfPath, 
                    max_n: parseInt(maxN) || DEFAULT_MAX_N
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
    }, [maxN, pointsOfPath]);

    const handleSubmitClick = useCallback(() => {
        getFourierCoefs().then(() => setWriteEnable(false));
    }, [getFourierCoefs]);

    return (
        <div className="App">
            {writeEnable ? 
            <div>
                <div>
                    <WriteOnlyCanvas convertPointList={convertPointList} width={CANVAS_WIDTH} height={CANVAS_HEIGHT}/>
                </div>
                <div>
                    <div>
                        <label htmlFor="max_n_input">Max N of the fourier series</label>
                        <input id="max_n_input" onChange={handleInputChange} value={maxN}/>
                    </div>
                    <button onClick={() => handleSubmitClick()}>Submit</button>
                </div>
            </div>
            :
            <div>    
                <div>
                    <ReadOnlyCanvas fourierCoefs={fourierCoefs} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
                </div>            
                <button onClick={() => handleDrawAgainClick()}>Draw again</button>
            </div>}
        </div>
    );
}

export default App;
