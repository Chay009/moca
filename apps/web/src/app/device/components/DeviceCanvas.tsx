'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
    OrbitControls,
    Environment,
    ContactShadows,
    PerspectiveCamera,
    useTexture,
    useVideoTexture,
} from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import type { AnimationPreset } from '../presets/types';
import { Model as IPhone17ProModel } from './IPhone17Pro';

interface DeviceCanvasProps {
    screenContent: { type: 'image' | 'video'; url: string } | null;
    backgroundColor: string;
    activePreset: AnimationPreset | null;
}

// iPhone 17 Pro with screen content
function IPhone17Pro({
    screenContent,
    activePreset
}: {
    screenContent: DeviceCanvasProps['screenContent'];
    activePreset: AnimationPreset | null;
}) {
    const groupRef = useRef<THREE.Group>(null);
    const [animationTime, setAnimationTime] = useState(0);

    // Animation frame
    useFrame((state, delta) => {
        if (activePreset && groupRef.current) {
            setAnimationTime((prev) => prev + delta);
            const { rotation, position, scale } = activePreset.animate(
                animationTime,
                activePreset.duration
            );

            groupRef.current.rotation.set(rotation[0], rotation[1], rotation[2]);
            groupRef.current.position.set(position[0], position[1], position[2]);
            groupRef.current.scale.setScalar(scale * 15);
        }
    });

    // Reset animation when preset changes
    useEffect(() => {
        setAnimationTime(0);
        if (groupRef.current) {
            groupRef.current.rotation.set(0, 0, 0);
            groupRef.current.position.set(0, 0, 0);
            groupRef.current.scale.setScalar(15);
        }
    }, [activePreset]);

    return (
        <group ref={groupRef} scale={15}>
            {screenContent ? (
                <IPhoneWithTexture screenContent={screenContent} />
            ) : (
                <IPhone17ProModel />
            )}
        </group>
    );
}

// Separate component for image texture
function IPhoneWithImageTexture({ url }: { url: string }) {
    const texture = useTexture(url);
    // Fix texture orientation and color space for GLTF
    texture.flipY = false;
    texture.colorSpace = THREE.SRGBColorSpace;

    return <IPhone17ProModel screenTexture={texture} />;
}

// Separate component for video texture  
function IPhoneWithVideoTexture({ url }: { url: string }) {
    const texture = useVideoTexture(url, { loop: true, muted: true });
    // Fix texture orientation and color space for GLTF
    texture.flipY = false;
    texture.colorSpace = THREE.SRGBColorSpace;

    return <IPhone17ProModel screenTexture={texture} />;
}

// Wrapper to handle different content types
function IPhoneWithTexture({ screenContent }: { screenContent: { type: 'image' | 'video'; url: string } }) {
    if (screenContent.type === 'video') {
        return <IPhoneWithVideoTexture url={screenContent.url} />;
    }
    return <IPhoneWithImageTexture url={screenContent.url} />;
}

// Scene setup
function Scene({
    screenContent,
    backgroundColor,
    activePreset
}: DeviceCanvasProps) {
    const { gl } = useThree();

    useEffect(() => {
        gl.setClearColor(backgroundColor);
    }, [backgroundColor, gl]);

    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={50} />

            {/* Lighting */}
            <ambientLight intensity={0.5} />
            <directionalLight
                position={[5, 5, 5]}
                intensity={1.2}
                castShadow
            />
            <directionalLight
                position={[-5, 5, 5]}
                intensity={0.6}
            />
            <spotLight
                position={[0, 5, 0]}
                intensity={0.5}
                angle={0.6}
                penumbra={1}
            />

            {/* Environment for reflections */}
            <Environment preset="city" />

            {/* iPhone 17 Pro model */}
            <IPhone17Pro
                screenContent={screenContent}
                activePreset={activePreset}
            />

            {/* Ground shadow */}
            <ContactShadows
                position={[0, -1.8, 0]}
                opacity={0.6}
                scale={8}
                blur={2}
                far={6}
            />

            {/* Orbit controls */}
            <OrbitControls
                enablePan={false}
                minDistance={3}
                maxDistance={8}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={Math.PI / 1.5}
            />

            {/* Post-processing */}
            <EffectComposer>
                <Bloom
                    intensity={0.2}
                    luminanceThreshold={0.85}
                    luminanceSmoothing={0.9}
                />
                <Vignette darkness={0.35} offset={0.3} />
            </EffectComposer>
        </>
    );
}

export function DeviceCanvas({
    screenContent,
    backgroundColor,
    activePreset
}: DeviceCanvasProps) {
    return (
        <Canvas
            shadows
            dpr={[1, 2]}
            className="w-full h-full"
            gl={{
                antialias: true,
                alpha: true,
                preserveDrawingBuffer: true,
            }}
        >
            <Scene
                screenContent={screenContent}
                backgroundColor={backgroundColor}
                activePreset={activePreset}
            />
        </Canvas>
    );
}
