import { useState } from "react";
import { ARCamera } from "./components/ARCamera";
import { FurnitureGallery } from "./components/FurnitureGallery";
import type { Furniture } from "./types/furniture";
import type { PlacedItem } from "./data/arPhysics";

type ARMode = "gallery" | "viewer" | "ar";

function App() {
  const [mode, setMode] = useState<ARMode>("gallery");
  const [selectedItem, setSelectedItem] = useState<Furniture | null>(null);
  const [scale, setScale] = useState(1);
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);

  const handleSelectItem = (item: Furniture) => {
    setSelectedItem(item);
    setMode("viewer");
    setScale(1);
  };

  const enterAR = () => {
    if (!selectedItem) return;
    setMode("ar");
  };

  const exitAR = () => {
    setMode("viewer");
  };

  const backToGallery = () => {
    setSelectedItem(null);
    setMode("gallery");
    setPlacedItems([]);
    setScale(1);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">

      {/* ================= GALLERY ================= */}
      {mode === "gallery" && (
        <FurnitureGallery
          onSelectFurniture={handleSelectItem}
        />
      )}

      {/* ================= VIEWER ================= */}
      {mode === "viewer" && selectedItem && (
        <div className="flex flex-col min-h-screen">

          {/* PREVIEW */}
          <div className="flex-1 flex items-center justify-center text-white">
            <div className="text-center">

              <div
                className="mx-auto rounded-lg shadow-2xl mb-6"
                style={{
                  width: 180,
                  height: 180,
                  backgroundColor: selectedItem.color,
                }}
              />

              <h3 className="text-2xl font-bold mb-2">
                {selectedItem.name}
              </h3>

              <p className="text-gray-400 mb-4">
                {selectedItem.model
                  ? "This furniture includes a 3D model."
                  : "This furniture uses a generated preview."}
              </p>

              <div className="text-sm text-gray-500 space-y-1">
                <p>
                  Width: {selectedItem.dimensions.width}m
                </p>

                <p>
                  Height: {selectedItem.dimensions.height}m
                </p>

                <p>
                  Depth: {selectedItem.dimensions.depth}m
                </p>
              </div>

            </div>
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
                onClick={backToGallery}
                className="bg-red-600 px-4 py-2 rounded text-white hover:bg-red-700 transition"
              >
                Back
              </button>
            </div>

            {/* SCALE */}
            <div className="mb-4">
              <p className="text-gray-400 mb-2">
                Scale ({scale.toFixed(1)}x)
              </p>

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

              <button
                onClick={enterAR}
                className="flex-1 bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
              >
                Enter AR
              </button>

              <button
                disabled
                className="flex-1 bg-gray-600 text-white py-3 rounded opacity-60 cursor-not-allowed"
              >
                Add to Cart
              </button>

            </div>

          </div>
        </div>
      )}

      {/* ================= AR ================= */}
      {mode === "ar" && selectedItem && (
        <ARCamera
          item={selectedItem}
          scale={scale}
          onExit={exitAR}
          placedItems={placedItems}
          setPlacedItems={setPlacedItems}
        />
      )}

    </div>
  );
}

export default App;