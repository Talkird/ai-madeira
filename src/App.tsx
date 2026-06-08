import { useState } from "react";
import { ARCamera } from "./components/ARCamera";
import { FurnitureGallery } from "./components/FurnitureGallery";
import { FurnitureViewer } from "./components/FurnitureViewer";
import type { Furniture } from "./types/furniture";
import type { PlacedItem } from "./data/arPhysics";

type ARMode = "gallery" | "viewer" | "ar";

function App() {
  const [mode, setMode] = useState<ARMode>("gallery");

  const [selectedItem, setSelectedItem] =
    useState<Furniture | null>(null);

  const [scale, setScale] = useState(1);

  const [placedItems, setPlacedItems] =
    useState<PlacedItem[]>([]);

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

      {/* GALLERY */}
      {mode === "gallery" && (
        <FurnitureGallery
          onSelectFurniture={handleSelectItem}
        />
      )}

      {/* VIEWER */}
      {mode === "viewer" && selectedItem && (
        <FurnitureViewer
          furniture={selectedItem}
          scale={scale}
          onScaleChange={setScale}
          onBack={backToGallery}
          onEnterAR={enterAR}
        />
      )}

      {/* AR */}
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