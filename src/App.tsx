import { useState } from "react";
import { furnitureItems } from "./data/furnitureData";
import { ARCamera } from "./components/ARCamera";

function App() {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [isARMode, setIsARMode] = useState(false);

  const currentItem = furnitureItems.find(
    (item) => item.id === selectedItem
  );

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {!selectedItem ? (
        // =======================
        // GALLERY VIEW
        // =======================
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12 text-center">
              <h1 className="text-5xl font-bold text-white mb-2">
                AR Furniture Viewer
              </h1>
              <p className="text-gray-300 text-lg">
                Select furniture and preview it with AR
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {furnitureItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem(item.id)}
                  className="group relative bg-gray-700 rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 text-left"
                >
                  <div className="aspect-square bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                    <div
                      className="w-24 h-24 rounded-md opacity-80 group-hover:opacity-100 transition-opacity"
                      style={{ backgroundColor: item.color }}
                    />
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white group-hover:text-amber-400">
                      {item.name}
                    </h3>
                    <p className="text-amber-400 font-bold mt-2">
                      {item.price}
                    </p>
                    <p className="text-amber-500 text-sm mt-3">
                      View in AR →
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // =======================
        // DETAIL / AR VIEW
        // =======================
        <div className="w-full h-screen flex flex-col bg-black">
          <div className="flex-1 relative flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
            
            {/* AR MODE */}
            {isARMode && currentItem ? (
              <ARCamera
                item={currentItem}
                scale={scale}
                onExit={() => setIsARMode(false)}
              />
            ) : (
              // PREVIEW MODE
              <div className="relative z-10">
                <div
                  className="rounded-lg"
                  style={{
                    backgroundColor: currentItem?.color,
                    width: `${(currentItem?.dimensions.width || 1) * 100 * scale}px`,
                    height: `${(currentItem?.dimensions.height || 1) * 100 * scale}px`,
                    transform: "rotateY(15deg) rotateX(5deg)",
                    boxShadow:
                      "inset -10px -10px 30px rgba(0,0,0,0.5), -30px 30px 60px rgba(0,0,0,0.7)",
                  }}
                />
              </div>
            )}
          </div>

          {/* CONTROLS */}
          <div className="bg-gray-900 border-t border-gray-700 p-6">
            <div className="max-w-6xl mx-auto">
              
              {/* HEADER */}
              <div className="flex justify-between mb-6">
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
                    setIsARMode(false);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
                >
                  ← Back
                </button>
              </div>

              {/* SCALE */}
              <div className="mb-6 bg-gray-800 p-4 rounded-lg">
                <label className="text-white font-semibold">
                  Size Scale: {scale.toFixed(2)}x
                </label>

                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  className="w-full mt-3"
                />
              </div>

              {/* ACTIONS */}
              <div className="flex gap-4">
                {isARMode ? (
                  <button
                    onClick={() => setIsARMode(false)}
                    className="flex-1 bg-red-600 text-white py-3 rounded-lg"
                  >
                    Exit AR
                  </button>
                ) : (
                  <button
                    onClick={() => setIsARMode(true)}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg"
                  >
                    📱 View with Camera
                  </button>
                )}

                <button className="flex-1 bg-amber-600 text-white py-3 rounded-lg">
                  🛒 Add to Cart
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;