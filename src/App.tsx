import { useState } from "react";
import { ARCamera } from "./components/ARCamera";
import { FurnitureGallery } from "./components/FurnitureGallery";
import { FurnitureViewer } from "./components/FurnitureViewer";
import type { Furniture } from "./types/furniture";
import type { PlacedItem } from "./data/arPhysics";

type ARMode = "gallery" | "viewer" | "ar";

function App() {
  const [mode, setMode] = useState<ARMode>("gallery");

  const [selectedItem, setSelectedItem] = useState<Furniture | null>(null);

  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);

  const handleSelectItem = (item: Furniture) => {
    setSelectedItem(item);
    setMode("viewer");
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
  };

  return (
    <div className="w-full min-h-screen bg-white">
      {/* GALLERY */}
      {mode === "gallery" && (
        <FurnitureGallery onSelectFurniture={handleSelectItem} />
      )}

      {/* VIEWER */}
      {mode === "viewer" && selectedItem && (
        <FurnitureViewer
          furniture={selectedItem}
          onBack={backToGallery}
          onEnterAR={enterAR}
        />
      )}

      {/* AR */}
      {mode === "ar" && selectedItem && (
        <ARCamera
          item={selectedItem}
          onExit={exitAR}
          placedItems={placedItems}
          setPlacedItems={setPlacedItems}
        />
      )}
    </div>
  );
}

export default App;
