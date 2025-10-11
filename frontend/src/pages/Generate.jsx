import React, { useState } from "react";
import { generatePPT, uploadTemplate } from "../utils/api";

export default function Generate() {
  const [topic, setTopic] = useState("");
  const [numSlides, setNumSlides] = useState(5);
  const [theme, setTheme] = useState("professional");
  const [uploadSample, setUploadSample] = useState(false);
  const [file, setFile] = useState(null);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadLink, setDownloadLink] = useState("");
  const [slideMedia, setSlideMedia] = useState({}); 

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSlideMediaChange = (slideNumber, file, type) => {
    setSlideMedia((prev) => ({
      ...prev,
      [slideNumber]: { file, type },
    }));
  };

  const handleGenerate = async () => {
    if (!topic.trim()) return alert("Please enter a topic.");

    setLoading(true);
    setSlides([]);
    setDownloadLink("");

    try {

      if (uploadSample && file) await uploadTemplate(file);

      const previewData = await generatePPT(topic, numSlides, true, theme);
      setSlides(previewData.slides || []);

      for (let i = 0; i < numSlides; i++) {
        if (slideMedia[i + 1]) {
          const formData = new FormData();
          formData.append("filename", `${topic.replace(/ /g, "_")}.pptx`);
          formData.append("slide_number", i + 1);
          formData.append("file", slideMedia[i + 1].file);
          formData.append("media_type", slideMedia[i + 1].type);

          await fetch("http://127.0.0.1:8000/add-media", {
            method: "POST",
            body: formData,
          });
        }
      }

      const pptFile = await generatePPT(topic, numSlides, false, theme);
      if (pptFile?.file_name) setDownloadLink(`/generated_files/${pptFile.file_name}`);

    } catch (err) {
      console.error(err);
      alert("Error generating PPT.");
    } finally {
      setLoading(false);
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

          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full border p-2 rounded-md"
          >
            <option value="professional">Professional</option>
            <option value="modern">Modern</option>
            <option value="minimal">Minimal</option>
            <option value="sunset">Sunset</option>
            <option value="forest">Forest</option>
          </select>

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

          {slides.map((slide, idx) => (
            <div key={idx} className="p-3 mb-3 bg-gray-50 rounded-md border">
              <p className="font-semibold text-indigo-600">Slide {idx + 1} Media:</p>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) =>
                  handleSlideMediaChange(
                    idx + 1,
                    e.target.files[0],
                    e.target.files[0].type.startsWith("video") ? "video" : "image"
                  )
                }
              />
            </div>
          ))}

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
            <h2 className="text-xl font-bold mb-3">Slide Preview</h2>
            {slides.map((slide, idx) => (
              <div key={idx} className="p-3 mb-3 bg-white rounded-md border">
                <h3 className="font-semibold text-indigo-600">{slide.title}</h3>
                <p className="text-gray-600">{slide.body}</p>
              </div>
            ))}
          </div>
        )}

        {downloadLink && (
          <div className="mt-6 text-center">
            <a
              href={downloadLink}
              download
              className="text-indigo-600 font-semibold hover:underline"
            >
              📥 Download PPT
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
