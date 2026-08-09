import { Area } from "react-easy-crop";

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", reject);
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });
}

/**
 * Produces a tiny base64 JPEG (LQIP) of the same crop, small enough to embed
 * directly in a Firestore document (~0.5–1KB). Painted as the `blurDataURL`
 * behind the real photo so the profile circle is filled the instant the page
 * renders, with no additional network request.
 */
export async function getCroppedBlurDataUrl(
  imageSrc: string,
  pixelCrop: Area,
  size = 16,
  quality = 0.5,
): Promise<string> {
  const blob = await getCroppedImg(imageSrc, pixelCrop, size, quality);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read blur placeholder"));
    reader.readAsDataURL(blob);
  });
}

export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  maxSize = 512,
  quality = 0.82,
): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  const longestSide = Math.max(pixelCrop.width, pixelCrop.height);
  const scale = longestSide > maxSize ? maxSize / longestSide : 1;
  const outputWidth = Math.max(1, Math.round(pixelCrop.width * scale));
  const outputHeight = Math.max(1, Math.round(pixelCrop.height * scale));

  canvas.width = outputWidth;
  canvas.height = outputHeight;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    outputWidth,
    outputHeight,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas toBlob failed"));
      },
      "image/jpeg",
      quality,
    );
  });
}
