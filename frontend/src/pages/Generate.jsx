import React, { useState } from "react";
import { generatePPT, uploadTemplate, editSlide } from "../utils/api";

export default function Generate() {
  const [topic, setTopic] = useState("");
  const [numSlides, setNumSlides] = useState(5);
  const [uploadSample, setUploadSample] = useState(false);
  const [file, setFile] = useState(null);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadLink, setDownloadLink] = useState("");
  const [filename, setFilename] = useState("");

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleGenerate = async () => {
    if (!topic.trim()) return alert("Please enter a topic.");

    setLoading(true);
    setSlides([]);
    setDownloadLink("");
    setFilename("");

    try {
      if (uploadSample && file) {
        await uploadTemplate(file);
      }

      // Preview slides
      const previewData = await generatePPT(topic, numSlides, true);
      setSlides(previewData.slides || []);
      setFilename(previewData.filename || "generated.pptx");

      // Generate full PPT
      const pptFile = await generatePPT(topic, numSlides, false);
      if (pptFile?.file_url) setDownloadLink(pptFile.file_url);

    } catch (error) {
      console.error(error);
      alert("Error generating PPT.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    try {
      for (let i = 0; i < slides.length; i++) {
        await editSlide.update({
          slide_number: i + 1,
          text: slides[i].body,
          filename,
        });
      }
      alert("Slides updated successfully!");
    } catch (err) {
      alert("Error updating slides.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-indigo-100 to-purple-200 p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-indigo-600">
          Generate Your PPT
        </h1>

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
              />
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

        {slides.length > 0 && (
          <div className="mt-6 bg-gray-50 p-4 rounded-md border">
            <h2 className="text-xl font-bold mb-3">Editable Preview</h2>
            {slides.map((slide, idx) => (
              <div key={idx} className="p-3 mb-3 bg-white rounded-md border">
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

        {downloadLink && (
          <div className="mt-6 text-center">
            <a
              href={downloadLink}
              download
              className="text-indigo-600 font-semibold hover:underline"
            >
              📥 Download Generated PPT
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
