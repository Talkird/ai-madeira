import { useState } from "react";
import { furnitureItems } from "./data/furnitureData";
import { ARCamera } from "./components/ARCamera";
import type { Furniture } from "./types/furniture";
import type { PlacedItem } from "./data/arPhysics";

type ARMode = "gallery" | "ar";

function App() {
  const [mode, setMode] = useState<ARMode>("gallery");
  const [selectedItem, setSelectedItem] = useState<Furniture | null>(null);
  const [scale, setScale] = useState(1);
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);

  // =====================
  // SELECT ITEM
  // =====================
  const handleSelectItem = (item: Furniture) => {
    setSelectedItem(item);
    setScale(1);
  };

  // =====================
  // ENTER AR
  // =====================
  const enterAR = () => {
    if (!selectedItem) return;
    setMode("ar");
  };

  // =====================
  // EXIT AR
  // =====================
  const exitAR = () => {
    setMode("gallery");
  };

  // =====================
  // RESET APP STATE
  // =====================
  const resetApp = () => {
    setSelectedItem(null);
    setMode("gallery");
    setPlacedItems([]);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">

      {/* ===================== GALLERY ===================== */}
      {mode === "gallery" && (
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
                  onClick={() => handleSelectItem(item)}
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

            {/* ===================== ACTION PANEL ===================== */}
            {selectedItem && (
              <div className="mt-10 text-center">
                <p className="text-white mb-2">
                  Selected: {selectedItem.name}
                </p>

                <button
                  onClick={enterAR}
                  className="bg-blue-600 text-white px-6 py-3 rounded"
                >
                  📱 Enter AR
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ===================== AR MODE ===================== */}
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