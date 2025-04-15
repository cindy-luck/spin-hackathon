import { useState, useRef, useEffect } from 'react';
import './App.css'
import Scene from './Scene';
import SelectMenu from './SelectMenu';
import { Canvas } from '@react-three/fiber';
import WhiteBoard from './WhiteBoard'
import ModalModule from './modal_module';
import { generateComparisonScore } from './backend/OpenAIRequests';

function App() {

  const [view, setView] = useState('menu');
  const [model, setSelectedModel] = useState('');
  const [canDraw, setCanDraw] = useState(false);
  const [countdown, setCountdown] = useState(60); // countdown to draw in seconds
  const [isSubmit, setIsSubmit] = useState(false);
  const [isErrorScore, setIsErrorScore] = useState(false);
  const [score, setScore] = useState(null);
  const intervalRef = useRef(null);
  const whiteboardRef = useRef();
  const modelSceneRef = useRef();

  // Images for submission to OpenAI
  const [canvasImage, setCanvasImage] = useState(null);
  const [modelImage, setModelImage] = useState(null);

  // Passed into whiteboard canvas to capture imagedata
  const handleCanvasImageDownload = (imageData) => {
    setCanvasImage(imageData);
  };

  // Passed into model scene to capture imagedata
  const handleModelImageDownload = (imageData) => {
    setModelImage(imageData);
  };

  const handleBack = () => setView('menu');

  const handleSubmit = async () => {
    setIsSubmit(true)
    setCanDraw(false)
    modelSceneRef.current.triggerSnapshot();
    whiteboardRef.current.captureImage();
  }

  useEffect(() => {
    async function handleComparisonScore() {
      console.log(canvasImage)
      console.log(modelImage)
      // return;
      try {
        if (canvasImage && modelImage) {
          try {
            const response = await generateComparisonScore({ modelImageFile: modelImage, drawingImageFile: canvasImage });
            console.log('API Response:', response);
            setScore(Number(response));
            // Handle the API response as needed


          } catch (error) {
            console.error('Error calling backend API:', error);
          }
        } else {
          console.warn('Both canvas and model images need to be downloaded.');
          setIsErrorScore(true);
        }
      } catch (err) {
        console.error("Error sending to AI: ", err.message);
      }
    }
    handleComparisonScore();
  }, [canvasImage, modelImage])

  // Reset state when selecting new model
  const resetState = () => {
    setCanDraw(false);
    setCountdown(60);
    setIsSubmit(false);
    setIsErrorScore(false);
    setModelImage(null);
    setCanvasImage(null);
    setScore(null);
  }

  const openCanvas = () => {
    setView('canvas');
    resetState();
  
    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          stopTimer()
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setCanDraw(true);
    return 0;
  }

  return (
    <div className='container'>
      <ModalModule 
        onClick={()=>{console.log('todo')}}
      />
      <div className='leftContainer'>
        {/* View: Menu */}
        { view == 'menu' &&
        // Display the menu
          <>
            <SelectMenu onSelect={(model) => setSelectedModel(model)} />
          </>
        }

        { view == 'canvas' && <button className='backBtn' onClick={handleBack}>Back</button> }
        { view == 'canvas' &&  canDraw == true && <button className='submitBtn' onClick={handleSubmit}>Submit</button> }

        {/* View: Canvas */}
        { view == 'canvas' &&  canDraw == true && !isSubmit &&
          <>
            <WhiteBoard ref={whiteboardRef} setCanvasImage={handleCanvasImageDownload} />
          </>         
        }

        {/* View: Canvas in countdown mode */}
        { view == 'canvas' &&  canDraw == false && intervalRef.current != null && (
          <>
            <div className="countdown-overlay">Drawing starts in {countdown}...</div>
            <button className='startNowBtn' onClick={stopTimer}>Start Now!</button>
          </>
        )}

        {/* View: Canvas in submission mode */}
        { view == 'canvas' && canDraw == false && isSubmit && !score &&
          <>
            <div className="countdown-overlay">Comparing image...</div>
          </>
        }
        {
          view == 'canvas' && canDraw == false && isSubmit && score && 
          <>
            <div className="countdown-overlay">Score: {score}</div>
          </>
        }
        
      </div>
      <div className='modelContainer'>
        { (model !== '') && view == 'menu' && 
          <div className="overlay"></div>
        }
        <Canvas>
          <Scene pathToModel={model} setSceneImage={handleModelImageDownload} ref={modelSceneRef} />
        </Canvas> 
        { (model !== '') && view == 'menu' &&
          <button className="startBtn" onClick={() => {openCanvas(); setIsSubmit(false);}}>Start Drawing</button>
        }
      </div>
    </div>
  )
}

export default App;
