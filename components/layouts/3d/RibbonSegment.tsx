"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";

interface RibbonSegmentProps {
  curve: THREE.Curve<THREE.Vector3>;
  t0: number; // Start fraction (0 to 1)
  t1: number; // End fraction (0 to 1)
  width: number;
  imageUrl: string;
}

export default function RibbonSegment({ curve, t0, t1, width, imageUrl }: RibbonSegmentProps) {
  // Load the texture. useTexture suspends until loaded.
  const texture = useTexture(imageUrl);
  
  // Ensure the texture maps properly to our custom geometry
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;

  const geometry = useMemo(() => {
    const segments = 20; // Number of subdivisions for smooth curving
    
    // We need 2 vertices (top and bottom) for each step along the curve segment
    const vertexCount = (segments + 1) * 2;
    const positions = new Float32Array(vertexCount * 3);
    const uvs = new Float32Array(vertexCount * 2);
    const indices = [];

    // computeFrenetFrames helps us calculate the 3D twist (Normal/Binormal) of the curve
    const frenetFrames = curve.computeFrenetFrames(1000, false);

    for (let i = 0; i <= segments; i++) {
      // Current progress along this specific segment
      const segmentProgress = i / segments;
      // Global progress along the entire curve
      const t = t0 + (t1 - t0) * segmentProgress;
      
      // Clamp t to prevent errors if animation pushes it slightly out of bounds
      const clampedT = Math.max(0, Math.min(1, t));

      // Get exact 3D position on the spline
      const pos = curve.getPointAt(clampedT);
      
      // Get exact Tangent, Normal, Binormal for twisting
      // We manually interpolate from the frenetFrames array
      const frameIndex = Math.min(
        Math.floor(clampedT * frenetFrames.normals.length),
        frenetFrames.normals.length - 1
      );
      
      const normal = frenetFrames.normals[frameIndex];
      const binormal = frenetFrames.binormals[frameIndex];

      // To make a flat ribbon, we sweep left and right along the BINORMAL vector
      // Top vertex
      const topPos = new THREE.Vector3().copy(pos).addScaledVector(binormal, width / 2);
      // Bottom vertex
      const bottomPos = new THREE.Vector3().copy(pos).addScaledVector(binormal, -width / 2);

      const vertexIndex = i * 2;
      
      // Assign Top Vertex
      positions[vertexIndex * 3 + 0] = topPos.x;
      positions[vertexIndex * 3 + 1] = topPos.y;
      positions[vertexIndex * 3 + 2] = topPos.z;
      // UV mapping: u goes from 1 to 0 to flip horizontally, v is 1 (top)
      uvs[vertexIndex * 2 + 0] = 1 - segmentProgress;
      uvs[vertexIndex * 2 + 1] = 1;

      // Assign Bottom Vertex
      positions[(vertexIndex + 1) * 3 + 0] = bottomPos.x;
      positions[(vertexIndex + 1) * 3 + 1] = bottomPos.y;
      positions[(vertexIndex + 1) * 3 + 2] = bottomPos.z;
      // UV mapping: u goes from 1 to 0 to flip horizontally, v is 0 (bottom)
      uvs[(vertexIndex + 1) * 2 + 0] = 1 - segmentProgress;
      uvs[(vertexIndex + 1) * 2 + 1] = 0;

      // Create triangles (indices)
      if (i < segments) {
        const a = i * 2;
        const b = i * 2 + 1;
        const c = (i + 1) * 2;
        const d = (i + 1) * 2 + 1;

        // Triangle 1
        indices.push(a, b, d);
        // Triangle 2
        indices.push(a, d, c);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();

    return geo;
  }, [curve, t0, t1, width]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial 
        map={texture} 
        side={THREE.DoubleSide} 
        transparent={true}
        roughness={0.4}
        metalness={0.1}
      />
    </mesh>
  );
}
