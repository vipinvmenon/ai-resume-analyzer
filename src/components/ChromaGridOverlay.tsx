import { ReactNode, RefObject } from 'react';

interface ChromaGridOverlayProps {
  children: ReactNode;
  rootRef: RefObject<HTMLDivElement | null>;
  fadeRef: RefObject<HTMLDivElement | null>;
  onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerLeave: () => void;
  className?: string;
  radius?: string;
}

export default function ChromaGridOverlay({
  children,
  rootRef,
  fadeRef,
  onPointerMove,
  onPointerLeave,
  className = '',
  radius = '300px',
}: ChromaGridOverlayProps) {
  return (
    <div
      ref={rootRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={`relative ${className}`}
      style={{
        '--r': radius,
        '--x': '50%',
        '--y': '50%',
      } as React.CSSProperties}
    >
      {children}

      {/* Radial gradient mask overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-30 rounded-inherit"
        style={{
          backdropFilter: 'grayscale(1) brightness(0.78)',
          WebkitBackdropFilter: 'grayscale(1) brightness(0.78)',
          background: 'rgba(0,0,0,0.001)',
          maskImage:
            'radial-gradient(circle var(--r) at var(--x) var(--y),transparent 0%,transparent 20%,rgba(0,0,0,0.05) 35%,rgba(0,0,0,0.12) 50%,rgba(0,0,0,0.25) 65%,rgba(0,0,0,0.45) 80%,rgba(0,0,0,0.70) 92%,white 100%)',
          WebkitMaskImage:
            'radial-gradient(circle var(--r) at var(--x) var(--y),transparent 0%,transparent 20%,rgba(0,0,0,0.05) 35%,rgba(0,0,0,0.12) 50%,rgba(0,0,0,0.25) 65%,rgba(0,0,0,0.45) 80%,rgba(0,0,0,0.70) 92%,white 100%)',
        }}
      />

      {/* Fade overlay */}
      <div
        ref={fadeRef}
        className="absolute inset-0 pointer-events-none transition-opacity duration-[250ms] z-40 rounded-inherit"
        style={{
          backdropFilter: 'grayscale(1) brightness(0.78)',
          WebkitBackdropFilter: 'grayscale(1) brightness(0.78)',
          background: 'rgba(0,0,0,0.001)',
          maskImage:
            'radial-gradient(circle var(--r) at var(--x) var(--y),white 0%,white 20%,rgba(255,255,255,0.95) 35%,rgba(255,255,255,0.85) 50%,rgba(255,255,255,0.70) 65%,rgba(255,255,255,0.50) 80%,rgba(255,255,255,0.25) 92%,transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(circle var(--r) at var(--x) var(--y),white 0%,white 20%,rgba(255,255,255,0.95) 35%,rgba(255,255,255,0.85) 50%,rgba(255,255,255,0.70) 65%,rgba(255,255,255,0.50) 80%,rgba(255,255,255,0.25) 92%,transparent 100%)',
          opacity: 1,
        }}
      />
    </div>
  );
}

