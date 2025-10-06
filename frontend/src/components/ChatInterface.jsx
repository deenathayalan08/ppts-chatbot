import React, { useState } from "react";
import { generatePPT, uploadTemplate, editSlide } from "../utils/api";

const ChatInterface = () => {
  const [mode, setMode] = useState(null); // "generate" or "edit"
  const [topic, setTopic] = useState("");
  const [pptPreview, setPptPreview] = useState([]);
  const [status, setStatus] = useState("");

  // Edit mode states
  const [uploadedFile, setUploadedFile] = useState(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [newText, setNewText] = useState("");
  const [editResponse, setEditResponse] = useState("");

  // --- Mode Selection ---
  const handleModeSelection = (selectedMode) => {
    setMode(selectedMode);
    setStatus("");
    setTopic("");
    setPptPreview([]);
    setUploadedFile(null);
    setSlideIndex(0);
    setNewText("");
    setEditResponse("");
  };

  // --- Generate PPT ---
  const handleGenerate = async (preview = false) => {
    if (!topic) return setStatus("Please enter a topic!");
    setStatus("Generating...");
    try {
      const result = await generatePPT(topic, preview);
      if (preview) {
        setPptPreview(result.slides || []);
        setStatus("Preview loaded ✅");
      } else {
        setStatus(result.message || "PPT downloaded ✅");
      }
    } catch (err) {
      console.error(err);
      setStatus("Error generating PPT ❌");
    }
  };

  // --- Edit Slide ---
  const handleEdit = async () => {
    if (!uploadedFile) return setEditResponse("Please upload a PPT first!");
    if (newText === "") return setEditResponse("Enter new text for the slide!");

    try {
      const result = await editSlide({
        slide_number: slideIndex,
        text: newText,
      });
      setEditResponse(result.message || "Slide updated ✅");
    } catch (err) {
      console.error(err);
      setEditResponse("Error updating slide ❌");
    }
  };

  // --- Download Edited PPT ---
  const handleDownloadEditedPPT = async () => {
    if (!uploadedFile) return setEditResponse("Upload a PPT first!");
    try {
      const formData = new FormData();
      formData.append("file", uploadedFile);

      const res = await fetch(`http://127.0.0.1:8000/edit/download/`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const fileUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = fileUrl;
      a.download = uploadedFile.name.replace(/[^a-z0-9]/gi, "_").toLowerCase();
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(fileUrl);
      setEditResponse("Edited PPT downloaded ✅");
    } catch (err) {
      console.error(err);
      setEditResponse("Error downloading edited PPT ❌");
    }
  };

  // --- Homepage ---
  if (!mode) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-bold mb-6 text-blue-600">PPT Chatbot</h1>
        <div className="flex gap-4">
          <button
            onClick={() => handleModeSelection("generate")}
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Generate PPT
          </button>
          <button
            onClick={() => handleModeSelection("edit")}
            className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Edit PPT
          </button>
        </div>
      </div>
    );
  }

  // --- Fullscreen Mode ---
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <button
        onClick={() => setMode(null)}
        className="mb-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Back
      </button>

      {/* --- Generate Mode --- */}
      {mode === "generate" && (
        <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-blue-600">Generate PPT</h2>
          <input
            type="text"
            placeholder="Enter topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="border p-2 rounded w-full mb-4"
          />
          <button
            onClick={() => handleGenerate(true)}
            className="mb-2 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 w-full"
          >
            Preview Slides
          </button>
          <button
            onClick={() => handleGenerate(false)}
            className="mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
          >
            Download PPT
          </button>

          {pptPreview.length > 0 && (
            <div className="mt-4 w-full">
              {pptPreview.map((slide, idx) => (
                <div key={idx} className="mb-2 p-2 border rounded">
                  <h3 className="font-bold">{slide.title}</h3>
                  <p>{slide.body}</p>
                </div>
              ))}
            </div>
          )}

          {status && <p className="mt-4 text-gray-700">{status}</p>}
        </div>
      )}

      {/* --- Edit Mode --- */}
      {mode === "edit" && (
        <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-green-600">Edit PPT</h2>
          <input
            type="file"
            accept=".pptx"
            onChange={(e) => setUploadedFile(e.target.files[0])}
            className="mb-2 w-full"
          />
          <input
            type="number"
            min="0"
            placeholder="Slide index"
            value={slideIndex}
            onChange={(e) => setSlideIndex(parseInt(e.target.value))}
            className="border p-2 rounded w-full mb-2"
          />
          <textarea
            placeholder="Enter new slide text..."
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            className="border p-2 rounded w-full mb-2 h-24"
          />
          <button
            onClick={handleEdit}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 w-full mb-2"
          >
            Update Slide
          </button>
          {uploadedFile && (
            <button
              onClick={handleDownloadEditedPPT}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
            >
              Download Edited PPT
            </button>
          )}
          {editResponse && <p className="mt-2 text-gray-700">{editResponse}</p>}
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
