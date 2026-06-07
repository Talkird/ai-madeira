import { useEffect, useRef } from "react";
import type { Furniture } from "../types/furniture";

interface Props {
  item: Furniture;
  scale: number;
  onExit: () => void;
}

export function ARCamera({ item, scale, onExit }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let stream: MediaStream;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
          },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (err) {
        console.error("Camera error:", err);
      }
    };

    startCamera();

    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full">
      {/* CAMERA */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* DARK OVERLAY (opcional para contraste) */}
      <div className="absolute inset-0 bg-black/10" />

      {/* FURNITURE OVERLAY */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          style={{
            width: item.dimensions.width * 100 * scale,
            height: item.dimensions.height * 100 * scale,
            backgroundColor: item.color,
            transform: "rotateY(15deg) rotateX(5deg)",
            boxShadow:
              "inset -10px -10px 30px rgba(0,0,0,0.5), -20px 20px 50px rgba(0,0,0,0.6)",
          }}
          className="rounded-lg"
        />
      </div>

      {/* EXIT BUTTON */}
      <button
        onClick={onExit}
        className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-lg"
      >
        Exit AR
      </button>
    </div>
  );
}