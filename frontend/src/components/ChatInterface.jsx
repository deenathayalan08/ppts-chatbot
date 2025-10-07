import React, { useState } from "react";
import SlideEditor from "./SlideEditor";
import TemplateUploader from "./TemplateUploader";
import { generatePPT, uploadTemplate, editSlide } from "../utils/api";

const ChatInterface = () => {
  const [mode, setMode] = useState(null); // "generate" or "edit"
  const [fullscreen, setFullscreen] = useState(false);

  // --- Generate PPT state ---
  const [topic, setTopic] = useState("");
  const [numSlides, setNumSlides] = useState(3);
  const [templateFile, setTemplateFile] = useState(null);
  const [pptPreview, setPptPreview] = useState([]);
  const [status, setStatus] = useState("");

  // --- Edit PPT state ---
  const [uploadedFile, setUploadedFile] = useState(null);
  const [pptSlides, setPptSlides] = useState([]);
  const [editData, setEditData] = useState({ slideIndex: 0, title: "", body: "" });

  // --- Mode Selection ---
  const handleModeSelection = (selectedMode) => {
    setMode(selectedMode);
    setFullscreen(true);
    // Reset all states
    setTopic("");
    setNumSlides(3);
    setTemplateFile(null);
    setPptPreview([]);
    setStatus("");
    setUploadedFile(null);
    setPptSlides([]);
    setEditData({ slideIndex: 0, title: "", body: "" });
  };

  // --- Home Page ---
  if (!fullscreen) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-6">
        <h1 className="text-4xl font-bold text-blue-600">PPT Chatbot</h1>
        <div className="flex gap-4">
          <button
            onClick={() => handleModeSelection("generate")}
            className="px-8 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Generate PPT
          </button>
          <button
            onClick={() => handleModeSelection("edit")}
            className="px-8 py-3 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Edit PPT
          </button>
        </div>
      </div>
    );
  }

  // --- Fullscreen Pages ---
  return (
    <div className="fixed inset-0 bg-gray-100 p-6 overflow-auto flex flex-col items-center">
      <button
        onClick={() => setFullscreen(false)}
        className="mb-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 self-start"
      >
        Back
      </button>

      {/* --- Generate Mode --- */}
      {mode === "generate" && (
        <div className="w-full max-w-3xl flex flex-col items-center gap-4">
          <h2 className="text-2xl font-bold mb-4">Generate PPT</h2>

          <input
            type="text"
            placeholder="Enter topic..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          />

          <input
            type="number"
            min="1"
            placeholder="Number of slides"
            value={numSlides}
            onChange={(e) => setNumSlides(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          />

          <TemplateUploader file={templateFile} setFile={setTemplateFile} />

          <button
            onClick={async () => {
              if (!topic) {
                setStatus("Please enter a topic.");
                return;
              }
              setStatus("Generating...");
              try {
                const slides = await generatePPT(topic, true);
                setPptPreview(slides.slides || []);
                setStatus("Preview ready. You can now download.");
              } catch (err) {
                setStatus("Error generating PPT.");
              }
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mt-2"
          >
            Preview PPT
          </button>

          {pptPreview.length > 0 && (
            <div className="mt-4 w-full">
              <h3 className="font-semibold mb-2">Slide Preview:</h3>
              {pptPreview.map((slide, idx) => (
                <div key={idx} className="border p-2 mb-2 rounded bg-white">
                  <strong>{slide.title}</strong>
                  <p>{slide.body}</p>
                </div>
              ))}

              <button
                onClick={async () => {
                  try {
                    await generatePPT(topic, false);
                  } catch (err) {
                    setStatus("Error downloading PPT.");
                  }
                }}
                className="mt-2 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Download PPT
              </button>
            </div>
          )}

          <p className="mt-4 text-gray-700">{status}</p>
        </div>
      )}

      {/* --- Edit Mode --- */}
      {mode === "edit" && (
        <div className="w-full max-w-3xl flex flex-col items-center gap-4">
          <h2 className="text-2xl font-bold mb-4">Edit PPT</h2>
          <SlideEditor />
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
