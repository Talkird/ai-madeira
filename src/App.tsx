import { useState, useRef } from "react";

interface FurnitureItem {
  id: string;
  name: string;
  price: string;
  color: string;
  description: string;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
}

function App() {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [isARMode, setIsARMode] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const furnitureItems: FurnitureItem[] = [
    {
      id: "sofa",
      name: "Modern Sofa",
      price: "$1,200",
      color: "#4A5568",
      description: "Contemporary 3-seater sofa with clean lines",
      dimensions: { width: 2.2, height: 0.85, depth: 0.95 },
    },
    {
      id: "chair",
      name: "Executive Chair",
      price: "$450",
      color: "#2D3748",
      description: "Comfortable office chair with ergonomic design",
      dimensions: { width: 0.65, height: 1.05, depth: 0.65 },
    },
    {
      id: "table",
      name: "Dining Table",
      price: "$800",
      color: "#8B4513",
      description: "Solid wood dining table for 6 persons",
      dimensions: { width: 1.8, height: 0.75, depth: 0.9 },
    },
    {
      id: "shelf",
      name: "Wall Shelf",
      price: "$150",
      color: "#CD853F",
      description: "Floating wooden shelf for storage",
      dimensions: { width: 1.5, height: 0.25, depth: 0.3 },
    },
    {
      id: "bed",
      name: "Queen Bed",
      price: "$1,500",
      color: "#3E4449",
      description: "Queen-size bed with modern frame",
      dimensions: { width: 1.6, height: 0.8, depth: 2.0 },
    },
  ];

  const currentItem = furnitureItems.find((f) => f.id === selectedItem);

  // Start AR camera
  const startARCamera = async () => {
    try {
      console.log("Starting camera...");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      console.log("Stream obtained:", stream);
      if (videoRef.current) {
        console.log("Setting video srcObject...");
        videoRef.current.srcObject = stream;
        // Ensure video plays
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log("Video playing successfully");
              setIsARMode(true);
            })
            .catch((error) => {
              console.error("Video play error:", error);
              alert("Failed to play video: " + error.message);
            });
        } else {
          setIsARMode(true);
        }
      } else {
        console.error("Video ref is null");
      }
    } catch (error) {
      console.error("Camera error:", error);
      alert("Camera access denied or not available. Please check permissions.");
    }
  };

  // Stop AR camera
  const stopARCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      setIsARMode(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {!selectedItem ? (
        // Gallery View
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-12 text-center">
              <h1 className="text-5xl font-bold text-white mb-2">
                AR Furniture Viewer
              </h1>
              <p className="text-gray-300 text-lg">
                Select furniture and preview it with AR
              </p>
            </div>

            {/* Furniture Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {furnitureItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem(item.id)}
                  className="group relative bg-gray-700 rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 text-left"
                >
                  {/* Preview Box */}
                  <div className="aspect-square bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center relative overflow-hidden">
                    <div
                      className="w-24 h-24 rounded-md opacity-80 group-hover:opacity-100 transition-opacity"
                      style={{ backgroundColor: item.color }}
                    />
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white group-hover:text-amber-400 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-amber-400 font-bold mt-2">
                      {item.price}
                    </p>
                    <p className="text-amber-500 group-hover:text-amber-400 font-semibold text-sm mt-3">
                      View in AR →
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // AR View
        <div className="w-full h-screen flex flex-col bg-black">
          {/* 3D Preview Area */}
          <div className="flex-1 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center relative overflow-hidden">
            {isARMode ? (
              // Camera AR Mode
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  width={1280}
                  height={720}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{
                    transform: "scaleX(-1)",
                    display: "block",
                  }}
                />
                <div className="absolute inset-0 bg-black/20" />
                {/* Furniture overlay on camera */}
                <div className="relative z-10 flex items-center justify-center">
                  <div
                    className="rounded-lg transition-transform duration-300"
                    style={{
                      backgroundColor: currentItem?.color,
                      width: `${(currentItem?.dimensions.width || 1) * 100 * scale}px`,
                      height: `${(currentItem?.dimensions.height || 1) * 100 * scale}px`,
                      transform: "rotateY(15deg) rotateX(5deg)",
                      boxShadow:
                        "inset -10px -10px 30px rgba(0,0,0,0.5), -30px 30px 60px rgba(0,0,0,0.7), 0 0 40px rgba(0,0,0,0.3)",
                      opacity: 0.8,
                    }}
                  />
                </div>
                {/* AR Info Badge */}
                <div className="absolute top-6 left-6 bg-green-500 text-white px-4 py-2 rounded-full font-bold text-sm">
                  🎥 AR Mode Active
                </div>
              </>
            ) : (
              // Regular 3D Preview
              <>
                {/* Grid Background */}
                <div
                  className="absolute inset-0 opacity-5"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, #fff 1px, transparent 1px), linear-gradient(0deg, #fff 1px, transparent 1px)",
                    backgroundSize: "50px 50px",
                  }}
                />

                {/* 3D Furniture Preview */}
                <div className="relative z-10">
                  <div
                    className="rounded-lg transition-transform duration-300"
                    style={{
                      backgroundColor: currentItem?.color,
                      width: `${(currentItem?.dimensions.width || 1) * 100 * scale}px`,
                      height: `${(currentItem?.dimensions.height || 1) * 100 * scale}px`,
                      transform: "rotateY(15deg) rotateX(5deg)",
                      boxShadow:
                        "inset -10px -10px 30px rgba(0,0,0,0.5), -30px 30px 60px rgba(0,0,0,0.7), 0 0 40px rgba(0,0,0,0.3)",
                    }}
                  />

                  {/* Shadow */}
                  <div
                    className="absolute top-full left-1/2 -translate-x-1/2 bg-black/40 rounded-full blur-2xl"
                    style={{
                      width: `${(currentItem?.dimensions.width || 1) * 100 * scale}px`,
                      height: `${(currentItem?.dimensions.depth || 1) * 50 * scale}px`,
                      marginTop: "10px",
                    }}
                  />
                </div>
              </>
            )}
          </div>

          {/* Controls */}
          <div className="bg-gray-900 border-t border-gray-700 p-6">
            <div className="max-w-6xl mx-auto">
              {/* Header with Back Button */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white">
                    {currentItem?.name}
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">
                    {currentItem?.description}
                  </p>
                  <p className="text-amber-400 text-2xl font-bold mt-2">
                    {currentItem?.price}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedItem(null);
                    stopARCamera();
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition whitespace-nowrap ml-4"
                >
                  ← Back
                </button>
              </div>

              {/* Size Control */}
              <div className="mb-6 bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-white font-semibold">
                    Size Scale: {scale.toFixed(2)}x
                  </label>
                  <span className="text-amber-400 text-sm">
                    Adjust to fit your space
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer hover:bg-gray-500 transition"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>50%</span>
                  <span>100%</span>
                  <span>200%</span>
                </div>
              </div>

              {/* Specifications Grid */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <span className="text-gray-400 text-xs block">Width</span>
                  <p className="text-white font-bold text-xl">
                    {((currentItem?.dimensions.width || 0) * scale).toFixed(2)}m
                  </p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <span className="text-gray-400 text-xs block">Height</span>
                  <p className="text-white font-bold text-xl">
                    {((currentItem?.dimensions.height || 0) * scale).toFixed(2)}
                    m
                  </p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <span className="text-gray-400 text-xs block">Depth</span>
                  <p className="text-white font-bold text-xl">
                    {((currentItem?.dimensions.depth || 0) * scale).toFixed(2)}m
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                {isARMode ? (
                  <>
                    <button
                      onClick={stopARCamera}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                    >
                      ⏹️ Exit AR Mode
                    </button>
                    <button className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold px-8 py-3 rounded-lg transition">
                      🛒 Add to Cart
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={startARCamera}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                    >
                      📱 View with Camera
                    </button>
                    <button className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold px-8 py-3 rounded-lg transition">
                      🛒 Add to Cart
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
