import { useState } from "react";
import { furnitureItems } from "./data/furnitureData";
import { ARCamera } from "./components/ARCamera";
import type { Furniture } from "./types/furniture";

function App() {
  const [selectedItem, setSelectedItem] = useState<Furniture | null>(null);
  const [scale, setScale] = useState(1);
  const [isARMode, setIsARMode] = useState(false);

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">

      {/* ===================== GALLERY ===================== */}
      {!selectedItem && (
        <div className="p-8">
          <div className="max-w-6xl mx-auto">

            <div className="mb-12 text-center">
              <h1 className="text-5xl font-bold text-white mb-2">
                AR Furniture Viewer
              </h1>
              <p className="text-gray-300 text-lg">
                Select furniture and preview it in AR
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {furnitureItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedItem(item);
                    setIsARMode(false);
                    setScale(1); // reset scale al cambiar item
                  }}
                  className="group bg-gray-700 rounded-lg overflow-hidden hover:scale-105 transition"
                >
                  <div className="aspect-square bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                    <div
                      className="w-24 h-24 rounded-md"
                      style={{ backgroundColor: item.color }}
                    />
                  </div>

                  <div className="p-4">
                    <h3 className="text-white font-semibold">
                      {item.name}
                    </h3>
                    <p className="text-amber-400">
                      {item.price.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </p>
                  </div>
                </button>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* ===================== DETAIL / AR ===================== */}
      {selectedItem && (
        <div className="flex flex-col min-h-screen">

          {/* VIEW AREA */}
          <div className="flex-1 flex items-center justify-center">

            {isARMode ? (
              <ARCamera
                item={selectedItem}
                scale={scale}
                onExit={() => setIsARMode(false)}

                // 🔥 ya no se maneja física desde App
                placedItems={[]}
                setPlacedItems={() => {}}
              />
            ) : (
              <div className="text-white text-center">
                <p className="text-xl mb-2">Preview mode</p>
                <p className="text-gray-400">
                  Enable AR to place furniture in real space
                </p>
              </div>
            )}

          </div>

          {/* CONTROLS */}
          <div className="bg-gray-900 p-6 border-t border-gray-700">

            <div className="flex justify-between mb-4">
              <div>
                <h2 className="text-2xl text-white font-bold">
                  {selectedItem.name}
                </h2>
                <p className="text-gray-400">
                  {selectedItem.description}
                </p>
                <p className="text-amber-400 text-xl">
                  {selectedItem.price.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedItem(null);
                  setIsARMode(false);
                }}
                className="bg-red-600 px-4 py-2 rounded text-white"
              >
                Back
              </button>
            </div>

            {/* SCALE */}
            <div className="mb-4">
              <p className="text-gray-400 mb-2">Scale</p>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            {/* ACTIONS */}
            <div className="flex gap-4">

              {!isARMode ? (
                <button
                  onClick={() => setIsARMode(true)}
                  className="flex-1 bg-blue-600 text-white py-3 rounded"
                >
                  📱 Enter AR
                </button>
              ) : (
                <button
                  onClick={() => setIsARMode(false)}
                  className="flex-1 bg-red-600 text-white py-3 rounded"
                >
                  Exit AR
                </button>
              )}

              <button className="flex-1 bg-amber-600 text-white py-3 rounded">
                🛒 Add to Cart
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default App;