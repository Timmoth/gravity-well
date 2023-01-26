import * as THREE from "three";
import { useRef } from "react";
import { createRoot } from "react-dom/client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import React from "react";
import { unmountComponentAtNode } from "react-dom";

import { MeshTransmissionMaterial, OrbitControls } from "@react-three/drei";

export function Start() {
  createRoot(document.getElementById("root") as HTMLElement).render(
    <Canvas camera={{ position: [0, 10, 10] }} dpr={[1, 2]}>
      <color attach="background" args={["black"]} />
      <ambientLight intensity={1.0} />
      <Floor />
      <OrbitControls autoRotateSpeed={0.3} autoRotate={true} />
    </Canvas>
  );
}

export function Stop() {
  unmountComponentAtNode(document.getElementById("root") as HTMLElement);
}

const Floor = () => {
  const mesh = useRef<THREE.Mesh>(null!);
  const bufferGeometry = useRef<THREE.BufferGeometry>(null!);
  const geom = new THREE.PlaneGeometry(50, 50, 64, 64);
  const vertices: number[] = [];
  var positionAttribute = geom.attributes.position;
  for (var i = 0; i < positionAttribute.count; i++) {
    var x = positionAttribute.getX(i);
    var y = positionAttribute.getY(i);
    var z = positionAttribute.getZ(i);
    vertices.push(x, y, z);
  }

  useFrame(({ mouse }) => {
    const vector = new THREE.Vector3(mouse.x, mouse.y, 0);
    mesh.current.position.set(vector.x, vector.y, 0);

    let pos = new THREE.Vector2(vector.x, vector.y);

    var positionAttribute = bufferGeometry.current.attributes.position;
    for (var i = 0; i < positionAttribute.count; i++) {
      let x = positionAttribute.getX(i);
      let y = positionAttribute.getY(i);

      let d = 50.0 / Math.abs(new THREE.Vector2(x, y).sub(pos).length());
      positionAttribute.setZ(i, -d);
    }
    positionAttribute.needsUpdate = true;
  });

  return (
    <>
      <mesh ref={mesh} position={[0, 0, 0]}>
        <icosahedronGeometry args={[3, 8]} />
        <MeshTransmissionMaterial
          ior={1.2}
          thickness={1.5}
          anisotropy={0.1}
          chromaticAberration={0.1}
          distortionScale={0.1}
          temporalDistortion={0}
        />
      </mesh>

      <points position={[0, 0, 0]} rotation-x={Math.PI * -0.5}>
        <bufferGeometry
          ref={bufferGeometry}
          attributes={{
            position: new THREE.Float32BufferAttribute(vertices, 3),
          }}
        />
        <pointsMaterial size={0.1} />
      </points>
    </>
  );
};
