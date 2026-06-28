import { useState } from "react";
import { ARCamera } from "./components/ARCamera";
import { FurnitureGallery } from "./components/FurnitureGallery";
import { FurnitureViewer } from "./components/FurnitureViewer";
import type { Furniture } from "./types/furniture";

type ARMode = "gallery" | "viewer" | "ar";

function App() {
  const [mode, setMode] = useState<ARMode>("gallery");
  const [selectedItem, setSelectedItem] = useState<Furniture | null>(null);

  const handleSelectItem = (item: Furniture) => {
    setSelectedItem(item);
    setMode("viewer");
  };

  const enterAR = () => {
    if (!selectedItem) return;
    setMode("ar");
  };

  const exitAR = () => setMode("viewer");

  const backToGallery = () => {
    setSelectedItem(null);
    setMode("gallery");
  };

  return (
    <div className="w-full min-h-screen bg-white">
      {mode === "gallery" && (
        <FurnitureGallery onSelectFurniture={handleSelectItem} />
      )}

      {mode === "viewer" && selectedItem && (
        <FurnitureViewer
          furniture={selectedItem}
          onBack={backToGallery}
          onEnterAR={enterAR}
        />
      )}

      {mode === "ar" && selectedItem && (
        <ARCamera item={selectedItem} onExit={exitAR} />
      )}
    </div>
  );
}

export default App;
