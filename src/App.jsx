import { useState } from 'react';
import './App.css'
import Scene from './Scene';
import SelectMenu from './SelectMenu';
import { Canvas } from '@react-three/fiber';

function App() {

  const [view, setView] = useState('menu');
  const [model, setSelectedModel] = useState('');

  const handleBack = () => setView('menu');
  const openCanvas = () => setView('canvas'); 

  return (
    <div className='container'>
      <div className='leftContainer'>
        {/* View: Menu */}
        { view == 'menu' &&
        // Display the menu
          <>
            <SelectMenu onSelect={(model) => setSelectedModel(model)} />
          </>
        }

        {/* View: Canvas */}
        { view == 'canvas' && 
          <button className='backBtn' onClick={handleBack}>Back</button>
          

        }
        
      </div>
      <div className='modelContainer'>
        { (model !== '') && view == 'menu' && 
          <div className="overlay"></div>
        }
        <Canvas>
          <Scene pathToModel={model} />
        </Canvas> 
        { (model !== '') && view == 'menu' &&
          <button className="startBtn" onClick={openCanvas}>Start Drawing</button>
        }
      </div>
    </div>
  )
}

export default App;
