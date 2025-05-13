// ImageWithBeautifulLoader.tsx
import { useState } from "react";
import { Loader2 } from "lucide-react"; // Spinner icon

function Image({src,alt,imageClassName,loading,containerClassName}) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`${containerClassName} relative`}>
      {/* Loader Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 animate-pulse z-10">
          {/* <Loader2 className="h-10 w-10 text-gray-500 dark:text-gray-300 animate-spin" /> */}
        </div>
      )}

      {/* Image */}
      <img
        src={src}
        alt={alt}
        loading={loading}
        onLoad={() => setIsLoading(false)}
        className={`${imageClassName}  transition-opacity duration-700 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      />
    </div>
  );
}

export default Image;
