"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";

interface WatermarkedImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  watermarkText?: string;
  showWatermark?: boolean;
  onLoad?: () => void;
}

export default function WatermarkedImage({
  src,
  alt,
  className = "",
  style,
  watermarkText = "MIEZEER IMAGES",
  showWatermark = true,
  onLoad
}: WatermarkedImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return (
      <div className={`bg-muted flex items-center justify-center ${className}`}>
        <ImageIcon className="h-8 w-8 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        style={style}
        onLoad={() => {
          setImageLoaded(true);
          onLoad?.();
        }}
        onError={() => setImageError(true)}
      />

      {/* Watermark Overlay */}
      {showWatermark && imageLoaded && (
        <>
          {/* Main centered watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
              <span className="text-white/80 font-bold text-lg tracking-wider drop-shadow-lg">
                {watermarkText}
              </span>
            </div>
          </div>

          {/* Diagonal pattern watermarks */}
          <div className="absolute inset-0 pointer-events-none opacity-30">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={`watermark-${i}`}
                className="absolute text-white/40 font-semibold text-sm transform rotate-45 select-none"
                style={{
                  left: `${(i % 4) * 25 + 10}%`,
                  top: `${Math.floor(i / 4) * 33 + 15}%`,
                }}
              >
                MIEZEER
              </div>
            ))}
          </div>

          {/* Corner watermarks */}
          <div className="absolute top-2 left-2 text-white/60 text-xs font-semibold drop-shadow pointer-events-none">
            © Miezeer Images
          </div>
          <div className="absolute bottom-2 right-2 text-white/60 text-xs font-semibold drop-shadow pointer-events-none">
            miezeer.com
          </div>
        </>
      )}
    </div>
  );
}
