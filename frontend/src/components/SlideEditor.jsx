import { useState } from "react";
import { editSlide } from "../utils/api";

function SlideEditor() {
  const [filename, setFilename] = useState("");
  const [slides, setSlides] = useState([]);
  const [slideNum, setSlideNum] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [response, setResponse] = useState("");

  // --- Fetch slides for preview ---
  const handlePreview = async () => {
    if (!filename) {
      setResponse("Please enter the PPT filename first.");
      return;
    }
    try {
      const result = await editSlide.preview(filename);
      setSlides(result.slides || []);
      setResponse("Slides loaded for preview.");
    } catch (err) {
      console.error(err);
      setResponse("Error fetching slides.");
    }
  };

  // --- Update slide ---
  const handleUpdate = async () => {
    if (!slideNum) {
      setResponse("Please enter slide number to edit.");
      return;
    }

    try {
      const result = await editSlide.update({
        filename,
        slide_number: parseInt(slideNum),
        title: title || undefined,
        body: body || undefined,
      });
      setResponse(result.message || "Slide updated successfully!");

      // Refresh preview
      handlePreview();
    } catch (err) {
      console.error(err);
      setResponse("Error updating slide.");
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md w-full max-w-3xl">
      <h2 className="text-xl font-semibold mb-4">Edit PPT Slides</h2>

      <input
        type="text"
        placeholder="Enter uploaded PPT filename (e.g., sample.pptx)"
        value={filename}
        onChange={(e) => setFilename(e.target.value)}
        className="border p-2 rounded w-full mb-3"
      />

      <button
        onClick={handlePreview}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
      >
        Preview Slides
      </button>

      {slides.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Slide Preview:</h3>
          {slides.map((s) => (
            <div key={s.slide_number} className="border p-2 mb-2 rounded bg-gray-50">
              <strong>Slide {s.slide_number}: {s.title}</strong>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mb-4">
        <input
          type="number"
          placeholder="Slide number to edit"
          value={slideNum}
          onChange={(e) => setSlideNum(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />
        <input
          type="text"
          placeholder="New title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />
        <textarea
          placeholder="New body/content (optional)"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="border p-2 rounded w-full mb-2 h-24"
        />
        <button
          onClick={handleUpdate}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 w-full"
        >
          Update Slide
        </button>
      </div>

      {response && (
        <div className="mt-2 p-3 bg-gray-100 rounded text-sm text-gray-700">{response}</div>
      )}
    </div>
  );
}

export default SlideEditor;
