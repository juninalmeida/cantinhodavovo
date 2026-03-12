import React from 'react';

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none bg-creme-manteiga/10">
      
      {/* 1. Global Texture (Noise) */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.05] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>

      {/* 2. Checkered Background (Malha Xadrez Sutil) */}
      <div 
        className="absolute inset-[-50%] w-[200%] h-[200%] opacity-30 animate-pan-bg pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='40' height='40' fill='%23B43A2F' fill-opacity='0.08'/%3E%3Crect x='40' y='40' width='40' height='40' fill='%23B43A2F' fill-opacity='0.08'/%3E%3C/svg%3E")`,
        }}
      />

      {/* 3. Steam (Fumaça Quentinha) - Bottom Left & Bottom Right */}
      <div className="absolute bottom-0 left-[10%] w-[300px] h-[300px] animate-steam-pulse pointer-events-none origin-bottom text-white">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-60 overflow-visible">
          <path d="M40 100 Q 20 50, 60 0 T 80 -50" stroke="currentColor" strokeWidth="12" strokeLinecap="round" filter="blur(8px)"/>
          <path d="M60 100 Q 40 50, 70 0 T 40 -50" stroke="currentColor" strokeWidth="16" strokeLinecap="round" filter="blur(10px)"/>
        </svg>
      </div>
      <div className="absolute bottom-[-10%] right-[5%] w-[400px] h-[400px] animate-steam-pulse pointer-events-none origin-bottom text-white" style={{ animationDelay: '3s' }}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-50 overflow-visible">
          <path d="M30 100 Q 10 50, 50 0 T 70 -50" stroke="currentColor" strokeWidth="15" strokeLinecap="round" filter="blur(12px)"/>
          <path d="M70 100 Q 50 50, 80 0 T 50 -50" stroke="currentColor" strokeWidth="20" strokeLinecap="round" filter="blur(14px)"/>
        </svg>
      </div>

      {/* 4. Floating Elements (Corações) */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => {
          // Valores randomizados pseudo-estáticos baseados no índice para estabilidade do SSR/renderização
          const leftPos = [15, 35, 65, 85, 25, 75][i];
          const delay = [0, 2, 4, 1.5, 3.5, 5][i];
          const duration = [12, 15, 13, 16, 14, 17][i];
          const scale = [0.6, 0.8, 0.5, 0.9, 0.7, 0.6][i];
          
          return (
            <svg 
              key={i}
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className="absolute bottom-[-50px] text-tomate opacity-0 animate-float-up pointer-events-none"
              style={{
                left: `${leftPos}%`,
                width: `${40 * scale}px`,
                height: `${40 * scale}px`,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
              }}
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          );
        })}
      </div>
      
    </div>
  );
}
