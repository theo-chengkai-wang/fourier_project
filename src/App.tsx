import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Matrix from './utils/Matrix';
import {Vector} from './utils/Geometry';

function App() {
  useEffect(() => {
    const v = new Vector(1, 0, Math.PI);
    v.rotate(1.5);
    console.log(v);
  }, [])
  return (
    <div className="App">
      Nothing
    </div>
  );
}

export default App;
