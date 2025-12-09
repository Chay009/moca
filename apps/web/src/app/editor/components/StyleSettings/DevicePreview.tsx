/**
 * DevicePreview - React-Three-Fiber 3D preview for device mockups
 * Uses the same IPhone17Pro model as /device page
 */

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
import * as THREE from 'three';
import { Model as IPhone17ProModel } from '@/app/device/components/IPhone17Pro';

interface DevicePreviewProps {
    screenContent: { type: 'image' | 'video'; url: string } | null;
    backgroundColor: string;
    activePreset: string;
    isPlaying: boolean;
}

// Easing functions
const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

const easeOutBack = (t: number): number => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

// Animation presets
const PRESETS: Record<string, { duration: number; animate: (time: number, duration: number) => { rotation: [number, number, number]; position: [number, number, number]; scale: number } }> = {
    'hero-entrance': {
        duration: 2.5,
        animate: (elapsedTime, duration) => {
            const progress = Math.min(elapsedTime / duration, 1);
            const eased = easeOutBack(progress);
            return {
                rotation: [-0.3 * (1 - eased), 0.2 * (1 - eased), 0] as [number, number, number],
                position: [0, -2 + 2 * eased, 1 - 1 * eased] as [number, number, number],
                scale: 0.5 + 0.5 * eased,
            };
        },
    },
    'floating': {
        duration: 4,
        animate: (elapsedTime, duration) => {
            const progress = (elapsedTime % duration) / duration;
            const wave = Math.sin(progress * Math.PI * 2);
            const wave2 = Math.cos(progress * Math.PI * 2);
            return {
                rotation: [0.05 * wave, 0.1 * wave2, 0.02 * wave] as [number, number, number],
                position: [0.1 * wave2, 0.15 * wave, 0] as [number, number, number],
                scale: 1,
            };
        },
    },
    'rotate-360': {
        duration: 4,
        animate: (elapsedTime, duration) => {
            const progress = Math.min(elapsedTime / duration, 1);
            const eased = easeInOutCubic(progress);
            return {
                rotation: [0, Math.PI * 2 * eased, 0] as [number, number, number],
                position: [0, 0, 0] as [number, number, number],
                scale: 1,
            };
        },
    },
    'tilted-zoom-out': {
        duration: 3,
        animate: (elapsedTime, duration) => {
            const progress = Math.min(elapsedTime / duration, 1);
            const eased = easeOutBack(progress);
            return {
                rotation: [0.1 * (1 - eased), Math.PI * 0.1 * eased, -0.05 * (1 - eased)] as [number, number, number],
                position: [0, 0.5 * (1 - eased), 2 - 1.5 * eased] as [number, number, number],
                scale: 1 + 0.3 * (1 - eased),
            };
        },
    },
};

// iPhone component with animation
function AnimatedIPhone({
    screenContent,
    activePreset,
    isPlaying
}: {
    screenContent: DevicePreviewProps['screenContent'];
    activePreset: string;
    isPlaying: boolean;
}) {
    const groupRef = useRef<THREE.Group>(null);
    const [animationTime, setAnimationTime] = useState(0);

    const preset = PRESETS[activePreset] || PRESETS['floating'];

    useFrame((state, delta) => {
        if (isPlaying && groupRef.current) {
            setAnimationTime((prev) => prev + delta);
            const { rotation, position, scale } = preset.animate(animationTime, preset.duration);
            groupRef.current.rotation.set(rotation[0], rotation[1], rotation[2]);
            groupRef.current.position.set(position[0], position[1], position[2]);
            groupRef.current.scale.setScalar(scale * 15);
        }
    });

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

// Image texture wrapper
function IPhoneWithImageTexture({ url }: { url: string }) {
    const texture = useTexture(url);
    texture.flipY = false;
    texture.colorSpace = THREE.SRGBColorSpace;
    return <IPhone17ProModel screenTexture={texture} />;
}

// Video texture wrapper
function IPhoneWithVideoTexture({ url }: { url: string }) {
    const texture = useVideoTexture(url, { loop: true, muted: true });
    texture.flipY = false;
    texture.colorSpace = THREE.SRGBColorSpace;
    return <IPhone17ProModel screenTexture={texture} />;
}

// Texture type router
function IPhoneWithTexture({ screenContent }: { screenContent: { type: 'image' | 'video'; url: string } }) {
    if (screenContent.type === 'video') {
        return <IPhoneWithVideoTexture url={screenContent.url} />;
    }
    return <IPhoneWithImageTexture url={screenContent.url} />;
}

// Scene setup
function Scene({ screenContent, backgroundColor, activePreset, isPlaying }: DevicePreviewProps) {
    const { gl } = useThree();

    useEffect(() => {
        gl.setClearColor(backgroundColor);
    }, [backgroundColor, gl]);

    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={50} />

            {/* Lighting */}
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
            <directionalLight position={[-5, 5, 5]} intensity={0.6} />
            <spotLight position={[0, 5, 0]} intensity={0.5} angle={0.6} penumbra={1} />

            {/* Environment for reflections */}
            <Environment preset="city" />

            {/* Animated iPhone */}
            <AnimatedIPhone
                screenContent={screenContent}
                activePreset={activePreset}
                isPlaying={isPlaying}
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
                minDistance={2}
                maxDistance={10}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={Math.PI / 1.5}
            />
        </>
    );
}

export function DevicePreview({ screenContent, backgroundColor, activePreset, isPlaying }: DevicePreviewProps) {
    return (
        <div className="w-full h-[300px]">
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
                    isPlaying={isPlaying}
                />
            </Canvas>
        </div>
    );
}
