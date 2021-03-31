import React, { useCallback, useState } from "react";
import "./App.css";
import { CanvasPoint, getPointFromCanvasPoint } from "./utils/Geometry";
import ReadOnlyCanvas from "./components/ReadOnlyCanvas";
import {Complex} from "./utils/Fourier";
import WriteOnlyCanvas from "./components/WriteOnlyCanvas";
import axios, { AxiosResponse } from "axios";

const CANVAS_HEIGHT = 500;
const CANVAS_WIDTH = 1000;
const DEFAULT_MAX_N = 50;
const MAX_MAX_N = 100;

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
        if ((!Number.isNaN(valInt) && (valInt | 0) === valInt && valInt > 0 && valInt <= MAX_MAX_N) || event.target.value==='') {
            setMaxN(event.target.value)
        } else {
            alert("Max N has to be a positive integer smaller or equal to "+MAX_MAX_N);
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
                    max_n: maxN===''? DEFAULT_MAX_N: parseInt(maxN)
                }
            });
            console.log(res)
            const data = res.data;
            if (data) {
                setFourierCoefs(data.fourier_coefs.slice());
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
            <div id="title">
                <h1>Complex Fourier Series From Drawing</h1>
            </div>
            {writeEnable ? 
            <div className="body">
                <div className="canvas_wrapper">
                    <WriteOnlyCanvas convertPointList={convertPointList} width={CANVAS_WIDTH} height={CANVAS_HEIGHT}/>
                </div>
                <div id="input_wrapper">
                    <div id="input_max_n">
                        <label htmlFor="max_n_input">Max N of the fourier series</label>
                        <input id="max_n_input" onChange={handleInputChange} value={maxN}/>
                    </div>
                    <button id="submit_drawing" className="custom_button" onClick={() => handleSubmitClick()}>Submit</button>
                </div>
                <p>
                    Default max_n is 50. 
                    Please note that one needs to choose a suitable amount of vectors for the expansion, because an excessively 
                    big max_n may result in unwanted results. 
                </p>
            </div>
            :
            <div className="body">    
                <div className="canvas_wrapper">
                    <ReadOnlyCanvas pointsOfPath={pointsOfPath} fourierCoefs={fourierCoefs} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
                </div>            
                <button id="draw_again_button" className="custom_button" onClick={() => handleDrawAgainClick()}>Draw again</button>
            </div>}
        </div>
    );
}

export default App;
