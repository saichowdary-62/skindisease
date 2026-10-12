import React, { useState, useRef, MouseEvent } from 'react';
import { ZoomIn, ZoomOut, Grid, Eye, Sliders, Maximize2 } from 'lucide-react';

interface InteractiveMagnifierProps {
  imageUrl: string;
  altText?: string;
}

export const InteractiveMagnifier: React.FC<InteractiveMagnifierProps> = ({
  imageUrl,
  altText = 'Skin lesion macro inspection',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(2.2);
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Viewer Window */}
      <div
        ref={containerRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
        className={`relative w-full aspect-square max-h-[380px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-200/80 shadow-inner cursor-crosshair select-none ${
          highContrast ? 'contrast-125 saturate-110 brightness-95' : ''
        }`}
      >
        {/* Main Base Image */}
        <img
          src={imageUrl}
          alt={altText}
          className="w-full h-full object-contain"
        />

        {/* Dermoscopy Reference Millimeter Grid Overlay */}
        {showGrid && (
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              backgroundImage: `linear-gradient(to right, #06b6d4 1px, transparent 1px), linear-gradient(to bottom, #06b6d4 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
            }}
          />
        )}

        {/* Circular Magnifier Lens on Hover */}
        {isHovered && (
          <div
            className="pointer-events-none absolute w-44 h-44 rounded-full border-2 border-teal-400 shadow-2xl overflow-hidden transform -translate-x-1/2 -translate-y-1/2 z-20"
            style={{
              left: `${mousePos.x}%`,
              top: `${mousePos.y}%`,
              boxShadow: '0 0 0 3px rgba(13, 148, 136, 0.4), 0 10px 25px rgba(0,0,0,0.5)',
            }}
          >
            <div
              className="w-full h-full bg-no-repeat bg-slate-900"
              style={{
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: `${zoomLevel * 100}%`,
                backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
              }}
            />
            {/* Center crosshair inside lens */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-5 h-5 border border-teal-300/80 rounded-full flex items-center justify-center">
                <div className="w-1 h-1 bg-teal-300 rounded-full"></div>
              </div>
            </div>
            {/* Lens zoom tag */}
            <div className="absolute top-2 right-2 bg-slate-900/90 text-teal-300 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded">
              {zoomLevel}x
            </div>
          </div>
        )}

        {/* Hover guidance tooltip */}
        {!isHovered && (
          <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-slate-900/75 backdrop-blur-xs text-slate-200 text-xs py-1 px-3 rounded-lg flex items-center justify-between pointer-events-none">
            <span className="flex items-center gap-1.5 font-medium">
              <Eye className="w-3.5 h-3.5 text-teal-400" /> Hover / move cursor to magnify lesion details
            </span>
            <span className="text-[11px] text-teal-300 font-mono">{zoomLevel}x lens</span>
          </div>
        )}
      </div>

      {/* Magnifier Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-slate-600">
        <div className="flex items-center gap-1">
          <span className="font-medium text-slate-700 mr-1">Magnification:</span>
          {[1.5, 2.2, 3.2].map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setZoomLevel(lvl)}
              className={`px-2 py-1 rounded-md font-mono text-xs font-semibold cursor-pointer transition-colors ${
                zoomLevel === lvl
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {lvl}x
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowGrid(!showGrid)}
            className={`px-2.5 py-1 rounded-md font-medium text-xs flex items-center gap-1 cursor-pointer transition-colors ${
              showGrid
                ? 'bg-teal-100 text-teal-800 font-semibold'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
            title="Toggle clinical inspection grid"
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Grid</span>
          </button>

          <button
            type="button"
            onClick={() => setHighContrast(!highContrast)}
            className={`px-2.5 py-1 rounded-md font-medium text-xs flex items-center gap-1 cursor-pointer transition-colors ${
              highContrast
                ? 'bg-teal-100 text-teal-800 font-semibold'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
            title="Enhance pigment borders and vessel visibility"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Derm Contrast</span>
          </button>
        </div>
      </div>
    </div>
  );
};
