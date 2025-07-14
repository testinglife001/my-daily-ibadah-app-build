// src/hooks/useImage.js
import { useState, useEffect } from "react";

export default function useImage(src) {
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (!src) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => setImage(img);
  }, [src]);

  return [image];
}
