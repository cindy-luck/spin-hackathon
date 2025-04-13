import { Circle, Html, OrbitControls, Stats, useProgress, Line } from '@react-three/drei';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import React, { Suspense, useEffect, useRef, useState } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

function Loader() {
  const { progress } = useProgress();
  return <Html center>{progress} % loaded</Html>
}

const SphericalGrid = ({ radius = 5, segmentsTheta = 16, segmentsPhi = 8, color = 'gray' }) => {
  const geometry = new THREE.SphereGeometry(radius, segmentsTheta, segmentsPhi, 0, Math.PI * 2, 0, Math.PI);
  const wireframeGeometry = new THREE.WireframeGeometry(geometry);
  return (
    <lineSegments geometry={wireframeGeometry} material={new THREE.LineBasicMaterial({ color })} />
  );
};

const Scene = ({ pathToModel }) => {
  const [gltf, setGltf] = useState(useLoader(GLTFLoader, '/models/soccer_ball.glb'));
  const modelRef = useRef();
  const { camera, controls } = useThree(); // Get access to the camera and controls

  // Define the "eye" positions (example - adjust as needed)
  const eyePositions = [
    { position: [4, -5, 2], label: 'Side View' },
    { position: [-8, 5, 0], label: 'Opposite Side' },
    // { position: [4, 2, 8], label: 'Top-Front' },
    // { position: [2, 0.5, -8], label: 'Bottom-Back' },
  ];

  const handleEyeClick = (position) => {
    // Optionally, you can directly set the camera position
    // camera.position.set(position[0] * 1.5, position[1] * 1.5, position[2] * 1.5);

    // More smoothly, you can update the OrbitControls target
    controls.current.target.set(0, 1, 0); // Ensure target is the model center
    controls.current.position0.set(position[0] * 1.5, position[1] * 1.5, position[2] * 1.5); // Reset initial position
    controls.current.reset(); // Animate to the new position/target

    // Alternative: Animate the camera position
    // gsap.to(camera.position, {
    //   duration: 1,
    //   x: position[0] * 1.5,
    //   y: position[1] * 1.5,
    //   z: position[2] * 1.5,
    //   onUpdate: () => camera.lookAt(0, 1, 0),
    // });
  };

  useEffect(() => {
    if (pathToModel) {
      new GLTFLoader().load(pathToModel.path, (loadedGltf) => {
        setGltf(loadedGltf);
      });
    }
    console.log(pathToModel)
  }, [pathToModel]);

  useFrame((state, delta) => {
    if (modelRef.current) {
      // Optional model rotation
      // modelRef.current.rotation.y += delta * 0.5;
    }
  });

  const Model = () => (
    <primitive
      ref={modelRef}
      object={gltf.scene}
      position={[0, 1, 0]}
      castShadow
      receiveShadow
    />
  );

  return (
    <Suspense fallback={<Loader />}>
      <directionalLight
        position={[-1.3, 6.0, 4.4]}
        intensity={Math.PI * 1}
        castShadow
        receiveShadow
      />
      <ambientLight intensity={1} />
      <Model />
      {/* <OrbitControls enableRotate={false} ref={controls} target={[0, 1, 0]} /> TODO: disable rotate when start */} 
      <OrbitControls ref={controls} target={[0, 1, 0]} />
      <axesHelper args={[5]} />

      {/* Spherical Wireframe Grid */}
      <SphericalGrid radius={10} color="rgba(100, 100, 100, 0.5)" segmentsTheta={16} segmentsPhi={8} />

      {eyePositions.map((eye, index) => (
        <group key={index}>
          {/* The "Eye" - Let's use a small sphere for better visibility */}
          <mesh
            position={eye.position}
            onClick={() => handleEyeClick(eye.position)}
            onPointerOver={(e) => e.object.scale.set(1.2, 1.2, 1.2)}
            onPointerOut={(e) => e.object.scale.set(1, 1, 1)}
            style={{ cursor: 'pointer' }}
          >
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshBasicMaterial color="lightblue" />
          </mesh>

          {/* The "Line" */}
          <Line
            points={[eye.position, [0, 1, 0]]} // Start at eye, end at model center
            color="white"
            lineWidth={2}
          />

          {/* Optional: Label for the "eye" */}
          {/* <Html position={[eye.position[0], eye.position[1] + 0.2, eye.position[2]]} center>
            <div style={{ backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', padding: '5px', borderRadius: '3px', fontSize: '0.8em' }}>
              {eye.label}
            </div>
          </Html> */}
        </group>
      ))}
    </Suspense>
  );
};

export default Scene;