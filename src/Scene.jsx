// import { Html, OrbitControls, useProgress, Line } from '@react-three/drei';
// import { useFrame, useLoader, useThree } from '@react-three/fiber';
// import React, { Suspense, useEffect, useRef, useState, forwardRef } from 'react';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import * as THREE from 'three';

// function Loader() {
//   const { progress } = useProgress();
//   return <Html center>{progress} % loaded</Html>;
// }

// const SphericalGrid = forwardRef(({ radius = 5, segmentsTheta = 16, segmentsPhi = 8, color = 'gray' }, ref) => {
//   const geometry = new THREE.SphereGeometry(radius, segmentsTheta, segmentsPhi, 0, Math.PI * 2, 0, Math.PI);
//   const wireframeGeometry = new THREE.WireframeGeometry(geometry);
//   return <lineSegments ref={ref} geometry={wireframeGeometry} material={new THREE.LineBasicMaterial({ color })} />;
// });

// const Scene = ({ pathToModel }) => {
//   const [gltf, setGltf] = useState(useLoader(GLTFLoader, '/models/soccer_ball.glb'));
//   const modelRef = useRef();
//   const axesHelperRef = useRef();
//   const sphericalGridRef = useRef();
//   const { scene, gl, camera, controls } = useThree();
//   const snapshotCamera = useRef(new THREE.PerspectiveCamera(75, 1, 0.1, 1000)); // Separate camera
//   const isTakingSnapshot = useRef(false);

//   const eyePositions = [
//     // { position: [4, -5, 2], label: 'Side View' },
//     { position: [-8, 5, 0], label: 'Opposite Side' },
//   ];

//   const saveFile = (strData, filename) => {
//     const link = document.createElement('a');
//     if (typeof link.download === 'string') {
//       document.body.appendChild(link);
//       link.download = filename;
//       link.href = strData;
//       link.click();
//       document.body.removeChild(link);
//     } else {
//       window.open(strData); // Fallback for browsers that don't support download attribute
//     }
//   };

//   const takeEyeSnapshot = (index) => {
//     const eyePosition = eyePositions[index].position;
//     snapshotCamera.current.position.copy(new THREE.Vector3(...eyePosition));
//     snapshotCamera.current.lookAt(0, 1, 0); // Look at the model's center
//     // snapshotCamera.current.layers.set(0); // Set only to take 0
//     axesHelperRef.current.layers.set(1);
//     sphericalGridRef.current.layers.set(1);

//     // Render the scene with the snapshot camera to the main canvas
//     gl.render(scene, snapshotCamera.current);
    
//     try {
//       const strMime = 'image/png';
//       const imgData = gl.domElement.toDataURL(strMime);
//       saveFile(imgData, `model.png`);
//     } catch (e) {
//       console.error('Error taking snapshot:', e);
//     } finally {
//       axesHelperRef.current.layers.set(0);
//       sphericalGridRef.current.layers.set(0);
//     }

//   };

//   useEffect(() => {
//     if (pathToModel) {
//       new GLTFLoader().load(pathToModel.path, (loadedGltf) => {
//         setGltf(loadedGltf);
//       });
//     }
//     console.log(pathToModel);
//   }, [pathToModel]);

//   useFrame((state, delta) => {
//     if (modelRef.current) {
//       // Optional model rotation
//       // modelRef.current.rotation.y += delta * 0.5;
//     }
//   });

//   const Model = () => (
//     <primitive ref={modelRef} object={gltf.scene} position={[0, 1, 0]} castShadow receiveShadow />
//   );

//   return (
//     <Suspense fallback={<Loader />}>
//       <directionalLight position={[-1.3, 6.0, 4.4]} intensity={Math.PI * 1} castShadow receiveShadow />
//       <ambientLight intensity={1} />
//       <Model />
//       <OrbitControls ref={controls} target={[0, 1, 0]} />
//       <axesHelper ref={axesHelperRef} args={[5]} />

//       <SphericalGrid ref={sphericalGridRef} radius={10} color="rgba(100, 100, 100, 0.5)" segmentsTheta={16} segmentsPhi={8} />

//       {eyePositions.map((eye, index) => (
//         <group key={index}>
//           {/* The "Eye" - Let's use a small sphere for better visibility */}
//           <mesh
//             position={eye.position}
//             onClick={() => takeEyeSnapshot(index)} // Pass the index to identify the clicked eye
//             onPointerOver={(e) => e.object.scale.set(1.2, 1.2, 1.2)}
//             onPointerOut={(e) => e.object.scale.set(1, 1, 1)}
//             style={{ cursor: 'pointer' }}
//           >
//             <sphereGeometry args={[0.2, 16, 16]} />
//             <meshBasicMaterial color='lightblue' /> {/* Highlight active eye */}
//           </mesh>

//           {/* The "Line" */}
//           <Line points={[eye.position, [0, 1, 0]]} color="white" lineWidth={2} />
//         </group>
//       ))}
      
//     </Suspense>
//   );
// };

// export default Scene; 

import { Html, OrbitControls, useProgress, Line } from '@react-three/drei';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import React, { Suspense, useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

function Loader() {
  const { progress } = useProgress();
  return <Html center>{progress} % loaded</Html>;
}

const SphericalGrid = forwardRef(({ radius = 5, segmentsTheta = 16, segmentsPhi = 8, color = 'gray' }, ref) => {
  const geometry = new THREE.SphereGeometry(radius, segmentsTheta, segmentsPhi, 0, Math.PI * 2, 0, Math.PI);
  const wireframeGeometry = new THREE.WireframeGeometry(geometry);
  return <lineSegments ref={ref} geometry={wireframeGeometry} material={new THREE.LineBasicMaterial({ color })} />;
});

// MAIN CHANGE: forwardRef here
const Scene = forwardRef(({ pathToModel, setSceneImage }, ref) => {
  const [gltf, setGltf] = useState(useLoader(GLTFLoader, '/models/soccer_ball.glb'));
  const modelRef = useRef();
  const axesHelperRef = useRef();
  const sphericalGridRef = useRef();
  const { scene, gl, camera, controls } = useThree();
  const snapshotCamera = useRef(new THREE.PerspectiveCamera(75, 1, 0.1, 1000));
  const isTakingSnapshot = useRef(false);

  const eyePositions = [
    { position: [-8, 5, 0], label: 'Opposite Side' },
  ];

  // Expose takeSnapshot externally
  useImperativeHandle(ref, () => ({
    triggerSnapshot(index = 0) {
      takeEyeSnapshot(index);
    }
  }));

  const saveFile = (strData, filename) => {
    const link = document.createElement('a');
    if (typeof link.download === 'string') {
      document.body.appendChild(link);
      link.download = filename;
      link.href = strData;
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(strData);
    }
  };

  const takeEyeSnapshot = (index) => {
    const eyePosition = eyePositions[index].position;
    snapshotCamera.current.position.copy(new THREE.Vector3(...eyePosition));
    snapshotCamera.current.lookAt(0, 1, 0);

    axesHelperRef.current.layers.set(1);
    sphericalGridRef.current.layers.set(1);

    gl.render(scene, snapshotCamera.current);

    try {
      const strMime = 'image/png';
      const imgData = gl.domElement.toDataURL(strMime);
      //saveFile(imgData, `model.png`); // download to local
      setSceneImage(imgData);
    } catch (e) {
      console.error('Error taking snapshot:', e);
    } finally {
      axesHelperRef.current.layers.set(0);
      sphericalGridRef.current.layers.set(0);
    }
  };

  useEffect(() => {
    if (pathToModel) {
      new GLTFLoader().load(pathToModel.path, (loadedGltf) => {
        setGltf(loadedGltf);
      });
    }
  }, [pathToModel]);

  useFrame((state, delta) => {
    if (modelRef.current) {
      // Optional rotation
    }
  });

  const Model = () => (
    <primitive ref={modelRef} object={gltf.scene} position={[0, 1, 0]} castShadow receiveShadow />
  );

  return (
    <Suspense fallback={<Loader />}>
      <directionalLight position={[-1.3, 6.0, 4.4]} intensity={Math.PI * 1} castShadow receiveShadow />
      <ambientLight intensity={1} />
      <Model />
      <OrbitControls ref={controls} target={[0, 1, 0]} />
      <axesHelper ref={axesHelperRef} args={[5]} />
      <SphericalGrid ref={sphericalGridRef} radius={10} color="rgba(100, 100, 100, 0.5)" segmentsTheta={16} segmentsPhi={8} />

      {eyePositions.map((eye, index) => (
        <group key={index}>
          <mesh
            position={eye.position}
            onClick={() => takeEyeSnapshot(index)}
            onPointerOver={(e) => e.object.scale.set(1.2, 1.2, 1.2)}
            onPointerOut={(e) => e.object.scale.set(1, 1, 1)}
            style={{ cursor: 'pointer' }}
          >
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshBasicMaterial color='lightblue' />
          </mesh>
          <Line points={[eye.position, [0, 1, 0]]} color="white" lineWidth={2} />
        </group>
      ))}
    </Suspense>
  );
});

export default Scene;
