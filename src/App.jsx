import { useEffect, useState, useRef } from 'react'
import * as THREE from 'three';
import './App.css'
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import Scene from './Scene';

// function MyThree() {
//   // Instantiate glTF Loader
//   const loader = new GLTFLoader();

//   useEffect(() => {
//     // === THREE.JS CODE START ===
//     var scene = new THREE.Scene();
//     var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//     var renderer = new THREE.WebGLRenderer();
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     document.body.appendChild( renderer.domElement );

//     // const geometry = new THREE.BoxGeometry( 1, 1, 1 );
//     // const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
//     // const cube = new THREE.Mesh( geometry, material );
//     // scene.add( cube );
//     // camera.position.z = 5;

//     // var animate = function () {
//     //   requestAnimationFrame(animate);
//     //   cube.rotation.x += 0.01;
//     //   cube.rotation.y += 0.01;
//     //   renderer.render(scene, camera);
//     // };
//     // animate();

//     // Load a glTF resource
//     const dracoLoader = new DRACOLoader();
//     dracoLoader.setDecoderPath( 'jsm/libs/draco/gltf/' );

//     loader.setDRACOLoader( dracoLoader );
//     loader.load(
//       // resource URL
//       'mug.glb', 
//       // called when the resource is loaded
//       function ( gltf ) {
//         scene.add( gltf.scene );
//       }, 
//       // called while loading is progressing
//       function ( xhr ) {
//         console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
//       },
//       // called when loading has errors
//       undefined, function ( error ) {
//         console.error( error );
//     } );
//   }, []);

// }


function App() {

  const earth = useGLTF('./mug.glb');

  return (
    <>
      <Scene />
    </>
  )
}

export default App
