import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Device Showcase | 3D Device Mockups',
    description: 'Create stunning 3D device mockups with animations',
};

export default function DeviceLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-screen w-screen overflow-hidden bg-neutral-950">
            {children}
        </div>
    );
}
