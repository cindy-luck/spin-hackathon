import { useState } from 'react';
import './App.css'
import Scene from './Scene';
import SelectMenu from './SelectMenu';





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
        <Scene pathToModel={model} /> 
      </div>
    </div>
  )
}

export default App;
