import { useEffect, useState, useRef } from 'react'
import * as THREE from 'three';
import './App.css'
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import Scene from './Scene';

function App() {
  return (
    <>
      <Scene />
    </>
  )
}

export default App
