import React, { useEffect, useRef } from 'react';
import { Engine, Scene } from '@babylonjs/core';
import '@babylonjs/loaders';
import * as BABYLON from '@babylonjs/core';

const hexToBABYLONColor3 = (hex: string): BABYLON.Color3 => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return new BABYLON.Color3(r, g, b);
};

const hexToBABYLONColor4 = (hex: string): BABYLON.Color4 => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return new BABYLON.Color4(r, g, b, 1);
};

const ObjViewer = ({ objFileUrl, color }: { objFileUrl: string; color: string }) => {
  const canvasRef = useRef(null);
  const sceneRef = useRef<BABYLON.Scene | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const engine = new Engine(canvas, true);
    const scene = new Scene(engine);
    sceneRef.current = scene;
    const camera = new BABYLON.ArcRotateCamera('camera1', Math.PI / 2, Math.PI / 4, 10, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    const backgroundColor = hexToBABYLONColor4('#ffffff');
    scene.clearColor = backgroundColor;

    BABYLON.SceneLoader.Append(
      '',
      objFileUrl,
      scene,
      (scene) => {
        scene.createDefaultCameraOrLight(true, true, true);
        const materialColor = hexToBABYLONColor3(color);
        scene.meshes.forEach((mesh) => {
          const coloredMaterial = new BABYLON.PBRMaterial('coloredMaterial', scene);
          coloredMaterial.roughness = 0.5; // Adjust as needed
          coloredMaterial.metallic = 0.1;
          coloredMaterial.albedoColor = materialColor;
          mesh.material = coloredMaterial;
          mesh.rotation = new BABYLON.Vector3(Math.PI / 2, Math.PI, Math.PI);
          mesh.scaling = new BABYLON.Vector3(1.4, 1.4, 1.4);
          mesh.position = new BABYLON.Vector3(0, -40, 0);
        });
      },
      null,
      (scene, message) => {
        console.error('Error loading .obj file', message);
      }
    );

    engine.runRenderLoop(() => {
      scene.render();
    });

    window.addEventListener('resize', () => {
      engine.resize();
    });

    return () => {
      engine.dispose();
    };
  }, [objFileUrl]);

  useEffect(() => {
    if (sceneRef.current) {
      const materialColor = hexToBABYLONColor3(color);
      sceneRef.current.meshes.forEach((mesh) => {
        if (mesh.material) {
          (mesh.material as BABYLON.PBRMaterial).albedoColor = materialColor;
        }
      });
    }
  }, [color]);

  return <canvas ref={canvasRef} style={{ width: '440px', height: '375px' }} />;
};

export default ObjViewer;
