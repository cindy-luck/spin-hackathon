import { Circle, Html, OrbitControls, Stats, useProgress } from '@react-three/drei';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import React, { Suspense, useRef } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';


function Loader() {
  const { progress } = useProgress()
  console.log(progress)
  return <Html center>{progress} % loaded</Html>
}

const Model = () => {
  const gltf = useLoader(GLTFLoader, '/soccerBall.glb');
  const modelRef = useRef();

  useFrame((state, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += delta * 0.5;
      modelRef.current.rotation.x += delta * 0.5;
      modelRef.current.rotation.z += delta * 0.5;
    }
  });

  return (
    <primitive
      ref={modelRef}
      object={gltf.scene}
      position={[0, 1, 0]}
      castShadow
    />
  );
};

const Scene = () => {
  const gltf = useLoader(GLTFLoader, '/soccerBall.glb')
  const modelRef = useRef();

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
        {/* <primitive
          object={gltf.scene}
          position={[0, 1, 0]}
          children-0-castShadow
        /> */}
        <Model />
        <OrbitControls target={[0, 1, 0]} />
        <axesHelper args={[5]} />
        <Stats />
      </Canvas>
    </Suspense>
  );
};

export default Scene;