import { useState } from "react";
import { editSlide } from "../utils/api";

function SlideEditor() {
  const [slideNum, setSlideNum] = useState("");
  const [newText, setNewText] = useState("");
  const [response, setResponse] = useState("");

  const handleEdit = async () => {
    if (!slideNum || !newText) {
      setResponse("Please enter both slide number and text.");
      return;
    }

    const result = await editSlide({
      slide_number: parseInt(slideNum),
      text: newText,
    });
    setResponse(result.message || "Slide updated successfully!");
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-lg font-semibold mb-3">Edit Slide Content</h2>

      <input
        type="number"
        placeholder="Slide number"
        value={slideNum}
        onChange={(e) => setSlideNum(e.target.value)}
        className="border p-2 rounded-lg w-full mb-3"
      />

      <textarea
        placeholder="Enter new text for this slide..."
        value={newText}
        onChange={(e) => setNewText(e.target.value)}
        className="border p-2 rounded-lg w-full mb-3 h-24"
      ></textarea>

      <button
        onClick={handleEdit}
        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 w-full"
      >
        Update Slide
      </button>

      {response && (
        <div className="mt-4 bg-gray-100 p-3 rounded-lg text-sm text-gray-700">
          {response}
        </div>
      )}
    </div>
  );
}

export default SlideEditor;
