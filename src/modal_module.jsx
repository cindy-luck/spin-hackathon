import React, { useState } from "react";
import './modal_module.css';

const ModalModule = ({onClick}) => {

  const [displayVal, setDisplayVal] = useState('grid')

  return (
  <div className="modalBack" style={{display: displayVal}}>
    <div className="modalContainer">
      <div>
        <h2>Welcome to Spin!</h2>
        <p>
            You are given 1 minute to view the 3d model, rotate it around and take in as much as possible. 
            <br />
            Once the timer runs out, you will not be able to rotate it anymore, but scrolling in/out will still be enabled.
            <br />
            A dot and a line will appear and that's the perspective you have to draw from.
            <br />
            When you are done drawing, your drawing will be graded based on similarity to the model. Good luck!
        </p>
      </div>
      <button onClick={() => {
        onClick();
        setDisplayVal('none')
      }}>Begin!</button>
    </div>
  </div>
  );
};

export default ModalModule