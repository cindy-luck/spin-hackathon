import React, { useRef, useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import './WhiteBoard.css';

// Use forwardRef to expose the captureImage method to the parent
const WhiteBoard = forwardRef(({ setCanvasImage }, ref) => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('black');
  const [lineWeight, setLineWeight] = useState(2);
  const [tool, setTool] = useState('pen');
  const [prev, setPrev] = useState({ x: 0, y: 0 });

  // Expose the captureImage method to the parent using useImperativeHandle
  useImperativeHandle(ref, () => ({
    captureImage() {
      const canvas = canvasRef.current;
      const imageData = canvas.toDataURL('image/png');
      console.log(imageData)
      setCanvasImage(imageData);  // Send the image data to the parent
    }
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctxRef.current = ctx;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      const panel = container.querySelector('.panel');
      const panelHeight = panel.clientHeight;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight - panelHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    setPrev({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setIsDrawing(true);
    const ctx = ctxRef.current;
    ctx.beginPath();
    ctx.arc(e.clientX - rect.left, e.clientY - rect.top, lineWeight / 2, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || (prev.x === 0 && prev.y === 0)) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const currX = e.clientX - rect.left;
    const currY = e.clientY - rect.top;
    const ctx = ctxRef.current;
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWeight;
    ctx.beginPath();
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(currX, currY);
    ctx.stroke();
    ctx.closePath();
    setPrev({ x: currX, y: currY });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setPrev({ x: 0, y: 0 });
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleToolChange = (toolType) => {
    setTool(toolType);
    if (toolType === 'pen') {
      setColor('black');
      setLineWeight(3);
    } else if (toolType === 'eraser') {
      setColor('white');
      setLineWeight(20);
    }
  };

  return (
    <div className="app-container">
      <div className="panel">
        <div className="slider-container">
          <label className="slider-label">Line Weight</label>
          <input
            type="range"
            min="1"
            max="10"
            step="0.1"
            value={lineWeight}
            onChange={(e) => setLineWeight(parseFloat(e.target.value))}
            className="slider"
          />
        </div>
        <div>
          <button
            className={`switch ${tool === 'pen' ? 'active' : ''}`}
            onClick={() => handleToolChange('pen')}
          >
            Pen
          </button>
          <button
            className={`switch ${tool === 'eraser' ? 'active' : ''}`}
            onClick={() => handleToolChange('eraser')}
          >
            Eraser
          </button>
          <button className="clear" onClick={handleClear}>
            Clear
          </button>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        className="canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </div>

  );
});

export default WhiteBoard;
