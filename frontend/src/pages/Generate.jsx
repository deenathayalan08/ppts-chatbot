import React, { useState } from "react";
import { generatePPT } from "../utils/api";

export default function Generate() {
  const [topic, setTopic] = useState("");
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic) return alert("Please enter a topic!");
    setLoading(true);

    // Preview slides
    const preview = await generatePPT(topic, true);
    setSlides(preview.slides || []);

    // Generate and download PPT
    const res = await fetch(`http://127.0.0.1:8000/generate/generate/?topic=${topic}&preview=false`, {
      method: "POST",
    });

    if (res.ok) {
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${topic}.pptx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white p-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Generate Your PPT</h2>
      <div className="flex flex-col items-center">
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="p-3 w-1/2 rounded-lg text-black mb-4"
          placeholder="Enter your topic..."
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-semibold"
        >
          {loading ? "Generating..." : "Generate PPT"}
        </button>
      </div>

      <div className="mt-10 mx-auto max-w-3xl bg-gray-800 p-6 rounded-2xl shadow-lg">
        <h3 className="text-2xl font-semibold mb-4 text-center">Slide Preview</h3>
        {slides.length === 0 ? (
          <p className="text-gray-400 text-center">No slides yet.</p>
        ) : (
          <ul className="space-y-4">
            {slides.map((s, i) => (
              <li key={i} className="bg-gray-700 p-4 rounded-lg">
                <h4 className="text-xl font-bold">{s.title}</h4>
                <p className="text-gray-300 mt-2">{s.body}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
