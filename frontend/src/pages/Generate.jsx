import React, { useState } from "react";
import { generatePPT, uploadTemplate } from "../utils/api";

export default function Generate() {
  const [topic, setTopic] = useState("");
  const [numSlides, setNumSlides] = useState(5);
  const [uploadSample, setUploadSample] = useState(false);
  const [file, setFile] = useState(null);
  const [slides, setSlides] = useState([]);
  const [originalSlides, setOriginalSlides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadLink, setDownloadLink] = useState("");
  const [filename, setFilename] = useState("");
  const [activeSlide, setActiveSlide] = useState(null);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleGenerate = async () => {
    if (!topic.trim()) return alert("Please enter a topic.");

    setLoading(true);
    setSlides([]);
    setOriginalSlides([]);
    setDownloadLink("");
    setFilename("");
    setActiveSlide(null);

    try {
      if (uploadSample && file) await uploadTemplate(file);

      const previewData = await generatePPT(topic, numSlides, true);
      setSlides(previewData.slides || []);
      setOriginalSlides(previewData.slides || []);

      const pptFile = await generatePPT(topic, numSlides, false);
      if (pptFile?.file_url) setDownloadLink(pptFile.file_url);
      if (pptFile?.filename) setFilename(pptFile.filename);

    } catch (err) {
      console.error(err);
      alert("Error generating PPT.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!filename) return alert("No PPT generated yet!");

    try {
      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        await fetch(
          `http://127.0.0.1:8000/generate/update_slide?filename=${encodeURIComponent(
            filename
          )}&slide_number=${i + 1}&title=${encodeURIComponent(
            slide.title
          )}&text=${encodeURIComponent(slide.body)}`,
          { method: "POST" }
        );
      }
      alert("Slides updated successfully!");
      setDownloadLink(`http://127.0.0.1:8000/generated_files/${filename}`);
    } catch (err) {
      console.error(err);
      alert("Error updating slides.");
    }
  };

  const handleResetSlide = (index) => {
    const updated = [...slides];
    updated[index] = { ...originalSlides[index] };
    setSlides(updated);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-indigo-100 to-purple-200 p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-indigo-600">
          Generate Your PPT
        </h1>

        {/* Inputs */}
        <div className="space-y-4">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter your topic"
            className="w-full border p-2 rounded-md"
          />

          <input
            type="number"
            min="1"
            max="20"
            value={numSlides}
            onChange={(e) => setNumSlides(e.target.value)}
            className="w-full border p-2 rounded-md"
          />

          <div>
            <label>
              <input
                type="checkbox"
                checked={uploadSample}
                onChange={() => setUploadSample(!uploadSample)}
              />{" "}
              Upload Sample PPT
            </label>
            {uploadSample && (
              <input type="file" accept=".pptx" onChange={handleFileChange} />
            )}
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg"
          >
            {loading ? "Generating..." : "Generate PPT"}
          </button>
        </div>

        {/* Editable Slide Preview */}
        {slides.length > 0 && (
          <div className="mt-6 bg-gray-50 p-4 rounded-md border">
            <h2 className="text-xl font-bold mb-3">Editable Slide Preview</h2>
            {slides.map((slide, idx) => (
              <div
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`p-3 mb-3 bg-white rounded-md border cursor-pointer ${
                  activeSlide === idx ? "border-indigo-500 ring-2 ring-indigo-300" : "border-gray-200"
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-indigo-600">
                    Slide {idx + 1}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResetSlide(idx);
                    }}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Reset
                  </button>
                </div>

                <input
                  type="text"
                  value={slide.title}
                  onChange={(e) => {
                    const updated = [...slides];
                    updated[idx].title = e.target.value;
                    setSlides(updated);
                  }}
                  className="border p-1 rounded w-full mb-1"
                />

                <textarea
                  value={slide.body}
                  onChange={(e) => {
                    const updated = [...slides];
                    updated[idx].body = e.target.value;
                    setSlides(updated);
                  }}
                  className="border p-1 rounded w-full"
                  rows={3}
                />
              </div>
            ))}

            <button
              onClick={handleSaveChanges}
              className="mt-2 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Save Changes
            </button>
          </div>
        )}

        {/* Download link */}
        {downloadLink && (
          <div className="mt-6 text-center">
            <a
              href={downloadLink}
              download
              className="text-indigo-600 font-semibold hover:underline"
            >
              📥 Download Updated PPT
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
