import { Circle, Html, OrbitControls, Stats, useProgress } from '@react-three/drei';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import React, { Suspense, useEffect, useRef, useState } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';


function Loader() {
  const { progress } = useProgress()
  console.log(progress)
  return <Html center>{progress} % loaded</Html>
}

const Scene = ({ pathToModel }) => {
  const [gltf, setGltf] = useState();

  // gltf = useLoader(GLTFLoader, '/models/soccer_ball.glb');

  useEffect(() => {
    console.log(pathToModel)
  }, [pathToModel])
  
  const Model = () => {
    const modelRef = useRef();
  
    // Ball rotation on the x,y,z axis
    useFrame((state, delta) => {
      if (modelRef.current) {
        modelRef.current.rotation.x += delta * 0.5;
        modelRef.current.rotation.y += delta * 0.5;
        modelRef.current.rotation.z += delta * 0.5;
      }
    });
  
    return (
      <primitive
        ref={modelRef}
        object={gltf.scene}
        position={[0, 1, 0]}
        castShadow
        receiveShadow
      />
    );
  };
  
  return (
    <Suspense fallback={<Loader />}>
      <Canvas>
        <directionalLight
          position={[-1.3, 6.0, 4.4]}
          intensity={Math.PI * 1}
          castShadow
          receiveShadow
        />
        <ambientLight
          intensity={1}
        />
        <Model />
        <OrbitControls target={[0, 1, 0]} />
        <axesHelper args={[5]} />
      </Canvas>
    </Suspense>
  );
};

export default Scene;