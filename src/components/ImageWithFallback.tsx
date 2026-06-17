import React, { useState, useEffect } from "react";

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  category?: string;
  fallbackType?: "product" | "profile" | "document" | "avatar";
}

// Pure helper function to get non-empty fallback URL synchronously
const getFallbackUrlValue = (fallbackType: string, category?: string): string => {
  if (fallbackType === "avatar" || fallbackType === "profile") {
    return "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' style='background-color:%23f1f5f9;'><path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' fill='%23cbd5e1'/><circle cx='12' cy='7' r='4' fill='%23cbd5e1'/></svg>";
  }
  if (fallbackType === "document") {
    return "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 24 24' fill='none' stroke='%23059669' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' style='background-color:%23ecfdf5;'><path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'/><polyline points='14 2 14 8 20 8'/><line x1='16' y1='13' x2='8' y2='13'/><line x1='16' y1='17' x2='8' y2='17'/><polyline points='10 9 9 9 8 9'/></svg>";
  }

  // Category-specific fallbacks
  const cat = (category || "").toLowerCase();
  if (cat.includes("seed")) {
    return "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 24 24' fill='none' stroke='%23059669' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' style='background-color:%23f0fdf4;'><path d='M12 22V12M12 12c-4 0-6-3-6-6 4 0 6 3 6 6zM12 12c4 0 6-3 6-6-4 0-6 3-6 6z' fill='%23a7f3d0'/></svg>";
  } else if (cat.includes("pesticide") || cat.includes("medicine") || cat.includes("bio")) {
    return "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 24 24' fill='none' stroke='%230284c7' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' style='background-color:%23f0f9ff;'><path d='M12 2v6M12 8h-4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-4z' fill='%23bae6fd'/><circle cx='12' cy='15' r='2' fill='%230284c7'/></svg>";
  } else if (cat.includes("fertilizer") || cat.includes("urea")) {
    return "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 24 24' fill='none' stroke='%23b45309' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' style='background-color:%23fef3c7;'><rect x='4' y='3' width='16' height='18' rx='2' ry='2' fill='%23fde68a'/><path d='M4 9h16M4 15h16'/></svg>";
  } else if (cat.includes("tool") || cat.includes("equip") || cat.includes("sprayer")) {
    return "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 24 24' fill='none' stroke='%234f46e5' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' style='background-color:%23e0e7ff;'><path d='M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z' fill='%23c7d2fe'/></svg>";
  }
  return "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 24 24' fill='none' stroke='%23059669' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' style='background-color:%23f0fdf4;'><path d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' fill='%23cbd5e1'/></svg>"; // default agri
};

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className,
  category,
  fallbackType = "product",
  ...props
}) => {
  // Use synchronous resolution so the initial render state imgSrc is already populated with a non-empty string.
  const [imgSrc, setImgSrc] = useState<string>(src || getFallbackUrlValue(fallbackType, category));
  const [isLoading, setIsLoading] = useState<boolean>(!!src);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    if (src) {
      setImgSrc(src);
      setIsLoading(true);
      setHasError(false);
    } else {
      setImgSrc(getFallbackUrlValue(fallbackType, category));
      setIsLoading(false);
      setHasError(false);
    }
  }, [src, category, fallbackType]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(getFallbackUrlValue(fallbackType, category));
      setIsLoading(false);
    }
  };

  return (
    <div className={`relative overflow-hidden inline-block ${className || ""}`}>
      {/* Skeleton Loading State */}
      {isLoading && (
        <div className="absolute inset-0 bg-slate-100 flex items-center justify-center animate-pulse rounded-md">
          <span className="text-[10px] text-slate-400 font-mono">Loading...</span>
        </div>
      )}
      <img
        src={imgSrc}
        alt={alt || "Agrivon asset"}
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        referrerPolicy="no-referrer"
        {...props}
      />
    </div>
  );
};
